import { BrowserRouter, Navigate, Route, Routes, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

function VideoBackground() {
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
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute left-0 right-0 bottom-0 top-[300px] h-[calc(100%-300px)] w-full object-cover"
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        style={{ opacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
    </div>
  );
}

function LandingPage() {
  const menuItems = [
    { label: "Home", active: true },
    { label: "Collection" },
    { label: "Our Story" },
    { label: "Journal" },
    { label: "Visit Us" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      <VideoBackground />

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Link
            to="/"
            className="font-display text-3xl tracking-tight text-black transition-opacity hover:opacity-80"
          >
            Tulip<sup className="text-[0.5em] align-super">®</sup>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`text-sm transition-colors hover:text-black ${
                  item.active ? "text-black" : "text-[#6F6F6F]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link
            to="/signup"
            className="rounded-full bg-black px-6 py-2.5 text-sm text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Explore the Collection
          </Link>
        </header>

        <main className="flex flex-col items-center justify-center px-6 pb-40 pt-[calc(8rem-75px)] text-center">
          <h1 className="max-w-7xl animate-fade-rise font-display text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-black sm:text-7xl md:text-8xl">
            Flowers, <span className="text-[#6F6F6F] italic">arranged</span> like
            it <span className="text-[#6F6F6F] italic">matters.</span>
          </h1>

          <p className="mt-8 max-w-2xl animate-fade-rise-delay text-base leading-relaxed text-[#6F6F6F] sm:text-lg">
            Tulip composes every bouquet by hand, the day you collect it. No
            pre-made stock, no wholesale shortcuts — just arrangements worth
            building a moment around.
          </p>

          <Link
            to="/signup"
            className="mt-12 animate-fade-rise-delay-2 rounded-full bg-black px-14 py-5 text-base text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Begin Journey
          </Link>

          <p className="mt-6 text-sm text-[#6F6F6F]">
            No account yet?{" "}
            <Link to="/signup" className="text-black underline-offset-4 hover:underline">
              Sign up
            </Link>{" "}
            or{" "}
            <Link to="/login" className="text-black underline-offset-4 hover:underline">
              log in
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
