import '/src/components/stepper/stepper.css';

const stepper = document.querySelector('.stepper');
const minusBtn = stepper.querySelector('.stepper__button--minus');
const plusBtn = stepper.querySelector('.stepper__button--plus');
const statusDisplay = stepper.querySelector('span');

const MAX_NUMBER = 99; 
const MIN_NUMBER = 1;
const MINUS_BTN_ACTIVE_BG = '-8px -7px';
const MINUS_BTN_INACTIVE_BG = '-8px -45px';

function updateCounter(change) {
  let counter = parseInt(statusDisplay.textContent, 10) + change;
  counter = Math.min(MAX_NUMBER, Math.max(MIN_NUMBER, counter));
  statusDisplay.textContent = counter;
  updateMinusButtonState(counter);
}

function updateMinusButtonState(counter) {
  const isMinValue = counter === MIN_NUMBER;
  minusBtn.disabled = isMinValue;
  minusBtn.style.backgroundPosition = isMinValue ? MINUS_BTN_INACTIVE_BG : MINUS_BTN_ACTIVE_BG;
}

minusBtn.addEventListener('click', () => updateCounter(-1));
plusBtn.addEventListener('click', () => updateCounter(1));