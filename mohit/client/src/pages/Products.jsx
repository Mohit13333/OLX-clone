import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locations, setLocations] = useState({});

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          setError(
            "Location access denied. Enable location services and reload."
          );
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8081/product/nearby?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [latitude, longitude]);
  const fetchLocationName = async (lat, lon, productId) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocations((prev) => ({ ...prev, [productId]: data.display_name }));
      } else {
        setLocations((prev) => ({ ...prev, [productId]: "Unknown Location" }));
      }
    } catch {
      setLocations((prev) => ({ ...prev, [productId]: "Unknown Location" }));
    }
  };
useEffect(() => {
  products.forEach((product) => {
    if (product.location?.coordinates?.length === 2 && !locations[product._id]) {
      const [longitude, latitude] = product.location.coordinates;
      fetchLocationName(latitude, longitude, product._id);
    }
  });
}, [products]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Loading products...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
          {error}
        </p>
      ) : (
        <div style={styles.container}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                onClick={() => navigate(`/product/${product._id}`)}
                key={product._id}
                style={styles.card}
              >
                <div style={styles.imageContainer}>
                  <img src={product.photo} alt="product" style={styles.image} />
                  <div style={styles.heart}>❤️</div>
                </div>
                <div style={styles.details}>
                  <div style={styles.price}>₹ {product.price}</div>
                  <div style={styles.title}>{product.name}</div>
                  <div style={styles.description}>{product.description}</div>
                  <div style={styles.location}>
                    <strong>Location:</strong>
                    {locations[product._id]}
                  </div>
                  <div style={styles.distance}>
                    {product.distance !== undefined
                      ? `${(product.distance / 1000).toFixed(2)} km away`
                      : "Distance unavailable"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", padding: "20px" }}>
              No nearby products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  searchInput: {
    width: "100%",
    maxWidth: "600px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  heart: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#fff",
    padding: "5px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  details: {
    padding: "15px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#008000",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "5px 0",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
  },
  location: {
    fontSize: "12px",
    color: "#777",
  },
  distance: {
    fontSize: "12px",
    color: "#777",
  },
};

export default Products;
