export type JourneyBreakpoint = "desktop" | "tablet" | "mobile";

export type PoseName = "heroRest" | "heroLift" | "heroPortal" | "heroVanish";

export type JourneyPose = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
};

export type PoseFrame = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

export const JOURNEY_SCRUB = 1.05;

export function detectBreakpoint(width: number): JourneyBreakpoint {
  if (width >= 1024) return "desktop";
  if (width >= 768) return "tablet";
  return "mobile";
}

export function contentFrame(root: HTMLElement): PoseFrame {
  const rect = root.getBoundingClientRect();
  return {
    originX: Math.max(rect.left, 0),
    originY: 0,
    width: Math.max(rect.width, 1),
    height: window.innerHeight,
  };
}

/**
 * Viewport-fraction poses relative to the journey content frame
 * (sidebar-aware). Corridor stays in the right-hand planetary space
 * so copy and CTAs on the left are never covered.
 */
const POSES: Record<JourneyBreakpoint, Record<PoseName, JourneyPose>> = {
  desktop: {
    heroRest: { x: 0.64, y: 0.58, scale: 0.9, rotate: -4, opacity: 0.95 },
    heroLift: { x: 0.58, y: 0.44, scale: 0.58, rotate: -1, opacity: 0.72 },
    heroPortal: { x: 0.54, y: 0.32, scale: 0.3, rotate: 3, opacity: 0.32 },
    heroVanish: { x: 0.52, y: 0.26, scale: 0.1, rotate: 5, opacity: 0 },
  },
  tablet: {
    heroRest: { x: 0.68, y: 0.62, scale: 0.7, rotate: -3, opacity: 0.93 },
    heroLift: { x: 0.62, y: 0.48, scale: 0.46, rotate: 0, opacity: 0.68 },
    heroPortal: { x: 0.58, y: 0.36, scale: 0.24, rotate: 3, opacity: 0.3 },
    heroVanish: { x: 0.56, y: 0.3, scale: 0.1, rotate: 4, opacity: 0 },
  },
  mobile: {
    heroRest: { x: 0.74, y: 0.72, scale: 0.48, rotate: -3, opacity: 0.9 },
    heroLift: { x: 0.7, y: 0.56, scale: 0.32, rotate: 0, opacity: 0.58 },
    heroPortal: { x: 0.66, y: 0.42, scale: 0.18, rotate: 2, opacity: 0.24 },
    heroVanish: { x: 0.64, y: 0.36, scale: 0.08, rotate: 4, opacity: 0 },
  },
};

export function getPose(breakpoint: JourneyBreakpoint, name: PoseName): JourneyPose {
  return POSES[breakpoint][name];
}

export function posePixels(pose: JourneyPose, frame: PoseFrame) {
  return {
    x: frame.originX + pose.x * frame.width,
    y: frame.originY + pose.y * frame.height,
    scale: pose.scale,
    rotate: pose.rotate,
    opacity: pose.opacity,
  };
}

export const PARALLAX: Record<
  JourneyBreakpoint,
  { bg: number; mid: number; card: number; fg: number; learning: number }
> = {
  desktop: { bg: 8, mid: 15, card: 22, fg: 28, learning: 5 },
  tablet: { bg: 5, mid: 10, card: 14, fg: 18, learning: 4 },
  mobile: { bg: 3, mid: 6, card: 8, fg: 10, learning: 3 },
};
