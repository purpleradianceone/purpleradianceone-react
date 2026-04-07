import { useState } from "react";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import {  createConnectWhatsappAccount } from "../../../../../config/apis/IntegrationApis";
import {  MessageCircleIcon } from "lucide-react";


type ConnectionStatus = "idle" | "loading" | "success" | "error";

interface ConnectedPage {
  pageId: string;
  pageName: string;
}

/**
 * WHATSAPP PHONE NUMBER ADDITION COMPONENT
 * 
 * Displays pop up card to add phone number
 * 
 * @param {function} handleRefreshApiCall - function call to refresh to list of records, whenever we add new record
 * @returns  Rendered Component - to add whatsapp phone number
 */
export default function WhatsappPhoneNumberAddition({
  handleRefreshApiCall,
}:{
  handleRefreshApiCall : ()=> void;
}) {
  const { loginStatus } = useLoggedInUserContext();
  const [pageId, setPageId] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [message, setMessage] = useState("");
  const [connectedPage, setConnectedPage] = useState<ConnectedPage | null>(
    null,
  );


  // api call to add
  const handleSubmit = async () => {
    if (!pageId.trim()) {
      setStatus("error");
      setMessage("Please enter a Page ID.");
      return;
    }

    setStatus("loading");
    setMessage("");

    
    try {
        //Note : need to make changes here
      const postData = {
        company_id: loginStatus.companyId,
        page_id: pageId.trim(),
        company_user_id: loginStatus.id,
        createdby_id: loginStatus.id,
      };

      const res = await createConnectWhatsappAccount(postData);

      // backend returns plain string on success e.g. "Page 'Crm test page' connected successfully!"
      const responseText =
        typeof res.data === "string"
          ? res.data
          : (res.data?.message ?? "Connected");

      const page: ConnectedPage = {
        pageId: pageId.trim(),
        pageName: responseText,
      };
      if (res.data.status) {
        setStatus("success");
      } else {
        setStatus("error");
      }
      setConnectedPage(page);
      setMessage(responseText);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setStatus("error");
      // Spring error object comes in error.response.data
      const data = error?.response?.data;
      const errMsg =
        typeof data === "string"
          ? data
          : (data?.message ?? "Failed to connect page."); //  extract message field
      setMessage(errMsg);
    }finally{
      // Note : to refresh the page list perform the refresh api call
      handleRefreshApiCall()
    }
  };

  const handleReset = () => {
    setPageId("");
    setStatus("idle");
    setMessage("");
    setConnectedPage(null);
  };

  return (
    <div className="w-full flex items-center  justify-center">
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.fbIcon}>
            {/* <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg> */}
            <MessageCircleIcon className="text-white"/>
          </div>
          <div>
            <h2 style={styles.title}>Integrate Whatsapp Account</h2>
            <p style={styles.subtitle}>
              Link your whatsapp Account to receive leads in your CRM
            </p>
          </div>
        </div>

        {/* Success State */}
        {status === "success" && connectedPage ? (
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✓</div>
            <div>
              <p style={styles.successTitle}>Page Connected!</p>
              <p style={styles.successSub}>
                <strong>{connectedPage.pageName}</strong> is now sending leads
                to your CRM.
              </p>
              <p style={styles.pageIdBadge}>Page ID: {connectedPage.pageId}</p>
            </div>
            <button style={styles.resetBtn} onClick={handleReset}>
              Connect another page
            </button>
          </div>
        ) : (
          <>
            {/* Input Section */}
            <div style={styles.inputSection}>
              <label style={styles.label}>Whatsapp Phone Number</label>
              <div style={styles.inputRow}>
                <input
                  style={{
                    ...styles.input,
                    borderColor: status === "error" ? "#ef4444" : "#e2e8f0",
                    boxShadow:
                      status === "error"
                        ? "0 0 0 3px rgba(239,68,68,0.1)"
                        : "none",
                  }}
                  type="text"
                  placeholder="e.g. 97******13"
                  value={pageId}
                  onChange={(e) => {
                    setPageId(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={status === "loading"}
                />
                <button
                  style={{
                    ...styles.connectBtn,
                    opacity: status === "loading" ? 0.7 : 1,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                  }}
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span style={styles.spinner} />
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>

              {/* Error message */}
              {status === "error" && <p style={styles.errorMsg}>⚠ {message}</p>}
            </div>

            {/* Requirements */}
            <div style={styles.requirementsList}>
              <p style={styles.reqTitle}>Requirements</p>
              <div style={styles.reqItem}>
                <span style={styles.reqDot} />
                Whatsapp number must <strong>not</strong>  have Whatsapp Account on any device. 
                {/* You must be an <strong>Admin</strong> of the page */}
              </div>
              <div style={styles.reqItem}>
                <span style={styles.reqDot} />
                If it has Whatsapp Account on any device then deactivate it completely and try again.
                {/* Page must have an active <strong>Lead Ad form</strong> */}
              </div>
              <div style={styles.reqItem}>
                <span style={styles.reqDot} />
                Facebook OAuth must be <strong>completed</strong> first
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    // margin: "5px",
    fontFamily: "'DM Sans', sans-serif",
    background: "#ffffff",
    // border: "1px solid #e2e8f0",
    // borderRadius: "16px",
    padding: "15px",
    // maxWidth: "680px",
    width: "100%",
    // boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  fbIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(24,119,242,0.35)",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    margin: "2px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  inputSection: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
    letterSpacing: "0.2px",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  connectBtn: {
    padding: "11px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "90px",
    transition: "opacity 0.2s",
    fontFamily: "inherit",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  errorMsg: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#ef4444",
    fontWeight: 500,
  },
  helpBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px 18px",
    marginBottom: "16px",
  },
  helpTitle: {
    margin: "0 0 10px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  helpList: {
    margin: "0 0 10px",
    paddingLeft: "18px",
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.7",
  },
  helpLink: {
    fontSize: "13px",
    color: "#1877f2",
    fontWeight: 600,
    textDecoration: "none",
  },
  requirementsList: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
  },
  reqTitle: {
    margin: "0 0 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  reqItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#475569",
    marginBottom: "6px",
  },
  reqDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#1877f2",
    flexShrink: 0,
  },
  successCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "12px 0",
    gap: "12px",
  },
  successIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    fontSize: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
  },
  successTitle: {
    margin: "0 0 4px",
    fontSize: "17px",
    fontWeight: 700,
    color: "#0f172a",
  },
  successSub: {
    margin: "0 0 8px",
    fontSize: "14px",
    color: "#475569",
  },
  pageIdBadge: {
    display: "inline-block",
    background: "#f1f5f9",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    color: "#64748b",
    fontFamily: "monospace",
    margin: 0,
  },
  resetBtn: {
    marginTop: "8px",
    background: "none",
    border: "1.5px solid #1877f2",
    color: "#1877f2",
    borderRadius: "8px",
    padding: "9px 20px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
