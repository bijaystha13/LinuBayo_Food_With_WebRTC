"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Star,
  Clock,
  Truck,
  ChefHat,
  Heart,
  ArrowRight,
  MapPin,
  Phone,
  Video,
  Users,
  Calendar,
  Play,
  Award,
  BookOpen,
} from "lucide-react";
import styles from "./page.module.css";

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categories = [
    { name: "Pizza", emoji: "🍕", color: "#ff6b35" },
    { name: "Burgers", emoji: "🍔", color: "#ffa500" },
    { name: "Sushi", emoji: "🍣", color: "#ff69b4" },
    { name: "Pasta", emoji: "🍝", color: "#32cd32" },
    { name: "Desserts", emoji: "🍰", color: "#ff1493" },
    { name: "Drinks", emoji: "🥤", color: "#00bfff" },
  ];

  const featuredDishes = [
    {
      id: 1,
      name: "Truffle Pizza Supreme",
      price: 24.99,
      rating: 4.9,
      time: "25-30 min",
      image: "🍕",
      chef: "Mario Rossi",
    },
    {
      id: 2,
      name: "Wagyu Burger Deluxe",
      price: 32.99,
      rating: 4.8,
      time: "15-20 min",
      image: "🍔",
      chef: "Chef Johnson",
    },
    {
      id: 3,
      name: "Dragon Roll Special",
      price: 28.5,
      rating: 5.0,
      time: "20-25 min",
      image: "🍣",
      chef: "Takeshi San",
    },
  ];

  const onlineSessions = [
    {
      id: 1,
      title: "Master Italian Pasta Making",
      chef: "Chef Maria Rodriguez",
      date: "Today",
      time: "2:00 PM",
      duration: "90 min",
      participants: 24,
      price: 45.0,
      rating: 4.9,
      category: "Italian",
      level: "Intermediate",
      isLive: false,
      isUpcoming: true,
      image: "🍝",
    },
    {
      id: 2,
      title: "Mexican Street Tacos Live",
      chef: "Chef Carlos Mendez",
      date: "Live Now",
      time: "Live",
      duration: "60 min",
      participants: 45,
      price: 35.0,
      rating: 4.7,
      category: "Mexican",
      level: "Beginner",
      isLive: true,
      isUpcoming: false,
      image: "🌮",
    },
    {
      id: 3,
      title: "French Pastry Fundamentals",
      chef: "Chef Sophie Laurent",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "120 min",
      participants: 31,
      price: 55.0,
      rating: 4.8,
      category: "Pastry",
      level: "Beginner",
      isLive: false,
      isUpcoming: true,
      image: "🥐",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div
            className={`${styles.heroText} ${isLoaded ? styles.fadeInUp : ""}`}
          >
            <h1 className={styles.heroTitle}>
              Delicious Food
              <span className={styles.titleGradient}> Delivered Fresh</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Experience culinary excellence from top-rated restaurants,
              delivered hot and fresh to your doorstep in under 30 minutes.
            </p>

            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <MapPin className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Enter your delivery address..."
                  className={styles.searchInput}
                />
                <button className={styles.searchButton}>
                  <Search />
                  Find Food
                </button>
              </div>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Happy Customers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Restaurants</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4.9★</span>
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>
          </div>

          <div
            className={`${styles.heroImage} ${
              isLoaded ? styles.fadeInRight : ""
            }`}
          >
            <div className={styles.floatingFood}>
              <div className={styles.foodItem} style={{ "--delay": "0s" }}>
                🍕
              </div>
              <div className={styles.foodItem} style={{ "--delay": "0.5s" }}>
                🍔
              </div>
              <div className={styles.foodItem} style={{ "--delay": "1s" }}>
                🍣
              </div>
              <div className={styles.foodItem} style={{ "--delay": "1.5s" }}>
                🍝
              </div>
              <div className={styles.foodItem} style={{ "--delay": "0.1s" }}>
                🥗
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Popular Categories</h2>
          <p>Discover your favorite cuisine</p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${styles.categoryCard} ${
                activeCategory === index ? styles.active : ""
              }`}
              onClick={() => setActiveCategory(index)}
              style={{ "--category-color": category.color }}
            >
              <div className={styles.categoryEmoji}>{category.emoji}</div>
              <span className={styles.categoryName}>{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.onlineSessions}>
        <div className={styles.sectionHeader}>
          <h2>
            <Video className={styles.sectionIcon} />
            We Also Provide Online Cooking Sessions
          </h2>
          <p>
            Master culinary arts from the comfort of your home with our expert
            chefs
          </p>
        </div>

        <div className={styles.sessionsHighlight}>
          <div className={styles.highlightContent}>
            <div className={styles.highlightText}>
              <h3>Learn From Professional Chefs</h3>
              <p className={styles.highlightDescription}>
                Join our interactive online cooking sessions and elevate your
                culinary skills. Our experienced chefs will guide you through
                each step, ensuring you master every technique.
              </p>
              <ul className={styles.highlightFeatures}>
                <li>
                  <Video className={styles.featureIconSmall} />
                  Interactive live cooking sessions
                </li>
                <li>
                  <Users className={styles.featureIconSmall} />
                  Small class sizes for personalized attention
                </li>
                <li>
                  <Award className={styles.featureIconSmall} />
                  Learn from certified professional chefs
                </li>
                <li>
                  <BookOpen className={styles.featureIconSmall} />
                  Recipe guides and video recordings included
                </li>
              </ul>
            </div>
            <div className={styles.highlightVisual}>
              <div className={styles.sessionPreview}>
                <div className={styles.previewHeader}>
                  <ChefHat className={styles.previewIcon} />
                  <div className={styles.previewText}>
                    <h4>Interactive Cooking</h4>
                    <p>Learn. Cook. Master.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sessionShowcase}>
          <h3 className={styles.showcaseTitle}>Featured Cooking Sessions</h3>
          <div className={styles.sessionCards}>
            {onlineSessions.map((session) => (
              <div key={session.id} className={styles.sessionCard}>
                <div className={styles.sessionImage}>
                  <span className={styles.sessionEmoji}>{session.image}</span>
                  <div className={styles.sessionBadge}>
                    <span className={styles.badgeLevel}>{session.level}</span>
                  </div>
                </div>

                <div className={styles.sessionContent}>
                  <div className={styles.sessionHeader}>
                    <h4 className={styles.sessionTitle}>{session.title}</h4>
                    <div className={styles.sessionMeta}>
                      <span className={styles.sessionChef}>
                        by {session.chef}
                      </span>
                      <div className={styles.sessionRating}>
                        <Star className={styles.starIconSmall} />
                        <span>{session.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className={styles.sessionDescription}>
                    {session.description}
                  </p>

                  <div className={styles.sessionStats}>
                    <div className={styles.sessionStat}>
                      <Clock className={styles.statIcon} />
                      <span>{session.duration}</span>
                    </div>
                    <div className={styles.sessionStat}>
                      <Users className={styles.statIcon} />
                      <span>{session.participants} enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sessionsCTA}>
            <h3>Ready to Start Your Culinary Journey?</h3>
            <p>
              Register now for our online cooking sessions and learn from the
              best chefs in the industry.
            </p>
            <Link href="/sessions" className={styles.registerBtn}>
              <Video className={styles.btnIcon} />
              Register for Online Cooking Sessions
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Clock />
            </div>
            <h3>Fast Delivery</h3>
            <p>
              Get your food delivered in 30 minutes or less, guaranteed fresh
              and hot.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Truck />
            </div>
            <h3>Free Shipping</h3>
            <p>
              Enjoy free delivery on orders over $25. No hidden fees, just great
              food.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Star />
            </div>
            <h3>Top Quality</h3>
            <p>
              Only the finest ingredients from premium restaurants and certified
              chefs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>Chef&apos;s Special</h2>
          <p>Handpicked by our culinary experts</p>
        </div>
        <div className={styles.dishGrid}>
          {featuredDishes.map((dish) => (
            <div key={dish.id} className={styles.dishCard}>
              <div className={styles.dishImage}>
                <span className={styles.dishEmoji}>{dish.image}</span>
                <button className={styles.wishlistBtn}>
                  <Heart />
                </button>
              </div>
              <div className={styles.dishInfo}>
                <h3 className={styles.dishName}>{dish.name}</h3>
                <p className={styles.dishChef}>by {dish.chef}</p>
                <div className={styles.dishMeta}>
                  <div className={styles.rating}>
                    <Star className={styles.starIcon} />
                    <span>{dish.rating}</span>
                  </div>
                  <div className={styles.time}>
                    <Clock className={styles.clockIcon} />
                    <span>{dish.time}</span>
                  </div>
                </div>
                <div className={styles.dishFooter}>
                  <span className={styles.price}>${dish.price}</span>
                  <button className={styles.addBtn}>
                    Add to Cart
                    <ArrowRight className={styles.btnIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Order?</h2>
          <p>
            Join thousands of food lovers and experience the best dining at
            home.
          </p>
          <button className={styles.ctaButton}>
            <Phone className={styles.ctaIcon} />
            <Link href="/menu">Order Now</Link>
          </button>
        </div>
        <div className={styles.ctaBackground}></div>
      </section>
    </div>
  );
};

export default Homepage;
