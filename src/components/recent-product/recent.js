import '/src/components/recent-product/recent.css';
import { setStorage, getStorage } from "/src/lib/utils/storage.js";

const LATELY_VIEW_ITEM_EXPIRATION_DATE = 1; //유효기간 1일
const LATELY_VIEW_MAX_SAVE_COUNT = 5;  // 저장할 수 있는 아이템 갯수 5개!

//최근 본 아이템을 초기화하자
function initproductrecently(){
  try{
    //로컬 스토리지에서 최근 본 아이템의 목록을 가져와야한다
    let viewItemList = getStorage('recent');
    //암것도 없을 땐 빈배열로 가져오기!
    if(!viewItemList){
      viewItemList = [];
    }

    //날짜랑 유효기간을 계산해야한다
    const nowDate = new DataTransfer();

    //유효기간을 밀리초로 변환해야한다는데,, 왜?인지는 모르겠지만 일단 해
    const ValidityTime = LATELY_VIEW_ITEM_EXPIRATION_DATE * 24 * 60 * 60 * 1000;
  
    //유효기간 1일이 지나면 아이템을 제거해야해
    viewItemList = viewItemList.filter(item => nowDate.getTime() < new Date(item.viewTime).getTime() + ValidityTime);

    //이제 아이템을 로컬스토리지에 다시 저장해야해
    setStorage('recent',viewItemList);

    //최근 본 아이쳄을 화면에 렌더링을 해야해
    renderRecentProducts();
  }catch{
    //실패했을 때 에러 뜨기
    console.error('최근 본 아이템 초기화 실패했어요');
  }
}
  //아이템을 본 경우 호출이 되는 함수를 적어야해
function viewProduct(item){
  try{
    //로컬 스토리지에서 최근 본 아이템 목록을 가져오기
    const viewItemList = getStorage('recent');
    //만약에 없다면 빈 배열 가져와라
    if(!viewItemList){
      viewItemList = [];
    }
  
    //이미지와 이미지 주소를 저장하기
    viewItemList.unshift({
      img: '${pb.getFileUrl(item, item.productImg)}',
      productName: '${item.productName}',
    })
    //중복된 아이템 지우기
    viewItemList = viewItemList.filter(()=>);
  
    //5개까지만 저장하고 그 이상을 초과하면 오래된 아이템 지우기
    if(viewItemList.length > LATELY_VIEW_MAX_SAVE_COUNT){
      viewItemList = viewItemList.slice(0,5);
    }
    //수정된 배열로 로컬스토리지에 다시 저장하기
    setStorage('recent',viewItemList);

    //상품 상세 페이지로 이동해야하는데 몰라 주소를,,

  }catch(error){
    console.error('저장 못 했다..');
  }
}








