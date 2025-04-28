import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Icon,
  Input,
  Checkbox,
  Modal,
  Card,
} from "semantic-ui-react";
import "./address.scss";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import CSS cho phone input
import Cookies from 'js-cookie';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    isDefault: false,
  });
  const getUserEmail = () => {
    return Cookies.get('email') || "";
  };

  useEffect(() => {
    const email = getUserEmail();
    if (email) {
      const storedAddresses = localStorage.getItem(`addresses_${email}`);
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
      }
    }
  }, []);
  const hasDefault = addresses.some(
    (addr) => addr.isDefault && addr.id !== editingId
  );

  const handleChange = (e, { name, value, checked, type }) => {
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOpenAdd = () => {
    setFormData({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      isDefault: false,
    });
    setEditingId(null);
    setOpenModal(true);
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setOpenModal(true);
  };

  const handleSave = () => {
    const email = getUserEmail();
    if (!email) {
      alert('Cannot find user. Please login again.');
      return;
    }
  
    let updatedList = [...addresses];
  
    if (formData.isDefault) {
      updatedList = updatedList.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }
  
    if (editingId) {
      // Update existing
      updatedList = updatedList.map((addr) =>
        addr.id === editingId ? { ...formData, id: editingId } : addr
      );
    } else {
      // Add new
      updatedList.push({ ...formData, id: Date.now() });
    }
  
    setAddresses(updatedList);
  
    // 👇 Lưu vào localStorage theo email
    localStorage.setItem(`addresses_${email}`, JSON.stringify(updatedList));
  
    setFormData({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      isDefault: false,
    });
    setEditingId(null);
    setOpenModal(false);
  };
  

  const handleDelete = (id) => {
    const email = getUserEmail();
    const updatedList = addresses.filter((addr) => addr.id !== id);
    setAddresses(updatedList);
    localStorage.setItem(`addresses_${email}`, JSON.stringify(updatedList));
  };
  

  return (
    <div className="address-page">
      <div className="address-header">
        <h2>My Addresses</h2>
        <Button icon labelPosition="left" onClick={handleOpenAdd}>
          <Icon name="plus" />
          Add New Address
        </Button>
      </div>

      <div className="address-list">
        {addresses.length === 0 && <p>No addresses saved yet.</p>}
        {addresses.map((addr) => (
          <Card key={addr.id} fluid color={addr.isDefault ? "blue" : null}>
            <Card.Content>
              <Card.Meta>{addr.fullName}</Card.Meta>
              <Card.Meta>{addr.phone}</Card.Meta>
              <Card.Description>
                {addr.street}, {addr.city}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {addr.isDefault && (
                  <span style={{ color: "#2185d0", fontWeight: "bold" }}>
                    Default Address
                  </span>
                )}
                <div>
                  <Button icon onClick={() => handleEdit(addr)} color="blue">
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    onClick={() => handleDelete(addr.id)}
                    color="red"
                  >
                    <Icon name="trash" />
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} size="small">
        <Modal.Header>
          {editingId ? "Edit Address" : "Add Address"}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field
              control={Input}
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Form.Field>
              <label>Phone</label>
              <PhoneInput
                country={"vn"}
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
              />
            </Form.Field>
            <Form.Field
              control={Input}
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              label="City / Province"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            {!hasDefault || formData.isDefault ? (
              <Form.Field>
                <Checkbox
                  toggle
                  label="Set as default address"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
              </Form.Field>
            ) : null}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button primary onClick={handleSave}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Address;
