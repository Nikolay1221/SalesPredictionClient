import { Box, Button, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import dayjs from 'dayjs';

import ErrorAlert from '../../Services/uploadData/ErrorAlert';
import SuccessfullAlert from '../../Services/uploadData/SuccessfullAlert';

const DataUpdatedTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [state, setState] = useState({
        deletedSuccess: false,
        deletedError: false,
        deletedMessage: ''
    });

    const updateState = (newState) => setState((prevState) => ({ ...prevState, ...newState }));

    const [rows, setRows] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const tableId = localStorage.getItem("tableId");
            if (tableId) {
                try {
                    const response = await fetch(`http://localhost:8080/api/files/${tableId}/generated-data`);
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    const data = await response.json();
                    setRows(data);
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            }
        };
        fetchData();
    }, []);

    const handleSnackbarClose = () => updateState({
        deletedSuccess: false,
        deletedError: false
    });

    const onClickDelete = async () => {
        const tableId = localStorage.getItem("tableId");
        updateState({ deletedError: false, deletedSuccess: false });

        try {
            for (const rowId of selectionModel) {
                const response = await fetch(`http://localhost:8080/api/filtered-data/${tableId}/${rowId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`Error deleting row ${rowId}: ${response.status}`);
                }

                // Удаляем элемент из localStorage
                const savedPredictedData = localStorage.getItem("predictedData");
                if (savedPredictedData) {
                    const parsedData = JSON.parse(savedPredictedData);
                    const updatedData = parsedData.filter(item => item.id !== rowId);
                    localStorage.setItem("predictedData", JSON.stringify(updatedData));
                }
            }

            // Удаляем строки из состояния
            setRows(rows.filter(row => !selectionModel.includes(row.id)));

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
            headerName: "Product ID",
            flex: 1,
        },
        {
            field: "productcategory",
            headerName: "Product Category",
            flex: 1,
        },
        {
            field: 'month',
            headerName: 'Month',
            flex: 1,
            cellClassName: 'name-column--cell',
            valueFormatter: (params) => {
                if (!params.value) return '';
                return dayjs(params.value).format("M/YYYY");
            },
        },
        {
            field: "balancestart",
            headerName: "Balance Start",
            flex: 1,
        },
        {
            field: "arrival",
            headerName: "Arrival",
            flex: 1,
        },
        {
            field: "expenditure",
            headerName: "Expenditure",
            flex: 1,
        },
        {
            field: "balance end",
            headerName: "Balance End",
            flex: 1,
        },
        {
            field: "turnover",
            headerName: "Turnover",
            flex: 1,
        },
        {
            field: "turnover_diff",
            headerName: "Turnover Diff",
            flex: 1,
        },
        {
            field: "orders",
            headerName: "Orders",
            flex: 1,
        },
        {
            field: "Predicted Sales",
            headerName: "Predicted Sales",
            flex: 1,
        },
        {
            field: "transit",
            headerName: "Transit",
            flex: 1,
        },
        {
            field: "backorder",
            headerName: "Backorder",
            flex: 1,
        },
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

export default DataUpdatedTable;
