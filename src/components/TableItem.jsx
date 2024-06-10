
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box'
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';

const TableItem = ({ tableDetails, onClickDelete, onClickTableItem }) => {
  const { id, rowCount, tableName, uploadDate } = tableDetails;

  return (
    <Card sx={{ display: 'flex', marginBottom: 2, alignItems: 'center', padding: '10px', gap: '20px' }}>
      <IconButton
      onClick={() => onClickTableItem(id)}>
      <Box sx={{ width: 50, height: 50, marginRight: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FileOpenOutlinedIcon sx={{ fontSize: 50 }} />
      </Box>
      </IconButton>
      <CardContent sx={{ flex: '1', marginRight: 2 }}>
      <Typography variant="body2" color="text.secondary">
            {`${rowCount} rows`}
       </Typography>
        <Typography variant="h6">
          {tableName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {uploadDate}
        </Typography>
      </CardContent>
      <IconButton
        edge="end"
        size='large'
        aria-label="delete"
        onClick={() => onClickDelete(id)}
        sx={{ marginLeft: '30px' }} 
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

export default TableItem;
