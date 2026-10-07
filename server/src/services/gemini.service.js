import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { SAMPLE_DOCUMENTS } from './sampleDocuments.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const isGeminiConfigured = Boolean(
  apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_gemini')
);

const genAI = isGeminiConfigured ? new GoogleGenerativeAI(apiKey.trim()) : null;

const SYSTEM_INSTRUCTION = `
You are DocuSaathi, an intelligent document processing assistant.

Analyze the uploaded document carefully.

Determine:
- document type (e.g. "Electricity Bill", "Water Bill", "Utility Bill", "Tax Invoice (GST)", "Tax Notice", "Bank Sanction Letter", "Rental Agreement", "Employment Agreement")
- title
- issuer (provider, seller, or authority)
- document date
- invoice/reference number (e.g., invoice number, consumer/account number, meter number, notice reference)
- customer/vendor details when present (consumer name, buyer name, address)
- subtotal
- tax/GST
- total amount
- due date
- payment status (e.g. "PAID", "UNPAID", "DUE", "OVERDUE", or null)
- important dates
- risks (level: LOW, MEDIUM, or HIGH with clear reason)
- missing information
- recommended actions (sequential steps with title, description, and urgency)
- plain-language explanation of rights, obligations, and financial implications

BILL & INVOICE SPECIFIC INSTRUCTIONS:
- For an electricity/utility bill, extract into keyFields:
  * "Consumer / Account Number"
  * "Customer / Consumer Name"
  * "Billing Period"
  * "Bill Date"
  * "Due Date"
  * "Previous Reading"
  * "Current Reading"
  * "Units Consumed"
  * "Energy Charges"
  * "Taxes / Duties"
  * "Payment Status"
  * "Meter Number" (if present)
- For an invoice, extract into keyFields:
  * "Invoice Number"
  * "Invoice Date"
  * "Seller / Vendor Name"
  * "Buyer / Customer Name"
  * "GSTIN / Tax ID"
  * "Line Items Summary"
  * "Payment Status"
  * "Due Date"
- Extract distinct amounts into the amounts array with label, numeric value, and currency (default 'INR'). Include Subtotal, Tax/GST, and Total/Net Payable where visible.

CRITICAL ACCURACY RULES:
- Do NOT invent or fabricate values.
- If a value is not visible, return null or omit it.
- Read the actual content of the uploaded document.
- Return ONLY valid JSON matching the exact schema below.

REQUIRED OUTPUT JSON FORMAT:
{
  "documentType": "string",
  "documentTitle": "string",
  "issuer": "string",
  "language": "string (e.g. 'en', 'hi')",
  "summary": "string (clear 2-4 sentences explaining what this document is)",
  "keyFields": { "Field Name": "Value" },
  "amounts": [
    { "label": "string", "value": 12345.00, "currency": "INR" }
  ],
  "dates": [
    { "label": "string", "value": "YYYY-MM-DD" }
  ],
  "deadlines": [
    { "title": "string", "date": "YYYY-MM-DD", "priority": "LOW | MEDIUM | HIGH" }
  ],
  "risks": [
    { "level": "LOW | MEDIUM | HIGH", "reason": "string" }
  ],
  "actions": [
    { "step": 1, "title": "string", "description": "string", "urgency": "LOW | MEDIUM | HIGH" }
  ],
  "explanation": "string (plain-language explanation of legal/financial rights, obligations, and implications)"
}

Return ONLY raw valid JSON without markdown code fences or conversational text.
`;

/**
 * Attempts to repair common JSON defects from LLM responses
 */
function repairJsonString(raw) {
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Find boundaries of outer JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  return cleaned;
}

export async function generateDocumentAnalysis({ fileBuffer, mimeType, fileName }) {
  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey || currentApiKey.trim().length === 0 || currentApiKey.includes('your_gemini')) {
    throw new Error('Gemini API key is missing. Please configure GEMINI_API_KEY in server/.env to enable live AI document analysis.');
  }

  // Normalize mime type for Gemini SDK
  let cleanMimeType = (mimeType || 'image/jpeg').toLowerCase();
  if (cleanMimeType === 'image/jpg') cleanMimeType = 'image/jpeg';

  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(cleanMimeType)) {
    throw new Error(`Unsupported file type: ${cleanMimeType}. Only PDF, JPG, and PNG documents are supported.`);
  }

  try {
    const aiClient = new GoogleGenerativeAI(currentApiKey.trim());
    const model = aiClient.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    // Pass actual binary content via base64 inlineData
    const filePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: cleanMimeType,
      },
    };

    const prompt = `${SYSTEM_INSTRUCTION}\n\nDocument File Name: "${fileName}"\nPlease analyze the content of this uploaded document and return strictly the structured JSON.`;

    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text();

    if (!responseText || responseText.trim().length === 0) {
      throw new Error('Gemini returned an empty response. The document could not be analyzed.');
    }

    const repaired = repairJsonString(responseText);
    let parsed;
    try {
      parsed = JSON.parse(repaired);
    } catch (parseErr) {
      console.error('[Diagnostic] Invalid JSON returned by Gemini:', responseText.substring(0, 300));
      throw new Error(`Invalid AI response: Failed to parse Gemini response as JSON (${parseErr.message})`);
    }

    return parsed;
  } catch (err) {
    console.error(`[Diagnostic] Gemini analysis error: ${err.message}`);
    // If it's already an explicit validation error, re-throw as is
    if (
      err.message.startsWith('Gemini API key') ||
      err.message.startsWith('Unsupported file type') ||
      err.message.startsWith('Invalid AI response') ||
      err.message.startsWith('Gemini returned an empty')
    ) {
      throw err;
    }
    throw new Error(`Gemini analysis failed: ${err.message}`);
  }
}

