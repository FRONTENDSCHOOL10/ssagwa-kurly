import '/src/components/popup/popup.css';

import popupImage from '/src/assets/images/popup/popup1.png';
import { setStorage, getStorage } from "/src/lib/index.js";

//현재 날짜를 문자열로 변환해서 문자열에서 날짜 부분만 추출
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

//오늘 하루 안보기 누르면 오늘 하루 안보여야 함
const notShowToday = () => {
  const today = getTodayString(); 
  try {
      setStorage('mainNotice', today); 
  } catch (error) {
      console.error('Error: ' + error);
  }
}

async function isShowPopup(){
  const data = await getStorage('mainNotice');

  const today = new Date(getTodayString());
  const rejectDay = new Date(data?data:'1900-01-01');

  // 1일 = 86400000 밀리초
  if(today - rejectDay >= 86400000){
    return true;
  }else {
    return false;
  }
}


export default function viewPopup(element) {
  isShowPopup().then(result => {
    if(result){
      // 모달 컨테이너 div를 생성합니다.
      const modalContainer = document.createElement('div');
      modalContainer.classList.add('modal');
      modalContainer.setAttribute('role', 'dialog');
      modalContainer.setAttribute('aria-modal', true);
      modalContainer.setAttribute('aria-labelledby', 'ad-popup');

      // 제공된 텍스트로 모달 콘텐츠를 생성합니다.
      modalContainer.innerHTML = `

        <p id="ad-popup" class="sr-only">광고 팝업</p>
        <a href="#" aria-label="뷰티컬리 만나보기">
          <img id="modalImg" class="modal__img" src="${popupImage}" alt="뷰티컬리 만나보기 이미지" />
        </a>
        <div class="modal-btn_wrapper">
          <button type="button" class="close oneday">오늘 하루 안보기</button>
          <button type="button" class="close">닫기</button>
        </div>
      
      `;

      // 모달 컨테이너를 element에 추가합니다.
      element.appendChild(modalContainer);

      // 닫기 버튼에 이벤트 리스너를 추가합니다.
      document.querySelectorAll('.close').forEach(function(btn){
        btn.addEventListener('click', function () {
          document.querySelectorAll('.modal').forEach(function(modal) {
            element.removeChild(modal);
          });

          if(btn.classList.contains('oneday')){
            notShowToday();
            isShowPopup();
          }
        });
      })
    }
  })
}