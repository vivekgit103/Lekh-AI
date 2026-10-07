import { z } from 'zod';

export const RiskSchema = z.object({
  level: z.enum(['LOW', 'MEDIUM', 'HIGH']).or(z.string()).transform((val) => {
    const upper = String(val).toUpperCase();
    if (upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') return upper;
    return 'LOW';
  }),
  reason: z.string().nullable().optional().default(''),
});

export const DeadlineSchema = z.object({
  title: z.string().nullable().optional().default(''),
  date: z.string().nullable().optional().default(''),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).or(z.string()).transform((val) => {
    const upper = String(val).toUpperCase();
    if (upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') return upper;
    return 'LOW';
  }),
});

export const AmountItemSchema = z.object({
  label: z.string().nullable().optional().default('Amount'),
  value: z.number().or(z.string()).nullable().optional().default(0),
  currency: z.string().nullable().optional().default('INR'),
});

export const DateItemSchema = z.object({
  label: z.string().nullable().optional().default('Date'),
  value: z.string().nullable().optional().default(''),
});

export const ActionItemSchema = z.object({
  step: z.number().nullable().optional(),
  title: z.string().nullable().optional().default('Review Document'),
  description: z.string().nullable().optional().default(''),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).or(z.string()).transform((val) => {
    const upper = String(val).toUpperCase();
    if (upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') return upper;
    return 'LOW';
  }),
});

export const ValidationResultSchema = z.object({
  rule: z.string(),
  passed: z.boolean(),
  severity: z.enum(['INFO', 'WARNING', 'ERROR']).default('INFO'),
  message: z.string().default(''),
  details: z.any().optional(),
});

export const DocumentAnalysisSchema = z.object({
  documentType: z.string().nullable().optional().default('General Document'),
  documentTitle: z.string().nullable().optional().default('Untitled Document'),
  issuer: z.string().nullable().optional().default('Unknown Issuer'),
  language: z.string().nullable().optional().default('en'),
  summary: z.string().nullable().optional().default(''),
  keyFields: z.record(z.any()).nullable().optional().default({}),
  amounts: z.array(z.any()).nullable().optional().default([]),
  dates: z.array(z.any()).nullable().optional().default([]),
  deadlines: z.array(z.any()).nullable().optional().default([]),
  risks: z.array(z.any()).nullable().optional().default([]),
  actions: z.array(z.any()).nullable().optional().default([]),
  explanation: z.string().nullable().optional().default(''),
  validationResults: z.array(ValidationResultSchema).optional().default([]),
});
