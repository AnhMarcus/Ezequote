import "../components/login.scss";
import { useState } from "react";
import fetchData from "../services/auth.services";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { validateInput } from "../utils/validators";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateInput("email", data.email);
    if (errorMessage) {
      setEmailError(errorMessage);
      return;
    }
    setEmailError("");

    const { data: resData, error } = await fetchData(
      "https://localhost:7283/login",
      {
        method: "POST",
        body: { email: data.email, password: data.password},
      }
    );

    if (error) {
      console.log("Lỗi:", error);
      return;
    }

    alert(resData.message);
    Cookies.set('email', resData.data.email, {
      expires: 1,
      sameSite: 'Lax',
      secure: true,
    });
    Cookies.set(
      "userloginData",
      JSON.stringify({ token: resData.data.token, firstName: resData.data.firstName, lastName: resData.data.lastName, email: resData.data.email, role: resData.data.role }),
      {
        expires: 1,
        sameSite: "Lax",
        secure: true,
      }
    );
    if (resData.data.role === "admin") {
      window.location.pathname = '/admin/announcements'
    } else {
      window.location.pathname = "/";
    }
  };

  return (
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2> Welcome Back </h2> <p> Please login to your account </p>
        </div>
        <form onSubmit={handleSubmit} class="login-form">
          <div class="form-group">
            <label for="email"> Email </label>
            <input
              type="email"
              id="email"
              onChange={(e) => {
                const email = e.target.value;
                setData({ ...data, email: email });
                const error = validateInput("email", email);
                setEmailError(error);
              }}
              placeholder="Enter your email"
              required
            />{emailError && (
              <p className="error-text">
                <span className="error-icon">⚠️</span> {emailError}
              </p>
            )}
          </div>
          <div class="form-group">
            <label for="password"> Password </label>
            <input
              type="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              id="password"
              placeholder="••••••••"
            />
            <span class="toggle-password" onClick={togglePasswordVisibility}>
              {" "}
              👁️{" "}
            </span>
          </div>
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/password_reset">Forgot password ?</Link>
          </div>
          <button type="submit" class="login-btn">
            Login
          </button>
          <div class="login-footer">
            Don 't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

