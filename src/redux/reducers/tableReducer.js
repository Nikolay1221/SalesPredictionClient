import { ADD_TABLE, REMOVE_TABLE, SET_TABLES, SET_TABLE_ID } from '../actions/actionTypes';

const initialState = {
  tables: [],
  tableId: sessionStorage.getItem('tableId')  // Добавьте tableId в начальное состояние
};

function tableReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TABLE:
      return {
        ...state,
        tables: [...state.tables, action.payload]
      };
    case REMOVE_TABLE:
      return {
        ...state,
        tables: state.tables.filter(table => table.id !== action.payload)
      };
    case SET_TABLES:
      return {
        ...state,
        tables: action.payload
      };
    case SET_TABLE_ID:
      return {
        ...state,
        tableId: action.payload  
      };
    default:
      return state;
  }
}

export default tableReducer;
