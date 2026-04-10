import Navbar from "@/components/home/NavBar";
import HeroSection from "@/components/home/Hero";
import RoleCards from "@/components/home/RoleCard";
import LiveJobs from "@/components/home/LiveJobs";
import HowItWorks from "@/components/home/HowItWorks";
import GettingStarted from "@/components/home/GetStarted";
import WhatHappensNext from "@/components/home/WhatHappensNext";
import Differentiation from "@/components/home/Differntiation";
import ProductDepth from "@/components/home/ProductDepth";
import TrustSection from "@/components/home/Trust";
import WhatsAppCTA from "@/components/home/WhatsappCTA";
import UrgencyBanner from "@/components/home/UrgencyBanner";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/home/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const HomePage = () => {
  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
    const [isSolutionsModalOpen, setIsSolutionsModalOpen] = useState(false);
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isCareersModalOpen, setIsCareersModalOpen] = useState(false);
    const [isHelpCenterModalOpen, setIsHelpCenterModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">

      {/* 1. Navbar */}
      <Navbar />

      <main>

        {/* 2. Hero */}
        <HeroSection />

        {/* 3. Role Selection (Decision Point) */}
        <RoleCards />

        {/* 4. Live Jobs (Product Proof) */}
        <LiveJobs />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Getting Started */}
        <GettingStarted />

        {/* 7. What Happens Next */}
        <WhatHappensNext />

        {/* 8. Differentiation */}
        <Differentiation />

        {/* 9. Product Depth */}
        <ProductDepth />

        {/* 10  . Trust Section */}
        <TrustSection />

        {/* 11. WhatsApp CTA (Growth Lever) */}
        <WhatsAppCTA />

        {/* 12. Urgency Banner */}
        <UrgencyBanner />

        {/* 13. Final CTA */}
        <FinalCTA />

      </main>

      {/* 14  . Footer */}
      <Footer
        handleLogoClick={handleLogoClick}
        setIsFeaturesModalOpen={setIsFeaturesModalOpen}
        setIsSolutionsModalOpen={setIsSolutionsModalOpen}
        setIsDemoModalOpen={setIsDemoModalOpen}
        setIsAboutModalOpen={setIsAboutModalOpen}
        setIsCareersModalOpen={setIsCareersModalOpen}
        setIsHelpCenterModalOpen={setIsHelpCenterModalOpen}
        setIsContactModalOpen={setIsContactModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
      />

    </div>
  );
};

export default HomePage;