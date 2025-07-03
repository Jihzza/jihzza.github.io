import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ServicesTypeBox from '../ServiceSections/ServicesTypeBox';
import useWindowSize from '../../hooks/useWindowSize';

const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

export default function ExpandableGrid({ items }) {
    const [selectedId, setSelectedId] = useState(null);
    const windowSize = useWindowSize();

    const columns = useMemo(() => {
        if (windowSize.width >= 1024) return 5;
        if (windowSize.width >= 768) return 3;
        return 2;
    }, [windowSize.width]);

    const rows = useMemo(() => chunk(items, columns), [items, columns]);

    const handleBoxClick = (id) => {
        setSelectedId(prevId => (prevId === id ? null : id));
    };

    const selectedItem = selectedId ? items.find(item => item.id === selectedId) : null;

    return (
        // --- CHANGE: Add `gap-4` to this flex container ---
        <motion.div layout className="flex flex-col my-6 gap-4">
            {rows.map((row, rowIndex) => {
                const isRowSelected = row.some(item => item.id === selectedId);

                return (
                    <React.Fragment key={rowIndex}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {row.map(item => (
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
                                    {/* The detail text itself has padding, so no extra margin is needed here */}
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