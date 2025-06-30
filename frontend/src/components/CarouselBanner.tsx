import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CarouselBanner.css';
import { fetchSets } from '../api';

interface TcgSet {
    id: string;
    name: string;
    images: { logo: string };
    releaseDate: string;
}

const CarouselBanner: React.FC = () => {
    const [sets, setSets] = useState<TcgSet[]>([]);

    useEffect(() => {
        fetchSets()
            .then(setData => setSets(setData.slice(0, 10)))
            .catch(err => {
                console.error('Failed to fetch sets:', err);
                setSets([]);
            });
    }, []);

    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: true,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <section className="carousel-banner">
            {sets.length === 0 ? (
                <div style={{ color: '#e3350d', textAlign: 'center', padding: '2rem' }}>
                    No sets found or failed to load sets.
                </div>
            ) : (
                <Slider {...settings}>
                    {sets.map(set => (
                        <div key={set.id} className="carousel-item">
                            <img src={set.images.logo} alt={`${set.name} logo`} />
                            <p className="set-name">{set.name}</p>
                            <span className="release-date">{set.releaseDate}</span>
                        </div>
                    ))}
                </Slider>
            )}
        </section>
    );
};

export default CarouselBanner;
