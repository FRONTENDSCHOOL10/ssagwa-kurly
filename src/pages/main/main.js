import '/src/pages/main/main.css';

import '/src/styles/global.css';
import '/src/components/product/product.css'

import pb from "/src/api/pocketbase.js";
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import viewPopup from '/src/components/popup/popup.js';
import { slideSwiper } from '/src/pages/main/swiper.js';
import { comma, calcDiscountPrice, getNode, getNodes } from "/src/lib/index.js";
import { addRecentProduct } from '/src/components/recent-product/recent-product.js';

const mainElement = getNode('main');

viewPopup(mainElement);
addRecentProduct();

document.addEventListener('DOMContentLoaded', function () {
  slideSwiper();
});


async function fetchAndDisplayProducts() {
  try {
    const records = await pb.collection('products').getList(1, 50, {
      sort: '-created',
    });

    const productsContainers = getNodes('.product__list');

    records.items.forEach((item) => {
      const price = Number(item.price);
      const discountRate = Number(item.discountRate);
      const hasDiscount = discountRate !== 0 && item.discountRate !== '';
      const discountPrice = hasDiscount
      ? calcDiscountPrice(price, discountRate)
      : price;

      const template = `
        <li class="product__wrapper swiper-slide">
            <a href="/src/pages/product/?product=${item.id}" class="product__link">
              <figure class="product__visual" aria-label="상품 이미지">
                <img src="${pb.getFileUrl(item, item.productImg)}" alt="${item.productName}" />
                <figcaption class="sr-only">상품 이미지: ${item.productName}</figcaption>
              </figure></a>
              <button type="button" class="product__basket" aria-label="장바구니에 상품 담기">
                <img src="/svg/Cart-1.svg" alt="장바구니 아이콘" aria-hidden="true"/>담기
              </button>
              <a href="/src/pages/product/?product=${item.id}" class="product__link">
              <div class="product__details">
                <span class="product__delivery" aria-label="배송 설명">${item.Delivery}</span>
                <span class="product__title" aria-label="상품이름">${item.productName}</span>
                <div class="product__price--wrap">
                  ${hasDiscount ? `<div class="product__discount" aria-label="할인율">${discountRate}%</div>`  : ''}
                  <div class="product__real-price" aria-label="가격"> ${comma( discountPrice )}원</div>
                </div>
                ${hasDiscount  ? `<span class="product__price" aria-label="원가">${comma( price )}원</span>`  : ''}
                <span class="product__description" aria-label="상품 설명">${item.productDescription}</span>
                <div class="product__tag">
                  ${item.kurlyOnly  ? `<span class="tag--only tag--primary">${item.kurlyOnlyText || 'Kurly Only'}</span>`  : ''}
                  ${item.limitCount  ? `<span class="tag--only">${item.limitCountText || '한정수량'}</span>`  : ''}
                </div>
              </div>
            </a>
        </li>
      `;
      
      productsContainers.forEach((container) => {
        container.insertAdjacentHTML('beforeend', template);
      });
    });

    
    
  } catch (error) {
    console.error('제품을 가져오는 중 오류 발생:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayProducts);
