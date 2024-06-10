import { ADD_ROW_BY_ID, DELETE_ROW_BY_ID, SET_TABLE_DATA } from '../actions/actionTypes';

const initialState = {
  tableRows: [],
  tableRowId: null 
};

function tableRowReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ROW_BY_ID:
      return {
        ...state,
        tableRows: [...state.tableRows, action.payload]
      };
    case DELETE_ROW_BY_ID:
      return {
        ...state,
        tableRows: state.tableRows.filter(tableRow => tableRow.id !== action.payload)
      };
    case SET_TABLE_DATA:
        return {
          ...state,
          tableRows: action.payload
        };
    default:
      return state;
  }
}

export default tableRowReducer;
