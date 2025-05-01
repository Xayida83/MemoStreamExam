import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = {
  type: process.env.FIREBASE_TYPE as string,
  project_id: process.env.FIREBASE_PROJECT_ID as string,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID as string,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
  client_email: process.env.FIREBASE_CLIENT_EMAIL as string,
  client_id: process.env.FIREBASE_CLIENT_ID as string,
  auth_uri: process.env.FIREBASE_AUTH_URI as string,
  token_uri: process.env.FIREBASE_TOKEN_URI as string,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL as string,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL as string
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
  });
}

export const adminDb = getFirestore(); 