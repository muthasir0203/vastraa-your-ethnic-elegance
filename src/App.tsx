import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/components/SupabaseAuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import BecomeSeller from "./pages/BecomeSeller";
import Rewards from "./pages/Rewards";
import GiftCards from "./pages/GiftCards";
import Notifications from "./pages/Notifications";
import DownloadApp from "./pages/DownloadApp";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Seed from "./pages/Seed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/seed" element={<Seed />} />
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/account/orders"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/orders/:id"
                      element={
                        <ProtectedRoute>
                          <OrderDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/seller/register" element={<BecomeSeller />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route
                      path="/account/notifications"
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/download" element={<DownloadApp />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
