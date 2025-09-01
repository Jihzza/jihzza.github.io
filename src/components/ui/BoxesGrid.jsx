// BoxesGrid.jsx — mobile 2-col, desktop 3-col with a centered *last* row.
// The trick: on desktop we use 6 template columns and make each card span 2.
// Then we use targeted `grid-column-end` values to center the leftovers:
// - If 1 leftover → end at line 5  (places it in columns 3–4, the middle).
// - If 2 leftovers → first ends at 4, last ends at -2 (columns 2–3 and 4–5).
// This technique is adapted from Michelle Barker’s “Controlling Leftover Grid Items”.
// See: https://css-irl.info/controlling-leftover-grid-items/
import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// Simple presentational card/button used inside the grid.
function CardTabSimple({
  label,
  image,
  imageAlt,
  index,
  isActive,
  isTabbable,
  onSelect,
  onKeyDown,
  tabId,
  panelId,
  focusRef,
}) {
  return (
    <motion.button
      layout
      initial={false}
      // Small press feedback without fighting the active scale
      whileTap={{ scale: 0.985 }}
      // Animate the "size increase" and the shadow smoothly
      animate={{
        scale: isActive ? 1.04 : 1,
        boxShadow: isActive
          ? "0 16px 36px rgba(0, 0, 0, 0.35)"
          : "0 6px 14px rgba(0, 0, 0, 0.25)",
      }}
      transition={{
        layout: { duration: 0.30, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.20, ease: [0.22, 1, 0.36, 1] },
        boxShadow: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      ref={focusRef}
      role="button"
      id={tabId}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isTabbable ? 0 : -1}
      onKeyDown={onKeyDown}
      onClick={() => onSelect(index)}
      className={[
        "flex flex-col gap-2 w-full h-30 items-center justify-center rounded-2xl",
        "transform-gpu will-change-transform",
        "bg-transparent border border-[#BFA200]",
        "text-white px-3 py-6 text-center",
        "focus focus-visible:ring-[#BFA200]/40",
        "transition-all duration-200 ease-out",
        // Active vs. idle: thicker border & ring when active
        isActive
          ? "border-3 ring-2 ring-[#BFA200]/40"
          : "border-2 hover:shadow-md",
      ].join(" ")}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt ?? ""}
          className="w-8 h-8 object-contain pointer-events-none select-none"
          {...(!imageAlt ? { "aria-hidden": true } : {})}
        />
      )}
      <span className="text-base font-medium">{label}</span>
    </motion.button>
  );
}

// Hook: current column count (2 on mobile, 3 on md+).
function useCols() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)"); // Tailwind md breakpoint
    const onChange = () => setCols(mql.matches ? 3 : 2);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return cols;
}

