import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ServicesTypeBox from '../ServiceSections/ServicesTypeBox';
import useWindowSize from '../../hooks/useWindowSize';

/**
 * A helper function to break an array into smaller arrays (chunks) for our grid rows.
 * @param {Array} arr - The array to chunk.
 * @param {number} size - The size of each chunk.
 */
const chunk = (arr = [], size = 1) => {
  if (size <= 0) return [arr];
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

/**
 * A smart, responsive, and expandable grid component with smooth animations.
 * @param {Array<Object>} items - The array of data for the grid.
 */
export default function ExpandableGrid({ items = [] }) {
  // State to track the ID of the currently expanded item.
  const [selectedId, setSelectedId] = useState(null);
  const { width } = useWindowSize();

  // Memoized calculation for the number of columns based on screen width.
  const columns = useMemo(() => {
    if (width >= 1024) return 5; // Large screens
    if (width >= 768) return 3;  // Medium screens
    return 2;                    // Small screens
  }, [width]);

  // Memoized chunking of items into rows.
  const rows = useMemo(() => chunk(items, columns), [items, columns]);

  // Handler to toggle the selected item.
  const handleBoxClick = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  // Find the full object for the selected item.
  const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : null;

  // --- Animation Variants for the description ---
  // This defines the states for our animation.
  const descriptionVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeInOut' } }
  };

  return (
    <div className="flex flex-col my-6 gap-4">
      {rows.map((row, rowIndex) => {
        const isRowSelected = row.some((item) => item.id === selectedId);

        return (
          <React.Fragment key={rowIndex}>
            {/* The row of selectable items. */}
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {row.map((item) => (
                <ServicesTypeBox
                  key={item.id}
                  {...item} // Spread the item properties as props.
                  isSelected={selectedId === item.id}
                  onClick={() => handleBoxClick(item.id)}
                />
              ))}
            </motion.div>

            {/* THE EXPANDABLE CONTENT */}
            <AnimatePresence>
              {isRowSelected && (
                <motion.div
                  key="description" // A unique key is required for AnimatePresence.
                  className="overflow-hidden" // Prevents content spillover.
                  variants={descriptionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="py-4 text-center">
                    <h4 className="font-bold text-yellow-400 text-xl">{selectedItem.title}</h4>
                    <p className="text-white mt-2 max-w-2xl mx-auto">{selectedItem.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        );
      })}
    </div>
  );
}