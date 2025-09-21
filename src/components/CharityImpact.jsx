import { calculateCharityImpact } from '../utils/mortgageCalculations'

function CharityImpact({ totalInterest, totalTaxes, totalInsurance }) {
  const impact = calculateCharityImpact(totalInterest, totalTaxes || 0, totalInsurance || 0)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className="charity-impact">
      <h2>💸 Money Lost to Interest, Taxes & Insurance - Charity Impact Analysis</h2>
      <p className="impact-intro">
        Instead of paying <strong>{formatCurrency(impact.totalWastedMoney)}</strong> to banks, government, and insurance companies, 
        this money could have made a real difference in the world:
      </p>

      <div className="waste-breakdown">
        <div className="waste-item">
          <span className="waste-label">Interest to Bank:</span>
          <span className="waste-value">{formatCurrency(impact.totalInterest)}</span>
        </div>
        <div className="waste-item">
          <span className="waste-label">Property Taxes:</span>
          <span className="waste-value">{formatCurrency(impact.totalTaxes)}</span>
        </div>
        <div className="waste-item">
          <span className="waste-label">Insurance Premiums:</span>
          <span className="waste-value">{formatCurrency(impact.totalInsurance)}</span>
        </div>
        <div className="waste-item total">
          <span className="waste-label">TOTAL WASTED:</span>
          <span className="waste-value">{formatCurrency(impact.totalWastedMoney)}</span>
        </div>
      </div>
      
      <div className="impact-grid">
        <div className="impact-card">
          <div className="impact-icon">🍽️</div>
          <h3>Meals for the Hungry</h3>
          <div className="impact-number">{formatNumber(impact.mealsProvided)}</div>
          <div className="impact-detail">meals provided ($3 each)</div>
          <div className="impact-breakdown">
            Interest: {formatNumber(impact.breakdown.interestMeals)} | 
            Taxes: {formatNumber(impact.breakdown.taxMeals)} | 
            Insurance: {formatNumber(impact.breakdown.insuranceMeals)}
          </div>
        </div>
        
        <div className="impact-card">
          <div className="impact-icon">📚</div>
          <h3>Education Support</h3>
          <div className="impact-number">{formatNumber(impact.schoolSupplies)}</div>
          <div className="impact-detail">children's school supplies for a year ($50 each)</div>
        </div>
        
        <div className="impact-card">
          <div className="impact-icon">💧</div>
          <h3>Clean Water Access</h3>
          <div className="impact-number">{formatNumber(impact.waterWells)}</div>
          <div className="impact-detail">water wells built ($10,000 each)</div>
        </div>
        
        <div className="impact-card">
          <div className="impact-icon">💰</div>
          <h3>Microfinance</h3>
          <div className="impact-number">{formatNumber(impact.microloans)}</div>
          <div className="impact-detail">microloans to entrepreneurs ($200 each)</div>
        </div>
        
        <div className="impact-card">
          <div className="impact-icon">💉</div>
          <h3>Healthcare</h3>
          <div className="impact-number">{formatNumber(impact.vaccinations)}</div>
          <div className="impact-detail">vaccination sets ($20 each)</div>
        </div>
      </div>

      <div className="impact-summary">
        <h3>The Real Cost of Homeownership</h3>
        <p>
          Every dollar paid in interest, taxes, and insurance is a dollar that could have been used to make the world a better place. 
          Consider alternatives like:
        </p>
        <ul>
          <li>💰 Making a larger down payment to reduce interest</li>
          <li>🏠 Buying a less expensive home in a lower-tax area</li>
          <li>📈 Renting and investing the difference in charitable causes</li>
          <li>⏰ Paying off the mortgage early to reduce total interest</li>
          <li>🤝 Exploring community lending or credit unions with lower rates</li>
          <li>🏘️ Considering areas with lower property tax rates</li>
          <li>🛡️ Shopping for cheaper insurance while maintaining coverage</li>
        </ul>
      </div>
    </div>
  )
}

export default CharityImpact
