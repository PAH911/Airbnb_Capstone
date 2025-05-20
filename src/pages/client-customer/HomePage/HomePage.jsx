import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import HeroSection from "./HeroSection";
import FeaturedRoomsSection from "./FeaturedRoomsSection";
import FeaturedLocationsSection from "./FeaturedLocationsSection";
import ServicesSection from "./ServicesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import NewsletterSection from "./NewsletterSection";
import * as userService from "../../../services/userService";
import { login, register } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user info on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const userRes = await userService.getCurrentUser(token);
          setUser(userRes);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Example login/register handlers (for demo, real logic should be in Login/Register page)
  const handleLogin = async (email, password) => {
    try {
      const res = await login({ email, password });
      localStorage.setItem("accessToken", res.token);
      setUser(res.user);
      navigate("/profile");
    } catch (err) {
      alert("Đăng nhập thất bại");
    }
  };

  const handleRegister = async (data) => {
    try {
      await register(data);
      alert("Đăng ký thành công!");
    } catch (err) {
      alert("Đăng ký thất bại");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedRoomsSection />
      <FeaturedLocationsSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
