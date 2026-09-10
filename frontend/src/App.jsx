import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QrVerificationPage({ instruments }) {

  const scannerRef = useRef(null);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "maap360-qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        setScanError("");
        setScannerStarted(true);
      },
      () => {
        // Camera scanning errors happen continuously while searching for a QR.
        // We intentionally do not show every frame's error to the user.
      }
    );

    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  function getInstrumentId(decodedText) {
    const match = decodedText.match(/MAAP-[A-Z]+-\d{6}/i);
    return match ? match[0].toUpperCase() : decodedText.trim();
  }

  const instrumentId = getInstrumentId(scanResult);
  const instrument = instruments.find(
    (item) => item.id.toUpperCase() === instrumentId.toUpperCase()
  );

  return (
    <div className="simple-card qr-card">

      <div className="section-label">
        QR VERIFICATION
      </div>

      <h1>
        Scan QR & Verify
      </h1>

      <p>
        Allow camera access and place the MAAP360 QR code inside the frame.
      </p>

      <div className="qr-scanner-wrapper">
        <div id="maap360-qr-reader"></div>
      </div>

      <div className="scanner-status">
        {scannerStarted
          ? "Scanner is ready. Point the camera at a QR code."
          : "Starting camera scanner..."}
      </div>

      {scanError && (
        <div className="error-message">
          {scanError}
        </div>
      )}

      {scanResult && (
        <div className="qr-result-card">

          <div className="section-label">
            QR DETECTED
          </div>

          <h2>
            {instrument ? "Device Verified" : "QR Code Scanned"}
          </h2>

          <div className="qr-result-row">
            <span>Scanned Data</span>
            <strong>{scanResult}</strong>
          </div>

          <div className="qr-result-row">
            <span>Instrument ID</span>
            <strong>{instrumentId}</strong>
          </div>

          {instrument ? (
            <div className="verification-result">

              <div className="verification-badge">
                {instrument.status}
              </div>

              <div className="verification-grid">
                <div>
                  <small>INSTRUMENT TYPE</small>
                  <strong>{instrument.type}</strong>
                </div>

                <div>
                  <small>VERIFICATION DATE</small>
                  <strong>{instrument.verificationDate}</strong>
                </div>

                <div>
                  <small>EXPIRY DATE</small>
                  <strong>{instrument.expiryDate}</strong>
                </div>
              </div>

            </div>
          ) : (
            <div className="error-message">
              This QR code is not linked to a MAAP360 instrument in this demo.
            </div>
          )}

        </div>
      )}

    </div>
  );
}

