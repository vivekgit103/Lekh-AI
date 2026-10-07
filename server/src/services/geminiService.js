import { getGeminiModel, isGeminiConfigured } from '../config/gemini.js';
import { DocumentAnalysisSchema } from '../models/schemas.js';
import { SAMPLE_DOCUMENTS } from './sampleDocuments.js';

const SYSTEM_PROMPT = `
You are DocuSaathi, an elite AI document analysis specialist designed to assist individuals and small businesses with tax notices, GST invoices, bank letters, rent agreements, bills, and legal paperwork.

Analyze the provided document thoroughly and extract structured information in strictly valid JSON format.

CRITICAL INSTRUCTIONS:
1. Classify the document accurately into documentType (e.g., "Tax Notice", "Tax Invoice (GST)", "Bank Letter", "Rental Agreement", "Utility Bill", "Legal Notice", "Insurance Policy", "Contract").
2. Document title should be clear, professional, and specific.
3. Issuer should be the exact authority, company, or individual issuing or originating the document.
4. Summary: 2-3 sentences in simple, plain language explaining what this document is and why it matters to the recipient.
5. keyFields: A key-value dictionary of essential identifiers (e.g., PAN, GSTIN, Invoice Number, Notice Reference, Property Address, Account Number).
6. amounts: Array of extracted monetary values. Each item must have: { "label": string, "value": number, "currency": "INR" | "USD" | etc }.
7. dates: Array of all mentioned dates with labels: { "label": string, "value": "YYYY-MM-DD" or standard date string }.
8. deadlines: Array of critical time-sensitive obligations: { "title": string, "date": "YYYY-MM-DD", "priority": "LOW" | "MEDIUM" | "HIGH" }.
9. risks: Array of potential penalties, risks, legal consequences, or traps: { "level": "LOW" | "MEDIUM" | "HIGH", "reason": string }.
10. actions: Array of ordered step-by-step next actions: { "step": number, "title": string, "description": string, "urgency": "LOW" | "MEDIUM" | "HIGH" }.
11. explanation: Plain-language explanation of what happened, what rights/obligations exist, and what the user should know.

OUTPUT FORMAT:
Return ONLY pure JSON without markdown backticks or commentary.
`;

export async function analyzeDocumentWithGemini(fileBuffer, mimeType, originalName) {
  // If Gemini is not configured, use intelligent sample fallback
  if (!isGeminiConfigured) {
    console.log(`ℹ️ Gemini not configured. Simulating intelligent document analysis for: ${originalName}`);
    return getIntelligentFallback(originalName);
  }

  try {
    const model = getGeminiModel('gemini-1.5-flash');
    if (!model) {
      return getIntelligentFallback(originalName);
    }

    const filePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const prompt = `${SYSTEM_PROMPT}\n\nDocument File Name: ${originalName}\nPlease inspect the document content and return the structured JSON.`;

    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text();

    // Clean JSON response (strip markdown fences if present)
    const cleanedText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsedJson = JSON.parse(cleanedText);
    const validatedData = DocumentAnalysisSchema.parse(parsedJson);

    return {
      ...validatedData,
      isAiGenerated: true,
    };
  } catch (err) {
    console.warn(`⚠️ Gemini API call failed (${err.message}). Falling back to intelligent demo document parser.`);
    return getIntelligentFallback(originalName);
  }
}

export async function chatWithDocumentGemini(documentData, chatHistory, userQuestion) {
  if (!isGeminiConfigured) {
    return generateDemoChatResponse(documentData, userQuestion);
  }

  try {
    const model = getGeminiModel('gemini-1.5-flash');
    if (!model) {
      return generateDemoChatResponse(documentData, userQuestion);
    }

    const contextPrompt = `
You are DocuSaathi's interactive document assistant.
Here is the analyzed document context:
- Document Type: ${documentData.document_type || documentData.documentType}
- Title: ${documentData.document_title || documentData.documentTitle}
- Issuer: ${documentData.issuer}
- Summary: ${documentData.summary}
- Key Fields: ${JSON.stringify(documentData.key_fields || documentData.keyFields)}
- Amounts: ${JSON.stringify(documentData.amounts)}
- Deadlines: ${JSON.stringify(documentData.deadlines)}
- Risks: ${JSON.stringify(documentData.risks)}
- Actions: ${JSON.stringify(documentData.actions)}
- Explanation: ${documentData.explanation}

Answer the user's question accurately, concisely, and helpfully based strictly on this document context. If information is not in the document, mention that clearly. Be encouraging and provide practical advice for the Indian context where appropriate.
`;

    const messages = (chatHistory || []).map((msg) => `${msg.role}: ${msg.message}`).join('\n');
    const finalPrompt = `${contextPrompt}\n\nChat History:\n${messages}\n\nUser Question: ${userQuestion}\nAssistant:`;

    const result = await model.generateContent(finalPrompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn(`Chat Gemini error: ${err.message}. Using demo chat response.`);
    return generateDemoChatResponse(documentData, userQuestion);
  }
}

function getIntelligentFallback(filename = '') {
  const lower = filename.toLowerCase();
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
    // Default to realistic tax notice sample
    base = SAMPLE_DOCUMENTS.tax_notice;
  }

  return {
    ...base,
    isDemoFallback: true,
  };
}

function generateDemoChatResponse(doc, question) {
  const q = question.toLowerCase();
  const title = doc.document_title || doc.documentTitle || 'this document';
  const issuer = doc.issuer || 'the issuer';

  if (q.includes('deadline') || q.includes('when') || q.includes('due') || q.includes('date')) {
    const deadlines = doc.deadlines || [];
    if (deadlines.length > 0) {
      return `Based on ${title}, your nearest critical deadline is **${deadlines[0].title}** due on **${deadlines[0].date}** with priority level **${deadlines[0].priority}**. Be sure not to delay to avoid penalties!`;
    }
    return `According to ${title}, there are no immediate penalty deadlines listed, but standard compliance timelines apply.`;
  }

  if (q.includes('amount') || q.includes('pay') || q.includes('cost') || q.includes('tax') || q.includes('money')) {
    const amounts = doc.amounts || [];
    if (amounts.length > 0) {
      const summaryAmts = amounts.map((a) => `${a.label}: ₹${Number(a.value).toLocaleString('en-IN')}`).join(', ');
      return `Here are the monetary details extracted from ${title}:\n\n${summaryAmts}.`;
    }
    return `There are no specific payment amounts detected in ${title}.`;
  }

  if (q.includes('risk') || q.includes('penalty') || q.includes('fine') || q.includes('consequence')) {
    const risks = doc.risks || [];
    if (risks.length > 0) {
      return `Key risks detected:\n\n${risks.map((r, i) => `${i + 1}. [${r.level}] ${r.reason}`).join('\n')}`;
    }
    return `This document carries a LOW risk profile. No severe legal notices or penalty clauses were triggered.`;
  }

  if (q.includes('action') || q.includes('what should i do') || q.includes('next') || q.includes('steps')) {
    const actions = doc.actions || [];
    if (actions.length > 0) {
      return `Here is your recommended action plan:\n\n` +
        actions.map((a, i) => `${i + 1}. **${a.title || a}**: ${a.description || ''}`).join('\n');
    }
    return `You should review the document details and archive a copy for your records.`;
  }

  return `Regarding "${question}" in ${title} issued by ${issuer}: The document summary indicates: "${doc.summary}". Please follow the generated action plan to stay compliant and address any pending deadlines!`;
}
