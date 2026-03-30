document.addEventListener("DOMContentLoaded", () => {
  // Инициализация портфолио слайдеров
  initialportfolioSwiper();
});

function initialportfolioSwiper() {
  const sliders = document.querySelectorAll(".cases_swiper");
  if (!sliders) return;

  sliders.forEach((slider) => {
    const contentBlock = slider
      .closest(".case_section")
      ?.querySelector(".wrap_content");
    const offsetPxMob = 20;
    const offsetPx = (window.innerWidth - contentBlock.offsetWidth) / 2;
    console.log(offsetPx);
    const offset = offsetPx == 0 ? offsetPxMob : offsetPx;
    const swiper = new Swiper(slider, {
      loop: false,
      slidesPerView: 1.3,
      spaceBetween: 19,
      // Navigation arrows
      slidesOffsetBefore: offsetPxMob,
      slidesOffsetAfter: offsetPxMob,
      breakpoints: {
        1000: {
          spaceBetween: 10,
          slidesPerView: 3,
          slidesOffsetBefore: offset,
          slidesOffsetAfter: offset,
          spaceBetween: 30,
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
}
