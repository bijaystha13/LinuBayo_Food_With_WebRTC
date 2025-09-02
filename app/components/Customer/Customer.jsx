// components/CustomerChat.js
"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./CustomerChat.module.css";

const CustomerChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hello! I'm here to help with any food ordering issues or questions you might have. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Simple AI response logic - replace with actual AI service
    if (
      message.includes("order") &&
      (message.includes("late") || message.includes("delayed"))
    ) {
      return "I understand your order is delayed. Let me help you track it. Can you please provide your order number? In the meantime, I'll check for any delivery issues in your area.";
    } else if (message.includes("cancel")) {
      return "I can help you cancel your order. If it's within 5 minutes of placing it, I can cancel it immediately. For orders that are already being prepared, there might be a small cancellation fee. What's your order number?";
    } else if (message.includes("refund")) {
      return "I'll be happy to process your refund request. Could you tell me more about the issue with your order? This will help me determine the best refund option for you.";
    } else if (message.includes("delivery")) {
      return "For delivery-related questions, I can check the status of your order and estimated delivery time. Please share your order number and I'll get you the latest updates.";
    } else if (
      message.includes("food") &&
      (message.includes("quality") ||
        message.includes("bad") ||
        message.includes("wrong"))
    ) {
      return "I'm sorry to hear about the food quality issue. Your satisfaction is our priority. I can arrange for a replacement or full refund. Could you describe what was wrong with your order?";
    } else if (message.includes("payment") || message.includes("charged")) {
      return "I can help resolve payment-related issues. Whether it's about incorrect charges, failed payments, or billing questions, I'm here to assist. What specific payment issue are you experiencing?";
    } else {
      return "Thank you for reaching out! I want to make sure I understand your concern correctly so I can provide the best assistance. Could you provide a bit more detail about the issue you're experiencing with your food order?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        text: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerContent}>
          <div className={styles.aiAvatar}>🤖</div>
          <div className={styles.headerText}>
            <h3>Food Support Assistant</h3>
            <span className={styles.status}>Online - Ready to help</span>
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.type === "user" ? styles.userMessage : styles.aiMessage
            }`}
          >
            <div className={styles.message}>
              <div className={styles.messageContent}>{message.text}</div>
              <div className={styles.timestamp}>{message.timestamp}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.messageWrapper} ${styles.aiMessage}`}>
            <div className={styles.message}>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your food order issue..."
            className={styles.messageInput}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            className={styles.sendButton}
            disabled={!inputMessage.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <div className={styles.inputHint}>
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
