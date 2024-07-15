import '/src/styles/global.css';
import '/src/components/pagenatior/pagenatior.css';
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import '/src/components/product_filter/filter.js';
import '/src/components/product/product.css';
import pb from '/src/api/pocketbase.js';
import { comma } from '/src/lib/math/comma.js';
import { calcDiscountPrice } from '/src/lib/math';
import {
  getNode,
  insertLast,
  toggleClass,
  removeClass,
  getPbImageURL,
} from '/src/lib';

const perpage = 15; //한페이지당 표시할갯수
let currentPage = 1; // 현재 페이지 1부터시작해야함
let totalProducts = []; //모든 상품 배열임

async function ProductsList() {
  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
    });

    totalProducts = records;
    updateProductList();
    updatePagination();
  } catch (error) {
    console.error('제품을 가져오는 중 오류 발생:', error);
    console.error('Error details:', error);
  }
}

function updateProductList() {
  const productsContainer = getNode('.products');
  productsContainer.innerHTML = '';

  const firstIndex = (currentPage - 1) * perpage;
  const lastIndex = firstIndex + perpage;
  const pageProducts = totalProducts.slice(firstIndex, lastIndex); //첫번째인덱스부터 마지막인덱스직전까지 새배열로반환해주기

  pageProducts.forEach((item) => {
    const price = Number(item.price);
    const discountRate = Number(item.discountRate);
    const hasDiscount = discountRate !== 0 && item.discountRate !== '';
    const discountPrice = hasDiscount
      ? calcDiscountPrice(price, discountRate)
      : price;

    const template = `
        <li class="product__wrapper">
          <div class="product__image-wrapper">
            <a href="#" class="product__link">
              <figure class="product__visual" aria-label="상품 이미지">
                <img src="${getPbImageURL(item)}" alt="${item.productName}" />
                <figcaption class="sr-only">상품 이미지: ${
                  item.productName
                }</figcaption>
              </figure>
            </a>
          </div>
          <button type="button" class="product__basket" aria-label="장바구니에 상품 담기">
            <img src="/svg/Cart-1.svg" alt="장바구니 아이콘" aria-hidden="true"/>담기
          </button>
          <a href="#" class="product__link">
            <div class="product__details">
              <span class="product__delivery" aria-label="배송 설명">${
                item.Delivery
              }</span>
              <span class="product__title" aria-label="상품이름">${
                item.productName
              }</span>
              <div class="product__price--wrap">
                ${
                  hasDiscount
                    ? `<div class="product__discount" aria-label="할인율">${discountRate}%</div>`
                    : ''
                }
                <div class="product__real-price" aria-label="가격">${comma(
                  discountPrice
                )}원</div>
              </div>
              ${
                hasDiscount
                  ? `<span class="product__price" aria-label="원가">${comma(
                      price
                    )}원</span>`
                  : ''
              }
              <span class="product__description" aria-label="상품 설명">${
                item.productDescription
              }</span>
              <div class="product__tag">
                ${
                  item.kurlyOnly
                    ? `<span class="tag--only tag--primary">${
                        item.kurlyOnlyText || 'Kurly Only'
                      }</span>`
                    : ''
                }
                ${
                  item.limitCount
                    ? `<span class="tag--only">${
                        item.limitCountText || '한정수량'
                      }</span>`
                    : ''
                }
              </div>
            </div>
          </a>
        </li>
      `;
    insertLast('.products', template);
  });
}
console.log('VITE_PB_API:', import.meta.env.VITE_PB_API);
function updatePagination() {
  const totalPages = Math.ceil(totalProducts.length / perpage);
  const pageNumbersContainer = getNode('.page-numbers');
  pageNumbersContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.className = `pagelinks ${
      i === currentPage ? 'pagelinks--is-selected disabled' : ''
    }`;
    pageLink.dataset.page = i;
    pageLink.textContent = i;
    pageNumbersContainer.appendChild(pageLink);
  }

  //페이지네이션 버튼 상태 업데이트
  updatePaginatiorButtonStates(totalPages);
}

function updatePaginatiorButtonStates(totalPages) {
  const firstButton = getNode('[data-page="first"]');
  const prevButton = getNode('[data-page="prev"]');
  const nextButton = getNode('[data-page="next"]');
  const lastButton = getNode('[data-page="last"]');

  toggleClass(firstButton, 'disabled', currentPage === 1);
  toggleClass(prevButton, 'disabled', currentPage === 1);
  toggleClass(nextButton, 'disabled', currentPage === totalPages);
  toggleClass(lastButton, 'disabled', currentPage === totalPages);
}

function handlePaginationClick(event) {
  event.preventDefault();
  const clickedElement = event.target.closest('a');
  if (!clickedElement || removeClass(clickedElement, 'disabled')) return;

  const pageAction = clickedElement.dataset.page;
  const totalPages = Math.ceil(totalProducts.length / perpage);

  let newPage;
  switch (pageAction) {
    case 'first':
      newPage = 1;
      break;
    case 'prev':
      newPage = Math.max(1, currentPage - 1);
      break;
    case 'next':
      newPage = Math.min(totalPages, currentPage + 1);
      break;
    case 'last':
      newPage = totalPages;
      break;
    default:
      newPage = parseInt(pageAction);
  }

  if (newPage !== currentPage) {
    currentPage = newPage;
    updateProductList();
    updatePagination();

    window.scrollTo({
      top: 0,
    });
  }
}

document.addEventListener('DOMContentLoaded', ProductsList);
getNode('.paginator').addEventListener('click', handlePaginationClick);
