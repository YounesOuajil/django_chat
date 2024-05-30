// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import "./chat.css";

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [receiverId, setReceiverId] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [socketStatus, setSocketStatus] = useState("Connecting...");
//   const historyRef = useRef(null);
//   const location = useLocation();
//   const { id } = location.state;
//   const { senderId } = location.state;

//   useEffect(() => {
//     console.log("id of the resiver is  :", id);
//     console.log("id of the sender is  :", senderId);
//     setReceiverId(senderId);
//     if (!receiverId) return;

//     const newSocket = new WebSocket(
//       `ws://localhost:8000/ws/chat/${id}/${senderId}/`
//     );
//     newSocket.onopen = () => {
//       console.log("WebSocket connection established.");
//       setSocketStatus("Connected");
//     };

//     newSocket.onclose = () => {
//       console.log("WebSocket connection closed.");
//       setSocketStatus("Disconnected");
//     };

//     newSocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setSocketStatus("Error");
//     };

//     newSocket.onmessage = (event) => {
//       const messageData = JSON.parse(event.data);
//       console.log("Received message:", messageData);
//       setReceivedMessages((prevMessages) => [...prevMessages, messageData]);
//     };

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, [id, receiverId]);

//   useEffect(() => {
//     getHistory();
//   }, [id, receiverId]);

//   const getHistory = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/messaging/api/chat/${id}/${receiverId}/history/`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch history");
//       }
//       const result = await response.json();
//       setMessages(result);
//       // Scroll to the bottom of the history
//       if (historyRef.current) {
//         // Delay setting scrollTop to ensure messages are rendered first
//         setTimeout(() => {
//           historyRef.current.scrollTop = historyRef.current.scrollHeight;
//         }, 0);
//       }
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   };

//   const handleMessageSend = () => {
//     if (
//       socket &&
//       socket.readyState === WebSocket.OPEN &&
//       message.trim() !== ""
//     ) {
//       const messageData = { message };
//       socket.send(JSON.stringify(messageData));
//       setMessage("");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="chat-history" ref={historyRef}>
//         <h3>Conversation History:</h3>
//         <ul className="message-list">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item ${
//                 msg.sender === parseInt(senderId) ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.content}</div>
//                 <div className="message-timestamp">{msg.timestamp}</div>
//               </div>
//             </li>
//           ))}
//           <li className="new-message-divider">New Message</li>
//           {receivedMessages.map((msg, index) => {
//             if (
//               !messages.some(
//                 (m) =>
//                   m.message === msg.message && m.sender_id === msg.sender_id
//               )
//             ) {
//               return (
//                 <li
//                   key={index}
//                   className={`message-item new-message ${
//                     msg.sender_id === senderId ? "receiver" : "sender"
//                   }`}
//                 >
//                   <div className="message-content">
//                     <div className="message-text">{msg.message}</div>
//                   </div>
//                 </li>
//               );
//             }
//             return null;
//           })}
//         </ul>
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleMessageSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import "./chat.css";

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [socketStatus, setSocketStatus] = useState("Connecting...");
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [iceCandidatesQueue, setIceCandidatesQueue] = useState([]);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const historyRef = useRef(null);
//   const location = useLocation();
//   const { id, senderId } = location.state;

//   useEffect(() => {
//     const newSocket = new WebSocket(
//       `ws://localhost:8000/ws/chat/${id}/${senderId}/`
//     );
//     setSocket(newSocket);

//     newSocket.onopen = () => {
//       setSocketStatus("Connected");
//       console.log("WebSocket connected");
//     };

//     newSocket.onmessage = (event) => {
//       const messageData = JSON.parse(event.data);
//       console.log("Received message:", messageData);
//       setReceivedMessages((prevMessages) => [...prevMessages, messageData]);
//       handleSignalingData(messageData);
//     };

//     newSocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     newSocket.onclose = () => {
//       setSocketStatus("Disconnected");
//       console.log("WebSocket disconnected");
//     };

//     return () => {
//       newSocket.close();
//     };
//   }, [id, senderId]);

//   useEffect(() => {
//     getHistory();
//   }, [id, senderId]);

//   const getHistory = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/messaging/api/chat/${id}/${senderId}/history/`
//       );
//       const result = await response.json();
//       setMessages(result);
//       if (historyRef.current) {
//         setTimeout(() => {
//           historyRef.current.scrollTop = historyRef.current.scrollHeight;
//         }, 0);
//       }
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   };

//   const handleMessageSend = () => {
//     if (
//       socket &&
//       socket.readyState === WebSocket.OPEN &&
//       message.trim() !== ""
//     ) {
//       const messageData = { message };
//       socket.send(JSON.stringify(messageData));
//       setMessage("");
//       console.log("Sent message:", messageData);
//     }
//   };

//   const handleSignalingData = (data) => {
//     switch (data.type) {
//       case "offer":
//         handleOffer(data);
//         break;
//       case "answer":
//         handleAnswer(data);
//         break;
//       case "candidate":
//         handleCandidate(data);
//         break;
//       default:
//         break;
//     }
//   };

