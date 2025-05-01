import { EmailService } from './EmailService.js';
import { CustomerService } from './CustomerService.js';
import { getGmailClient } from '../config/gmail.js';
import { adminDb } from '../config/firebase-admin.js';

export class EmailPoller {
  private gmailClient: any;
  private emailService: EmailService;
  private customerService: CustomerService;
  private pollingInterval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly SYSTEM_EMAIL = 'memostream.receiver@gmail.com';

  constructor(pollingInterval: number = 5 * 60 * 1000) {
    this.emailService = new EmailService();
    this.customerService = new CustomerService();
    this.pollingInterval = pollingInterval;
  }

  public async start(): Promise<void> {
    try {
      console.log('Starting email poller...');
      this.gmailClient = await getGmailClient();
      
      if (!this.gmailClient) {
        console.log('Gmail client not available - authentication required');
        console.log('Please visit http://localhost:5000/api/auth/gmail to authenticate');
        return;
      }

      console.log('Successfully initialized Gmail client');
      await this.pollEmails();
      
      this.intervalId = setInterval(async () => {
        await this.pollEmails();
      }, this.pollingInterval);
      
      console.log('Email polling started successfully');
    } catch (error: any) {
      console.error('Error starting email poller:', error);
      if (error.message?.includes('Authentication required')) {
        console.log('Please visit http://localhost:5000/api/auth/gmail to authenticate');
      }
    }
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Email polling stopped');
    }
  }

  private isSystemEmail(from: string): boolean {
    return from.toLowerCase().includes(this.SYSTEM_EMAIL.toLowerCase());
  }

  private async processSystemEmail(messageId: string, subject: string): Promise<void> {
    try {
      const systemCustomer = {
        id: 'system',
        customerNumber: 'system',
        name: 'System',
        authorizedEmails: [this.SYSTEM_EMAIL],
        settings: {
          allowedAttachmentTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
          maxAttachmentSize: 10 * 1024 * 1024,
          autoProcessEmails: true
        }
      };

      await this.emailService.processEmail(messageId);
      console.log(`Processed system email ${messageId}`);
    } catch (error) {
      console.error(`Error processing system email ${messageId}:`, error);
      throw error;
    }
  }

  public async pollEmails(): Promise<void> {
    if (!this.gmailClient) {
      console.log('Gmail client not available - authentication required');
      return;
    }

    try {
      console.log('Polling for new emails...');
      const response = await this.gmailClient.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: 50
      });

      const messages = response.data.messages || [];
      console.log(`Found ${messages.length} unread messages`);

      for (const message of messages) {
        try {
          const fullMessage = await this.gmailClient.users.messages.get({
            userId: 'me',
            id: message.id!,
            format: 'full'
          });

          await this.processEmail(fullMessage.data);
          await this.markAsRead(message.id!);
        } catch (error) {
          console.error(`Error processing message ${message.id}:`, error);
        }
      }
    } catch (error: any) {
      console.error('Error polling emails:', error);
      if (error.message?.includes('Authentication required')) {
        console.log('Please visit http://localhost:5000/api/auth/gmail to authenticate');
      }
    }
  }

  private async processEmail(messageData: any): Promise<void> {
    const headers = messageData.payload.headers;
    const subject = this.getHeaderValue(headers, 'Subject');
    const from = this.getHeaderValue(headers, 'From');
    
    console.log('Processing email:', {
      id: messageData.id,
      subject,
      from
    });

    if (this.isSystemEmail(from)) {
      await this.processSystemEmail(messageData.id, subject);
      return;
    }

    const authorizedCustomer = await this.findAuthorizedCustomer(from);
    if (!authorizedCustomer) {
      console.log(`Skipping message ${messageData.id} - no authorized customer found for email: ${from}`);
      return;
    }

    await this.emailService.processEmail(messageData.id);
    console.log(`Processed email ${messageData.id} for customer ${authorizedCustomer.id}`);
  }

  private async findAuthorizedCustomer(from: string): Promise<any> {
    const customersSnapshot = await adminDb.collection('customers').get();
    for (const doc of customersSnapshot.docs) {
      const customer = doc.data();
      if (customer.authorizedEmails.some((email: string) => 
        email.toLowerCase() === from.toLowerCase() || 
        from.toLowerCase().includes(email.toLowerCase())
      )) {
        return customer;
      }
    }
    return null;
  }

  private async markAsRead(messageId: string): Promise<void> {
    try {
      await this.gmailClient.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD']
        }
      });
    } catch (error) {
      console.error(`Error marking message ${messageId} as read:`, error);
    }
  }

  private getHeaderValue(headers: any[], name: string): string {
    const header = headers.find(h => h.name === name);
    return header ? header.value : '';
  }
} 