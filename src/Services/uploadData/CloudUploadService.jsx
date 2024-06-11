import axios from 'axios';

class CloudUploadService {
  constructor(updateProgress) {
    this.updateProgress = updateProgress;
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/datatables/upload?file', formData, {
        onUploadProgress: progressEvent => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          this.updateProgress(progress);
        }
      });


      
      return response.data; 
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      throw error;  // Rethrow the error if you want calling code to handle it
    }
       
  }
}
export default CloudUploadService;