//   const createPeerConnection = () => {
//     const peer = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         {
//           urls: "turn:your.turn.server:3478",
//           username: "user",
//           credential: "pass",
//         },
//       ],
//     });

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         socket.send(
//           JSON.stringify({ type: "candidate", candidate: event.candidate })
//         );
//         console.log("Sent ICE candidate:", event.candidate);
//       }
//     };

//     peer.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//       console.log("Received remote track:", event.streams[0]);
//     };

//     peer.oniceconnectionstatechange = () => {
//       if (peer.iceConnectionState === "disconnected") {
//         console.log("Peer connection disconnected");
//       }
//     };

//     setPeerConnection(peer);
//     return peer;
//   };

//   const startCall = async () => {
//     try {
//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localVideoRef.current.srcObject = localStream;

//       const peer = createPeerConnection();
//       localStream
//         .getTracks()
//         .forEach((track) => peer.addTrack(track, localStream));
//       const offer = await peer.createOffer();
//       await peer.setLocalDescription(offer);

//       if (socket) {
//         socket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
//         console.log("Sent offer:", offer);
//       }
//     } catch (error) {
//       console.error("Error starting call:", error);
//       alert(
//         "Failed to start call. Please check your media devices and try again."
//       );
//     }
//   };

//   const handleOffer = async (offer) => {
//     try {
//       console.log("Handling offer:", offer);
//       const peer = peerConnection || createPeerConnection();
//       console.log("Peer connection created or reused:", peer);

//       await peer.setRemoteDescription(
//         new RTCSessionDescription({ type: "offer", sdp: offer.sdp })
//       );
//       console.log("Set remote description:", offer.sdp);

//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       console.log("Local stream obtained:", localStream);
//       localVideoRef.current.srcObject = localStream;
//       localStream
//         .getTracks()
//         .forEach((track) => peer.addTrack(track, localStream));
//       console.log("Local tracks added to peer connection");

//       const answer = await peer.createAnswer();
//       console.log("Created answer:", answer);
//       await peer.setLocalDescription(answer);
//       console.log("Set local description:", answer.sdp);

//       if (socket) {
//         socket.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
//         console.log("Sent answer:", answer);
//       }

//       setPeerConnection(peer);
//       console.log("Peer connection set");

//       // Add queued ICE candidates
//       iceCandidatesQueue.forEach(async (candidate) => {
//         await peer.addIceCandidate(new RTCIceCandidate(candidate));
//         console.log("Added queued ICE candidate:", candidate);
//       });
//       setIceCandidatesQueue([]);
//     } catch (error) {
//       console.error("Error handling offer:", error);
//       alert("Failed to handle offer. Please refresh the page and try again.");
//     }
//   };

//   const handleAnswer = async (answer) => {
//     try {
//       if (!peerConnection) {
//         console.error("Peer connection is not established.");
//         return;
//       }
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription({ type: "answer", sdp: answer.sdp })
//       );
//       console.log("Handled answer:", answer);
//     } catch (error) {
//       console.error("Error handling answer:", error);
//     }
//   };

//   const handleCandidate = async (candidate) => {
//     try {
//       if (peerConnection) {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//         console.log("Added ICE candidate:", candidate);
//       } else {
//         setIceCandidatesQueue((prevQueue) => [...prevQueue, candidate]);
//         console.log("Queued ICE candidate:", candidate);
//       }
//     } catch (error) {
//       console.error("Error handling candidate:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="chat-history" ref={historyRef}>
//         <h3>Conversation History:</h3>
//         <ul className="message-list">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item ${
//                 msg.sender === parseInt(senderId) ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.content}</div>
//                 <div className="message-timestamp">{msg.timestamp}</div>
//               </div>
//             </li>
//           ))}
//           <li className="new-message-divider">New Message</li>
//           {receivedMessages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item new-message ${
//                 msg.sender_id === senderId ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.message}</div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleMessageSend}>Send</button>
//       </div>
//       <div className="video-container">
//         <button onClick={startCall}>Start Call</button>
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           className="local-video"
//         ></video>
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           className="remote-video"
//         ></video>
//       </div>
//     </div>
//   );
// };

// export default Chat;
// import React, { useState, useEffect, useRef } from "react";&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// import { useLocation } from "react-router-dom";
// import "./chat.css";

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [socketStatus, setSocketStatus] = useState("Connecting...");
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [iceCandidatesQueue, setIceCandidatesQueue] = useState([]);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const historyRef = useRef(null);
//   const location = useLocation();
//   const { id, senderId } = location.state;

//   useEffect(() => {
//     const newSocket = new WebSocket(
//       `ws://localhost:8000/ws/chat/${id}/${senderId}/`
//     );
//     setSocket(newSocket);

//     newSocket.onopen = () => {
//       setSocketStatus("Connected");
//       console.log("WebSocket connection opened.");
//     };

//     newSocket.onmessage = (event) => {
//       const messageData = JSON.parse(event.data);
//       setReceivedMessages((prevMessages) => [...prevMessages, messageData]);
//       console.log("Received signaling data:", messageData);
//       handleSignalingData(messageData);
//     };

//     newSocket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     newSocket.onclose = () => {
//       setSocketStatus("Disconnected");
//       console.log("WebSocket connection closed.");
//       if (peerConnection) {
//         peerConnection.close();
//       }
//     };

//     return () => {
//       if (newSocket) newSocket.close();
//       if (peerConnection) peerConnection.close();
//     };
//   }, [id, senderId]);

//   useEffect(() => {
//     getHistory();
//   }, [id, senderId]);

//   const getHistory = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/messaging/api/chat/${id}/${senderId}/history/`
//       );
//       const result = await response.json();
//       setMessages(result);
//       if (historyRef.current) {
//         setTimeout(() => {
//           historyRef.current.scrollTop = historyRef.current.scrollHeight;
//         }, 0);
//       }
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   };

