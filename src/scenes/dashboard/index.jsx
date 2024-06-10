import { useEffect, useMemo, useState, useRef } from "react";
import { Box, Typography, IconButton, useTheme, Button, LinearProgress } from "@mui/material";
import { tokens } from "../../theme";
import RefreshIcon from '@mui/icons-material/Refresh';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import io from "socket.io-client";

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
import PredictedChart from "../../components/PredictedChart";
import axios from "axios";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const tableId = useSelector((state) => state.tableData.tableId);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPredicted, setLoadingPredicted] = useState(false);
  const [predictedData, setPredictedData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [showProgressBar, setShowProgressBar] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (tableId) {
      fetchData();
    }
  }, [tableId]);

  useEffect(() => {
    const savedPredictedData = localStorage.getItem("predictedData");
    const savedProgress = localStorage.getItem("progress");
    const savedCurrentStep = localStorage.getItem("currentStep");
    const savedShowProgressBar = localStorage.getItem("showProgressBar");
    const savedLoadingPredicted = localStorage.getItem("loadingPredicted");
    const savedButtonDisabled = localStorage.getItem("buttonDisabled");

    if (savedPredictedData) {
      const parsedData = JSON.parse(savedPredictedData);
      const transformedData = transformPredictedData(parsedData);
      setPredictedData(transformedData);
    }
    if (savedProgress) setProgress(Number(savedProgress));
    if (savedCurrentStep) setCurrentStep(savedCurrentStep);
    if (savedShowProgressBar) setShowProgressBar(savedShowProgressBar === 'true');
    if (savedLoadingPredicted) setLoadingPredicted(savedLoadingPredicted === 'true');
    if (savedButtonDisabled) setButtonDisabled(savedButtonDisabled === 'true');
  }, []);

  useEffect(() => {
    const socket = io('https://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('progress', (data) => {
      console.log('Progress data:', data);
      const newProgress = ((data.index + 1) / data.total) * 100;
      setProgress(newProgress);
      setCurrentStep(data.step);

      localStorage.setItem("progress", newProgress.toString());
      localStorage.setItem("currentStep", data.step);
      localStorage.setItem("showProgressBar", "true");
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (showProgressBar && progressBarRef.current) {
      progressBarRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showProgressBar]);

  const fetchData = () => {
    setIsLoading(true);
    handleTableRequest(tableId, "get")
        .then((response) => {
          setRows(response.data);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  const fetchPredictedData = async () => {
    if (buttonDisabled) return;

    setButtonDisabled(true);
    setLoadingPredicted(true);
    setShowProgressBar(true);

    localStorage.setItem("loadingPredicted", "true");
    localStorage.setItem("buttonDisabled", "true");

    try {
      const response = await axios.post(`https://localhost:8080/api/predict-sales/${tableId}`);
      const transformedData = transformPredictedData(response.data);
      setPredictedData(transformedData);
      localStorage.setItem("predictedData", JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch predicted data:', error);
    } finally {
      setLoadingPredicted(false);
      setButtonDisabled(false);
      setShowProgressBar(false);

      localStorage.setItem("loadingPredicted", "false");
      localStorage.setItem("buttonDisabled", "false");
      localStorage.setItem("showProgressBar", "false");
    }
  };

  const transformPredictedData = (data) => {
    return data.map(item => {
      const productId = item.product_id ? item.product_id.toString() : 'unknown';
      const month = item.month ? item.month : 'unknown';
      const predictedSales = item['Predicted Sales'] || 0;

      return {
        id: productId,
        color: tokens("dark").greenAccent[500],
        data: [{
          x: month,
          y: predictedSales
        }]
      };
    });
  };

  const totalSales = rows.reduce((sum, { sales }) => sum + Number(sales), 0);
  const totalBackorder = rows.reduce((sum, { backorder }) => sum + Number(backorder), 0);
  const totalBalanceAtStart = rows.reduce((sum, { balanceStart }) => sum + Number(balanceStart), 0);
  const totalProducts = new Set(rows.map((row) => row.product_id));

  const transformedData = useMemo(() => {
    return rows.map((entry) => {
      const { yyyy_MM, sales } = entry;
      const formattedDate = yyyy_MM;

      return {
        x: formattedDate,
        y: sales,
      };
    });
  }, [rows]);

  console.log("Transformed Sales Data: ", transformedData);

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
      acc[yyyy_MM][product_id] = (acc[yyyy_MM][product_id] || 0) + Number(sales);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([month, productsSales]) => {
      const transformedEntry = { month };
      Object.entries(productsSales).forEach(([product_id, sales], index) => {
        transformedEntry[product_id] = sales;
        transformedEntry[`${product_id}Color`] = lineColors[index % lineColors.length];
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

    const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 3);

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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
          </Box>
          <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridAutoRows="140px"
              gap="20px"
          >
            {/* ROW 1 */}
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
              <StatBox
                  title={String(totalSales) + " $"}
                  subtitle="Sales Obtained"
                  icon={
                    <PointOfSaleIcon
                        sx={{ color: colors.redAccent[300], fontSize: "26px" }}
                    />
                  }
              />
            </Box>
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
              <StatBox
                  title={String(totalBackorder)}
                  subtitle="Backorder"
                  icon={
                    <LocalShippingIcon
                        sx={{ color: colors.redAccent[300], fontSize: "26px" }}
                    />
                  }
              />
            </Box>

            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
              <StatBox
                  title={String(totalBalanceAtStart)}
                  subtitle="Total balance at start"
                  icon={
                    <PersonAddIcon
                        sx={{ color: colors.redAccent[300], fontSize: "26px" }}
                    />
                  }
              />
            </Box>
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
              <StatBox
                  title={String(totalProducts.size)}
                  subtitle="Product count"
                  icon={
                    <Inventory2Icon
                        sx={{ color: colors.redAccent[300], fontSize: "26px" }}
                    />
                  }
              />
            </Box>

            {/* ROW 2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
              <Box
                  mt="25px"
                  p="0 30px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
              >
                <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                    style={{ flexGrow: 1 }}
                >
                  Sales Made
                </Typography>
              </Box>
              <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                  style={{ paddingLeft: "30px" }}
              >
                $ {totalSales}
              </Typography>
              {isLoading ? (
                  <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
                    Loading chart data...
                  </Typography>
              ) : (
                  <Box height="250px" m="-20px 0 0 0">
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
              )}
            </Box>

            <Box
                gridColumn="span 4"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                p="30px"
            >
              <Typography variant="h5" fontWeight="600">
                Total sales Pie Chart
              </Typography>

              <PieChart data={pieChartData} />
            </Box>

            {/* ROW 2-2 */}
            <Box
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
              <Box
                  mt="25px"
                  p="0 30px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
              >
                <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                    style={{ flexGrow: 1 }}
                >
                  Predicted Sales
                </Typography>
              </Box>
              <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                  style={{ paddingLeft: "30px" }}
              >
              </Typography>
              {loadingPredicted ? (
                  <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
                    Loading chart data...
                  </Typography>
              ) : (
                  <Box height="250px" m="-20px 0 0 0">
                    <PredictedChart
                        isDashboard={true}
                        data={predictedData}
                    />
                  </Box>
              )}
            </Box>

            <Box
                gridColumn="span 4"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                p="30px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ height: "100%" }}
            >
              <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
              >
                <Button
                    onClick={fetchPredictedData}
                    disabled={buttonDisabled}
                    sx={{
                      backgroundColor: colors.blueAccent[700],
                      color: colors.grey[100],
                      fontSize: "20px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      mb: 2,
                    }}
                >
                  <FileUploadOutlinedIcon sx={{ mr: "30px" }} />
                  Process Data
                </Button>
                <Typography
                    variant="body2"
                    sx={{
                      color: colors.grey[500],
                      textAlign: "center",
                      maxWidth: "80%"
                    }}
                >
                </Typography>
              </Box>
            </Box>

            {showProgressBar && (
                <Box gridColumn="span 12" sx={{ mt: 2 }} ref={progressBarRef}>
                  <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                    Loading Progress: {currentStep} ({Math.round(progress)}%)
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, backgroundColor: colors.greenAccent[100], '& .MuiLinearProgress-bar': { backgroundColor: colors.greenAccent[400] } }} />
                </Box>
            )}

            <Box
                gridColumn="span 12"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
            >
              <Typography
                  variant="h5"
                  fontWeight="600"
                  sx={{ padding: "30px 30px 0 30px" }}
              >
                Sales Quantity
              </Typography>
              <Box height="250px" mt="-20px">
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

export default Dashboard;
