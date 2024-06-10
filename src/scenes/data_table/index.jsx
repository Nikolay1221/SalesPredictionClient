import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme, Button } from "@mui/material";
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { deleteRow, fetchTableData } from "../../redux/actions/tableRowActions";

import ErrorAlert from '../../Services/uploadData/ErrorAlert';
import SuccessfullAlert from '../../Services/uploadData/SuccessfullAlert';


const DataTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    deletedSuccess: false,
    deletedError: false,
    deletedMessage: ''
  });
  
  const updateState = (newState) => setState((prevState) => ({ ...prevState, ...newState }));

  const tableId = useSelector(state => state.tableData.tableId);
  const rows = useSelector(state => state.records.tableRows); 
  const [selectionModel, setSelectionModel] = useState([]);
  // console.log(rows);

  useEffect(() => {
    dispatch(fetchTableData(tableId));
  }, [tableId, dispatch]);

  const handleSnackbarClose = () => updateState({
    deletedSuccess: false,
    deletedError: false
  });


  const onClickDelete = () => {
    updateState({ deletedError: false, deletedSuccess: false });
    try {
      selectionModel.forEach(rowId => {
        dispatch(deleteRow(rowId, tableId));
      });
      dispatch(fetchTableData(tableId));
      updateState({
        deletedSuccess: true,
        deletedMessage: 'Deleted successfully!',
      });
    } catch (error) {
      console.error('Delete error:', error);
      updateState({
        deletedError: true,
        deletedMessage: 'Could not delete row',
      });
    }
    setSelectionModel([]);
  };
  

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "product_id",
      headerName: "product id",
      flex: 1,
    },
    {
      field: 'yyyy_MM',
      headerName: 'YYYY_MM',
      flex: 1,
      cellClassName: 'name-column--cell',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return dayjs(params.value, "YYYY_MM").format("M/YYYY");
      },
    },
    {
      field: "backorder",
      headerName: "City Backorder",
      flex: 1,
    },
    {
      field: "balanceStart",
      headerName: "balance_start",
      flex: 1,
    },
    {
      field: "productCategory",
      headerName: "product category",
      flex: 1,
    },
    {
      field: "min",
      headerName: "Minimum",
      flex: 1,
    },
    {
      field: "max",
      headerName: "Maximum",
      flex: 1,
    },
    {
      field: "transit",
      headerName: "Transit",
      flex: 1,
    },
   
    {
      field: "sales",
      headerName: "Sales",
      flex: 1,
    }
  ];

  return (
    <Box m="20px">
      <Header title="Data Table" subtitle="List of Data you uploaded" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.redAccent[300],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.redAccent[300],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Box
  sx={{
    display: 'flex',
    justifyContent: 'right', 
    margin: '20px',
    padding: '20px' 
  }}
>
  <Button
    variant="contained"
    color="error"
     onClick={onClickDelete}
    disabled={selectionModel.length === 0}
  >
    Delete Selected
  </Button>
</Box>
     <SuccessfullAlert open={state.deletedSuccess} onClose={handleSnackbarClose} message={state.deletedMessage} />
     <ErrorAlert open={state.deletedError} onClose={handleSnackbarClose} message={state.deletedMessage} />
    </Box>
  );
};

export default DataTable;
