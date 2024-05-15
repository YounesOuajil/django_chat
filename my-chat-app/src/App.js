import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const historyRef = useRef(null);

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const newSocket = new WebSocket(
      `ws://localhost:8000/ws/chat/${senderId}/${receiverId}/`
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection established.");
      setSocketStatus("Connected");
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
      setSocketStatus("Disconnected");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketStatus("Error");
    };

    newSocket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log("Received message:", messageData);
      setReceivedMessages((prevMessages) => [...prevMessages, messageData]);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    getHistory();
  }, [senderId, receiverId]);

  const getHistory = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/messaging/api/chat/${senderId}/${receiverId}/history/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      const result = await response.json();
      setMessages(result);
      // Scroll to the bottom of the history
      if (historyRef.current) {
        // Delay setting scrollTop to ensure messages are rendered first
        setTimeout(() => {
          historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }, 0);
      }
    } catch (error) {
      console.error("Error fetching history:", error.message);
    }
  };

  const handleMessageSend = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      message.trim() !== ""
    ) {
      const messageData = { message };
      socket.send(JSON.stringify(messageData));
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="ids">
          <label>Sender ID:</label>
          <input
            type="text"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
          />
          <label>Receiver ID:</label>
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </div>
      </div>
      <div className="chat-history" ref={historyRef}>
        <h3>Conversation History:</h3>
        <ul className="message-list">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`message-item ${
                msg.sender === parseInt(senderId) ? "sender" : "receiver"
              }`}
            >
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-timestamp">{msg.timestamp}</div>
              </div>
            </li>
          ))}
          <li className="new-message-divider">New Message</li>
          {receivedMessages.map((msg, index) => {
            if (
              !messages.some(
                (m) =>
                  m.message === msg.message && m.sender_id === msg.sender_id
              )
            ) {
              return (
                <li
                  key={index}
                  className={`message-item new-message ${
                    msg.sender_id === senderId ? "sender" : "receiver"
                  }`}
                >
                  <div className="message-content">
                    <div className="message-text">{msg.message}</div>
                  </div>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
