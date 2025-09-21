/**
 * Mortgage Calculator using the mathematical proof formula
 * P_t = P * M^t - Y * (M^t - 1) / (M - 1)
 * where:
 * P = Principal (house price)
 * I = Annual interest rate
 * M = Monthly multiplier = 1 + I/12
 * Y = Monthly payment
 * t = time in months
 */

/**
 * Calculate monthly payment using the derived formula
 * Y = P * M^N * (M - 1) / (M^N - 1)
 */
export function calculateMonthlyPayment(principal, annualRate, termYears) {
  const monthlyRate = annualRate / 12;
  const M = 1 + monthlyRate; // Monthly multiplier
  const N = termYears * 12; // Total number of payments
  
  if (monthlyRate === 0) {
    return principal / N; // No interest case
  }
  
  const numerator = principal * Math.pow(M, N) * (M - 1);
  const denominator = Math.pow(M, N) - 1;
  
  return numerator / denominator;
}

/**
 * Calculate remaining balance after t months using the proof formula
 * P_t = P * M^t - Y * (M^t - 1) / (M - 1)
 */
export function calculateRemainingBalance(principal, annualRate, monthlyPayment, monthsPaid) {
  const monthlyRate = annualRate / 12;
  const M = 1 + monthlyRate; // Monthly multiplier
  
  if (monthlyRate === 0) {
    return principal - (monthlyPayment * monthsPaid);
  }
  
  const Mt = Math.pow(M, monthsPaid);
  const principalGrowth = principal * Mt;
  const paymentReduction = monthlyPayment * (Mt - 1) / (M - 1);
  
  return principalGrowth - paymentReduction;
}

/**
 * Generate complete amortization schedule with taxes and insurance
 */
export function generateAmortizationSchedule(principal, annualRate, termYears, housePrice, propertyTaxRate, homeInsurance) {
  // Safety checks
  if (principal <= 0 || annualRate < 0 || termYears <= 0) {
    return {
      schedule: [],
      monthlyPayment: 0,
      monthlyTax: 0,
      monthlyInsurance: 0,
      totalMonthlyPayment: 0,
      totalInterestPaid: 0,
      totalTaxesPaid: 0,
      totalInsurancePaid: 0,
      totalPaid: 0,
      actualTermMonths: 0
    };
  }

  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  const monthlyTax = ((housePrice || 0) * (propertyTaxRate || 0)) / 12;
  const monthlyInsurance = (homeInsurance || 0) / 12;
  const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance;
  
  const monthlyRate = annualRate / 12;
  const totalMonths = termYears * 12;
  
  const schedule = [];
  let balance = principal;
  let totalInterestPaid = 0;
  let totalTaxesPaid = 0;
  let totalInsurancePaid = 0;
  
  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    totalInterestPaid += interestPayment;
    totalTaxesPaid += monthlyTax;
    totalInsurancePaid += monthlyInsurance;
    
    // Ensure balance doesn't go negative due to floating point precision
    if (balance < 0.01) balance = 0;
    
    schedule.push({
      month,
      principalAndInterest: monthlyPayment,
      principalPayment,
      interestPayment,
      propertyTax: monthlyTax,
      insurance: monthlyInsurance,
      totalPayment: totalMonthlyPayment,
      remainingBalance: balance,
      totalInterestPaid,
      totalTaxesPaid,
      totalInsurancePaid
    });
    
    if (balance === 0) break;
  }
  
  return {
    schedule,
    monthlyPayment,
    monthlyTax,
    monthlyInsurance,
    totalMonthlyPayment,
    totalInterestPaid,
    totalTaxesPaid,
    totalInsurancePaid,
    totalPaid: (monthlyPayment * schedule.length) + totalTaxesPaid + totalInsurancePaid,
    actualTermMonths: schedule.length
  };
}

/**
 * Calculate how long it takes to pay off the mortgage
 */
export function calculatePayoffTime(principal, annualRate, monthlyPayment) {
  const monthlyRate = annualRate / 12;
  const M = 1 + monthlyRate;
  
  if (monthlyRate === 0) {
    return principal / monthlyPayment;
  }
  
  // Using the formula: t = log(1 + (P * r / Y)) / log(1 + r)
  // where r is monthly rate, P is principal, Y is monthly payment
  const numerator = Math.log(1 + (principal * monthlyRate / monthlyPayment));
  const denominator = Math.log(M);
  
  return numerator / denominator;
}

/**
 * Calculate charity impact - what could be done with interest + tax money
 */
export function calculateCharityImpact(totalInterest, totalTaxes, totalInsurance) {
  const totalWastedMoney = totalInterest + totalTaxes + totalInsurance;
  return {
    totalInterest,
    totalTaxes,
    totalInsurance,
    totalWastedMoney,
    // Examples of what this money could do for charity
    mealsProvided: Math.floor(totalWastedMoney / 3), // $3 per meal
    schoolSupplies: Math.floor(totalWastedMoney / 50), // $50 per child per year
    waterWells: Math.floor(totalWastedMoney / 10000), // $10,000 per well
    microloans: Math.floor(totalWastedMoney / 200), // $200 per microloan
    vaccinations: Math.floor(totalWastedMoney / 20), // $20 per vaccination set
    breakdown: {
      interestMeals: Math.floor(totalInterest / 3),
      taxMeals: Math.floor(totalTaxes / 3),
      insuranceMeals: Math.floor(totalInsurance / 3)
    }
  };
}
