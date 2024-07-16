import '/src/components/button/button.css';
import {
  addEventListeners,
  createCartAccordion,
} from '/src/components/cart-accordion/cartAccordion.js';
import '/src/components/footer/footer.js';
import '/src/components/header/header.js';
import { calcDiscountPrice, getStorage } from '/src/lib/index.js';
import '/src/pages/cart/cart.css';
import '/src/styles/global.css';

document.addEventListener('DOMContentLoaded', initializeCartPage);

async function initializeCartPage() {
  try {
    const cartData = (await getStorage('cart')) || [];
    const authData = (await getStorage('auth')) || { isAuth: false };

    if (cartData.length) {
      createCartAccordion(cartData);
      addEventListeners(cartData, updateCartSummary);
    } else {
      createCartAccordion([]);
      displayEmptyCartMessage();
    }

    updateCartSummary();
    updateOrderButton(authData.isAuth);
  } catch (error) {
    console.error('장바구니 데이터를 불러오는데 실패했습니다 ☹:', error);
  }
}

export function displayEmptyCartMessage() {
  const cartAccordionList = document.querySelector(
    '.cart-accordion__product-list'
  );
  if (
    cartAccordionList &&
    !cartAccordionList.querySelector('.empty-cart-message')
  ) {
    cartAccordionList.classList.add('empty__cart');
    const p = document.createElement('p');
    p.className = 'empty-cart-message';
    p.textContent = `장바구니에 담긴 상품이 없습니다`;
    cartAccordionList.appendChild(p);
  }
}

export function updateCartSummary() {
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = cartData.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const discountAmount = cartData.reduce(
    (sum, item) =>
      Math.trunc(
        sum +
          (item.price - calcDiscountPrice(item.price, item.discountRate)) *
            (item.quantity || 1)
      ),
    0
  );

  let deliveryCost = 0;
  if (totalAmount > 0) {
    deliveryCost = totalAmount >= 40000 ? 0 : 3000;
  }
  const estimatedAmount = totalAmount - discountAmount + deliveryCost;

  document.getElementById('totalAmount').textContent =
    `${totalAmount.toLocaleString()}원`;

  document.getElementById('discountAmount').textContent =
    discountAmount !== 0
      ? `-${discountAmount.toLocaleString()}원`
      : `${discountAmount.toLocaleString()}원`;

  document.getElementById('deliveryCost').textContent =
    deliveryCost !== 0
      ? `+${deliveryCost.toLocaleString()}원`
      : `${deliveryCost.toLocaleString()}원`;

  document.getElementById('estimatedAmount').textContent =
    `${estimatedAmount.toLocaleString()}원`;

  let freeShippingMessage = document.querySelector('.free-shipping-message');

  if (totalAmount > 0 && totalAmount < 40000) {
    const amountLeft = 40000 - totalAmount;

    if (!freeShippingMessage) {
      freeShippingMessage = document.createElement('p');
      freeShippingMessage.className = 'free-shipping-message';
      document
        .querySelector('.cart__total-section')
        .appendChild(freeShippingMessage);
    }
    freeShippingMessage.innerHTML = `${amountLeft.toLocaleString()}원 추가 주문 시 무료배송!`;
    freeShippingMessage.style.display = 'flex';
  } else if (freeShippingMessage) {
    freeShippingMessage.style.display = 'none';
  }
}

function updateOrderButton(isAuth) {
  const orderButton = document.getElementById('orderButton');
  if (isAuth) {
    orderButton.textContent = '주문하기';
  } else {
    orderButton.textContent = '로그인';
  }
}
