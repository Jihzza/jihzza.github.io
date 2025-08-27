// src/components/layout/NavigationBar.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import OctagonAvatar from "../common/OctagonAvatar";

/**
 * Tailwind-like responsive value helper.
 * Example: useBreakpointValue({ base: 28, md: 40, lg: 44 })
 */
function useBreakpointValue(values) {
  const [val, setVal] = useState(values.base);

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (lg.matches) setVal(values.lg ?? values.md ?? values.base);
      else if (md.matches) setVal(values.md ?? values.base);
      else setVal(values.base);
    };

    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, [values]);

  return val;
}

export default function NavigationBar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const avatarSrc = user?.user_metadata?.avatar_url || "";

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: CalendarIcon, label: "Calendar", path: "/calendar" },
    { icon: ChatBubbleLeftRightIcon, label: "Chat", path: "/chat" },
    { icon: Cog6ToothIcon, label: "Settings", path: "/settings" },
    { icon: UserIcon, label: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    const nav = document.getElementById("bottom-nav");
    if (!nav) return;

    const read = () => {
      const vv = window.visualViewport;
      const vb = (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight);
      const r = nav.getBoundingClientRect();
      const atBottom = Math.abs(vb - r.bottom) < 1;
      const pos = getComputedStyle(nav).position;
      void atBottom;
      void pos;
    };

    const ro = new ResizeObserver(read);
    ro.observe(nav);
    window.addEventListener("resize", read);
    window.visualViewport?.addEventListener("resize", read);
    window.addEventListener("scroll", read, { passive: true });
    window.visualViewport?.addEventListener("scroll", read);
    read();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("resize", read);
      window.removeEventListener("scroll", read);
      window.visualViewport?.removeEventListener("scroll", read);
    };
  }, []);

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleItemClick = (item) => {
    const targetPath = item.path;
    if (!targetPath) return;
    if (typeof onNavigate === "function") onNavigate(targetPath);
    else navigate(targetPath);
  };

  // Match heroicon sizes responsively
  const avatarSize = useBreakpointValue({ base: 24, md: 36, lg: 24 });

  return (
    <nav
      id="bottom-nav"
      className="w-full sticky bottom-0 left-0 right-0 bg-black z-50 "
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around items-center w-full lg:w-[80%] h-14 md:h-19 mx-auto lg:h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isProfile = item.label === "Profile";
          const showAvatar = isProfile && !!avatarSrc;

          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center justify-center w-20 h-full gap-1 md:gap-1.5 lg:gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 rounded-lg"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              type="button"
            >
              {showAvatar ? (
                // Reserve space so the icon↔label gap stays consistent
                <div
                  className="grid place-items-center"
                  style={{ width: avatarSize, height: avatarSize }}
                >
                  <OctagonAvatar
                    src={avatarSrc}
                    alt="Your profile"
                    size={avatarSize}
                    ringWidth={1}
                    gap={2}
                    ringColor={active ? "#FACC15" : "#9CA3AF"}
                    className={[
                      "transition-transform duration-150",
                      active ? "scale-110" : ""
                    ].join(" ")}
                  />
                </div>
              ) : (
                <div className="grid place-items-center h-7 w-7 md:h-9 md:w-9 lg:h-7 lg:w-7">
                  <Icon
                    className={[
                      "transition-transform duration-150",
                      active ? "text-yellow-400 scale-110" : "text-gray-400",
                    ].join(" ")}
                  />
                </div>
              )}

              <span
                className={[
                  "text-xs md:text-sm lg:text-xs font-medium transition-opacity",
                  active ? "text-yellow-400 opacity-100" : "text-gray-400 opacity-80",
                ].join(" ")}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
