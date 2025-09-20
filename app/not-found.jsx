import Link from "next/link";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.floatingFood}>🍕</div>
        <div className={styles.floatingFood}>🍔</div>
        <div className={styles.floatingFood}>🍜</div>
        <div className={styles.floatingFood}>🥗</div>
        <div className={styles.floatingFood}>🍰</div>
        <div className={styles.floatingFood}>🍳</div>
      </div>

      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.plate}>
          <div className={styles.plateInner}>
            <div className={styles.sadFace}>😕</div>
          </div>
        </div>

        <h1 className={styles.title}>Route Not Found</h1>
        <p className={styles.description}>
          The page you're looking for doesn't exist on our menu. It might have
          been moved, deleted, or the URL might be incorrect.
        </p>

        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Try these instead:</h3>
          <ul className={styles.suggestionsList}>
            <li>
              🏠 Go back to our delicious{" "}
              <Link href="/" className={styles.link}>
                Homepage
              </Link>
            </li>
            <li>
              🍽️ Browse our{" "}
              <Link href="/menu" className={styles.link}>
                Full Menu
              </Link>
            </li>
            <li>
              🔍 Use our{" "}
              <Link href="/search" className={styles.link}>
                Search
              </Link>{" "}
              to find your craving
            </li>
            <li>
              📞{" "}
              <Link href="/contact" className={styles.link}>
                Contact us
              </Link>{" "}
              if you need help
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <span className={styles.btnIcon}>🏠</span>
            Back to Home
          </Link>
          <Link href="/menu" className={styles.secondaryBtn}>
            <span className={styles.btnIcon}>🍽️</span>
            View Menu
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <p>Still hungry? Our chefs are cooking up something amazing!</p>
      </div>
    </div>
  );
};

export default NotFound;
