import '/components/stepper/stepper.css';

const minus = document.querySelector('.component-stepper .minus');
const plus = document.querySelector('.component-stepper .plus');
const status = document.querySelector('.component-stepper span');

console.log(minus);
const minNumber = 1;


function handleMinus() {
  const counter = +status.textContent;

  if (counter !== 1) {
    status.textContent = counter - 1;
  }
  if(counter === 2) {
    minus.disabled = true;
    minus.style.backgroundPosition = '-8px -45px';
  }
}

function handlePlus() {
  const counter = +status.textContent;

  if(counter === minNumber){
    minus.disabled = false;
    minus.style.backgroundPosition = '-8px -7px';
  }
  status.textContent = counter + 1;
}

minus.addEventListener('click', handleMinus);
plus.addEventListener('click', handlePlus);
