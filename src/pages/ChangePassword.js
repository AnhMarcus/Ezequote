import { useState } from "react";
import { Input, Button, Form, Message, Icon, Divider } from "semantic-ui-react";
import './changePassword.scss';
import Key from '../data/images/key.png'
import Cookies from "js-cookie";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all information.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Confirmation password does not match.");
      return;
    }

    const email = Cookies.get('email');
    if (!email) {
      setError("Cannot find email information. Please login again.");
      return;
    }

    fetch("https://localhost:7283/api/User/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        currentPassword,
        newPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => { throw new Error(text); });
        }
        return response.text();
      })
      .then(() => {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        setError(error.message || "Failed to change password.");
      });
  };

  return (
    <div className="change-password">
        <div className="header-section">
            <img src={Key} alt="Lock" className="lock-icon"/>
            <h1>Change Password</h1>
        </div>
      <p className="description">Please enter information to change your password.</p>
      
      <Divider />
      
      <h2>Old Password</h2>
      <Form error={!!error} success={success}>
        <Form.Field>
          <Input
            type="password"
            placeholder="Old Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon="lock"
            iconPosition="left"
          />
        </Form.Field>

        <h2>New Password</h2>
        <Form.Field>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon="key"
            iconPosition="left"
          />
        </Form.Field>

        <Form.Field>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={
                confirmPassword ? (
                  newPassword === confirmPassword ? (<Icon name="check circle" color="green" />) : (<Icon name="times circle" color="red" />)
                ) : (
                  <Icon name="check circle" />
                )
              }
            iconPosition="left"
          />
        </Form.Field>

        {error && (
          <Message error>
            <Icon name="exclamation triangle" />
            {error}
          </Message>
        )}
        {success && (
          <Message success>
            <Icon name="check circle" />Password changed successfully!
          </Message>
        )}

        <Button primary fluid onClick={handleSubmit} className="confirm-button">
          CHANGE PASSWORD
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;