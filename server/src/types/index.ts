import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'lawyer' | 'admin';
  googleId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILawyer extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  specializations: string[];
  experience: number;
  rating: number;
  totalRatings: number;
  consultationFee: number;
  bio: string;
  education?: string;
  barCouncilId?: string;
  location: string;
  languages?: string[];
  verified: 'pending' | 'approved' | 'rejected';
  verificationDocs?: { filename: string; path: string; uploadedAt: Date }[];
  availability: {
    [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: {
      available: boolean;
      slots: string[];
    }
  };
  avatar?: string;
  casesHandled: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ILegalSection {
  number: string;
  title: string;
  description: string;
  keywords: string[];
  penalty?: string;
}

export interface ILegalAct extends Document {
  title: string;
  shortTitle: string;
  category: 'Criminal' | 'Civil' | 'Family' | 'Corporate' | 'Labour' | 'Consumer' | 'Tax' | 'IP' | 'Constitutional' | 'Property' | 'Traffic' | 'Banking' | 'Environment' | 'Arbitration';
  year: number;
  description: string;
  sections: ILegalSection[];
  keywords: string[];
  isActive: boolean;
  embeddingVector?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IChatHistory extends Document {
  userId: Types.ObjectId;
  title: string;
  caseType?: string;
  messages: IChatMessage[];
  suggestedLaws?: {
    act: string;
    section: string;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIStatus {
  available: boolean;
  model: string | null;
  mode: 'rag-gpt4o-mini' | 'keyword-fallback';
  features: {
    rag: boolean;
    lawDatabase: boolean;
    structuredJSON: boolean;
  };
}

export interface IAIResponse {
  caseType: string;
  summary: string;
  relevantLaws: {
    act: string;
    section: string;
    description: string;
  }[];
  explanation: string;
  recommendations: string;
  lawyerType: string;
  complexity: string;
  estimatedTimeline: string;
  legalDBSources: string[];
}

export interface IAppointment extends Document {
  userId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  caseType?: string;
  description?: string;
  notes?: string;
  fee: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIResult {
  success: boolean;
  data: IAIResponse;
  raw: string;
  model: string;
  tokensUsed?: number;
  isRAG: boolean;
  isFallback?: boolean;
}
