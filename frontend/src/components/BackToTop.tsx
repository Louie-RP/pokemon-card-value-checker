import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > window.innerHeight * 0.75;
      setVisible(show);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`back-to-top-btn btn btn-warning fw-bold shadow ${visible ? 'show' : ''}`}
      onClick={handleClick}
    >
      ↑
    </button>
  );
}
