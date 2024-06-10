import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, LinearProgress } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ErrorAlert from '../Services/uploadData/ErrorAlert';
import SuccessfullAlert from '../Services/uploadData/SuccessfullAlert';
import { useDropzone } from 'react-dropzone';
import { uploadTableFile } from '../redux/actions/tableActions';
import { useDispatch } from 'react-redux';
import { green } from '@mui/material/colors';

//import { useDispatch } from 'react-redux';
//import { fetchTables } from '../redux/actions/tableActions'; 

const DropzoneDialog = ({ open, handleClose, onImportSuccess }) => {
  const [state, setState] = useState({
    selectedFile: null, 
    fileRejections: [],
    alertOpen: false,
    uploadProgress: 0,
    isUploading: false,
  });
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateState = (newState) => setState((prevState) => ({ ...prevState, ...newState }));

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      updateState({uploadMessage: 'Invalid type of file only *.csv allowed', uploadFormatError: true });
    } else if (acceptedFiles.length > 0) {
      updateState({ selectedFile: acceptedFiles[0] }); // Store the selected file
    }
  };


  const handleSubmit = async () => {
    if (!state.selectedFile) return;

    updateState({ isUploading: true, uploadError: false, uploadSuccess: false });

    try {
      await dispatch(uploadTableFile(state.selectedFile)); 
      updateState({
        uploadSuccess: true,
        uploadMessage: 'File uploaded successfully',
        selectedFile: null 
      });
      handleClose(); // Close the Dropzone Dialog
      // Delay the invocation of handleImportSuccess to ensure the Dropzone Dialog has time to close
      setTimeout(() => onImportSuccess(), 300);
    } catch (error) {
      console.error('Upload error:', error);
      updateState({
        uploadError: true,
        uploadMessage: `Could not upload file: ${state.selectedFile ? state.selectedFile.name : 'Unknown file'}`
      });
    } finally {
      updateState({ isUploading: false });
    }
  };  
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleSnackbarClose = () => updateState({
    uploadSuccess: false,
    uploadError: false,
    uploadFormatError: false,
    fileRejections: []
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Upload Data
        <IconButton onClick={handleClose} style={styles.closeButton}><CloseIcon color="primary" /></IconButton>
      </DialogTitle>
      <DialogContent>
        <div {...getRootProps()} style={styles.dropzone}>
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select files</p>
          <em>(Only *.csv file will be accepted)</em>
        </div>
        {state.isUploading && <LinearProgress variant="determinate" value={uploadProgress}
        sx={{
          marginBottom: '20px',
         '& .MuiLinearProgress-bar': {
          backgroundColor: green[500], 
          }
      }} />}
        {state.selectedFile && (
          <Paper variant="outlined" style={styles.paper}>
            <List dense>
              <ListItem>
                <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                <ListItemText primary={state.selectedFile.name} secondary={`Size: ${state.selectedFile.size} bytes`} />
              </ListItem>
            </List>
          </Paper>
        )}
        <div style={styles.submitContainer}>
          <Button variant="contained" onClick={handleSubmit} disabled={state.isUploading}>
            <CloudUploadIcon sx={{ mr: '10px' }} />
            Submit
          </Button>
        </div>
      </DialogContent>
      <SuccessfullAlert open={state.uploadSuccess} onClose={handleSnackbarClose} message={state.uploadMessage} />
      <ErrorAlert open={state.uploadError} onClose={handleSnackbarClose} message={state.uploadMessage} />
      <ErrorAlert open={state.uploadFormatError} onClose={handleSnackbarClose} message={state.uploadMessage} />
    </Dialog>
  );
};

const styles = {
  dropzone: {
    border: '2px dashed #cccccc',
    borderRadius: '10px',
    padding: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '25px',
  },
  closeButton: {
    float: 'right',
  },
  paper: {
    padding: '5px',
    marginBottom: '15px',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
};

export default DropzoneDialog;
