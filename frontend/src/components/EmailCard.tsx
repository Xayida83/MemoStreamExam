import React from 'react';
import { Email } from '../types/Email';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

interface EmailCardProps {
  email: Email;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  // Get the first image attachment if it exists
  const firstImageAttachment = email.attachments?.find(
    attachment => attachment.mimeType.startsWith('image/')
  );

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {firstImageAttachment ? (
        <CardMedia
          component="img"
          height="140"
          image={firstImageAttachment.url}
          alt={firstImageAttachment.filename}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box 
          sx={{ 
            height: 140, 
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Ingen bild tillgänglig
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {email.subject}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {email.firstParagraph}
        </Typography>
      </CardContent>
    </Card>
  );
}; 