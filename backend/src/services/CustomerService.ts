import { adminDb } from '../config/firebase-admin.js';
import { Timestamp } from 'firebase-admin/firestore';
import { Customer, CustomerSettings } from '../models/Customer.js';

export class CustomerService {
  private readonly COLLECTION = 'customers';

  /**
   * Create a new customer
   */
  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const customerRef = adminDb.collection(this.COLLECTION).doc();
    
    const newCustomer: Customer = {
      ...customer,
      id: customerRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        ...customer.settings,
        allowedAttachmentTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        maxAttachmentSize: 10 * 1024 * 1024, // 10MB
        autoProcessEmails: true
      }
    };

    await customerRef.set({
      ...newCustomer,
      createdAt: Timestamp.fromDate(newCustomer.createdAt),
      updatedAt: Timestamp.fromDate(newCustomer.updatedAt)
    });

    return newCustomer;
  }

  /**
   * Get customer by URL slug
   */
  async getCustomerBySlug(urlSlug: string): Promise<Customer | null> {
    try {
      const snapshot = await adminDb
        .collection(this.COLLECTION)
        .where('urlSlug', '==', urlSlug)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Customer;
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  }

  /**
   * Validate if an email is authorized for a customer
   */
  async isEmailAuthorized(urlSlug: string, fromEmail: string): Promise<boolean> {
    const customer = await this.getCustomerBySlug(urlSlug);
    if (!customer) {
      return false;
    }

    // Extract email from "Name <email@example.com>" format
    const emailMatch = fromEmail.match(/<(.+)>/);
    const cleanFromEmail = emailMatch ? emailMatch[1] : fromEmail;

    return customer.authorizedEmails.some(email => 
      email.toLowerCase() === cleanFromEmail.toLowerCase()
    );
  }

  /**
   * Extract customer number from email subject
   * Expected format: "123: Subject text"
   */
  //extractCustomerNumber(subject: string): { customerNumber: string; cleanSubject: string } | null {
  //  const match = subject.match(/^(\d+):\s*(.+)$/);
  //  if (!match) {
  //    return null;
   // }

    //return {
    //  customerNumber: match[1],
    //  cleanSubject: match[2]
    //};
  //}

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: string): Promise<Customer | null> {
    const doc = await adminDb.collection(this.COLLECTION).doc(customerId).get();
    
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) {
      return null;
    }

    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Customer;
  }

  async updateCustomer(customerId: string, customerData: Partial<Customer>): Promise<void> {
    try {
      await adminDb
        .collection(this.COLLECTION)
        .doc(customerId)
        .update({
          ...customerData,
          updatedAt: new Date()
        });
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }
} 