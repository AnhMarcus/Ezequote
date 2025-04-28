import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./resetPasswordConfirm.scss";

const ResetPasswordConfirm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7283/api/account/confirm-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            newPassword: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess("✅ Password reset successfully! You can now login.");
        setError("");
      } else {
        setError(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="reset-confirm-container">
      <form className="reset-confirm-form" onSubmit={handleSubmit}>
        <h2>Reset Your Password</h2>

        {error && <p className="error-text">⚠️ {error}</p>}
        {success && <p className="success-text">{success}</p>}

        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="reset-btn">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;
