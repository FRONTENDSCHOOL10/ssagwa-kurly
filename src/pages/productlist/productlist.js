import '/src/styles/global.css';
import '/src/components/pagenatior/pagenatior.css';
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import '/src/components/product_filter/filter.js';
import '/src/components/product/product.css';
import pb from '/src/api/pocketbase.js';

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

const perpage = 15; //한페이지당 표시할갯수
let currentPage = 1; // 현재 페이지 1부터시작해야함
let totalProducts = []; //모든 상품 배열임

async function ProductsList() {
  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created',
    });
    //이건 정렬 이벤트추가해준거
    const sortingContainer = getNode('.productlist-sortings ul');
    sortingContainer.addEventListener('click', handleSortingClick);

    totalProducts = records;
    const counting = getNode('.productlist-sorting__count');
    counting.textContent = `총 ${totalProducts.length}건`;
    updateProductList();
    updatePagination();
  } catch (error) {
    console.error('제품을 가져오는 중 오류 발생:', error);
    console.error('Error details:', error);
  }
}

async function sortProducts(sortType) {
  let sortedProducts;

  try {
    const records = await pb.collection('products').getFullList({
      sort: '-created', // 기본정렬이 추천수지만 없어서 최신순
    });

    switch (sortType) {
      case '추천순':
        sortedProducts = records; // 추천순 없어서 최신순
        break;
      case '신상품순':
        sortedProducts = records; // 최신순
        break;
      case '판매량순':
        sortedProducts = records; //이것도 최신순
        break;
      case '할인율순':
        sortedProducts = records.sort(
          (a, b) => b.discountRate - a.discountRate
        );
        break;
      case '낮은 가격순':
      case '높은 가격순': {
        const DiscountPrice = records.map((records) => ({
          ...records,
          discountedPrice: Math.ceil(
            calcDiscountPrice(
              Number(records.price),
              Number(records.discountRate)
            )
          ),
        }));

        sortedProducts = DiscountPrice.sort((a, b) => {
          return sortType === '낮은 가격순'
            ? a.discountedPrice - b.discountedPrice
            : b.discountedPrice - a.discountedPrice;
        });
        break;
      }
      default:
        sortedProducts = records;
    }

    totalProducts = sortedProducts;
    currentPage = 1;
    updateProductList();
    updatePagination();
  } catch (error) {
    console.error('정렬된 제품을 가져오는 중 오류 발생:', error);
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
      ? Math.ceil(calcDiscountPrice(price, discountRate))
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
  const totalPages = Math.ceil(totalProducts.length / perpage); //전체 제품수를 페이지당 제품수로 나눴습니다

  let newPage;
  switch (pageAction) {
    case 'first':
      newPage = 1;
      break;
    case 'prev':
      newPage = Math.max(1, currentPage - 1); //현재페이지 +1
      break;
    case 'next':
      newPage = Math.min(totalPages, currentPage + 1); //현재페이지 -1
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

  getNodes('.productlist-sorting').forEach((rm) => {
    removeClass(rm, 'productlist-sorting--is-active');
  });

  addClass(clickedElement, 'productlist-sorting--is-active');

  const sortType = clickedElement.textContent.trim();
  sortProducts(sortType);
}

document.addEventListener('DOMContentLoaded', ProductsList);
getNode('.paginator').addEventListener('click', handlePaginationClick);