//   const handleMessageSend = () => {
//     if (
//       socket &&
//       socket.readyState === WebSocket.OPEN &&
//       message.trim() !== ""
//     ) {
//       const messageData = { message };
//       socket.send(JSON.stringify(messageData));
//       setMessage("");
//       console.log("Sent message:", messageData);
//     }
//   };

//   const handleSignalingData = (data) => {
//     switch (data.type) {
//       case "offer":
//         handleOffer(data);
//         break;
//       case "answer":
//         handleAnswer(data);
//         break;
//       case "candidate":
//         handleCandidate(data);
//         break;
//       default:
//         console.log("Unknown signaling data type:", data.type);
//         break;
//     }
//   };

//   const createPeerConnection = () => {
//     const peer = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: [
//             "stun:stun.l.google.com:19302",
//             "stun:stun1.l.google.com:19302",
//           ],
//         },
//         // {
//         //   urls: "turn:your.turn.server:3478",
//         //   username: "user",
//         //   credential: "pass",
//         // },
//       ],
//     });

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         socket.send(
//           JSON.stringify({ type: "candidate", candidate: event.candidate })
//         );
//         console.log("Sent ICE candidate:", event.candidate);
//       }
//     };

//     peer.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//         console.log("Received remote track:", event.streams[0]);
//         console.log("remoteVideoRef:", remoteVideoRef.current);
//       }
//     };

//     peer.oniceconnectionstatechange = () => {
//       console.log("ICE connection state changed:", peer.iceConnectionState);
//       if (peer.iceConnectionState === "disconnected") {
//         console.log("Peer connection disconnected");
//       }
//     };

//     peer.onsetremotedescription = () => {
//       while (iceCandidatesQueue.length) {
//         const candidate = iceCandidatesQueue.shift();
//         peer
//           .addIceCandidate(candidate)
//           .catch((e) => console.error("Error adding queued ICE candidate", e));
//       }
//     };

//     setPeerConnection(peer);
//     return peer;
//   };

//   const startCall = async () => {
//     try {
//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = localStream;
//       }

//       const peer = createPeerConnection();
//       localStream
//         .getTracks()
//         .forEach((track) => peer.addTrack(track, localStream));
//       const offer = await peer.createOffer();
//       await peer.setLocalDescription(offer);

//       console.log("Local Description set:", peer.localDescription);

//       if (socket) {
//         socket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
//         console.log("Sent offer:", offer);
//       }
//     } catch (error) {
//       console.error("Error starting call:", error);
//       alert(
//         "Failed to start call. Please check your media devices and try again."
//       );
//     }
//   };

//   const handleOffer = async (offer) => {
//     try {
//       const peer = peerConnection || createPeerConnection();
//       await peer.setRemoteDescription(
//         new RTCSessionDescription({ type: "offer", sdp: offer.sdp })
//       );
//       console.log("Set remote description with offer:", offer.sdp);

//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = localStream;
//       }

//       localStream
//         .getTracks()
//         .forEach((track) => peer.addTrack(track, localStream));

//       const answer = await peer.createAnswer();
//       await peer.setLocalDescription(answer);

//       console.log("Local Description set with answer:", answer.sdp);

//       if (socket) {
//         socket.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
//         console.log("Sent answer:", answer);
//       }

//       // Add queued ICE candidates after setting remote description
//       for (const candidate of iceCandidatesQueue) {
//         await peer.addIceCandidate(candidate);
//         console.log("Added queued ICE candidate:", candidate);
//       }
//       setIceCandidatesQueue([]);
//       setPeerConnection(peer);
//     } catch (error) {
//       console.error("Error handling offer:", error);
//     }
//   };

//   const handleAnswer = async (answer) => {
//     try {
//       if (!peerConnection) {
//         console.error("Peer connection is not established.");
//         return;
//       }
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription({ type: "answer", sdp: answer.sdp })
//       );
//       console.log("Set remote description with answer:", answer.sdp);

//       // Add queued ICE candidates after setting remote description
//       for (const candidate of iceCandidatesQueue) {
//         await peerConnection.addIceCandidate(candidate);
//         console.log("Added queued ICE candidate:", candidate);
//       }
//       setIceCandidatesQueue([]);
//     } catch (error) {
//       console.error("Error handling answer:", error);
//     }
//   };

//   const handleCandidate = async (candidate) => {
//     try {
//       const iceCandidate = new RTCIceCandidate(candidate.candidate);
//       if (peerConnection && peerConnection.remoteDescription) {
//         await peerConnection.addIceCandidate(iceCandidate);
//         console.log("Added ICE candidate:", iceCandidate);
//       } else {
//         setIceCandidatesQueue((prevQueue) => [...prevQueue, iceCandidate]);
//         console.log("Queued ICE candidate:", iceCandidate);
//       }
//     } catch (error) {
//       console.error("Error handling candidate:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="chat-history" ref={historyRef}>
//         <h3>Conversation History:</h3>
//         <ul className="message-list">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item ${
//                 msg.sender === parseInt(senderId) ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.content}</div>
//                 <div className="message-timestamp">{msg.timestamp}</div>
//               </div>
//             </li>
//           ))}
//           <li className="new-message-divider">New Message</li>
//           {receivedMessages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item new-message ${
//                 msg.sender_id === senderId ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.message}</div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleMessageSend}>Send</button>
//         <button onClick={startCall}>Start Call</button>
//       </div>
//       <div className="video-container">
//         <video ref={localVideoRef} autoPlay muted />
//         <video ref={remoteVideoRef} autoPlay playsInline />
//       </div>
//       <div className="status-container">
//         <p>Status: {socketStatus}</p>
//       </div>
//     </div>
//   );
// };

// export default Chat;
// Frontend: React Componenttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import "./chat.css";

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [socketStatus, setSocketStatus] = useState("Connecting...");
//   const [peerConnection, setPeerConnection] = useState(null);
//   const historyRef = useRef(null);
//   const location = useLocation();
//   const { id: receiverId, senderId } = location.state;

//   useEffect(() => {
//     if (!receiverId) return;

//     const newSocket = new WebSocket(
//       `ws://localhost:8000/ws/chat/${senderId}/${receiverId}/`
//     );
//     newSocket.onopen = () => setSocketStatus("Connected");
//     newSocket.onclose = () => setSocketStatus("Disconnected");
//     newSocket.onerror = (error) => setSocketStatus("Error");
//     newSocket.onmessage = handleSocketMessage;
//     setSocket(newSocket);

//     return () => newSocket.close();
//   }, [receiverId, senderId]);

//   useEffect(() => {
//     getHistory();
//   }, [receiverId, senderId]);

//   const handleSocketMessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log("Received message:", data);
//     switch (data.type) {
//       case "chat_message":
//         setReceivedMessages((prev) => [...prev, data]);
//         break;
//       case "offer":
//         handleOffer(data);
//         break;
//       case "answer":
//         handleAnswer(data);
//         break;
//       case "ice_candidate":
//         handleNewICECandidate(data);
//         break;
//       default:
//         console.error("Unknown message type:", data);
//     }
//   };

//   const getHistory = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/messaging/api/chat/${senderId}/${receiverId}/history/`
//       );
//       if (!response.ok) throw new Error("Failed to fetch history");
//       const result = await response.json();
//       setMessages(result);
//       if (historyRef.current) {
//         setTimeout(() => {
//           historyRef.current.scrollTop = historyRef.current.scrollHeight;
//         }, 0);
//       }
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   };

