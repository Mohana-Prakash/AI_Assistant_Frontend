import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  function currentTimestamp() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    return `${hours}:${minutes}`;
  }

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { sender: "user", text: input, time: currentTimestamp() };
    setMessages((prev) => [...prev, userMsg]);

    const res = await axios.post(
      "https://ai-assistant-backend-wpmw.onrender.com/api/chat",
      {
        question: input,
      }
    );
    const botMsg = {
      sender: "bot",
      text: res.data.answer,
      time: currentTimestamp(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  };

  const uploadDocument = async () => {
    const docData = {
      id: "doc1", // unique ID for the document
      content: text,
      source: "admin", // optional
    };
    const response = await axios.post(
      "https://ai-assistant-backend-wpmw.onrender.com/api/upload-doc",
      docData
    );
    toast.success(response.data.message);
  };

  return (
    <div>
      <ToastContainer />
      <p style={{ textAlign: "center", fontSize: "24px" }}>
        INTELLIGRID AI ASSISTANT
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ width: "60%" }}>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 5,
              padding: 10,
              height: "60vh",
              overflowY: "scroll",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  margin: "5px 0",
                  textAlign: msg.sender === "user" ? "right" : "left",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <span style={{ fontSize: "11px", color: "gray" }}>
                  {msg.sender === "user" ? "You" : "Bot"}, {msg.time}
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    backgroundColor:
                      msg.sender === "user" ? "#d0f1db" : "bisque",
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 10,
                    maxWidth: "80%",
                    margin: "5px 0px 0px",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              border: "1px solid #ccc",
              borderRadius: 5,
              padding: "8px 5px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                width: "90%",
                border: "none",
                outline: "none",
                fontSize: 14,
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                width: "9%",
                border: "none",
                color: "black",
                fontWeight: "bold",
                fontSize: 14,
                cursor: "pointer",
                textTransform: "uppercase",
                backgroundColor: "transparent",
              }}
            >
              Send
            </button>
          </div>
        </div>
        <div style={{ width: "38%" }}>
          <textarea
            rows="5"
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid #ccc",
              outline: "none",
              borderRadius: 5,
              padding: 10,
              height: "60vh",
            }}
          />
          <button
            onClick={uploadDocument}
            style={{
              color: "black",
              fontSize: 14,
              padding: "10px 15px",
              borderRadius: 5,
              border: "none",
              backgroundColor: "#d3f4",
              marginTop: 6,
              cursor: "pointer",
            }}
          >
            Upload Text
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
