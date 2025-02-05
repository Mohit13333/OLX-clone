import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import {jwtDecode} from 'jwt-decode';

const Product = () => {

    const navigate=useNavigate()

    const [buyer, setBuyer] = useState('');

    const { authToken } = useAuth();

    useEffect(() => {
        if (authToken) {
        const { _id } = jwtDecode(authToken);
        setBuyer(_id);
        }
    }, [authToken]);

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://olx-clone-fwgz.onrender.com/product/product/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img src={product.photo} alt={product.name} style={styles.image} />
      </div>
      <div style={styles.details}>
        <h1 style={styles.title}>Name:- {product.name}</h1>
        <p style={styles.price}>Price:- ₹{product.price}</p>
        <p style={styles.description}>Description:- {product.description}</p>
        <p style={styles.seller}>Seller ID: {product.seller}</p>
        <div onClick={()=>{navigate(`/chat/${product.seller}${buyer}`)}} style={styles.chat} className="chat-button">Chat with Seller</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  },
  imageContainer: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px'
  },
  details: {
    width: '100%',
    maxWidth: '600px',
    textAlign: 'left'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  description: {
    fontSize: '16px',
    marginBottom: '10px'
  },
  seller: {
    fontSize: '16px',
    marginBottom: '10px'
  },
  chat: {
    padding: '10px 20px',
    backgroundColor: 'black',
    color: 'white',
    marginTop: '40px',
    borderRadius: '999px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  .chat-button:hover {
    background-color: #333;
    transform: scale(1.05);
  }
`, styleSheet.cssRules.length);

export default Product;