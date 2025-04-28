import "./signUp.scss";
import { useState } from "react";
import { validateInput } from "../utils/validators";
import Cookies from "js-cookie";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // validate input ngay khi người dùng nhập
    let errorMessage = validateInput(name, value);

    // 👇 Kiểm tra confirmPassword khi gõ
    if (name === "confirmPassword" && value !== formData.password) {
      errorMessage = "Passwords do not match.";
    }

    if (
      name === "confirmPassword" &&
      value && // chỉ so sánh nếu có value
      formData.password &&
      value !== formData.password
    ) {
      errorMessage = "Passwords do not match.";
    }

    // ✅ Nếu đang gõ lại password, và confirmPassword có sẵn => so sánh ngược lại
    if (
      name === "password" &&
      formData.confirmPassword && // đã có confirm rồi
      value &&
      value !== formData.confirmPassword
    ) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else if (name === "password") {
      // Nếu khớp hoặc confirm trống, xóa lỗi
      setError((prev) => {
        const updated = { ...prev };
        delete updated.confirmPassword;
        return updated;
      });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    setError((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("DEBUG formData", formData);
    e.preventDefault();

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateInput(key, value);
      if (error) newErrors[key] = error;
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    setSubmitError("");

    try {
      const response = await fetch("https://localhost:7283/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      const resData = await response.json();
      if (!response.ok) {
        setSubmitError(resData.message || "Đăng ký thất bại.");
        return;
      }
      alert("Đăng ký thành công !");
      window.location.pathname = "/login";
    } catch (err) {
      setSubmitError("Lỗi kết nối server");
      console.log(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Please fill in the details to create an account</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {error.lastName && (
              <p className="error-text">
                <span className="error-icon">⚠️</span>
                {error.lastName}
              </p>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {error.firstName && (
              <p className="error-text">
                <span className="error-icon">⚠️</span>
                {error.firstName}
              </p>
            )}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {error.email && (
              <p className="error-text">
                <span className="error-icon">⚠️</span>
                {error.email}
              </p>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error.confirmPassword && (
              <p className="error-text">
                <span className="error-icon">⚠️</span>
                {error.confirmPassword}
              </p>
            )}
          </div>
          {submitError && <p className="error-text">{submitError}</p>}
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
          <div className="signup-footer">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
