import { useState, useEffect} from "react";

import TableItem from '../../components/TableItem'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { TextField, IconButton, InputAdornment, Box, Pagination } from "@mui/material";
// import { allTables } from "../../Services/MetaDataTablesService";
// import { handleTableRequest } from "../../Services/DataTableService";
// import { useTable } from "../../custom hooks/useTable";

import { useSelector, useDispatch } from 'react-redux';
import { fetchTables, removeTable, setTableId} from '../../redux/actions/tableActions';


const TableHistoryView = () => {
  const [searchInput, setSearchInput] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  // const { setTableId } = useTable();
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const itemsPerPage = 5;

  const tables = useSelector(state => state.tableData.tables);

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);


  const onClickDelete = (id) => {
    dispatch(removeTable(id));
    dispatch(fetchTables());
  };
  
  const onClickTableItem = (id) => {
    dispatch(setTableId(id));
  };

  const onChangeSearchInput = event => {
    setSearchInput(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const filteredResults = tables.filter(table => 
    table.tableName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const renderTableItem = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    return paginatedResults.length === 0 ? (
      <div className="history-cont">
        <p className="empty-cont">There is no table to show</p>
      </div>
    ) : (
      <ul className="history-cont">
        {paginatedResults.map(eachTable => (
          <TableItem
            key={eachTable.id}
            tableDetails={eachTable}
            onClickDelete={onClickDelete}
            onClickTableItem={onClickTableItem}
          />
        ))}
      </ul>
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px', padding: '10px' }}>
        <TextField
          placeholder="Search"
          type="text"
          variant="outlined"
          size="small"
          value={searchInput}
          onChange={onChangeSearchInput}
          sx={{ width: '50%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <IconButton onClick={() => setSearchInput('')}>
                <ClearOutlinedIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      {renderTableItem()}
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Pagination
          size="large"
          count={Math.ceil(tables.filter(eachResult => eachResult.tableName.toLowerCase().includes(searchInput.toLowerCase())).length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
};

export default TableHistoryView;
