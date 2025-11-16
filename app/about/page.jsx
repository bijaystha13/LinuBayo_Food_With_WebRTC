import React from "react";
import {
  Clock,
  Users,
  Award,
  Truck,
  Heart,
  ChefHat,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import styles from "./about.module.css";

const AboutPage = () => {
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: <Users /> },
    { number: "500+", label: "Partner Restaurants", icon: <ChefHat /> },
    { number: "50+", label: "Cities Served", icon: <MapPin /> },
    { number: "99.9%", label: "Delivery Success", icon: <Truck /> },
  ];

  const values = [
    {
      title: "Quality First",
      description:
        "We partner only with restaurants that meet our strict quality standards",
      icon: <Award className={styles.valueIcon} />,
    },
    {
      title: "Fast Delivery",
      description: "Your food delivered hot and fresh in 30 minutes or less",
      icon: <Clock className={styles.valueIcon} />,
    },
    {
      title: "Customer Care",
      description: "24/7 support to ensure your dining experience is perfect",
      icon: <Heart className={styles.valueIcon} />,
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "👩‍💼",
      description: "Former restaurant owner with 15 years in the food industry",
    },
    {
      name: "Mike Chen",
      role: "Head Chef Partner",
      image: "👨‍🍳",
      description: "Michelin-starred chef ensuring quality across our platform",
    },
    {
      name: "Emily Davis",
      role: "Customer Experience",
      image: "👩‍💻",
      description: "Dedicated to making every order a delightful experience",
    },
  ];

  return (
    <div className={styles.container}>
      {/* <CustomerChat /> */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About LinuBayo Food</h1>
          <p className={styles.heroSubtitle}>
            Connecting food lovers with the best restaurants in their city since
            2020
          </p>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.floatingEmoji}>🍕</div>
          <div className={styles.floatingEmoji}>🍔</div>
          <div className={styles.floatingEmoji}>🍣</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.storyContent}>
          <div className={styles.storyText}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <p className={styles.storyParagraph}>
              LinuBayo Food was born from a simple idea: everyone deserves
              access to delicious, high-quality food delivered right to their
              doorstep. Our founders, passionate food enthusiasts, noticed that
              while great restaurants existed in every city, connecting them
              with hungry customers was often complicated and unreliable.
            </p>
            <p className={styles.storyParagraph}>
              Starting in 2020, we began partnering with local restaurants to
              create a platform that prioritizes quality, speed, and customer
              satisfaction. Today, we're proud to serve thousands of customers
              daily while supporting local businesses in their growth.
            </p>
          </div>
          <div className={styles.storyImage}>
            <div className={styles.imageContainer}>
              <span className={styles.storyEmoji}>🏪</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>
              {value.icon}
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <h2 className={styles.sectionTitle}>Meet Our Team</h2>
        <div className={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} className={styles.teamCard}>
              <div className={styles.teamImage}>
                <span className={styles.teamEmoji}>{member.image}</span>
              </div>
              <div className={styles.teamInfo}>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamDescription}>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            To revolutionize the food delivery experience by creating meaningful
            connections between restaurants, delivery partners, and customers.
            We believe that great food brings people together, and we're
            committed to making that connection as seamless and enjoyable as
            possible.
          </p>
          <div className={styles.missionValues}>
            <div className={styles.missionValue}>
              <span className={styles.missionIcon}>🌱</span>
              <span>Sustainable practices</span>
            </div>
            <div className={styles.missionValue}>
              <span className={styles.missionIcon}>🤝</span>
              <span>Community support</span>
            </div>
            <div className={styles.missionValue}>
              <span className={styles.missionIcon}>💡</span>
              <span>Innovation driven</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
