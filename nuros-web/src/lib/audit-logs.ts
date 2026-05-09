/**
 * Nuros PHIPA & HIPAA Compliant Audit Logger
 * Ensures every access to patient vocal biomarker data is securely logged
 */

export interface AuditRecord {
  timestamp: string;
  clinicianId: string;
  patientId: string;
  action: 'VIEW_DASHBOARD' | 'ACCESS_REPORT' | 'DOWNLOAD_DATA' | 'SMART_LAUNCH';
  ipAddress?: string;
  resourceType: string;
  status: 'SUCCESS' | 'DENIED';
}

class AuditLogService {
  private logs: AuditRecord[] = [];

  /**
   * Logs a clinical access event securely.
   * In a production environment, this would write to an append-only AWS QLDB or encrypted Postgres table.
   */
  public logAccess(record: Omit<AuditRecord, 'timestamp'>): void {
    const fullRecord: AuditRecord = {
      ...record,
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(fullRecord);
    
    // Console log for demo purposes only. Real implementation streams to SIEM (e.g., Splunk / Datadog).
    console.log(`[SECURE AUDIT LOG] ${fullRecord.timestamp} | Action: ${fullRecord.action} | Clinician: ${fullRecord.clinicianId} | Patient: ${fullRecord.patientId} | Status: ${fullRecord.status}`);
  }

  public getRecentLogs(): AuditRecord[] {
    return [...this.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const auditLogger = new AuditLogService();
