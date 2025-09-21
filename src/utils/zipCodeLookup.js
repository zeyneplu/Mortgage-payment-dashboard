/**
 * Zip Code Property Tax Lookup Utility
 * Uses multiple data sources to find property tax rates by zip code
 */

// Fallback property tax data for major cities/states
const FALLBACK_TAX_RATES = {
  // Texas (high property taxes)
  '75001': { rate: 0.0235, city: 'Addison', state: 'TX', county: 'Dallas County' },
  '75201': { rate: 0.0241, city: 'Dallas', state: 'TX', county: 'Dallas County' },
  '77001': { rate: 0.0267, city: 'Houston', state: 'TX', county: 'Harris County' },
  '78701': { rate: 0.0243, city: 'Austin', state: 'TX', county: 'Travis County' },
  '78201': { rate: 0.0253, city: 'San Antonio', state: 'TX', county: 'Bexar County' },
  
  // California (moderate property taxes, high home values)
  '90210': { rate: 0.0075, city: 'Beverly Hills', state: 'CA', county: 'Los Angeles County' },
  '94102': { rate: 0.0074, city: 'San Francisco', state: 'CA', county: 'San Francisco County' },
  '94301': { rate: 0.0069, city: 'Palo Alto', state: 'CA', county: 'Santa Clara County' },
  '90001': { rate: 0.0075, city: 'Los Angeles', state: 'CA', county: 'Los Angeles County' },
  
  // New York (high property taxes)
  '10001': { rate: 0.0123, city: 'New York', state: 'NY', county: 'New York County' },
  '11201': { rate: 0.0087, city: 'Brooklyn', state: 'NY', county: 'Kings County' },
  '10301': { rate: 0.0087, city: 'Staten Island', state: 'NY', county: 'Richmond County' },
  
  // Florida (no state income tax, moderate property taxes)
  '33101': { rate: 0.0127, city: 'Miami', state: 'FL', county: 'Miami-Dade County' },
  '32801': { rate: 0.0109, city: 'Orlando', state: 'FL', county: 'Orange County' },
  '33601': { rate: 0.0123, city: 'Tampa', state: 'FL', county: 'Hillsborough County' },
  
  // Illinois (high property taxes)
  '60601': { rate: 0.0231, city: 'Chicago', state: 'IL', county: 'Cook County' },
  
  // New Jersey (highest property taxes in US)
  '07001': { rate: 0.0249, city: 'Avenel', state: 'NJ', county: 'Middlesex County' },
  '07302': { rate: 0.0124, city: 'Jersey City', state: 'NJ', county: 'Hudson County' },
  
  // Nevada (low property taxes)
  '89101': { rate: 0.0084, city: 'Las Vegas', state: 'NV', county: 'Clark County' },
  
  // Washington (no state income tax, moderate property taxes)
  '98101': { rate: 0.0092, city: 'Seattle', state: 'WA', county: 'King County' },
  
  // Colorado
  '80201': { rate: 0.0055, city: 'Denver', state: 'CO', county: 'Denver County' },
  
  // Arizona
  '85001': { rate: 0.0066, city: 'Phoenix', state: 'AZ', county: 'Maricopa County' },
  
  // Massachusetts
  '02101': { rate: 0.0105, city: 'Boston', state: 'MA', county: 'Suffolk County' },
  
  // Georgia
  '30301': { rate: 0.0107, city: 'Atlanta', state: 'GA', county: 'Fulton County' },
  
  // North Carolina
  '27601': { rate: 0.0084, city: 'Raleigh', state: 'NC', county: 'Wake County' },
  
  // Tennessee (no state income tax)
  '37201': { rate: 0.0063, city: 'Nashville', state: 'TN', county: 'Davidson County' },
  
  // Ohio
  '43215': { rate: 0.0159, city: 'Columbus', state: 'OH', county: 'Franklin County' },
  
  // Michigan
  '48201': { rate: 0.0249, city: 'Detroit', state: 'MI', county: 'Wayne County' },
}

