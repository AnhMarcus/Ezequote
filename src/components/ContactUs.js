import React, { useEffect, useState } from "react";
import "../components/contactUs.scss";
import Cookies from "js-cookie";

const ContactUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get("userloginData")
    const token = userData  ? JSON.parse(userData ).token : null

    if (!token) {
      // 👇 Redirect thủ công nếu không có token
      window.location.href = "/login";
    }
  },[])

  return (
    <div className="contact-form">
      {loading && (
        <div className="iframe-loader">
          <div className="spinner"></div>
          <p>Đang tải form, vui lòng đợi...</p>
        </div>
      )}
      <iframe
        src="https://form.jotform.com/Paul832/interview-registration-ezequote-for"
        frameBorder="0"
        title="Interview Registration Form"
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoading(false)}
      />
    </div>
    // </div>
  );
};

export default ContactUs;