//   const handleMessageSend = () => {
//     if (
//       socket &&
//       socket.readyState === WebSocket.OPEN &&
//       message.trim() !== ""
//     ) {
//       const messageData = { type: "chat_message", message };
//       socket.send(JSON.stringify(messageData));
//       setMessage("");
//     }
//   };

//   const startCall = async () => {
//     console.log("Starting call...");

//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     setPeerConnection(peer);
//     console.log("Created RTCPeerConnection.");

//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localStream
//       .getTracks()
//       .forEach((track) => peer.addTrack(track, localStream));
//     console.log("Added local stream tracks.");

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         console.log("Sending ICE candidate:", event.candidate);
//         socket.send(
//           JSON.stringify({ type: "ice_candidate", candidate: event.candidate })
//         );
//       }
//     };

//     peer.ontrack = (event) => {
//       const remoteVideo = document.getElementById("remoteVideo");
//       if (remoteVideo.srcObject !== event.streams[0]) {
//         remoteVideo.srcObject = event.streams[0];
//       }
//       console.log("Received remote stream.");
//     };

//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     console.log("Created and set local offer:", offer);

//     if (socket) {
//       socket.send(JSON.stringify({ type: "offer", offer }));
//       console.log("Sent offer.");
//     }
//   };

//   const handleOffer = async (data) => {
//     console.log("Received offer:", data.offer);

//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     setPeerConnection(peer);
//     console.log("Created RTCPeerConnection.");

//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localStream
//       .getTracks()
//       .forEach((track) => peer.addTrack(track, localStream));
//     console.log("Added local stream tracks.");

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         console.log("Sending ICE candidate:", event.candidate);
//         socket.send(
//           JSON.stringify({ type: "ice_candidate", candidate: event.candidate })
//         );
//       }
//     };

//     peer.ontrack = (event) => {
//       const remoteVideo = document.getElementById("remoteVideo");
//       if (remoteVideo.srcObject !== event.streams[0]) {
//         remoteVideo.srcObject = event.streams[0];
//       }
//       console.log("Received remote stream.");
//     };

//     await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
//     console.log("Set remote description with offer.");

//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     console.log("Created and set local answer:", answer);

//     if (socket) {
//       socket.send(JSON.stringify({ type: "answer", answer }));
//       console.log("Sent answer.");
//     }
//   };

//   const handleAnswer = async (data) => {
//     console.log("Received answer:", data.answer);
//     if (peerConnection) {
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.answer)
//       );
//       console.log("Set remote description with answer.");
//     }
//   };

//   const handleNewICECandidate = async (data) => {
//     console.log("Received ICE candidate:", data.candidate);
//     try {
//       if (peerConnection) {
//         await peerConnection.addIceCandidate(
//           new RTCIceCandidate(data.candidate)
//         );
//         console.log("Added ICE candidate.");
//       }
//     } catch (error) {
//       console.error("Error adding received ice candidate", error);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="chat-history" ref={historyRef}>
//         <h3>Conversation History:</h3>
//         <ul className="message-list">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item ${
//                 msg.sender === parseInt(senderId) ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.content}</div>
//                 <div className="message-timestamp">{msg.timestamp}</div>
//               </div>
//             </li>
//           ))}
//           <li className="new-message-divider">New Message</li>
//           {receivedMessages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item new-message ${
//                 msg.sender_id === senderId ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.message}</div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleMessageSend}>Send</button>
//         <button onClick={startCall}>Start Video Call</button>
//       </div>
//       <video id="remoteVideo" autoPlay playsInline></video>
//     </div>
//   );
// };

