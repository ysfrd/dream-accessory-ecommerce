import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton,
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2c3e50',
        color: 'white',
        mt: 'auto',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">+90 555 555 55 55</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmailIcon fontSize="small" />
              <Typography variant="body2">info@dreamaccessory.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">Istanbul, Turkey</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer', mb: 1 }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer', mb: 1 }}>
              Returns & Exchanges
            </Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer' }}>
              Track Your Order
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{ color: 'white' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <Typography 
          variant="body2" 
          align="center"
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          © 2026 Dream Accessory - All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;