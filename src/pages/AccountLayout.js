import { NavLink, Outlet } from "react-router-dom";
import { Icon } from "semantic-ui-react";

const AccountLayout = () => {
    return (
        <div className="my-account">
            <div className="account-sidebar">
                <h3>My Account</h3>
                <ul>
                    <li>
                        <NavLink to="profile" className={({ isActive }) => isActive ? "active" : ""}>
                            <Icon name="user" /> Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/account/address" className={({ isActive }) => isActive ? "active" : ""}>
                            <Icon name="map marker alternate" /> Address
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="change-password" className={({ isActive }) => isActive ? "active" : ""}>
                            <Icon name="lock" /> Change Password
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="account-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AccountLayout;
