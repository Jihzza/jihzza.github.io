// src/components/sections/media/MediaGrid.jsx
import React from "react";
import PropTypes from "prop-types";
import MediaItem from "./MediaItem";


export default function MediaGrid({ items }) {
    return (
        <ul className="grid grid-cols-3 gap-6 md:gap-0 items-center">
            {items.map((it) => (
                <MediaItem
                    key={it.id}
                    href={it.url}
                    imgSrc={it.image}
                    alt={it.alt}
                    label={it.label}
                />
            ))}
        </ul>
    );
}


MediaGrid.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
            alt: PropTypes.string.isRequired,
            label: PropTypes.string
        })
    ).isRequired
};