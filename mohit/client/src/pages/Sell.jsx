import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { jwtDecode } from "jwt-decode";
import "./sell.css";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState("");
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      const { _id } = jwtDecode(authToken);
      setSeller(_id);
    }
  }, [authToken]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    photo: null,
    seller: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, seller }));
  }, [seller]);

  // Automatically get the user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (key !== "latitude" && key !== "longitude") {
        data.append(key, formData[key]);
      }
    }

    // Attach location data
    const location = JSON.stringify({
      type: "Point",
      coordinates: [formData.longitude, formData.latitude],
    });
    data.append("location", location);

    try {
      const res = await axios.post("https://olx-clone-fwgz.onrender.com/product/createproduct", data);
      console.log(res.data);
      setLoading(false);
      alert("Product added");
      navigate("/");
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.error("Error response:", err.response.data);
      } else {
        console.error("Error message:", err.message);
      }
    }
  };

  return (
    <div className="sell-page">
      <h1>Sell a Product</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
        <p>Latitude: {formData.latitude || "Fetching..."}</p>
        <p>Longitude: {formData.longitude || "Fetching..."}</p>
        <input type="file" name="photo" onChange={handlePhotoChange} required />
        {loading ? <button style={{ backgroundColor: "gray" }}>Uploading...</button> : <button type="submit">Submit</button>}
      </form>
    </div>
  );
};

export default Sell;
