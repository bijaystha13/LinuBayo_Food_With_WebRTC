import Navbar from "./components/Navbar/Navbar";
import { LoadingProvider } from "@/app/shared/Context/LoadingContext";
import { AuthProvider } from "./shared/Context/AuthProvider";
import "./globals.css";
import RouteGuard from "./components/HOC/RouteGuard";
import { CartProvider } from "./shared/Context/CartContext";

export const metadata = {
  title: "LinuBayo Food",
  description: "Delicious food delivery with amazing user experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <LoadingProvider>
              <Navbar />
              <RouteGuard>
                <main>
                  <div id="modal-hook"></div>
                  <div id="backdrop-hook"></div>
                  <div id="root"></div>
                  {children}
                </main>
              </RouteGuard>
            </LoadingProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