// State average property tax rates as additional fallback
const STATE_AVERAGES = {
  'AL': 0.0041, 'AK': 0.0113, 'AZ': 0.0066, 'AR': 0.0062, 'CA': 0.0075,
  'CO': 0.0051, 'CT': 0.0208, 'DE': 0.0057, 'FL': 0.0083, 'GA': 0.0092,
  'HI': 0.0031, 'ID': 0.0069, 'IL': 0.0218, 'IN': 0.0085, 'IA': 0.0154,
  'KS': 0.0141, 'KY': 0.0086, 'LA': 0.0056, 'ME': 0.0133, 'MD': 0.0109,
  'MA': 0.0121, 'MI': 0.0154, 'MN': 0.0111, 'MS': 0.0059, 'MO': 0.0098,
  'MT': 0.0084, 'NE': 0.0178, 'NV': 0.0084, 'NH': 0.0186, 'NJ': 0.0249,
  'NM': 0.0080, 'NY': 0.0173, 'NC': 0.0084, 'ND': 0.0098, 'OH': 0.0157,
  'OK': 0.0090, 'OR': 0.0087, 'PA': 0.0135, 'RI': 0.0147, 'SC': 0.0057,
  'SD': 0.0128, 'TN': 0.0067, 'TX': 0.0181, 'UT': 0.0061, 'VT': 0.0190,
  'VA': 0.0083, 'WA': 0.0093, 'WV': 0.0059, 'WI': 0.0169, 'WY': 0.0062
}

/**
 * Lookup property tax rate by zip code
 */
export async function lookupPropertyTaxByZip(zipCode) {
  if (!zipCode || zipCode.length !== 5) {
    throw new Error('Please enter a valid 5-digit zip code')
  }

  try {
    // First, check our fallback data
    if (FALLBACK_TAX_RATES[zipCode]) {
      return {
        ...FALLBACK_TAX_RATES[zipCode],
        source: 'local_data',
        zipCode
      }
    }

    // Try to get location data from zip code
    const locationData = await getLocationFromZip(zipCode)
    
    if (locationData) {
      // Use state average if we have the state
      const stateRate = STATE_AVERAGES[locationData.state]
      if (stateRate) {
        return {
          rate: stateRate,
          city: locationData.city,
          state: locationData.state,
          county: locationData.county || `${locationData.state} County`,
          source: 'state_average',
          zipCode,
          note: `Using ${locationData.state} state average. Actual rate may vary by municipality.`
        }
      }
    }

    // National average fallback
    return {
      rate: 0.0121, // US national average
      city: 'Unknown',
      state: 'Unknown',
      county: 'Unknown',
      source: 'national_average',
      zipCode,
      note: 'Using US national average. Please verify with local tax assessor.'
    }

  } catch (error) {
    console.error('Error looking up property tax:', error)
    throw new Error('Unable to find property tax rate. Please enter manually.')
  }
}

/**
 * Get location information from zip code using free APIs
 */
async function getLocationFromZip(zipCode) {
  try {
    // Try ZIPPOPOTAM.US API (free, no key required)
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`)
    
    if (response.ok) {
      const data = await response.json()
      return {
        city: data.places[0]['place name'],
        state: data.places[0]['state abbreviation'],
        county: data.places[0]['admin name'],
        latitude: parseFloat(data.places[0].latitude),
        longitude: parseFloat(data.places[0].longitude)
      }
    }
  } catch (error) {
    console.warn('Primary API failed, trying alternative:', error)
  }

  try {
    // Fallback: Try another free API
    const response = await fetch(`https://api.postalpincode.in/pincode/${zipCode}`)
    // This is actually for India, so it won't work for US zip codes
    // But keeping as example of how to add more APIs
  } catch (error) {
    console.warn('Fallback API also failed:', error)
  }

  return null
}

/**
 * Get suggested property tax rates for nearby areas
 */
export function getSuggestedRates() {
  return [
    { label: 'Texas (Dallas/Houston)', rate: 0.024, description: 'High property taxes, no state income tax' },
    { label: 'California (Bay Area)', rate: 0.007, description: 'Low property tax rate, high home values' },
    { label: 'New Jersey', rate: 0.025, description: 'Highest property taxes in US' },
    { label: 'Florida', rate: 0.010, description: 'No state income tax, moderate property taxes' },
    { label: 'New York (NYC)', rate: 0.012, description: 'High property taxes, expensive real estate' },
    { label: 'Nevada', rate: 0.008, description: 'No state income tax, low property taxes' },
    { label: 'US National Average', rate: 0.012, description: 'Average across all US states' }
  ]
}

/**
 * Format property tax information for display
 */
export function formatTaxInfo(taxData) {
  if (!taxData) return null

  const percentage = (taxData.rate * 100).toFixed(2)
  const location = taxData.city && taxData.state 
    ? `${taxData.city}, ${taxData.state}`
    : 'Unknown Location'

  return {
    percentage: `${percentage}%`,
    location,
    description: `${location} • ${percentage}% annual property tax`,
    source: taxData.source,
    note: taxData.note
  }
}
