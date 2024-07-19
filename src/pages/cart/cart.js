import '/src/pages/cart/cart.css';

import '/src/styles/global.css';
import '/src/components/button/button.css';

import '/src/components/footer/footer.js';
import '/src/components/header/header.js';
import {
  addEventListeners,
  createCartAccordion,
} from '/src/components/cart-accordion/cartAccordion.js';
import { calcDiscountPrice, getStorage } from '/src/lib/index.js';

document.addEventListener('DOMContentLoaded', initializeCartPage);

async function initializeCartPage() {
  try {
    const cartData = (await getStorage('cart')) || [];
    const authData = (await getStorage('auth')) || { isAuth: false };

    if (cartData.length) {
      createCartAccordion(cartData);
      updateDeliveryType(cartData);
      addEventListeners(cartData, updateCartSummary);
    } else {
      createCartAccordion([]);
      displayEmptyCartMessage();
    }

    updateCartSummary();
    updateOrderButton(authData);
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
  const checkboxes = document.querySelectorAll(
    '.accordion__item--checkbox input[type="checkbox"]'
  );

  let totalAmount = 0;
  let discountAmount = 0;

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const item = cartData[index];
      totalAmount += item.price * (item.quantity || 1);
      discountAmount +=
        (item.price - calcDiscountPrice(item.price, item.discountRate)) *
        (item.quantity || 1);
    }
  });

  discountAmount = Math.trunc(discountAmount);

  const netAmount = totalAmount - discountAmount;
  let deliveryCost = 0;
  if (netAmount > 0) {
    deliveryCost = netAmount >= 40000 ? 0 : 3000;
  }
  const estimatedAmount = netAmount + deliveryCost;

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

  if (netAmount > 0 && netAmount < 40000) {
    const amountLeft = 40000 - netAmount;
    if (!freeShippingMessage) {
      freeShippingMessage = document.createElement('p');
      freeShippingMessage.className = 'free-shipping-message';
      document
        .querySelector('.cart__total-section')
        .appendChild(freeShippingMessage);
    }
    freeShippingMessage.innerHTML = `${amountLeft.toLocaleString()}원 추가 주문 시 무료배송!`;
    freeShippingMessage.style.display = 'block';
  } else if (freeShippingMessage) {
    freeShippingMessage.style.display = 'none';
  }
}

function updateDeliveryType(cartData) {
  const deliveryType = document.querySelector('.delivery-type');
  if (deliveryType && cartData.length > 0) {
    deliveryType.textContent = cartData[0].Delivery;
  }
}

function updateOrderButton(authData) {
  const orderButton = document.getElementById('orderButton');
  const Location = document.querySelector('.cart__total-delivery');
  if (authData.isAuth) {
    orderButton.textContent = '주문하기';
    Location.style.display = 'block';
    Location.querySelector('.delivery-location-info').innerHTML = `
      <p class="delivery-location-info__address">
        ${authData.user.adress + "<br />" + authData.user.otherAdress}
      </p>
      `;
  } else {
    orderButton.textContent = '로그인';
    Location.style.display = 'none';
  }
}
