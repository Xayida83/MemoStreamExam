import axios from 'axios';
import { Customer } from '../types/Customer';

const BASE_URL = import.meta.env.VITE_BASE_ADDRESS;
const CUSTOMER_ID = 'Jvyngltv56pm5S9Onoex'; // Samma ID som används i emailClient

export async function fetchCustomer(): Promise<Customer> {
  try {
    const response = await axios.get<Customer>(`${BASE_URL}/customers/${CUSTOMER_ID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
} 