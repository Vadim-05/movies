import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalSlider(itemCount: number) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateEdges);
    };

    updateEdges();
    track.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [updateEdges, itemCount]);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return {
    trackRef,
    canScrollPrev,
    canScrollNext,
    scrollByPage,
  };
}