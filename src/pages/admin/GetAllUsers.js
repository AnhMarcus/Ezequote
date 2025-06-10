import "../admin/getAllUsers.scss";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "semantic-ui-react";
import Unauthorized from "./Unauthorized";
import { Link } from "react-router-dom";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user",
  });
  const [editUserId, setEditUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const userloginData = JSON.parse(Cookies.get("userloginData") || "{}");
      const isAdmin = userloginData.role === "admin";
      const token = userloginData.token;
      const response = await fetch("https://localhost:7283/api/User/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể fetch users");
      }

      if (!isAdmin) {
        window.location.href = "/unauthorized";
        return null;
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(Cookies.get("userloginData") || "{}").token;
    const url = isEditing
      ? `https://localhost:7283/api/User/update/${editUserId}`
      : "https://localhost:7283/api/User/register";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi dữ liệu");
      const updated = await res.json();
      alert(isEditing ? "Cập nhật thành công !" : "Thêm thành công !");
      setIsFormOpen(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "user",
      });
      setIsEditing(false);
      fetchUsers(); //Reload danh sách users
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này ?")) return;

    try {
      const userloginData = JSON.parse(Cookies.get("userloginData") || "{}");
      const token = userloginData.token;
      const response = await fetch(
        `https://localhost:7283/api/User/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Xóa thất bại.");
      }
      setUsers(users.filter((u) => u.id !== id));
      alert("Đã xóa user thành công !");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      alert("Lỗi khi xóa user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="all-users">
      <div className="table-header">
        <h2>All Users</h2>
        <Button
          className="new-user-btn"
          onClick={() => {
            setIsFormOpen(true);
            setIsEditing(false);
            setFormData({
              email: "",
              password: "",
              firstName: "",
              lastName: "",
              role: "user",
            });
          }}
        >
          + New User
        </Button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isFormOpen && (
        <div className="user-form">
          <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!isEditing}
            />
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="action-buttons">
              <Button color="green" type="submit">
                {isEditing ? "Save" : "Add"}
              </Button>
              <Button color="grey" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) =>
              u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.email}</td>
                <td>
                  <div className="action-buttons">
                    <Button
                      size="small"
                      color="blue"
                      onClick={() => {
                        setIsFormOpen(true);
                        setIsEditing(true);
                        setEditUserId(u.id);
                        setFormData({
                          email: u.email,
                          password: "",
                          firstName: u.firstName || "",
                          lastName: u.lastName || "",
                          role: u.role || "user",
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="red"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetAllUsers;
