import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const PredictedChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const scatterData = data.map(serie => ({
    id: serie.id.toString(),
    data: serie.data.map(d => ({
      x: new Date(d.x),
      y: Number(d.y),
      formattedX: d.x,  // сохраняем исходный формат даты для отображения
      formattedY: d.y.toString()  // форматируем значение y для отображения
    }))
  }));

  return (
      <ResponsiveScatterPlot
          data={scatterData}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.grey[100],
                },
              },
              legend: {
                text: {
                  fill: colors.grey[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.grey[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.grey[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.grey[100],
              },
            },
          }}
          colors={{ scheme: isDashboard ? "category10" : "nivo" }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false
          }}
          yScale={{
            type: "linear",
            min: Math.min(...scatterData.flatMap(serie => serie.data.map(d => d.y))) - 10,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: "%b %d %y",
            legend: "",
            legendPosition: "middle",
            legendOffset: 46,
            tickValues: "every month",
          }}
          axisLeft={{
            legend: "",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          enableGridX={false}
          enableGridY={false}
          nodeSize={8}
          useMesh={true}
          tooltip={() => null}  // No tooltip will be shown
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
      />
  );
};

export default PredictedChart;
