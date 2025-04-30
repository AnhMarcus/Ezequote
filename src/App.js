/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
import "./App.scss";
import Ezequote_logo from "./Ezequote_logo.png";
import WidgetsComponent from "./components/WidgetsComponent";
import Footer from "./components/Footer";
import Slider from "./components/Slider";
import images from "./data/images";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import EdePage from "./components/EdePage";
import { Dropdown, Icon } from "semantic-ui-react";
import data from "./data/data.json";
// eslint-disable-next-line no-unused-vars
import ContactUs from "./components/ContactUs";
import Login from "./components/Login";
import fetchData from "./services/auth.services";
import Cookies from "js-cookie";
import SignUp from "./components/SignUp";
import PasswordReset from "./components/PasswordReset";
import Profile from "./pages/Profile";
import { teamsOptions, activeOptions } from "./data/dropdownOptions";
import AccountLayout from "./pages/AccountLayout";
import ChangePassword from "./pages/ChangePassword";
import Address from "./pages/Address";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import ActivityDetail from "./pages/activity/ActivityDetail";
import GetAllUsers from "./pages/admin/GetAllUsers";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [announcement, setAnnouncement] = useState([]);
  const userloginData = JSON.parse(Cookies.get("userloginData") || "{}");
  const loginName =
    userloginData.role === "admin"
      ? userloginData.firstName || userloginData.lastName || "Admin"
      : `${userloginData.firstName || ""} ${
          userloginData.lastName || ""
        }`.trim();
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = userloginData.role === "admin";

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch("https://localhost:7283/api/Announcement");
      const data = await response.json();
      setAnnouncement(data);
    } catch (error) {
      console.error("Lỗi khi fetch announcement:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // nếu scroll xuống quá 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchAnnouncement(); // gọi khi lần đầu mở App
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const { data, error } = await fetchData(
        "https://localhost:7283/api/User/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 Đảm bảo có tokenn
          },
        }
      );

      if (error) {
        console.log("Lỗi:", error);
        return;
      }
      console.log("============", data);
    };
    getUsers();
  });

  useEffect(() => {
    const user = Cookies.get("userloginData");
    setIsLoggedIn(!!user); // true nếu có cookie
  }, []);

  useEffect(() => {
    const handleAnnouncementUpdated = () => {
      fetchAnnouncement(); // fetch lại khi admin có thay đổi
    };

    window.addEventListener("announcement-updated", handleAnnouncementUpdated);
    return () => {
      window.removeEventListener(
        "announcement-updated",
        handleAnnouncementUpdated
      );
    };
  }, []);

  const renderDropdownItems = (options) =>
    options.map((option) => (
      <Dropdown.Item key={option.key} text={option.text} value={option.value} />
    ));

  return (
    <Router>
      <div className="App">
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
          <div className="custom-action-bar">
            <nav className="navigation">
              <ul>
                {announcement.map((item) => (
                  <li key={item.id}>
                    <p>{item.title}</p>
                    <p>{item.content}</p>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="sub_header">
            <Link to="/">
              <img src={Ezequote_logo} alt="Ezequote_logo" id="logo" />
            </Link>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name="bars" />
            </button>
            <nav className={`navigation-menu-bar ${menuOpen ? "open" : ""}`}>
              <ul>
                {!isAdmin && (
                  <>
                    <li className="home">
                      <Link to="/">{data.homePage.home}</Link>
                    </li>
                    <li>
                      <a href="/ede" target="_blank" rel="noopener noreferrer">
                        {data.homePage.ede}
                      </a>
                    </li>
                    <li>
                      <a>
                        <Dropdown className="teams" floating labeled search text="TEAM">
                          <Dropdown.Menu>
                            {isLoggedIn ? (renderDropdownItems(teamsOptions)) : (
                              <Dropdown.Item disabled text="Please login to view teams"/>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </a>
                    </li>
                    <li>
                      <a>
                        <Dropdown className="teams" floating labeled search text="ACTIVITY">
                          <Dropdown.Menu>
                            {isLoggedIn ? (
                              activeOptions.map((option) => (
                                <Dropdown.Item key={option.key} as={Link} to={option.value} text={option.text}/>))) : 
                                (<Dropdown.Item disabled text="Please login to view activities"/>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </a>
                    </li>
                    <li>
                      <a>{data.homePage.download}</a>
                    </li>
                    <li>
                      <a href="/tuyendung" rel="noopener noreferrer">
                        {data.homePage.contact}
                      </a>
                    </li>
                    <li>
                      {isLoggedIn ? (
                        <Dropdown className="user-dropdown" floating labeled search text={`Hi! ${loginName}`}>
                          <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/account/profile" text="My Account" icon="user circle"/>
                            <Dropdown.Item text="Logout" icon="sign-out"
                              onClick={() => {
                                Cookies.remove("userloginData");
                                setIsLoggedIn(false);
                                window.location.href = "/login";
                              }}
                            />
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (<a href="/login" rel="noopener noreferrer">LOGIN</a>)}
                    </li>
                  </>
                )}

                {isAdmin && (
                  <>
                    <li>
                      <Link to="/admin/announcements">Notification</Link>
                    </li>
                    <li>
                      <Link to="/admin/users">Users</Link>
                    </li>
                    <li>
                      {isLoggedIn ? (
                        <Dropdown className="user-dropdown" floating labeled search text={`Hi! ${loginName}`}>
                          <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/account/profile" text="My Account" icon="user circle"/>
                            <Dropdown.Item text="Logout" icon="sign-out"
                              onClick={() => {
                                Cookies.remove("userloginData");
                                setIsLoggedIn(false);
                                window.location.href = "/login";
                              }}
                            />
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (<a href="/login" rel="noopener noreferrer">LOGIN</a>)}
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/"
              element={
                <>
                  <Slider>
                    {images.map((image, index) => {
                      return (
                        <img
                          key={index}
                          src={image.imgURL}
                          alt={image.imgAlt}
                        />
                      );
                    })}
                  </Slider>
                  <WidgetsComponent />
                </>
              }
            />
            <Route path="/ede" element={<EdePage />} />
            <Route path="/tuyendung" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="password_reset" element={<PasswordReset />} />
            <Route path="/confirm-password-reset" element={<ResetPasswordConfirm />}/>
            <Route path="/admin/announcements" element={<AdminAnnouncements />}/>
            <Route path="/admin/users" element={<GetAllUsers />}/>
            <Route path="/account" element={<AccountLayout />}>
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/change-password" element={<ChangePassword />}/>
              <Route path="/account/address" element={<Address />} />
            </Route>
            <Route path="/activity/:activityType" element={<ActivityDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
