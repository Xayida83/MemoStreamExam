import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const TOKEN_PATH = path.join(process.cwd(), 'gmail-token.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/gmail/callback'
);

// Generate a URL for user consent
export const getAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ],
    prompt: 'consent'
  });
  console.log('Generated auth URL:', authUrl);
  return authUrl;
};

// Save tokens to local file
const saveTokens = async (tokens: any) => {
  try {
    console.log('Saving tokens to local file...');
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Tokens saved successfully');
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw error;
  }
};

// Load tokens from local file
const loadTokens = async () => {
  try {
    console.log('Loading tokens from local file...');
    if (fs.existsSync(TOKEN_PATH)) {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      console.log('Found stored tokens');
      return tokens;
    }
    console.log('No stored tokens found');
    return null;
  } catch (error) {
    console.error('Error loading tokens:', error);
    return null;
  }
};

// Get tokens from authorization code
export const getTokens = async (code: string) => {
  try {
    console.log('Getting tokens from authorization code...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Successfully got tokens');
    await saveTokens(tokens);
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};

// Initialize OAuth2 client with stored tokens
const initializeOAuth2Client = async () => {
  console.log('Initializing OAuth2 client...');
  const tokens = await loadTokens();
  
  if (tokens) {
    console.log('Setting credentials from stored tokens');
    oauth2Client.setCredentials(tokens);
    
    if (tokens.expiry_date && tokens.expiry_date < Date.now() + 5 * 60 * 1000) {
      console.log('Token is expired or about to expire, refreshing...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        console.log('Successfully refreshed token');
        await saveTokens(credentials);
        oauth2Client.setCredentials(credentials);
      } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
      }
    } else {
      console.log('Token is still valid');
    }
    return true;
  } else {
    console.log('No stored tokens found, authentication required');
    return false;
  }
};

// Get Gmail API client
export const getGmailClient = async () => {
  try {
    const isInitialized = await initializeOAuth2Client();
    if (!isInitialized) {
      console.log('Gmail client not initialized - authentication required');
      return null;
    }
    const client = google.gmail({ version: 'v1', auth: oauth2Client });
    console.log('Successfully created Gmail client');
    return client;
  } catch (error) {
    console.error('Error getting Gmail client:', error);
    return null;
  }
}; 