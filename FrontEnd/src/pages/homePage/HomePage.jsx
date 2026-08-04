import { Helmet } from "react-helmet-async";
import Navbar from "@/components/home/Navbar";
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
import { Activity } from "lucide-react";
import LiveTicker from "@/components/home/ActivityTicker";
import { FeaturesModal } from "@/components/onboarding/FeatureModal";
import { SolutionsModal } from "@/components/onboarding/SolutionModal";
import { DemoModal } from "@/components/onboarding/DemoModal";
import { AboutModal } from "@/components/onboarding/AboutModal";
import { CareersModal } from "@/components/onboarding/CareerModal";
import { HelpCenterModal } from "@/components/onboarding/HelpModal";
import { ContactModal } from "@/components/onboarding/ContactModal";
import { TermsModal } from "@/components/onboarding/Terms&conditionModal";
const HomePage = () => {

  const navigate=useNavigate();
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
      <Helmet prioritizeSeoTags>
        {/* Title */}
        <title key="title">
          Hire Freshers in India | Campus & Off-Campus Hiring | RawRecruit
        </title>

        {/* Meta Description */} 
        <meta
        key="description"
        name="description"
        content="Hire freshers through on-campus, pool-campus, and off-campus hiring. Connect with colleges and manage recruitment easily across India."
        />

        {/* Canonical */}

        <link key="canonical" rel="canonical" href="https://rawrecruit.in/" />

        {/* Open Graph */} <meta key="og:title" property="og:title" content="Hire Freshers in India | RawRecruit" /> 
        <meta key="og:description"
        property="og:description"
        content="Unified platform for campus hiring, internships, and fresher recruitment across India."
        /> <meta key="og:type" property="og:type" content="website" /> <meta key="og:url" property="og:url" content="https://rawrecruit.in/" /> <meta key="og:image" property="og:image" content="https://rawrecruit.in/logo1.png" />

        {/* Twitter */} <meta key="twitter:card" name="twitter:card" content="summary_large_image" /> 
        <meta key="twitter:title" name="twitter:title" content="Hire Freshers in India | RawRecruit" /> 
        <meta key="twitter:description"
        name="twitter:description"
        content="Find jobs or hire freshers using on-campus, pool-campus, and off-campus hiring."
        /> 
        <meta key="twitter:image" name="twitter:image" content="https://rawrecruit.in/logo1.png" /> 
      </Helmet>
      {/* 1. Navbar */}
      <Navbar />

      <main>

        {/* 2. Hero */}
        <HeroSection />
        <LiveTicker />
        {/* 3. Role Selection (Decision Point) */}
        <RoleCards />

        {/* 4. Live Jobs (Product Proof) */}
        <LiveJobs />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Getting Started */}
        <GettingStarted />

        {/* 7. What Happens Next */}
        {/* <WhatHappensNext /> */}

        {/* 8. Differentiation */}
        <Differentiation />

        {/* 9. Product Depth */}
        <ProductDepth />

        {/* 10  . Trust Section */}
        {/* <TrustSection /> */}

        {/* 11. WhatsApp CTA (Growth Lever) */}
        {/* <WhatsAppCTA /> */}

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
      {/* Modals */}

      <FeaturesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
      />

      <SolutionsModal
        isOpen={isSolutionsModalOpen}
        onClose={() => setIsSolutionsModalOpen(false)}
      />

      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <CareersModal
        isOpen={isCareersModalOpen}
        onClose={() => setIsCareersModalOpen(false)}
      />

      <HelpCenterModal
        isOpen={isHelpCenterModalOpen}
        onClose={() => setIsHelpCenterModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

    </div>
  );
};

export default HomePage;