import '/src/styles/global.css';
import viewModal from '/src/components/modal/modal.js';
import { createAccordionItem } from '/src/components/cart-accordion/accordionItem.js';
import '/src/components/cart-accordion/cartAccordion.css';
import { setStorage, toggleClass } from '/src/lib/index.js';
import { displayEmptyCartMessage } from '/src/pages/cart/cart.js';

export function createCartAccordion(cartData) {
  const refrigeratedItems = cartData.filter((item) =>
    item.packagingType.includes('냉장')
  );
  const frozenItems = cartData.filter((item) =>
    item.packagingType.includes('냉동')
  );
  const normalItems = cartData.filter((item) =>
    item.packagingType.includes('상온')
  );

  const cartSection = document.querySelector('.cart__product-section');
  cartSection.innerHTML = generateCartSectionHTML();

  refrigeratedItems.forEach((item) =>
    createAccordionItem(item, 'refrigerated')
  );
  frozenItems.forEach((item) => createAccordionItem(item, 'frozen'));
  normalItems.forEach((item) => createAccordionItem(item, 'normal'));

  hideEmptySections(refrigeratedItems, frozenItems, normalItems);
  toggleAccordionList();
}

function generateCartSectionHTML() {
  return `
    <div class="cart-accordion__select-bar">
      <div class="select-bar-container">
        <label class="select-all-checkbox" for="select-all-checkbox1">
          <input type="checkbox" id="select-all-checkbox1" checked />
          <span class="icon icon--small icon--Checked"></span>
          <span class="all">전체선택 (0/0)</span>
        </label>
        <span class="divider"></span>
        <button type="button" class="select-del-btn">선택삭제</button>
      </div>
    </div>
    <section class="cart-accordion__product-list">
      <h4 class="cart-accordion__heading refrigerated-heading">
        <span class="product__status">
          <span class="icon icon--large icon--refrigerated" aria-hidden="true"></span>
          냉장 상품
        </span>
        <button class="cart-accordion__toggle-button">
          <span class="icon icon--large icon--arrow-up"></span>
        </button>
      </h4>
      <ul class="product__list refrigerated"></ul>
      <h4 class="cart-accordion__heading frozen-heading">
        <span class="product__status">
          <span class="icon icon--large icon--frozen" aria-hidden="true"></span>
          냉동 상품
        </span>
        <button class="cart-accordion__toggle-button">
          <span class="icon icon--large icon--arrow-up"></span>
        </button>
      </h4>
      <ul class="product__list frozen"></ul>
      <h4 class="cart-accordion__heading normal-heading">
        <span class="product__status">
          <span class="icon icon--large icon--normal" aria-hidden="true"></span>
          상온 상품
        </span>
        <button class="cart-accordion__toggle-button">
          <span class="icon icon--large icon--arrow-up"></span>
        </button>
      </h4>
      <ul class="product__list normal"></ul>
    </section>
    <div class="cart-accordion__select-bar">
      <div class="select-bar-container">
        <label class="select-all-checkbox" for="select-all-checkbox2">
          <input type="checkbox" id="select-all-checkbox2" checked />
          <span class="icon icon--small icon--Checked"></span>
          <span class="all">전체선택 (0/0)</span>
        </label>
        <span class="divider"></span>
        <button type="button" class="select-del-btn">선택삭제</button>
      </div>
    </div>
  `;
}

function hideEmptySections(refrigeratedItems, frozenItems, normalItems) {
  if (!refrigeratedItems.length) {
    document.querySelector('.refrigerated-heading').style.display = 'none';
  }
  if (!frozenItems.length) {
    document.querySelector('.frozen-heading').style.display = 'none';
  }
  if (!normalItems.length) {
    document.querySelector('.normal-heading').style.display = 'none';
  }
}

