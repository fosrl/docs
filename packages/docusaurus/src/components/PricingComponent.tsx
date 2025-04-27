import { useState } from 'react';

const PricingComponent = () => {
  const [siteCount, setSiteCount] = useState(1);
  
  const handleSiteCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setSiteCount(value);
    } else {
      setSiteCount(1);
    }
  };
  
  const increaseSiteCount = () => {
    setSiteCount(siteCount + 1);
  };
  
  const decreaseSiteCount = () => {
    if (siteCount > 1) {
      setSiteCount(siteCount - 1);
    }
  };
  
  const calculatePrice = () => {
    return 125 + (siteCount * 5);
  };
  
  return (
    <>
      <div style={styles.pricingContainer}>
        {/* Open Source Plan */}
        <div style={styles.card}>
          <div style={styles.freeTag}>FREE</div>
          <h2 style={styles.cardTitle}>Open Source</h2>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Basic features
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Community support
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              1 site
            </li>
          </ul>
          <button style={styles.buttonSecondary} onClick={() => window.location.href = '/Getting%20Started/quick-install'}>
            Get Started
          </button>
        </div>
        
        {/* Professional Plan */}
        <div style={styles.highlightedCard}>
          <div style={styles.popularTag}>POPULAR</div>
          <h2 style={styles.cardTitle}>Professional</h2>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              All Open Source features
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Priority support
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Advanced features
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Multiple sites
            </li>
          </ul>
          
          <div style={styles.counterContainer}>
            <span style={styles.counterLabel}>Number of sites</span>
            <div style={styles.counterControls}>
              <button 
                onClick={decreaseSiteCount}
                style={styles.counterButton}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={siteCount}
                onChange={handleSiteCountChange}
                style={styles.counterInput}
              />
              <button 
                onClick={increaseSiteCount}
                style={styles.counterButton}
              >
                +
              </button>
            </div>
          </div>
          
          <div style={styles.priceDisplay}>
            ${calculatePrice()}<span style={styles.pricePeriod}>/year</span>
          </div>
          
          <div style={styles.priceBreakdown}>
            Base price $125 + ${siteCount} x $5 per site
          </div>
          
          <button 
            onClick={() => window.location.href = `https://payment.fossorial.io/buy/958562da-a87c-4dc8-abba-a3fbfcc1eb7d?quantity=${siteCount}`}
            style={styles.buttonPrimary}
          >
            Subscribe Now
          </button>
        </div>
        
        {/* Enterprise Plan */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Enterprise</h2>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              All Professional features
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Custom agreements
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Dedicated support
            </li>
            <li style={styles.featureItem}>
              <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Unlimited sites
            </li>
          </ul>
          
          <div style={styles.customPricing}>
            Custom pricing
          </div>
          
          <button 
            onClick={() => window.location.href = '/contact'}
            style={styles.buttonDark}
          >
            Contact Sales
          </button>
        </div>
      </div>
      </>
  );
};

// CSS Styles object
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  heading: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '48px',
    color: '#111827'
  },
  pricingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    // maxWidth: '448px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid #e5e7eb',
    position: 'relative',
    overflow: 'hidden'
  },
  highlightedCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid hsl(24.6, 95%, 53.1%)',
    position: 'relative',
    overflow: 'hidden'
  },
  freeTag: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#e5e7eb',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  popularTag: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: 'hsl(24.6, 95%, 53.1%)',
    color: 'white',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827'
  },
  featureList: {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '24px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px'
  },
  checkIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    color: '#10b981'
  },
  buttonSecondary: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#e5e7eb',
    color: '#111827',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px'
  },
  buttonPrimary: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: 'hsl(24.6, 95%, 53.1%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px'
  },
  buttonDark: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px'
  },
  counterContainer: {
    marginBottom: '16px'
  },
  counterLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px'
  },
  counterControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  counterButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  counterInput: {
    width: '48px',
    height: '32px',
    margin: '0 8px',
    textAlign: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '6px'
  },
  priceDisplay: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827'
  },
  pricePeriod: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#6b7280',
    marginLeft: '4px'
  },
  priceBreakdown: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px'
  },
  customPricing: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827'
  }
};

export default PricingComponent;