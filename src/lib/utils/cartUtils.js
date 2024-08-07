import { setStorage, getStorage } from './storage.js';
import { openCartTooltip } from '/src/components/tooltip/tooltip.js';
import openCartModal from '/src/components/cart-modal/cartModal.js';
import pb from '/src/api/pocketbase.js';

/**
 * addToCart()
 * '장바구니에 담기' 버튼 클릭 시 장바구니 모달을 띄우지 않고
 * 툴팁 알림만 띄우고 장바구니에 상품을 담는 함수
 */
export async function addToCart(product, quantity) {
  let cart = await getStorage('cart');

  if (!Array.isArray(cart)) {
    cart = [];
  }

  const existingItem = cart.find((item) => item.id === product.id);
  const isDuplicate = !!existingItem;

  if (isDuplicate) {
    existingItem.quantity += quantity;
  } else {
    product.quantity = quantity;
    cart.push(product);
  }

  await setStorage('cart', cart);
  openCartTooltip(product, isDuplicate);
}

/**
 * addToCartwithModal()
 * '장바구니에 담기' 버튼 클릭 시 장바구니 모달을 띄워 수량을 저장한 후
 * addToCart 함수 호출
 */
export function addToCartwithModal(e) {
  const button = e.target.closest('button');
  if (!button) return;

  let product;
  try {
    product = button.dataset.product
      ? JSON.parse(button.dataset.product)
      : null;

    // 버튼에 data-product 속성이 없는 경우 추가
    if (!product) {
      const productLink = button
        .closest('.product__wrapper')
        .querySelector('.product__link');
      const productId = new URLSearchParams(productLink.search).get('product');

      if (!productId) {
        throw new Error('유효한 제품 ID가 없습니다.');
      }

      // 제품 ID를 이용해 제품 정보를 가져오기
      product = pb.collection('products').getOne(productId);
      button.dataset.product = JSON.stringify(product);
    }
  } catch (e) {
    console.error('유효한 JSON 데이터가 아니에요 ☹:', button.dataset.product);
    return;
  }

  openCartModal(product, async (quantity) => {
    await addToCart(product, quantity);
  });
}
