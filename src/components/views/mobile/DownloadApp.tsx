import { Link } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../../constants/LocalStorage";

const DownloadAppPage = () => {
  const handlePlayStoreClick = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=YOUR_ANDROID_APP_PACKAGE_NAME",
      "_blank"
    );
  };

  const handleAppStoreClick = () => {
    window.open(
      "https://apps.apple.com/us/app/your-app-name/idYOUR_IOS_APP_ID",
      "_blank"
    );
  };

  const storedLoginStatus = localStorage.getItem(
    LOCALSTORAGE_KEYS.LOGIN_STATUS
  );
  const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;

  if(isLoggedIn){
    localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
    localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
    localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS)
    localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
    localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
    localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Optimize Your Experience!</h1>
      <p style={styles.paragraph}>
        It looks like you're on a mobile device. For the best performance and
        exclusive features, we recommend downloading our dedicated application.
      </p>

      <div style={styles.buttonGroup}>
        <button onClick={handlePlayStoreClick} style={styles.button}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Get it on Google Play"
            style={styles.icon}
          />
          <span>Get it on Google Play</span>
        </button>

        <button onClick={handleAppStoreClick} style={styles.button}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
            alt="Download on the App Store"
            style={styles.icon}
          />
          <span>Download on the App Store</span>
        </button>
      </div>

      <p style={styles.continueLink}>
          <Link to={ROUTES_URL.LANDING_PAGE} style={styles.continueLinkText}>
            No thanks, continue to the dashboard
          </Link>
      </p>
    </div>
  );
};

const styles: {
  container: React.CSSProperties;
  heading: React.CSSProperties;
  paragraph: React.CSSProperties;
  buttonGroup: React.CSSProperties;
  button: React.CSSProperties;
  icon: React.CSSProperties;
  continueLink: React.CSSProperties;
  continueLinkText: React.CSSProperties;
  "button:hover"?: React.CSSProperties;
} = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f7f6",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  heading: {
    fontSize: "2em",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  paragraph: {
    fontSize: "1.1em",
    marginBottom: "30px",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: window.innerWidth < 768 ? "column" : "row",
    gap: "20px",
    marginBottom: "30px",
  },
  button: {
    display: "flex",
    alignItems: "start",
    justifyContent: "between",
    padding: "15px 30px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    gap: "10px",
    borderRadius: "8px",
    fontSize: "1.1em",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
    textDecoration: "none",
  },
  icon: {
    height: "30px",
    marginRight: "10px",
  },
  continueLink: {
    marginTop: "20px",
    fontSize: "0.9em",
  },
  continueLinkText: {
    color: "#007bff",
    textDecoration: "none",
  },
  "button:hover": {
    backgroundColor: "#0056b3",
  },
};

export default DownloadAppPage;
