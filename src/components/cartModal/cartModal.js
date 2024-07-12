import '/src/components/cartModal/cartModal.css';
import '/src/components/button/button.css';
import '/src/components/cartModal/data.js';

const openModalButtons = document.querySelectorAll('.button--open-modal');
const closeModalButtons = document.querySelectorAll('.button--close-modal');
const cartModal = document.getElementById('cart-modal');

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    cartModal.classList.add('is-visible');
    cartModal.setAttribute('aria-hidden', 'false');
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    cartModal.classList.remove('is-visible');
    cartModal.setAttribute('aria-hidden', 'true');
  });
});
