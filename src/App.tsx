import React, { useState, useCallback } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { VideoScrollSequence } from './components/VideoScrollSequence';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { JourneyIndicator } from './components/JourneyIndicator';
import { JourneyTimeline } from './sections/JourneyTimeline';
import { Services } from './components/Services';
import { About } from './components/About';
import { Reviews } from './components/Reviews';
import { QuoteForm } from './components/QuoteForm';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { ServiceItem } from './data/siteData';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll
  useSmoothScroll();

  // Video load/readiness state — replaces the old image-preload progress
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  const handleReady = useCallback((ready: boolean) => {
    setIsLoading(!ready);
  }, []);

  const handleLoadProgress = useCallback((pct: number) => {
    setLoadProgress(pct);
  }, []);

  // Scroll state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  // Callback from VideoScrollSequence on scrub tick
  const handleProgressUpdate = useCallback((progress: number) => {
    setScrollProgress(progress);

    if (progress < 0.12) {
      setActiveSection('hero');
    } else if (progress < 0.88) {
      setActiveSection('journey');
    } else {
      setActiveSection('delivery');
    }
  }, []);

  // Smooth scroll to Quote Form
  const scrollToQuote = () => {
    const quoteEl = document.getElementById('contact');
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Click on a specific milestone in the JourneyIndicator
  const handleSelectMilestone = (targetProgress: number) => {
    const scrollTrack = document.getElementById('cinematic-scroll-track');
    if (!scrollTrack) return;

    const trackTop = scrollTrack.offsetTop;
    const trackHeight = scrollTrack.offsetHeight - window.innerHeight;
    const targetScrollY = trackTop + targetProgress * trackHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service.title);
    scrollToQuote();
  };

  return (
    <div className="ns-app" style={{ backgroundColor: '#050505', minHeight: '100vh', position: 'relative' }}>
      {/* User-Provided Amber Nebula Cloud Background Layer */}
      <div className="ambient-bg-layer" />

      {/* Branded Loading Splash Screen */}
      <LoadingScreen progress={loadProgress} isReady={!isLoading} />

      {/* Fixed Luxury Navigation Bar */}
      <Navbar onQuoteClick={scrollToQuote} activeSection={activeSection} />

      {/* Right-Side Journey Progress Indicator (All 12 Stages) */}
      <JourneyIndicator
        currentProgress={scrollProgress}
        onSelectMilestone={handleSelectMilestone}
      />

      {/* Pinned <video> Scrubber (Framed on Right Side) — replaces the JPG frame canvas */}
      <VideoScrollSequence
        srcMp4="/video/journey.mp4"
        srcWebm="/video/journey.webm"
        onProgressUpdate={handleProgressUpdate}
        onLoadProgress={handleLoadProgress}
        onReady={handleReady}
      />

      {/* The 12-Stage Interactive Scroll Journey (Framed on Left Side) */}
      <JourneyTimeline
        progress={scrollProgress}
        onQuoteClick={scrollToQuote}
        onVideoClick={() => setVideoModalOpen(true)}
      />

      {/* Supporting Sections with Unified Dark Automotive Styling */}
      <Services onSelectService={handleSelectService} />
      <About />
      <Reviews />
      <QuoteForm preselectedService={selectedService} />
      <Footer />

      {/* Video / Interactive Tour Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onQuoteClick={scrollToQuote}
      />
    </div>
  );
};
