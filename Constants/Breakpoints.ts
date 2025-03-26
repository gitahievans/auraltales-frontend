export const getBreakpoints = () => ({
    // Mobile (< 640px)
    0: {
      slidesPerView: 2.2,
      slidesPerGroup: 2,
      spaceBetween: 8, // Reduced from 12
    },
    // Small tablets (640px - 768px)
    640: {
      slidesPerView: 3.2,
      slidesPerGroup: 2,
      spaceBetween: 12, // Reduced from 16
    },
    // Tablets/Small laptops (768px - 1024px)
    768: {
      slidesPerView: 4.2,
      slidesPerGroup: 3,
      spaceBetween: 16, // Reduced from 20
    },
    // Desktop (>= 1024px)
    1024: {
      slidesPerView: 5.2,
      slidesPerGroup: 4,
      spaceBetween: 16, // Reduced from 24
    },
    // Large Desktop (>= 1280px)
    1280: {
      slidesPerView: 6.2,
      slidesPerGroup: 5,
      spaceBetween: 16, // Reduced from 24
    },
  });