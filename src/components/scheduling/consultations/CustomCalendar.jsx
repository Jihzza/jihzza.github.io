// src/components/scheduling/consultations/CustomCalendar.jsx
// Modern, accessible, and extensible calendar component.
// - Drop-in compatible with your previous API (selectedDate, onDateSelect, isDateSelectionRestricted)
// - Adds keyboard navigation, ARIA semantics, focus management, optional min/max, weekStartsOn, locale, and onMonthChange
// - Keeps your restriction logic (disable weekends + past/next 48h) when isDateSelectionRestricted=true

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  addHours,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isSaturday,
  isSunday,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

/**
 * CustomCalendar (modernized)
 *
 * Props (backward compatible):
 * - selectedDate: Date | null
 * - onDateSelect: (date: Date) => void
 * - isDateSelectionRestricted?: boolean (keeps your original weekend + 48h cutoff behavior)
 *
 * New optional props:
 * - weekStartsOn?: 0|1|2|3|4|5|6 (default 0)
 * - locale?: Locale (date-fns locale)
 * - leadTimeHours?: number (default 48) — only used when isDateSelectionRestricted is true
 * - disableWeekendsWhenRestricted?: boolean (default true)
 * - minDate?: Date
 * - maxDate?: Date
 * - className?: string
 * - onMonthChange?: (displayedMonth: Date) => void
 */
