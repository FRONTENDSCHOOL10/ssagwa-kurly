function categoryMenuItem(shadowRoot) {
  const menuItems = [
    { icon: 'Gift', title: '선물하기' },
    { icon: 'Vegetable', title: '채소' },
    { icon: 'Fruit', title: '과일 · 견과 · 쌀' },
    { icon: 'SeaFood', title: '수산 · 해산 · 건어물' },
    { icon: 'Meat', title: '정육 · 계란' },
    { icon: 'Food', title: '국 · 반찬 · 메인요리' },
    { icon: 'Salad', title: '샐러드 · 간편식' },
    { icon: 'Oil', title: '면 · 양념 · 오일' },
    { icon: 'Coffee', title: '생수 · 음료 · 우유 · 커피' },
    { icon: 'Snack', title: '간식 · 과자 · 떡' },
    { icon: 'Bread', title: '베이커리 · 치즈 · 델리' },
    { icon: 'Health', title: '건강식품' },
    { icon: 'Wine', title: '와인' },
    { icon: 'TraditionalLiquor', title: '전통주' },
    { icon: 'Detergent', title: '생활용품 · 리빙 · 캠핑' },
    { icon: 'Cosmetics', title: '스킨케어 · 메이크업' },
    { icon: 'Shampoo', title: '헤어 · 바디 · 구강' },
    { icon: 'Cook', title: '주방용품' },
    { icon: 'HomeAppliances', title: '가전제품' },
    { icon: 'Dog', title: '반려동물' },
    { icon: 'Baby', title: '베이비 · 키즈 · 완구' },
    { icon: 'Travel', title: '여행 · 티켓' },
  ];

  const menuContainer = shadowRoot.querySelector('.nav__category-list');

  if (!menuContainer) {
    console.error('.nav__category-list 요소를 찾을 수 없습니다.');
    return;
  }

  menuItems.forEach((item) => {
    const categoryIcon = document.createElement('img');
    const categoryTitle = document.createElement('span');
    const categoryContainer = document.createElement('li');

    categoryContainer.classList.add('nav__category__item');

    categoryIcon.src = `/svg/MenuIcon-${item.icon}.svg`;
    categoryIcon.alt = item.title;
    categoryIcon.classList.add('nav__category__item-img');
    categoryTitle.textContent = item.title;
    categoryTitle.classList.add('nav__category__item-title');

    categoryContainer.appendChild(categoryIcon);
    categoryContainer.appendChild(categoryTitle);

    menuContainer.appendChild(categoryContainer);
  });
}

export default categoryMenuItem;
