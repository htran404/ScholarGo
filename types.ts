
export enum Role {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  password?: string; // Should not be stored in client state long-term
  fullName: string;
  role: Role;
  optionalInfo?: {
    phone?: string;
    company?: string;
    organization?: string;
  };
  savedScholarshipIds: string[];
  isLocked?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userFullName: string;
  text: string;
  timestamp: string;
  isHidden?: boolean;
}

export interface Scholarship {
  id:string;
  title: { en: string; vi: string };
  organization: { en: string; vi: string };
  amount: number;
  description: { en: string; vi: string };
  eligibility: { en: string[]; vi: string[] };
  imageUrl: string;
  website: string;
  dateUploaded: string;
  comments: Comment[];
  commentsLocked?: boolean;
  tags: string[];
}