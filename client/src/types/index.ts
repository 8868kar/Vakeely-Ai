export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'lawyer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface ILawyer extends IUser {
  specializations: string[];
  experience: number;
  rating: number;
  totalRatings: number;
  consultationFee: number;
  bio: string;
  education: string;
  barCouncilId: string;
  location: string;
  languages: string[];
  verified: 'pending' | 'approved' | 'rejected';
}

export interface ILegalSection {
  number: string;
  title: string;
  description: string;
  keywords: string[];
  penalty?: string;
}

export interface ILegalAct {
  _id: string;
  title: string;
  shortTitle: string;
  category: string;
  year: number;
  description: string;
  keywords: string[];
  sections: ILegalSection[];
}

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  // UI-only properties
  parsed?: IAIResponse;
  isRAG?: boolean;
  model?: string;
  isFallback?: boolean;
}

export interface IChat {
  _id: string;
  userId: string;
  title: string;
  messages: IChatMessage[];
  caseType?: string;
  suggestedLaws?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAIResponse {
  caseType?: string;
  summary?: string;
  explanation?: string;
  relevantLaws?: Array<{
    act: string;
    section: string;
    description: string;
  }>;
  recommendations?: string;
  lawyerType?: string;
  complexity?: string;
  estimatedTimeline?: string;
  legalDBSources?: string[];
}

export interface IAIStatus {
  available: boolean;
  model: string;
  ragMode: boolean;
  provider: string;
  maxMessageLength?: number;
  rateLimit?: {
    requests: number;
    windowHours: number;
  };
}

export interface IAppointment {
  _id: string;
  userId: string | IUser;
  lawyerId: string | ILawyer;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  caseType?: string;
  description?: string;
  notes?: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}
