// src/components/layout/NavigationBar.jsx
import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";      // ← get current user
import OctagonAvatar from "../common/OctagonAvatar";

export default function NavigationBar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();                              // ← user may be null if logged out
  const avatarSrc = user?.user_metadata?.avatar_url || ""; // ← keep empty if none

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: CalendarIcon, label: "Calendar", path: "/calendar" },
    { icon: ChatBubbleLeftRightIcon, label: "Chat", path: "/chat" },
    { icon: Cog6ToothIcon, label: "Settings", path: "/settings" },
    { icon: UserIcon, label: "Profile", path: "/profile" }, // we'll replace the icon at render time if we have an avatar
  ];

  // inside NavigationBar.jsx (or the component that renders the bottom nav element)
useEffect(() => {
  const nav = document.getElementById("bottom-nav");
  if (!nav) {
    console.warn("[Nav] #bottom-nav not found — SectionCta will treat nav height as 0.");
    return;
  }
  const read = () => {
    const vv = window.visualViewport;
    const vb = (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight);
    const r = nav.getBoundingClientRect();
    const atBottom = Math.abs(vb - r.bottom) < 1;
    const pos = getComputedStyle(nav).position;
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

    if (typeof onNavigate === "function") {
      onNavigate(targetPath);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <nav
      id="bottom-nav"
      className="w-full sticky bottom-0 left-0 right-0 border-t border-gray-800 bg-black/90 backdrop-blur z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around items-center w-full h-14 md:h-16 mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isProfile = item.label === "Profile";
          const showAvatar = isProfile && !!avatarSrc;

          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center justify-center w-20 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 rounded-lg"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              type="button"
            >
              {showAvatar ? (
                <OctagonAvatar
                  src={avatarSrc}
                  alt="Your profile"
                  size={24}          // ~ h-7 / w-7
                  ringWidth={1}
                  gap={2}
                  ringColor={active ? "#FACC15" : "#9CA3AF"} // yellow-400 when active, gray-400 when inactive
                  className={active ? "scale-105 transition-transform duration-150" : "transition-transform duration-150"}
                />
              ) : (
                <Icon
                  className={[
                    "h-7 w-7 md:h-8 md:w-8 transition-transform duration-150",
                    active ? "text-yellow-400 scale-105" : "text-gray-400",
                  ].join(" ")}
                />
              )}

              <span
                className={[
                  "text-[10px] mt-0.5 md:mt-1 font-medium transition-opacity",
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