export function addEventListeners(cartData, updateCartSummary) {
  const selectAllCheckboxes = document.querySelectorAll(
    '.select-all-checkbox input[type="checkbox"]'
  );
  const checkboxes = document.querySelectorAll(
    '.accordion__item--checkbox input[type="checkbox"]'
  );
  const deleteButtons = document.querySelectorAll(
    '.accordion__item---delete-button'
  );
  const selectDeleteButtons = document.querySelectorAll('.select-del-btn');

  updateSelectAllLabel(checkboxes);

  selectAllCheckboxes.forEach((selectAllCheckbox) => {
    selectAllCheckbox.addEventListener('change', (e) => {
      e.preventDefault();
      const isChecked = selectAllCheckbox.checked;
      checkboxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
        toggleCheckboxIcon(checkbox);
      });
      selectAllCheckboxes.forEach((selectAll) => {
        selectAll.checked = isChecked;
        toggleCheckboxIcon(selectAll);
      });
      updateSelectAllLabel(checkboxes);
      updateCartSummary(); // Update summary after changing select all checkbox
    });
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const allChecked = Array.from(checkboxes).every(
        (checkbox) => checkbox.checked
      );
      selectAllCheckboxes.forEach((selectAll) => {
        selectAll.checked = allChecked;
        toggleCheckboxIcon(selectAll);
      });
      toggleCheckboxIcon(checkbox);
      updateSelectAllLabel(checkboxes);
      updateCartSummary(); // Update summary after changing item checkbox
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemElement = event.target.closest('.cart-accordion__item');
      const itemId = itemElement
        .querySelector('input[type="checkbox"]')
        .id.split('-')
        .pop();
      viewModal('삭제하시겠습니까?', '취소', null, '확인', () => {
        const itemIndex = cartData.findIndex((item) => item.id === itemId);
        if (itemIndex > -1) {
          cartData.splice(itemIndex, 1);
          itemElement.remove();
          setStorage('cart', cartData);
          updateCartSummary();
          hideEmptySections(
            cartData.filter((item) => item.packagingType.includes('냉장')),
            cartData.filter((item) => item.packagingType.includes('냉동')),
            cartData.filter((item) => item.packagingType.includes('상온'))
          );
          updateSelectAllLabel(checkboxes);
          if (cartData.length === 0) {
            displayEmptyCartMessage();
          }
        }
      });

      // 취소 버튼에 스타일 추가
      const modalCancelButton = document.querySelector('.modalClose.btn1');
      if (modalCancelButton) {
        modalCancelButton.style.color = 'inherit';
      }
    });
  });

  selectDeleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedItems = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.id.split('-').pop());
      viewModal('선택한 상품을 삭제하시겠습니까?', '취소', null, '확인', () => {
        selectedItems.forEach((itemId) => {
          const itemIndex = cartData.findIndex((item) => item.id === itemId);
          if (itemIndex > -1) {
            const itemElement = document
              .querySelector(`#cart-item-checkbox-${itemId}`)
              .closest('.cart-accordion__item');
            itemElement.remove();
            cartData.splice(itemIndex, 1);
          }
        });

        setStorage('cart', cartData);
        updateCartSummary(cartData);
        updateSelectAllLabel(checkboxes);
        hideEmptySections(
          cartData.filter((item) => item.packagingType.includes('냉장')),
          cartData.filter((item) => item.packagingType.includes('냉동')),
          cartData.filter((item) => item.packagingType.includes('상온'))
        );

        if (cartData.length === 0) {
          displayEmptyCartMessage();
        }
      });

      // 취소 버튼에 스타일 추가
      const modalCancelButton = document.querySelector('.modalClose.btn1');
      if (modalCancelButton) {
        modalCancelButton.style.color = 'inherit';
      }
    });
  });
}

function toggleCheckboxIcon(checkbox) {
  const icon = checkbox.nextElementSibling;
  if (checkbox.checked) {
    icon.classList.remove('icon--UnChecked');
    icon.classList.add('icon--Checked');
  } else {
    icon.classList.remove('icon--Checked');
    icon.classList.add('icon--UnChecked');
  }
}

function updateSelectAllLabel() {
  const checkboxes = document.querySelectorAll(
    '.accordion__item--checkbox input[type="checkbox"]'
  );
  const totalItems = checkboxes.length;
  const checkedItems = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  ).length;
  const selectAllLabels = document.querySelectorAll(
    '.select-all-checkbox .all'
  );

  selectAllLabels.forEach((label) => {
    label.textContent = `전체선택 (${checkedItems}/${totalItems})`;
  });
}

function toggleAccordionList() {
  const toggleButtons = document.querySelectorAll(
    '.cart-accordion__toggle-button'
  );

  toggleButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const productList = this.closest('h4').nextElementSibling;
      const toggleIcon = this.querySelector('.icon');

      toggleClass(productList, 'is-hidden');
      toggleClass(toggleIcon, 'icon--arrow-down');
      toggleClass(toggleIcon, 'icon--arrow-up');
    });
  });
}
