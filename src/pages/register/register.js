import '/src/pages/register/register.css';

import '/src/styles/global.css';
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import '/src/components/input/input.css';
import '/src/components/button/button.css';

import pb from '/src/api/pocketbase';
import { isBoolean } from '/src/lib/utils/typeOf.js';

const registerForm = document.querySelector('.register__form');
const userID = document.querySelector('#userID');
const userPw = document.querySelector('#userPw');
const userPwConfirm = document.querySelector('#userPwConfirm');
const userName = document.querySelector('#userName');
const userEmail = document.querySelector('#userEmail');
const phoneNum = document.querySelector('#phoneNum');
const userAdress = document.querySelector('#userAdress');
const userAdressOther = document.querySelector('#userAdressOther');
const gender = getSelectedRadioValue('gender');
const birth_year = document.querySelector('#birth_year');
const birth_month = document.querySelector('#birth_month');
const birth_day = document.querySelector('#birth_day');

const verificationIDBtn = document.querySelector('.verificationID');
const verificationEmailBtn = document.querySelector('.verificationEmail');
const searchAdressBtn = document.querySelector('.searchAdressBtn');
const registerBtn = document.querySelector('.register-page__submit-btn');

const agreeAll = document.querySelector('#agreeAll');
const agreeOther = [
  document.querySelector('#agreeTerms'),
  document.querySelector('#agreePersonal'),
  document.querySelector('#agreeEvent'),
  document.querySelector('#over14'),
];

// 선택된 라디오 버튼의 값을 가져오는 함수
function getSelectedRadioValue(name) {
  const selectedRadio = document.querySelector(`input[name="${name}"]:checked`);
  return selectedRadio ? selectedRadio.value : null;
}

// 6자 이상 16자 이하의 영문 혹은 영문과 숫자
function regID(text) {
  const regex = /^[a-zA-Z0-9]{6,16}$/;

  return regex.test(String(text).toLowerCase());
}

// 이메일 형식
function regEmail(text) {
  const regex =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  return regex.test(String(text).toLowerCase());
}

// 특수문자 포함 최소 10자 이상
function regPW(text) {
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{10,16}$/;
  return regex.test(String(text).toLowerCase());
}

function debounce(callback, limit = 500) {
  let timeout;
  return function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.call(this, e);
    }, limit);
  };
}

function isErrorMessage(reg, inputElement) {
  if (!reg(inputElement.value)) {
    inputElement.classList.add('is--invalid');
    inputElement.setAttribute('aria-invalid', 'true');
  } else {
    inputElement.classList.remove('is--invalid');
    inputElement.setAttribute('aria-invalid', 'false');
  }
}

const validateID = (inputElement) => {
  isErrorMessage(regID, inputElement);
};

const validateEmail = (inputElement) => {
  isErrorMessage(regEmail, inputElement);
};

const validatePassword = (inputElement) => {
  isErrorMessage(regPW, inputElement);
};

const validateConfirmPassword = (inputElement) => {
  function confirmPW(confirmPassword) {
    const password = document.querySelector('#userPw').value;

    if (password === confirmPassword) {
      return true;
    }
  }
  isErrorMessage(confirmPW, inputElement);
};

const validateRegister = (event) => {
  const inputElement = event.target;

  if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
    return;
  }

  if (inputElement.id === 'userID') validateID(inputElement);
  else if (inputElement.id === 'userEmail') validateEmail(inputElement);
  else if (inputElement.id === 'userPw') validatePassword(inputElement);
  else if (inputElement.id === 'userPwConfirm')
    validateConfirmPassword(inputElement);
};

function verificationIDEvent(event) {
  const idValue = event.target.previousElementSibling.firstElementChild.value;
  verificationID(idValue)
    .then((result) => {
      if (!isBoolean(result)) return;

      if (result) {
        alert('사용 할 수 있는 아이디 입니다');
      } else {
        alert('사용 불가능한 아이디 입니다');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function verificationEmailEvent(event) {
  const emailValue =
    event.target.previousElementSibling.firstElementChild.value;
  verificationEmail(emailValue)
    .then((result) => {
      if (!isBoolean(result)) return;

      if (result) {
        alert('사용 가능한 이메일 입니다');
      } else {
        alert('사용 불가능한 이메일 입니다');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// 아이디 중복 확인
// 중복된 아이디가 있으면 false
async function verificationID(id) {
  try {
    if (!regID(id)) {
      alert('6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합');
      return '12';
    }

    const data = await pb.collection('users').getFullList({
      filter: `username = "${id}"`,
    });

    if (data.length == 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return; // 오류 발생
  }
}

// 이메일 중복 확인
// 중복된 이메일이 있으면 false
async function verificationEmail(email) {
  try {
    if (!regEmail(email)) {
      alert('이메일 형식으로 입력해 주세요.');
      return;
    }

    const data = await pb.collection('users').getFullList({
      filter: `email = "${email}"`,
    });

    if (data.length == 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return; // 오류 발생
  }
}

function searchAdress() {
  new daum.Postcode({
    oncomplete: function (data) {
      const adressAccordion = document.querySelector(
        '.register__adress-accordion'
      );
      adressAccordion.style.display = 'block';
      searchAdressBtn.style.display = 'none';
      var addr = ''; // 주소 변수

      addr = data.roadAddress;

      document.getElementById('userAdress').value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById('userAdressOther').focus();
    },
  }).open();
}

function register() {
  const data = {
    username: userID.value,
    email: userEmail.value,
    emailVisibility: true,
    password: userPw.value,
    passwordConfirm: userPwConfirm.value,
    name: userName.value,
    phoneNumber: phoneNum.value,
    adress: userAdress.value,
    otherAdress: userAdressOther.value,
    birth:
      birth_year.value && birth_month.value && birth_day.value
        ? `${birth_year.value}-${birth_month.value}-${birth_day.value}`
        : '',
    gender: gender,
    alarm: agreeOther[2].checked,
  };

  async function createUser(data) {
    await pb
      .collection('users')
      .create(data)
      .then(() => {
        alert('🎉 회원 가입이 완료됐습니다! 🎉 로그인 페이지로 이동합니다!');
        location.href = '/src/pages/login/';
      });
  }

  createUser(data);
}

registerForm.addEventListener('input', debounce(validateRegister));
verificationIDBtn.addEventListener('click', verificationIDEvent);
verificationEmailBtn.addEventListener('click', verificationEmailEvent);
searchAdressBtn.addEventListener('click', searchAdress);
document
  .querySelector('.adress__line > button')
  .addEventListener('click', searchAdress);
agreeAll.addEventListener('click', function () {
  const isChecked = agreeAll.checked;

  if (isChecked) {
    for (const checkbox of agreeOther) {
      checkbox.checked = true;
    }
  } else {
    for (const checkbox of agreeOther) {
      checkbox.checked = false;
    }
  }
});
// 개별 동의가 모두 체크되면 전체 동의가 켜지는 로직
for (const checkbox of agreeOther) {
  checkbox.addEventListener('click', function () {
    const totalCnt = agreeOther.length;

    const checkedCnt = agreeOther.filter((checkbox) => checkbox.checked).length;

    if (totalCnt == checkedCnt) {
      agreeAll.checked = true;
    } else {
      agreeAll.checked = false;
    }
  });
}
registerBtn.addEventListener('click', register);

/* async function getUser() {
  const data = await pb.collection('users').getOne('hf3xw2qkzd9kxoj');
  console.log(data);
} */

// getUser(); */
