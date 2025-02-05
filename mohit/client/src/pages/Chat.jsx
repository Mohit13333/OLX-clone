import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../contexts/AuthProvider";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const socket = io("https://olx-clone-fwgz.onrender.com");

const Chat = () => {
  const { id } = useParams();
  const { authToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [otherUser, setOtherUser] = useState("");

  useEffect(() => {
    if (authToken) {
      const { _id } = jwtDecode(authToken);
      setSender(_id);
    }
  }, [authToken]);

  useEffect(() => {
    fetch(`https://olx-clone-fwgz.onrender.com/chat/${id}`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching chat messages:", error));

    const otherUserId = id.replace(sender, "");
    console.log(otherUserId);
    axios
      .post("https://olx-clone-fwgz.onrender.com/user/user", { userId: otherUserId })
      .then((response) => setOtherUser(response.data.name))
      .catch((error) => console.error("Error fetching user:", error));

    socket.emit("joinRoom", id);

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off();
    };
  }, [id, sender]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", { roomId: id, sender, message });
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>{otherUser}</h2>
      </div>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === sender
                ? { ...styles.message, ...styles.myMessage }
                : { ...styles.message, ...styles.otherMessage }
            }
          >
            <strong>{msg.sender === sender ? "You" : otherUser}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
          placeholder="Type a message..."
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  header: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    marginBottom: "20px",
  },
  chatBox: {
    width: "100%",
    maxWidth: "600px",
    height: "70vh",
    overflowY: "scroll",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  myMessage: {
    backgroundColor: "#007bff",
    color: "white",
    alignSelf: "flex-end",
    textAlign: "right",
    marginLeft: "auto",
  },
  otherMessage: {
    backgroundColor: "#e0e0e0",
    color: "black",
    alignSelf: "flex-start",
    textAlign: "left",
    marginRight: "auto",
  },
  form: {
    display: "flex",
    width: "100%",
    maxWidth: "600px",
  },
  input: {
    flexGrow: 1,
    width: "100%",
    padding: "10px",
    borderRadius: "8px 0 0 8px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    height: "42px",
  },
  button: {
    borderRadius: "0 8px 8px 0",
    border: "1px solid #ddd",
    backgroundColor: "black",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    width:'fit',
    height: "42px",
  },
};

export default Chat;