// export default Chat;

// import React, { useState, useEffect, useRef } from "react";nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
// import { useLocation } from "react-router-dom";
// import "./chat.css";

// const iceServers = [
//   { urls: "stun:stun.relay.metered.ca:80" },
//   {
//     urls: "turn:global.relay.metered.ca:80",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
//   {
//     urls: "turn:global.relay.metered.ca:80?transport=tcp",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
//   {
//     urls: "turn:global.relay.metered.ca:443",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
//   {
//     urls: "turns:global.relay.metered.ca:443?transport=tcp",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
// ];

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [socketStatus, setSocketStatus] = useState("Connecting...");
//   const [peerConnection, setPeerConnection] = useState(null);
//   const historyRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const location = useLocation();
//   const { id: receiverId, senderId } = location.state;

//   useEffect(() => {
//     if (!receiverId) return;

//     const newSocket = new WebSocket(
//       `ws://localhost:8000/ws/chat/${senderId}/${receiverId}/`
//     );
//     newSocket.onopen = () => setSocketStatus("Connected");
//     newSocket.onclose = () => setSocketStatus("Disconnected");
//     newSocket.onerror = (error) => setSocketStatus("Error");
//     newSocket.onmessage = handleSocketMessage;
//     setSocket(newSocket);

//     return () => newSocket.close();
//   }, [receiverId, senderId]);

//   useEffect(() => {
//     getHistory();
//   }, [receiverId, senderId]);

//   const handleSocketMessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log("Received message:", data);
//     switch (data.type) {
//       case "chat_message":
//         setReceivedMessages((prev) => [...prev, data]);
//         break;
//       case "offer":
//         handleOffer(data);
//         break;
//       case "answer":
//         handleAnswer(data);
//         break;
//       case "ice_candidate":
//         handleNewICECandidate(data);
//         break;
//       default:
//         console.error("Unknown message type:", data);
//     }
//   };

//   const getHistory = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/messaging/api/chat/${senderId}/${receiverId}/history/`
//       );
//       if (!response.ok) throw new Error("Failed to fetch history");
//       const result = await response.json();
//       setMessages(result);
//       if (historyRef.current) {
//         setTimeout(() => {
//           historyRef.current.scrollTop = historyRef.current.scrollHeight;
//         }, 0);
//       }
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   };

//   const handleMessageSend = () => {
//     if (
//       socket &&
//       socket.readyState === WebSocket.OPEN &&
//       message.trim() !== ""
//     ) {
//       const messageData = { type: "chat_message", message };
//       socket.send(JSON.stringify(messageData));
//       setMessage("");
//     }
//   };

//   const startCall = async () => {
//     console.log("Starting call...");

//     const peer = new RTCPeerConnection({ iceServers });
//     setPeerConnection(peer);
//     console.log("Created RTCPeerConnection.");

//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     const localVideo = localVideoRef.current;
//     localVideo.srcObject = localStream;
//     localStream.getTracks().forEach((track) => {
//       console.log("Adding local track:", track);
//       peer.addTrack(track, localStream);
//     });
//     console.log("Added local stream tracks.");

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         console.log("Sending ICE candidate:", event.candidate);
//         socket.send(
//           JSON.stringify({ type: "ice_candidate", candidate: event.candidate })
//         );
//       }
//     };

//     peer.ontrack = (event) => {
//       const remoteVideo = remoteVideoRef.current;
//       if (remoteVideo.srcObject !== event.streams[0]) {
//         remoteVideo.srcObject = event.streams[0];
//         console.log("Received remote stream:", event.streams[0]);
//       } else {
//         console.log("Remote stream already set.");
//       }
//     };

//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     console.log("Created and set local offer:", offer);

//     if (socket) {
//       socket.send(JSON.stringify({ type: "offer", offer }));
//       console.log("Sent offer.");
//     }
//   };

//   const handleOffer = async (data) => {
//     console.log("Received offer:", data.offer);

//     const peer = new RTCPeerConnection({ iceServers });
//     setPeerConnection(peer);
//     console.log("Created RTCPeerConnection.");

//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     const localVideo = localVideoRef.current;
//     localVideo.srcObject = localStream;
//     localStream.getTracks().forEach((track) => {
//       console.log("Adding local track:", track);
//       peer.addTrack(track, localStream);
//     });
//     console.log("Added local stream tracks.");

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         console.log("Sending ICE candidate:", event.candidate);
//         socket.send(
//           JSON.stringify({ type: "ice_candidate", candidate: event.candidate })
//         );
//       }
//     };

//     peer.ontrack = (event) => {
//       const remoteVideo = remoteVideoRef.current;
//       if (remoteVideo.srcObject !== event.streams[0]) {
//         remoteVideo.srcObject = event.streams[0];
//         console.log("Received remote stream:", event.streams[0]);
//       } else {
//         console.log("Remote stream already set.");
//       }
//     };

//     await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
//     console.log("Set remote description with offer.");

//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     console.log("Created and set local answer:", answer);

//     if (socket) {
//       socket.send(JSON.stringify({ type: "answer", answer }));
//       console.log("Sent answer.");
//     }
//   };

//   const handleAnswer = async (data) => {
//     console.log("Received answer:", data.answer);
//     if (peerConnection) {
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.answer)
//       );
//       console.log("Set remote description with answer.");
//     }
//   };

