import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importing auto version of Chart.js

const TopClientsChart = ({ topClients }) => {
  const chartContainer = useRef(null); // Reference to the canvas element
  const chartRef = useRef(null); // Reference to the Chart.js instance

  useEffect(() => {
    if (chartContainer.current && topClients) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart instance if exists
      }
      
      const ctx = chartContainer.current.getContext('2d');

      // Extracting labels and quantities from topClients data
      const labels = topClients.map(item => item.Cliente);
      const quantities = topClients.map(item => item['Cantidad de Compras']);

      // Creating new Chart.js instance
      chartRef.current = new Chart(ctx, {
        type: 'pie', // Pie chart
        data: {
          labels: labels, // Client names as labels
          datasets: [
            {
              label: 'Frecuencia de Ventas', // Dataset label
              data: quantities, // Quantities as data
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Red
                'rgba(54, 162, 235, 0.6)', // Blue
                'rgba(255, 206, 86, 0.6)', // Yellow
                'rgba(75, 192, 192, 0.6)', // Green
                'rgba(153, 102, 255, 0.6)', // Purple
              ], // Background colors for each segment
              borderColor: 'white', // Border color
              borderWidth: 1, // Border width
            },
          ],
        },
        options: {
          responsive: true, // Make the chart responsive
          plugins: {
            legend: {
              display: true, // Display legend
              position: 'right', // Position legend on the right
            },
          },
        },
      });
    }
  }, [topClients]);

  return (
    <div className="chartplot">
      <h2 className='chartTitle'>Clientes con más compras</h2>
      <div>
        {/* Canvas element for the chart */}
        <canvas ref={chartContainer} className='pieChart-TopClientes' />
      </div>
    </div>
  );
};

export default TopClientsChart;
