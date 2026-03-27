// MARK: Функция открытия попапов
function openBlockInit() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    const btnOpen = target.closest("[data-btn-open]");
    if (!btnOpen) return;
    e.preventDefault();
    const blockTag = btnOpen.dataset.btnOpen;

    if (!blockTag || blockTag == "") {
      console.log(
        "⚠️ Добавьте атрибуту [data-btn-open] кнопки значение метку открываемого окна",
      );
      return;
    }

    const blockOpen = document.querySelector(
      `[data-block-closable="${blockTag}"]`,
    );

    if (!blockOpen) {
      console.log(
        `❌ Блок с отрибутом [data-block-closable=${blockTag}] отсутствует на странице`,
      );
      return;
    }
    // Был ли этот блок ОТКРЫТ до клика?
    const wasOpen = blockOpen.classList.contains("active");
    // Получаем метку группу окон
    const groupTag = blockOpen.dataset.group;
    // закрываем все окна в группе
    if (groupTag && groupTag != "") {
      const blocksGroup = document.querySelectorAll(
        `[data-group="${groupTag}"]`,
      );
      if (blocksGroup.length) {
        blocksGroup.forEach((block) => {
          block.classList.remove("active");
        });
      }
    }

    // Если был открыт — закрываем его
    if (wasOpen) {
      blockOpen.classList.remove("active");
      return;
    }

    // Если был закрыт — открываем его
    blockOpen.classList.add("active");
  });
}

// MARK: Добавление класса меню при скролле
function addClassWhenScroll() {
  const headerElement = document.querySelector("header");
  if (!headerElement) return;

  function toggleHeaderClass() {
    if (window.scrollY > 0) {
      headerElement.classList.add("darken");
    } else {
      headerElement.classList.remove("darken");
    }
  }

  toggleHeaderClass(); // проверка сразу при загрузке
  window.addEventListener("scroll", toggleHeaderClass);
}

// MARK: document load listener
document.addEventListener("DOMContentLoaded", () => {
  // Функция открытия popUp
  openBlockInit();

  //   Добавление класса к меню при скролле
  addClassWhenScroll();
});
