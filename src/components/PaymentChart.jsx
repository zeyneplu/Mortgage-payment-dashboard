import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function PaymentChart({ results }) {
  // Sample data every 12 months for performance
  const sampledData = results.schedule.filter((_, index) => index % 12 === 0 || index === results.schedule.length - 1)
  
  const lineChartData = {
    labels: sampledData.map(payment => `Year ${Math.ceil(payment.month / 12)}`),
    datasets: [
      {
        label: 'Principal Payment',
        data: sampledData.map(payment => payment.principalPayment),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
      },
      {
        label: 'Interest Payment',
        data: sampledData.map(payment => payment.interestPayment),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
      },
      {
        label: 'Remaining Balance',
        data: sampledData.map(payment => payment.remainingBalance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
      },
    ],
  }

  const lineChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Payment Breakdown Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y
            if (context.datasetIndex === 2) {
              return `${context.dataset.label}: $${value.toLocaleString()}`
            }
            return `${context.dataset.label}: $${value.toFixed(2)}`
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Monthly Payment ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0)
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Remaining Balance ($)'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return '$' + (value / 1000).toFixed(0) + 'k'
          }
        }
      },
    },
  }

  const doughnutData = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [
          results.totalPaid - results.totalInterestPaid,
          results.totalInterestPaid
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Total Payment Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`
          }
        }
      }
    },
  }

  return (
    <div className="payment-charts">
      <h2>📊 Payment Visualization</h2>
      
      <div className="charts-container">
        <div className="chart-wrapper">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        
        <div className="chart-wrapper doughnut">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="chart-summary">
            <h3>Key Insights</h3>
            <ul>
              <li>🔴 <strong>Interest:</strong> ${results.totalInterestPaid.toLocaleString()}</li>
              <li>🟢 <strong>Principal:</strong> ${(results.totalPaid - results.totalInterestPaid).toLocaleString()}</li>
              <li>📈 <strong>Interest %:</strong> {((results.totalInterestPaid / results.totalPaid) * 100).toFixed(1)}% of total payments</li>
              <li>⏰ <strong>Payoff Time:</strong> {Math.round(results.actualTermMonths / 12 * 10) / 10} years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentChart
