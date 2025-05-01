import express from 'express';
import cors from 'cors';
import { EmailController } from './controllers/EmailController.js';
import { EmailPoller } from './services/EmailPoller.js';
import { getAuthUrl, getTokens } from './config/gmail.js';
import path from 'path';

const app = express();
const emailController = new EmailController();
const emailPoller = new EmailPoller(5 * 60 * 1000); // Poll every 5 minutes

app.use(cors());
app.use(express.json());

// Statiska filer
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Try to start email polling with existing tokens
emailPoller.start().catch(error => {
  console.log('Could not start email polling with existing tokens:', error.message);
  console.log('Please visit http://localhost:5000/api/auth/gmail to authenticate');
});

// Gmail authentication routes
app.get('/api/auth/gmail', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.get('/api/auth/gmail/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('No authorization code provided');
  }

  try {
    await getTokens(code as string);
    // Restart email polling with new tokens
    await emailPoller.start();
    res.send(`
      <html>
        <body>
          <h1>Successfully authenticated with Gmail!</h1>
          <p>Email polling has been started. You can close this window and return to the application.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Authentication failed</h1>
          <p>Please try again.</p>
        </body>
      </html>
    `);
  }
});

// Email routes
app.get('/api/emails/:customerId', (req, res) => emailController.getCustomerEmails(req, res));
app.post('/api/emails/:customerId/process/:emailId', emailController.processEmail.bind(emailController));
app.post('/api/emails/poll', (req, res) => {
  emailPoller.pollEmails();
  res.send('Polling triggered');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 