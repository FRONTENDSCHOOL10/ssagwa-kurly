import '/src/components/product_filter/filter.css';
import { getAttr, toggleClass, addClass, removeClass } from '/src/lib/index.js';

export function createFilterComponent(FilterContainer, data, onFilterChange) {
  const container = document.getElementById(FilterContainer);
  let currentFilters = {};

  function render() {
    const aside = document.createElement('aside');
    aside.className = 'filter';
    aside.setAttribute('aria-label', '상품 필터');
    aside.innerHTML = `
      <section class="filter__section">
        <header class="filter__sections filter__section-header">
          <h2 class="filter__section-title">필터</h2>
          <button id="resetFilter" type="button" class="filter__reset" aria-label="필터 초기화">초기화</button>
        </header>
        ${getFilterSectionsHTML()}
      </section>
    `;
    container.appendChild(aside);
    addEventListeners();
  }

  function getFilterSectionsHTML() {
    let sectionsHTML = '';
    data.sections.forEach((section) => {
      sectionsHTML += `
        <article class="filter__sections filter__section-${section.id}">
          <button class="filter__toggle" aria-expanded="false" aria-controls="${
            section.id
          }-list">
            ${section.title}
            <svg class="filter__toggle-arrow"></svg>
          </button>
          ${getSectionListHTML(section)}
        </article>
      `;
    });
    return sectionsHTML;
  }

  function getSectionListHTML(section) {
    if (!section.items) return '';

    let listItemsHTML = '';
    section.items.forEach((item, index) => {
      const inputType = section.id === 'price' ? 'radio' : 'checkbox';
      listItemsHTML += `
        <li class="filter__category-item">
          <input type="${inputType}" id="${section.id}${index + 1}" name="${
            section.id
          }" value="${item.name}" class="filter__${inputType}">
          <label for="${section.id}${index + 1}" class="filter__label">
            ${item.name}
          </label>
        </li>
      `;
    });

    const moreButton = ['category', 'brand'].includes(section.id)
      ? `<button type="button" class="filter__more" aria-label="더보기">${section.title} 더보기</button>`
      : '';

    return `
      <ul id="${section.id}-list" class="filter__category-list" role="list" >
        ${listItemsHTML}
        ${moreButton}
      </ul>
    `;
  }

  function addEventListeners() {
    const toggleButtons = container.querySelectorAll('.filter__toggle');
    toggleButtons.forEach((button) => {
      button.addEventListener('click', handleSectionToggle);
    });

    const inputs = container.querySelectorAll(
      'input[type="checkbox"], input[type="radio"]'
    );
    inputs.forEach((input) => {
      input.addEventListener('change', handleInputChange);
    });

    const resetButton = container.querySelector('.filter__reset');
    resetButton.addEventListener('click', handleReset);
  }

  function handleSectionToggle(event) {
    const button = event.currentTarget;
    const sectionId = getAttr(button, 'aria-controls');
    const section = document.getElementById(sectionId);
    const isExpanded = getAttr(button, 'aria-expanded') === 'true';

    button.setAttribute('aria-expanded', !isExpanded);
    toggleClass(section, 'expanded');
  }

  function handleInputChange(event) {
    const input = event.target;
    const filterType = input.name;
    const filterValue = input.value;

    if (input.type === 'radio') {
      // 라디오 버튼의 경우, 해당 필터 타입의 값을 새로운 값으로 대체
      currentFilters[filterType] = [filterValue];
    } else {
      // 체크박스의 경우, 기존 로직 유지
      if (!currentFilters[filterType]) {
        currentFilters[filterType] = [];
      }

      if (input.checked) {
        if (!currentFilters[filterType].includes(filterValue)) {
          currentFilters[filterType].push(filterValue);
        }
      } else {
        currentFilters[filterType] = currentFilters[filterType].filter(
          (value) => value !== filterValue
        );
      }

      if (currentFilters[filterType].length === 0) {
        delete currentFilters[filterType];
      }
    }

    updateResetButton();
    if (onFilterChange) onFilterChange(currentFilters);
  }
  function updateResetButton() {
    const resetButton = container.querySelector('.filter__reset');
    const anyChecked = container.querySelector(
      'input[type="checkbox"]:checked, input[type="radio"]:checked'
    );

    if (anyChecked) {
      addClass(resetButton, 'filter__reset--active');
    } else {
      removeClass(resetButton, 'filter__reset--active');
    }
  }

  function handleReset() {
    const inputs = container.querySelectorAll(
      'input[type="checkbox"], input[type="radio"]'
    );
    inputs.forEach((input) => {
      input.checked = false;
    });

    currentFilters = {};
    updateResetButton();
    if (onFilterChange) onFilterChange(currentFilters);
  }

  render();
}

export const filterdata = {
  sections: [
    {
      id: 'category',
      title: '카테고리',
      items: [
        { name: '샐러드·간편식' },
        { name: '국·반찬·메인요리' },
        { name: '정육·계란' },
        { name: '과일·견과·쌀' },
        { name: '간식·과자·떡' },
        { name: '생수·음료·우유·커피' },
        { name: '수산·해산·건어물' },
        { name: '베이커리·치즈·델리' },
        { name: '건강식품' },
        { name: '생활용품·리빙·캠핑' },
      ],
    },
    {
      id: 'delivery',
      title: '배송',
      items: [{ name: '샛별배송' }, { name: '판매자배송' }],
    },
    {
      id: 'price',
      title: '가격',
      items: [
        { name: '6,900 미만' },
        { name: '6,900원 ~ 9,900원' },
        { name: '9,900원 ~ 14,900원' },
        { name: '14,900이상' },
      ],
    },
    {
      id: 'brand',
      title: '브랜드',
      items: [
        { name: 'CJ' },
        { name: '조선호텔' },
        { name: 'KF365' },
        { name: '피코크' },
        { name: '도리깨침' },
      ],
    },
    {
      id: 'benefit',
      title: '혜택',
      items: [{ name: '할인상품' }, { name: '한정수량' }],
    },
    {
      id: 'type',
      title: '유형',
      items: [{ name: 'Kurly Only' }],
    },
    {
      id: 'exclude',
      title: '특정상품 제외',
      items: [{ name: '반려동물 상품' }],
    },
  ],
};