export async function askDocumentQuestion({ documentData, chatHistory, question }) {
  if (!isGeminiConfigured || !genAI) {
    return generateFallbackChatAnswer(documentData, question);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    const context = `
You are DocuSaathi's interactive document assistant.
Here is the analyzed document:
Document Type: ${documentData.document_type || documentData.documentType}
Title: ${documentData.document_title || documentData.documentTitle}
Issuer: ${documentData.issuer}
Summary: ${documentData.summary}
Key Fields: ${JSON.stringify(documentData.key_fields || documentData.keyFields)}
Amounts: ${JSON.stringify(documentData.amounts)}
Deadlines: ${JSON.stringify(documentData.deadlines)}
Risks: ${JSON.stringify(documentData.risks)}
Actions: ${JSON.stringify(documentData.actions)}
Explanation: ${documentData.explanation}

CRITICAL RULES:
1. You must answer based ONLY on the provided document context above.
2. If the user asks for information that is not available or mentioned in the document, you MUST explicitly state: "I couldn't find that information in this document."
3. Keep answers concise, objective, and action-oriented.
4. Disclaimer: Provide informational guidance without presenting as formal legal, tax, financial or medical advice.
`;

    const historyFormatted = (chatHistory || [])
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.message}`)
      .join('\n');

    const prompt = `${context}\n\nChat History:\n${historyFormatted}\n\nUser Question: ${question}\nAssistant:`;
    const res = await model.generateContent(prompt);
    return res.response.text().trim();
  } catch (err) {
    return generateFallbackChatAnswer(documentData, question);
  }
}

function getFallbackAnalysis(fileName = '') {
  const lower = fileName.toLowerCase();
  let base;
  if (lower.includes('tax') || lower.includes('itr') || lower.includes('notice') || lower.includes('143')) {
    base = SAMPLE_DOCUMENTS.tax_notice;
  } else if (lower.includes('gst') || lower.includes('invoice') || lower.includes('bill')) {
    base = SAMPLE_DOCUMENTS.gst_invoice;
  } else if (lower.includes('bank') || lower.includes('loan') || lower.includes('sbi') || lower.includes('hdfc')) {
    base = SAMPLE_DOCUMENTS.bank_letter;
  } else if (lower.includes('rent') || lower.includes('lease') || lower.includes('agreement')) {
    base = SAMPLE_DOCUMENTS.rent_agreement;
  } else {
    base = SAMPLE_DOCUMENTS.tax_notice;
  }

  return {
    ...base,
    isDemoFallback: true,
  };
}

function generateFallbackChatAnswer(doc, question) {
  const q = question.toLowerCase();
  const title = doc.document_title || doc.documentTitle || 'the document';
  const issuer = doc.issuer || 'the issuer';

  // 1. What is this document about?
  if (q.includes('about') || q.includes('what is this document') || q.includes('overview')) {
    return `**${title}** is a ${doc.document_type || doc.documentType} issued by **${issuer}**.\n\n${doc.summary || ''}`;
  }

  // 2. How much do I need to pay?
  if (q.includes('how much') || q.includes('amount') || q.includes('pay') || q.includes('cost') || q.includes('fee')) {
    const amounts = doc.amounts || [];
    if (amounts.length > 0) {
      return `Here are the extracted amounts for **${title}**:\n` +
        amounts.map((a) => `- **${a.label}**: ₹${Number(a.value).toLocaleString('en-IN')} (${a.currency || 'INR'})`).join('\n');
    }
    return `I couldn't find any payable amounts or monetary balances in this document.`;
  }

  // 3. What is the deadline?
  if (q.includes('deadline') || q.includes('when') || q.includes('due') || q.includes('date')) {
    const deadlines = doc.deadlines || [];
    if (deadlines.length > 0) {
      return `Key deadlines identified in **${title}**:\n` +
        deadlines.map((d) => `- **${d.title}**: ${d.date} [Status: ${d.status || 'UPCOMING'}, Priority: ${d.priority || 'MEDIUM'}]`).join('\n');
    }
    return `I couldn't find that information in this document. No specific deadlines are mentioned.`;
  }

  // 4. What should I do next?
  if (q.includes('what should i do') || q.includes('next') || q.includes('action') || q.includes('step')) {
    const actions = doc.actions || [];
    if (actions.length > 0) {
      return `Recommended action plan for **${title}**:\n` +
        actions.map((a, i) => `${i + 1}. **${a.title || a}**: ${a.description || ''} [${a.urgency || 'MEDIUM'}]`).join('\n');
    }
    return `Review the document and file a digital copy for your records.`;
  }

  // 5. Explain this in simple language.
  if (q.includes('simple') || q.includes('explain') || q.includes('plain language') || q.includes('easy')) {
    if (doc.explanation) {
      return `**Plain-Language Explanation:**\n\n${doc.explanation}`;
    }
    return doc.summary || `This is a ${doc.document_type || doc.documentType} from ${issuer}.`;
  }

  // 6. Risks
  if (q.includes('risk') || q.includes('penalty') || q.includes('fine') || q.includes('legal')) {
    const risks = doc.risks || [];
    if (risks.length > 0) {
      return `Potential risks flagged:\n` +
        risks.map((r, i) => `${i + 1}. [${r.level}] ${r.reason}`).join('\n');
    }
    return `No high or medium risks were flagged in this document.`;
  }

  // Fallback when information is genuinely absent
  if (q.includes('medical') || q.includes('doctor') || q.includes('passport') || q.includes('driving license')) {
    return "I couldn't find that information in this document.";
  }

  return `Regarding "${question}" in ${title}: ${doc.summary || "I couldn't find that information in this document."}`;
}
