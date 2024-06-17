import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importing auto version of Chart.js

const TopProductsChart = ({ topProducts }) => {
  const chartContainer = useRef(null); // Reference to the canvas element
  const chartRef = useRef(null); // Reference to the Chart.js instance

  useEffect(() => {
    if (chartContainer.current && topProducts) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart instance if exists
      }
      
      const ctx = chartContainer.current.getContext('2d');

      // Extracting labels and frequencies from topProducts data
      const labels = topProducts.map(item => item.Producto);
      const frequencies = topProducts.map(item => item.Frecuencia);

      // Creating new Chart.js instance
      chartRef.current = new Chart(ctx, {
        type: 'bar', // Bar chart
        data: {
          labels: labels, // X-axis labels (product names)
          datasets: [
            {
              label: 'Top Selling Products', // Dataset label
              data: frequencies, // Y-axis data (frequencies)
              backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar background color
              borderColor: '#bec2c1', // Bar border color
              borderWidth: 1, // Bar border width
            },
          ],
        },
        options: {
          indexAxis: 'y', // Display bars horizontally
          scales: {
            x: {
              beginAtZero: true, // Start the X-axis at zero
              ticks: {
                color: '#bec2c1', // Set x-axis labels color
              },
               
              border: {
                color: '#bec2c1', // Set x-axis border color
              },
            },
            y: {
              ticks: {
                color: '#bec2c1', // Set y-axis labels color
              },
              border: {
                color: '#bec2c1', // Set x-axis border color
              },
              
            },
          },
          plugins: {
            legend: {
              display: false, // Hide legend
              labels: {
                color: '#bec2c1', // Legend labels color
              },
            },
            
          },
        },
      });
    }
  }, [topProducts]);

  return (
    <div className='chartplot'>
      <h2 className='chartTitle'>Productos más vendidos</h2>
      
        {/* Canvas element for the chart */}
        <canvas className='barChart-Horizonal' ref={chartContainer}  />
      
    </div>
  );
};

export default TopProductsChart;
