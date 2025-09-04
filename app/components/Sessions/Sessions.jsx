"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Star,
  Play,
  ChefHat,
  MapPin,
  Award,
  BookOpen,
  Video,
  Heart,
  Share2,
  Filter,
  Search,
} from "lucide-react";
import styles from "./Sessions.module.css";
import WebRTCFoodCall from "../WebRTC/WebRTCFoodCall";

const OnlineSessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showWebRTC, setShowWebRTC] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock data - replace with your API calls
  const upcomingSessions = [
    {
      id: 1,
      title: "Master Italian Pasta Making",
      chef: "Chef Maria Rodriguez",
      chefImage: "/api/placeholder/60/60",
      date: "2024-09-15",
      time: "2:00 PM - 3:30 PM",
      duration: "90 min",
      participants: 24,
      maxParticipants: 30,
      price: 45.0,
      rating: 4.9,
      reviews: 156,
      category: "Italian",
      level: "Intermediate",
      image: "/api/placeholder/400/250",
      description:
        "Learn the authentic techniques of making fresh pasta from scratch. We'll cover fettuccine, ravioli, and traditional sauces.",
      ingredients: ["Flour", "Eggs", "Olive Oil", "Salt"],
      isLive: false,
      isPopular: true,
    },
    {
      id: 2,
      title: "Sushi & Sashimi Masterclass",
      chef: "Chef Takeshi Yamamoto",
      chefImage: "/api/placeholder/60/60",
      date: "2024-09-15",
      time: "6:00 PM - 8:00 PM",
      duration: "120 min",
      participants: 18,
      maxParticipants: 20,
      price: 65.0,
      rating: 5.0,
      reviews: 89,
      category: "Japanese",
      level: "Advanced",
      image: "/api/placeholder/400/250",
      description:
        "Master the art of sushi making with knife skills, rice preparation, and traditional presentation techniques.",
      ingredients: ["Sushi Rice", "Nori", "Fresh Fish", "Wasabi"],
      isLive: false,
      isPopular: false,
    },
    {
      id: 3,
      title: "French Pastry Fundamentals",
      chef: "Chef Sophie Laurent",
      chefImage: "/api/placeholder/60/60",
      date: "2024-09-16",
      time: "10:00 AM - 12:00 PM",
      duration: "120 min",
      participants: 31,
      maxParticipants: 35,
      price: 55.0,
      rating: 4.8,
      reviews: 203,
      category: "Pastry",
      level: "Beginner",
      image: "/api/placeholder/400/250",
      description:
        "Learn classic French pastry techniques including croissants, éclairs, and choux pastry.",
      ingredients: ["Butter", "Flour", "Eggs", "Sugar"],
      isLive: false,
      isPopular: true,
    },
  ];

  const liveSessions = [
    {
      id: 4,
      title: "Mexican Street Tacos Live",
      chef: "Chef Carlos Mendez",
      chefImage: "/api/placeholder/60/60",
      date: "Today",
      time: "Live Now",
      duration: "60 min",
      participants: 45,
      maxParticipants: 50,
      price: 35.0,
      rating: 4.7,
      reviews: 124,
      category: "Mexican",
      level: "Beginner",
      image: "/api/placeholder/400/250",
      description:
        "Join us live as we make authentic Mexican street tacos with homemade tortillas and fresh salsas.",
      ingredients: ["Corn", "Beef", "Onions", "Cilantro"],
      isLive: true,
      isPopular: true,
    },
  ];

  const pastSessions = [
    {
      id: 5,
      title: "Thai Curry Workshop",
      chef: "Chef Siriporn Lee",
      chefImage: "/api/placeholder/60/60",
      date: "2024-09-10",
      time: "Recorded",
      duration: "105 min",
      participants: 67,
      maxParticipants: 60,
      price: 40.0,
      rating: 4.9,
      reviews: 198,
      category: "Thai",
      level: "Intermediate",
      image: "/api/placeholder/400/250",
      description:
        "Master the balance of flavors in authentic Thai curries with traditional techniques and ingredients.",
      ingredients: ["Coconut Milk", "Curry Paste", "Thai Basil", "Fish Sauce"],
      isLive: false,
      isPopular: false,
    },
  ];

  const handleJoinSession = (session) => {
    setSelectedSession(session);
    setShowWebRTC(true);
  };

  const handleCloseWebRTC = () => {
    setShowWebRTC(false);
    setSelectedSession(null);
  };

  const getSessionsByTab = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingSessions;
      case "live":
        return liveSessions;
      case "past":
        return pastSessions;
      default:
        return upcomingSessions;
    }
  };

  const filteredSessions = getSessionsByTab().filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.chef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      session.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (showWebRTC) {
    return (
      <div className={styles.webrtcOverlay}>
        <div className={styles.webrtcHeader}>
          <div className={styles.sessionInfo}>
            <h2>{selectedSession?.title}</h2>
            <p>with {selectedSession?.chef}</p>
          </div>
          <button className={styles.closeButton} onClick={handleCloseWebRTC}>
            ✕
          </button>
        </div>
        <WebRTCFoodCall />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Learn Cooking from World-Class Chefs
            </h1>
            <p className={styles.heroSubtitle}>
              Join live interactive cooking sessions, masterclasses, and
              workshops from the comfort of your kitchen
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Expert Chefs</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10k+</span>
                <span className={styles.statLabel}>Students</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4.9</span>
                <span className={styles.statLabel}>Average Rating</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImagePlaceholder}>
              <ChefHat className={styles.heroIcon} />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search sessions, chefs, or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterContainer}>
            <Filter className={styles.filterIcon} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="japanese">Japanese</option>
              <option value="mexican">Mexican</option>
              <option value="thai">Thai</option>
              <option value="pastry">Pastry</option>
            </select>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className={styles.tabsSection}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "upcoming" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            <Calendar className={styles.tabIcon} />
            Upcoming Sessions
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "live" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("live")}
          >
            <Video className={styles.tabIcon} />
            Live Now
            <span className={styles.liveBadge}>{liveSessions.length}</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "past" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            <BookOpen className={styles.tabIcon} />
            Past Sessions
          </button>
        </div>
      </section>

      {/* Sessions Grid */}
      <section className={styles.sessionsSection}>
        <div className={styles.sessionsGrid}>
          {filteredSessions.map((session) => (
            <div key={session.id} className={styles.sessionCard}>
              {session.isPopular && (
                <div className={styles.popularBadge}>
                  <Star className={styles.badgeIcon} />
                  Popular
                </div>
              )}
              {session.isLive && (
                <div className={styles.liveBadgeCard}>
                  <div className={styles.liveDot}></div>
                  LIVE
                </div>
              )}

              <div className={styles.sessionImage}>
                <div className={styles.imagePlaceholder}>
                  <ChefHat className={styles.imageIcon} />
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionButton}>
                    <Heart className={styles.actionIcon} />
                  </button>
                  <button className={styles.actionButton}>
                    <Share2 className={styles.actionIcon} />
                  </button>
                </div>
              </div>

              <div className={styles.sessionContent}>
                <div className={styles.sessionHeader}>
                  <h3 className={styles.sessionTitle}>{session.title}</h3>
                  <div className={styles.sessionMeta}>
                    <div className={styles.chefInfo}>
                      <div className={styles.chefAvatar}>
                        <img src={session.chefImage} alt={session.chef} />
                      </div>
                      <span className={styles.chefName}>{session.chef}</span>
                    </div>
                    <div className={styles.rating}>
                      <Star className={styles.starIcon} />
                      <span>{session.rating}</span>
                      <span className={styles.reviewCount}>
                        ({session.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                <p className={styles.sessionDescription}>
                  {session.description}
                </p>

                <div className={styles.sessionDetails}>
                  <div className={styles.detailItem}>
                    <Calendar className={styles.detailIcon} />
                    <span>{session.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Clock className={styles.detailIcon} />
                    <span>{session.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Users className={styles.detailIcon} />
                    <span>
                      {session.participants}/{session.maxParticipants}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <Award className={styles.detailIcon} />
                    <span>{session.level}</span>
                  </div>
                </div>

                <div className={styles.ingredients}>
                  <span className={styles.ingredientsLabel}>Ingredients:</span>
                  <div className={styles.ingredientTags}>
                    {session.ingredients.map((ingredient, index) => (
                      <span key={index} className={styles.ingredientTag}>
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.sessionFooter}>
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>
                      ${session.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className={`${styles.joinButton} ${
                      session.isLive ? styles.liveButton : ""
                    }`}
                    onClick={() => handleJoinSession(session)}
                  >
                    {session.isLive ? (
                      <>
                        <Play className={styles.buttonIcon} />
                        Join Live
                      </>
                    ) : activeTab === "past" ? (
                      <>
                        <Play className={styles.buttonIcon} />
                        Watch Recording
                      </>
                    ) : (
                      <>
                        <Calendar className={styles.buttonIcon} />
                        Join Session
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <Search />
            </div>
            <h3>No sessions found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Want to Host Your Own Session?</h2>
          <p className={styles.ctaSubtitle}>
            Share your culinary expertise with food lovers worldwide
          </p>
          <Link href="/become-chef" className={styles.ctaButton}>
            <ChefHat className={styles.ctaIcon} />
            Become a Chef Instructor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OnlineSessions;
