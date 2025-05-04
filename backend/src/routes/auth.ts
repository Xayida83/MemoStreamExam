import { Router } from 'express';
import { getAuthUrl, getTokens } from '../config/gmail.ts';
import { EmailPoller } from '../services/EmailPoller.ts';
import { AppError } from '../middleware/errorHandler.ts';

const router = Router();
const emailPoller = new EmailPoller(5 * 60 * 1000);

router.get('/gmail', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

router.get('/gmail/callback', async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    return next(new AppError(400, 'No authorization code provided'));
  }

  try {
    await getTokens(code as string);
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
    next(new AppError(500, 'Failed to authenticate with Gmail'));
  }
});

export const authRoutes = router; 