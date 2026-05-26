/**
 * Nuros PII De-Identification Pipeline Middleware
 * Strips Personally Identifiable Information (PII) before sending to AI analysis engines
 */

export interface PatientDataPayload {
  clinicId: string;
  patientId: string;
  rawText?: string;
  rawAudioMetadata?: any;
}

export interface MaskedPayload {
  clinicPatientId: string;
  maskedText?: string;
  clearedForAI: boolean;
  timestamp: string;
}

/**
 * Basic RegEx-based de-identification strategy for demonstration
 * In a real clinical environment, this would use a robust NLP engine (e.g., AWS Comprehend Medical)
 */
export function maskPII(text: string): string {
  let masked = text;
  
  // Mask potential names (very basic heuristic for demo: capitalized words not at start of sentence)
  masked = masked.replace(/(?<!^|\.\s)[A-Z][a-z]+/g, '[REDACTED_NAME]');
  
  // Mask potential phone numbers
  masked = masked.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED_PHONE]');
  
  // Mask potential dates (DOB)
  masked = masked.replace(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/g, '[REDACTED_DATE]');
  
  return masked;
}

/**
 * Transforms a raw patient payload into an anonymized AI-ready payload
 */
export function preparePayloadForAI(data: PatientDataPayload): MaskedPayload {
  // Generate a composite, non-reversible (in theory) identifier or simply a UUID mapping
  // For demo, we just combine them. In production, this is a hashed token.
  const secureId = `ANON-${data.clinicId}-${data.patientId}`;

  return {
    clinicPatientId: secureId,
    maskedText: data.rawText ? maskPII(data.rawText) : undefined,
    clearedForAI: true,
    timestamp: new Date().toISOString()
  };
}
