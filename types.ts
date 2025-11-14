export enum Role {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODDER = 'MODDER',
}

export interface User {
  id: string;
  username: string;
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