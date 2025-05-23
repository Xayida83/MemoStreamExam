import { Email, Attachment } from '../models/Email.js';
import { StorageService } from './StorageService.js';
import { DatabaseService } from './DatabaseService.js';
import { CustomerService } from './CustomerService.js';
import { getGmailClient } from '../config/gmail.js';
import { getHeaderValue, getFileExtension, extractEmailContent } from '../utils/emailUtils.js';
import { processAttachmentData, generateEmbeddedFilename, isAttachmentPart, isEmbeddedAttachment } from '../utils/attachmentUtils.js';
//import { gmail } from '@googleapis/gmail';

export class EmailService {
  private gmailClient: any;
  private storageService: StorageService;
  private databaseService: DatabaseService;
  private customerService: CustomerService;

  constructor() {
    this.storageService = new StorageService();
    this.databaseService = new DatabaseService();
    this.customerService = new CustomerService();
  }

  private async getGmailClient() {
    if (!this.gmailClient) {
      this.gmailClient = await getGmailClient();
    }
    return this.gmailClient;
  }

  async processEmail(emailId: string): Promise<Email> {
    try {
      const gmail = await this.getGmailClient();
      if (!gmail) {
        throw new Error('Gmail client not available');
      }

      console.log(`\n=== Processing email ${emailId} ===`);
      
      // Hämta e-postmeddelandet från Gmail
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: emailId,
        format: 'full'
      });

      if (!message.data) {
        throw new Error('No email data found');
      }

      const payload = message.data.payload;
      if (!payload) {
        throw new Error('No payload in email message');
      }

      // Validera och extrahera innehåll
      const { subject, from, to, date, content } = extractEmailContent(payload);
      
      if (!subject || !from || !to || !date || !content) {
        throw new Error('Missing required email content');
      }

      // Bearbeta bilagor
      const attachments = await this.processAttachments(payload, emailId);

      // Skapa e-postobjekt
      const processedEmail: Email = {
        id: emailId,
        subject,
        from,
        to,
        date,
        content,
        attachments,
        processedAt: new Date().toISOString()
      };

      // Validera e-postobjektet
      this.validateEmail(processedEmail);

      // Spara i databasen
      await this.databaseService.saveEmail(processedEmail);

      // Markera som läst
      await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
          removeLabelIds: ['UNREAD']
        }
      });

      return processedEmail;
    } catch (error: any) {
      console.error(`Error processing email ${emailId}:`, error);
      throw error;
    }
  }

  private validateEmail(email: Email): void {
    console.log('\nValidating Email:');
    console.log('----------------');
    
    // Validera obligatoriska fält
    const requiredFields = ['id', 'subject', 'from', 'to', 'date', 'content'];
    for (const field of requiredFields) {
      if (!email[field as keyof Email]) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validera datumformat
    if (isNaN(Date.parse(email.date))) {
      console.error('Invalid date format');
      throw new Error('Invalid date format');
    }

    // Validera bilagor
    if (email.attachments) {
      for (const attachment of email.attachments) {
        if (!attachment.filename || !attachment.url || !attachment.mimeType) {
          console.error('Invalid attachment format');
          throw new Error('Invalid attachment format');
        }
      }
    }

    console.log('Email validation successful');
  }

  async getEmailById(emailId: string, customerId: string): Promise<Email | null> {
    const email = await this.databaseService.getEmailById(emailId);
    if (!email) return null;
  
    // Verifiera att email.from finns i kundens authorizedEmails
    const customer = await this.customerService.getCustomerById(customerId);
    if (!customer) return null;
  
    const isAuthorized = customer.authorizedEmails.some(authEmail =>
      authEmail.toLowerCase() === email.from.toLowerCase()
    );
  
    return isAuthorized ? email : null;
  }
  
  /**
   * Get all emails for a customer
   * @param customerId The customer's ID
   * @returns Array of emails
   */
  async getCustomerEmails(customerId: string): Promise<Email[]> {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }
//Denna metod ska ta emot AuthEmail från Customer och skicka in detta som en parameter till denna metoden
      const emails = await this.databaseService.getEmailsBySenders(customer.authorizedEmails);
      if (!emails || emails.length === 0) {
        throw new Error('No emails found for this customer');
      }

      return emails;
    } catch (error: any) {
      console.error(`Error getting customer emails for ${customerId}:`, error);
      throw error;
    }
  }

  private getHeaderValue(headers: any[], name: string): string {
    const header = headers.find(h => h.name === name);
    return header ? header.value : '';
  }

  private extractEmailContent(payload: any): { subject: string; from: string; to: string; date: string; content: string } {
    const headers = payload.headers;
    const subject = getHeaderValue(headers, 'Subject');
    const from = getHeaderValue(headers, 'From');
    const to = getHeaderValue(headers, 'To');
    const date = new Date(getHeaderValue(headers, 'Date')).toISOString();

    let content = '';

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain') {
          content = Buffer.from(part.body.data, 'base64').toString();
        } else if (part.mimeType === 'text/html') {
          content = Buffer.from(part.body.data, 'base64').toString();
        }
      }
    } else if (payload.body && payload.body.data) {
      content = Buffer.from(payload.body.data, 'base64').toString();
    }

    return { subject, from, to, date, content };
  }

  private async processAttachments(payload: any, emailId: string): Promise<Attachment[]> {
    const attachments: Attachment[] = [];
    
    if (payload.parts) {
      for (const part of payload.parts) {
        if (isAttachmentPart(part)) {
          try {
            if (part.body.attachmentId) {
              const attachment = await this.processAttachment(part, emailId);
              attachments.push(attachment);
            } else if (isEmbeddedAttachment(part)) {
              const buffer = Buffer.from(part.body.data, 'base64');
              if (buffer.length > 0) {
                const attachment = await this.processEmbeddedAttachment(part, buffer);
                if (attachment) {
                  attachments.push(attachment);
                }
              }
            }
          } catch (error) {
            console.error(`Error processing attachment:`, error);
          }
        }
        
        // Rekursivt hantera nästlade delar
        if (part.parts) {
          const nestedAttachments = await this.processAttachments(part, emailId);
          attachments.push(...nestedAttachments);
        }
      }
    }

    return attachments;
  }

  private async processAttachment(part: any, emailId: string): Promise<Attachment> {
    try {
      console.log(`Processing attachment: ${part.filename} (${part.mimeType})`);
      
      // Get the attachment data from Gmail API
      const attachmentResponse = await this.gmailClient.users.messages.attachments.get({
        userId: 'me',
        messageId: emailId,
        id: part.body.attachmentId
      });

      const data = attachmentResponse.data.data;
      if (!data) {
        throw new Error('No attachment data received');
      }

      const buffer = Buffer.from(data, 'base64');
      console.log(`Downloaded attachment: ${part.filename} (${buffer.length} bytes)`);
      
      return processAttachmentData(this.storageService, buffer, part.filename, part.mimeType);
    } catch (error) {
      console.error(`Error processing attachment ${part.filename}:`, error);
      throw error;
    }
  }

  private async processEmbeddedAttachment(part: any, buffer: Buffer): Promise<Attachment | null> {
    try {
      const contentType = part.mimeType;
      const filename = part.filename || generateEmbeddedFilename(contentType);
      
      console.log(`Processing embedded attachment: ${filename} (${contentType})`);
      
      return processAttachmentData(this.storageService, buffer, filename, contentType);
    } catch (error) {
      console.error(`Error processing embedded attachment:`, error);
      return null;
    }
  }
} 