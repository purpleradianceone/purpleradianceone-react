
// interface LeadAccessInstructionsProps {
//   onVerified?: () => void;
//   companyId: number;
//   apiBaseUrl?: string;
// }

export default function LeadAccessInstructions(
    // {
//   onVerified,
//   companyId,
//   apiBaseUrl = "/api/main/purple-crm-api",
// }: 
// LeadAccessInstructionsProps
) {
//   const [verifying, setVerifying] = useState(false);
//   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
//   const [message, setMessage] = useState("");

//   const handleVerify = async () => {
//     setVerifying(true);
//     setStatus("idle");
//     setMessage("");
//     try {
//       const res = await fetch(
//         `${apiBaseUrl}/facebook/verify-lead-access?companyId=${companyId}`
//       );
//       const data = await res.json();
//       if (res.ok && data.status) {
//         setStatus("success");
//         setMessage("Lead access verified! You can now connect your page.");
//         onVerified?.();
//       } else {
//         setStatus("error");
//         setMessage(data.message ?? "Lead access not set up yet. Please complete the steps above.");
//       }
//     } catch {
//       setStatus("error");
//       setMessage("Verification failed. Please try again.");
//     } finally {
//       setVerifying(false);
//     }
//   };

  const steps = [
    "Click the button  to open Meta Business Suite",
    "Go to Business Settings → Integrations → Leads Access",
    "Find your Facebook page in the list",
    'Under "CRMs" section → click "Assign CRM"',
    "Search for purpleradianceone → click Assign",
    // "Come back here and click Verify",
    "Now you are ready to add page."
  ];

  return (
    <div style={s.card}>
      {/* title row */}

      <div style={s.titleRow}>
        <div style={s.iconBox}>🔐</div>
        <div>
          <h3 style={s.title}>Enable Lead Access  <span className="text-red-600">(Required)</span></h3>
         
          <p style={s.subtitle}>
            Allow app (purpleradianceone) to read leads from your Facebook page
          </p>
        </div>
        <a
        href="https://business.facebook.com/settings/leads-access"
        target="_blank"
        rel="noopener noreferrer"
        style={s.metaBtn}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Open Meta Business Suite
      </a>
      </div>

      {/* steps */}
      <div style={s.stepsList}>
        {steps.map((step, idx) => (
          <div key={idx} style={s.stepRow}>
            <div style={s.stepNum}>{idx + 1}</div>
            <p style={s.stepText}>{step}</p>
          </div>
        ))}
      </div>

      {/* open meta button */}
      

      {/* <div style={s.divider} /> */}

      {/* status message */}
      {/* {status === "error" && (
        <div style={s.errorBox}>⚠️ {message}</div>
      )}
      {status === "success" && (
        <div style={s.successBox}>✅ {message}</div>
      )} */}

      {/* verify button */}
      {/* <button
        style={{
          ...s.verifyBtn,
          opacity: verifying ? 0.7 : 1,
          cursor: verifying ? "not-allowed" : "pointer",
        }}
        onClick={handleVerify}
        disabled={verifying}
      >
        {verifying ? "Verifying..." : "I've done this — Verify Access"}
      </button> */}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "10px",
    // maxWidth: "460px",
    width: "100%",
    boxShadow: "0 4px 2px rgba(0,0,0,0.06)",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    // marginBottom: "20px",
  },
  iconBox: {
    fontSize: "28px",
    lineHeight: 1,
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.2px",
  },
  subtitle: {
    margin: "2px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  stepsList: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginBottom: "16px",
  },
  stepRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  stepNum: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#1877f2",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  },
  stepText: {
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
    padding: "11px 18px",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    color: "white",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    marginBottom: "16px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#dc2626",
    fontWeight: 500,
    marginBottom: "12px",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#16a34a",
    fontWeight: 500,
    marginBottom: "12px",
  },
  verifyBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #1877f2, #0d5ecb)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(24,119,242,0.25)",
  },
};
