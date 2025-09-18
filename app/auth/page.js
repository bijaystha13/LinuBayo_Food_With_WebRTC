"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import { useForm } from "@/app/shared/hooks/form-hook";
import * as Form from "@radix-ui/react-form";
import * as Tabs from "@radix-ui/react-tabs";
import * as Toast from "@radix-ui/react-toast";
import {
  EyeOpenIcon,
  EyeNoneIcon,
  GitHubLogoIcon,
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
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const authCtx = useContext(AuthContext);

  // Form state for Sign In
  const [signinFormState, signinInputHandler, setSigninData, resetSigninForm] =
    useForm(
      {
        email: {
          value: "",
          isValid: false,
        },
        password: {
          value: "",
          isValid: false,
        },
      },
      false
    );

  // Form state for Sign Up - Added phone number
  const [signupFormState, signupInputHandler, setSignupData, resetSignupForm] =
    useForm(
      {
        firstName: {
          value: "",
          isValid: false,
        },
        lastName: {
          value: "",
          isValid: false,
        },
        email: {
          value: "",
          isValid: false,
        },
        phoneNumber: {
          value: "",
          isValid: false,
        },
        password: {
          value: "",
          isValid: false,
        },
        confirmPassword: {
          value: "",
          isValid: false,
        },
      },
      false
    );

  // Handle mounting animation and auth state
  useEffect(() => {
    setMounted(true);

    if (authCtx.isLoggedIn && !authCtx.isLoading) {
      if (authCtx.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/users");
      }
    }
  }, [authCtx.isLoggedIn, authCtx.isLoading, authCtx.role, router]);

  // Input validation
  const validateEmail = (email) => {
    return email.includes("@") && email.length > 5;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return (
      phone.length >= 10 && phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))
    );
  };

  // Handle input changes
  const handleInputChange = (inputId, value, formType) => {
    let isValid = false;

    switch (inputId) {
      case "email":
        isValid = validateEmail(value);
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      case "confirmPassword":
        isValid =
          validatePassword(value) &&
          value === signupFormState.inputs.password?.value;
        break;
      case "firstName":
      case "lastName":
        isValid = validateName(value);
        break;
      case "phoneNumber":
        isValid = validatePhoneNumber(value);
        break;
      default:
        isValid = value.length > 0;
    }

    if (formType === "signin") {
      signinInputHandler(inputId, value, isValid);
    } else {
      signupInputHandler(inputId, value, isValid);

      // Re-validate confirm password when password changes
      if (
        inputId === "password" &&
        signupFormState.inputs.confirmPassword?.value
      ) {
        const confirmPasswordValid =
          validatePassword(signupFormState.inputs.confirmPassword.value) &&
          signupFormState.inputs.confirmPassword.value === value;
        signupInputHandler(
          "confirmPassword",
          signupFormState.inputs.confirmPassword.value,
          confirmPasswordValid
        );
      }
    }
  };

  // API call function for authentication
  const callAuthAPI = async (endpoint, userData) => {
    try {
      const apiEndpoint = endpoint === "login" ? "login" : "signup";
      const response = await fetch(
        `http://localhost:5001/api/users/${apiEndpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${endpoint} failed`);
      }

      return data;
    } catch (error) {
      throw new Error(error.message || `${endpoint} failed`);
    }
  };

  const handleSubmit = async (event, formType) => {
    event.preventDefault();
    setIsLoading(true);

    const currentFormState =
      formType === "signin" ? signinFormState : signupFormState;

    if (!currentFormState.isValid) {
      setToastMessage("Please fill in all fields correctly");
      setToastType("error");
      setToastOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      if (formType === "signin") {
        const loginData = {
          email: signinFormState.inputs.email.value,
          password: signinFormState.inputs.password.value,
        };

        const response = await callAuthAPI("login", loginData);

        authCtx.login({
          userId: response.userId,
          token: response.token,
          role: response.role,
        });

        setToastMessage("Welcome back!");
        setToastType("success");
        setToastOpen(true);

        setTimeout(() => {
          if (response.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/users");
          }
        }, 1500);
      } else {
        const password = signupFormState.inputs.password.value;
        const confirmPassword = signupFormState.inputs.confirmPassword.value;

        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const signupData = {
          name: `${signupFormState.inputs.firstName.value} ${signupFormState.inputs.lastName.value}`,
          email: signupFormState.inputs.email.value,
          phonenumber: signupFormState.inputs.phoneNumber.value,
          password: password,
        };

        const response = await callAuthAPI("signup", signupData);

        authCtx.login({
          userId: response.userId,
          token: response.token,
          role: response.role,
        });

        setToastMessage("Account created successfully!");
        setToastType("success");
        setToastOpen(true);

        setTimeout(() => {
          if (response.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/users");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Auth error:", error);

      // Better error message handling
      let errorMessage = error.message;
      if (error.message.includes("validation")) {
        errorMessage = "Please check your input and try again";
      } else if (error.message.includes("email")) {
        errorMessage = "Email already exists or is invalid";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection";
      }

      setToastMessage(errorMessage);
      setToastType("error");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setToastMessage(`${provider} login coming soon!`);
    setToastType("info");
    setToastOpen(true);
  };

  // Show loading state while auth context is loading
  if (authCtx.isLoading) {
    return (
      <div className={styles.authWrapper}>
        <div className={`${styles.authContainer} ${styles.loading}`}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
            </div>
            <p className={styles.loadingText}>Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authWrapper}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.wave}>
          <div className={styles.waveLayer1}></div>
          <div className={styles.waveLayer2}></div>
        </div>
        <div className={styles.aurora}>
          <div className={styles.auroraLayer1}></div>
        </div>
      </div>

      <div
        className={`${styles.authContainer} ${mounted ? styles.mounted : ""}`}
      >
        {/* Compact Brand Section */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <span className={styles.logoEmoji}>🍔</span>
            <h1 className={styles.brandName}>LinuBayo Food</h1>
          </div>
        </div>

        {/* Compact Auth Form */}
        <div className={styles.formContainer}>
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className={styles.tabsRoot}
          >
            {/* Compact Tab List */}
            <Tabs.List className={styles.tabsList} data-value={activeTab}>
              <Tabs.Trigger value="signin" className={styles.tabsTrigger}>
                Sign In
              </Tabs.Trigger>
              <Tabs.Trigger value="signup" className={styles.tabsTrigger}>
                Sign Up
              </Tabs.Trigger>
              <div className={styles.tabIndicator}></div>
            </Tabs.List>

            {/* Compact Sign In Tab */}
            <Tabs.Content value="signin" className={styles.tabsContent}>
              <form
                onSubmit={(e) => handleSubmit(e, "signin")}
                className={styles.form}
              >
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      placeholder="Email"
                      className={styles.input}
                      value={signinFormState.inputs.email?.value || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value, "signin")
                      }
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={styles.input}
                        value={signinFormState.inputs.password?.value || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "password",
                            e.target.value,
                            "signin"
                          )
                        }
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formOptions}>
                    <label className={styles.checkbox}>
                      <input type="checkbox" />
                      <span className={styles.checkmark}></span>
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      className={styles.forgotPassword}
                      onClick={() => {
                        setToastMessage("Password reset coming soon!");
                        setToastType("info");
                        setToastOpen(true);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`${styles.submitButton} ${styles.liquidGlass}`}
                    disabled={isLoading || !signinFormState.isValid}
                  >
                    <div className={styles.buttonContent}>
                      {isLoading ? (
                        <>
                          <div className={styles.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </div>
                    <div className={styles.liquidEffect}></div>
                  </button>
                </div>
              </form>
            </Tabs.Content>

            {/* Compact Sign Up Tab */}
            <Tabs.Content value="signup" className={styles.tabsContent}>
              <form
                onSubmit={(e) => handleSubmit(e, "signup")}
                className={styles.form}
              >
                <div className={styles.formGrid}>
                  <div className={styles.nameRow}>
                    <input
                      type="text"
                      placeholder="First Name"
                      className={styles.input}
                      value={signupFormState.inputs.firstName?.value || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value, "signup")
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className={styles.input}
                      value={signupFormState.inputs.lastName?.value || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value, "signup")
                      }
                      required
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={signupFormState.inputs.email?.value || ""}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value, "signup")
                    }
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className={styles.input}
                    value={signupFormState.inputs.phoneNumber?.value || ""}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value, "signup")
                    }
                    required
                  />

                  <div className={styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={styles.input}
                      value={signupFormState.inputs.password?.value || ""}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value, "signup")
                      }
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>

                  <div className={styles.passwordContainer}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={styles.input}
                      value={
                        signupFormState.inputs.confirmPassword?.value || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "confirmPassword",
                          e.target.value,
                          "signup"
                        )
                      }
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>

                  <label className={styles.checkbox}>
                    <input type="checkbox" required />
                    <span className={styles.checkmark}></span>
                    <span>I agree to the Terms and Privacy Policy</span>
                  </label>

                  <button
                    type="submit"
                    className={`${styles.submitButton} ${styles.liquidGlass}`}
                    disabled={isLoading || !signupFormState.isValid}
                  >
                    <div className={styles.buttonContent}>
                      {isLoading ? (
                        <>
                          <div className={styles.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </div>
                    <div className={styles.liquidEffect}></div>
                  </button>
                </div>
              </form>
            </Tabs.Content>
          </Tabs.Root>

          {/* Compact Social Login */}
          <div className={styles.socialSection}>
            <div className={styles.divider}>
              <span>Or continue with</span>
            </div>
            <div className={styles.socialButtons}>
              <button
                className={`${styles.socialButton} ${styles.liquidGlass}`}
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
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
                <span>Google</span>
                <div className={styles.liquidEffect}></div>
              </button>
              <button
                className={`${styles.socialButton} ${styles.liquidGlass}`}
                onClick={() => handleSocialLogin("Apple")}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                  <path
                    fill="currentColor"
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.653-.026 2.681-1.489 3.71-2.95 1.18-1.694 1.668-3.369 1.694-3.456-.037-.013-3.258-1.24-3.27-4.94-.013-3.117 2.537-4.609 2.651-4.696-1.17-1.947-3.91-1.894-4.699-1.894l-.402-.089z"
                  />
                  <path
                    fill="currentColor"
                    d="M10.174 4.222c.845-1.022 1.408-2.473 1.253-3.910-1.214.049-2.681.808-3.54 1.686-.546.546-.859 1.183-.859 1.83.013.546.195 1.0797.39 1.408.859.065 1.713-.546 2.756-1.014z"
                  />
                </svg>
                <span>Apple</span>
                <div className={styles.liquidEffect}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <Toast.Provider swipeDirection="right">
          <Toast.Root
            className={`${styles.toastRoot} ${styles[toastType]}`}
            open={toastOpen}
            onOpenChange={setToastOpen}
          >
            <div className={styles.toastIcon}>
              {toastType === "success"
                ? "✅"
                : toastType === "error"
                ? "❌"
                : "ℹ️"}
            </div>
            <div className={styles.toastContent}>
              <Toast.Title className={styles.toastTitle}>
                {toastType === "success"
                  ? "Success"
                  : toastType === "error"
                  ? "Error"
                  : "Info"}
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
