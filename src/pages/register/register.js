import '/src/pages/register/register.css';

import '/src/styles/global.css';
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import '/src/components/input/input.css';
import '/src/components/button/button.css';

import pb from '/src/api/pocketbase';
import { isBoolean } from '/src/lib/utils/typeOf.js';
import { getNode } from '/src/lib/dom/getNode.js';
import viewModal from '/src/components/modal/modal.js';

const registerForm = getNode('.register__form');
const userID = getNode('#userID');
const userPw = getNode('#userPw');
const userPwConfirm = getNode('#userPwConfirm');
const userName = getNode('#userName');
const userEmail = getNode('#userEmail');
const phoneNum = getNode('#phoneNum');
const userAdress = getNode('#userAdress');
const userAdressOther = getNode('#userAdressOther');
const birth_year = getNode('#birth_year');
const birth_month = getNode('#birth_month');
const birth_day = getNode('#birth_day');

const verificationIDBtn = getNode('.verificationID');
const verificationEmailBtn = getNode('.verificationEmail');
const verificationPhoneBtn = getNode('.verificationPhone');
const searchAdressBtn = getNode('.searchAdressBtn');
const registerBtn = getNode('.register-page__submit-btn');

const agreeAll = getNode('#agreeAll');
const agreeOther = [
  getNode('#agreeTerms'),
  getNode('#agreePersonal'),
  getNode('#agreeEvent'),
  getNode('#over14'),
];

// 선택된 라디오 버튼의 값을 가져오는 함수
function getSelectedRadioValue(name) {
  const selectedRadio = getNode(`input[name="${name}"]:checked`);
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

// 전화번호 형식
function regPhone(text) {
  const regex = /^01[016789]\d{7,8}$/;

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
  verificationIDBtn.disabled = false;
};

const validateEmail = (inputElement) => {
  isErrorMessage(regEmail, inputElement);
  verificationEmailBtn.disabled = false;
};

const validatePassword = (inputElement) => {
  isErrorMessage(regPW, inputElement);
};

const validateConfirmPassword = (inputElement) => {
  function confirmPW(confirmPassword) {
    const password = getNode('#userPw').value;

    if (password === confirmPassword) {
      return true;
    }
  }
  isErrorMessage(confirmPW, inputElement);
};

const validatePhone = (inputElement) => {
  isErrorMessage(regPhone, inputElement);
  if(regPhone(inputElement.value)){
    verificationPhoneBtn.disabled = false;
  }else{
    verificationPhoneBtn.disabled = true;
  }
};

const validateRegister = (event) => {
  const inputElement = event.target;

  if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
    return;
  }

  if (inputElement.id === 'userID') validateID(inputElement);
  else if (inputElement.id === 'userEmail') validateEmail(inputElement);
  else if (inputElement.id === 'userPw') validatePassword(inputElement);
  else if (inputElement.id === 'userPwConfirm') validateConfirmPassword(inputElement);
  else if (inputElement.id === 'phoneNum') validatePhone(inputElement);
};

function verificationIDEvent() {
  const idValue = userID.value;
  verificationID(idValue)
    .then((result) => {
      if (!isBoolean(result)) return;

      if (result) {
        viewModal('사용 할 수 있는 아이디 입니다.');
        verificationIDBtn.disabled = true;
      } else {
        viewModal('사용 불가능한 아이디 입니다.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function verificationEmailEvent() {
  const emailValue = userEmail.value;
  verificationEmail(emailValue)
    .then((result) => {
      if (!isBoolean(result)) return;

      if (result) {
        viewModal('사용 가능한 이메일 입니다.');
        verificationEmailBtn.disabled = true;
      } else {
        viewModal('사용 불가능한 이메일 입니다.');
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
      viewModal('6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합');
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
      viewModal('이메일 형식으로 입력해 주세요.');
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
      const adressAccordion = getNode(
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

function register(event) {
  event.preventDefault();

  if(verificationIDBtn.disabled === false){
    viewModal('아이디 중복 체크를 해주세요.');
    return;
  }else if(verificationEmailBtn.disabled === false){
    viewModal('이메일 중복 체크를 해주세요.');
    return;
  }else if(userPw.value === ''){
    viewModal('비밀번호를 입력해 주세요.');
    return;
  }else if(!agreeOther[0].checked || !agreeOther[1].checked || !agreeOther[3].checked){
    viewModal('필수 이용 약관을 동의해 주세요.');
    return;
  }else if(userPwConfirm.value === ''){
    viewModal('비밀번호를 한번 더 입력해 주세요.');
    return;
  }else if(userName.value === ''){
    viewModal('이름을 입력해 주세요.');
    return;
  }else if(userAdress.value === '' || userAdressOther.value === ''){
    viewModal('주소를 검색하여 입력해 주세요.');
    return;
  }

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
    gender: getSelectedRadioValue('gender'),
    alarm: agreeOther[2].checked,
  };

  async function createUser(data) {
    await pb
      .collection('users')
      .create(data)
      .then(() => {
        location.href = '/src/pages/login/';
        // viewModal('🎉 회원 가입이 완료됐습니다! 🎉');
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