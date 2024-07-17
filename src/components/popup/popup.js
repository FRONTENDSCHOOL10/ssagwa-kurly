import '/src/components/popup/popup.css';
import '/src/styles/global.css';
import { setStorage } from "/src/lib/utils/storage.js";

// 닫기를 클릭하면 hidden 클래스가 붙어야함
const btnClose = document.querySelector('.btn-2');
const modalClose = () => {
  const modalOverlay = document.querySelector('.modal-overlay'); 
  modalOverlay.classList.add("hidden");
}

btnClose.addEventListener('click', modalClose);

//오늘 하루 안보기 누르면 오늘 하루 안보여야 함
const btnNotShowToday = document.querySelector('.btn-1');
const notShowToday = async () => {
  const todayString = getTodayString(); 
  try {
      await setStorage('notShowToday', todayString); 
      modalClose(); 
  } catch (error) {
      console.error('응 오늘 하루 더 봐~');
  }
}
//현재 날짜를 문자열로 변환해서 문자열에서 날짜 부분만 추출하도록 도와준답디다
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

btnNotShowToday.addEventListener('click',notShowToday);