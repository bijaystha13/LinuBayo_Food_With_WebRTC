"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./GoogleLens.module.css";

const GoogleLens = ({ onStateChange, onAnalysisResult, isOnline }) => {
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stream, setStream] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [captureMode, setCaptureMode] = useState("screen"); // 'screen', 'camera', or 'upload'
  const [isScreenCaptureSupported, setIsScreenCaptureSupported] =
    useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if screen capture is supported
  const checkScreenCaptureSupport = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }, []);

  // Capture current screen/tab
  const captureScreen = useCallback(async () => {
    if (!checkScreenCaptureSupport()) {
      alert(
        "Screen capture is not supported in your browser. Please use Chrome, Firefox, or Safari."
      );
      return;
    }

    try {
      const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      // Create a video element to capture the stream
      const video = document.createElement("video");
      video.srcObject = displayMediaStream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      // Create canvas and capture frame
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0);

      // Stop the stream immediately after capturing
      displayMediaStream.getTracks().forEach((track) => track.stop());

      // Convert to blob and analyze
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            setIsCapturing(true);
            analyzeImage(blob);
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (error) {
      console.error("Error capturing screen:", error);

      if (error.name === "NotAllowedError") {
        alert(
          "Screen capture permission denied. Please allow screen sharing to use this feature."
        );
      } else if (error.name === "NotSupportedError") {
        alert("Screen capture is not supported in your browser.");
        setIsScreenCaptureSupported(false);
      } else {
        alert("Failed to capture screen. Please try again.");
      }
    }
  }, []);

  // Open Google Lens interface with screen capture by default
  const openLens = useCallback(async () => {
    // Check if online before opening
    if (!isOnline) {
      alert(
        "Google Lens requires an internet connection. Please check your network and try again."
      );
      return;
    }

    setIsLensOpen(true);

    // Notify parent component about state change
    if (onStateChange) {
      onStateChange(true);
    }

    // Check screen capture support
    if (checkScreenCaptureSupport()) {
      setCaptureMode("screen");
      setIsScreenCaptureSupported(true);
    } else {
      setCaptureMode("camera");
      setIsScreenCaptureSupported(false);
    }
  }, [isOnline, onStateChange, checkScreenCaptureSupport]);

  // Start camera capture
  const startCameraCapture = useCallback(async () => {
    setCaptureMode("camera");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment", // Use back camera on mobile
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setHasPermission(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    }
  }, []);

  // Close Google Lens interface
  const closeLens = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setIsLensOpen(false);
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setHasPermission(null);
    setCaptureMode("screen");

    // Notify parent component about state change
    if (onStateChange) {
      onStateChange(false);
    }
  }, [stream, onStateChange]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          setIsCapturing(true);
          analyzeImage(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setIsCapturing(true);
      setCaptureMode("upload");
      analyzeImage(file);
    }
  }, []);

  // Simulate image analysis (replace with actual AI/ML service)
  const analyzeImage = useCallback(
    async (imageBlob) => {
      setIsAnalyzing(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock analysis results - you would replace this with actual API call
        const mockResults = [
          {
            name: "Pizza Margherita",
            confidence: 92,
            category: "pizza",
            price: "$18.99",
            description:
              "Classic Italian pizza with fresh tomatoes, mozzarella, and basil",
          },
          {
            name: "Burger Deluxe",
            confidence: 88,
            category: "fast food",
            price: "$14.50",
            description:
              "Juicy beef burger with lettuce, tomato, cheese, and special sauce",
          },
          {
            name: "Caesar Salad",
            confidence: 85,
            category: "salad",
            price: "$12.99",
            description:
              "Fresh romaine lettuce with parmesan cheese and Caesar dressing",
          },
        ];

        // For screen captures, simulate detecting web content
        if (captureMode === "screen") {
          const screenResults = [
            {
              name: "Menu Items Detected",
              confidence: 95,
              category: "all",
              price: "Various",
              description: "Multiple food items detected on the current page",
            },
            {
              name: "Restaurant Website",
              confidence: 90,
              category: "main",
              price: "Menu Available",
              description: "Food delivery website with various menu categories",
            },
          ];

          const result =
            screenResults[Math.floor(Math.random() * screenResults.length)];
          setAnalysisResult(result);

          if (onAnalysisResult) {
            onAnalysisResult(result);
          }
        } else {
          // Regular image analysis
          const result =
            mockResults[Math.floor(Math.random() * mockResults.length)];
          setAnalysisResult(result);

          if (onAnalysisResult) {
            onAnalysisResult(result);
          }
        }
      } catch (error) {
        console.error("Analysis error:", error);
        setAnalysisResult({
          error: "Unable to analyze image. Please try again.",
        });
      } finally {
        setIsAnalyzing(false);
      }
    },
    [captureMode, onAnalysisResult]
  );

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsCapturing(false);
    setIsAnalyzing(false);
    setCaptureMode("screen");
  }, []);

  return (
    <>
      {/* Google Lens Button */}
      <button
        className={styles.lensButton}
        onClick={openLens}
        title="Search with Google Lens"
      >
        <div className={styles.lensIcon}>
          <div className={styles.lensOuter}>
            <div className={styles.lensInner}></div>
          </div>
        </div>
        <span className={styles.lensText}>Lens</span>
      </button>

      {/* Google Lens Modal */}
      {isLensOpen && (
        <div className={styles.lensModal}>
          <div className={styles.lensContainer}>
            {/* Header */}
            <div className={styles.lensHeader}>
              <button className={styles.closeButton} onClick={closeLens}>
                ✕
              </button>
              <h2 className={styles.lensTitle}>Search what you see</h2>
              <button
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
              >
                📁
              </button>
            </div>

            {/* Capture Mode Selection */}
            {!isCapturing && !capturedImage && (
              <div className={styles.captureModeSelector}>
                <div className={styles.modeButtons}>
                  {isScreenCaptureSupported && (
                    <button
                      className={`${styles.modeButton} ${
                        captureMode === "screen" ? styles.active : ""
                      }`}
                      onClick={() => setCaptureMode("screen")}
                    >
                      <div className={styles.modeIcon}>🖥️</div>
                      <span>Capture Screen</span>
                    </button>
                  )}

                  <button
                    className={`${styles.modeButton} ${
                      captureMode === "camera" ? styles.active : ""
                    }`}
                    onClick={() => setCaptureMode("camera")}
                  >
                    <div className={styles.modeIcon}>📷</div>
                    <span>Use Camera</span>
                  </button>

                  <button
                    className={`${styles.modeButton} ${
                      captureMode === "upload" ? styles.active : ""
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={styles.modeIcon}>📁</div>
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Action Area */}
                <div className={styles.actionArea}>
                  {captureMode === "screen" && (
                    <div className={styles.screenCaptureArea}>
                      <div className={styles.captureIcon}>🖥️</div>
                      <h3>Capture Current Screen</h3>
                      <p>
                        Take a screenshot of your current tab or screen to
                        analyze its content
                      </p>
                      <button
                        className={styles.primaryActionButton}
                        onClick={captureScreen}
                      >
                        Capture Screen
                      </button>
                    </div>
                  )}

                  {captureMode === "camera" && hasPermission === null && (
                    <div className={styles.cameraInitArea}>
                      <div className={styles.captureIcon}>📷</div>
                      <h3>Use Camera</h3>
                      <p>Point your camera at food items to identify them</p>
                      <button
                        className={styles.primaryActionButton}
                        onClick={startCameraCapture}
                      >
                        Start Camera
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Camera Permission Error */}
            {captureMode === "camera" && hasPermission === false && (
              <div className={styles.permissionError}>
                <div className={styles.errorIcon}>📷</div>
                <h3>Camera access needed</h3>
                <p>Please allow camera access to use visual search</p>
                <button
                  className={styles.uploadButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Image Instead
                </button>
              </div>
            )}

            {/* Camera View */}
            {captureMode === "camera" && hasPermission && !isCapturing && (
              <div className={styles.cameraView}>
                <video
                  ref={videoRef}
                  className={styles.video}
                  autoPlay
                  playsInline
                  muted
                />

                {/* Viewfinder overlay */}
                <div className={styles.viewfinder}>
                  <div
                    className={styles.viewfinderCorner}
                    style={{ top: 0, left: 0 }}
                  ></div>
                  <div
                    className={styles.viewfinderCorner}
                    style={{ top: 0, right: 0 }}
                  ></div>
                  <div
                    className={styles.viewfinderCorner}
                    style={{ bottom: 0, left: 0 }}
                  ></div>
                  <div
                    className={styles.viewfinderCorner}
                    style={{ bottom: 0, right: 0 }}
                  ></div>
                </div>

                {/* Controls */}
                <div className={styles.cameraControls}>
                  <button
                    className={styles.captureButton}
                    onClick={capturePhoto}
                  >
                    <div className={styles.captureInner}></div>
                  </button>
                </div>

                <div className={styles.instructionText}>
                  Point your camera at food to identify it
                </div>
              </div>
            )}

            {/* Captured Image View */}
            {capturedImage && (
              <div className={styles.capturedView}>
                <div className={styles.imageContainer}>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className={styles.capturedImage}
                  />

                  {/* Analysis Loading */}
                  {isAnalyzing && (
                    <div className={styles.analysisOverlay}>
                      <div className={styles.analysisSpinner}></div>
                      <p>
                        {captureMode === "screen"
                          ? "Analyzing screen content..."
                          : "Analyzing image..."}
                      </p>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {analysisResult && !isAnalyzing && (
                    <div className={styles.resultsPanel}>
                      {analysisResult.error ? (
                        <div className={styles.errorResult}>
                          <p>{analysisResult.error}</p>
                        </div>
                      ) : (
                        <div className={styles.foodResult}>
                          <div className={styles.resultHeader}>
                            <h3>{analysisResult.name}</h3>
                            <span className={styles.confidence}>
                              {analysisResult.confidence}% match
                            </span>
                          </div>
                          <div className={styles.resultDetails}>
                            <p className={styles.price}>
                              {analysisResult.price}
                            </p>
                            <p className={styles.category}>
                              Category: {analysisResult.category}
                            </p>
                            <p className={styles.description}>
                              {analysisResult.description}
                            </p>
                          </div>
                          {captureMode !== "screen" && (
                            <button className={styles.addToCartButton}>
                              Add to Cart
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Controls */}
                <div className={styles.imageControls}>
                  <button className={styles.retakeButton} onClick={retakePhoto}>
                    {captureMode === "screen" ? "Capture Again" : "Retake"}
                  </button>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLens;
