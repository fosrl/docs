import { useState } from "react";
import Layout from "@theme/Layout";

const PricingComponent = () => {
  const [siteCount, setSiteCount] = useState(3);

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
    return 125 + siteCount * 5;
  };

  return (
    <Layout title="Pricing" description="Fossorial Pricing Options">
      {/* Pricing Cards */}

      <div style={styles.pricingContainer}>
        {/* Open Source Plan */}
        <div style={styles.card}>
          <div style={styles.freeTag}>FREE</div>
          <h2 style={styles.cardTitle}>Open Source</h2>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Perfect for individuals and small teams
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Community support
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Licensed under AGPL-3.0
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
                <a href="/supporter-program">Check out the Supporter Program</a>
            </li>
          </ul>
          <button
            style={styles.buttonSecondary}
            onClick={() =>
              (window.location.href = "/Getting%20Started/quick-install")
            }
          >
            Get Started
          </button>
        </div>

        {/* Professional Plan */}
        <div style={styles.highlightedCard}>
          <div style={styles.popularTag}>MOST BUSINESSES</div>
          <h2 style={styles.cardTitle}>Professional</h2>
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              All Open Source features
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Ticketed support
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Auto Provision IDP Users
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Robust integration APIs for automation
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Fossorial Commercial License
            </li>
          </ul>

          <div style={styles.counterContainer}>
            <span style={styles.counterLabel}>Number of sites</span>
            <div style={styles.counterControls}>
              <button onClick={decreaseSiteCount} style={styles.counterButton}>
                -
              </button>
              <input
                type="number"
                min="1"
                value={siteCount}
                onChange={handleSiteCountChange}
                style={styles.counterInput}
              />
              <button onClick={increaseSiteCount} style={styles.counterButton}>
                +
              </button>
            </div>
          </div>

          <div style={styles.priceDisplay}>
            ${calculatePrice()}
            <span style={styles.pricePeriod}>/month</span>
          </div>

          <div style={styles.priceBreakdown}>
            Base price $125 + ${siteCount} x $5 per site
          </div>

          <button
            onClick={() =>
              (window.location.href = `https://payment.fossorial.io/buy/958562da-a87c-4dc8-abba-a3fbfcc1eb7d?quantity=${siteCount}`)
            }
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
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              All Professional Features
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Tailored Agreements
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Dedicated Support (Meetings & Calls)
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Custom Features
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Multi-region & HA Deployments
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Custom Branding (white-labeling)
            </li>
            <li style={styles.featureItem}>
              <svg
                style={styles.checkIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Deployment References & Assistance
            </li>
          </ul>

          <div style={styles.customPricing}>Custom pricing <span style={styles.pricePeriod}>(1k+/month)</span></div>

          <a
            href="mailto:numbat@fossorial.io"
            style={{
              ...styles.buttonSecondary,
              textDecoration: "none",
              display: "block",
              textAlign: "center"
            }}
          >
            Schedule a Meet with Us
          </a>
        </div>
      </div>
    </Layout>
  );
};


// CSS Styles object
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: 'var(--ifm-background-color)',
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '24px',
    width: '100%',
    padding: '24px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'var(--ifm-card-background-color, white)',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid var(--ifm-color-emphasis-300, #e5e7eb)',
    position: 'relative',
    overflow: 'hidden',
    width: '300px',
    flex: '1 1 300px',
    maxWidth: '400px',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column'
  },
  highlightedCard: {
    backgroundColor: 'var(--ifm-card-background-color, white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid var(--ifm-color-primary, hsl(24.6, 95%, 53.1%))',
    position: 'relative',
    overflow: 'hidden',
    width: '300px',
    flex: '1 1 300px',
    maxWidth: '400px',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: '1'
  },
  freeTag: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: 'var(--ifm-color-emphasis-200, #e5e7eb)',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  popularTag: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: 'var(--ifm-color-primary, hsl(24.6, 95%, 53.1%))',
    color: 'var(--ifm-color-white, white)',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    // color: 'var(--ifm-heading-color, #111827)'
  },
  featureList: {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '24px',
    flex: '1'
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
    backgroundColor: 'var(--ifm-color-emphasis-200, #e5e7eb)',
    color: 'var(--ifm-color-emphasis-900, #111827)',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    marginTop: 'auto'
  },
  buttonPrimary: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: 'var(--ifm-color-primary, hsl(24.6, 95%, 53.1%))',
    color: 'var(--ifm-color-white, white)',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    marginTop: 'auto'
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
    backgroundColor: 'var(--ifm-color-emphasis-200, #f3f4f6)',
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
    // color: 'var(--ifm-heading-color, #111827)'
  },
  pricePeriod: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: 'var(--ifm-color-emphasis-600, #6b7280)',
    marginLeft: '4px'
  },
  priceBreakdown: {
    fontSize: '14px',
    color: 'var(--ifm-color-emphasis-600, #6b7280)',
    marginBottom: '16px'
  },
  customPricing: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    // color: 'var(--ifm-heading-color, #111827)'
  }
};


export default PricingComponent;