//   const handleNewICECandidate = async (data) => {
//     console.log("Received ICE candidate:", data.candidate);
//     try {
//       if (peerConnection) {
//         await peerConnection.addIceCandidate(
//           new RTCIceCandidate(data.candidate)
//         );
//         console.log("Added ICE candidate.");
//       }
//     } catch (error) {
//       console.error("Error adding received ice candidate", error);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="chat-history" ref={historyRef}>
//         <h3>Conversation History:</h3>
//         <ul className="message-list">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item ${
//                 msg.sender === parseInt(senderId) ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.content}</div>
//                 <div className="message-timestamp">{msg.timestamp}</div>
//               </div>
//             </li>
//           ))}
//           <li className="new-message-divider">New Message</li>
//           {receivedMessages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item new-message ${
//                 msg.sender_id === senderId ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.message}</div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleMessageSend}>Send</button>
//         <button onClick={startCall}>Start Video Call</button>
//       </div>
//       <div className="video-container">
//         <video
//           id="localVideo"
//           ref={localVideoRef}
//           autoPlay
//           muted
//           playsInline
//         ></video>
//         <video
//           id="remoteVideo"
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//         ></video>
//       </div>
//     </div>
//   );
// };

// export default Chat;
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import "./chat.css";

// const iceServers = [
//   { urls: "stun:stun.relay.metered.ca:80" },
//   {
//     urls: "turn:global.relay.metered.ca:80",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
//   {
//     urls: "turn:global.relay.metered.ca:80?transport=tcp",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
//   {
//     urls: "turn:global.relay.metered.ca:443",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
//   {
//     urls: "turns:global.relay.metered.ca:443?transport=tcp",
//     username: "b7ccc598c5ad0d92a7dbc2c2",
//     credential: "ujv2zwyoJ0QyKATN",
//   },
// ];

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [socketStatus, setSocketStatus] = useState("Connecting...");
//   const peerConnectionRef = useRef(null);
//   const historyRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const pendingCandidates = useRef([]);
//   const location = useLocation();
//   const { id: receiverId, senderId } = location.state;
//   const ensureWebSocketOpen = (socket) => {
//     return new Promise((resolve, reject) => {
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         resolve();
//       } else {
//         const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/1/5/`);
//         newSocket.onopen = () => {
//           setSocket(newSocket);
//           resolve();
//         };
//         newSocket.onerror = (error) => {
//           reject(new Error("Failed to open WebSocket connection"));
//         };
//       }
//     });
//   };

//   useEffect(() => {
//     console.log("socketStatus");

//     const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/1/5/`);

//     newSocket.onopen = () => {
//       setSocketStatus("Connected");
//       setSocket(newSocket);
//     };
//     newSocket.onclose = () => setSocketStatus("Disconnected");
//     newSocket.onerror = (error) => setSocketStatus("Error");
//     newSocket.onmessage = handleSocketMessage;
//     setSocket(newSocket);

//     // return () => {
//     //   newSocket.close();
//     //   setSocket(null);
//     //   setSocketStatus("Disconnected");
//     // };
//   }, []);

//   useEffect(() => {
//     console.log(socketStatus);
//     console.log("peer", peerConnectionRef.current);
//   }, [socketStatus]);

//   useEffect(() => {
//     if (receiverId && senderId) {
//       getHistory();
//     }
//   }, [receiverId, senderId]);

//   const handleSocketMessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log("Received message:", data);
//     switch (data.type) {
//       case "chat_message":
//         setReceivedMessages((prev) => [...prev, data]);
//         break;
//       case "offer":
//         handleOffer(data);
//         break;
//       case "answer":
//         handleAnswer(data);
//         break;
//       case "ice_candidate":
//         handleNewICECandidate(data);
//         break;
//       default:
//         console.error("Unknown message type:", data);
//     }
//   };

//   const getHistory = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/messaging/api/chat/${senderId}/${receiverId}/history/`
//       );
//       if (!response.ok) throw new Error("Failed to fetch history");
//       const result = await response.json();
//       setMessages(result);
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   };

//   const scrollToBottom = () => {
//     if (historyRef.current) {
//       setTimeout(() => {
//         historyRef.current.scrollTop = historyRef.current.scrollHeight;
//       }, 0);
//     }
//   };

//   const handleMessageSend = () => {
//     if (
//       socket &&
//       socket.readyState === WebSocket.OPEN &&
//       message.trim() !== ""
//     ) {
//       const messageData = { type: "chat_message", message };
//       socket.send(JSON.stringify(messageData));
//       setMessage("");
//     }
//   };

//   const initializePeerConnection = async () => {
//     const peer = new RTCPeerConnection({ iceServers });
//     peerConnectionRef.current = peer;
//     console.log("peer initialize", peer);
//     console.log("ice server : ", iceServers);

//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localVideoRef.current.srcObject = localStream;
//     localStream
//       .getTracks()
//       .forEach((track) => peer.addTrack(track, localStream));

//     const remoteStream = new MediaStream();
//     remoteVideoRef.current.srcObject = remoteStream;
//     peer.ontrack = (event) => {
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//       });
//     };

//     peer.onicecandidate = (event) => {
//       if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
//         socket.send(
//           JSON.stringify({ type: "ice_candidate", candidate: event.candidate })
//         );
//       }
//     };

//     peer.oniceconnectionstatechange = () => {
//       console.log("ICE connection state:", peer.iceConnectionState);
//     };

//     return peer;
//   };

//   const startCall = async () => {
//     console.log("Starting call...");
//     const peer = await initializePeerConnection();

