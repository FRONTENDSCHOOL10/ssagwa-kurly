import '/src/components/modal/modal.css';

export default function viewModal(text) {
  // 모달 컨테이너 div를 생성합니다.
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modalContainer';

  // 제공된 텍스트로 모달 콘텐츠를 생성합니다.
  modalContainer.innerHTML = `
    <div id="modalContent">
      <p>${text}</p>
      <button type="button" id="modalCloseButton">확인</button>
    </div>
  `;

  // 모달 컨테이너를 body에 추가합니다.
  document.body.appendChild(modalContainer);

  // 닫기 버튼에 이벤트 리스너를 추가합니다.
  document
    .getElementById('modalCloseButton')
    .addEventListener('click', function () {
      document.body.removeChild(modalContainer);
    });
}
