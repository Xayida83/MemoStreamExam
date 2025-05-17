// src/api/emailClient.js
import axios from 'axios';
import { Email } from '../types/Email';
const BASE_URL = import.meta.env.VITE_BASE_ADDRESS;
const CUSTOMER_ID = 'Jvyngltv56pm5S9Onoex';

export async function fetchEmails(): Promise<Email[]> {
  try {
    const response = await axios.get<Email[]>(`${BASE_URL}/emails/${CUSTOMER_ID}`);
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error; // vidarebefordra felet för att kunna hanteras av komponent
  }
}
