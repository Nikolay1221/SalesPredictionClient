import { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, useTheme, Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useTypewriter from 'react-typewriter-hook';
import { useNavigate } from 'react-router-dom';

import DropzoneDialog from '../../components/DropzoneDialog';
import LaptopImage from '../../assets/laptop.jpg';

import { tokens } from '../../theme';
import  Footer  from './Footer';

const IntroPage = () => {
  const [magicName, setMagicName] = useState('BTB');
  const intervalRef = useRef({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openDropzone, setOpenDropzone] = useState(false);

  const handleOpenDropzone = () => setOpenDropzone(true);
  const handleCloseDropzone = () => setOpenDropzone(false);
  const handleConfirm = () => {
    setOpenDropzone(false)
    setOpenConfirmation(true);
    navigate('/dashboard');
  };
  const handleImportSuccess = () => {
    console.log("Import success function called");
    setOpenConfirmation(true); // Open the Confirmation Dialog
  }; 

  const animatedText = useTypewriter(magicName);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      let newIndex = magicName === 'BTB' ? 1 : magicName === 'BTC' ? 2 : 0;
      setMagicName(['BTB', 'BTC', 'SASS'][newIndex]);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [magicName]);

  return(
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: colors.background }}>

  {/* Header */}
<div className="flex items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
    <h1 className="text-3xl font-bold text-[#00df9a]" style={{ marginLeft: '2cm', transform: 'translateY(-10px)' }}>CompanyName</h1>
</div>


      <Box sx={{
         marginTop: '-20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: { xs: 3, sm: 5 },
  bgcolor: colors.primary[700],
  color: colors.grey[100],
  minHeight: '100vh',  // Changed from 50vh to 100vh
}}>
  <Typography component="p" sx={{ color: '#00df9a', fontWeight: 'bold', p: 2, fontSize: '1.25rem' }}>
    GAMING WITH DATA ANALYTICS
  </Typography>
  <Typography variant="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: '6rem', my: 3 }}>
    Grow with data.
  </Typography>
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.25rem', py: 2 }}>
      Fast, flexible financing
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.25rem', py: 2, pl: { md: 3 } }}>
      {animatedText}
    </Typography>
  </Box>
  <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'gray.500', my: 2 }}>
    Monitor your data analytics to increase revenue for BTB, BTC & SASS platforms.
  </Typography>
</Box>



{/* Analytics Section */}
<Container maxWidth={false} disableGutters sx={{ bgcolor: 'white', overflow: 'hidden' }}>
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box component="img" src={LaptopImage} alt="Laptop showing analytics" sx={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', color: '#000' }}> 
          DATA ANALYTICS DASHBOARD
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2, color: '#000' }}> 
          Manage Data Analytics 
        </Typography>
        <Typography sx={{ color: '#000' }}> 
          Upload your data easily and get insightful statistics. Help your business grow with our insights.
        </Typography>
        <Box sx={{ mt: 2 }}> {/* Добавляем Box для отступа и обертки кнопки */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700], 
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold", 
              padding: "10px 20px", 
              '&:hover': {
                backgroundColor: colors.blueAccent[900], 
              },
              borderRadius: 'md', 
              textTransform: 'none', 
              width: { sm: 'fit-content' }, 
            }}
            onClick={handleOpenDropzone}
          >
            <FileUploadOutlinedIcon sx={{ mr: "10px" }} /> Import Data
          </Button>
        </Box>

      </Grid>
    </Grid>
  </Container>
</Container>


  {/* Dropzone Dialog */}
  <DropzoneDialog open={openDropzone} handleClose={handleCloseDropzone} onImportSuccess={handleImportSuccess} />




{/* Confirmation Dialog */}
<Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
  <DialogTitle>Confirm the action</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Data has been imported successfully.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirmation(false)} color="primary">Cancel</Button>
    <Button onClick={handleConfirm} color="secondary" autoFocus>Confirm</Button>
  </DialogActions>
</Dialog>


{/* Footer */}
<Footer/>
</Box>
);
};

export default IntroPage;     