# 🏠 Mortgage Payment Dashboard

**See the True Cost of Homeownership and How Much Money Could Go to Charity Instead**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://zeyneplu.github.io/Mortgage-payment-dashboard/)
[![React](https://img.shields.io/badge/React-18.x-blue?style=flat&logo=react)](https://reactjs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-orange?style=flat&logo=chart.js)](https://www.chartjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

## 🌟 Features

### 📊 **Complete Mortgage Analysis**
- **Monthly Payment Calculation** using proven mathematical formulas
- **Property Tax Integration** with ZIP code lookup
- **Home Insurance** cost calculations
- **Total Cost Breakdown** over the life of the loan
- **Interactive Charts** showing payment distribution over time

### 📍 **Smart ZIP Code Lookup**
- **Automatic Property Tax Rates** for 50+ major US cities
- **State Averages** as fallback for any ZIP code
- **Real-time Location Detection** (City, State, County)
- **Suggested Tax Rates** for common areas

### 💰 **Charity Impact Analysis**
The core message: **Every dollar spent on interest, taxes, and insurance is a dollar that could have gone to charity.**

See how your mortgage payments could instead:
- 🍽️ **Feed the hungry** (meals provided)
- 📚 **Support education** (school supplies for children)
- 💧 **Provide clean water** (water wells funded)
- 💰 **Enable microfinance** (small business loans)
- 💉 **Improve healthcare** (vaccination programs)

### 📈 **Interactive Visualizations**
- **Payment Timeline Charts** showing principal vs interest over time
- **Monthly Payment Breakdown** with visual indicators
- **Total Cost Distribution** pie charts
- **Real-time Updates** as you adjust inputs

## 🚀 Live Demo

**[Try it now: Mortgage Payment Dashboard](https://zeyneplu.github.io/Mortgage-payment-dashboard/)**

## 🛠️ Technology Stack

- **React 18** - Modern UI framework with hooks
- **Chart.js** - Beautiful, responsive charts
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with gradients and animations
- **JavaScript ES6+** - Modern language features

## 🏗️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/zeyneplu/Mortgage-payment-dashboard.git

# Navigate to project directory
cd Mortgage-payment-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 📋 Usage Guide

### 1. **Enter Basic Information**
- House price
- Down payment amount
- Annual interest rate
- Loan term (years)

### 2. **ZIP Code Lookup (Optional)**
- Enter your 5-digit ZIP code
- System automatically finds local property tax rate
- Or browse suggested rates for common areas

### 3. **Review Results**
- See monthly payment breakdown
- Analyze total costs over loan lifetime
- Understand where every dollar goes

### 4. **Charity Impact Analysis**
- See how much money goes to interest vs principal
- Discover what that money could fund for charity
- Consider alternatives to reduce these costs

## 🧮 Mathematical Foundation

The calculator uses the proven mortgage payment formula:

```
P_t = P × M^t - Y × (M^t - 1)/(M - 1)
```

Where:
- **P** = Principal (loan amount)
- **M** = Monthly multiplier (1 + annual_rate/12)
- **Y** = Monthly payment
- **t** = Time in months

This formula provides mathematically accurate results for:
- Monthly payment calculations
- Remaining balance at any point
- Interest vs principal breakdown
- Total interest paid over loan lifetime

## 🏙️ Supported Locations

### Major Cities with Exact Tax Data
- **Texas**: Dallas, Houston, Austin, San Antonio
- **California**: San Francisco, Los Angeles, Palo Alto
- **New York**: NYC, Brooklyn, Staten Island
- **Florida**: Miami, Orlando, Tampa
- **And 40+ more cities**

### State Coverage
- All 50 US states with average property tax rates
- Automatic fallback to state averages for any ZIP code
- National average (1.21%) as final fallback

## 💡 Why This Matters

### The Hidden Costs of Homeownership
Most people focus only on the monthly payment, but the true cost includes:

1. **Interest Payments** - Often equals or exceeds the home price
2. **Property Taxes** - Ongoing government fees based on home value
3. **Insurance Premiums** - Required protection that goes to insurance companies

### The Charity Perspective
This calculator reveals a sobering truth: **the money spent on interest, taxes, and insurance could instead fund meaningful charitable work.**

For example, a typical $500K mortgage results in:
- **$521K in interest payments** 
- **$375K in property taxes** (30 years in Texas)
- **$45K in insurance premiums**
- **Total: $941K** that could have provided 313,667 meals to hungry people

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Mathematical formulas based on standard mortgage amortization calculations
- Property tax data sourced from public records and tax assessor websites
- Charity impact calculations based on real-world charitable organization costs
- ZIP code lookup using free public APIs

---

**Built with ❤️ to help people understand the true cost of homeownership and consider charitable alternatives.**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
