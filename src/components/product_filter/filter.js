function CreateFilterComponent(FilterContainer, data) {
  const container = document.getElementById(FilterContainer);

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
        ${renderFilterSections()}
      </section>
    `;
    container.appendChild(aside);
    bindEvents();
  }

  function renderFilterSections() {
    return data.sections
      .map(
        (section) => `
      <article class="filter__sections filter__section-${section.id}">
        <button class="filter__toggle" aria-expanded="false" aria-controls="${
          section.id
        }-list">
          ${section.title}
          ${renderToggleArrow()}
        </button>
        ${renderSectionList(section)}
      </article>
    `
      )
      .join('');
  }

  function renderToggleArrow() {
    return `
      <svg class="filter__toggle-arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 7L9 11L13 7" stroke="#999999" stroke-width="1.2" />
      </svg>
    `;
  }

  function renderSectionList(section) {
    if (!section.items) return '';

    const listItems = section.items
      .map(
        (item, index) => `
      <li class="filter__category-item">
        <input type="checkbox" id="${section.id}${index + 1}" name="${
          section.id
        }" value="${item.name}" class="filter__checkbox">
        <label for="${section.id}${index + 1}" class="filter__label">
          ${item.name}<span class="filter__count" aria-label="상품 수">${
            item.count
          }</span>
        </label>
      </li>
    `
      )
      .join('');

    const moreButton = ['category', 'brand'].includes(section.id)
      ? `<button type="button" class="filter__more" aria-label="더보기">${section.title} 더보기</button>`
      : '';

    return `
      <ul id="${section.id}-list" class="filter__category-list" role="list" >
        ${listItems}
        ${moreButton}
      </ul>
    `;
  }

  // 마크업테스를 위해 임시로 Ai의힘을빌려 확인용으로 만들어뒀습니다!
  function bindEvents() {
    const toggleButtons = container.querySelectorAll('.filter__toggle');
    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => toggleSection(button));
    });

    const resetButton = container.querySelector('#resetFilter');
    resetButton.addEventListener('click', resetFilters);

    const checkboxes = container.querySelectorAll('.filter__checkbox');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateFilter);
    });
  }

  function toggleSection(button) {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    const controlledElement = document.getElementById(
      button.getAttribute('aria-controls')
    );
    if (controlledElement) {
      controlledElement.style.display = expanded ? 'none' : 'block';
    }
    button.querySelector('.filter__toggle-arrow').style.transform = expanded
      ? 'rotate(0deg)'
      : 'rotate(180deg)';
  }
  function resetFilters() {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
    updateFilter();
  }

  function updateFilter() {
    const resetButton = container.querySelector('#resetFilter');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(
      (checkbox) => checkbox.checked
    );

    if (anyChecked) {
      resetButton.classList.add('filter__reset--active');
    } else {
      resetButton.classList.remove('filter__reset--active');
    }

    console.log('Filter updated');
  }

  render();
}

//여기서부터는 임시로 값을넣어줌 확인하기위해
//나중에 pocketbase 연동해서 데이터가져올때수정해야함

const filterdata = {
  sections: [
    {
      id: 'category',
      title: '카테고리',
      items: [
        { name: '샐러드·간편식', count: 65 },
        { name: '국·반찬·메인요리', count: 52 },
        { name: '정육·계란', count: 41 },
        { name: '과일·견과·쌀', count: 30 },
        { name: '간식·과자·떡', count: 18 },
        { name: '생수·음료·우유·커피', count: 17 },
        { name: '수산·해산·건어물', count: 16 },
        { name: '베이커리·치즈·델리', count: 13 },
        { name: '건강식품', count: 10 },
        { name: '생활용품·리빙·캠핑', count: 10 },
      ],
    },
    {
      id: 'delivery',
      title: '배송',
      items: [
        { name: '샛별배송', count: 777 },
        { name: '판매자배송', count: 6 },
      ],
    },
    { id: 'price', title: '가격' },
    {
      id: 'brand',
      title: '브랜드',
      items: [
        { name: '감자밭', count: 1 },
        { name: '라이크라이온', count: 1 },
        { name: '멋사', count: 1 },
        { name: '서울', count: 1 },
        { name: '광화문', count: 1 },
      ],
    },
    {
      id: 'benefit',
      title: '혜택',
      items: [
        { name: '할인상품', count: 666 },
        { name: '한정수량', count: 7 },
      ],
    },
    {
      id: 'type',
      title: '유형',
      items: [
        { name: 'Kurly Only', count: 77 },
        { name: '희소가치 프로젝트', count: 7 },
      ],
    },
    {
      id: 'exclude',
      title: '특정상품 제외',
      items: [{ name: '반려동물 상품', count: 1 }],
    },
  ],
};

CreateFilterComponent('filter-container', filterdata);
