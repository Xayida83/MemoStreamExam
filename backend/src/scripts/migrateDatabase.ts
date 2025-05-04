import { adminDb } from '../config/firebase-admin.js';
//TODO ta bort?
async function migrateDatabase() {
  try {
    // Get all customers
    const customersSnapshot = await adminDb.collection('customers').get();
    const customers = new Map();
    
    customersSnapshot.forEach(doc => {
      const customer = doc.data();
      customers.set(customer.urlSlug, doc.id);
    });

    // Get all emails
    const emailsSnapshot = await adminDb.collection('emails').get();
    
    // Update each email
    for (const emailDoc of emailsSnapshot.docs) {
      const email = emailDoc.data();
      
      // Extract URL slug from subject
      const match = email.subject.match(/^([a-z0-9-]+):/);
      if (!match) {
        console.log(`Skipping email ${emailDoc.id} - no URL slug found in subject`);
        continue;
      }

      const urlSlug = match[1];
      const customerId = customers.get(urlSlug);

      if (!customerId) {
        console.log(`Skipping email ${emailDoc.id} - no customer found for URL slug ${urlSlug}`);
        continue;
      }

      // Update email with customerId
      await adminDb.collection('emails').doc(emailDoc.id).update({
        customerId,
        subject: email.subject.replace(/^[a-z0-9-]+:\s*/, '') // Remove URL slug from subject
      });

      console.log(`Updated email ${emailDoc.id} with customerId ${customerId}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateDatabase(); 