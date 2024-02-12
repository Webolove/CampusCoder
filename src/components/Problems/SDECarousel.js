import React, { useEffect, useRef } from 'react';
import Flickity from 'flickity';
import 'flickity/css/flickity.css';

export default function SDECarousel({ children, flickityRef, onSlideChange }) {


    useEffect(() => {
        flickityRef.current = new Flickity('.carousel', {
            cellalign: 'center',
            pageDots: true,
            selectedAttraction: 0.04,
            friction: 0.15,
            autoPlay: false,
            wrapAround: true,
            prevNextButtons: false,
            on: {
                change: () => {
                    const selectedSlideIndex = flickityRef.current.selectedIndex;
                    onSlideChange(selectedSlideIndex);
                },
            }
        });

        return () => {
            flickityRef.current.destroy();
        };
    }, []);

    return (
        <div className="carousel">
            {React.Children.map(children, (child, index) => (
                <div key={index} className="carousel-cell">
                    {child}
                </div>
            ))}
        </div>
    );
};
