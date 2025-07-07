import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ServicesTypeBox from '../ServiceSections/ServicesTypeBox';
import useWindowSize from '../../hooks/useWindowSize';

/**
 * Break an array into chunks of `size`.
 * Added safe defaults so we never call `.length` on `undefined`.
 */
const chunk = (arr = [], size = 1) => {
  if (size <= 0) return [arr];
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

export default function ExpandableGrid({ items = [] }) {
  const [selectedId, setSelectedId] = useState(null);
  const windowSize = useWindowSize();

  // Decide how many columns based on width; defaults trigger even if width is undefined
  const columns = useMemo(() => {
    const w = windowSize?.width ?? 0;
    if (w >= 1024) return 5;
    if (w >= 768) return 3;
    return 2;
  }, [windowSize?.width]);

  // Safely chunk items – even if items is still undefined during first render
  const rows = useMemo(() => chunk(items, columns), [items, columns]);

  const handleBoxClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedItem = selectedId ? items.find((item) => item.id === selectedId) : null;

  return (
    <motion.div layout className="flex flex-col my-6 gap-4">
      {rows.map((row, rowIndex) => {
        const isRowSelected = row.some((item) => item.id === selectedId);

        return (
          <React.Fragment key={rowIndex}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {row.map((item) => (
                <ServicesTypeBox
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  isSelected={selectedId === item.id}
                  onClick={() => handleBoxClick(item.id)}
                />
              ))}
            </div>

            <AnimatePresence>
              {isRowSelected && (
                <motion.div
                  className="overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
                >
                  <div className="py-4 text-center">
                    <h4 className="font-bold text-yellow-400 text-xl">{selectedItem?.title}</h4>
                    <p className="text-white mt-2 max-w-2xl mx-auto">{selectedItem?.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        );
      })}
    </motion.div>
  );
}
