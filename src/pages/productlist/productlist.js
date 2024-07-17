/* eslint-disable no-case-declarations */
import '/src/styles/global.css';
import '/src/components/pagenatior/pagenatior.css';
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import '/src/components/product_filter/filter.js';
import '/src/components/product/product.css';
import pb from '/src/api/pocketbase.js';
import {
  createFilterComponent,
  filterdata,
} from '/src/components/product_filter/filter.js';

import {
  getNode,
  insertLast,
  toggleClass,
  removeClass,
  addClass,
  getPbImageURL,
  calcDiscountPrice,
  comma,
  getNodes,
} from '/src/lib';

const perpage = 15;
let currentPage = 1;
let originalProducts = [];
let totalProducts = [];
let currentSortType = '추천순';

async function ProductsList() {
  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
    });

    const sortingContainer = getNode('.productlist-sortings ul');
    sortingContainer.addEventListener('click', handleSortingClick);

    originalProducts = records;
    totalProducts = records;
    const counting = getNode('.productlist-sorting__count');
    counting.textContent = `총 ${totalProducts.length}건`;
    updateProductList();
    updatePagination();

    createFilterComponent('productlist-filter', filterdata, handleFilterChange);

    // 초기 정렬 상태 설정
    currentSortType = '추천순';
    updateSortingUI();
    sortProducts(currentSortType);
  } catch (error) {
    console.error('제품을 가져오는 중 오류 발생:', error);
    console.error('Error details:', error);
  }
}

function handleFilterChange(filters) {
  totalProducts = filterProducts(originalProducts, filters);
  currentPage = 1;

  sortProducts(currentSortType);
  updateProductList();
  updatePagination();

  const counting = getNode('.productlist-sorting__count');
  counting.textContent = `총 ${totalProducts.length}건`;
}

function filterProducts(products, filters) {
  return products.filter((product) => {
    return Object.entries(filters).every(([key, values]) => {
      if (!values || values.length === 0) return true;

      switch (key) {
        case 'category':
          return values.includes(product.category);
        case 'delivery':
          return values.includes(product.Delivery);
        case 'price':
          const price = calcDiscountPrice(
            Number(product.price),
            Number(product.discountRate)
          );
          return isPriceInRange(price, values[0]);
        case 'brand':
          return values.includes(product.brand);
        case 'benefit':
          return values.some((benefit) => {
            if (benefit === '할인상품') return Number(product.discountRate) > 0;
            if (benefit === '한정수량') return product.limitCount;
            return false;
          });
        case 'type':
          return values.some((type) => {
            if (type === 'Kurly Only') return product.kurlyOnly;
            return false;
          });
        case 'exclude':
          return values.some((exclude) => {
            if (exclude === '반려동물 상품') return !product.isPetProduct;
            return false;
          });
        default:
          return true;
      }
    });
  });
}

function isPriceInRange(price, range) {
  const [min, max] = range
    .split(' ~ ') //~기준으로 나눔
    .map((v) => parseInt(v.replace(/[^0-9]/g, ''))); //숫자가아닌 모든문자제거 그리고 parseINt로 정수로변환
  if (range.includes('미만')) {
    return price < min;
  } else if (range.includes('이상')) {
    return price >= min;
  } else {
    return price >= min && price <= max;
  }
}

function sortProducts(sortType) {
  currentSortType = sortType;
  let sortedProducts = [...totalProducts];

  switch (sortType) {
    case '추천순':
      sortedProducts;
      break;
    case '신상품순':
      sortedProducts.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case '판매량순':
      sortedProducts;
      break;
    case '할인율순':
      sortedProducts.sort((a, b) => b.discountRate - a.discountRate);
      break;
    case '낮은 가격순':
    case '높은 가격순':
      sortedProducts.sort((a, b) => {
        const priceA = calcDiscountPrice(
          Number(a.price),
          Number(a.discountRate)
        );
        const priceB = calcDiscountPrice(
          Number(b.price),
          Number(b.discountRate)
        );
        return sortType === '낮은 가격순' ? priceA - priceB : priceB - priceA;
      });
      break;
    default:
      sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
  }

  totalProducts = sortedProducts;
  updateSortingUI();
  updateProductList();
  updatePagination();

  const counting = getNode('.productlist-sorting__count');
  counting.textContent = `총 ${totalProducts.length}건`;
}

function updateProductList() {
  const productsContainer = getNode('.products');
  productsContainer.innerHTML = '';

  const firstIndex = (currentPage - 1) * perpage;
  const lastIndex = firstIndex + perpage;
  const pageProducts = totalProducts.slice(firstIndex, lastIndex);

  pageProducts.forEach((item) => {
    const price = Number(item.price);
    const discountRate = Number(item.discountRate);
    const hasDiscount = discountRate !== 0 && item.discountRate !== '';
    const discountPrice = hasDiscount
      ? Math.ceil(calcDiscountPrice(price, discountRate))
      : price;
    const template = `
        <li class="product__wrapper">
          <div class="product__image-wrapper">
            <a href="/src/pages/product/?product=${item.id}" class="product__link">
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
          <a href="/src/pages/product/?product=${item.id}" class="product__link">
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

function handleSortingClick(event) {
  event.preventDefault();
  const clickedElement = event.target.closest('.productlist-sorting');
  if (!clickedElement) return;

  currentSortType = clickedElement.textContent.trim();
  updateSortingUI();
  sortProducts(currentSortType);
}

function updateSortingUI() {
  getNodes('.productlist-sorting').forEach((el) => {
    if (el.textContent.trim() === currentSortType) {
      addClass(el, 'productlist-sorting--is-active');
    } else {
      removeClass(el, 'productlist-sorting--is-active');
    }
  });
}

document.addEventListener('DOMContentLoaded', ProductsList);
getNode('.paginator').addEventListener('click', handlePaginationClick);
