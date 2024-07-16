import '/src/components/stepper/stepper.js';
import {
  calcDiscountPrice,
  getPbImageURL,
  insertLast,
} from '/src/lib/index.js';
import initializeStepper from '/src/components/stepper/stepper.js';
import { updateCartSummary } from '/src/pages/cart/cart';

export function createAccordionItem(item, packagingType) {
  const discountedPrice = calcDiscountPrice(item.price, item.discountRate);
  const totalDiscountedPrice = discountedPrice * (item.quantity || 1);
  const totalOriginalPrice = item.price * (item.quantity || 1);

  const accordionItem = `
    <li class="cart-accordion__item">
      <label class="accordion__item--checkbox" for="cart-item-checkbox-${
        item.id
      }">
        <input type="checkbox" id="cart-item-checkbox-${item.id}" checked />
        <span class="icon icon--small icon--Checked"></span>
      </label>
      <a href="#" class="accordion__item--img-wrapper">
        <span class="item--img" style="background-image: url('${getPbImageURL(
          item
        )}')"></span>
      </a>
      <div class="accordion__item--info">
        <a>
          <p class="item--title text-overflow">${item.productName}</p>
          <p class="item--description text-overflow">${
            item.productDescription
          }</p>
        </a>
      </div>
      <div class="stepper" data-product-id="${item.id}">
        <button class="stepper__button--minus" type="button" aria-label="수량 내리기"></button>
        <span>${item.quantity || 1}</span>
        <button class="stepper__button--plus" type="button" aria-label="수량 올리기"></button>
      </div>
      <div class="accordion__item--total-price">
        <span aria-label="할인 가격" class="item--discounted-price">${totalDiscountedPrice.toLocaleString()}원</span>
        ${
          item.discountRate
            ? `<span aria-label="판매 가격" class="item--original-price">${totalOriginalPrice.toLocaleString()}원</span>`
            : ''
        }
      </div>
      <button class="accordion__item---delete-button" type="button">
        <span class="icon icon--large icon--delete"></span>
      </button>
    </li>
  `;

  insertLast(`.product__list.${packagingType}`, accordionItem);

  const stepperElement = document
    .querySelector(`#cart-item-checkbox-${item.id}`)
    .closest('.cart-accordion__item')
    .querySelector('.stepper');
  initializeStepper(stepperElement);

  stepperElement
    .querySelector('.stepper__button--minus')
    .addEventListener('click', () => updatePrice(item));
  stepperElement
    .querySelector('.stepper__button--plus')
    .addEventListener('click', () => updatePrice(item));
}

function updatePrice(item) {
  const stepperElement = document.querySelector(
    `.stepper[data-product-id="${item.id}"]`
  );
  const quantity = parseInt(
    stepperElement.querySelector('span').textContent,
    10
  );
  const discountedPrice = Math.trunc(
    calcDiscountPrice(item.price, item.discountRate)
  );
  const totalPrice = discountedPrice * quantity;

  const priceElement = stepperElement
    .closest('.cart-accordion__item')
    .querySelector('.item--discounted-price');
  priceElement.textContent = `${totalPrice.toLocaleString()}원`;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  if (cartItem) {
    cartItem.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  updateCartSummary();
}
