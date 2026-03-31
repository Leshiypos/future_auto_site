// MARK: document load listener
document.addEventListener("DOMContentLoaded", () => {
  // Функция открытия popUp
  openBlockInit();

  //   Функция закрытия popUap
  closeBlockInit();
  //   Добавление класса к меню при скролле
  addClassWhenScroll();

  //   Открытие и закрытие выпадающих списков
  dropDownBtn();

  //   Подстановка значений в кнопку
  insertChangeValueInput();

  //   Добавление быстрых тэгов
  toggleTagsInitFilter();

  // Функция Логика PopUps
  popUpInit();
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
// функция закрытия
function closeBlockInit() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    const btnClose = target.closest("[data-btn-close]");
    const blockClosable = target.closest("[data-block-closable]");
    if (!btnClose || !blockClosable) return;

    blockClosable.classList.remove("active");
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
    const btnsTrigger = document.querySelectorAll("[data-dropdown-btn].active");
    menus.forEach((menu) => {
      menu.classList.remove("open");
    });
    if (btnsTrigger) {
      btnsTrigger.forEach((btn) => {
        btn.classList.remove("active");
      });
    }
  }

  window.addEventListener("scroll", closeAllDropdownMenus);

  document.addEventListener("click", (e) => {
    const btnTrigger = e.target.closest("[data-dropdown-btn]");
    const clickedMenu = e.target.closest(".dropdown_menu");

    // клик вне кнопки и вне меню — закрыть все
    if (!btnTrigger && !clickedMenu) {
      closeAllDropdownMenus();
      return;
    }

    // если клик не по кнопке — дальше ничего не делаем
    if (!btnTrigger) return;

    const dropdownMenu = btnTrigger.nextElementSibling;
    if (!dropdownMenu || !dropdownMenu.classList.contains("dropdown_menu"))
      return;

    const isOpen = dropdownMenu.classList.contains("open");

    closeAllDropdownMenus();

    if (!isOpen) {
      dropdownMenu.classList.add("open");
      btnTrigger.classList.add("active");
    }
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

// MARK:  Добавление быстрых тэгов
// MARK: Добавление быстрых тегов
function toggleTagsInitFilter() {
  const tagsBlock = document.getElementById("tag_block");
  if (!tagsBlock) return;

  function createTag(text, inputId) {
    const tag = document.createElement("div");
    tag.className = "single_tag";
    tag.dataset.inputid = inputId;

    tag.innerHTML = `
      <span class="text_tag">${text}</span>
      <button type="button" data-inputid="${inputId}" class="tag_remove_btn">
        <img src="./assets/images/icons/tag_cross_btn.svg" alt="btn remove" />
      </button>
    `;

    return tag;
  }

  function getTagByInputId(inputId) {
    return tagsBlock.querySelector(`.single_tag[data-inputid="${inputId}"]`);
  }

  function removeTag(inputId) {
    const tag = getTagByInputId(inputId);
    if (tag) tag.remove();
  }

  function addTag(input) {
    const inputId = input.id;
    if (!inputId) return;

    if (input.classList.contains("default")) return;

    const alreadyExists = getTagByInputId(inputId);
    if (alreadyExists) return;

    const labelText = input.closest("label")?.querySelector(".label_text");
    const text = labelText?.textContent?.trim();

    if (!text) return;

    tagsBlock.append(createTag(text, inputId));
  }

  function getGroupInputs(input) {
    const name = input.name;
    if (!name) return [];
    return [...document.querySelectorAll(`input[name="${name}"]`)];
  }

  function getDefaultInput(inputs) {
    return inputs.find((item) => item.classList.contains("default"));
  }

  function getCheckedNotDefault(inputs) {
    return inputs.filter(
      (item) => item.checked && !item.classList.contains("default"),
    );
  }

  document.addEventListener("change", (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.matches('input[type="checkbox"]')) return;
    if (!input.closest(".filter_block")) return;

    const groupInputs = getGroupInputs(input);
    const defaultInput = getDefaultInput(groupInputs);

    // Если выбрали "Любой"
    if (input.classList.contains("default")) {
      if (input.checked) {
        groupInputs.forEach((item) => {
          if (item !== input) {
            item.checked = false;
            removeTag(item.id);
          }
        });
      } else {
        // Не даем снять "Любой", если ничего больше не выбрано
        const checkedNotDefault = getCheckedNotDefault(groupInputs);
        if (checkedNotDefault.length === 0) {
          input.checked = true;
        }
      }

      return;
    }

    // Если выбрали не default
    if (input.checked) {
      addTag(input);

      if (defaultInput) {
        defaultInput.checked = false;
      }
    } else {
      removeTag(input.id);

      const checkedNotDefault = getCheckedNotDefault(groupInputs);
      if (checkedNotDefault.length === 0 && defaultInput) {
        defaultInput.checked = true;
      }
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag_remove_btn");
    if (!btn) return;

    const inputId = btn.dataset.inputid;
    if (!inputId) return;

    const input = document.getElementById(inputId);
    if (!(input instanceof HTMLInputElement)) return;

    input.checked = false;
    removeTag(inputId);

    const groupInputs = getGroupInputs(input);
    const defaultInput = getDefaultInput(groupInputs);
    const checkedNotDefault = getCheckedNotDefault(groupInputs);

    if (checkedNotDefault.length === 0 && defaultInput) {
      defaultInput.checked = true;
    }
  });
}

// Функция Логика PopUps

function popUpInit() {
  function closeDropDown() {
    dropDownMenu.classList.remove("open");
    btnTriger.classList.remove("active");
  }

  const popUp = document.querySelector("#contact_us_form");
  if (!popUp) return;

  const btnTriger = popUp.querySelector(".filter_toggle");
  let btnTrigerLabel = popUp.querySelector(".filter_toggle .btn_label");
  const allLi = popUp.querySelectorAll(".dropdown_menu li");
  const dropDownMenu = popUp.querySelector(".dropdown_menu");

  if (!btnTrigerLabel || !btnTriger || !dropDownMenu || !allLi.length) return;
  allLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      const target = e.target;
      const textLabel = target.textContent;
      btnTrigerLabel.textContent = textLabel;

      closeDropDown();
    });
  });
}
