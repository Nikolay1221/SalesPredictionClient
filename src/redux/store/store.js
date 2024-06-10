
import { configureStore } from '@reduxjs/toolkit';
import tableReducer from '../reducers/tableReducer';
import tableRowReducer from '../reducers/tableRowReducer';

// Объединение всех редьюсеров в один корневой редьюсер
const rootReducer = {
  tableData: tableReducer,
  records: tableRowReducer,
};

// Создание Redux store с поддержкой асинхронных действий
const store = configureStore({
  reducer: rootReducer,
  // Middleware like Redux Thunk is automatically included by configureStore
});

export default store;
