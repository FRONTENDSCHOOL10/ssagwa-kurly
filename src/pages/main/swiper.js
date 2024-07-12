export const slideSwiper = () =>{
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    autoplay:{
      delay:3000
    },
    speed:2000,
    observer: true,
    observeParents: true,
    parallax:true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable:true,
      bulletClass:'bullet',
      bulletActiveClass:'is-active',
    }, 
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-right',
      prevEl: '.swiper-button-left',
    },
  
  });
}
