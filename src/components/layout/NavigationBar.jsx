import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import OctagonAvatar from "../common/OctagonAvatar";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import logo from "../../assets/icons/CluckinsLogo.svg";
import homeIcon from "../../assets/icons/House Branco.svg";
import calendarIcon from "../../assets/icons/Calendar Branco.svg";
import settingsIcon from "../../assets/icons/Settings Branco.svg";
import profileIcon from "../../assets/icons/Profile Branco.svg";

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

function ImgIcon({ src, className, alt }) {
  return <img src={src} alt={alt ?? ""} className={`block ${className}`} />;
}

const ICON_BOX_CLASS = "h-7 w-7 md:h-8 md:w-8 lg:h-7 lg:w-7 shrink-0";
const LABEL_CLASS = "text-[10px] md:text-xs leading-none font-medium transition-opacity";
const BUTTON_CLASS = [
  "flex flex-col items-center justify-center gap-1 md:gap-1.5",
  "h-14 md:h-16 w-full focus:outline-none focus-visible:ring-2",
  "focus-visible:ring-cyan-400/70 rounded-lg",
  "cursor-pointer",
].join(" ");
const BAR_CLASS = "w-full sticky bottom-0 left-0 right-0 bg-black z-50";
const INNER_CLASS = "mx-auto grid grid-cols-5 items-center w-full lg:w-[80%]";

export default function NavigationBar({ onNavigate, isChatbotOpen, onChatClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const avatarSrc =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  // Mark which items require auth
  const navItems = useMemo(
    () => [
      { icon: homeIcon,     label: t("navigation.home"),     path: "/",          requiresAuth: false },
      { icon: calendarIcon, label: t("navigation.calendar"), path: "/calendar",  requiresAuth: true  },
      { icon: logo,         label: t("navigation.chat"),     path: "/chat",      requiresAuth: true, isLogo: true },
      { icon: settingsIcon, label: t("navigation.settings"), path: "/settings",  requiresAuth: true  },
      { icon: profileIcon,  label: t("navigation.profile"),  path: "/profile",   requiresAuth: true,  isProfile: true },
    ],
    [t, i18n.language]
  );

  // Route match helper
  const isActivePath = (base, current) => {
    if (!base) return false;
    if (base === "/") return current === "/";
    return current === base || current.startsWith(base + "/");
  };

  // Remember the "intended" selection for logged-out users
  const [ghostActivePath, setGhostActivePath] = useState(() => {
    if (!user) return sessionStorage.getItem("ghostActivePath");
    return null;
  });

  // Keep ghost in sync with auth changes
  useEffect(() => {
    if (!user) {
      const stored = sessionStorage.getItem("ghostActivePath");
      if (stored) setGhostActivePath(stored);
    } else {
      setGhostActivePath(null);
      sessionStorage.removeItem("ghostActivePath");
    }
  }, [user]);

  // Only clear ghost once the user is authenticated and actually reaches the page
  useEffect(() => {
    if (!ghostActivePath) return;
    if (user && isActivePath(ghostActivePath, location.pathname)) {
      setGhostActivePath(null);
      sessionStorage.removeItem("ghostActivePath");
    }
  }, [user, location.pathname, ghostActivePath]);

  const handleItemClick = (item) => {
    if (!item.path) return;

    const go = (p) => {
      if (typeof onNavigate === "function") onNavigate(p);
      else navigate(p);
    };

    // If logged out and the tab needs auth, show it as selected and go directly to login
    if (!user && item.requiresAuth) {
      setGhostActivePath(item.path);
      sessionStorage.setItem("ghostActivePath", item.path);
      const loginUrl = `/login?next=${encodeURIComponent(item.path)}`;
      go(loginUrl);
      return;
    }

    // Normal navigation
    go(item.path);
  };

  const avatarPx = useBreakpointValue({ base: 24, md: 32, lg: 28 });

  // NEW: If any real tab matches the current path, ignore ghost so only one label shows
  const hasRealActive = useMemo(
    () => navItems.some((n) => isActivePath(n.path, location.pathname)),
    [navItems, location.pathname]
  );

  return (
    <nav
      id="bottom-nav"
      className={BAR_CLASS}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Primary"
    >
      <div className={INNER_CLASS}>
        {navItems.map((item, idx) => {
          const reallyActive = isActivePath(item.path, location.pathname);
          const ghostActive =
            !user && ghostActivePath && isActivePath(item.path, ghostActivePath);

          // Only allow ghost when no real tab is active
          const active = hasRealActive ? reallyActive : (reallyActive || ghostActive);

          const isProfile = !!item.isProfile;
          const showAvatar = isProfile && !!avatarSrc;

          // base (active) and hover scaling — keeps label from scaling
          const baseScale = active ? 1.06 : 1;
          const hoverScale = active ? 1.09 : 1.06;

          return (
            <button
              key={`${item.label}-${idx}`}
              onClick={() => handleItemClick(item)}
              className={BUTTON_CLASS}
              aria-label={item.label}
              aria-current={reallyActive ? "page" : undefined}
              // Only expose pressed state for ghost when no real active exists
              aria-pressed={!hasRealActive && !reallyActive && ghostActive ? true : undefined}
              type="button"
            >
              {/* Icon / Avatar */}
              {showAvatar ? (
                <motion.div
                  className="grid place-items-center"
                  style={{ width: avatarPx, height: avatarPx }}
                  animate={{ scale: baseScale }}
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                >
                  <OctagonAvatar
                    src={avatarSrc}
                    alt={t("navigation.profileAlt")}
                    size={avatarPx}
                    ringWidth={1}
                    gap={2}
                    ringColor={active ? "#bfa200" : "#9CA3AF"}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className={["grid place-items-center", ICON_BOX_CLASS].join(" ")}
                  animate={{ scale: baseScale }}
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                >
                  <ImgIcon
                    src={item.icon}
                    alt={item.label}
                    className="w-full h-full object-contain p-[1px] pointer-events-none select-none"
                  />
                </motion.div>
              )}

              {/* Label */}
              {active && (
                <span className={[LABEL_CLASS, "text-white opacity-100"].join(" ")}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
