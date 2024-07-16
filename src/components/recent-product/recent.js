import '/src/components/recent-product/recent.css';
import { setStorage, getStorage } from "/src/lib/utils/storage.js";

const LATELY_VIEW_ITEM_EXPIRATION_DATE = 1; // 유효기간 1일
const LATELY_VIEW_MAX_SAVE_COUNT = 5;  // 저장할 수 있는 아이템 개수 5개

//최근 본 아이템을 초기화하자
async function initProductRecently() {
  try {
    //로컬 스토리지에서 최근 본 아이템의 목록을 가져와야한다
    let viewItemList = await getStorage('recent');
    //암것도 없을 땐 빈배열로 가져오기!
    if (!viewItemList) {
      viewItemList = [];
    }

    //날짜랑 유효기간을 계산해야한다
    const nowDate = new Date();
    //유효기간을 밀리초로 변환해야한다는데,, 왜?인지는 모르겠지만 일단 해
    const ValidityTime = LATELY_VIEW_ITEM_EXPIRATION_DATE * 24 * 60 * 60 * 1000;

    //유효기간 1일이 지나면 아이템을 제거해야해
    viewItemList = viewItemList.filter(item => nowDate.getTime() < new Date(item.viewTime).getTime() + ValidityTime);

    //이제 아이템을 로컬스토리지에 다시 저장해야해
    await setStorage('recent', viewItemList);

    //최근 본 아이쳄을 화면에 렌더링을 해야해
    renderRecentProducts();
  } catch (error) {
    console.error('최근 본 아이템 초기화 실패했어요', error);
  }
}

//아이템을 본 경우 호출이 되는 함수를 적어야해
async function viewProduct(item) {
  try {
    //로컬 스토리지에서 최근 본 아이템 목록을 가져오기
    let viewItemList = await getStorage('recent');
    //만약에 없다면 빈 배열 가져와라
    if (!viewItemList) {
      viewItemList = [];
    }

    // 현재 시간을 저장
    const viewTime = new Date().toISOString();

    //이미지와 이미지 주소를 저장하기
    viewItemList.unshift({
      img: item.img, // 상품 이미지 URL
      productName: item.productName, // 상품 이름
      viewTime: viewTime // 현재 시간 저장
    });

    //중복된 아이템 지우기
    viewItemList = viewItemList.filter((item, index, self) => 
      index === self.findIndex((t) => t.img === item.img && t.productName === item.productName)
    );

    //5개까지만 저장하고 그 이상을 초과하면 오래된 아이템 지우기
    if (viewItemList.length > LATELY_VIEW_MAX_SAVE_COUNT) {
      viewItemList = viewItemList.slice(0, LATELY_VIEW_MAX_SAVE_COUNT);
    }

    //수정된 배열로 로컬스토리지에 다시 저장하기
    await setStorage('recent', viewItemList);

    //상품 상세 페이지로 이동해야하는데 몰라 주소를,,
    location.href = item.url;
  } catch (error) {
    console.error('최근 본 아이템 저장 실패했어요', error);
  }
}

//최근 본 상품을 화면에 렌더링을 해야한데 .product__recent 여기 안으로 불러오자
async function renderRecentProducts() {
  const container = document.querySelector('.product__recent');

  // 로컬 스토리지에서 최근 본 상품 목록을 가져와야한다
  try {
    const viewItemList = await getStorage('recent') || [];
    //만약에 배열의 길이가 0보다 크면 실행해주는데
    if (viewItemList.length > 0) {
      //배열의 item요소들을 돌려
      viewItemList.forEach(item => {
        //안에 이미지요소를 새로 만들구
        const img = document.createElement('img');
        //이미지의 주소랑 alt불러오기
        img.src = item.img;
        img.alt = item.productName;
        //이미지의 클래스를 지정하기
        img.classList.add('img__product-zone');
        
        //이미지 클릭하면 상세페이지로 넘어가야해 근데 실제 상품 페이지 주소 모르는데,, 일단 적어
        img.onclick = () => window.location.href = item.url; 
        //이미지를 .product__recent요따 넣어야함
        container.appendChild(img);
      });
    }
  } catch (error) {
    console.error('최근 본 아이템 렌더링 못했지롱~', error);
  }
}

// 문서 로드 시 최근 본 상품 초기화 및 렌더링
document.addEventListener('DOMContentLoaded', initProductRecently);

// viewProduct 함수를 전역 스코프에 노출 (다른 스크립트에서 사용할 수 있도록)
window.viewProduct = viewProduct;
//이거 두개까지 추가를 해야한다 하네,,?


