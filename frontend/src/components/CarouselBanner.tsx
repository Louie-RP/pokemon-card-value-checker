import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
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

    return (
        <section className="carousel-banner">
            {sets.length === 0 ? (
                <div style={{ color: '#e3350d', textAlign: 'center', padding: '2rem' }}>
                    No sets found or failed to load sets.
                </div>
            ) : (
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={32}
                    slidesPerView={5}
                    loop={true}
                    autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    speed={3500}
                    grabCursor={true}
                    breakpoints={{
                        1024: { slidesPerView: 4 },
                        768: { slidesPerView: 2 },
                        480: { slidesPerView: 1 },
                    }}
                    style={{ width: '100%' }}
                >
                    {sets.map(set => (
                        <SwiperSlide key={set.id}>
                            <div className="carousel-item">
                                <img src={set.images.logo} alt={`${set.name} logo`} />
                                <p className="set-name">{set.name}</p>
                                <span className="release-date">{set.releaseDate}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
};

export default CarouselBanner;
