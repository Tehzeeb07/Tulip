import { BrowserRouter, Route, Routes, Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Bouquets from "./pages/Bouquets";
import Accessories from "./pages/Accessories";
import ProductDetail from "./pages/ProductDetail";
import Occasions from "./pages/Occasions";
import OccasionDetail from "./pages/OccasionDetail";
import CustomOrder from "./pages/CustomOrder";
import Reviews from "./pages/Reviews";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import RollingTextButton from "./components/RollingTextButton";
import PageCurtain from "./components/PageCurtain";
import { PageTransitionProvider } from "./context/PageTransitionContext";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

function VideoBackground({ blur = false }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const fadeDuration = 0.5;

    const updateOpacity = () => {
      const duration = video.duration || 0;
      const currentTime = video.currentTime || 0;
      if (!duration || !Number.isFinite(duration)) {
        setOpacity(1);
        rafRef.current = requestAnimationFrame(updateOpacity);
        return;
      }

      const startProgress = Math.min(currentTime / fadeDuration, 1);
      const endProgress = Math.min((duration - currentTime) / fadeDuration, 1);
      const fadeIn = startProgress;
      const fadeOut = endProgress;
      const nextOpacity = Math.min(fadeIn, fadeOut);

      setOpacity((prev) => (Math.abs(prev - nextOpacity) > 0.01 ? nextOpacity : prev));
      rafRef.current = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      setOpacity(0);
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, 100);
    };

    const handleLoadedData = () => {
      setOpacity(0);
      void video.play().catch(() => {});
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", handleLoadedData);
    rafRef.current = requestAnimationFrame(updateOpacity);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", handleLoadedData);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
          blur ? "scale-110 blur-xl brightness-95" : "scale-100 blur-0 brightness-100"
        }`}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        style={{ opacity }}
      />
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          blur
            ? "bg-white/40 backdrop-blur-md"
            : "bg-gradient-to-b from-white/30 via-transparent to-white/60"
        }`}
      />
    </div>
  );
}

function VideoLayout() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      <VideoBackground blur={isAuth} />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link
          to="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <img src="/images/logo.png" alt="Tulip" className="h-10 w-auto" />
        </Link>

        <RollingTextButton
          to="/login"
          className="rounded-full bg-[#FD5DA8] px-8 py-3 text-base font-semibold text-white transition-shadow duration-300 hover:shadow-lg hover:shadow-[#FD5DA8]/30"
        >
          Log In
        </RollingTextButton>
      </header>

      <main className="flex flex-col items-center justify-center px-6 pb-40 pt-[calc(8rem-75px)] text-center">
        <h1
          className="max-w-7xl animate-fade-rise text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-black sm:text-7xl md:text-8xl"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Flowers, <span className="text-[#4A4A4A] italic">arranged</span> like
          it <span className="text-[#4A4A4A] italic">matters.</span>
        </h1>

        <h3 className="mt-8 max-w-2xl animate-fade-rise-delay text-lg leading-relaxed text-[#3A3A3A] sm:text-xl">
          <b>Tulip composes every bouquet by hand, the day you collect it. No
          pre-made stock, no wholesale shortcuts- just arrangements worth
          building a moment around.</b>
        </h3>

        <RollingTextButton
          to="/bouquets"
          className="mt-12 animate-fade-rise-delay-2 rounded-full bg-[#FD5DA8] px-16 py-6 text-xl font-semibold text-white transition-shadow duration-300 hover:shadow-xl hover:shadow-[#FD5DA8]/40"
        >
          Explore the Collection
        </RollingTextButton>

        <h3 className="mt-6 text-base text-[#3A3A3A]">
          New here?{" "}
          <Link to="/signup" className="text-black font-medium underline-offset-4 hover:underline">
            Create an account
          </Link>{" "}
          or{" "}
          <Link to="/login" className="text-black font-medium underline-offset-4 hover:underline">
            log in
          </Link>
        </h3>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <PageCurtain />
        <Routes>
          <Route element={<VideoLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route path="/bouquets" element={<Bouquets />} />
          <Route path="/home" element={<Bouquets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/occasions" element={<Occasions />} />
          <Route path="/occasions/:slug" element={<OccasionDetail />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </PageTransitionProvider>
    </BrowserRouter>
  );
}

export default App;
