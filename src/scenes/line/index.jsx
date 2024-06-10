import { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import LineChartTime from "../../components/LineChartTime";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Inventory2Icon from '@mui/icons-material/Inventory2';

import { useSelector } from "react-redux";
import { handleTableRequest } from "../../Services/DataTableService";
import PieChart from "../../components/PieChart";

const Line = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const tableId = useSelector((state) => state.tableData.tableId);

  const [rows, setRows] = useState([
    
  ]);

  useEffect(() => {
    console.log(tableId);
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
  useEffect(() => {
    console.log("rows", rows);
  }, [rows]);

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
  


  return (
    <>
      <Box m="20px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="LINE CHART" subtitle="Welcome to your line chart" />
        </Box>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          
          {/* ROW 2 */}
          <Box
            gridColumn="span 12"
            gridRow="span 5"
            backgroundColor={colors.primary[400]}
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Sales Made
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  $ {totalSales}
                </Typography>
              </Box>
            </Box>
            <Box height="700px" m="-20px 0 0 0">
              <LineChartTime
                isDashboard={true}
                data={[
                  {
                    id: "total sales",
                    color: tokens("dark").greenAccent[500],
                    data: transformedData,
                  },
                ]}
              />
            </Box>
          </Box>
        

          
        </Box>
      </Box>
    </>
  );
};

export default Line;
