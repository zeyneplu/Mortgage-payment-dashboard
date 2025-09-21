import { useState, useEffect } from 'react'
import './App.css'
import MortgageForm from './components/MortgageForm'
import ResultsDisplay from './components/ResultsDisplay'
import CharityImpact from './components/CharityImpact'
import PaymentChart from './components/PaymentChart'
import { generateAmortizationSchedule } from './utils/mortgageCalculations'

function App() {
  const [mortgageData, setMortgageData] = useState({
    housePrice: 400000,
    downPayment: 80000,
    annualRate: 0.065, // 6.5%
    termYears: 30,
    propertyTaxRate: 0.025, // 2.5% (Texas is around 2-3%)
    homeInsurance: 1500 // Annual home insurance
  })
  
  const [results, setResults] = useState(null)

  useEffect(() => {
    const principal = mortgageData.housePrice - mortgageData.downPayment
    if (principal > 0 && mortgageData.annualRate >= 0 && mortgageData.termYears > 0) {
      try {
        const calculationResults = generateAmortizationSchedule(
          principal,
          mortgageData.annualRate,
          mortgageData.termYears,
          mortgageData.housePrice,
          mortgageData.propertyTaxRate || 0,
          mortgageData.homeInsurance || 0
        )
        setResults(calculationResults)
      } catch (error) {
        console.error('Error calculating mortgage:', error)
        setResults(null)
      }
    } else {
      setResults(null)
    }
  }, [mortgageData])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏠 Mortgage Payment Calculator</h1>
        <p className="subtitle">
          See how much of your money goes to interest instead of charity 💰➡️❤️
        </p>
      </header>
      
      <div className="app-content">
        <div className="input-section">
          <MortgageForm 
            mortgageData={mortgageData}
            setMortgageData={setMortgageData}
          />
        </div>
        
        {results && (
          <div className="main-content">
            <div className="results-section">
              <ResultsDisplay results={results} mortgageData={mortgageData} />
            </div>
            
            <div className="charts-section">
              <PaymentChart results={results} />
            </div>
            
            <div className="charity-section">
              <CharityImpact 
                totalInterest={results.totalInterestPaid} 
                totalTaxes={results.totalTaxesPaid}
                totalInsurance={results.totalInsurancePaid}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
