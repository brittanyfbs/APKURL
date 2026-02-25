
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export type ScanType = 'URL' | 'APK';

export interface ScanResult {
  id: string;
  name: string;
  type: ScanType;
  riskLevel: RiskLevel;
  timestamp: string;
  explanation: string;
  detectedIssues: string[];
}

export interface Stats {
  totalScans: number;
  highRiskCount: number;
  lastScanTime: string;
}