function App() {

  const [page, setPage] = useState("home");

  // OWNER ACCOUNT STATES
  const [ownerScreen, setOwnerScreen] = useState("choice");

  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [address, setAddress] = useState("");

  const [ownerId, setOwnerId] = useState("");
  const [password, setPassword] = useState("");
  const [registeredPassword, setRegisteredPassword] = useState("");

  const [loginOwnerId, setLoginOwnerId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [loginError, setLoginError] = useState("");

  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);


  // SAMPLE INSTRUMENT DATA
  const instruments = [
    {
      id: "MAAP-BPL-000124",
      type: "Electronic Weighing Instrument",
      verificationDate: "09 September 2026",
      expiryDate: "08 September 2027",
      status: "ACTIVELY VERIFIED"
    },
    {
      id: "MAAP-BPL-000125",
      type: "Platform Weighing Instrument",
      verificationDate: "15 August 2025",
      expiryDate: "14 August 2026",
      status: "EXPIRED"
    },
    {
      id: "MAAP-BPL-000126",
      type: "Measuring Instrument",
      verificationDate: "20 September 2025",
      expiryDate: "19 September 2026",
      status: "EXPIRING THIS MONTH"
    }
  ];


  // GENERATE OWNER ID
  function generateOwnerId() {

    const generatedId =
      "MAAP-" +
      Math.floor(100000 + Math.random() * 900000);

    setOwnerId(generatedId);

    return generatedId;
  }


  // OWNER REGISTRATION
  function registerOwner(event) {

    event.preventDefault();

    if (
      !ownerName ||
      !phone ||
      !email ||
      !shopName ||
      !shopType ||
      !businessType ||
      !address ||
      !password
    ) {
      alert("Please fill all the required details.");
      return;
    }

    const newOwnerId = generateOwnerId();

    setRegisteredPassword(password);

    setRegistrationComplete(true);

    setLoginOwnerId(newOwnerId);

    setOwnerScreen("registered");
  }


  // SEND OTP
  function sendOtp() {

    if (!loginOwnerId || !loginPassword) {
      setLoginError("Please enter Owner ID and Password.");
      return;
    }

    if (
      loginOwnerId !== ownerId ||
      loginPassword !== registeredPassword
    ) {
      setLoginError("Incorrect Owner ID or Password.");
      return;
    }

    setLoginError("");

    // DEMO OTP
    const demoOtp = "123456";

    setGeneratedOtp(demoOtp);
    setOtpSent(true);
  }


  // VERIFY OTP
  function verifyOtp() {

    if (otp === generatedOtp) {

      setLoggedIn(true);
      setOwnerScreen("dashboard");

    } else {

      setLoginError("Incorrect OTP. Please try again.");

    }
  }


  // LOGOUT
  function logoutOwner() {

    setLoggedIn(false);
    setOwnerScreen("choice");
    setOtp("");
    setOtpSent(false);
    setLoginError("");
  }


  return (
    <div className="app">


      {/* HEADER */}

      <header className="header">

        <div className="logo">

          <div className="logo-icon">
            ✓
          </div>

          <div>

            <div className="logo-name">
              MAAP360
            </div>

            <div className="logo-subtitle">
              LEGAL METROLOGY
            </div>

          </div>

        </div>

      </header>


      {/* ================= HOME ================= */}

      {page === "home" && (

        <main className="home-page">

          <div className="home-content">

            <div className="badge">
              DIGITAL VERIFICATION PLATFORM
            </div>

            <h1>
              Stamp of Trust,
              <br />
              <span>Seal of Accuracy.</span>
            </h1>

            <p>
              MAAP360 provides a digital platform for
              verification and management of weighing
              and measuring instruments.
            </p>


            <div className="home-options">


              {/* OPTION 1 */}

              <button
                className="home-option"
                onClick={() => setPage("qr")}
              >

                <div className="option-number">
                  01
                </div>

                <div>

                  <h2>
                    Scan QR & Verify
                  </h2>

                  <p>
                    Scan or enter the QR details of a device
                    to verify its information.
                  </p>

                </div>

                <span className="arrow">
                  →
                </span>

              </button>


              {/* OPTION 2 */}

              <button
                className="home-option"
                onClick={() => {
                  setPage("owner");
                  setOwnerScreen("choice");
                }}
              >

                <div className="option-number">
                  02
                </div>

                <div>

                  <h2>
                    Instrument Owner Dashboard
                  </h2>

                  <p>
                    Register instruments and manage
                    verification details.
                  </p>

                </div>

                <span className="arrow">
                  →
                </span>

              </button>


              {/* OPTION 3 */}

              <button
                className="home-option"
                onClick={() => setPage("officer")}
              >

                <div className="option-number">
                  03
                </div>

                <div>

                  <h2>
                    Government Officer Dashboard
                  </h2>

                  <p>
                    Government officers can log in and
                    verify registered devices.
                  </p>

                </div>

                <span className="arrow">
                  →
                </span>

              </button>


              {/* OPTION 4 */}

              <button
                className="home-option"
                onClick={() => setPage("report")}
              >

                <div className="option-number">
                  04
                </div>

                <div>

                  <h2>
                    Report a Device
                  </h2>

                  <p>
                    Report a weighing or measuring device.
                  </p>

                </div>

                <span className="arrow">
                  →
                </span>

              </button>


            </div>

          </div>

        </main>

      )}


      {/* ================= QR PAGE ================= */}

      {page === "qr" && (

        <div className="page">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>

          <QrVerificationPage instruments={instruments} />

        </div>

      )}


      {/* ================= OWNER ================= */}

      {page === "owner" && (

        <div className="page">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>


          {/* OWNER CHOICE */}

          {ownerScreen === "choice" && (

            <div className="simple-card">

              <div className="section-label">
                INSTRUMENT OWNER
              </div>

              <h1>
                Instrument Owner Dashboard
              </h1>

              <p>
                Create an owner account or login to your
                existing MAAP360 account.
              </p>


              <div className="two-options">


                <button
                  className="dashboard-option"
                  onClick={() => setOwnerScreen("signup")}
                >

                  <h2>
                    Sign In
                  </h2>

                  <p>
                    Create your MAAP360 instrument owner
                    account.
                  </p>

                </button>


                <button
                  className="dashboard-option"
                  onClick={() => setOwnerScreen("login")}
                >

                  <h2>
                    Login
                  </h2>

                  <p>
                    Login using your Owner ID and password.
                  </p>

                </button>


              </div>

            </div>

          )}


          {/* ================= SIGN IN / REGISTRATION ================= */}

          {ownerScreen === "signup" && (

            <div className="form-card">

              <button
                className="back-button"
                onClick={() => setOwnerScreen("choice")}
              >
                ← Back
              </button>


              <div className="section-label">
                OWNER REGISTRATION
              </div>

              <h1>
                Create Instrument Owner Account
              </h1>

              <p className="form-description">
                Enter your details to create a MAAP360
                instrument owner account.
              </p>


              <form onSubmit={registerOwner}>


                <label>
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={ownerName}
                  onChange={(e) =>
                    setOwnerName(e.target.value)
                  }
                  required
                />


                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />


                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />


                <label>
                  Shop Name
                </label>

                <input
                  type="text"
                  placeholder="Enter shop name"
                  value={shopName}
                  onChange={(e) =>
                    setShopName(e.target.value)
                  }
                  required
                />


                <label>
                  Shop Type
                </label>

                <select
                  value={shopType}
                  onChange={(e) =>
                    setShopType(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Select shop type
                  </option>

                  <option value="Retail Shop">
                    Retail Shop
                  </option>

                  <option value="Wholesale Shop">
                    Wholesale Shop
                  </option>

                  <option value="Manufacturing Unit">
                    Manufacturing Unit
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>


                <label>
                  Business Type
                </label>

                <select
                  value={businessType}
                  onChange={(e) =>
                    setBusinessType(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Select business type
                  </option>

                  <option value="Grocery">
                    Grocery
                  </option>

                  <option value="Retail">
                    Retail
                  </option>

                  <option value="Manufacturing">
                    Manufacturing
                  </option>

                  <option value="Trading">
                    Trading
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>


                <label>
                  Address
                </label>

                <textarea
                  placeholder="Enter complete shop address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  required
                />


                <label>
                  Set Password
                </label>

                <input
                  type="password"
                  placeholder="Create your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />


                <button
                  type="submit"
                  className="primary-form-button"
                >
                  Create Owner Account
                </button>

              </form>

            </div>

          )}


          {/* ================= REGISTRATION SUCCESS ================= */}

          {ownerScreen === "registered" && (

            <div className="form-card success-card">

              <div className="success-icon">
                ✓
              </div>

              <div className="section-label">
                REGISTRATION SUCCESSFUL
              </div>

              <h1>
                Owner Account Created
              </h1>

              <p>
                Your unique MAAP360 Owner ID has been
                generated.
              </p>


              <div className="owner-id-box">

                <small>
                  YOUR UNIQUE OWNER ID
                </small>

                <strong>
                  {ownerId}
                </strong>

              </div>


              <p className="important-note">
                Keep this Owner ID safe. It will be required
                whenever you login to MAAP360.
              </p>


              <button
                className="primary-form-button"
                onClick={() => {
                  setOwnerScreen("login");
                  setLoginOwnerId(ownerId);
                  setLoginPassword("");
                }}
              >
                Continue to Login
              </button>

            </div>

          )}


          {/* ================= OWNER LOGIN ================= */}

          {ownerScreen === "login" && (

            <div className="form-card">

              <button
                className="back-button"
                onClick={() => setOwnerScreen("choice")}
              >
                ← Back
              </button>


              <div className="section-label">
                OWNER LOGIN
              </div>

              <h1>
                Login
              </h1>

              <p className="form-description">
                Enter your Owner ID and password to continue.
              </p>


              <label>
                Owner ID
              </label>

              <input
                type="text"
                placeholder="Example: MAAP-123456"
                value={loginOwnerId}
                onChange={(e) =>
                  setLoginOwnerId(e.target.value)
                }
              />


              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
              />


              {loginError && (

                <div className="error-message">
                  {loginError}
                </div>

              )}


              {!otpSent && (

                <button
                  className="primary-form-button"
                  onClick={sendOtp}
                >
                  Continue
                </button>

              )}


              {/* OTP */}

              {otpSent && (

                <div className="otp-section">

                  <div className="otp-message">

                    OTP has been sent to your
                    registered mobile number.

                  </div>

                  <label>
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    placeholder="Enter 6 digit OTP"
                    maxLength="6"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                  />


                  <button
                    className="primary-form-button"
                    onClick={verifyOtp}
                  >
                    Verify OTP & Login
                  </button>


                  <div className="demo-otp">
                    Demo OTP: <strong>123456</strong>
                  </div>

                </div>

              )}

            </div>

          )}


          {/* ================= OWNER DASHBOARD ================= */}

          {ownerScreen === "dashboard" && loggedIn && (

            <div className="owner-dashboard">


              <div className="dashboard-header">

                <div>

                  <div className="section-label">
                    INSTRUMENT OWNER
                  </div>

                  <h1>
                    Owner Dashboard
                  </h1>

                  <p>
                    Welcome, {ownerName || "Owner"}
                  </p>

                </div>


                <button
                  className="logout-button"
                  onClick={logoutOwner}
                >
                  Logout
                </button>

              </div>


              {/* OWNER DETAILS */}

              <div className="owner-details-card">

                <div>
                  <small>
                    OWNER ID
                  </small>

                  <strong>
                    {ownerId}
                  </strong>
                </div>

                <div>
                  <small>
                    SHOP NAME
                  </small>

                  <strong>
                    {shopName}
                  </strong>
                </div>

                <div>
                  <small>
                    PHONE NUMBER
                  </small>

                  <strong>
                    {phone}
                  </strong>
                </div>

                <div>
                  <small>
                    EMAIL
                  </small>

                  <strong>
                    {email}
                  </strong>
                </div>

                <div>
                  <small>
                    ADDRESS
                  </small>

                  <strong>
                    {address}
                  </strong>
                </div>

              </div>


              {/* FOUR STATISTICS */}

              <div className="statistics-grid">


                <div className="stat-card">

                  <small>
                    TOTAL REGISTERED INSTRUMENTS
                  </small>

                  <strong>
                    3
                  </strong>

                </div>


                <div className="stat-card active-stat">

                  <small>
                    ACTIVELY VERIFIED INSTRUMENTS
                  </small>

                  <strong>
                    1
                  </strong>

                </div>


                <div className="stat-card expired-stat">

                  <small>
                    EXPIRED INSTRUMENTS
                  </small>

                  <strong>
                    1
                  </strong>

                </div>


                <div className="stat-card warning-stat">

                  <small>
                    INSTRUMENTS EXPIRING THIS MONTH
                  </small>

                  <strong>
                    1
                  </strong>

                </div>


              </div>


              {/* INSTRUMENT LIST */}

              <div className="instrument-section">

                <div className="section-label">
                  REGISTERED INSTRUMENTS
                </div>

                <h2>
                  Instrument Details
                </h2>


                <div className="instrument-list">

                  {instruments.map((instrument) => (

                    <div
                      className="instrument-row"
                      key={instrument.id}
                    >

                      <div>

                        <small>
                          INSTRUMENT ID
                        </small>

                        <strong>
                          {instrument.id}
                        </strong>

                      </div>


                      <div>

                        <small>
                          INSTRUMENT TYPE
                        </small>

                        <strong>
                          {instrument.type}
                        </strong>

                      </div>


                      <div>

                        <small>
                          VERIFICATION DATE
                        </small>

                        <strong>
                          {instrument.verificationDate}
                        </strong>

                      </div>


                      <div>

                        <small>
                          EXPIRING DATE
                        </small>

                        <strong>
                          {instrument.expiryDate}
                        </strong>

                      </div>


                      <div>

                        <span
                          className={
                            instrument.status === "ACTIVELY VERIFIED"
                              ? "status active"
                              : instrument.status === "EXPIRED"
                                ? "status expired"
                                : "status warning"
                          }
                        >
                          {instrument.status}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          )}

        </div>

      )}


      {/* ================= GOVERNMENT OFFICER ================= */}

      {page === "officer" && (

        <div className="page">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>

          <div className="simple-card">

            <div className="section-label">
              GOVERNMENT
            </div>

            <h1>
              Government Officer Dashboard
            </h1>

            <button className="large-login-button">
              Login
            </button>

          </div>

        </div>

      )}


      {/* ================= REPORT DEVICE ================= */}

      {page === "report" && (

        <div className="page">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>

          <div className="simple-card">

            <div className="section-label">
              REPORT
            </div>

            <h1>
              Report a Device
            </h1>

            <p>
              Device reporting section.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;