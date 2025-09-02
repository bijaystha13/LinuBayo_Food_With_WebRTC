"use client";
import React, { useState } from "react";
import styles from "./contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className={styles.contactContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Get in touch with our team.</p>
        </div>
      </section>

      {/* Main Contact Content */}
      <div className={styles.contactContent}>
        {/* Contact Information */}
        <div className={styles.contactInfo}>
          <h2>Get In Touch</h2>
          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <div className={styles.icon}>📍</div>
              <div>
                <h3>Address</h3>
                <p>
                  123 Food Street
                  <br />
                  Culinary District
                  <br />
                  Toronto, ON M5V 3A8
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>📞</div>
              <div>
                <h3>Phone</h3>
                <p>+1 (416) 123-4567</p>
                <p>Customer Service: +1 (416) 765-4321</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>✉️</div>
              <div>
                <h3>Email</h3>
                <p>info@foodieapp.com</p>
                <p>support@foodieapp.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>🕒</div>
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.contactForm}>
          <h2>Send us a Message</h2>
          <div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="complaint">Complaint</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>How can I track my order?</h3>
            <p>
              You can track your order through our mobile app or by logging into
              your account on our website. You'll receive real-time updates via
              SMS and email.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>What are your delivery hours?</h3>
            <p>
              We deliver from 11:00 AM to 10:00 PM Monday through Friday, and
              10:00 AM to 11:00 PM on weekends.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>Do you offer refunds?</h3>
            <p>
              Yes, we offer full refunds for orders that don't meet our quality
              standards. Contact our support team within 24 hours of delivery.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>Can I modify my order after placing it?</h3>
            <p>
              Orders can be modified within 5 minutes of placing. After that,
              please contact our customer service team for assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>FoodieApp</h3>
            <p>Delivering delicious food right to your doorstep since 2020.</p>
          </div>

          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 FoodieApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
