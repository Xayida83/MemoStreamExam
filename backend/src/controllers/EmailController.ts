import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { EmailService } from '../services/EmailService.js';

dotenv.config();

export class EmailController {
  private oauth2Client: OAuth2Client;
  private emailService: EmailService;
  private readonly RECEIVING_EMAIL: string;
  private tokens: any = null;
  private gmail: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.emailService = new EmailService();
    this.RECEIVING_EMAIL = process.env.RECEIVING_EMAIL || 'memostream.receiver@gmail.com';
    console.log('Konfigurerad e-postadress:', this.RECEIVING_EMAIL);
    this.gmail = google.gmail('v1');
  }

  /**
   * Initiate Gmail OAuth flow
   */
  async initiateAuth(req: Request, res: Response): Promise<void> {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly'
      ],
    });

    res.redirect(authUrl);
  }

  /**
   * Handle OAuth callback
   */
  async handleAuthCallback(req: Request, res: Response): Promise<void> {
    const { code } = req.query;

    try {
      const { tokens } = await this.oauth2Client.getToken(code as string);
      this.tokens = tokens;
      this.oauth2Client.setCredentials(tokens);

      res.send('Autentisering lyckades! Du kan nu stänga detta fönster.');
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).send('Autentisering misslyckades');
    }
  }

  /**
   * Handle incoming email webhook
   */
  async handleIncomingEmail(req: Request, res: Response): Promise<void> {
    // Här kan du implementera logik för att hantera inkommande e-post
    res.status(200).send('E-post mottagen');
  }

  /**
   * Get all emails for a user
   */
  async getUserEmails(req: Request, res: Response): Promise<Response | undefined> {
    try {
      if (!this.tokens) {
        return res.status(401).json({ error: 'Ingen autentisering hittad. Vänligen autentisera först.' });
      }

      this.oauth2Client.setCredentials(this.tokens);
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      console.log('Söker efter meddelanden till:', this.RECEIVING_EMAIL);
      
      // Hämta lista med meddelanden som skickats till den dedikerade adressen
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: `to:${this.RECEIVING_EMAIL}`
      });

      console.log('Gmail API Response:', response.data);

      if (!response.data.messages) {
        console.log('Inga meddelanden hittades');
        return res.json({ messages: [] });
      }

      // Hämta detaljerad information för varje meddelande
      const messages = await Promise.all(
        response.data.messages.map(async (message) => {
          const messageDetails = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!,
            format: 'full'
          });

          const headers = messageDetails.data.payload?.headers || [];
          const from = headers.find(h => h.name === 'From')?.value;
          const subject = headers.find(h => h.name === 'Subject')?.value;
          const date = headers.find(h => h.name === 'Date')?.value;

          return {
            id: message.id,
            threadId: message.threadId,
            from,
            subject,
            date
          };
        })
      );

      console.log('Processade meddelanden:', messages);
      return res.json({ messages });
    } catch (error: any) {
      console.error('Error fetching emails:', error);
      return res.status(500).json({ 
        error: 'Kunde inte hämta e-postmeddelanden',
        details: error.message,
        code: error.code
      });
    }
  }

  /**
   * Process a specific email
   */
  async processEmail(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { emailId, customerId } = req.params;

      if (!emailId || !customerId) {
        return res.status(400).json({ error: 'Email ID and Customer ID are required' });
      }

      const processedEmail = await this.emailService.processEmail(emailId);
      return res.json(processedEmail);
    } catch (error: any) {
      console.error('Error processing email:', error);
      return res.status(500).json({ 
        error: 'Failed to process email',
        details: error.message
      });
    }
  }

  async getCustomerEmails(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: 50
      });

      const messages = response.data.messages || [];
      const emails = await Promise.all(
        messages.map(async (message: any) => {
          const messageDetails = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'metadata'
          });

          return {
            id: message.id,
            threadId: message.threadId,
            subject: this.getHeaderValue(messageDetails.data.payload.headers, 'Subject'),
            from: this.getHeaderValue(messageDetails.data.payload.headers, 'From'),
            to: this.getHeaderValue(messageDetails.data.payload.headers, 'To'),
            date: new Date(this.getHeaderValue(messageDetails.data.payload.headers, 'Date')),
            snippet: messageDetails.data.snippet
          };
        })
      );

      return res.json(emails);
    } catch (error) {
      console.error('Error getting emails:', error);
      return res.status(500).json({ error: 'Failed to get emails' });
    }
  }

  private getHeaderValue(headers: any[], name: string): string {
    const header = headers.find(h => h.name === name);
    return header ? header.value : '';
  }
} 