export default function CustomCalendar({
  selectedDate,
  onDateSelect,
  isDateSelectionRestricted = false,
  weekStartsOn = 0,
  locale,
  leadTimeHours = 48,
  disableWeekendsWhenRestricted = true,
  minDate,
  maxDate,
  className = "",
  onMonthChange,
}) {
  // Displayed month (first day of that month)
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));

  // Focused date for keyboard nav; default to selected or today
  const [focusedDate, setFocusedDate] = useState(() => selectedDate ?? startOfToday());
  const gridRef = useRef(null);

  // Keep displayed month in sync if selectedDate changes across months
  useEffect(() => {
    if (selectedDate && !isSameMonth(selectedDate, currentMonth)) {
      const firstOfSelected = startOfMonth(selectedDate);
      setCurrentMonth(firstOfSelected);
      onMonthChange?.(firstOfSelected);
    }
  }, [selectedDate]);

  const goToPrevMonth = useCallback(() => {
    const next = startOfMonth(subMonths(currentMonth, 1));
    setCurrentMonth(next);
    onMonthChange?.(next);
  }, [currentMonth, onMonthChange]);

  const goToNextMonth = useCallback(() => {
    const next = startOfMonth(addMonths(currentMonth, 1));
    setCurrentMonth(next);
    onMonthChange?.(next);
  }, [currentMonth, onMonthChange]);

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart]);
  const startDate = useMemo(() => startOfWeek(monthStart, { weekStartsOn }), [monthStart, weekStartsOn]);
  const endDate = useMemo(() => endOfWeek(monthEnd, { weekStartsOn }), [monthEnd, weekStartsOn]);

  const today = startOfToday();
  const bookingCutoff = useMemo(() => addHours(new Date(), leadTimeHours), [leadTimeHours]);

  const isOutOfRange = useCallback(
    (date) => {
      if (minDate && isBefore(date, startOfDay(minDate))) return true;
      if (maxDate && isAfter(date, endOfDay(maxDate))) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const isDisabled = useCallback(
    (date) => {
      // Keep original behavior when isDateSelectionRestricted
      if (isDateSelectionRestricted) {
        const weekend = disableWeekendsWhenRestricted && (isSaturday(date) || isSunday(date));
        const pastOrWithinLead = isBefore(date, startOfToday()) || isBefore(date, bookingCutoff);
        if (weekend || pastOrWithinLead) return true;
      }
      if (isOutOfRange(date)) return true;
      return false;
    },
    [isDateSelectionRestricted, disableWeekendsWhenRestricted, bookingCutoff, isOutOfRange]
  );

  // Build weeks matrix
  const weeks = useMemo(() => {
    const days = [];
    let day = startDate;
    while (!isAfter(day, endDate)) {
      days.push(day);
      day = addDays(day, 1);
    }
    // chunk into weeks of 7
    const rows = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  }, [startDate, endDate]);

  // Keyboard navigation in the grid
  const onKeyDown = useCallback(
    (e) => {
      const key = e.key;
      let next = focusedDate ?? today;
      if (key === "ArrowLeft") next = addDays(next, -1);
      else if (key === "ArrowRight") next = addDays(next, 1);
      else if (key === "ArrowUp") next = addWeeks(next, -1);
      else if (key === "ArrowDown") next = addWeeks(next, 1);
      else if (key === "Home") next = startOfWeek(next, { weekStartsOn });
      else if (key === "End") next = endOfWeek(next, { weekStartsOn });
      else if (key === "PageUp") next = addMonths(next, -1);
      else if (key === "PageDown") next = addMonths(next, 1);
      else if (key === "Enter" || key === " ") {
        e.preventDefault();
        if (!isDisabled(focusedDate)) onDateSelect?.(focusedDate);
        return;
      } else {
        return; // ignore other keys
      }
      e.preventDefault();
      setFocusedDate(next);
      // If we moved across months, update currentMonth so the focused day is visible
      if (!isSameMonth(next, currentMonth)) {
        const cm = startOfMonth(next);
        setCurrentMonth(cm);
        onMonthChange?.(cm);
      }
      // Move DOM focus to matching cell after state commits (next tick)
      requestAnimationFrame(() => {
        const el = gridRef.current?.querySelector(
          `[data-iso="${format(next, "yyyy-MM-dd")}"]`
        );
        el?.focus();
      });
    },
    [focusedDate, weekStartsOn, currentMonth, isDisabled, onDateSelect]
  );

  return (
    <div className={`w-full max-w-md mx-auto rounded-2xl bg-black/30 backdrop-blur-lg text-white shadow-xl ring-1 ring-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 opacity-80" aria-hidden="true" />
          <h2
            id="calendar-month-label"
            className="font-semibold text-base tracking-tight md:text-lg"
            aria-live="polite"
          >
            {format(currentMonth, "MMMM yyyy", { locale })}
          </h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#BFA200]/70"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              const cm = startOfMonth(today);
              setCurrentMonth(cm);
              setFocusedDate(today);
              onMonthChange?.(cm);
            }}
            className="px-3 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#BFA200]/70 hidden sm:inline-flex"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg:white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#BFA200]/70"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Weekday headings */}
      <div className="grid grid-cols-7 text-center text-[11px] sm:text-xs text-gray-300 px-2 sm:px-3 select-none">
        {Array.from({ length: 7 }).map((_, i) => {
          const d = addDays(startOfWeek(currentMonth, { weekStartsOn }), i);
          return (
            <div key={i} className="py-1 font-medium">
              {format(d, "EEE", { locale })}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-labelledby="calendar-month-label"
        className="px-2 sm:px-3 pb-3 sm:pb-4"
        onKeyDown={onKeyDown}
      >
        {weeks.map((week, rowIdx) => (
          <div key={rowIdx} role="row" className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            {week.map((date) => {
              const inMonth = isSameMonth(date, monthStart);
              const selected = selectedDate ? isSameDay(date, selectedDate) : false;
              const todayFlag = isSameDay(date, today);
              const disabled = isDisabled(date);

              const base =
                "relative h-10 lg:h-8 w-full grid place-items-center rounded-lg border text-sm transition transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA200]/70";
              const classes = [base];
              if (disabled) {
                classes.push("text-gray-500 border-transparent line-through cursor-not-allowed opacity-60");
              } else if (selected) {
                classes.push("border-2 border-[#BFA200] font-semibold scale-105 bg-[#10253A]");
              } else {
                classes.push("border-white/10 hover:bg-white/10 cursor-pointer");
              }
              if (!inMonth) classes.push("text-gray-400");

              return (
                <button
                  key={format(date, "yyyy-MM-dd")}
                  type="button"
                  role="gridcell"
                  data-iso={format(date, "yyyy-MM-dd")}
                  aria-selected={selected}
                  aria-disabled={disabled}
                  aria-current={todayFlag ? "date" : undefined}
                  tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
                  className={classes.join(" ")}
                  onFocus={() => setFocusedDate(date)}
                  onClick={() => {
                    if (disabled) return;
                    onDateSelect?.(date);
                    // If clicking a trailing/leading day, jump month for continuity
                    if (!inMonth) {
                      const cm = startOfMonth(date);
                      setCurrentMonth(cm);
                      onMonthChange?.(cm);
                    }
                    setFocusedDate(date);
                  }}
                >
                  <span className="pointer-events-none select-none">
                    {format(date, "d")}
                  </span>
                  {todayFlag && (
                    <span className="sr-only"> Today</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helpers for min/max range checks without importing the whole of date-fns-tz or extra utils
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
