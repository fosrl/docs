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

          <div style={styles.customPricing}>Free</div>

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
              Ticket based support
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
              Auto provision IdP users
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
              Robust integration API for automation
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
              Future licensed feature access
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
              <a href="https://fossorial.io/license.html">Fossorial Commercial License</a>
            </li>
          </ul>

          <div style={styles.counterContainer}>
            <span style={styles.counterLabel}>Base Number of Sites</span>
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
          <div style={styles.priceBreakdown}>
            Bulk pricing available.{" "}
            <a href="mailto:numbat@fossorial.io">Contact us</a>
          </div>

          <button
            onClick={() =>
              (window.location.href = `https://payment.fossorial.io/buy/dab98d3d-9976-49b1-9e55-1580059d833f?quantity=${siteCount}`)
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
              Tailored agreements
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
              Dedicated support (meetings & calls)
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
              Custom features
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
              Multi-region & HA deployments
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
              Custom branding (white-labeling)
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
              Deployment references & assistance
            </li>
          </ul>

          <div style={styles.customPricing}>
            Custom pricing <span style={styles.pricePeriod}>($1k+/month)</span>
          </div>

          <a
            href="mailto:numbat@fossorial.io"
            style={{
              ...styles.buttonSecondary,
              textDecoration: "none",
              display: "block",
              textAlign: "center"
            }}
          >
            Schedule a Meeting with Us
          </a>
        </div>
      </div>

      <div style={styles.pricingContainer}>
        <div style={styles.cardLarge}>
          <h1 style={styles.cardTitle}>Professional Edition FAQ</h1>

          <h4>How often will I be billed?</h4>

          <p style={styles.textMuted}>
            The Professional Edition license subscription is billed monthly.
          </p>

          <h4>What if I need more sites?</h4>
          <p style={styles.textMuted}>
            When you purchase the license above you are provided with a key to
            unlock the features and a BASE number of sites for your instance.
          </p>
          <p style={styles.textMuted}>
            You can buy more sites at any time from within your Pangolin
            instance. Navigate to the licensing page, indicate the amount of
            sites you would like to purchase, and complete the order.
          </p>

          <h4>How do I manage all of my keys?</h4>

          <p style={styles.textMuted}>
            You can log into{" "}
            <a href="https://app.lemonsqueezy.com/my-orders/">Lemon Squeezy</a>{" "}
            with the same email that your purchased your keys with. From here
            you can deactivate an instance or manage subscriptions.
          </p>

          <h4>Can I reuse the license keys?</h4>
          <p style={styles.textMuted}>
            No, the license keys are tied to the instance they were purchased
            for. If you need to move your instance to a new server, please log
            into Lemon Squeezy, deactivate the key, and then re-activate it on
            the new server.
          </p>

          <h4>There is an issue with my order!</h4>

          <p style={styles.textMuted}>
            Please <a href="mailto:numbat@fossorial.io">email us</a> immediately
            with any issues.
          </p>

          <h4>Where do I create support tickets?</h4>
          <p style={styles.textMuted}>
            Within 48 hours of your purchase you should receive an email invite
            to our support portal where you can interact with us.
          </p>
          <p style={styles.textMuted}>
            You can then create support tickets in the{" "}
            <a href="https://support.fossorial.io/">support portal</a>.
          </p>

          <h4>
            What is the difference between this and the Supporter Program?
          </h4>
          <p style={styles.textMuted}>
            The Supporter Program is a way to support the project and remove the
            support marks. It is a one time donation. No features are unlocked.
          </p>
          <p style={styles.textMuted}>
            The Professional plan is a paid license that allows you to use the
            software in a commercial environment that unlocks features and
            provides support. It is a monthly subscription.
          </p>

          <h4>What happens if I run out of sites?</h4>

          <p style={styles.textMuted}>
            You will be warned if you go over your site limit before you create
            a site. If you do there will be a banner displayed in the Pangolin
            application and login pages stating you have gone over your limit
            but no functionality of the application will be lost.
          </p>

          <h4>TOS / License</h4>

          <p style={styles.textMuted}>
            By purchasing any Professional Edition license key you agree to
            abide by the{" "}
            <a href="https://fossorial.io/license.html">
              Fossorial Commercial License - Professional Edition Subscription
              Terms
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

// CSS Styles object
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "24px",
    backgroundColor: "var(--ifm-background-color)",
    minHeight: "100vh",
    fontFamily: "var(--ifm-font-family-base)"
  },
  heading: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "48px",
    color: "var(--ifm-font-color-base)"
  },
  pricingContainer: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "center",
    gap: "24px",
    width: "100%",
    padding: "24px",
    flexWrap: "wrap" as const
  },
  card: {
    backgroundColor: "var(--ifm-background-color)",
    borderRadius: "8px",
    boxShadow: "var(--ifm-global-shadow-lw)",
    padding: "24px",
    border: "1px solid var(--ifm-color-emphasis-300)",
    position: "relative" as const,
    overflow: "hidden" as const,
    width: "300px",
    flex: "1 1 300px",
    maxWidth: "400px",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column" as const
  },
  cardLarge: {
    backgroundColor: "var(--ifm-background-color)",
    borderRadius: "8px",
    boxShadow: "var(--ifm-global-shadow-lw)",
    padding: "24px",
    border: "1px solid var(--ifm-color-emphasis-300)",
    position: "relative" as const,
    overflow: "hidden" as const,
    width: "100%",
    flex: "1 1 100%",
    maxWidth: "1250px",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: "24px",
    zIndex: "1"
  },
  highlightedCard: {
    backgroundColor: "var(--ifm-background-color)",
    borderRadius: "8px",
    boxShadow: "var(--ifm-global-shadow-lw)",
    padding: "24px",
    border: "1px solid var(--ifm-color-primary)",
    position: "relative" as const,
    overflow: "hidden" as const,
    width: "300px",
    flex: "1 1 300px",
    maxWidth: "400px",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column" as const,
    zIndex: "1"
  },
  freeTag: {
    position: "absolute" as const,
    top: "0",
    right: "0",
    backgroundColor: "var(--ifm-color-emphasis-200)",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  popularTag: {
    position: "absolute" as const,
    top: "0",
    right: "0",
    backgroundColor: "var(--ifm-color-primary)",
    color: "var(--ifm-color-white)",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "var(--ifm-font-color-base)"
  },
  featureList: {
    listStyleType: "none",
    padding: "0",
    marginBottom: "24px",
    flex: "1"
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    fontSize: "14px",
    color: "var(--ifm-font-color-base)"
  },
  checkIcon: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
    color: "var(--ifm-color-primary)"
  },
  buttonSecondary: {
    width: "100%",
    padding: "8px 16px",
    backgroundColor: "var(--ifm-color-emphasis-200)",
    color: "var(--ifm-font-color-base)",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "14px",
    marginTop: "auto"
  },
  buttonPrimary: {
    width: "100%",
    padding: "8px 16px",
    backgroundColor: "var(--ifm-color-primary)",
    color: "var(--ifm-color-white)",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "14px",
    marginTop: "auto"
  },
  counterContainer: {
    marginBottom: "16px"
  },
  counterLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    fontSize: "14px",
    color: "var(--ifm-font-color-base)"
  },
  counterControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  counterButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--ifm-color-emphasis-200)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  counterInput: {
    width: "48px",
    height: "32px",
    margin: "0 8px",
    textAlign: "center" as const,
    border: "1px solid var(--ifm-color-emphasis-300)",
    borderRadius: "6px",
    backgroundColor: "var(--ifm-background-color)",
    color: "var(--ifm-font-color-base)"
  },
  priceDisplay: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "var(--ifm-font-color-base)"
  },
  pricePeriod: {
    fontSize: "14px",
    fontWeight: "normal",
    color: "var(--ifm-color-emphasis-600)",
    marginLeft: "4px"
  },
  priceBreakdown: {
    fontSize: "14px",
    color: "var(--ifm-color-emphasis-600)",
    marginBottom: "16px"
  },
  customPricing: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "var(--ifm-font-color-base)"
  },
  textMuted: {
    color: "var(--ifm-color-emphasis-600)",
    fontSize: "14px",
    marginBottom: "16px"
  }
};

export default PricingComponent;
