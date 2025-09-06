// app/layout.js
import SharedFoodAPI from "./components/FoodsComponents/SharedFoodAPI";
import Navbar from "./components/Navbar/Navbar";
import { LoadingProvider } from "@/app/shared/Context/LoadingContext";
import { AuthProvider } from "./shared/Context/AuthProvider"; // Make sure this path is correct
import "./globals.css";

export const metadata = {
  title: "LinuBayo Food",
  description: "Delicious food delivery with amazing user experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LoadingProvider>
            <Navbar />
            <main>
              <div id="modal-hook"></div>
              <div id="backdrop-hook"></div>
              <div id="root"></div>
              {children}
            </main>
            {/* <SharedFoodAPI /> */}
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
