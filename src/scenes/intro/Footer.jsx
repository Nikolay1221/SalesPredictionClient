// import React from 'react';
import { Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { FaDribbbleSquare, FaFacebookSquare, FaGithubSquare, FaInstagram, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
  const theme = useTheme();
  const colors = theme.palette; 

  return (
    <Box sx={{ bgcolor: colors.primary.main, color: colors.common.white, py: 6, px: 2 }}>
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1240px', mx: 'auto' }}>
        
        {/* Branding Section */}
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.secondary.main }}>
            RobloxTeam
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Dashboard and insights with our company
          </Typography>
          <Box sx={{ '& svg': { mx: 1, '&:hover': { color: colors.secondary.dark } } }}> 
          </Box>
        </Grid>

        
      </Grid>
    </Box>
  );
};

export default Footer;
