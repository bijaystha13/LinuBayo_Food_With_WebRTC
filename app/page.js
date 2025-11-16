"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  Search,
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
  Award,
  BookOpen,
  Zap,
  Gift,
  TrendingUp,
} from "lucide-react";
import styles from "./page.module.css";
import ChatBot from "./components/ChatBOT/ChatBot";
import { AuthContext } from "@/app/shared/Context/AuthContext";

const Homepage = () => {
  const authCtx = useContext(AuthContext);
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
      duration: "90 min",
      participants: 24,
      rating: 4.9,
      level: "Intermediate",
      image: "🍝",
    },
    {
      id: 2,
      title: "Mexican Street Tacos Live",
      chef: "Chef Carlos Mendez",
      duration: "60 min",
      participants: 45,
      rating: 4.7,
      level: "Beginner",
      image: "🌮",
    },
    {
      id: 3,
      title: "French Pastry Fundamentals",
      chef: "Chef Sophie Laurent",
      duration: "120 min",
      participants: 31,
      rating: 4.8,
      level: "Beginner",
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
              <div className={styles.foodItem}>🍕</div>
              <div className={styles.foodItem}>🍔</div>
              <div className={styles.foodItem}>🍣</div>
              <div className={styles.foodItem}>🍝</div>
              <div className={styles.foodItem}>🥗</div>
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

      {/* App Promotion Section - For non-authenticated users */}
      {!authCtx.isLoggedIn && (
        <section className={styles.appPromotion}>
          <div className={styles.promoWrapper}>
            <div className={styles.promoCard}>
              <div className={styles.promoLeft}>
                <div className={styles.promoBadge}>🎉 LIMITED TIME OFFER</div>
                <h2 className={styles.promoTitle}>
                  Get <span className={styles.promoHighlight}>50% OFF</span>
                  <br />
                  Your First Order!
                </h2>
                <p className={styles.promoDescription}>
                  Join thousands of food lovers. Download our app for exclusive
                  deals, faster ordering, and real-time tracking.
                </p>
                <div className={styles.promoFeatures}>
                  <div className={styles.promoFeature}>
                    <Zap className={styles.promoFeatureIcon} />
                    <span>Lightning-fast ordering</span>
                  </div>
                  <div className={styles.promoFeature}>
                    <Gift className={styles.promoFeatureIcon} />
                    <span>Exclusive app deals</span>
                  </div>
                  <div className={styles.promoFeature}>
                    <TrendingUp className={styles.promoFeatureIcon} />
                    <span>Earn rewards</span>
                  </div>
                </div>
                <div className={styles.promoCTA}>
                  <Link href="/auth?mode=signup" className={styles.promoBtn}>
                    Sign Up Now
                    <ArrowRight className={styles.promoBtnIcon} />
                  </Link>
                  <Link href="/auth?mode=login" className={styles.promoLink}>
                    Already have an account?
                  </Link>
                </div>
              </div>
              <div className={styles.promoRight}>
                <div className={styles.phoneWrapper}>
                  <div className={styles.phoneDevice}>
                    <div className={styles.phoneNotch}></div>
                    <div className={styles.phoneContent}>
                      <div className={styles.appDisplay}>
                        <div className={styles.appHeader}>
                          <span className={styles.appLogo}>🍔</span>
                          <div className={styles.appInfo}>
                            <h4>LinuBayo Food</h4>
                            <p>Order in seconds</p>
                          </div>
                        </div>
                        <div className={styles.appStats}>
                          <div className={styles.appStat}>
                            <span className={styles.appStatNumber}>4.9★</span>
                            <span className={styles.appStatLabel}>Rating</span>
                          </div>
                          <div className={styles.appStat}>
                            <span className={styles.appStatNumber}>10K+</span>
                            <span className={styles.appStatLabel}>Orders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.floatingDiscount}>50% OFF</div>
                  <div className={styles.floatingDelivery}>Free Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Online Sessions - Only for authenticated users */}
      {authCtx.isLoggedIn && (
        <section className={styles.onlineSessions}>
          <div className={styles.sectionHeader}>
            <h2>
              <Video className={styles.sectionIcon} />
              Online Cooking Sessions
            </h2>
            <p>Master culinary arts from the comfort of your home</p>
          </div>

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
            <p>Register now and learn from the best chefs in the industry.</p>
            <Link href="/sessions" className={styles.registerBtn}>
              <Video className={styles.btnIcon} />
              Register for Cooking Sessions
            </Link>
          </div>
        </section>
      )}

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
      </section>

      <ChatBot />
    </div>
  );
};

export default Homepage;
