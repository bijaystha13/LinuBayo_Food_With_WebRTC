"use client";

import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import {
  EyeOpenIcon,
  EyeNoneIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import styles from "./auth.module.css";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Enhanced animation trigger on mount
  useEffect(() => {
    const container = document.querySelector(`.${styles.authContainer}`);
    if (container) {
      // Add slight delay for better visual effect
      setTimeout(() => {
        container.classList.add(styles.mounted);
      }, 100);
    }
  }, []);

  const handleSubmit = async (event, formType) => {
    event.preventDefault();
    setIsLoading(true);

    // Enhanced loading simulation with better UX
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage(
        `${
          formType === "signin"
            ? "Welcome back!"
            : "Account created successfully!"
        }`
      );
      setToastType("success");
      setToastOpen(true);
    }, 2000);
  };

  const handleSocialLogin = (provider) => {
    setToastMessage(`Connecting to ${provider}...`);
    setToastType("info");
    setToastOpen(true);
  };

  const handleForgotPassword = () => {
    setToastMessage("Password reset instructions sent to your email!");
    setToastType("info");
    setToastOpen(true);
  };

  return (
    <div className={styles.authWrapper}>
      {/* Enhanced Background Animation */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
      </div>

      {/* Gradient overlay for depth */}
      <div className={styles.gradientOverlay}></div>

      <div className={styles.authContainer}>
        {/* Enhanced Brand Section */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className={styles.logoEmoji}>🚀</span>
            </div>
            <h1 className={styles.brandName}>NextAuth</h1>
          </div>
          <p className={styles.brandTagline}>
            {activeTab === "signin"
              ? "Welcome back! Please enter your details."
              : "Create your account to get started."}
          </p>
        </div>

        {/* Enhanced Auth Form */}
        <div className={styles.formContainer}>
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className={styles.tabsRoot}
          >
            {/* Enhanced Tab List */}
            <Tabs.List className={styles.tabsList}>
              <Tabs.Trigger value="signin" className={styles.tabsTrigger}>
                <span>Sign In</span>
              </Tabs.Trigger>
              <Tabs.Trigger value="signup" className={styles.tabsTrigger}>
                <span>Sign Up</span>
              </Tabs.Trigger>
              <div className={styles.tabIndicator}></div>
            </Tabs.List>

            {/* Enhanced Sign In Tab */}
            <Tabs.Content value="signin" className={styles.tabsContent}>
              <Form.Root
                className={styles.form}
                onSubmit={(e) => handleSubmit(e, "signin")}
              >
                <Form.Field name="email" className={styles.formField}>
                  <Form.Label className={styles.formLabel}>
                    <span>Email</span>
                  </Form.Label>
                  <div className={styles.inputContainer}>
                    <Form.Control asChild>
                      <input
                        type="email"
                        className={styles.input}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Control>
                    <div className={styles.inputFocus}></div>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className={styles.formMessage}
                  >
                    Please enter your email
                  </Form.Message>
                  <Form.Message
                    match="typeMismatch"
                    className={styles.formMessage}
                  >
                    Please provide a valid email
                  </Form.Message>
                </Form.Field>

                <Form.Field name="password" className={styles.formField}>
                  <Form.Label className={styles.formLabel}>
                    <span>Password</span>
                  </Form.Label>
                  <div className={styles.passwordContainer}>
                    <div className={styles.inputContainer}>
                      <Form.Control asChild>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={styles.input}
                          placeholder="Enter your password"
                          required
                          minLength={6}
                        />
                      </Form.Control>
                      <div className={styles.inputFocus}></div>
                    </div>
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className={styles.formMessage}
                  >
                    Please enter your password
                  </Form.Message>
                  <Form.Message match="tooShort" className={styles.formMessage}>
                    Password must be at least 6 characters
                  </Form.Message>
                </Form.Field>

                <div className={styles.formOptions}>
                  <label className={styles.checkbox}>
                    <input type="checkbox" />
                    <span className={styles.checkmark}></span>
                    <span className={styles.checkboxLabel}>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className={styles.forgotPassword}
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                <Form.Submit asChild>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${
                      isLoading ? styles.loading : ""
                    }`}
                    disabled={isLoading}
                  >
                    <div className={styles.buttonContent}>
                      {isLoading ? (
                        <>
                          <span className={styles.spinner}></span>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </div>
                    <div className={styles.buttonShine}></div>
                  </button>
                </Form.Submit>
              </Form.Root>
            </Tabs.Content>

            {/* Enhanced Sign Up Tab */}
            <Tabs.Content value="signup" className={styles.tabsContent}>
              <Form.Root
                className={styles.form}
                onSubmit={(e) => handleSubmit(e, "signup")}
              >
                <div className={styles.nameFields}>
                  <Form.Field name="firstName" className={styles.formField}>
                    <Form.Label className={styles.formLabel}>
                      <span>First Name</span>
                    </Form.Label>
                    <div className={styles.inputContainer}>
                      <Form.Control asChild>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="First name"
                          required
                        />
                      </Form.Control>
                      <div className={styles.inputFocus}></div>
                    </div>
                    <Form.Message
                      match="valueMissing"
                      className={styles.formMessage}
                    >
                      Please enter your first name
                    </Form.Message>
                  </Form.Field>

                  <Form.Field name="lastName" className={styles.formField}>
                    <Form.Label className={styles.formLabel}>
                      <span>Last Name</span>
                    </Form.Label>
                    <div className={styles.inputContainer}>
                      <Form.Control asChild>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Last name"
                          required
                        />
                      </Form.Control>
                      <div className={styles.inputFocus}></div>
                    </div>
                    <Form.Message
                      match="valueMissing"
                      className={styles.formMessage}
                    >
                      Please enter your last name
                    </Form.Message>
                  </Form.Field>
                </div>

                <Form.Field name="email" className={styles.formField}>
                  <Form.Label className={styles.formLabel}>
                    <span>Email</span>
                  </Form.Label>
                  <div className={styles.inputContainer}>
                    <Form.Control asChild>
                      <input
                        type="email"
                        className={styles.input}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Control>
                    <div className={styles.inputFocus}></div>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className={styles.formMessage}
                  >
                    Please enter your email
                  </Form.Message>
                  <Form.Message
                    match="typeMismatch"
                    className={styles.formMessage}
                  >
                    Please provide a valid email
                  </Form.Message>
                </Form.Field>

                <Form.Field name="password" className={styles.formField}>
                  <Form.Label className={styles.formLabel}>
                    <span>Password</span>
                  </Form.Label>
                  <div className={styles.passwordContainer}>
                    <div className={styles.inputContainer}>
                      <Form.Control asChild>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={styles.input}
                          placeholder="Create a password"
                          required
                          minLength={6}
                        />
                      </Form.Control>
                      <div className={styles.inputFocus}></div>
                    </div>
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className={styles.formMessage}
                  >
                    Please enter a password
                  </Form.Message>
                  <Form.Message match="tooShort" className={styles.formMessage}>
                    Password must be at least 6 characters
                  </Form.Message>
                </Form.Field>

                <Form.Field name="confirmPassword" className={styles.formField}>
                  <Form.Label className={styles.formLabel}>
                    <span>Confirm Password</span>
                  </Form.Label>
                  <div className={styles.passwordContainer}>
                    <div className={styles.inputContainer}>
                      <Form.Control asChild>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={styles.input}
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                        />
                      </Form.Control>
                      <div className={styles.inputFocus}></div>
                    </div>
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className={styles.formMessage}
                  >
                    Please confirm your password
                  </Form.Message>
                </Form.Field>

                <div className={styles.formOptions}>
                  <label className={styles.checkbox}>
                    <input type="checkbox" required />
                    <span className={styles.checkmark}></span>
                    <span className={styles.checkboxLabel}>
                      I agree to the{" "}
                      <a href="#" className={styles.link}>
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className={styles.link}>
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                <Form.Submit asChild>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${
                      isLoading ? styles.loading : ""
                    }`}
                    disabled={isLoading}
                  >
                    <div className={styles.buttonContent}>
                      {isLoading ? (
                        <>
                          <span className={styles.spinner}></span>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </div>
                    <div className={styles.buttonShine}></div>
                  </button>
                </Form.Submit>
              </Form.Root>
            </Tabs.Content>
          </Tabs.Root>

          {/* Enhanced Divider */}
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          {/* Enhanced Social Login */}
          <div className={styles.socialButtons}>
            <button
              className={styles.socialButton}
              onClick={() => handleSocialLogin("Google")}
            >
              <div className={styles.socialIconWrapper}>
                <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <span>Google</span>
            </button>
            <button
              className={styles.socialButton}
              onClick={() => handleSocialLogin("GitHub")}
            >
              <div className={styles.socialIconWrapper}>
                <GitHubLogoIcon className={styles.socialIcon} />
              </div>
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* Enhanced Toast Notification */}
        <Toast.Provider swipeDirection="right">
          <Toast.Root
            className={`${styles.toastRoot} ${styles[toastType]}`}
            open={toastOpen}
            onOpenChange={setToastOpen}
          >
            <div className={styles.toastIcon}>
              {toastType === "success" ? "✅" : "ℹ️"}
            </div>
            <div className={styles.toastContent}>
              <Toast.Title className={styles.toastTitle}>
                {toastType === "success" ? "Success" : "Info"}
              </Toast.Title>
              <Toast.Description className={styles.toastDescription}>
                {toastMessage}
              </Toast.Description>
            </div>
            <Toast.Action asChild altText="Close notification">
              <button className={styles.toastAction}>×</button>
            </Toast.Action>
          </Toast.Root>
          <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
      </div>
    </div>
  );
};

export default AuthPage;
