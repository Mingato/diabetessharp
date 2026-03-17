export type CognitiveProfile =
  | "memory_loss"
  | "brain_fog"
  | "alzheimers_prevention"
  | "post_stroke_recovery"
  | "other";

export type SymptomSeverity =
  | "occasional"
  | "frequent"
  | "noticeable"
  | "diagnosed";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type UpsellKey = "upsell1" | "upsell2" | "upsell3";

export interface QuizInput {
  age: number;
  primaryConcern: CognitiveProfile;
  symptomSeverity: SymptomSeverity;
  familyHistory: boolean;
  currentHabits: string;
  motivationLevel: string;
}

export interface QuizResult {
  sessionId: string;
  cognitiveRiskScore: number;
  personalizedMessage: string;
  recommendedProgram: string;
}

export type ExerciseType =
  | "working_memory"
  | "long_term_memory"
  | "processing_speed"
  | "attention_focus"
  | "executive_function"
  | "verbal_memory"
  | "spatial_memory";
