import { ADD_ROW_BY_ID, DELETE_ROW_BY_ID,SET_TABLE_DATA } from '../actions/actionTypes';
import { handleTableDataRequest, handleTableRequest } from '../../Services/DataTableService';

export const addRow = (tableId, values) => async (dispatch) => {
        const response = await handleTableRequest(tableId, 'post', values);
        dispatch({
            type: ADD_ROW_BY_ID,
            payload: response.data  // Передаем только данные, исключая headers и другие несериализуемые свойства
        });
       fetchTableData(tableId)
};

  
export const deleteRow = (tableRowId, tableId) => async (dispatch) => {
    try {
        await handleTableDataRequest(tableRowId, tableId, 'delete');
        dispatch({
           type: DELETE_ROW_BY_ID,
           payload: tableRowId
        });
        dispatch(fetchTableData(tableId)); 
    } catch (error) {
        console.error('Error deleting row:', error);
    }
};
  
export const fetchTableData = (tableId) => async (dispatch) => {
    if (tableId) {
        try {
            const response = await handleTableRequest(tableId, 'get');
            dispatch(setTableData(response.data));
        } catch (error) {
            console.error(error);
        }
    }
};

export const setTableData = (data) => ({
    type: SET_TABLE_DATA,
    payload: data
});