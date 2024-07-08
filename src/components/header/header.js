class KurlyHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const headerStyle = document.createElement('link');
    headerStyle.rel = 'stylesheet';
    headerStyle.href = '/components/header/header.css';

    const template = document.createElement('template');
    template.innerHTML = `
    <header class="header">
      <div class="header-wrapper">
        <div class="header__top">
          <div class="header__top-wrapper">
            <ul class="header__logo__switch">
              <h1 class="header__logo">
                <a href="/">
                  <img src="/assets/logo.svg" alt="사과컬리 로고" />
                </a>
              </h1>
              <li>
                <a href="/" class="header__switch-link kurly">사과컬리</a>
              </li>
              <li>
                <a href="#" class="header__switch-link beauty">사과뷰티</a>
              </li>
            </ul>
            <div class="header__search">
              <input
                type="text"
                class="header__search-input"
                placeholder="검색어를 입력해주세요."
              />
              <!-- 입력내용 삭제 버튼 추후 추가 -->
              <button
                type="submit"
                class="header__search-button"
                aria-label="검색"
                required
              >
                <img src="/assets/svg/Search.svg" alt="검색" />
              </button>
            </div>

            <ul class="header__icon-list">
              <li>
                <a href="#">
                  <img src="/assets/svg/Location.svg" alt="배송지 등록" />
                </a>
              </li>
              <li>
                <a href="#"></a
                ><img src="/assets/svg/Heart.svg" alt="찜한 상품 목록" />
              </li>
              <li>
                <a href="#"></a
                ><img src="/assets/svg/Group.svg" alt="장바구니" />
              </li>
            </ul>
          </div>

          <ul class="header__member-service">
            <li class="header__member-item">
              <a href="" class="header__member-link member-join">회원가입</a>
            </li>
            <div class="v-line"></div>
            <li class="header__member-item">
              <a href="" class="header__member-link">로그인</a>
            </li>
            <div class="v-line"></div>
            <li class="header__member-item">
              <a href="" class="header__member-link member-cs"
                >고객센터
                <span
                  ><img
                    id="icon-down"
                    src="/assets/svg/Icon_down.png"
                    alt="펼치기"
                /></span>
              </a>

              <ul class="cs-center">
                <li class="cs-center-item">
                  <a href="#" class="cs-center-link">공지사항</a>
                </li>
                <li class="cs-center-item">
                  <a href="#" class="cs-center-link">자주하는질문</a>
                </li>
                <li class="cs-center-item">
                  <a href="#" class="cs-center-link">1:1 문의</a>
                </li>
                <li class="cs-center-item">
                  <a href="#" class="cs-center-link">대량주문 문의</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <nav class="header__navigation" aria-label="상품 전체 카테고리">
          <div
            class="header__product-list"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img src="/assets/svg/Hamburger.svg" />
            <span>카테고리</span>

            <ul class="header__category__menu">
              <li class="header__category-item">
                <a href="" class="header__category-link">
                  <img
                    class="category-icon"
                    src="/assets/svg/MenuIcon-Gift.svg"
                    alt="선물하기"
                  />
                  <span>선물하기</span>
                </a>
              </li>
              <li class="header__category-item">
                <a href="" class="header__category-link">
                  <img
                    class="category-icon"
                    src="/assets/svg/MenuIcon-Vegetable.svg"
                    alt="채소"
                  />
                  <span>채소</span>
                </a>
              </li>
              <li class="header__category-item">
                <a a href="" class="header__category-link">
                  <img
                    class="category-icon"
                    src="/assets/svg/MenuIcon-Fruit.svg"
                    alt="과일 · 견과 · 쌀"
                  />
                  <span>과일 · 견과 · 쌀</span>
                </a>
              </li>
              <li class="header__category-item">
                <a href="" class="header__category-link">
                  <img
                    class="category-icon"
                    src="/assets/svg/MenuIcon-SeaFood.svg"
                    alt="수산 · 해산 · 건어물"
                  />
                  <span>수산 · 해산 · 건어물</span>
                </a>
              </li>
              <li class="header__category-item">
                <a href="" class="header__category-link">
                  <img
                    class="category-icon"
                    src="/assets/svg/MenuIcon-Meat.svg"
                    alt="정육 · 계란"
                  />
                  <span>정육 · 계란</span>
                </a>
              </li>
              <!-- 추가 카테고리 항목 -->
            </ul>
          </div>

          <ul class="header__menu-list">
            <li class="header__menu-item">
              <a href="" class="header__menu-link">신상품</a>
            </li>
            <li class="header__menu-item">
              <a href="" class="header__menu-link">베스트</a>
            </li>
            <li class="header__menu-item">
              <a href="" class="header__menu-link">알뜰쇼핑</a>
            </li>
            <li class="header__menu-item">
              <a href="" class="header__menu-link">특가/혜택</a>
            </li>
          </ul>
          <div class="header__menu-delivery">
            <a href="/"><span>샛별·하루</span> 배송안내</a>
          </div>
        </nav>
      </div>
    </header>
    `;

    const fragment = document.createDocumentFragment();
    fragment.appendChild(headerStyle);
    fragment.appendChild(template.content.cloneNode(true));
    this.shadowRoot.appendChild(fragment);
  }
}

customElements.define('ssagwakurly-header', KurlyHeader);
