import Image from "next/image";
import styles from "./page.module.css";
import FoodsList from "./components/FoodsComponents/FoodsList";

const sampleFoods = [
  {
    _id: "1",
    name: "Cheeseburger",
    description: "Juicy grilled beef patty with cheddar cheese.",
    price: 8.99,
    image: "uploads/images/fast-food/boa.jpg",
    category: "Fast Food",
  },
  // Add more items...
];

export default function Home() {
  return (
    <div className={styles.page}>
      <FoodsList foods={sampleFoods} />
    </div>
  );
}