//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(new RTCSessionDescription(offer));
//     console.log("Local description set successfully", peer.localDescription);

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       console.log("socket created", socket);
//       socket.send(
//         JSON.stringify({ type: "offer", offer: peer.localDescription })
//       );
//     }
//   };
//   const handleOffer = async (data) => {
//     console.log("Handling offer...", data);
//     const peer = await initializePeerConnection();
//     await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
//     console.log("Remote description set");
//     // Add pending ICE candidates
//     while (pendingCandidates.current.length > 0) {
//       const candidate = pendingCandidates.current.shift();
//       await peer.addIceCandidate(new RTCIceCandidate(candidate));
//       console.log("Added ICE candidate");
//     }
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(new RTCSessionDescription(answer));
//     console.log("Local description set");
//     try {
//       await ensureWebSocketOpen(socket);
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         console.log("Socket is open");
//         socket.send(
//           JSON.stringify({ type: "answer", answer: peer.localDescription })
//         );
//         console.log("Sent answer");
//       }
//     } catch (error) {
//       console.error("Error ensuring WebSocket is open:", error.message);
//     }
//   };

//   const handleAnswer = async (data) => {
//     console.log("Handling answer...", data);

//     if (peerConnectionRef.current) {
//       try {
//         const peer = peerConnectionRef.current;

//         console.log("Current signaling state:", peer.signalingState);

//         if (peer.signalingState !== "have-local-offer") {
//           console.warn(
//             "Peer connection state is not 'have-local-offer'. Current state:",
//             peer.signalingState
//           );
//           return;
//         }

//         console.log("Setting remote description for answer");

//         await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
//         console.log("Remote description set successfully");

//         console.log("New signaling state:", peer.signalingState);
//       } catch (error) {
//         console.error("Failed to set remote description:", error);
//       }
//     } else {
//       console.error("Peer connection not initialized");
//     }
//   };

//   const waitForConnectionState = (peerConnection, targetState) => {
//     return new Promise((resolve, reject) => {
//       if (peerConnection.connectionState === targetState) {
//         resolve();
//       } else {
//         const checkState = () => {
//           if (peerConnection.connectionState === targetState) {
//             peerConnection.removeEventListener(
//               "iceconnectionstatechange",
//               checkState
//             );
//             resolve();
//           } else if (
//             peerConnection.connectionState === "closed" ||
//             peerConnection.connectionState === "failed"
//           ) {
//             peerConnection.removeEventListener(
//               "iceconnectionstatechange",
//               checkState
//             );
//             reject(
//               new Error(`Connection state is ${peerConnection.connectionState}`)
//             );
//           }
//         };
//         peerConnection.addEventListener("iceconnectionstatechange", checkState);
//       }
//     });
//   };

//   const handleNewICECandidate = async (data) => {
//     const candidate = new RTCIceCandidate(data.candidate);
//     if (
//       peerConnectionRef.current &&
//       peerConnectionRef.current.remoteDescription
//     ) {
//       await peerConnectionRef.current.addIceCandidate(candidate);
//     } else {
//       // Queue the candidate if remote description is not yet set
//       pendingCandidates.current.push(candidate);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="chat-history" ref={historyRef}>
//         <h3>Conversation History:</h3>
//         <ul className="message-list">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item ${
//                 msg.sender === parseInt(senderId) ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.content}</div>
//                 <div className="message-timestamp">{msg.timestamp}</div>
//               </div>
//             </li>
//           ))}
//           <li className="new-message-divider">New Message</li>
//           {receivedMessages.map((msg, index) => (
//             <li
//               key={index}
//               className={`message-item new-message ${
//                 msg.sender_id === senderId ? "receiver" : "sender"
//               }`}
//             >
//               <div className="message-content">
//                 <div className="message-text">{msg.message}</div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message..."
//       />
//       <div>
//         <button onClick={handleMessageSend}>Send</button>
//       </div>
//       <div className="video-container">
//         <div className="local-video">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//         </div>
//         <div className="remote-video">
//           <video ref={remoteVideoRef} autoPlay playsInline />
//         </div>
//       </div>
//       <div className="call-actions">
//         <button onClick={startCall}>Start Call</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./chat.css";

const iceServers = [
  { urls: "stun:stun.relay.metered.ca:80" },
  {
    urls: "turn:global.relay.metered.ca:80",
    username: "b7ccc598c5ad0d92a7dbc2c2",
    credential: "ujv2zwyoJ0QyKATN",
  },
  {
    urls: "turn:global.relay.metered.ca:80?transport=tcp",
    username: "b7ccc598c5ad0d92a7dbc2c2",
    credential: "ujv2zwyoJ0QyKATN",
  },
  {
    urls: "turn:global.relay.metered.ca:443",
    username: "b7ccc598c5ad0d92a7dbc2c2",
    credential: "ujv2zwyoJ0QyKATN",
  },
  {
    urls: "turns:global.relay.metered.ca:443?transport=tcp",
    username: "b7ccc598c5ad0d92a7dbc2c2",
    credential: "ujv2zwyoJ0QyKATN",
  },
];

