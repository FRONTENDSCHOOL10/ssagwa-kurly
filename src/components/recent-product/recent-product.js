import '/src/components/recent-product/recent-product.css';

import { setStorage, getStorage } from '/src/lib/utils/storage.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

// viewProduct 함수를 전역 스코프에 노출 (다른 스크립트에서 사용할 수 있도록)
// window.viewProduct = renderRecentProducts;

const LATELY_VIEW_ITEM_EXPIRATION_DATE = 1; // 유효기간 일수
const LATELY_VIEW_MAX_SAVE_COUNT = 15; // 저장할 수 있는 아이템 개수

export function addRecentProduct() {
  const template = `
  <div class="recent-product">
    <div class="swipper-button_previous"></div>
    <p class="recent-product_title">최근 본 상품</p>
    <div class="product-list">
      <div class="swiper-wrapper">
      </div>
    </div>
    <div class="swipper-button_next"></div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', template);

  const swiper = new Swiper('.product-list', {
    direction: 'vertical',
    slidesPerView: 2.7,
    spaceBetween: 20,
    slidesOffsetAfter: 20,
    navigation: {
      nextEl: '.swipper-button_next',
      prevEl: '.swipper-button_previous',
    },
  });

  // 최근 본 아이템 초기화
  async function initRecentProduct() {
    try {
      // 로컬 스토리지에서 최근 본 아이템 가져옴
      let viewItemList = await getStorage('viewedProduct');
      // 빈 값일 경우 빈 배열 출력
      if (!viewItemList) {
        viewItemList = [];
      }

      const nowDate = new Date();
      // 유효기간을 밀리초로 변환
      const ValidityTime =
        LATELY_VIEW_ITEM_EXPIRATION_DATE * 24 * 60 * 60 * 1000;

      // 유효기간 1일이 지난 상품 제거
      viewItemList = viewItemList.filter(
        (item) =>
          nowDate.getTime() < new Date(item.viewTime).getTime() + ValidityTime
      );

      // 로컬스토리지에 삭제한 상품 저장
      await setStorage('viewedProduct', viewItemList);
      console.log(viewItemList);

      // 최근 본 아이템 화면에 렌더
      renderRecentProducts();
    } catch (error) {
      console.error('최근 본 아이템 초기화 실패', error);
    }
  }

  // 최근 본 상품 렌더링
  async function renderRecentProducts() {
    // 로컬 스토리지에서 최근 본 상품 목록 가져옴
    try {
      const viewedProductList = await getStorage('viewedProduct');
      // 배열의 길이가 0보다 크면 실행
      if (viewedProductList.length > 0) {
        viewedProductList.forEach((product) => {
          const template = `
        <a class="swiper-slide" href="/src/pages/product/?product=${product.id}"><img src="${product.thumbImg}" alt="${product.thumbImgAlt}" /></a>
      `;
          swiper.appendSlide(template);
        });
      }

      swiper.update();
    } catch (error) {
      console.error('최근 본 아이템 렌더링 실패', error);
    }
  }

  // 문서 로드 시 최근 본 상품 초기화 및 렌더링
  document.addEventListener('DOMContentLoaded', initRecentProduct);
}

//  로컬스토리지에 상품 저장
export async function setRecentProduct(productId, productImgURL, productName) {
  try {
    const viewTime = new Date().toISOString();

    const product = {
      id: productId,
      thumbImg: productImgURL,
      thumbImgAlt: productName,
      viewTime,
    };

    // local storage에 저장되어 있는 viewedProduct 값 가져옴
    let viewedProduct = await getStorage('viewedProduct');

    // 만약 아무것도 저장되어 있지 않다면 배열 만들어 viewedProduct 저장
    if (!viewedProduct) {
      viewedProduct = [];
      viewedProduct.push(product);
      setStorage('viewedProduct', viewedProduct);
      return;
    }

    // 이미 저장되어 있는 product라면 삭제한 뒤 unshift 이용해서 배열의 가장 앞에 저장
    viewedProduct.forEach((item, i) => {
      if (item.id === productId) {
        viewedProduct.splice(i, 1);
        return i;
      }
    });
    viewedProduct.unshift(product);

    // 최대 15개의 상품 저장
    setStorage(
      'viewedProduct',
      viewedProduct.slice(0, LATELY_VIEW_MAX_SAVE_COUNT)
    );
  } catch (error) {
    console.error('최근 본 아이템 저장 실패', error);
  }
}
