import '/src/components/cart-accordion/cartAccordion.css';
import '/src/components/stepper/stepper.css';

const toggleButtons = document.querySelectorAll('.cart-accordion__toggle-button');
toggleButtons.forEach(button => {
  button.addEventListener('click', function(){
    const productList = this.closest('.cart-accordion').querySelector('.cart-accordion__product-list');
    const toggleIcon = this.querySelector('.icon');


    if(toggleIcon.classList.contains('icon--arrow-up')){
      productList.style.display = 'none'
      toggleIcon.classList.remove('icon--arrow-up');
      toggleIcon.classList.add('icon--arrow-down');
    
    } else {
      productList.style.display = 'block'
      toggleIcon.classList.remove('icon--arrow-down');
      toggleIcon.classList.add('icon--arrow-up');
    }
  })
})



const checkboxes = document.querySelectorAll('.product__list-checkbox input[type="checkbox"]')
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function(){

    const checkboxIcon = this.nextElementSibling;
    
    if(this.checked){
      checkboxIcon.classList.remove('icon--Checked')
      checkboxIcon.classList.add('icon--UnChecked')

    } else{
      checkboxIcon.classList.remove('icon--UnChecked')
      checkboxIcon.classList.add('icon--Checked')
    }
  })
})



const deleteButtons = document.querySelectorAll('.product-delete-button');
deleteButtons.forEach(button => {
  button.addEventListener('click', function () {
    const body = document.querySelector('body')
    const cartAccordion = this.closest('.cart-accordion')
    const productList = this.closest('.cart-accordion__product-list');
    const productItem = this.closest('.product__list');


    // 모달..만들어야함..
    if (confirm('진짜 지울거야?')) {
      productItem.remove();

      if (productList.children.length === 0) {
        cartAccordion.remove();
      }

      if(document.querySelectorAll('.cart-accordion').length === 0){
        body.classList.add('empty__cart')
        const p = document.createElement('p')
        p.textContent =  `장바구니에 담긴 상품이 없습니다`;
        body.appendChild(p)
      }
    }
  });
});


function initializeStepper(stepper) {
  const minusBtn = stepper.querySelector('.stepper__button--minus');
  const plusBtn = stepper.querySelector('.stepper__button--plus');
  const statusDisplay = stepper.querySelector('span');
  const productPrice = stepper.closest('.product__list').querySelector('.product__product-price');
  const sellingPrice = stepper.closest('.product__list').querySelector('.product__selling-price');
  const initialProductPrice = parseInt(productPrice.textContent.replace(/[^0-9]/g, ''), 10);
  const initialSellingPrice = parseInt(sellingPrice.textContent.replace(/[^0-9]/g, ''), 10);
  const MAX_NUMBER = 99;
  const MIN_NUMBER = 1;

  function updateCounter(change) {
    let counter = parseInt(statusDisplay.textContent, 10) + change;
    counter = Math.min(MAX_NUMBER, Math.max(MIN_NUMBER, counter));
    statusDisplay.textContent = counter;
    updatePrice(counter);
    updateMinusButtonState(counter);
  }

  function updateMinusButtonState(counter) {
    minusBtn.disabled = counter === MIN_NUMBER;
  }

  function updatePrice(quantity) {
    const totalProductPrice = initialProductPrice * quantity;
    const totalSellingPrice = initialSellingPrice * quantity;
    productPrice.textContent = `${totalProductPrice.toLocaleString()}원`;
    sellingPrice.textContent = `${totalSellingPrice.toLocaleString()}원`;
  }

  minusBtn.addEventListener('click', () => updateCounter(-1));
  plusBtn.addEventListener('click', () => updateCounter(1));

  updateMinusButtonState(parseInt(statusDisplay.textContent, 10));
}

const steppers = document.querySelectorAll('.stepper');
steppers.forEach(stepper => {
  initializeStepper(stepper);
});