import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CINEMATIC } from "@/components/landing/landingContent";
import { cn } from "@/lib/utils";
import type { ContentLanguage } from "@/types/curriculum";

const SEEN_KEY = "academySeniorEntranceSeen";
const LOBBY_PRELOAD_LEAD_S = 2;
const ARRIVAL_LEAD_S = 0.85;
const LOBBY_UI_DELAY_MS = 700;

export type EntrancePhase = "gate" | "starting" | "cinematic" | "lobby";

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, "true");
  } catch {
    // Private browsing can block storage. The visit still completes.
  }
}

export function AcademyEntrance({
  languagePreference,
}: {
  languagePreference: ContentLanguage;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const enterLock = useRef(false);
  const videoFailed = useRef(false);
  const dissolving = useRef(false);
  const [phase, setPhase] = useState<EntrancePhase>("gate");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [approaching, setApproaching] = useState(false);
  const [dissolved, setDissolved] = useState(false);
  const [armLobby, setArmLobby] = useState(false);
  const [interfaceVisible, setInterfaceVisible] = useState(false);

  const arrive = useCallback(() => {
    dissolving.current = false;
    setDissolved(false);
    setPhase("lobby");
  }, []);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduce);
    if (alreadySeen()) {
      setArmLobby(true);
      setPhase("lobby");
      setInterfaceVisible(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preload = () => {
      video.preload = "auto";
    };
    const idle = window.requestIdleCallback?.(preload);
    const timer = window.setTimeout(preload, 400);
    return () => {
      if (typeof idle === "number") window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (phase === "lobby") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "lobby") return;
    rememberSeen();
    if (interfaceVisible) return;
    const delay = reduceMotion ? 0 : LOBBY_UI_DELAY_MS;
    const timer = window.setTimeout(() => setInterfaceVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [interfaceVisible, phase, reduceMotion]);

  const beginFilm = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoFailed.current) {
      arrive();
      return;
    }
    setPhase("cinematic");
    void video.play().catch(() => arrive());
  }, [arrive]);

  const enterAcademy = useCallback(() => {
    if (enterLock.current || phase !== "gate") return;
    enterLock.current = true;
    setApproaching(false);

    if (reduceMotion || videoFailed.current) {
      setArmLobby(true);
      arrive();
      return;
    }

    setPhase("starting");
    const video = videoRef.current;
    if (!video) {
      arrive();
      return;
    }
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      beginFilm();
      return;
    }
    const onReady = () => beginFilm();
    const onFail = () => {
      videoFailed.current = true;
      arrive();
    };
    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("error", onFail, { once: true });
  }, [arrive, beginFilm, phase, reduceMotion]);

  const onTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || phase !== "cinematic" || dissolving.current) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= LOBBY_PRELOAD_LEAD_S) setArmLobby(true);
    if (remaining > ARRIVAL_LEAD_S) return;
    dissolving.current = true;
    setDissolved(true);
  }, [phase]);

  const replay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    enterLock.current = false;
    videoFailed.current = false;
    dissolving.current = false;
    setDissolved(false);
    setArmLobby(false);
    setInterfaceVisible(false);
    setApproaching(false);
    setPhase("gate");
  }, []);

  const showGatePlate = phase !== "lobby";
  const showFilm = phase === "cinematic" && !dissolved;
  const showLobby = dissolved || phase === "lobby";
  const gateUi = phase === "gate";

  return (
    <section
      aria-label="AcadeMY Senior entrance"
      className={cn(
        "relative h-dvh w-full overflow-hidden bg-[#070b14]",
        phase !== "lobby" && "fixed inset-0 z-[60]",
      )}
      id="home"
      data-journey-section="home"
    >
      <div className="absolute inset-0">
        <img
          alt="The closed gates of AcadeMY Senior"
          className={cn(
            "academy-media transition-opacity duration-200 ease-out",
            showGatePlate ? "opacity-100" : "opacity-0",
          )}
          decoding="sync"
          fetchPriority="high"
          height={720}
          src={CINEMATIC.gate}
          width={1280}
        />
      </div>
      <img
        alt=""
        className={cn(
          "academy-media",
          showLobby ? "opacity-100" : "opacity-0",
          phase === "lobby" && !reduceMotion && "academy-lobby-push",
        )}
        decoding="async"
        height={720}
        src={armLobby ? CINEMATIC.lobby : undefined}
        width={1280}
      />
      <video
        ref={videoRef}
        className={cn(
          "academy-media ease-out",
          dissolved
            ? "opacity-0 transition-opacity duration-[800ms]"
            : "transition-opacity duration-200",
          !dissolved && showFilm ? "opacity-100" : !dissolved && "opacity-0",
        )}
        muted
        playsInline
        preload="none"
        onEnded={arrive}
        onError={() => {
          videoFailed.current = true;
          if (phase === "starting" || phase === "cinematic") arrive();
        }}
        onTimeUpdate={onTimeUpdate}
      >
        <source src={CINEMATIC.entry} type="video/webm" />
        <source src={CINEMATIC.entryMp4} type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14]/75 via-[#070b14]/20 to-[#070b14]/45 transition-opacity duration-700 ease-out",
          phase === "cinematic" && "opacity-0",
          approaching && phase === "gate" && "opacity-70",
          phase === "lobby" && "opacity-80",
        )}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgb(0_0_0/0.45)]" />

      <div
        inert={!gateUi}
        className={cn(
          "absolute inset-0 z-10 transition-opacity duration-300 ease-out",
          gateUi ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex items-start justify-between px-5 pt-5 md:px-10 md:pt-8">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#f4f1ea]">
            AcadeMY
            <span className="mt-1 block text-[10px] tracking-[0.42em] text-[#e8b84a]">SENIOR</span>
          </p>
          <Link
            className="inline-flex min-h-11 items-center text-[11px] font-semibold tracking-[0.22em] text-[#f4f1ea]/80 underline-offset-4 hover:text-[#f4f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8b84a]"
            search={{ next: "/home" }}
            to="/login"
          >
            SIGN IN
          </Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-12">
          <div className="max-w-xl">
            <h1 className="text-[2rem] font-semibold leading-none tracking-[0.08em] text-[#f4f1ea] sm:text-5xl">
              YOUR NEXT CHAPTER
              <span className="mt-2 block tracking-[0.14em]">STARTS HERE</span>
            </h1>
            <p className="mt-4 text-sm tracking-[0.08em] text-[#f4f1ea]/75 sm:text-base">
              Step inside. Learn. Compete. Grow.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="senior-cta inline-flex min-h-11 items-center rounded-full px-7 py-3 text-[12px] font-semibold tracking-[0.18em] transition-transform duration-300 ease-out hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-80"
                disabled={phase !== "gate"}
                type="button"
                onClick={enterAcademy}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) {
                    setApproaching(true);
                  }
                }}
                onMouseLeave={() => setApproaching(false)}
              >
                {phase === "starting" ? "ENTERING" : "ENTER ACADEMY"}
              </button>
              <Link
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-[#070b14]/45 px-6 py-3 text-[12px] font-semibold tracking-[0.18em] text-[#f4f1ea] backdrop-blur-md transition-colors hover:border-[#e8b84a]/50"
                search={{ next: "/home" }}
                to="/login"
              >
                SIGN IN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        inert={!interfaceVisible}
        className={cn(
          "absolute inset-0 z-10 transition-opacity duration-700 ease-out",
          interfaceVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav
          aria-label="Academy"
          className="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 bg-gradient-to-b from-[#070b14]/80 to-transparent px-5 pt-5 pb-6 md:px-10 md:pt-8"
        >
          <p className="shrink-0 text-[11px] font-semibold tracking-[0.28em] text-[#f4f1ea]">
            AcadeMY <span className="text-[#e8b84a]">SENIOR</span>
          </p>
          <div className="hidden items-center gap-6 lg:flex">
            <Link className="text-[11px] font-semibold tracking-[0.16em] text-[#f4f1ea]/75 hover:text-[#f4f1ea]" params={{ lang: languagePreference }} to="/f4/$lang">
              Subjects
            </Link>
            <Link className="text-[11px] font-semibold tracking-[0.16em] text-[#f4f1ea]/75 hover:text-[#f4f1ea]" to="/leaderboard">
              Leaderboard
            </Link>
            <Link className="text-[11px] font-semibold tracking-[0.16em] text-[#f4f1ea]/75 hover:text-[#f4f1ea]" to="/community">
              Student Council
            </Link>
            <a className="text-[11px] font-semibold tracking-[0.16em] text-[#f4f1ea]/75 hover:text-[#f4f1ea]" href="#activities">
              Activities
            </a>
            <a className="text-[11px] font-semibold tracking-[0.16em] text-[#f4f1ea]/75 hover:text-[#f4f1ea]" href="#finale">
              About Senior
            </a>
          </div>
          <Link
            className="inline-flex min-h-11 items-center text-[11px] font-semibold tracking-[0.18em] text-[#f4f1ea]"
            search={{ next: "/home" }}
            to="/login"
          >
            SIGN IN
          </Link>
        </nav>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-12">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.32em] text-[#e8b84a]">WELCOME TO</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[0.12em] text-[#f4f1ea] sm:text-6xl">
              ACADEMY SENIOR
            </h1>
            <p className="mt-4 text-sm tracking-[0.06em] text-[#f4f1ea]/75 sm:text-base">
              Your journey starts here.
            </p>
            <a
              className="senior-cta mt-6 inline-flex min-h-11 items-center rounded-full px-7 py-3 text-[12px] font-semibold tracking-[0.16em]"
              href="#learning"
            >
              CONTINUE TO ACADEMY
            </a>
            <div className="mt-6 flex gap-4 overflow-x-auto lg:hidden">
              <Link className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-[#f4f1ea]/80" params={{ lang: languagePreference }} to="/f4/$lang">
                Subjects
              </Link>
              <Link className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-[#f4f1ea]/80" to="/leaderboard">
                Leaderboard
              </Link>
              <Link className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-[#f4f1ea]/80" to="/community">
                Student Council
              </Link>
              <a className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-[#f4f1ea]/80" href="#activities">
                Activities
              </a>
            </div>
          </div>
          <button
            className="mt-8 text-[10px] font-semibold tracking-[0.22em] text-[#f4f1ea]/55 underline-offset-4 hover:text-[#f4f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8b84a]"
            type="button"
            onClick={replay}
          >
            REPLAY ENTRANCE
          </button>
        </div>
      </div>
    </section>
  );
}
