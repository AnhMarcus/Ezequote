import logo from "../data/images/logo.png";
import { useState } from "react";
import { validateInput } from "../utils/validators";
import "../components/passwordReset.scss";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom"; // thêm import này

const SITE_KEY = "6Lc53iYrAAAAAD36VwToYlvtmZR-ZFoTCt0L1J06";
// const SECRET_KEY = '6Lc53iYrAAAAMQR-yKlK6C2uB53I3WJaQjgpWu'

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate(); // tạo navigate

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const err = validateInput("email", value);
    setError(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("⚠️ Please complete the captcha.");
      return;
    }

    const err = validateInput("email", email);
    if (err) {
      setError(err || "Please complete the capcha.");
      return;
    }

    const payload = {
      email: email,
      captchaToken: captchaToken,
    };

    try {
      console.log("Captcha token trước khi gửi:", captchaToken);
      const response = await fetch(
        "https://localhost:7283/api/Account/reset-password-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setError("");
        navigate("/confirm-password-reset");
      } else {
        setError(result.message || "Captcha verification failed or email not found.");
        setCaptchaToken("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div>
      <div className="forgot-container">
        <img src={logo} alt="logo" />
        <form className="forgot-form" onSubmit={handleSubmit}>
          <h2>Forgot Your Password ?</h2>
          <p>
            Enter your user account's verified email address and we will send
            you a password reset link.
          </p>

          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
            {error && <p className="error-text">⚠️ {error}</p>}
          </div>

          <h3>Verify your account</h3>
          <div className="recaptcha-wrapper">
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={handleCaptchaChange}
              onExpired={() => setCaptchaToken("")}
            />
          </div>

          <button
            type="submit"
            className="send-btn"
            disabled={!email || !!error}
          >
            Send password reset email
          </button>

          {submitted && !error && (
            <p className="success-text">
              ✅ Check your email for a reset link.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
