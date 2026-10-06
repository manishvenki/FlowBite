import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every newly opened route/page starts at the top of the viewport.
 * Preserves anchor navigation (hash links) if navigating to a specific section on the same page.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    // If navigating to a hash anchor on the same page (e.g. #section), preserve browser scroll-to-element
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        prevPathnameRef.current = pathname;
        return;
      }
    }

    // When navigating between different pages/routes, instantly reset window scroll position to the top
    if (prevPathnameRef.current !== pathname || !hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    }

    prevPathnameRef.current = pathname;
  }, [pathname, search, hash]);

  return null;
};
