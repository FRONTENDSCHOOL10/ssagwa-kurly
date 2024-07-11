import csstext from '/src/components/header/header.css?inline';
import categoryMenuItem from '/src/components/header-category/headerCategory.js';

class KurlyHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
    <style>${csstext}</style>
    <div class="header__wrapper">
      <header class="header">
        <div class="header__top">
          <div class="header__middle-wrapper">
            <div class="header__logo-site-switch">
              <h1 class="header__logo">
                <a href="/">
                  <img src="/src/assets/logo.svg" alt="사과컬리" />
                </a>
              </h1>
              <nav class="header__site-switch">
                <a href="/" class="site-main">사과컬리</a>
                <a href="#" class="site-beauty">사과뷰티</a>
              </nav>
            </div>
            <form class="header__search" role="search">
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                aria-label="검색어 입력"
              />
              <button
                type="submit"
                
              >
                <img src="/src/assets/svg/Search.svg" alt="검색" />
              </button>
            </form>
            <ul class="header__icon-list">
              <li>
                <a href="#">
                  <img src="/src/assets/svg/Location.svg" alt="배송지 등록" />
                  <img src="/src/assets/svg/Location.svg" alt="배송지 등록" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/src/assets/svg/Heart.svg" alt="찜한 상품 목록" />
                  <img src="/src/assets/svg/Heart.svg" alt="찜한 상품 목록" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/src/assets/svg/Group.svg" alt="장바구니" />
                  <img src="/src/assets/svg/Group.svg" alt="장바구니" />
                </a>
              </li>
            </ul>
          </div>

          <ul class="header__member-service">
            <li class="header__member-item">
              <a href="#" class="header__member-link divider" id="signup"
                >회원가입</a
              >
            </li>
            <li class="header__member-item">
              <a href="#" class="header__member-link divider">로그인</a>
            </li>
            <li class="header__member-item">
              <a href="#" class="header__member-link">
                고객센터
                <img src="/src/assets/svg/Icon_down.png" alt="펼치기" />
                <img src="/src/assets/svg/Icon_down.png" alt="펼치기" />
              </a>
              <ul class="header__cs-menu">
                <li>
                  <a href="#">공지사항</a>
                </li>
                <li>
                  <a href="#">자주하는질문</a>
                </li>
                <li>
                  <a href="#">1:1 문의</a>
                </li>
                <li>
                  <a href="#">대량주문 문의</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

          <nav class="nav" aria-label="상품 전체 카테고리">
          <ul class="nav__category" aria-haspopup="true" aria-expanded="false">
            <li>
              <img src="/src/assets/svg/Hamburger.svg" alt="카테고리" />
              <img src="/src/assets/svg/Hamburger.svg" alt="카테고리" />
              <span>카테고리</span>
            </li>
            <li>
              <ul class="nav__category-list">
                <li class="nav__category-item">
                  <a href="#">
                    <img src="/src/assets/svg/MenuIcon-Gift.svg" alt="선물하기" />
                    <span>선물하기</span>
                  </a>
                </li>
                <li class="nav__category-item">
                  <a href="#">
                    <img src="/src/assets/svg/MenuIcon-Vegetable.svg" alt="채소" />
                    <span>채소</span>
                  </a>
                </li>
                <li class="nav__category-item">
                  <a href="#">
                    <img
                      src="/src/assets/svg/MenuIcon-Fruit.svg"
                      alt="과일 · 견과 · 쌀"
                    />
                    <span>과일 · 견과 · 쌀</span>
                  </a>
                </li>
                <li class="nav__category-item">
                  <a href="#">
                    <img
                      src="/src/assets/svg/MenuIcon-SeaFood.svg"
                      alt="수산 · 해산 · 건어물"
                    />
                    <span>수산 · 해산 · 건어물</span>
                  </a>
                </li>
                <li class="nav__category-item">
                  <a href="#">
                    <img
                      src="/src/assets/svg/MenuIcon-Meat.svg"
                      alt="정육 · 계란"
                    />
                    <span>정육 · 계란</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="nav__product-list">
            <li>
              <a href="#">신상품</a>
            </li>
            <li>
              <a href="#">베스트</a>
            </li>
            <li>
              <a href="#">알뜰쇼핑</a>
            </li>
            <li>
              <a href="#">특가/혜택</a>
            </li>
          </ul>
          <div class="nav__delivery">
            <a href="#"><span>샛별·하루</span> 배송안내</a>
          </div>
        </nav>
      </div>
    </header>
    `;

    const fragment = document.createDocumentFragment();
    fragment.appendChild(template.content.cloneNode(true));
    this.shadowRoot.appendChild(fragment);
  }

  connectedCallback() {
    categoryMenuItem(this.shadowRoot);

    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const headerWrapper = this.shadowRoot.querySelector('.header__wrapper');
    const nav = this.shadowRoot.querySelector('.nav');
    const searchInput = this.shadowRoot.querySelector('.header__search');
    const iconList = this.shadowRoot.querySelector('.header__icon-list');
    const navHeight = this.shadowRoot.querySelector('.nav').offsetHeight;

    const scrollY = window.scrollY;

    if (scrollY > navHeight) {
      nav.classList.add('scrolled');
      headerWrapper.classList.add('scrolled');
      searchInput.classList.add('scrolled');
      iconList.classList.add('scrolled');
    } else {
      headerWrapper.classList.remove('scrolled');
      nav.classList.remove('scrolled');
      searchInput.classList.remove('scrolled');
      iconList.classList.remove('scrolled');
    }
  }
}

customElements.define('ssagwakurly-header', KurlyHeader);
