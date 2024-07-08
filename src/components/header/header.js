class KurlyHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const headerStyle = document.createElement('link');
    headerStyle.rel = 'stylesheet';
    headerStyle.href = '/components/header/header.css';

    const template = document.createElement('template');
    template.innerHTML = `
    <div class="header__wrapper">
      <header class="header">
        <div class="header__top">
          <div class="header__top-wrapper">
            <div class="header__logo-switch">
              <h1 class="header__logo">
                <a href="/">
                  <img src="/assets/logo.svg" alt="사과컬리 로고" />
                </a>
              </h1>
              <nav class="header__nav-switch font-w-600">
                <a href="/" class="header__switch-link site-main">사과컬리</a>
                <a href="#" class="header__switch-link site-beauty hover-color">사과뷰티</a>
              </nav>
            </div>
            <form class="header__search" role="search">
              <input
                type="text"
                class="header__search-input"
                placeholder="검색어를 입력해주세요."
                aria-label="검색어 입력"
              />
              <button
                type="submit"
                class="header__search-button"
                aria-label="검색"
              >
                <img src="/assets/svg/Search.svg" alt="검색" />
              </button>
            </form>
            <ul class="header__icon-list">
              <li>
                <a href="#">
                  <img src="/assets/svg/Location.svg" alt="배송지 등록" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/assets/svg/Heart.svg" alt="찜한 상품 목록" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/assets/svg/Group.svg" alt="장바구니" />
                </a>
              </li>
            </ul>
          </div>
          <ul class="header__member-service">
            <li class="header__member-item">
              <a href="#" class="header__member-link join">회원가입</a>
            </li>
            <div class="divider"></div>
            <li class="header__member-item">
              <a href="#" class="header__member-link">로그인</a>
            </li>
            <div class="divider"></div>
            <li class="header__member-item cs-center">
              <a href="#" class="header__member-link">
                고객센터
                <img src="/assets/svg/Icon_down.png" alt="펼치기" class="header__icon-down" />
              </a>
              <ul class="header__cs-menu">
                <li class="header__cs-menu-item">
                  <a href="#" class="header__cs-menu-link">공지사항</a>
                </li>
                <li class="header__cs-menu-item">
                  <a href="#" class="header__cs-menu-link">자주하는질문</a>
                </li>
                <li class="header__cs-menu-item">
                  <a href="#" class="header__cs-menu-link">1:1 문의</a>
                </li>
                <li class="header__cs-menu-item">
                  <a href="#" class="header__cs-menu-link">대량주문 문의</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <nav class="nav font-w-600" aria-label="상품 전체 카테고리">
          <ul class="nav__category" aria-haspopup="true" aria-expanded="false">
            <li>
              <img src="/assets/svg/Hamburger.svg" class="icon-gap-12" alt="카테고리" />
              <span class="hover-color">카테고리</span>
            </li>
            <ul class="nav__category-list">
              <li class="nav__category-item">
                <a href="#" class="nav__category-link">
                  <img src="/assets/svg/MenuIcon-Gift.svg" alt="선물하기" class="nav__category-icon icon-gap-8" />
                  <span class="hover-color">선물하기</span>
                </a>
              </li>
              <li class="nav__category-item">
                <a href="#" class="nav__category-link">
                  <img src="/assets/svg/MenuIcon-Vegetable.svg" alt="채소" class="nav__category-icon icon-gap-8" />
                  <span class="hover-color">채소</span>
                </a>
              </li>
              <li class="nav__category-item">
                <a href="#" class="nav__category-link">
                  <img src="/assets/svg/MenuIcon-Fruit.svg" alt="과일 · 견과 · 쌀" class="nav__category-icon icon-gap-8" />
                  <span class="hover-color">과일 · 견과 · 쌀</span>
                </a>
              </li>
              <li class="nav__category-item">
                <a href="#" class="nav__category-link">
                  <img src="/assets/svg/MenuIcon-SeaFood.svg" alt="수산 · 해산 · 건어물" class="nav__category-icon icon-gap-8" />
                  <span class="hover-color">수산 · 해산 · 건어물</span>
                </a>
              </li>
              <li class="nav__category-item">
                <a href="#" class="nav__category-link">
                  <img src="/assets/svg/MenuIcon-Meat.svg" alt="정육 · 계란" class="nav__category-icon icon-gap-8" />
                  <span class="hover-color">정육 · 계란</span>
                </a>
              </li>
            </ul>
          </ul>

          <ul class="nav__product-list">
            <li class="nav__product-item">
              <a href="#" class="nav__product-link hover-color">신상품</a>
            </li>
            <li class="nav__product-item">
              <a href="#" class="nav__product-link hover-color">베스트</a>
            </li>
            <li class="nav__product-item">
              <a href="#" class="nav__product-link hover-color">알뜰쇼핑</a>
            </li>
            <li class="nav__product-item">
              <a href="#" class="nav__product-link hover-color">특가/혜택</a>
            </li>
          </ul>
          <div class="nav__delivery">
            <a href="#"><span>샛별·하루</span> 배송안내</a>
          </div>
        </nav>
      </header>
    </div>
    `;

    const fragment = document.createDocumentFragment();
    fragment.appendChild(headerStyle);
    fragment.appendChild(template.content.cloneNode(true));
    this.shadowRoot.appendChild(fragment);

 
    // 스크롤 시 보이는 헤더 
//     window.addEventListener('scroll', () => {
//       const headerWrapper = this.shadowRoot.querySelector('.header__wrapper');
//       if (window.scrollY > 50) { 
//         headerWrapper.classList.add('header__wrapper--scrolled');
//       } else {
//         headerWrapper.classList.remove('header__wrapper--scrolled');
//       }
//     });
  }
}

customElements.define('ssagwakurly-header', KurlyHeader);