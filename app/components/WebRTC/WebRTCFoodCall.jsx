import React, { useState, useRef, useEffect } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Settings,
  Monitor,
  Camera,
  Volume2,
} from "lucide-react";
import styles from "./WebRTCFoodCall.module.css";

const WebRTCFoodCall = () => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callStartTime = useRef(null);

  // Simulate call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive && callStartTime.current) {
      interval = setInterval(() => {
        setCallDuration(
          Math.floor((Date.now() - callStartTime.current) / 1000)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const startCall = () => {
    setIsCallActive(true);
    callStartTime.current = Date.now();
    setCallDuration(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    callStartTime.current = null;
    setCallDuration(0);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerCard}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.logoIcon}>
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h1 className={styles.headerTitle}>FoodChat Live</h1>
                <p className={styles.headerSubtitle}>
                  {isCallActive
                    ? `Live • ${formatDuration(callDuration)}`
                    : "Ready to connect"}
                </p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.participantsBadge}>
                <Users className="w-4 h-4 text-orange-600" />
                <span className={styles.participantsText}>{participants}</span>
              </div>
              <button className={styles.settingsButton}>
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className={styles.mainVideoArea}>
        <div className={styles.videoGrid}>
          {/* Remote Video (Main) */}
          <div className={styles.remoteVideoContainer}>
            <video
              ref={remoteVideoRef}
              className={styles.remoteVideo}
              autoPlay
              playsInline
            />
            {!isCallActive && (
              <div className={styles.waitingOverlay}>
                <div>
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className={styles.waitingTitle}>
                    Waiting for connection...
                  </p>
                  <p className={styles.waitingSubtitle}>
                    Share recipes, get cooking tips, or browse menu items
                    together
                  </p>
                </div>
              </div>
            )}
            {isScreenSharing && (
              <div className={styles.screenSharingBadge}>
                <Monitor className="w-4 h-4" />
                Screen Sharing
              </div>
            )}
            {isCallActive && (
              <div className={styles.participantName}>Chef Maria Rodriguez</div>
            )}
          </div>

          {/* Local Video & Info */}
          <div className={styles.sidePanel}>
            {/* Local Video */}
            <div className={styles.localVideoContainer}>
              <video
                ref={localVideoRef}
                className={styles.localVideo}
                autoPlay
                playsInline
                muted
              />
              {!isVideoEnabled && (
                <div className={styles.videoDisabledOverlay}>
                  <VideoOff className="w-8 h-8" />
                </div>
              )}
              <div className={styles.localVideoLabel}>You</div>
              {!isAudioEnabled && (
                <div className={styles.muteIndicator}>
                  <MicOff className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Quick Info Card */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Today's Session</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Topic:</span>
                  <span className={styles.infoValue}>Italian Pasta Making</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Duration:</span>
                  <span className={styles.infoValue}>45 min</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Difficulty:</span>
                  <span className={styles.infoValueAccent}>Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.controlCard}>
          <div className={styles.controlButtons}>
            {/* Audio Control */}
            <button
              onClick={toggleAudio}
              className={`${styles.controlButton} ${
                isAudioEnabled
                  ? styles.controlButtonDefault
                  : styles.controlButtonDisabled
              }`}
            >
              {isAudioEnabled ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </button>

            {/* Video Control */}
            <button
              onClick={toggleVideo}
              className={`${styles.controlButton} ${
                isVideoEnabled
                  ? styles.controlButtonDefault
                  : styles.controlButtonDisabled
              }`}
            >
              {isVideoEnabled ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleScreenShare}
              className={`${styles.controlButton} ${
                isScreenSharing
                  ? styles.controlButtonActive
                  : styles.controlButtonDefault
              }`}
            >
              <Monitor className="w-6 h-6" />
            </button>

            {/* Call Control */}
            <button
              onClick={isCallActive ? endCall : startCall}
              className={`${styles.controlButton} ${
                isCallActive
                  ? styles.controlButtonEndCall
                  : styles.controlButtonCall
              }`}
            >
              {isCallActive ? (
                <PhoneOff className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </button>

            {/* Volume Control */}
            <button
              className={`${styles.controlButton} ${styles.controlButtonDefault}`}
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Status Bar */}
          <div className={styles.statusBar}>
            <div className={styles.statusContent}>
              <div className={styles.statusLeft}>
                <span>Connection: Excellent</span>
                <span>•</span>
                <span>Quality: HD</span>
                <span>•</span>
                <span>Latency: 12ms</span>
              </div>
              <div>Next: Dessert Masterclass at 3:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Recipe Card */}
      {isCallActive && (
        <div className={styles.floatingCard}>
          <h4 className={styles.floatingCardTitle}>Current Recipe</h4>
          <div className={styles.floatingCardContent}>
            <p>🍝 Fresh Fettuccine</p>
            <p>⏱️ Step 3 of 8: Kneading dough</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: "37.5%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebRTCFoodCall;
