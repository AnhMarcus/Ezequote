import React, { useState, useEffect } from "react";
import './adminAnnouncement.scss'

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("https://localhost:7283/api/Announcement");
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Lỗi khi fetch:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Hãy nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://localhost:7283/api/announcement/${editingId}`
      : "https://localhost:7283/api/announcement";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const data = await res.json();
        if (editingId) {
          // cập nhật trong mảng
          setAnnouncements((prev) =>
          prev.map((item) => (item.id === editingId ? data : item))
        )
        alert("Cập nhật thành công!");
        } else {
          // thêm mới vào mảng
          setAnnouncements((prev) => [data, ...prev]);
          alert("Thêm thành công!");
        }
        window.dispatchEvent(new Event("announcement-updated"));
        setTitle("");
        setContent("");
        setEditingId(null);
      } else {
        alert("Đã xảy ra lỗi!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleEdit = (announcement) => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setEditingId(announcement.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá?")) return;

    try {
      const res = await fetch(`https://localhost:7283/api/announcement/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Xóa khỏi mảng
        setAnnouncements((prev) => prev.filter((item) => item.id !== id))
        alert("Xoá thành công!");
        window.dispatchEvent(new Event("announcement-updated"));
      } else {
        alert("Không thể xoá!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };


  return (
    <div className="admin-announcements">
      <h2>Quản lý thông báo</h2>

      <form onSubmit={handleSubmit} className="announcement-form">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
      </form>

      <div className="announcement-list">
        <h3>Danh sách thông báo</h3>
        {announcements.length === 0 ? (
          <p>Không có thông báo nào.</p>
        ) : (
          <ul>
            {announcements.map((a) => (
              <li key={a.id}>
                <h4>{a.title}</h4>
                <p>{a.content}</p>
                <small>{new Date(a.createdAt).toLocaleString()}</small>
                <div className="actions">
                  <button onClick={() => handleEdit(a)}>Sửa</button>
                  <button onClick={() => handleDelete(a.id)}>Xoá</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
