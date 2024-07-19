import '/src/components/modal/modal.css';

export default function viewModal(text, btnText1 = '확인', callback1 = null, btnText2 = null, callback2 = ()=>{}) {
  // 모달 컨테이너 div를 생성합니다.
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modalContainer');
  modalContainer.setAttribute('role', 'dialog');
  modalContainer.setAttribute('aria-modal', true);
  modalContainer.setAttribute('aria-labelledby', 'modal-text');

  // 제공된 텍스트로 모달 콘텐츠를 생성합니다.
  modalContainer.innerHTML = `
    <div id="modalContent">
      <p id="modal-text">${text}</p>
      <div class="button-wrapper">
        <button type="button" class="modalClose btn1">${btnText1}</button>
        ${btnText2 ?'<button type="button" class="modalClose btn2">' + btnText2 + '</button>' : ''}
      </div>
    </div>
  `;

  // 모달 컨테이너를 body에 추가합니다.
  document.body.appendChild(modalContainer);

  // 닫기 버튼에 이벤트 리스너를 추가합니다.
  document.querySelectorAll('.modalClose').forEach(function(btn){
    btn.addEventListener('click', function () {
      //모달창 없애기
      document.querySelectorAll('.modalContainer').forEach(function(modal) {
        document.body.removeChild(modal);
      });

      // callback 함수 실행
      if (typeof callback1 === 'function' || typeof callback2 === 'function') {
        if(btn.classList.contains('btn1')) callback1();
        if(btn.classList.contains('btn2')) callback2();
      }
    });
  })
}