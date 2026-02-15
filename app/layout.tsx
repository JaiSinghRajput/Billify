import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";
import { Toaster } from "sonner";
export const metadata = {
  title: {
    default: "Billify SaaS",
    template: "%s | Billify SaaS",
  },
  description: "Simple Billing for Businesses",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>

          <Toaster richColors position="top-right" />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
