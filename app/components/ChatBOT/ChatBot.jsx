// components/ChatBot.js
import { useState, useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your foodie assistant. Ask me about recipes, cooking tips, or restaurant recommendations!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-10), // Keep last 10 messages for context
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What's a quick dinner recipe?",
    "Suggest a healthy snack",
    "Best cooking tips for beginners",
    "Restaurant recommendations",
  ];

  return (
    <div className={styles.chatContainer}>
      {/* Chat Toggle Button */}
      <button
        className={styles.chatToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? "×" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Foodie Assistant</h3>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[message.role]}`}
              >
                <div className={styles.messageContent}>{message.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className={styles.quickQuestions}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className={styles.quickBtn}
                  onClick={() => setInputMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={sendMessage} className={styles.inputForm}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about food, recipes, or cooking..."
              className={styles.messageInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? "..." : "→"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
