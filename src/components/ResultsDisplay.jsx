function ResultsDisplay({ results, mortgageData }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const loanAmount = mortgageData.housePrice - mortgageData.downPayment
  const actualYears = Math.round(results.actualTermMonths / 12 * 10) / 10
  const interestPercentage = ((results.totalInterestPaid / loanAmount) * 100).toFixed(1)

  return (
    <div className="results-display">
      <h2>Payment Breakdown</h2>
      
      <div className="results-grid">
        <div className="result-card primary">
          <h3>Total Monthly Payment</h3>
          <div className="amount">{formatCurrency(results.totalMonthlyPayment)}</div>
          <div className="detail">Principal + Interest + Tax + Insurance</div>
        </div>
        
        <div className="result-card">
          <h3>Principal & Interest Only</h3>
          <div className="amount">{formatCurrency(results.monthlyPayment)}</div>
          <div className="detail">Loan payment only</div>
        </div>
        
        <div className="result-card">
          <h3>Monthly Property Tax</h3>
          <div className="amount">{formatCurrency(results.monthlyTax)}</div>
          <div className="detail">{formatCurrency(results.totalTaxesPaid)} over {actualYears} years</div>
        </div>
        
        <div className="result-card">
          <h3>Monthly Insurance</h3>
          <div className="amount">{formatCurrency(results.monthlyInsurance)}</div>
          <div className="detail">{formatCurrency(results.totalInsurancePaid)} over {actualYears} years</div>
        </div>
        
        <div className="result-card">
          <h3>Loan Term</h3>
          <div className="amount">{actualYears} years</div>
          <div className="detail">({results.actualTermMonths} months)</div>
        </div>
        
        <div className="result-card warning">
          <h3>Total Interest Paid</h3>
          <div className="amount">{formatCurrency(results.totalInterestPaid)}</div>
          <div className="detail">{interestPercentage}% of loan amount</div>
        </div>
      </div>

      <div className="total-cost-breakdown">
        <h3>Total Cost Over {actualYears} Years</h3>
        <div className="cost-grid">
          <div className="cost-item">
            <span className="cost-label">House Price:</span>
            <span className="cost-value">{formatCurrency(mortgageData.housePrice)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Down Payment:</span>
            <span className="cost-value">-{formatCurrency(mortgageData.downPayment)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Loan Principal:</span>
            <span className="cost-value">{formatCurrency(loanAmount)}</span>
          </div>
          <div className="cost-item danger">
            <span className="cost-label">Interest Payments:</span>
            <span className="cost-value">+{formatCurrency(results.totalInterestPaid)}</span>
          </div>
          <div className="cost-item danger">
            <span className="cost-label">Property Taxes:</span>
            <span className="cost-value">+{formatCurrency(results.totalTaxesPaid)}</span>
          </div>
          <div className="cost-item danger">
            <span className="cost-label">Insurance:</span>
            <span className="cost-value">+{formatCurrency(results.totalInsurancePaid)}</span>
          </div>
          <div className="cost-item total">
            <span className="cost-label">TOTAL COST:</span>
            <span className="cost-value">{formatCurrency(results.totalPaid + mortgageData.downPayment)}</span>
          </div>
        </div>
      </div>

      <div className="payment-breakdown">
        <h3>Where Your Monthly ${Math.round(results.totalMonthlyPayment)} Goes</h3>
        <div className="breakdown-bar">
          <div 
            className="principal-portion" 
            style={{ width: `${(results.monthlyPayment / results.totalMonthlyPayment) * 100}%` }}
            title={`Principal & Interest: ${formatCurrency(results.monthlyPayment)}`}
          >
            P&I: {formatCurrency(results.monthlyPayment)}
          </div>
          <div 
            className="tax-portion"
            style={{ width: `${(results.monthlyTax / results.totalMonthlyPayment) * 100}%` }}
            title={`Property Tax: ${formatCurrency(results.monthlyTax)}`}
          >
            Tax: {formatCurrency(results.monthlyTax)}
          </div>
          <div 
            className="insurance-portion"
            style={{ width: `${(results.monthlyInsurance / results.totalMonthlyPayment) * 100}%` }}
            title={`Insurance: ${formatCurrency(results.monthlyInsurance)}`}
          >
            Ins: {formatCurrency(results.monthlyInsurance)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay
