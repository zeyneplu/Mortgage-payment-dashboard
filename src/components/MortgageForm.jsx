import { useState, useEffect } from 'react'
import { lookupPropertyTaxByZip, formatTaxInfo, getSuggestedRates } from '../utils/zipCodeLookup'

function MortgageForm({ mortgageData, setMortgageData }) {
  const [localData, setLocalData] = useState(mortgageData)
  const [zipCode, setZipCode] = useState('')
  const [taxLookupStatus, setTaxLookupStatus] = useState('idle') // idle, loading, success, error
  const [taxInfo, setTaxInfo] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Sync local state with parent state
  useEffect(() => {
    setLocalData(mortgageData)
  }, [mortgageData])

  const handleInputChange = (field, value) => {
    // Ensure we have valid numbers and prevent negative values where appropriate
    let sanitizedValue = value
    
    if (field === 'housePrice' || field === 'downPayment' || field === 'homeInsurance') {
      sanitizedValue = Math.max(0, value || 0)
    } else if (field === 'annualRate' || field === 'propertyTaxRate') {
      sanitizedValue = Math.max(0, Math.min(20, value || 0)) // Cap at 20% (as decimal will be /100)
    } else if (field === 'termYears') {
      sanitizedValue = Math.max(1, Math.min(50, value || 1)) // 1-50 years
    }
    
    const newData = { ...localData, [field]: sanitizedValue }
    setLocalData(newData)
    setMortgageData(newData)
  }

  // Handle zip code lookup
  const handleZipCodeLookup = async (zip) => {
    setZipCode(zip)
    
    if (zip.length === 5) {
      setTaxLookupStatus('loading')
      try {
        const taxData = await lookupPropertyTaxByZip(zip)
        setTaxInfo(taxData)
        setTaxLookupStatus('success')
        
        // Auto-fill the property tax rate
        handleInputChange('propertyTaxRate', taxData.rate)
      } catch (error) {
        setTaxLookupStatus('error')
        setTaxInfo(null)
        console.error('Tax lookup failed:', error)
      }
    } else {
      setTaxLookupStatus('idle')
      setTaxInfo(null)
    }
  }

  // Handle suggested rate selection
  const handleSuggestedRate = (rate) => {
    handleInputChange('propertyTaxRate', rate / 100) // Convert percentage to decimal
    setShowSuggestions(false)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value) => {
    return (value * 100).toFixed(2) + '%'
  }

  return (
    <div className="mortgage-form">
      <h2>Mortgage Details</h2>
      
      <div className="form-group">
        <label htmlFor="housePrice">House Price</label>
        <input
          type="number"
          id="housePrice"
          value={localData.housePrice || ''}
          onChange={(e) => handleInputChange('housePrice', parseFloat(e.target.value) || 0)}
          min="0"
          step="1000"
          placeholder="500000"
        />
        <span className="input-display">{formatCurrency(localData.housePrice || 0)}</span>
      </div>

      <div className="form-group">
        <label htmlFor="downPayment">Down Payment</label>
        <input
          type="number"
          id="downPayment"
          value={localData.downPayment || ''}
          onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
          min="0"
          step="1000"
          placeholder="50000"
        />
        <span className="input-display">
          {formatCurrency(localData.downPayment || 0)} 
          ({localData.housePrice > 0 ? (((localData.downPayment || 0) / localData.housePrice) * 100).toFixed(1) : '0.0'}%)
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="annualRate">Annual Interest Rate</label>
        <input
          type="number"
          id="annualRate"
          value={((localData.annualRate || 0) * 100).toFixed(3)}
          onChange={(e) => handleInputChange('annualRate', (parseFloat(e.target.value) || 0) / 100)}
          min="0"
          max="20"
          step="0.001"
          placeholder="6.500"
        />
        <span className="input-display">{formatPercentage(localData.annualRate || 0)}</span>
      </div>

      <div className="form-group">
        <label htmlFor="termYears">Loan Term (Years)</label>
        <input
          type="number"
          id="termYears"
          value={localData.termYears || ''}
          onChange={(e) => handleInputChange('termYears', parseInt(e.target.value) || 0)}
          min="1"
          max="50"
          step="1"
          placeholder="30"
        />
        <span className="input-display">{localData.termYears || 0} years</span>
      </div>

      {/* ZIP CODE LOOKUP SECTION */}
      <div className="form-section">
        <h3>Property Tax Lookup</h3>
        
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code (Auto-lookup tax rate)</label>
          <div className="zip-input-container">
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => handleZipCodeLookup(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="75201"
              maxLength="5"
              className={`zip-input ${taxLookupStatus}`}
            />
            {taxLookupStatus === 'loading' && (
              <div className="loading-spinner">🔄</div>
            )}
            {taxLookupStatus === 'success' && (
              <div className="success-icon">✅</div>
            )}
            {taxLookupStatus === 'error' && (
              <div className="error-icon">❌</div>
            )}
          </div>
          
          {taxInfo && (
            <div className="tax-info-display">
              <div className="tax-location">
                📍 {formatTaxInfo(taxInfo).location}
              </div>
              <div className="tax-rate">
                Property Tax: {formatTaxInfo(taxInfo).percentage}
              </div>
              {taxInfo.note && (
                <div className="tax-note">{taxInfo.note}</div>
              )}
            </div>
          )}
          
          {taxLookupStatus === 'error' && (
            <div className="error-message">
              Unable to find tax rate for this ZIP code. Please enter manually below.
            </div>
          )}
        </div>

        <div className="suggestions-section">
          <button 
            type="button" 
            className="suggestions-toggle"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            {showSuggestions ? 'Hide' : 'Show'} Common Tax Rates
          </button>
          
          {showSuggestions && (
            <div className="tax-suggestions">
              {getSuggestedRates().map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSuggestedRate(suggestion.rate * 100)}
                >
                  <span className="suggestion-label">{suggestion.label}</span>
                  <span className="suggestion-rate">{(suggestion.rate * 100).toFixed(2)}%</span>
                  <span className="suggestion-desc">{suggestion.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="propertyTaxRate">Property Tax Rate (Annual %)</label>
        <input
          type="number"
          id="propertyTaxRate"
          value={((localData.propertyTaxRate || 0) * 100).toFixed(3)}
          onChange={(e) => handleInputChange('propertyTaxRate', (parseFloat(e.target.value) || 0) / 100)}
          min="0"
          max="10"
          step="0.001"
          placeholder="2.500"
        />
        <span className="input-display">
          {formatPercentage(localData.propertyTaxRate || 0)} 
          (${(((localData.housePrice || 0) * (localData.propertyTaxRate || 0)) / 12).toFixed(0)}/month)
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="homeInsurance">Home Insurance (Annual)</label>
        <input
          type="number"
          id="homeInsurance"
          value={localData.homeInsurance || ''}
          onChange={(e) => handleInputChange('homeInsurance', parseFloat(e.target.value) || 0)}
          min="0"
          step="100"
          placeholder="1500"
        />
        <span className="input-display">
          {formatCurrency(localData.homeInsurance || 0)} 
          (${((localData.homeInsurance || 0) / 12).toFixed(0)}/month)
        </span>
      </div>

      <div className="loan-amount">
        <strong>Loan Amount: {formatCurrency((localData.housePrice || 0) - (localData.downPayment || 0))}</strong>
        <div className="monthly-breakdown">
          <div>Monthly Property Tax: {formatCurrency(((localData.housePrice || 0) * (localData.propertyTaxRate || 0)) / 12)}</div>
          <div>Monthly Insurance: {formatCurrency((localData.homeInsurance || 0) / 12)}</div>
        </div>
      </div>
    </div>
  )
}

export default MortgageForm