export default function BoxesGrid({
  items = [],
}) {
  // Normalize input to objects with a label / paragraph
  const normalized = useMemo(
    () =>
      (items || []).map((it) =>
        typeof it === "string"
          ? { label: it, paragraph: "" }
          : {
              id: it.id,
              label: it.label ?? it.name ?? "",
              paragraph: it.paragraph ?? it.subtitle ?? "",
              image: it.image,
              imageAlt: it.imageAlt,
            }
      ),
    [items]
  );

  const cols = useCols();
  const [active, setActive] = useState(null);
  const listId = useId();

  // focus refs + ids
  const tabRefs = useRef([]);
  useEffect(() => { tabRefs.current = new Array(normalized.length); }, [normalized.length]);

  // ids for a11y
  const ids = useMemo(() => {
    const uid = listId?.toString().replace(/:/g, "") || "boxes";
    return normalized.map((_, i) => ({
      tabId: `${uid}-tab-${i}`,
      panelId: `${uid}-panel-${i}`,
    }));
  }, [normalized.length, listId]);

  // keyboard navigation
  const onKeyDown = (e, index) => {
    const last = normalized.length - 1;
    const colCount = cols; // 2 on mobile, 3 on desktop
    const row = Math.floor(index / colCount);
    let next = index;

    switch (e.key) {
      case "ArrowRight":
        next = Math.min(index + 1, last);
        break;
      case "ArrowLeft":
        next = Math.max(index - 1, 0);
        break;
      case "ArrowDown":
        next = Math.min(index + colCount, last);
        break;
      case "ArrowUp":
        next = Math.max(index - colCount, 0);
        break;
      case "Home":
        next = row * colCount; // first in this row
        break;
      case "End":
        next = Math.min(row * colCount + (colCount - 1), last); // last in this row (or the real last item)
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setActive((prev) => (prev === index ? null : index));
        return;
      default:
        return;
    }
    e.preventDefault();
    tabRefs.current[next]?.focus?.();
  };

  if (normalized.length === 0) return null;

  // Build rows by current col count
  const rows = useMemo(() => {
    const r = [];
    for (let i = 0; i < normalized.length; i += cols) {
      r.push(normalized.slice(i, i + cols));
    }
    return r;
  }, [normalized, cols]);

  const rem = normalized.length % cols; // leftovers on the last row
  const activeRow = active === null ? -1 : Math.floor(active / cols);

  return (
    <section className="w-full">
      <div className="mx-auto w-full">
        <LayoutGroup>
          <motion.div layout>
            <div
              role="tablist"
              aria-label="Options"
              // 2 cols on mobile; 6 on md (each card spans 2 → visually 3 cols)
              className="grid grid-cols-2 md:grid-cols-6 gap-3 py-4"
            >
              {rows.map((row, rIdx) => (
                <React.Fragment key={`row-${rIdx}`}>
                  {row.map((item, iInRow) => {
                    const index = rIdx * cols + iInRow;
                    const isActive = active === index;
                    const isTabbable = active === null ? index === 0 : isActive;
                    const last = normalized.length - 1;
                    const penultimate = normalized.length - 2;

                    // Base classes: mobile spans one col, desktop spans 2 (so 3 "visual" columns).
                    const base = "min-w-0 w-full md:col-span-2";

                    // Centering logic for the *last* row on desktop only.
                    let desktopCentering = "";
                    if (cols === 3) {
                      if (rem === 1 && index === last) {
                        // one leftover → center it
                        desktopCentering = "md:col-end-5"; // columns 3–4
                      } else if (rem === 2) {
                        if (index === penultimate) {
                          desktopCentering = "md:col-end-4"; // columns 2–3
                        } else if (index === last) {
                          desktopCentering = "md:col-end-[-2]"; // columns 4–5
                        }
                      }
                    }

                    // (Mobile single-widow usually looks fine without special rules.)

                    const wrapperClass = [base, desktopCentering].join(" ").trim();

                    return (
                      <motion.div key={ids[index].tabId} className={wrapperClass} layout>
                        <CardTabSimple
                          index={index}
                          label={item.label}
                          image={item.image}
                          imageAlt={item.imageAlt}
                          isActive={isActive}
                          isTabbable={isTabbable}
                          onSelect={(i) => setActive((prev) => (prev === i ? null : i))}
                          onKeyDown={(e) => onKeyDown(e, index)}
                          tabId={ids[index].tabId}
                          panelId={ids[index].panelId}
                          focusRef={(el) => (tabRefs.current[index] = el)}
                        />
                      </motion.div>
                    );
                  })}

                  {/* Row-scoped expander right under this row */}
                  <AnimatePresence initial={false}>
                    {active !== null && activeRow === rIdx && normalized[active] && (
                      <motion.div
                        key={`panel-row-${rIdx}`}
                        role="region"
                        id={ids[active].panelId}
                        aria-labelledby={ids[active].tabId}
                        className="overflow-hidden col-span-2 md:col-span-6"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-2 py-4 text-center text-white">
                          <p className="text-sm md:text-lg">
                            {normalized[active].paragraph || ""}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
