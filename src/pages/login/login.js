import '/src/components/input/input.css';
import '/src/pages/login/login.css';
import '/src/components/button/button.css';
import pb from '/src/api/pocketbase.js'
import { getNode } from "/src/lib/dom";
import { getStorage,setStorage } from "/src/lib/utils/storage.js";


//setDocumentTitle.js로 페이지 이름 정해두기

const loginButton = getNode('.login');

function handleLogin(e){
  e.preventDefault();

  // const id = 'kimnunu@naver.com';
  // const pw = 'dkssud123@123';

  const id = getNode('#userEmail').value;
  const pw = getNode('#userPw').value;

  pb.collection('users').authWithPassword(id,pw)
  .then(async()=>{
    
    const {model,token} = await getStorage('pocketbase_auth');

    setStorage('auth',{
      isAuth: !!model,
      user: model,
      token
    })
    
    alert('로그인 완료! 메인페이지로 이동합니다.');
    location.href = '/index.html'

  },()=>{
    alert('인증된 사용자가 아닙니다.')
  })
}

loginButton.addEventListener('click',handleLogin);
