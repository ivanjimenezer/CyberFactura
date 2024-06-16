import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importing auto version of Chart.js

const IVASalesHistogram = ({ retencionSales }) => {
  const chartContainer = useRef(null); // Reference to the canvas element
  const chartRef = useRef(null); // Reference to the Chart.js instance

  useEffect(() => {
    if (chartContainer.current && retencionSales) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart instance if exists
      }
      
      const ctx = chartContainer.current.getContext('2d');

      // Sorting retencionSales data by frequencies in descending order
      const sortedData = retencionSales.sort((a, b) => b.Frecuencia - a.Frecuencia);

      // Extracting labels and frequencies from sortedData
      const labels = sortedData.map(item => item.Producto);
      const frequencies = sortedData.map(item => item.Frecuencia);

      // Generating random colors for bars
      const colors = [];
      for (let i = 0; i < frequencies.length; i++) {
        colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);
      }

      // Creating new Chart.js instance
      chartRef.current = new Chart(ctx, {
        type: 'bar', // Bar chart
        data: {
          labels: labels, // X-axis labels (product names)
          datasets: [
            {
              label: 'Cantidad', // Dataset label
              data: frequencies, // Y-axis data (frequencies)
              backgroundColor: colors, // Background colors for bars
              borderColor: 'rgba(0, 0, 0, 0.6)', // Border color
              borderWidth: 1, // Border width
            },
          ],
        },
        options: {
          responsive: true, // Make the chart responsive
          scales: {
            y: {
              beginAtZero: true, // Start the Y-axis at zero
              title: {
                display: true,
                text: 'Fecuencia', // Y-axis label
              },
            },
            x: {
              title: {
                display: true,
                text: 'Producto/Servicio', // X-axis label
              },
            },
          },
          plugins: {
            legend: {
              display: false, // Hide legend
            },
          },
        },
      });
    }
  }, [retencionSales]);

  return (
    <div className="chartplot">
      <h2 className='chartTitle'>Productos más vendidos con IVA</h2>
      <div>
        {/* Canvas element for the chart */}
        <canvas className='chart-histogramIVA' ref={chartContainer}/>
      </div>
    </div>
  );
};

export default IVASalesHistogram;
