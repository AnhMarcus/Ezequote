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

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userloginData = JSON.parse(Cookies.get("userloginData") || "{}")
  const loginName = userloginData.firstName && userloginData.lastName ? `${userloginData.firstName} ${userloginData.lastName}` : ""

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

  const renderDropdownItems = (options) =>
    options.map((option) => (
      <Dropdown.Item key={option.key} text={option.text} value={option.value} />
    ));

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="custom-action-bar">
            <nav className="navigation">
              <ul>
                <li>
                  <p>Ngày 21/04/2025 </p>
                </li>
                <li>
                  <p>
                    VP Lý Nam Đế cup điện 8h-13h, Buổi chiều làm binh thường
                  </p>
                </li>
              </ul>
            </nav>
          </div>
          <div className="sub_header">
            <Link to="/">
              <img src={Ezequote_logo} alt="Ezequote_logo" id="logo" />
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="bars" />
            </button>
            <nav className={`navigation-menu-bar ${menuOpen ? "open" : ""}`}>
              <ul>
                <li className="home">
                  <Link to="/">{data.homePage.home}</Link>
                </li>
                <li>
                  <a href="/ede" target="_blank" rel="noopener noreferrer">
                    <Icon name="chart bar outline" />
                    {data.homePage.ede}
                  </a>
                </li>
                <li>
                  <Dropdown
                    className="teams"
                    floating
                    labeled
                    icon="users"
                    search
                    text="TEAM"
                  >
                    <Dropdown.Menu>
                      {isLoggedIn ? (
                        renderDropdownItems(teamsOptions)
                      ) : (
                        <Dropdown.Item
                          disabled
                          text="Please login to view teams"
                        />
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li>
                  <Dropdown
                    className="teams"
                    floating
                    labeled
                    icon="caret square right outline"
                    search
                    text="ACTIVITY"
                  >
                    <Dropdown.Menu>
                      {isLoggedIn ? (
                        renderDropdownItems(activeOptions)
                      ) : (
                        <Dropdown.Item
                          disabled
                          text="Please login to view activities"
                        />
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li>
                  <Icon name="download" />
                  {data.homePage.download}
                </li>
                <li>
                  <a href="/tuyendung" rel="noopener noreferrer">
                    <Icon name="bell" />
                    {data.homePage.contact}
                  </a>
                </li>
                <li>
                  {isLoggedIn ? (
                    <Dropdown
                      className="user-dropdown"
                      floating
                      labeled
                      search
                      text={`Hi! ${loginName}`}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          to="/account/profile"
                          text="My Account"
                          icon="user circle"
                        />
                        <Dropdown.Item
                          text="Logout"
                          icon="sign-out"
                          onClick={() => {
                            Cookies.remove("userloginData");
                            setIsLoggedIn(false);
                            window.location.href = "/login";
                          }}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <a href="/login" rel="noopener noreferrer">
                      LOGIN
                    </a>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
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
            <Route path="/account" element={<AccountLayout />}>
              <Route path="/account/profile" element={<Profile />} />
              <Route
                path="/account/change-password"
                element={<ChangePassword />}
              />
              <Route path="/account/address" element={<Address />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
