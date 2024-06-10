import { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PredictedChart from "../../components/PredictedChart";

const PredictedLine = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [predictedData, setPredictedData] = useState([]);

  useEffect(() => {
    const savedPredictedData = localStorage.getItem("predictedData");
    if (savedPredictedData) {
      const parsedData = JSON.parse(savedPredictedData);
      const transformedData = transformPredictedData(parsedData);
      setPredictedData(transformedData);
    }
  }, []);

  const transformPredictedData = (data) => {
    return data.map(item => ({
      id: item.product_id.toString(),
      data: [{
        x: new Date(item.month).toISOString().split('T')[0], // Преобразование даты в ISO формат
        y: item['Predicted Sales']
      }]
    }));
  };

  return (
      <>
        <Box m="20px">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="Predicted Chart" subtitle="Welcome to your Predicted Chart" />
          </Box>
          <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridAutoRows="minmax(20px, auto)" // Увеличение высоты строк
              gap="20px"
          >
            <Box
                gridColumn="span 12" // Увеличение ширины на всю ширину
                gridRow="span 8" // Увеличение высоты
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
              <Box height="700px" m="-20px 0 0 0"> {/* Увеличение высоты графика */}
                <PredictedChart
                    isDashboard={true}
                    data={predictedData}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </>
  );
};

export default PredictedLine;
