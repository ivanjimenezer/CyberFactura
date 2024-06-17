import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // Importing auto version of Chart.js

const SalesChart = ({ salesData }) => {
  const chartContainer = useRef(null);
  const chartRef = useRef(null);

  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Function to filter data based on date range
  const filterData = () => {
    const filtered = salesData.filter(item => {
      const date = new Date(item.Fecha_Formateada.replace(/([A-Za-z]+)\/(\d+)/, '$1 1 $2'));
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return date >= startDateObj && date <= endDateObj;
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
   
    if (chartContainer.current && (salesData || filteredData)) {
      const labels = filteredData.length > 0 ? filteredData.map(item => item.Fecha_Formateada) : salesData.map(item => item.Fecha_Formateada);
      const ingresosTotales = filteredData.length > 0 ? filteredData.map(item => item.Ingresos_Totales) : salesData.map(item => item.Ingresos_Totales);

      const ctx = chartContainer.current.getContext('2d');

      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart instance if exists
      }

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ingresos Totales',
              data: ingresosTotales,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
              hoverBorderColor: 'rgba(54, 162, 235, 1)',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#bec2c1',
                callback: function (value) {
                  return '$' + value;
                },
              },
            },
            x: {
              ticks: {
                color: '#bec2c1', // Set your hex color here
              },
              grid: {
                color: '#bec2c1', // Set your hex color here for the x-axis grid lines
              },
              border: {
                color: '#bec2c1', // Set your hex color here for the x-axis line
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#bec2c1', // Set your hex color here
              },
            },
          },
        },
      });
    }
  }, [salesData, filteredData]);

  // Example usage: filterData(startDate, endDate);

  return (
    <div className="chartplot">  {/* Added classname here */}
      <h2 className='chartTitle'>Total de Ingresos Netos</h2>

      <div className='filter-date'>
        <div className='fechaComienzo'>
          <label>Fecha de Inicio:</label>
          <input type="date" className='input-dateFilter'  value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        <div className='fechaFin'>
          <label>Fecha Final:</label>
          <input type="date" className='input-dateFilter'  value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <button className='btn-dateFilter text-dark ' onClick={filterData}>Aplicar</button>
      </div>

      <canvas className='barChart-Ventas' ref={chartContainer}/>
    </div>
  );
};

export default SalesChart;
