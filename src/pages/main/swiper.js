export const slideSwiper = () => {
  const swiper1 = new Swiper('.banner-swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 0,
    speed: 4000,
    observer: true,
    observeParents: true,
    parallax: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      bulletClass: 'bullet',
      bulletActiveClass: 'is-active',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.banner-swiper-button-right',
      prevEl: '.banner-swiper-button-left',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });

  const swiper2 = new Swiper('.price-swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 0, 
    speed: 2000,
    observer: true,
    observeParents: true,
    parallax: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      bulletClass: 'bullet',
      bulletActiveClass: 'is-active',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.price-swiper-button-right',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });
}
