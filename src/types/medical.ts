export type CKDStage = 1 | 2 | 3 | 4 | 5

export interface KidneyMetrics {
  eGFR: number
  creatinine: number
  bun?: number
  proteinuria: number
  bloodPressure: BloodPressure
  stage: CKDStage
  progression: ProgressionData
  lastUpdated: string
}

export interface BloodPressure {
  systolic: number
  diastolic: number
}

export interface ProgressionData {
  trend: 'improving' | 'stable' | 'declining'
  rateOfChange: number
  predictedStage: CKDStage
  timeToNextStage?: number
  riskFactors: RiskFactor[]
}

export interface RiskFactor {
  name: string
  severity: 'low' | 'medium' | 'high'
  impact: number
  modifiable: boolean
}

export interface TreatmentScenario {
  id: string
  name: string
  description: string
  interventions: Intervention[]
  predictedOutcome: PredictedOutcome
}

export interface Intervention {
  type: 'medication' | 'lifestyle' | 'procedure'
  name: string
  description: string
  dosage?: string
  frequency?: string
}

export interface PredictedOutcome {
  eGFRChange: number
  stageProgression: number
  timeframe: number
  confidence: number
}

export interface AlertData {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  acknowledged: boolean
  patientId: string
}