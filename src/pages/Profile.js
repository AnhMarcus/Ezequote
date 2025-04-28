import { Input, Icon, Button, Image, Radio, Modal } from "semantic-ui-react";
import "../pages/profile.scss";
import { useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Cookies from "js-cookie";

const Profile = () => {
  const [gender, setGender] = useState("male");
  const fileInputRef = useRef(null); // Open file explorer
  const [selectedImage, setSelectedImage] = useState(null); // Avatar default
  const [previewImage, setPreviewImage] = useState(null);   // ảnh vừa chọn
  const [selectedFile, setSelectedFile] = useState(null); // Lưu ảnh vào localStorage
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [phone, setPhone] = useState('');

  const userloginData = JSON.parse(Cookies.get("userloginData") || "{}")
  const token = userloginData.token;
  const loginName = userloginData.firstName && userloginData.lastName ? `${userloginData.firstName} ${userloginData.lastName}` : ""
  const [email, setEmail] = useState(userloginData.email || "");


  useEffect(() => {
    fetch("https://localhost:7283/api/Profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => res.json()).then((data) => {
      setPhone(data.phone || "")
      setGender(data.gender || "male")
      setBirthDate(data.birthDate ? new Date(data.birthDate) : null)
      setSelectedImage(data.avatarUrl)
    })
  },[])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = () => {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("gender", gender)
    formData.append("birthDate", birthDate ? birthDate.toISOString() : "")
    if (selectedFile) formData.append("avatar", selectedFile)
    fetch("https://localhost:7283/api/Profile/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    }).then((res) => res.json()).then((data) => {
      if (data.avatarUrl) setSelectedImage(data.avatarUrl)
      setPreviewImage(null)
      setSelectedFile(null)
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 2000)
    })
  }


  return (
    <div className="my-account">
      <div className="account-content">
        <div className="profile-info">
          <h2>My Profile</h2>
          <p>Manage profile information to keep your account secure</p>
          <div className="form-layout">
            <div className="form-section">
              <div className="items">
                <label>Login Name</label>
                <Input value={loginName} disabled />
              </div>
              <div className="items">
                <label>Email</label>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="error-message" />
              </div>
              <div className="items">
                <label>Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number"/>
              </div>
              <div className="items">
                <label>Gender</label>
                <div className="gender-options">
                  <Radio
                    label="Nam"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                  />
                  <Radio
                    label="Nữ"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                  />
                  <Radio
                    label="Khác"
                    name="gender"
                    value="other"
                    checked={gender === "other"}
                    onChange={() => setGender("other")}
                  />
                </div>
              </div>
              <div className="items">
                <label>Date of birth</label>
                <div className="date-picker-wrapper">
                  <DatePicker
                    selected={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    placeholderText="Date of birth"
                    maxDate={new Date()}
                    showIcon
                  />
                </div>
              </div>
              <Button primary onClick={handleUpdate}>
                Update
              </Button>
            </div>
            <div className="avatar-section">
              <Image
                src={ previewImage || selectedImage || "https://react.semantic-ui.com/images/wireframe/square-image.png" }
                avatar
                size="small"
              />
              <Button secondary onClick={() => fileInputRef.current.click()}>
                Change Avatar
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} size="small">
        <Modal.Header>
          <Icon name="check circle" color="green" />Updated successfully
        </Modal.Header>
        <Modal.Content>
          <p>Your profile information has been updated successfully!</p>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default Profile;
