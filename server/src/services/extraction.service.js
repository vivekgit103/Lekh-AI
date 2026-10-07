import { generateDocumentAnalysis } from './gemini.service.js';
import {
  runDeterministicValidation,
  normalizeDeadlines,
  normalizeRisks,
  normalizeActions,
} from './validation.service.js';
import { DocumentAnalysisSchema } from '../models/schemas.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { documentService } from './documentService.js';

export async function processDocumentPipeline({ fileBuffer, mimeType, fileName, userId }) {
  // 1. Send to Gemini multimodal model & retrieve structured JSON
  const rawAnalysis = await generateDocumentAnalysis({ fileBuffer, mimeType, fileName });

  // 2. Validate and sanitize with Zod schema
  const parsed = DocumentAnalysisSchema.parse(rawAnalysis);

  // 3. Normalize structured fields
  const normalizedKeyFields = parsed.keyFields && typeof parsed.keyFields === 'object' ? parsed.keyFields : {};
  const normalizedAmounts = Array.isArray(parsed.amounts) ? parsed.amounts : [];
  const normalizedDates = Array.isArray(parsed.dates) ? parsed.dates : [];

  // Normalize deadlines: { title, date, priority, status: 'UPCOMING' | 'OVERDUE' | 'COMPLETED' }
  const normalizedDeadlines = normalizeDeadlines(parsed.deadlines || []);

  const candidateDoc = {
    documentType: parsed.documentType || 'General Document',
    documentTitle: parsed.documentTitle || fileName,
    issuer: parsed.issuer || 'Unknown Issuer',
    language: parsed.language || 'en',
    summary: parsed.summary || '',
    keyFields: normalizedKeyFields,
    amounts: normalizedAmounts,
    dates: normalizedDates,
    deadlines: normalizedDeadlines,
    explanation: parsed.explanation || '',
  };

  // 4. Run deterministic validation engine
  const validationResults = runDeterministicValidation(candidateDoc);

  // 5. Compute objective risk normalization
  const { finalLevel, risks: normalizedRisks } = normalizeRisks(
    parsed.risks || [],
    validationResults,
    normalizedDeadlines
  );

  // 6. Normalize actions to be concise & actionable
  const normalizedActions = normalizeActions(
    parsed.actions || [],
    normalizedDeadlines,
    validationResults
  );

  // 7. Persist to Supabase documents table
  const dbPayload = {
    user_id: userId,
    original_file_name: fileName,
    file_type: mimeType,
    document_type: candidateDoc.documentType,
    document_title: candidateDoc.documentTitle,
    issuer: candidateDoc.issuer,
    language: candidateDoc.language,
    summary: candidateDoc.summary,
    key_fields: candidateDoc.keyFields,
    amounts: candidateDoc.amounts,
    dates: candidateDoc.dates,
    deadlines: normalizedDeadlines,
    risks: normalizedRisks,
    actions: normalizedActions,
    explanation: candidateDoc.explanation,
    validation_results: validationResults,
    processing_status: 'completed',
    updated_at: new Date().toISOString(),
  };

  let savedRecord = null;

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('documents')
        .insert([dbPayload])
        .select()
        .single();

      if (!error && data) {
        savedRecord = data;
        console.log('[Diagnostic] Supabase save completed');
      } else {
        console.warn('[Diagnostic] Supabase save note:', error?.message);
      }
    } catch (dbErr) {
      console.warn('[Diagnostic] Supabase save error:', dbErr.message);
    }
  }

  // Fallback to in-memory store if DB write skipped/errored
  if (!savedRecord) {
    savedRecord = await documentService.processAndSaveDocument({
      userId,
      originalFileName: fileName,
      fileType: mimeType,
      rawAnalysis: {
        ...candidateDoc,
        deadlines: normalizedDeadlines,
        risks: normalizedRisks,
        actions: normalizedActions,
        validation_results: validationResults,
      },
    });
    console.log('[Diagnostic] Supabase save completed (local memory fallback)');
  }

  // 8. Return normalized JSON response
  return {
    id: savedRecord.id,
    documentType: candidateDoc.documentType,
    documentTitle: candidateDoc.documentTitle,
    issuer: candidateDoc.issuer,
    language: candidateDoc.language,
    summary: candidateDoc.summary,
    keyFields: candidateDoc.keyFields,
    amounts: candidateDoc.amounts,
    dates: candidateDoc.dates,
    deadlines: normalizedDeadlines,
    risks: normalizedRisks,
    actions: normalizedActions,
    explanation: candidateDoc.explanation,
    validationResults,
    overallRisk: finalLevel,
    rawRecord: savedRecord,
  };
}
