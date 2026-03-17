import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const NAV_ROUTES = [
  "/app",
  "/app/exercises",
  "/app/dr-apex",
  "/app/progress",
  "/app/profile",
];

const SWIPE_THRESHOLD = 60; // minimum px to trigger navigation
const SWIPE_VELOCITY_THRESHOLD = 0.3; // px/ms
const VERTICAL_THRESHOLD = 60; // if vertical movement > this, ignore swipe

export function useSwipeNavigation() {
  const [location, navigate] = useLocation();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only track single-finger touches
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (
        touchStartX.current === null ||
        touchStartY.current === null ||
        touchStartTime.current === null
      )
        return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const deltaTime = Date.now() - touchStartTime.current;
      const velocity = Math.abs(deltaX) / deltaTime;

      // Reset
      touchStartX.current = null;
      touchStartY.current = null;
      touchStartTime.current = null;

      // Ignore mostly-vertical swipes (scrolling)
      if (Math.abs(deltaY) > VERTICAL_THRESHOLD) return;

      // Must meet distance or velocity threshold
      if (
        Math.abs(deltaX) < SWIPE_THRESHOLD &&
        velocity < SWIPE_VELOCITY_THRESHOLD
      )
        return;

      // Find current route index
      const currentIndex = NAV_ROUTES.findIndex((r) => {
        if (r === "/app") return location === "/app";
        return location.startsWith(r);
      });

      if (currentIndex === -1) return;

      // Swipe left → go to next page
      if (deltaX < 0 && currentIndex < NAV_ROUTES.length - 1) {
        navigate(NAV_ROUTES[currentIndex + 1]);
      }
      // Swipe right → go to previous page
      else if (deltaX > 0 && currentIndex > 0) {
        navigate(NAV_ROUTES[currentIndex - 1]);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [location, navigate]);
}
