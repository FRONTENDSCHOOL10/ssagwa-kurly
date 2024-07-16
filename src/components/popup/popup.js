import '/src/components/popup/popup.css';
import '/src/styles/global.css';


// 닫기를 클릭하면 hidden 클래스가 붙어야함
const btnClose = document.querySelector('.btn-2');
const modalClose = () => {
  const modalOverlay = document.querySelector('.modal-overlay'); 
  modalOverlay.classList.add("hidden");
}

btnClose.addEventListener('click', modalClose);