const Chat = () => {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const peerConnectionRef = useRef(null);
  const historyRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pendingCandidates = useRef([]);
  const location = useLocation();
  const { id: receiverId, senderId } = location.state;
  let didIOffer = useRef(false);
  const receiver_id = 5;
  const sender_id = 1;
  const ensureWebSocketOpen = (socket) => {
    return new Promise((resolve, reject) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        const newSocket = new WebSocket(
          `ws://localhost:8000/ws/chat/${sender_id}/${receiver_id}/`
        );
        newSocket.onopen = () => {
          setSocket(newSocket);
          resolve();
        };
        newSocket.onerror = (error) => {
          reject(new Error("Failed to open WebSocket connection"));
        };
      }
    });
  };

  const socketDisconnect = () => {
    socket.close();
    setSocket(null);
    setSocketStatus("Disconnected");
  };

  useEffect(() => {
    console.log("socketStatus");

    const newSocket = new WebSocket(
      `ws://localhost:8000/ws/chat/${sender_id}/${receiver_id}/`
    );

    newSocket.onopen = () => {
      setSocketStatus("Connected");
      setSocket(newSocket);
    };
    newSocket.onclose = () => setSocketStatus("Disconnected");
    newSocket.onerror = (error) => setSocketStatus("Error");
    newSocket.onmessage = handleSocketMessage;
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    console.log(socketStatus);
    console.log("peer", peerConnectionRef.current);
  }, [socketStatus]);

  useEffect(() => {
    if (receiverId && senderId) {
      getHistory();
    }
  }, [receiverId, senderId]);

  const handleSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    switch (data.type) {
      case "chat_message":
        setReceivedMessages((prev) => [...prev, data]);
        break;
      case "offer":
        handleOffer(data);
        break;
      case "answer":
        handleAnswer(data);
        break;
      case "ice_candidate":
        handleNewICECandidate(data);
        break;
      default:
        console.error("Unknown message type:", data);
    }
  };

  const getHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/messaging/api/chat/${sender_id}/${receiver_id}/history/`
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const result = await response.json();
      setMessages(result);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching history:", error.message);
    }
  };

  const scrollToBottom = () => {
    if (historyRef.current) {
      setTimeout(() => {
        historyRef.current.scrollTop = historyRef.current.scrollHeight;
      }, 0);
    }
  };

  const handleMessageSend = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      message.trim() !== ""
    ) {
      const messageData = { type: "chat_message", message };
      socket.send(JSON.stringify(messageData));
      setMessage("");
    }
  };

  const initializePeerConnection = async () => {
    const peer = new RTCPeerConnection({ iceServers });
    peerConnectionRef.current = peer;
    console.log("peer initialize", peer);
    console.log("ice server : ", iceServers);

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStream;
    localStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream));

    const remoteStream = new MediaStream();
    remoteVideoRef.current.srcObject = remoteStream;
    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peer.onicecandidate = (event) => {
      if (event.candidate && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ type: "ice_candidate", candidate: event.candidate })
        );
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peer.iceConnectionState);
    };

    return peer;
  };

  const startCall = async () => {
    console.log("Starting call...");
    if (!didIOffer.current) {
      didIOffer.current = true;
      const peer = await initializePeerConnection();
      const offer = await peer.createOffer();
      await peer.setLocalDescription(new RTCSessionDescription(offer));
      console.log(
        "---the caller local descriptison is set succsefully",
        peer.localDescription
      );

      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("socket created", socket);
        socket.send(
          JSON.stringify({ type: "offer", offer: peer.localDescription })
        );
      }
    }
  };

  const handleOffer = async (data) => {
    console.log("Handling offer...", data);
    if (!didIOffer.current) {
      didIOffer.current = true;
      const peer = await initializePeerConnection();
      await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
      console.log("----Remote description of the answer is set");
      while (pendingCandidates.current.length > 0) {
        const candidate = pendingCandidates.current.shift();
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(new RTCSessionDescription(answer));
      console.log("---the answer local descriptison is set succsefully");
      try {
        await ensureWebSocketOpen(socket);
        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log("Socket is open");
          socket.send(
            JSON.stringify({ type: "answer", answer: peer.localDescription })
          );
          console.log("Sent answer");
        }
      } catch (error) {
        console.error("Error ensuring WebSocket is open:", error.message);
      }
    }
  };

  const handleAnswer = async (data) => {
    console.log("Handling answer...", data);
    const peer = peerConnectionRef.current;

    try {
      await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
      console.log("----Remote description of the caller is set");
    } catch (err) {
      console.error("Failed to set remote description:", err);
      return;
    }

    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
    console.log("----All pending ICE candidates have been added");
  };

  const handleNewICECandidate = async (data) => {
    const candidate = new RTCIceCandidate(data.candidate);
    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.remoteDescription
    ) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } else {
      pendingCandidates.current.push(candidate);
    }
  };

  return (
    <div className="container">
      <div className="chat-history" ref={historyRef}>
        <h3>Conversation History:</h3>
        <ul className="message-list">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`message-item ${
                msg.sender === parseInt(senderId) ? "receiver" : "sender"
              }`}
            >
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-timestamp">{msg.timestamp}</div>
              </div>
            </li>
          ))}
          <li className="new-message-divider">New Message</li>
          {receivedMessages.map((msg, index) => (
            <li
              key={index}
              className={`message-item new-message ${
                msg.sender_id === senderId ? "receiver" : "sender"
              }`}
            >
              <div className="message-content">
                <div className="message-text">{msg.message}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <div>
        <button onClick={handleMessageSend}>Send</button>
      </div>
      <div className="video-container">
        <div className="local-video">
          <video ref={localVideoRef} autoPlay muted playsInline />
        </div>
        <div className="remote-video">
          <video ref={remoteVideoRef} autoPlay playsInline />
        </div>
      </div>
      <div className="call-actions">
        <button onClick={startCall}>Start Call</button>
        <button onClick={socketDisconnect}>disconnect</button>
      </div>
    </div>
  );
};

export default Chat;
