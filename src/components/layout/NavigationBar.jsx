// src/components/layout/NavigationBar.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import OctagonAvatar from "../common/OctagonAvatar";
import { useTranslation } from "react-i18next";

// ── Icon assets ───────────────────────────────────────────────────────────────
import logo from "../../assets/icons/CluckinsLogo.svg";
import homeIcon from "../../assets/icons/House Branco.svg";
import calendarIcon from "../../assets/icons/Calendar Branco.svg";
import settingsIcon from "../../assets/icons/Settings Branco.svg";
import profileIcon from "../../assets/icons/Profile Branco.svg";

/**
 * A tiny responsive value hook for numeric sizes.
 * Example: useBreakpointValue({ base: 28, md: 32, lg: 36 })
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

/** Renders a URL string import as <img>. */
function ImgIcon({ src, className, alt }) {
  // display:block removes inline-image baseline gap that can throw off alignment
  return <img src={src} alt={alt ?? ""} className={`block ${className}`} />;
}

const ICON_BOX_CLASS = "h-7 w-7 md:h-8 md:w-8 lg:h-7 lg:w-7 shrink-0";

// Common classes
const LABEL_CLASS =
  "text-[10px] md:text-xs leading-none font-medium transition-opacity";
const BUTTON_CLASS = [
  "flex flex-col items-center justify-center gap-1 md:gap-1.5",
  "h-14 md:h-16 w-full focus:outline-none focus-visible:ring-2",
  "focus-visible:ring-cyan-400/70 rounded-lg",
].join(" ");
const BAR_CLASS = "w-full sticky bottom-0 left-0 right-0 bg-black z-50";
const INNER_CLASS = "mx-auto grid grid-cols-5 items-center w-full lg:w-[80%]";

export default function NavigationBar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const avatarSrc =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  // Build once per language change so labels update correctly.
  const navItems = useMemo(
    () => [
      { icon: homeIcon,     label: t("navigation.home"),     path: "/" },
      { icon: calendarIcon, label: t("navigation.calendar"), path: "/calendar" },
      // Center logo — flagged with isLogo so we can add a tiny padding, but it behaves like any other item.
      { icon: logo,         label: t("navigation.chat"),     path: "/chat", isLogo: true },
      { icon: settingsIcon, label: t("navigation.settings"), path: "/settings" },
      { icon: profileIcon,  label: t("navigation.profile"),  path: "/profile", isProfile: true },
    ],
    [t, i18n.language]
  );

  // ✅ No special-casing the logo anymore — if it has a path, it can be active.
  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleItemClick = (item) => {
    if (!item.path) return;
    if (typeof onNavigate === "function") onNavigate(item.path);
    else navigate(item.path);
  };

  // Avatar pixel size (OctagonAvatar expects a number)
  const avatarPx = useBreakpointValue({ base: 24, md: 32, lg: 28 });

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
          const active = isActive(item.path);
          const isProfile = !!item.isProfile;
          const showAvatar = isProfile && !!avatarSrc;

          return (
            <button
              key={`${item.label}-${idx}`}
              onClick={() => handleItemClick(item)}
              className={BUTTON_CLASS}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              type="button"
            >
              {/* Icon / Avatar */}
              {showAvatar ? (
                <div
                  className="grid place-items-center"
                  style={{ width: avatarPx, height: avatarPx }}
                >
                  <OctagonAvatar
                    src={avatarSrc}
                    alt={t("navigation.profileAlt")}
                    size={avatarPx}
                    ringWidth={1}
                    gap={2}
                    ringColor={active ? "#bfa200" : "#9CA3AF"}
                    className={[
                      "transition-transform duration-150",
                      active ? "scale-105" : "",
                    ].join(" ")}
                  />
                </div>
              ) : (
                <div
                  className={[
                    "grid place-items-center",
                    ICON_BOX_CLASS,
                  ].join(" ")}
                >
                  <ImgIcon
                    src={item.icon}
                    alt={item.label}
                    className={[
                      "w-full h-full object-contain",
                      // Optional tiny padding helps normalize SVGs with tight viewBoxes
                      "p-[1px]",
                      "transition-transform duration-150",
                      active ? "scale-105" : "",
                    ].join(" ")}
                  />
                </div>
              )}

              {/* Label — visible only when active (applies to ALL items, including the logo) */}
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
