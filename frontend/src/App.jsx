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
  });

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
  // OWNER REGISTRATION
  // =========================

  const sendOwnerRegistrationOtp = (e) => {
    e.preventDefault();

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

    setVerificationResult({
      success: true,
      text: "Device verification submitted successfully.",
    });
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
                    setOwnerData({
                      ...ownerData,
                      phone: e.target.value,
                    })
                  }
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

                <input
                  required
                  type="password"
                  placeholder="Set Password"
                  value={ownerPassword}
                  onChange={(e) =>
                    setOwnerPassword(e.target.value)
                  }
                />

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

                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={ownerLoginPassword}
                  onChange={(e) =>
                    setOwnerLoginPassword(e.target.value)
                  }
                />

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

              <input
                required
                type="password"
                placeholder="Password"
                value={officerPassword}
                onChange={(e) =>
                  setOfficerPassword(e.target.value)
                }
              />

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

            <button
              onClick={() =>
                setPage("verify-device")
              }
            >
              Verify a Device
            </button>

            <button onClick={goHome}>
              Logout
            </button>

          </aside>

          <section className="dashboard-content">

            <div className="dashboard-header">

              <h2>
                Government Officer Dashboard
              </h2>

            </div>

            <div className="statistics">

              <div className="stat-card">

                <span>
                  Pending Verifications
                </span>

                <strong>
                  12
                </strong>

              </div>

              <div className="stat-card">

                <span>
                  Devices Expiring This Month
                </span>

                <strong>
                  08
                </strong>

              </div>

            </div>

            <button
              className="large-action-button"
              onClick={() =>
                setPage("verify-device")
              }
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

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Back to Home
          </button>

          <section className="simple-card">

            <h2>
              Report a Device
            </h2>

            <p>
              Device reporting section.
            </p>

          </section>

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