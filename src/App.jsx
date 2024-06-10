import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import DataTable from "./scenes/data_table";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import FAQList from "./scenes/faqs";
import TableHistoryView from "./scenes/History";
import { Provider } from 'react-redux';
import  store from './redux/store/store'
import IntroPage from "./scenes/intro";
import DataUpdatedTable from "./scenes/data_updated_table";
import PredictedLine from "./scenes/predictedline";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <Provider store={store}>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/" element={<LayoutWithSidebarAndTopbar setIsSidebar={setIsSidebar} isSidebar={isSidebar} />}>
              {/* Nested routes for the components that require Sidebar and Topbar */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="data" element={<DataTable />} />
              <Route path="updateddata" element={<DataUpdatedTable />} />
              <Route path="form" element={<Form />} />
              <Route path="history" element={<TableHistoryView />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="predictedline" element={<PredictedLine />} />
              <Route path="faqs" element={<FAQList />} />
              <Route path="geography" element={<Geography />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

function LayoutWithSidebarAndTopbar({ setIsSidebar, isSidebar }) {
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Outlet /> {/* This will render the nested routes */}
      </main>
    </div>
  );
}

export default App;
