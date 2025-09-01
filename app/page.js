"use client";
import React, { useState, useEffect } from "react";
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
              <div className={styles.foodItem} style={{ "--delay": "2s" }}>
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
          <h2>Chef's Special</h2>
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
            Order Now
          </button>
        </div>
        <div className={styles.ctaBackground}></div>
      </section>
    </div>
  );
};

export default Homepage;
