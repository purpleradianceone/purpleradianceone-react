import { useState } from "react";

const STEPS = [
  { id: 1, label: "Connect Facebook" },
  { id: 2, label: "Lead Access" },
  { id: 3, label: "Connect Page" },
  { id: 4, label: "Done" },
];

// interface FacebookSetupProps {
//   companyId: number;
//   apiBaseUrl?: string;
//   onComplete?: () => void;
// }

export default function FacebookLeadAccessSetupPage(
    // {
//   companyId,
//   apiBaseUrl = "/api/main/purple-crm-api",
//   onComplete,
// }: FacebookSetupProps

) {
  const [currentStep, setCurrentStep] = useState(2);
//   const [verifying, setVerifying] = useState(false);
//   const [verifyStatus, setVerifyStatus] = useState<"idle" | "success" | "error">("idle");
//   const [verifyMessage, setVerifyMessage] = useState("");
//   const [pageId, setPageId] = useState("");
//   const [connecting, setConnecting] = useState(false);
//   const [connectMessage, setConnectMessage] = useState("");
//   const [connectStatus, setConnectStatus] = useState<"idle" | "success" | "error">("idle");

//   const handleVerify = async () => {
//     setVerifying(true);
//     setVerifyStatus("idle");
//     setVerifyMessage("");
//     try {
//       const res = await fetch(
//         `${apiBaseUrl}/facebook/verify-lead-access?companyId=${companyId}`
//       );
//       const data = await res.json();
//       if (res.ok && data.status) {
//         setVerifyStatus("success");
//         setVerifyMessage("Lead access verified successfully!");
//         setTimeout(() => setCurrentStep(3), 1000);
//       } else {
//         setVerifyStatus("error");
//         setVerifyMessage(data.message ?? "Lead access not set up yet. Please complete the step above.");
//       }
//     } catch {
//       setVerifyStatus("error");
//       setVerifyMessage("Verification failed. Please try again.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const handleConnectPage = async () => {
//     if (!pageId.trim()) {
//       setConnectStatus("error");
//       setConnectMessage("Please enter your Page ID.");
//       return;
//     }
//     setConnecting(true);
//     setConnectStatus("idle");
//     setConnectMessage("");
//     try {
//       const res = await fetch(
//         `${apiBaseUrl}/facebook/connect-page?companyId=${companyId}&pageId=${pageId.trim()}`,
//         { method: "POST" }
//       );
//       const text = await res.text();
//       if (res.ok) {
//         setConnectStatus("success");
//         setConnectMessage(text);
//         setTimeout(() => setCurrentStep(4), 1000);
//       } else {
//         setConnectStatus("error");
//         setConnectMessage(text || "Failed to connect page.");
//       }
//     } catch {
//       setConnectStatus("error");
//       setConnectMessage("Network error. Please try again.");
//     } finally {
//       setConnecting(false);
//     }
//   };

  return (
    <div style={s.page}>
      {/* background grid */}
      <div style={s.bgGrid} />

      <div style={s.card}>
        {/* header */}
        <div style={s.header}>
          <div style={s.fbBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div>
            <h1 style={s.title}>Facebook Integration</h1>
            <p style={s.subtitle}>Complete setup to start receiving leads</p>
          </div>
        </div>

        {/* stepper */}
        <div style={s.stepper}>
          {STEPS.map((step, idx) => (
            <div key={step.id} style={s.stepWrapper}>
              <div style={{
                ...s.stepDot,
                background: currentStep > step.id
                  ? "#22c55e"
                  : currentStep === step.id
                  ? "#1877f2"
                  : "#e2e8f0",
                color: currentStep >= step.id ? "white" : "#94a3b8",
                boxShadow: currentStep === step.id
                  ? "0 0 0 4px rgba(24,119,242,0.15)"
                  : "none",
              }}>
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <span style={{
                ...s.stepLabel,
                color: currentStep === step.id ? "#0f172a" : "#94a3b8",
                fontWeight: currentStep === step.id ? 600 : 400,
              }}>
                {step.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div style={{
                  ...s.stepLine,
                  background: currentStep > step.id ? "#22c55e" : "#e2e8f0",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 2: Lead Access Manager ── */}
        {currentStep === 2 && (
          <div style={s.stepContent}>
            <div style={s.stepIcon}>🔐</div>
            <h2 style={s.stepTitle}>Enable Lead Access</h2>
            <p style={s.stepDesc}>
              You need to allow our app to read leads from your Facebook page.
              This is a one-time setup in Meta Business Suite.
            </p>

            {/* instructions */}
            <div style={s.instructionBox}>
              <p style={s.instructionTitle}>Follow these steps:</p>
              {[
                {
                  num: "1",
                  text: "Click the button below to open Meta Business Suite",
                },
                {
                  num: "2",
                  text: "Go to Business Settings → Integrations → Leads Access",
                },
                {
                  num: "3",
                  text: "Find your Facebook page in the list",
                },
                {
                  num: "4",
                  text: 'Under "CRMs" → Click "Assign CRM" → Search for your app → Assign',
                },
                {
                  num: "5",
                  text: "Come back here and click Verify below",
                },
              ].map((item) => (
                <div key={item.num} style={s.instructionItem}>
                  <div style={s.instructionNum}>{item.num}</div>
                  <p style={s.instructionText}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* open meta button */}
            <a
              href="https://business.facebook.com/settings/leads-access"
              target="_blank"
              rel="noopener noreferrer"
              style={s.metaBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Open Meta Business Suite →
            </a>

            <div style={s.divider} />

            {/* verify status */}
            {/* {verifyStatus === "error" && (
              <div style={s.errorBox}>
                ⚠️ {verifyMessage}
              </div>
            )}
            {verifyStatus === "success" && (
              <div style={s.successBox}>
                ✅ {verifyMessage}
              </div>
            )} */}

            {/* verify button */}
            {/* <button
              style={{
                ...s.verifyBtn,
                opacity: verifying ? 0.7 : 1,
                cursor: verifying ? "not-allowed" : "pointer",
              }}
            //   onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? (
                <>
                  <span style={s.spinner} />
                  Verifying...
                </>
              ) : (
                "Verify & Continue →"
              )}
            </button> */}

            <p style={s.skipNote}>
              Not set up yet?{" "}
              <span
                style={s.skipLink}
                onClick={() => setCurrentStep(3)}
              >
                Skip for now
              </span>{" "}
              — you can complete this later.
            </p>
          </div>
        )}

        {/* ── STEP 3: Connect Page ── */}
        {currentStep === 3 && (
          <div style={s.stepContent}>
            <div style={s.stepIcon}>📄</div>
            <h2 style={s.stepTitle}>Connect Your Facebook Page</h2>
            <p style={s.stepDesc}>
              Enter your Facebook Page ID to start receiving leads in your CRM.
            </p>

            {/* how to find page id */}
            <div style={s.instructionBox}>
              <p style={s.instructionTitle}>How to find your Page ID:</p>
              {[
                { num: "1", text: "Go to your Facebook Page" },
                { num: "2", text: 'Click "About" in the left menu' },
                { num: "3", text: 'Scroll down to find "Page ID"' },
              ].map((item) => (
                <div key={item.num} style={s.instructionItem}>
                  <div style={s.instructionNum}>{item.num}</div>
                  <p style={s.instructionText}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* page id input */}
            {/* <div style={s.inputGroup}>
              <label style={s.inputLabel}>Facebook Page ID</label>
              <input
                style={{
                  ...s.input,
                  borderColor: connectStatus === "error" ? "#ef4444" : "#e2e8f0",
                }}
                type="text"
                placeholder="e.g. 1012524338613313"
                value={pageId}
                onChange={(e) => {
                  setPageId(e.target.value);
                  if (connectStatus !== "idle") setConnectStatus("idle");
                }}
                // onKeyDown={(e) => e.key === "Enter" && handleConnectPage()}
              />
            </div> */}

            {/* {connectStatus === "error" && (
              <div style={s.errorBox}>⚠️ {connectMessage}</div>
            )}
            {connectStatus === "success" && (
              <div style={s.successBox}>✅ {connectMessage}</div>
            )} */}

            {/* <button
              style={{
                ...s.verifyBtn,
                opacity: connecting ? 0.7 : 1,
                cursor: connecting ? "not-allowed" : "pointer",
              }}
            //   onClick={handleConnectPage}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <span style={s.spinner} />
                  Connecting...
                </>
              ) : (
                "Connect Page →"
              )}
            </button> */}

            <button style={s.backBtn} onClick={() => setCurrentStep(2)}>
              ← Back
            </button>
          </div>
        )}

        {/* ── STEP 4: Done ── */}
        {currentStep === 4 && (
          <div style={{ ...s.stepContent, alignItems: "center", textAlign: "center" }}>
            <div style={s.doneIcon}>🎉</div>
            <h2 style={s.stepTitle}>You're All Set!</h2>
            <p style={s.stepDesc}>
              Your Facebook page is connected and leads will start flowing
              into your CRM automatically.
            </p>

            <div style={s.doneCard}>
              <div style={s.doneItem}>
                <span style={s.doneCheck}>✓</span>
                Facebook account connected
              </div>
              <div style={s.doneItem}>
                <span style={s.doneCheck}>✓</span>
                Lead Access Manager configured
              </div>
              <div style={s.doneItem}>
                <span style={s.doneCheck}>✓</span>
                Page subscribed to lead notifications
              </div>
            </div>

            <button
              style={s.doneBtn}
            //   onClick={onComplete}
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    fontFamily: "'DM Sans', sans-serif",
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.5,
    pointerEvents: "none",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "560px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "32px",
  },
  fbBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(24,119,242,0.3)",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.4px",
  },
  subtitle: {
    margin: "2px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "36px",
    gap: 0,
  },
  stepWrapper: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column" as const,
    position: "relative",
    gap: "6px",
  },
  stepDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    zIndex: 1,
  },
  stepLabel: {
    fontSize: "11px",
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.2px",
  },
  stepLine: {
    position: "absolute",
    top: "16px",
    left: "60%",
    right: "-40%",
    height: "2px",
    transition: "background 0.3s ease",
    zIndex: 0,
  },
  stepContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  stepIcon: {
    fontSize: "36px",
    lineHeight: 1,
  },
  stepTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  stepDesc: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  instructionBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  instructionTitle: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    marginBottom: "4px",
  },
  instructionItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  instructionNum: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#1877f2",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "1px",
  },
  instructionText: {
    margin: 0,
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.5",
  },
  metaBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    color: "white",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 4px 12px rgba(24,119,242,0.3)",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "4px 0",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "13px",
    color: "#dc2626",
    fontWeight: 500,
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "12px 14px",
    fontSize: "13px",
    color: "#16a34a",
    fontWeight: 500,
  },
  verifyBtn: {
    padding: "13px 20px",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(24,119,242,0.25)",
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
  skipNote: {
    margin: 0,
    fontSize: "13px",
    color: "#94a3b8",
    textAlign: "center" as const,
  },
  skipLink: {
    color: "#1877f2",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  inputLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  backBtn: {
    background: "none",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "11px 20px",
    fontSize: "14px",
    color: "#64748b",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  doneIcon: {
    fontSize: "52px",
    lineHeight: 1,
    marginBottom: "4px",
  },
  doneCard: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
  },
  doneItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#15803d",
    fontWeight: 500,
  },
  doneCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#22c55e",
    color: "white",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  doneBtn: {
    padding: "13px 28px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
    marginTop: "8px",
  },
};