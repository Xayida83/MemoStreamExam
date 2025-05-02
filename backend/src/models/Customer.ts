export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone?: string;
  authorizedEmails: string[];
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  settings: CustomerSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerSettings {
  allowedAttachmentTypes: string[];
  maxAttachmentSize: number;
  autoProcessEmails: boolean;
  notificationEmail?: string;
} 