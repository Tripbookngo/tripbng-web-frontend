// useNavbarLogic.js
import { useEffect, useRef, useState } from "react";

export function useNavbarLogic() {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [showTabsInNav, setShowTabsInNav] = useState(false);
  const bookingTabsRef = useRef(null);

  useEffect(() => {
    const bookingTabsContainer = document.getElementById("booking-tabs-container");
    if (bookingTabsContainer) {
      bookingTabsRef.current = bookingTabsContainer;
    }

    let showTabsTimeout;

    const handleScroll = () => {
      setIsNavFixed(window.scrollY > 10);

      if (bookingTabsRef.current) {
        const rect = bookingTabsRef.current.getBoundingClientRect();

        if (rect.bottom < 100) {
          clearTimeout(showTabsTimeout);
          showTabsTimeout = setTimeout(() => {
            setShowTabsInNav(true);
          }, 500);
        } else {
          clearTimeout(showTabsTimeout);
          setShowTabsInNav(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(showTabsTimeout);
    };
  }, []);

  return { isNavFixed, showTabsInNav };
}
