import { adminDb } from '../config/firebase-admin.js';
import { Timestamp } from 'firebase-admin/firestore';

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');

    // Get all emails
    const emailsSnapshot = await adminDb.collection('emails').get();
    console.log(`Found ${emailsSnapshot.size} emails to migrate`);

    // Get all customers
    const customersSnapshot = await adminDb.collection('customers').get();
    const customers = new Map();
    customersSnapshot.forEach(doc => {
      customers.set(doc.data().customerNumber, doc.id);
    });

    // Update each email
    for (const emailDoc of emailsSnapshot.docs) {
      const email = emailDoc.data();
      
      // Extract customer number from subject
      const match = email.subject.match(/^(\d+):/);
      if (!match) {
        console.log(`Skipping email ${emailDoc.id} - no customer number found in subject`);
        continue;
      }

      const customerNumber = match[1];
      const customerId = customers.get(customerNumber);

      if (!customerId) {
        console.log(`Skipping email ${emailDoc.id} - no customer found for number ${customerNumber}`);
        continue;
      }

      // Update email with customerId
      await adminDb.collection('emails').doc(emailDoc.id).update({
        customerId,
        subject: email.subject.replace(/^\d+:\s*/, '') // Remove customer number from subject
      });

      // Also save to customer's subcollection
      await adminDb
        .collection('customers')
        .doc(customerId)
        .collection('emails')
        .doc(emailDoc.id)
        .set({
          ...email,
          customerId,
          subject: email.subject.replace(/^\d+:\s*/, '')
        });

      console.log(`Migrated email ${emailDoc.id} to customer ${customerId}`);
    }

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run the migration
migrateDatabase(); 