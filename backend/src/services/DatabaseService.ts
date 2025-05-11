import { adminDb } from '../config/firebase-admin.js';
import { Timestamp } from 'firebase-admin/firestore';
import { Email } from '../models/Email.js';
import { Customer } from '../models/Customer.js';

export class DatabaseService {
  private readonly COLLECTIONS = {
    CUSTOMERS: 'customers',
    EMAILS: 'emails',
    ATTACHMENTS: 'attachments'
  };

  /**
   * Extracts the first paragraph from email content
   * @param content The email content
   * @returns The first paragraph or empty string if no content
   */
  private extractFirstParagraph(content: string): string {
    if (!content) return '';
    
    // Split by double newlines to get paragraphs
    const paragraphs = content.split(/\n\s*\n/);
    return paragraphs[0]?.trim() || '';
  }

  /**
   * Save a customer to the database
   * @param customer The customer to save
   */
  async saveCustomer(customer: Customer): Promise<void> {
    const customerRef = adminDb.collection(this.COLLECTIONS.CUSTOMERS).doc(customer.id);
    await customerRef.set({
      ...customer,
      createdAt: Timestamp.fromDate(customer.createdAt),
      updatedAt: Timestamp.fromDate(customer.updatedAt)
    });
  }

  /**
   * Save an email to the database
   * @param email The email to save
   */
  async saveEmail(email: Email): Promise<void> {
    const emailRef = adminDb.collection(this.COLLECTIONS.EMAILS).doc(email.id);
    const firstParagraph = this.extractFirstParagraph(email.content);
    
    const emailData = {
      ...email,
      firstParagraph,
      date: Timestamp.fromDate(new Date(email.date))
    };
    await emailRef.set(emailData);
  }

  async getEmailsBySenders(authEmails: string[], limitCount: number = 50): Promise<Email[]> {
    if (authEmails.length === 0) return [];
  
    // Firestore supports max 10 items in 'in'-queries
    const batches: Email[] = [];
    const chunkSize = 10;
  
  for (let i = 0; i < authEmails.length; i += chunkSize) {
     const batchEmails = authEmails.slice(i, i + chunkSize);
      const snapshot = await adminDb
      .collection(this.COLLECTIONS.EMAILS)
        .where('from', 'in', batchEmails)
        .limit(limitCount)
        .get();
  
      batches.push(...snapshot.docs.map(doc => ({
        ...doc.data(), 
        date: doc.data().date.toDate()
      } as Email)));
    }
    return batches;
  }
  
  /**
   * Get all emails for a specific customer
   * @param customerId The customer's ID
   * @param limit Optional limit for pagination
   * @returns Array of emails
   */
  async getCustomerEmails(authEmail: string, limitCount: number = 50): Promise<Email[]> {
    // Hämta alla emails där 'from' matchar authEmail direkt från emails-samlingen
    const snapshot = await adminDb
      .collection(this.COLLECTIONS.EMAILS)
      .where('from', '==', authEmail)
      .orderBy('date', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Email[];
  }

  /**
   * Get a specific email by ID
   * @param emailId The email ID
   * @returns The email or null if not found
   */
  async getEmailById(emailId: string): Promise<Email | null> {
    const doc = await adminDb.collection(this.COLLECTIONS.EMAILS).doc(emailId).get();
    
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) return null;

    return {
      ...data,
      date: data.date.toDate()
    } as Email;
  }

  /**
   * Get emails by search criteria
   * @param criteria Search criteria
   * @returns Array of matching emails
   */
  async searchEmails(criteria: {
    customerId: string;
    subject?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  }): Promise<Email[]> {
    const { customerId, subject, fromDate, toDate, limit: limitCount = 50 } = criteria;
    
    let query = adminDb
      .collection(this.COLLECTIONS.CUSTOMERS)
      .doc(customerId)
      .collection(this.COLLECTIONS.EMAILS)
      .orderBy('date', 'desc')
      .limit(limitCount);

    if (subject) {
      query = query.where('subject', '>=', subject).where('subject', '<=', subject + '\uf8ff');
    }

    if (fromDate) {
      query = query.where('date', '>=', Timestamp.fromDate(fromDate));
    }

    if (toDate) {
      query = query.where('date', '<=', Timestamp.fromDate(toDate));
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Email[];
  }
} 