import { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../components/Header";

import BarChart from "../../components/BarChart";



import { useSelector } from "react-redux";
import { handleTableRequest } from "../../Services/DataTableService";

const Bar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const tableId = useSelector((state) => state.tableData.tableId);

  const [rows, setRows] = useState([
    
  ]);

  useEffect(() => {
    if (tableId) {
      handleTableRequest(tableId, "get")
        .then((response) => {
          setRows(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [tableId]);
  console.log(tableId);


  const totalSales = rows.reduce((sum, { sales }) => sum + Number(sales), 0);
  const totalBackorder = rows.reduce(
    (sum, { backorder }) => sum + Number(backorder),
    0
  );
  const totalBalanceAtStart = rows.reduce(
    (sum, { balanceStart }) => sum + Number(balanceStart),
    0
  );
  const totalProducts = new Set(rows.map((row) => row.product_id));

  const transformedData = rows.map((entry) => {
    const { yyyy_MM, sales } = entry;
    const [year, month] = yyyy_MM.split("-");
    const formattedDate = `${year}-${month}-01`; // Format date as 'YYYY-MM-DD'

    return {
      x: formattedDate,
      y: sales,
    };
  });

  const transformedDataForBarChart = useMemo(() => {
    const lineColors = [
      tokens("dark").blueAccent[300],
      tokens("dark").greenAccent[500],
      tokens("dark").redAccent[200],
      tokens("dark").blueAccent[400],
      tokens("dark").greenAccent[400],
      tokens("dark").redAccent[300],
      tokens("dark").grey[200],
      tokens("dark").primary[300],
      tokens("dark").grey[300],
      tokens("dark").primary[400],
      tokens("dark").grey[400],
      tokens("dark").greenAccent[300],
      tokens("dark").redAccent[400],
      tokens("dark").blueAccent[500],
      tokens("dark").grey[500],
      tokens("dark").primary[500],
    ];
    const groupedData = rows.reduce((acc, { product_id, yyyy_MM, sales }) => {
      if (!acc[yyyy_MM]) acc[yyyy_MM] = {};
      acc[yyyy_MM][product_id] =
        (acc[yyyy_MM][product_id] || 0) + Number(sales);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([month, productsSales]) => {
      const transformedEntry = { month };
      Object.entries(productsSales).forEach(([product_id, sales], index) => {
        transformedEntry[product_id] = sales;
        transformedEntry[`${product_id}Color`] =
          lineColors[index % lineColors.length];
      });
      return transformedEntry;
    });
  }, [rows]);

  const uniqueProductIds = useMemo(() => {
    const productIds = rows.map((row) => row.product_id);
    return [...new Set(productIds)];
  }, [rows]);

  const pieChartData = useMemo(() => {
    const productSales = rows.reduce((acc, { product_id, sales }) => {
      if (!acc[product_id]) {
        acc[product_id] = 0;
      }
      acc[product_id] += Number(sales);
      return acc;
    }, {});
  
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 3); 
  
    return topProducts.map(([productId, sales], index) => {
      const hue = (index * 137) % 360; 
      return {
        id: productId,
        label: productId,
        value: sales,
        color: `hsl(${hue}, 70%, 50%)`, 
      };
    });
  }, [rows]);
  

  console.log(pieChartData);

  return (
    <>
      <Box m="20px" >
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Bar Chart" subtitle="Welcome to your bar" />
        </Box>

        {/* Bar */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          

          {/* ROW 1 */}

          <Box
            gridColumn="span 12"
            gridRow="span 5"
            backgroundColor={colors.primary[400]}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ padding: "30px 30px 0 30px" }}
            >
              Sales Quantity
            </Typography>
            <Box height="700px" mt="-20px">
              <BarChart
                indexBy="month"
                keys={uniqueProductIds}
                isDashboard={true}
                data={transformedDataForBarChart}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Bar;
