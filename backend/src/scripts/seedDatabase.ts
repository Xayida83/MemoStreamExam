import { DatabaseService } from '../services/DatabaseService.js';
import { Customer } from '../models/Customer.js';
import { Email } from '../models/Email.js';

const databaseService = new DatabaseService();

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create test customers
    const customers: Customer[] = [
      {
        id: 'customer1',
        name: 'Test Customer 1',
        authorizedEmails: ['test1@example.com'],
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          allowedAttachmentTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
          maxAttachmentSize: 10 * 1024 * 1024,
          autoProcessEmails: true
        }
      },
      {
        id: 'customer2',
        name: 'Test Customer 2',
        authorizedEmails: ['test2@example.com'],
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          allowedAttachmentTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
          maxAttachmentSize: 10 * 1024 * 1024,
          autoProcessEmails: true
        }
      }
    ];

    // Save customers
    for (const customer of customers) {
      await databaseService.saveCustomer(customer);
      console.log(`Created customer: ${customer.name}`);
    }

    // Create test emails
    const emails: Email[] = [
      {
        id: 'email1',
        subject: 'Test Email 1',
        from: 'test1@example.com',
        to: 'recipient@example.com',
        date: new Date().toISOString(),
        content: 'This is a test email content',
        attachments: [],
        processedAt: new Date().toISOString()
      },
      {
        id: 'email2',
        subject: 'Test Email 2',
        from: 'test2@example.com',
        to: 'recipient@example.com',
        date: new Date(Date.now() - 86400000).toISOString(),
        content: 'Another test email content',
        attachments: [],
        processedAt: new Date().toISOString()
      },
      {
        id: 'email3',
        subject: 'Test Email 3',
        from: 'test3@example.com',
        to: 'recipient@example.com',
        date: new Date().toISOString(),
        content: 'Customer 2 test email',
        attachments: [],
        processedAt: new Date().toISOString()
      }
    ];

    // Save emails
    for (const email of emails) {
      await databaseService.saveEmail(email);
      console.log(`Created email: ${email.subject}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding script
seedDatabase(); 