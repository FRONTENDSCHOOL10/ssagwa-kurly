import '/src/components/cart-accordion/cartAccordion.css';
import { initializeStepper } from '/src/components/stepper/stepper.js';
import { comma } from '/src/lib/index.js';
import { calculateTotals, updateTotals } from '/src/pages/cart/cart.js';

export function renderCartAccordion(accordionData) {
  const totalItems = accordionData.products.reduce(
    (total, product) => total + product.items.length,
    0
  );

  const template = `
    <div class="cart-accordion">
      <div class="product-section-bar">
        <div class="product-section-bar-container">
          <label class="select-all-checkbox" for="select-all-checkbox-top">
            <input type="checkbox" id="select-all-checkbox-top" checked/>
            <span class="icon icon--small icon--Checked"></span>
            <span class="all">전체선택 (/${totalItems})</span>
          </label>
          <span class="divider"></span>
          <button type="button" id="select-btn">선택삭제</button>
        </div>
      </div>
      <div class="cart-accordion__main">
        ${accordionData.products
          .map(
            (product, productIndex) => `
          <h4 class="cart-accordion__heading">
            <span class="product__status" id="cart-accordion__title">
              <span class="icon icon--large icon--${product.type}" aria-hidden="true"></span>
              ${product.typeName}
            </span>
            <button class="cart-accordion__toggle-button">
            <span class="icon icon--large icon--arrow-up"></span>
            </button>
          </h4>
          <ul class="cart-accordion__product-list">
            ${product.items
              .map(
                (item, itemIndex) => `
              <li class="product__list" data-product-index="${productIndex}" data-item-index="${itemIndex}">
                <label class="product__list-checkbox" for="product-checkbox-${productIndex}-${itemIndex}">
                  <input type="checkbox" id="product-checkbox-${productIndex}-${itemIndex}" checked/>
                  <span class="icon icon--small icon--Checked"></span>
                </label>
                <a href="#" class="product__list-image">
                  <span class="product-image" style="background-image: url('${item.img}')"></span>
                </a>
                <div class="product__info">
                  <a>
                    <p class="product__title text-overflow">${item.title}</p>
                    <p class="product__description text-overflow">${item.description}</p>
                  </a>
                </div>
                <div class="stepper">
                  <button class="stepper__button--minus" type="button" aria-label="수량 내리기" disabled></button>
                  <span>1</span>
                  <button class="stepper__button--plus" type="button" aria-label="수량 올리기"></button>
                </div>
                <div class="product__total-price">
                  <span aria-label="할인 가격" class="product__discounted-price" data-unit-price="${item.discountedPrice}">${comma(item.discountedPrice)}원</span>
                  <span aria-label="판매 가격" class="product__original-price" style="display: ${item.displayOriginalPrice ? 'inline' : 'none'};" data-unit-price="${item.originalPrice}">${comma(item.originalPrice)}원</span>
                </div>
                <button class="product-delete-button" type="button">
                  <span class="icon icon--large icon--delete"></span>
                </button>
              </li>
            `
              )
              .join('')}
          </ul>
        `
          )
          .join('')}
      </div>
      <div class="product-section-bar">
        <div class="product-section-bar-container">
          <label class="select-all-checkbox" for="select-all-checkbox-bottom">
            <input type="checkbox" id="select-all-checkbox-bottom" checked/>
            <span class="icon icon--small icon--Checked"></span>
            <span class="all">전체선택 (/${totalItems})</span>
          </label>
          <span class="divider"></span>
          <button type="button" id="select-btn">선택삭제</button>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = template;

  addAccordionEventListeners(container, totalItems, accordionData.products);

  return container.firstElementChild;
}

function addAccordionEventListeners(container, totalItems, products) {
  const toggleButtons = container.querySelectorAll('.cart-accordion__toggle-button');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const productList = this.closest('h4').nextElementSibling;
      const toggleIcon = this.querySelector('.icon');

      if (toggleIcon.classList.contains('icon--arrow-up')) {
        productList.style.display = 'none';
        toggleIcon.classList.remove('icon--arrow-up');
        toggleIcon.classList.add('icon--arrow-down');
      } else {
        productList.style.display = 'block';
        toggleIcon.classList.remove('icon--arrow-down');
        toggleIcon.classList.add('icon--arrow-up');
      }
    });
  });

  const selectAllCheckboxes = container.querySelectorAll('.select-all-checkbox input[type="checkbox"]');
  const productItemCheckboxes = container.querySelectorAll('.product__list-checkbox input[type="checkbox"]');
  const selectAllLabels = container.querySelectorAll('.all');

  selectAllCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const isChecked = this.checked;

      productItemCheckboxes.forEach((productCheckbox) => {
        productCheckbox.checked = isChecked;
        updateCheckboxIcon(productCheckbox);
      });

      selectAllCheckboxes.forEach((allCheckbox) => {
        allCheckbox.checked = isChecked;
        updateCheckboxIcon(allCheckbox);
      });

      updateSelectAllLabels();
    });
  });

  productItemCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      updateCheckboxIcon(this);
      updateSelectAllLabels();
      updateSelectAllCheckboxes();
    });
  });

  function updateCheckboxIcon(checkbox) {
    const checkboxIcon = checkbox.nextElementSibling;
    if (checkboxIcon) {
      if (checkbox.checked) {
        checkboxIcon.classList.remove('icon--UnChecked');
        checkboxIcon.classList.add('icon--Checked');
      } else {
        checkboxIcon.classList.remove('icon--Checked');
        checkboxIcon.classList.add('icon--UnChecked');
      }
    }
  }

  function updateSelectAllLabels() {
    const checkedCount = container.querySelectorAll('.product__list-checkbox input[type="checkbox"]:checked').length;
    selectAllLabels.forEach((label) => {
      label.innerHTML = `전체선택 (${checkedCount}/${totalItems})`;
    });
  }

  function updateSelectAllCheckboxes() {
    const checkedCount = container.querySelectorAll('.product__list-checkbox input[type="checkbox"]:checked').length;
    const allChecked = checkedCount === totalItems;
    selectAllCheckboxes.forEach((checkbox) => {
      checkbox.checked = allChecked;
      updateCheckboxIcon(checkbox);
    });
  }

  const deleteButtons = container.querySelectorAll('.product-delete-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const cartAccordion = document.querySelector('.cart-accordion__main');
      const productList = this.closest('.cart-accordion__product-list');
      const productItem = this.closest('.product__list');
      const productTitle = productList.previousElementSibling;

      if (confirm('진짜 지울거야?')) {
        productItem.remove();

        if (productList.children.length === 0) {
          productList.remove();
          productTitle.remove();
        }

        if (!cartAccordion || cartAccordion.children.length === 0) {
          if (cartAccordion) {
            cartAccordion.classList.add('empty__cart');
            const p = document.createElement('p');
            p.textContent = `장바구니에 담긴 상품이 없습니다`;
            cartAccordion.appendChild(p);
          } else {
            console.log('없음');
          }
          // 금액 초기화
          updateTotals({
            totalAmount: 0,
            discountAmount: 0,
            defaultDeliveryCost: 0,
            estimatedAmount: 0,
            rewardAmount: 0,
          });
        }
        updateSelectAllLabels();
        updateSelectAllCheckboxes();

        const totals = calculateTotals(products);
        updateTotals(totals);
      }
    });
  });

  const deleteSelectButton = container.querySelector('#select-btn');
  deleteSelectButton.addEventListener('click', function () {
    let itemsDeleted = false;

    productItemCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const productItem = checkbox.closest('.product__list');
        productItem.remove();
        itemsDeleted = true;
      }
    });

    if (itemsDeleted) {
      updateSelectAllLabels();
      updateSelectAllCheckboxes();

      const totals = calculateTotals(products);
      updateTotals(totals);

      if (container.querySelectorAll('.product__list').length === 0) {
        
        // 모든 항목이 삭제되었을 때
        updateTotals({
          totalAmount: 0,
          discountAmount: 0,
          defaultDeliveryCost: 0,
          estimatedAmount: 0,
          rewardAmount: 0,
        });
      }
    }
  });

  const steppers = container.querySelectorAll('.stepper');
  steppers.forEach((stepper) => {
    initializeStepper(stepper);

    const updatePrices = () => {
      updateItemTotalPrice(stepper);
      const totals = calculateTotals(products);
      updateTotals(totals);
    };

    stepper.querySelector('.stepper__button--minus').addEventListener('click', updatePrices);
    stepper.querySelector('.stepper__button--plus').addEventListener('click', updatePrices);
  });

  function updateItemTotalPrice(stepper) {
    const productItem = stepper.closest('.product__list');
    const quantity = parseInt(stepper.querySelector('span').textContent, 10);
    const discountedPriceElement = productItem.querySelector('.product__discounted-price');
    const originalPriceElement = productItem.querySelector('.product__original-price');

    const unitDiscountedPrice = parseInt(discountedPriceElement.getAttribute('data-unit-price'), 10);
    const unitOriginalPrice = parseInt(originalPriceElement.getAttribute('data-unit-price'), 10);

    discountedPriceElement.textContent = `${comma(unitDiscountedPrice * quantity)}원`;
    originalPriceElement.textContent = `${comma(unitOriginalPrice * quantity)}원`;

    // Update quantity in product data
    const productIndex = productItem.getAttribute('data-product-index');
    const itemIndex = productItem.getAttribute('data-item-index');
    products[productIndex].items[itemIndex].quantity = quantity;

    const totals = calculateTotals(products);
    updateTotals(totals);
  }

  updateSelectAllLabels();
  updateSelectAllCheckboxes();
}
