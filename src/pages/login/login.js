import '/src/pages/login/login.css';

import '/src/styles/global.css';
import '/src/components/input/input.css';
import '/src/components/button/button.css';

import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import pb from '/src/api/pocketbase.js';
import { getStorage, setStorage, getNode } from '/src/lib/index.js';
import viewModal from '/src/components/modal/modal.js';

const loginButton = getNode('.loginBtn');
const registerButton = getNode('.registerBtn');

function handleLogin(e) {
  e.preventDefault();

  // const id = 'kimnunu@naver.com';
  // const pw = 'dkssud123@123';

  const id = getNode('#userEmail').value;
  const pw = getNode('#userPw').value;

  if (id !== '' && pw !== ''){
    pb.collection('users')
    .authWithPassword(id, pw)
    .then(
      async () => {
        const { model, token } = await getStorage('pocketbase_auth');

        setStorage('auth', {
          isAuth: !!model,
          user: model,
          token,
        });

        location.href = '/';
      },
      () => {
        viewModal('아이디 또는 비밀번호를 확인해 주세요.');
      }
    );
  }else {
    viewModal('아이디 또는 비밀번호를 입력해 주세요.')
  }
}

loginButton.addEventListener('click', handleLogin);
registerButton.addEventListener('click', () => {
  location.href = '/src/pages/register/';
});
