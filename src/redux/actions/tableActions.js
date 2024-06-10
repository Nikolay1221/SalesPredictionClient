// src/actions/tableActions.js

import { ADD_TABLE, REMOVE_TABLE, SET_TABLES, SET_TABLE_ID } from './actionTypes';
import { allTables } from '../../Services/MetaDataTablesService';
import { handleTableRequest } from '../../Services/DataTableService';
import CloudUploadService from '../../Services/uploadData/CloudUploadService';

export const addTable = (table) => ({
  type: ADD_TABLE,
  payload: table
});

export const removeTable = (tableId) => async (dispatch) => {
    try {
        await handleTableRequest(tableId, 'delete');
        dispatch({
            type: REMOVE_TABLE,
            payload: tableId
        });
        dispatch(fetchTables()); 
    } catch (error) {
        console.error('Error deleting table:', error);
    }
};

export const uploadTableFile = (file, onProgress) => async (dispatch) => {
    const updateProgress = (progress) => {
      console.log(`Upload progress: ${progress}%`);
      onProgress(progress);
    };

    const cloudUploadService = new CloudUploadService(updateProgress);

    const uploadResponse = await cloudUploadService.uploadFile(file);
    console.log('File uploaded successfully:', uploadResponse);

    await dispatch(fetchTables()); 
    const { metaDataId } = uploadResponse;
    await dispatch(setTableId(metaDataId));  
 
};

export const setTables = (tables) => ({
    type: SET_TABLES,
    payload: tables
});

// export const setTableId = (id) => ({
//     type: SET_TABLE_ID,
//     payload: id
//   });
export const setTableId = (id) => {
  sessionStorage.setItem('tableId', id);
  return {
      type: SET_TABLE_ID,
      payload: id
  };
};


export const fetchTables = () => async (dispatch) => {
  try {
    const response = await allTables();
    dispatch(setTables(response.data)); 
    console.log(response);
  } catch (error) {
    console.error('Ошибка загрузки таблиц:', error);
  }  
 };