export interface Customer {
  id: string;
  name: string;
  authorizedEmails: string[];
  createdAt: Date;
  updatedAt: Date;
  settings: CustomerSettings;
}

export interface CustomerSettings {
  allowedAttachmentTypes: string[];
  maxAttachmentSize: number;
  autoProcessEmails: boolean;
  notificationEmail?: string;
} 