import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  // =========================
  // OWNER
  // =========================

  const [ownerMode, setOwnerMode] = useState("signin");
  const [ownerId, setOwnerId] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerLoginId, setOwnerLoginId] = useState("");
  const [ownerLoginPassword, setOwnerLoginPassword] = useState("");
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [showOwnerLoginPassword, setShowOwnerLoginPassword] = useState(false);

  const [ownerOtp, setOwnerOtp] = useState("");
  const [ownerOtpSent, setOwnerOtpSent] = useState(false);

  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);

  const [ownerData, setOwnerData] = useState({
    name: "",
    phone: "",
    email: "",
    shopName: "",
    shopType: "",
    businessType: "",
    gstNo: "",
    address: "",
  });

  // =========================
  // OFFICER
  // =========================

  const [officerLoginId, setOfficerLoginId] = useState("");
  const [officerPassword, setOfficerPassword] = useState("");
  const [showOfficerPassword, setShowOfficerPassword] = useState(false);

  const [officerOtpMobile, setOfficerOtpMobile] = useState("");
  const [officerOtpEmail, setOfficerOtpEmail] = useState("");
  const [officerOtpSent, setOfficerOtpSent] = useState(false);

  const [officerLoggedIn, setOfficerLoggedIn] = useState(false);

  // =========================
  // DEVICE VERIFICATION
  // =========================

  const [verificationData, setVerificationData] = useState({
    instrumentId: "",
    category: "",
    lastVerificationDate: "",
    shopEntries: "",
    instrumentEntries: "",
    image: null,
    qrImage: null,
    sealImage: null,
    decision: "",
    remarks: "",
  });

  const [reportData, setReportData] = useState({
    reporterName: "",
    phone: "",
    email: "",
    instrumentId: "",
    category: "",
    shopName: "",
    location: "",
    reason: "",
    description: "",
    image: null,
  });

  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");

  // =========================
  // QR SCANNER
  // =========================

  const scannerRef = useRef(null);

  const [cameraRunning, setCameraRunning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  // =========================
  // SAMPLE INSTRUMENT DATA
  // =========================

  const instruments = [
    {
      id: "MAAP-BPL-000124",
      category: "Electronic Weighing Instrument",
      verificationDate: "09 September 2026",
      expiryDate: "08 September 2027",
      status: "ACTIVELY VERIFIED",
    },
    {
      id: "MAAP-BPL-000125",
      category: "Platform Weighing Instrument",
      verificationDate: "15 August 2025",
      expiryDate: "14 August 2026",
      status: "EXPIRED",
    },
    {
      id: "MAAP-BPL-000126",
      category: "Measuring Instrument",
      verificationDate: "20 September 2025",
      expiryDate: "19 September 2026",
      status: "EXPIRING THIS MONTH",
    },
  ];

  // =========================
  // GENERAL NAVIGATION
  // =========================

  const goHome = async () => {
    await stopScanner();

    setPage("home");
    setVerificationResult(null);
  };

  // =========================
  // FORM VALIDATION
  // =========================

  const phonePattern = /^[6-9][0-9]{9}$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,20}$/;

  const handlePhoneChange = (setter, field, value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setter((previous) => ({
      ...previous,
      [field]: digitsOnly,
    }));
  };

  // =========================
  // OWNER REGISTRATION
  // =========================

  const sendOwnerRegistrationOtp = (e) => {
    e.preventDefault();

    if (!phonePattern.test(ownerData.phone)) {
      alert("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    if (!passwordPattern.test(ownerPassword)) {
      alert("Password must be 8–20 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    /*
      Prototype OTP.

      In the real system this would send
      an OTP to the registered mobile number.
    */

    setOwnerOtpSent(true);
    setOwnerOtp("");
  };

  // =========================
  // VERIFY OWNER OTP
  // =========================

  const verifyOwnerRegistrationOtp = (e) => {
    e.preventDefault();

    /*
      Demo OTP for prototype:
      123456
    */

    if (ownerOtp === "123456") {
      const generatedOwnerId =
        "MAAP-" + Math.floor(100000 + Math.random() * 900000);

      setOwnerId(generatedOwnerId);

      setOwnerOtpSent(false);
      setOwnerOtp("");

      setPage("owner-success");
    } else {
      alert("Invalid OTP. For this prototype, use 123456.");
    }
  };

  // =========================
  // OWNER LOGIN
  // =========================

  const sendOwnerOtp = (e) => {
    e.preventDefault();

    if (!passwordPattern.test(ownerLoginPassword)) {
      alert("Password must be 8–20 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (
      ownerLoginId === ownerId &&
      ownerLoginPassword === ownerPassword
    ) {
      setOwnerOtpSent(true);
      setOwnerOtp("");
    } else {
      alert("Invalid Owner ID or Password.");
    }
  };

  // =========================
  // OWNER LOGIN OTP
  // =========================

  const verifyOwnerOtp = (e) => {
    e.preventDefault();

    if (ownerOtp === "123456") {
      setOwnerOtpSent(false);
      setOwnerOtp("");

      setOwnerLoggedIn(true);
      setPage("owner-dashboard");
    } else {
      alert("Invalid OTP. For this prototype, use 123456.");
    }
  };

  // =========================
  // OFFICER LOGIN
  // =========================

  const sendOfficerOtp = (e) => {
    e.preventDefault();

    if (!passwordPattern.test(officerPassword)) {
      alert("Password must be 8–20 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    setOfficerOtpSent(true);
  };

  // =========================
  // OFFICER OTP
  // =========================

  const verifyOfficerOtp = (e) => {
    e.preventDefault();

    if (
      officerOtpMobile === "123456" &&
      officerOtpEmail === "123456"
    ) {
      setOfficerOtpSent(false);

      setOfficerLoggedIn(true);

      setPage("officer-dashboard");
    } else {
      alert("For this prototype, use 123456 for both OTPs.");
    }
  };

  // =========================
  // QR CAMERA
  // =========================

  const startScanner = async () => {
    setCameraError("");
    setVerificationResult(null);

    try {
      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          setVerificationResult({
            success: true,
            text: decodedText,
          });

          try {
            await scanner.stop();
          } catch (error) {
            console.log(error);
          }

          scannerRef.current = null;
          setCameraRunning(false);
        },
        () => {}
      );

      setCameraRunning(true);
    } catch (error) {
      console.log(error);

      setCameraError(
        "Camera could not be started. Please use image upload instead."
      );

      setCameraRunning(false);
      scannerRef.current = null;
    }
  };

  // =========================
  // STOP SCANNER
  // =========================

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.log(error);
      }

      scannerRef.current = null;
    }

    setCameraRunning(false);
  };

  // =========================
  // QR IMAGE SCAN
  // =========================

  const scanImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setVerificationResult(null);

    const scanner = new Html5Qrcode("qr-file-reader");

    try {
      const decodedText = await scanner.scanFile(file, true);

      setVerificationResult({
        success: true,
        text: decodedText,
      });
    } catch (error) {
      console.log(error);

      setVerificationResult({
        success: false,
        text: "No valid QR code was found in this image.",
      });
    }

    e.target.value = "";
  };

  // =========================
  // DEVICE IMAGE UPLOAD
  // =========================

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setVerificationData((previous) => ({
      ...previous,
      [field]: file,
    }));
  };

  // =========================
  // DEVICE VERIFICATION
  // =========================

  const verifyDevice = (e) => {
    e.preventDefault();

    const decisionText =
      verificationData.decision === "Approved"
        ? "Device approved for verification."
        : verificationData.decision === "Rejected"
        ? "Device marked for rejection."
        : "Device verification submitted for review.";

    setVerificationResult({
      success: true,
      text: `${decisionText} Officer remarks recorded successfully.`,
    });
  };

  const submitDeviceReport = (e) => {
    e.preventDefault();

    const generatedReportId =
      "RPT-" + Math.floor(100000 + Math.random() * 900000);

    setReportId(generatedReportId);
    setReportSubmitted(true);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div
          className="brand"
          onClick={goHome}
        >
          <div className="brand-shield">
            ✓
          </div>

          <div>
            <h1>MAAP360</h1>
            <span>LEGAL METROLOGY</span>
          </div>
        </div>

        <div className="nav-links">

          <button onClick={goHome}>
            Home
          </button>

          <button
            onClick={() => setPage("about")}
          >
            About
          </button>

          <button
            onClick={() => setPage("contact")}
          >
            Contact
          </button>

        </div>

      </header>

      {/* ================================================= */}
      {/* HOME */}
      {/* ================================================= */}

      {page === "home" && (

        <main className="main-container">

          <section className="hero-section">

            <div className="hero-text">

              <div className="eyebrow">
                DIGITAL VERIFICATION PLATFORM
              </div>

              <h2>
                Stamp of Trust,
                <br />
                <span>Seal of Accuracy.</span>
              </h2>

              <p>
                MAAP360 provides a digital platform for
                verification and management of weighing
                and measuring instruments.
              </p>

            </div>

            <div className="hero-graphic">

              <div className="graphic-circle"></div>

              <div className="instrument-graphic">

                <div className="instrument-top"></div>

                <div className="instrument-body">

                  <div className="display">
                    0000
                  </div>

                  <div className="buttons">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              </div>

              <div className="qr-graphic">
                QR
              </div>

            </div>

          </section>

          {/* SIX HOME OPTIONS */}

          <section className="home-options">

            <button
              className="home-card"
              onClick={() => setPage("scanner")}
            >
              <div className="home-icon">
                ⌕
              </div>

              <div>
                <h3>
                  Scan QR & Verify
                </h3>

                <p>
                  Check instrument authenticity
                </p>
              </div>

              <span>→</span>
            </button>

            <button
              className="home-card"
              onClick={() => setPage("owner")}
            >
              <div className="home-icon">
                ●
              </div>

              <div>
                <h3>
                  Instrument Owner Dashboard
                </h3>

                <p>
                  Manage registered instruments
                </p>
              </div>

              <span>→</span>
            </button>

            <button
              className="home-card"
              onClick={() => setPage("officer-login")}
            >
              <div className="home-icon">
                ◆
              </div>

              <div>
                <h3>
                  Government Officer Dashboard
                </h3>

                <p>
                  Verify registered devices
                </p>
              </div>

              <span>→</span>
            </button>

            <button
              className="home-card"
              onClick={() => setPage("report")}
            >
              <div className="home-icon">
                ▣
              </div>

              <div>
                <h3>
                  Report a Device
                </h3>

                <p>
                  Report a device
                </p>
              </div>

              <span>→</span>
            </button>

            <button
              className="home-card"
              onClick={() => setPage("about")}
            >
              <div className="home-icon">
                ✓
              </div>

              <div>
                <h3>
                  About MAAP360
                </h3>

                <p>
                  Learn about our platform
                </p>
              </div>

              <span>→</span>
            </button>

            <button
              className="home-card"
              onClick={() => setPage("contact")}
            >
              <div className="home-icon">
                ✉
              </div>

              <div>
                <h3>
                  Contact Us
                </h3>

                <p>
                  Get in touch with our team
                </p>
              </div>

              <span>→</span>
            </button>

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* OWNER SIGN IN / LOGIN */}
      {/* ================================================= */}

      {page === "owner" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="form-card">

            <div className="tabs">

              <button
                className={
                  ownerMode === "signin"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setOwnerMode("signin");
                  setOwnerOtpSent(false);
                }}
              >
                Sign In
              </button>

              <button
                className={
                  ownerMode === "login"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setOwnerMode("login");
                  setOwnerOtpSent(false);
                }}
              >
                Login
              </button>

            </div>

            {/* OWNER REGISTRATION */}

            {ownerMode === "signin" && !ownerOtpSent && (

              <form onSubmit={sendOwnerRegistrationOtp}>

                <h2>
                  Instrument Owner Registration
                </h2>

                <input
                  required
                  placeholder="Full Name"
                  value={ownerData.name}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  required
                  placeholder="Phone Number"
                  value={ownerData.phone}
                  onChange={(e) =>
                    handlePhoneChange(setOwnerData, "phone", e.target.value)
                  }
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={ownerData.email}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  required
                  placeholder="Shop Name"
                  value={ownerData.shopName}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      shopName: e.target.value,
                    })
                  }
                />

                {/* SHOP TYPE */}

                <select
                  required
                  value={ownerData.shopType}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      shopType: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Shop Type
                  </option>

                  <option value="General Store">
                    General Store
                  </option>

                  <option value="Grocery Store">
                    Grocery Store
                  </option>

                  <option value="Supermarket">
                    Supermarket
                  </option>

                  <option value="Medical Store">
                    Medical Store
                  </option>

                  <option value="Hardware Store">
                    Hardware Store
                  </option>

                  <option value="Electronics Store">
                    Electronics Store
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                {/* BUSINESS TYPE */}

                <select
                  required
                  value={ownerData.businessType}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      businessType: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Business Type
                  </option>

                  <option value="Retail">
                    Retail
                  </option>

                  <option value="Wholesale">
                    Wholesale
                  </option>

                  <option value="Manufacturing">
                    Manufacturing
                  </option>

                  <option value="Service">
                    Service
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                {/* GST NUMBER */}

                <input
                  placeholder="GST Number (Optional)"
                  value={ownerData.gstNo}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      gstNo: e.target.value.toUpperCase(),
                    })
                  }
                />

                <input
                  required
                  placeholder="Address"
                  value={ownerData.address}
                  onChange={(e) =>
                    setOwnerData({
                      ...ownerData,
                      address: e.target.value,
                    })
                  }
                />

                <div className="password-field" style={{position: "relative"}}>
                  <input
                    required
                    type={showOwnerPassword ? "text" : "password"}
                    placeholder="Set Password"
                    style={{paddingRight: "48px"}}
                    minLength={8}
                    maxLength={20}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,20}"
                    title="Password must be 8–20 characters and include uppercase, lowercase, number, and special character."
                    value={ownerPassword}
                    onChange={(e) =>
                      setOwnerPassword(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}
                    onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                    aria-label={showOwnerPassword ? "Hide password" : "Show password"}
                    title={showOwnerPassword ? "Hide password" : "Show password"}
                  >
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M2.1 12s3.5-6 9.9-6 9.9 6 9.9 6-3.5 6-9.9 6-9.9-6-9.9-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </button>
                </div>

                <button
                  className="primary-button"
                  type="submit"
                >
                  Verify Mobile & Register
                </button>

              </form>
            )}

            {/* OWNER REGISTRATION OTP */}

            {ownerMode === "signin" && ownerOtpSent && (

              <div className="otp-section">

                <h2>
                  Verify Mobile Number
                </h2>

                <p>
                  An OTP has been sent to your
                  registered mobile number.
                </p>

                <p>
                  <strong>
                    Demo OTP: 123456
                  </strong>
                </p>

                <form
                  onSubmit={
                    verifyOwnerRegistrationOtp
                  }
                >

                  <input
                    required
                    maxLength="6"
                    inputMode="numeric"
                    placeholder="Enter 6 digit OTP"
                    value={ownerOtp}
                    onChange={(e) =>
                      setOwnerOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                  />

                  <button
                    className="primary-button"
                    type="submit"
                  >
                    Verify OTP & Generate Owner ID
                  </button>

                </form>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setOwnerOtpSent(false);
                    setOwnerOtp("");
                  }}
                >
                  ← Edit Registration Details
                </button>

              </div>
            )}

            {/* OWNER LOGIN */}

            {ownerMode === "login" && !ownerOtpSent && (

              <form onSubmit={sendOwnerOtp}>

                <h2>
                  Instrument Owner Login
                </h2>

                <input
                  required
                  placeholder="Owner ID"
                  value={ownerLoginId}
                  onChange={(e) =>
                    setOwnerLoginId(e.target.value)
                  }
                />

                <div className="password-field" style={{position: "relative"}}>
                  <input
                    required
                    type={showOwnerLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    style={{paddingRight: "48px"}}
                    minLength={8}
                    maxLength={20}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,20}"
                    title="Password must be 8–20 characters and include uppercase, lowercase, number, and special character."
                    value={ownerLoginPassword}
                    onChange={(e) =>
                      setOwnerLoginPassword(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}
                    onClick={() => setShowOwnerLoginPassword(!showOwnerLoginPassword)}
                    aria-label={showOwnerLoginPassword ? "Hide password" : "Show password"}
                    title={showOwnerLoginPassword ? "Hide password" : "Show password"}
                  >
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M2.1 12s3.5-6 9.9-6 9.9 6 9.9 6-3.5 6-9.9 6-9.9-6-9.9-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </button>
                </div>

                <button
                  className="primary-button"
                  type="submit"
                >
                  Send OTP
                </button>

              </form>
            )}

            {/* OWNER LOGIN OTP */}

            {ownerMode === "login" && ownerOtpSent && (

              <div className="otp-section">

                <h2>
                  Verify OTP
                </h2>

                <p>
                  Enter the OTP sent to your
                  registered mobile number.
                </p>

                <p>
                  <strong>
                    Demo OTP: 123456
                  </strong>
                </p>

                <form onSubmit={verifyOwnerOtp}>

                  <input
                    required
                    maxLength="6"
                    inputMode="numeric"
                    placeholder="Enter 6 digit OTP"
                    value={ownerOtp}
                    onChange={(e) =>
                      setOwnerOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                  />

                  <button
                    className="primary-button"
                    type="submit"
                  >
                    Verify OTP & Login
                  </button>

                </form>

              </div>
            )}

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* OWNER SUCCESS */}
      {/* ================================================= */}

      {page === "owner-success" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="success-card">

            <div className="success-circle">
              ✓
            </div>

            <h2>
              Registration Successful!
            </h2>

            <p>
              Your mobile number has been verified.
            </p>

            <p>
              Your unique MAAP360 Owner ID has
              now been generated.
            </p>

            <div className="owner-id-box">

              <span>
                Owner ID
              </span>

              <strong>
                {ownerId}
              </strong>

            </div>

            <p>
              Save this Owner ID. You will need it
              together with your password to login.
            </p>

            <button
              className="primary-button"
              onClick={() => {
                setOwnerMode("login");
                setOwnerOtpSent(false);
                setOwnerOtp("");
                setPage("owner");
              }}
            >
              Login to Continue
            </button>

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* OWNER DASHBOARD */}
      {/* ================================================= */}

      {page === "owner-dashboard" && ownerLoggedIn && (

        <main className="dashboard-container">

          <aside className="sidebar">

            <div className="sidebar-title">
              MAAP360
            </div>

            <button className="selected">
              Dashboard
            </button>

            <button>
              My Instruments
            </button>

            <button>
              Shop Details
            </button>

            <button>
              Profile
            </button>

            <button onClick={goHome}>
              Logout
            </button>

          </aside>

          <section className="dashboard-content">

            <div className="dashboard-header">

              <h2>
                Instrument Owner Dashboard
              </h2>

              <span>
                {ownerId}
              </span>

            </div>

            {/* WELCOME */}

            <div className="welcome-card">

              <div className="shop-graphic">
                ⌂
              </div>

              <div>

                <h2>
                  Welcome,{" "}
                  {ownerData.name || "Shop Owner"}!
                </h2>

                <p>
                  {ownerData.shopName ||
                    "Registered Shop"}
                </p>

                <p>
                  {ownerData.phone ||
                    "Registered Mobile"}
                </p>

              </div>

            </div>

            {/* OWNER DETAILS */}

            <div className="simple-card owner-details-card">

              <h2>
                Owner & Shop Details
              </h2>

              <div className="details-grid">

                <div>
                  <span>Owner ID</span>
                  <strong>{ownerId}</strong>
                </div>

                <div>
                  <span>Full Name</span>
                  <strong>{ownerData.name}</strong>
                </div>

                <div>
                  <span>Phone Number</span>
                  <strong>{ownerData.phone}</strong>
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>{ownerData.email}</strong>
                </div>

                <div>
                  <span>Shop Name</span>
                  <strong>{ownerData.shopName}</strong>
                </div>

                <div>
                  <span>Shop Type</span>
                  <strong>{ownerData.shopType}</strong>
                </div>

                <div>
                  <span>Business Type</span>
                  <strong>{ownerData.businessType}</strong>
                </div>

                <div>
                  <span>GST Number</span>
                  <strong>
                    {ownerData.gstNo ||
                      "Not Provided"}
                  </strong>
                </div>

                <div>
                  <span>Address</span>
                  <strong>{ownerData.address}</strong>
                </div>

              </div>

            </div>

            {/* STATISTICS */}

            <div className="statistics">

              <div className="stat-card">

                <span>
                  Total Registered Instruments
                </span>

                <strong>
                  {instruments.length}
                </strong>

              </div>

              <div className="stat-card">

                <span>
                  Total Actively Verified Instruments
                </span>

                <strong>
                  {
                    instruments.filter(
                      (item) =>
                        item.status ===
                        "ACTIVELY VERIFIED"
                    ).length
                  }
                </strong>

              </div>

              <div className="stat-card">

                <span>
                  Expired Instruments
                </span>

                <strong>
                  {
                    instruments.filter(
                      (item) =>
                        item.status === "EXPIRED"
                    ).length
                  }
                </strong>

              </div>

              <div className="stat-card">

                <span>
                  Instruments Expiring This Month
                </span>

                <strong>
                  {
                    instruments.filter(
                      (item) =>
                        item.status ===
                        "EXPIRING THIS MONTH"
                    ).length
                  }
                </strong>

              </div>

            </div>

            {/* INSTRUMENTS */}

            <section className="instrument-section">

              <h2>
                Registered Instruments
              </h2>

              {instruments.map((instrument) => (

                <div
                  className="instrument-card"
                  key={instrument.id}
                >

                  <div className="instrument-mini-graphic">
                    ⚖
                  </div>

                  <div className="instrument-info">

                    <strong>
                      {instrument.id}
                    </strong>

                    <span>
                      {instrument.category}
                    </span>

                    <small>
                      Verification Date:{" "}
                      {instrument.verificationDate}
                    </small>

                    <small>
                      Expiry Date:{" "}
                      {instrument.expiryDate}
                    </small>

                  </div>

                  <div
                    className={
                      "status " +
                      instrument.status
                        .toLowerCase()
                        .replaceAll(" ", "-")
                    }
                  >
                    {instrument.status}
                  </div>

                </div>

              ))}

            </section>

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* GOVERNMENT OFFICER LOGIN */}
      {/* ================================================= */}

      {page === "officer-login" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="form-card">

            <h2>
              Government Officer Login
            </h2>

            <form onSubmit={sendOfficerOtp}>

              <input
                required
                placeholder="Login ID"
                value={officerLoginId}
                onChange={(e) =>
                  setOfficerLoginId(e.target.value)
                }
              />

              <div className="password-field" style={{position: "relative"}}>
                <input
                  required
                  type={showOfficerPassword ? "text" : "password"}
                  placeholder="Password"
                  style={{paddingRight: "48px"}}
                  value={officerPassword}
                  onChange={(e) =>
                    setOfficerPassword(e.target.value)
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}
                  onClick={() => setShowOfficerPassword(!showOfficerPassword)}
                  aria-label={showOfficerPassword ? "Hide password" : "Show password"}
                  title={showOfficerPassword ? "Hide password" : "Show password"}
                >
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M2.1 12s3.5-6 9.9-6 9.9 6 9.9 6-3.5 6-9.9 6-9.9-6-9.9-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                </button>
              </div>

              <button
                className="primary-button"
                type="submit"
              >
                Continue to Two-Factor Authentication
              </button>

            </form>

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* OFFICER 2FA */}
      {/* ================================================= */}

      {page === "officer-login" && officerOtpSent && (

        <div className="modal-overlay">

          <section className="otp-card">

            <h2>
              Two-Factor Authentication
            </h2>

            <p>
              Enter the OTP received separately on
              the registered mobile number and email.
            </p>

            <p>
              <strong>
                Demo OTP: 123456
              </strong>
            </p>

            <form onSubmit={verifyOfficerOtp}>

              <input
                required
                maxLength="6"
                inputMode="numeric"
                placeholder="Mobile OTP"
                value={officerOtpMobile}
                onChange={(e) =>
                  setOfficerOtpMobile(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <input
                required
                maxLength="6"
                inputMode="numeric"
                placeholder="Email OTP"
                value={officerOtpEmail}
                onChange={(e) =>
                  setOfficerOtpEmail(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <button
                className="primary-button"
                type="submit"
              >
                Verify & Login
              </button>

            </form>

          </section>

        </div>
      )}

      {/* ================================================= */}
      {/* OFFICER DASHBOARD */}
      {/* ================================================= */}

      {page === "officer-dashboard" &&
        officerLoggedIn && (

        <main className="dashboard-container">

          <aside className="sidebar">

            <div className="sidebar-title">
              MAAP360
            </div>

            <button className="selected">
              Dashboard
            </button>

            <button onClick={() => setPage("verify-device")}>
              Verify a Device
            </button>

            <button>
              Pending Cases
            </button>

            <button>
              Reported Devices
            </button>

            <button>
              Verification History
            </button>

            <button>
              Audit & Activity
            </button>

            <button onClick={goHome}>
              Logout
            </button>

          </aside>

          <section className="dashboard-content">

            <div className="dashboard-header">

              <div>
                <h2>Government Officer Portal</h2>
                <p className="dashboard-subtitle">
                  Digital verification, monitoring and audit control
                </p>
              </div>

              <span>VERIFIED OFFICER</span>

            </div>

            <div className="welcome-card">

              <div className="shop-graphic">
                ◆
              </div>

              <div>
                <h2>Officer Control Centre</h2>

                <p>
                  Review instrument records, verify devices and monitor
                  reported or expiring instruments.
                </p>

                <p>
                  Two-factor authentication: Enabled
                </p>
              </div>

            </div>

            <div className="statistics">

              <div className="stat-card">
                <span>Pending Verifications</span>
                <strong>12</strong>
              </div>

              <div className="stat-card">
                <span>Devices Expiring This Month</span>
                <strong>08</strong>
              </div>

              <div className="stat-card">
                <span>Reported Devices</span>
                <strong>05</strong>
              </div>

              <div className="stat-card">
                <span>Verified This Month</span>
                <strong>37</strong>
              </div>

            </div>

            <div className="simple-card officer-summary-card">

              <h2>Officer Overview</h2>

              <div className="details-grid">

                <div>
                  <span>Officer Access</span>
                  <strong>Government Verification Officer</strong>
                </div>

                <div>
                  <span>Security</span>
                  <strong>Mobile + Email 2FA</strong>
                </div>

                <div>
                  <span>Current Queue</span>
                  <strong>12 Pending Cases</strong>
                </div>

                <div>
                  <span>Priority Alerts</span>
                  <strong>08 Instruments Expiring</strong>
                </div>

              </div>

            </div>

            <div className="simple-card">

              <h2>Recent Verification Activity</h2>

              <div className="activity-list">

                <div className="activity-row">
                  <div>
                    <strong>MAAP-BPL-000124</strong>
                    <span>Electronic Weighing Instrument</span>
                  </div>
                  <div>
                    <strong>Verified</strong>
                    <small>09 Sep 2026 • 11:42 AM</small>
                  </div>
                </div>

                <div className="activity-row">
                  <div>
                    <strong>MAAP-BPL-000126</strong>
                    <span>Measuring Instrument</span>
                  </div>
                  <div>
                    <strong>Expiring Soon</strong>
                    <small>19 Sep 2026</small>
                  </div>
                </div>

                <div className="activity-row">
                  <div>
                    <strong>MAAP-BPL-000127</strong>
                    <span>Platform Weighing Instrument</span>
                  </div>
                  <div>
                    <strong>Pending</strong>
                    <small>Awaiting inspection</small>
                  </div>
                </div>

              </div>

            </div>

            <div className="simple-card">

              <h2>Audit & Activity Log</h2>

              <div className="audit-table">

                <div className="audit-row audit-head">
                  <span>Activity</span>
                  <span>Reference</span>
                  <span>Date & Time</span>
                  <span>Status</span>
                </div>

                <div className="audit-row">
                  <span>Device verification</span>
                  <span>MAAP-BPL-000124</span>
                  <span>09 Sep 2026, 11:42 AM</span>
                  <span className="audit-status success-text">Completed</span>
                </div>

                <div className="audit-row">
                  <span>Report received</span>
                  <span>RPT-452181</span>
                  <span>08 Sep 2026, 04:18 PM</span>
                  <span className="audit-status warning-text">Under Review</span>
                </div>

                <div className="audit-row">
                  <span>Device verification</span>
                  <span>MAAP-BPL-000127</span>
                  <span>08 Sep 2026, 01:05 PM</span>
                  <span className="audit-status warning-text">Pending</span>
                </div>

              </div>

              <p className="security-note">
                Security note: passwords and OTP values are never displayed
                in the officer audit view.
              </p>

            </div>

            <button
              className="large-action-button"
              onClick={() => setPage("verify-device")}
            >
              Verify a Device →
            </button>

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* VERIFY DEVICE */}
      {/* ================================================= */}

      {page === "verify-device" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={() =>
              setPage("officer-dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <section className="verification-form-card">

            <h2>
              Verify a Device
            </h2>

            <p>
              Enter instrument information and upload
              the required device, QR and seal images.
            </p>

            <form onSubmit={verifyDevice}>

              <label>
                Instrument ID
              </label>

              <input
                required
                placeholder="Enter Instrument ID"
                value={
                  verificationData.instrumentId
                }
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    instrumentId:
                      e.target.value,
                  })
                }
              />

              <label>
                Instrument Category
              </label>

              <input
                required
                placeholder="Enter Instrument Category"
                value={
                  verificationData.category
                }
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    category:
                      e.target.value,
                  })
                }
              />

              <label>
                Last Verification Date
              </label>

              <input
                required
                type="date"
                value={
                  verificationData.lastVerificationDate
                }
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    lastVerificationDate:
                      e.target.value,
                  })
                }
              />

              <label>
                Shop Entries
              </label>

              <textarea
                placeholder="Enter all shop details / entries"
                value={
                  verificationData.shopEntries
                }
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    shopEntries:
                      e.target.value,
                  })
                }
              />

              <label>
                Instrument Entries
              </label>

              <textarea
                placeholder="Enter all instrument details / entries"
                value={
                  verificationData.instrumentEntries
                }
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    instrumentEntries:
                      e.target.value,
                  })
                }
              />

              <label>
                Verification Decision
              </label>

              <select
                required
                value={verificationData.decision}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    decision: e.target.value,
                  })
                }
              >
                <option value="">Select Decision</option>
                <option value="Approved">Approve Device</option>
                <option value="Rejected">Reject Device</option>
                <option value="Needs Review">Needs Further Review</option>
              </select>

              <label>
                Officer Remarks
              </label>

              <textarea
                required
                placeholder="Enter verification findings, seal condition, device condition or other remarks"
                value={verificationData.remarks}
                onChange={(e) =>
                  setVerificationData({
                    ...verificationData,
                    remarks: e.target.value,
                  })
                }
              />

              <div className="upload-grid">

                <label className="upload-box">

                  <span>
                    Live Image of Device
                  </span>

                  <input
                    required
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        "image"
                      )
                    }
                  />

                </label>

                <label className="upload-box">

                  <span>
                    QR Image
                  </span>

                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        "qrImage"
                      )
                    }
                  />

                </label>

                <label className="upload-box">

                  <span>
                    Seal Image
                  </span>

                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        "sealImage"
                      )
                    }
                  />

                </label>

              </div>

              <button
                className="primary-button"
                type="submit"
              >
                Verify Device
              </button>

            </form>

            {verificationResult && (

              <div
                className={
                  verificationResult.success
                    ? "result-card success"
                    : "result-card failure"
                }
              >

                <strong>
                  {verificationResult.success
                    ? "Verification Successful"
                    : "Verification Failed"}
                </strong>

                <p>
                  {verificationResult.text}
                </p>

              </div>

            )}

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* QR SCANNER */}
      {/* ================================================= */}

      {page === "scanner" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="scanner-card">

            <h2>
              Scan QR Code
            </h2>

            <p>
              Scan the QR code on the instrument to
              verify its authenticity.
            </p>

            <div className="scanner-box">

              <div id="qr-reader"></div>

              {!cameraRunning && (

                <div className="scanner-placeholder">

                  <div className="scanner-graphic">
                    QR
                  </div>

                  <h3>
                    Scan Instrument QR
                  </h3>

                  <button
                    className="primary-button"
                    onClick={startScanner}
                  >
                    Start Camera
                  </button>

                </div>

              )}

            </div>

            {cameraRunning && (

              <button
                className="secondary-button"
                onClick={stopScanner}
              >
                Stop Scanner
              </button>

            )}

            {cameraError && (

              <div className="camera-message">
                {cameraError}
              </div>

            )}

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="image-scan">

              <h3>
                Scan from Image
              </h3>

              <p>
                Upload an image containing the QR code.
              </p>

              <label className="upload-button">

                Choose Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={scanImage}
                  hidden
                />

              </label>

              <div id="qr-file-reader"></div>

            </div>

            {verificationResult && (

              <div
                className={
                  verificationResult.success
                    ? "result-card success"
                    : "result-card failure"
                }
              >

                <strong>
                  {verificationResult.success
                    ? "QR Code Detected"
                    : "Verification Failed"}
                </strong>

                <p>
                  {verificationResult.text}
                </p>

              </div>

            )}

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* REPORT */}
      {/* ================================================= */}

      {page === "report" && (

        <main className="page-container">

          <button className="back-button" onClick={goHome}>
            ← Back to Home
          </button>

          {!reportSubmitted ? (

            <section className="form-card report-card">

              <div className="eyebrow">
                DEVICE SAFETY & COMPLAINT REPORTING
              </div>

              <h2>Report a Device</h2>

              <p className="form-intro">
                Report a suspected unverified, damaged, tampered or
                incorrectly verified weighing or measuring instrument.
              </p>

              <form onSubmit={submitDeviceReport}>

                <h3 className="form-section-title">
                  Reporter Information
                </h3>

                <input
                  required
                  placeholder="Reporter Name"
                  value={reportData.reporterName}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      reporterName: e.target.value,
                    })
                  }
                />

                <input
                  required
                  placeholder="Mobile Number"
                  value={reportData.phone}
                  onChange={(e) =>
                    handlePhoneChange(setReportData, "phone", e.target.value)
                  }
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={reportData.email}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      email: e.target.value,
                    })
                  }
                />

                <h3 className="form-section-title">
                  Device Information
                </h3>

                <input
                  required
                  placeholder="Instrument / Device ID"
                  value={reportData.instrumentId}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      instrumentId: e.target.value,
                    })
                  }
                />

                <select
                  required
                  value={reportData.category}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Select Instrument Category</option>
                  <option value="Electronic Weighing Instrument">
                    Electronic Weighing Instrument
                  </option>
                  <option value="Platform Weighing Instrument">
                    Platform Weighing Instrument
                  </option>
                  <option value="Measuring Instrument">
                    Measuring Instrument
                  </option>
                  <option value="Other">Other</option>
                </select>

                <input
                  required
                  placeholder="Shop / Owner Name"
                  value={reportData.shopName}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      shopName: e.target.value,
                    })
                  }
                />

                <input
                  required
                  placeholder="Device Location / Shop Address"
                  value={reportData.location}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      location: e.target.value,
                    })
                  }
                />

                <h3 className="form-section-title">
                  Report Details
                </h3>

                <select
                  required
                  value={reportData.reason}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      reason: e.target.value,
                    })
                  }
                >
                  <option value="">Select Reason for Report</option>
                  <option value="Missing verification mark">
                    Missing verification mark
                  </option>
                  <option value="Suspected tampering">
                    Suspected tampering
                  </option>
                  <option value="Expired verification">
                    Expired verification
                  </option>
                  <option value="Incorrect measurement">
                    Incorrect measurement
                  </option>
                  <option value="Damaged instrument">
                    Damaged instrument
                  </option>
                  <option value="Other">Other</option>
                </select>

                <textarea
                  required
                  placeholder="Describe the issue in detail"
                  value={reportData.description}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      description: e.target.value,
                    })
                  }
                />

                <label className="upload-box report-upload">
                  <span>📷 Upload Supporting Device Image</span>
                  <small>Optional evidence image</small>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        image: e.target.files[0] || null,
                      })
                    }
                  />
                </label>

                <button className="primary-button" type="submit">
                  Submit Device Report
                </button>

              </form>

            </section>

          ) : (

            <section className="success-card">

              <div className="success-circle">✓</div>

              <h2>Report Submitted Successfully</h2>

              <p>
                Your device report has been recorded and forwarded
                for officer review.
              </p>

              <div className="owner-id-box">
                <span>Report ID</span>
                <strong>{reportId}</strong>
              </div>

              <p>Keep this Report ID for future reference.</p>

              <button className="primary-button" onClick={goHome}>
                Back to Home
              </button>

            </section>

          )}

        </main>
      )}

      {/* ================================================= */}
      {/* ABOUT */}
      {/* ================================================= */}

      {page === "about" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="simple-card">

            <h2>
              About MAAP360
            </h2>

            <p>
              MAAP360 is a digital verification platform
              designed to support transparent verification
              and management of weighing and measuring
              instruments.
            </p>

          </section>

        </main>
      )}

      {/* ================================================= */}
      {/* CONTACT */}
      {/* ================================================= */}

      {page === "contact" && (

        <main className="page-container">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="simple-card">

            <h2>
              Contact Us
            </h2>

            <p>
              Contact information for MAAP360.
            </p>

          </section>

        </main>
      )}

      {/* ================= FOOTER ================= */}

      <footer>
        <strong>MAAP360</strong>
        {" "}•{" "}
        LEGAL METROLOGY
      </footer>

    </div>
  );
}

export default App;