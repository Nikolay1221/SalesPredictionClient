import {Box, IconButton, useTheme, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { useContext, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DropzoneDialog from "../../components/DropzoneDialog";
import { useDispatch } from 'react-redux';
import { uploadTableFile } from "../../redux/actions/tableActions"; // Adjust the path as necessary

const Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate(); 
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch(); // Hook to dispatch actions

  

  const [openDropzone, setOpenDropzone] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleOpenDropzone = () => setOpenDropzone(true);
  const handleCloseDropzone = () => setOpenDropzone(false);

  const handleConfirm = () => {
    setOpenConfirmation(false); 
    navigate('/dashboard'); 
  };

  const handleImportSuccess = (file) => {
    // Assuming 'file' is the file selected or dropped in DropzoneDialog
    dispatch(uploadTableFile(file)); // Dispatch the action to upload the file
    setOpenDropzone(false); 
    setOpenConfirmation(true); 
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Button Import */}
      <Box display="flex">
        <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
          }}
          onClick={handleOpenDropzone}
          >
            <FileUploadOutlinedIcon sx={{ mr: "10px" }} />
            Import Data
        </Button>
       {/* Import data Modal */}
       <DropzoneDialog 
        handleOpen={handleOpenDropzone} 
        handleClose={handleCloseDropzone} 
        open={openDropzone} 
        onImportSuccess={handleImportSuccess} // Pass the modified handleImportSuccess
      />
      </Box>
     

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
     
     {/* Confirmation Dialog */}
     <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">{"Confirm the action"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Data has been imported successfully. Would you like to go to the dashboard now?
          </DialogContentText>  
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
 