import '/src/components/cart-modal/cartModal.css';

import '/src/components/button/button.css';
import '/src/components/stepper/stepper.css';
import { openCartTooltip } from '/src/components/tooltip/tooltip.js';
import { calcDiscountPrice } from '/src/lib/index.js';

export default function openCartModal(product) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modalContainer');

  let quantity = 1;

  modalContainer.innerHTML = `
  <section
    class="cart-modal"
    id="cart-modal"
    role="dialog"
    aria-labelledby="product-title"
    aria-hidden="true"
  >
    <div class="cart-modal__content" role="document">
      <div class="cart-modal__wrapper">
        <header>
          <h2 id="product-title" class="cart-modal__title">
            ${product.productName}
          </h2>
        </header>
        <div class="cart-modal__details">
          <div class="cart-modal__wrapper">
            <span class="cart-modal__product-price">${product.price.toLocaleString()}원</span>
            ${
              product.discountRate
                ? `<span class="cart-modal__product-og-price">${calcDiscountPrice(
                    product.price,
                    product.discountRate
                  ).toLocaleString()}원</span>`
                : ''
            }
          </div>
          <div class="stepper">
            <button
              class="stepper__button--minus"
              type="button"
              aria-label="수량 내리기"
              disabled
            ></button>
            <span>1</span>
            <button
              class="stepper__button--plus"
              type="button"
              aria-label="수량 올리기"
            ></button>
          </div>
        </div>
      </div>
      <div class="cart-modal__summary">
        <span>합계</span>
        <div class="cart-modal__total">
          <span class="cart-modal__total-price">${product.price.toLocaleString()}원</span>
        </div>
      </div>
      <section class="cart-modal__buttons">
        <button
          type="submit"
          aria-label="기본 투명 버튼"
          class="button--large button--transparent close-modal"
        >
          취소
        </button>
        <button
          type="submit"
          aria-label="기본 색상 버튼"
          class="button--large button--primary add-to-cart "
        >
          장바구니 담기
        </button>
      </section>
    </div>
  </section>
  `;

  document.body.appendChild(modalContainer);

  const closeModalButton = modalContainer.querySelector('.close-modal');
  const addToCartButton = modalContainer.querySelector('.add-to-cart');
  const minusButton = modalContainer.querySelector('.stepper__button--minus');
  const plusButton = modalContainer.querySelector('.stepper__button--plus');
  const quantityDisplay = modalContainer.querySelector('.stepper span');
  const totalPriceDisplay = modalContainer.querySelector(
    '.cart-modal__total-price'
  );

  plusButton.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
    totalPriceDisplay.textContent =
      (product.price * quantity).toLocaleString() + '원';
    if (quantity > 1) {
      minusButton.disabled = false;
    }
  });

  minusButton.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      totalPriceDisplay.textContent =
        (product.price * quantity).toLocaleString() + '원';
      if (quantity === 1) {
        minusButton.disabled = true;
      }
    }
  });

  closeModalButton.addEventListener('click', () => {
    modalContainer.remove();
  });

  addToCartButton.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item.id === product.id);
    const isDuplicate = !!existingItem;

    if (isDuplicate) {
      existingItem.quantity += quantity;
    } else {
      product.quantity = quantity;
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    openCartTooltip(product, isDuplicate);

    modalContainer.remove();
  });

  const cartModal = document.getElementById('cart-modal');
  cartModal.classList.add('is-visible');
}
