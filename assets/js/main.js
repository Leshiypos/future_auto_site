// MARK: document load listener
document.addEventListener("DOMContentLoaded", () => {
  // Функция открытия popUp
  openBlockInit();

  //   Добавление класса к меню при скролле
  addClassWhenScroll();

  //   Открытие и закрытие выпадающих списков
  dropDownBtn();

  //   Подстановка значений в кнопку
  insertChangeValueInput();
});

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

function dropDownBtn() {
  function closeAllDropdownMenus() {
    const menus = document.querySelectorAll(".dropdown_menu.open");
    if (!menus) return;
    menus.forEach((menu) => {
      menu.classList.remove("open");
    });
  }
  window.addEventListener("scroll", () => {
    closeAllDropdownMenus();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown_menu")) closeAllDropdownMenus();

    const btnTriger = e.target.closest("[data-dropdown-btn]");
    if (!btnTriger) return;
    const dropdownMenu = btnTriger.nextElementSibling;
    if (!dropdownMenu) return;

    dropdownMenu.classList.toggle("open");
  });
}

// Поставновка выбранных значений в filter_toggle
function insertChangeValueInput() {
  document.addEventListener("change", (e) => {
    const target = e.target;

    if (!target.matches('input[type="checkbox"]')) return;

    const filterBlock = target.closest(".filter_block");
    if (!filterBlock) return;

    const btnLabel = filterBlock.querySelector(".btn_label");
    const defaultLabel = btnLabel.dataset.defaultLabel || "Тип двигателя";
    const defaultInput = filterBlock.querySelector("input.default");
    const allInputs = filterBlock.querySelectorAll('input[type="checkbox"]');

    if (target.classList.contains("default") && target.checked) {
      allInputs.forEach((input) => {
        if (input !== target) input.checked = false;
      });

      btnLabel.textContent = "Любой";
      return;
    }

    if (
      !target.classList.contains("default") &&
      target.checked &&
      defaultInput
    ) {
      defaultInput.checked = false;
    }

    let checkedInputs = filterBlock.querySelectorAll(
      'input[type="checkbox"]:checked',
    );

    if (!checkedInputs.length && defaultInput) {
      defaultInput.checked = true;
      btnLabel.textContent = "Любой";
      return;
    }

    checkedInputs = filterBlock.querySelectorAll(
      'input[type="checkbox"]:checked',
    );

    const isAll = [...checkedInputs].some((input) => input.value === "all");

    if (isAll) {
      btnLabel.textContent = "Любой";
      return;
    }

    const values = [...checkedInputs]
      .map((input) => {
        const textEl = input.closest("label")?.querySelector(".label_text");
        return textEl ? textEl.textContent.trim() : "";
      })
      .filter(Boolean);

    btnLabel.textContent = values.length ? values.join(", ") : defaultLabel;
  });
}
