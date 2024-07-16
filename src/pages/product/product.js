import '/src/pages/product/product.css';

import '/src/styles/global.css';
import '/src/components/header/header.js';
import '/src/components/footer/footer.js';
import '/src/components/button/button.css';

import pb from '/src/api/pocketbase.js';
import initializeStepper from '/src/components/stepper/stepper.js';
import { insertLast, insertFirst } from '/src/lib/dom/insert.js';
import { getPbImageURL } from '/src/lib/utils/getPbImageURL';
import { comma } from '/src/lib/index.js';
import { calcDiscountPrice } from '/src/lib/math/calcDiscountPrice';
import { getStorage } from '/src/lib/utils/storage';
import viewModal from '/src/components/modal/modal.js';

const { isAuth } = await getStorage('auth') || {};

function replaceBr(text){
  return text.replaceAll('\r\n', '<br />');
}

async function renderProduct(){

  const params = new URLSearchParams(location.search);
  const productId = params.get('product');

  const data = await pb.collection('products').getOne(productId);

  const {price,discountRate,Delivery,productName,productDescription,productDetailDescription,packagingType,unitOfSale,weight,origin,allergy} = data;

  const product_top_contnet = /* html */`
      <img class="product__img" src="${getPbImageURL(data)}" alt="${productName}"/>
      <div class="product__detail-wrapper">
        <div class="product__info">
          <p class="product__delivery-method">${Delivery}</p>
          <div>
            <p class="product__name">${productName}</p>
            <p class="product__description">${productDescription}</p>
          </div>
          <div class="product__price-wrapper">
            <div>
              ${discountRate?'<span class="product__discountRate">'+discountRate+"%</span>":''}
              <span class="product__price">${comma(calcDiscountPrice(price, discountRate))}<span class="product__currency"> 원</span></span>
            </div>
            ${discountRate?"<del>"+comma(price)+"원</del>":''}
          </div>
          ${!isAuth?'<p class="product__login-benefit">로그인 후, 적립 혜택이 제공됩니다.</p>':''}
        </div>
        <ul class="product__details-list">
          <li class="product__details-item">
            <dt class="product__details-title">배송</dt>
            <dd class="product__details-content">
              <p>${Delivery}</p>
              <p class="product__details-description">${Delivery==='샛별배송'?"23시 전 주문 시 내일 아침 7시 전 도착<br />(대구 부산 울산 샛별배송 운영시간 별도 확인)":Delivery==='판매자배송'?'주문 후 2~5일 배송':'담당자 연락 후 방문'}</p>
            </dd>
          </li>
          <li class="product__details-item">
            <dt class="product__details-title">판매자</dt>
            <dd class="product__details-content">칼리</dd>
          </li>
          <li class="product__details-item">
            <dt class="product__details-title">포장타입</dt>
            <dd class="product__details-content">
              <p>${packagingType}</p>
              <p class="product__details-description">택배배송은 에코 포장이 스티로폼으로 대체됩니다.</p>
            </dd>
          </li>
          <li class="product__details-item">
            <dt class="product__details-title">판매단위</dt>
            <dd class="product__details-content">${unitOfSale}</dd>
          </li>
          <li class="product__details-item">
            <dt class="product__details-title">중량/용량</dt>
            <dd class="product__details-content">${weight}</dd>
          </li>
          <li class="product__details-item">
              <dt class="product__details-title">원산지</dt>
              <dd class="product__details-content">${origin}</dd>
          </li>
          <li class="product__details-item">
            <dt class="product__details-title">알레르기정보</dt>
              <dd class="product__details-content">${replaceBr(allergy)}</dd>
          </li>
          <li class="product__details-item">
            <dt class="product__details-title">상품선택</dt>
            <dd class="product__details-content">
              <div class="product__selection">
                <div class="product__selection-wrapper">
                  <p class="product__selection-name">${productName}</p>
                  <div class="stepper">
                    <button class="stepper__button--minus" type="button" aria-label="수량 내리기" disabled></button>
                    <span>1</span>
                    <button class="stepper__button--plus" type="button" aria-label="수량 올리기"></button>
                  </div>
                </div>
                <div class="product__selection-price">
                  ${discountRate?'<del class="product__selection-price--old">'+comma(price)+'</del>':''}
                  <span class="product__selection-price--new">${comma(calcDiscountPrice(price, discountRate))}원</span>
                </div>
              </div>
          </dd>
          </li>
        </ul>
        <div class="product__total-price">
          <p>총 상품금액: <span class="product__total-amount">${comma(calcDiscountPrice(price, discountRate))}</span> 원</p>
          <div class="product__reward">
            <img src="/svg/Badge-Reward.svg" alt="적립" class="product__reward-icon"/>
            <p class="product__reward-text">로그인 후, 적립 혜택 제공</p>
          </div>
        </div>
        <div class="product__actions">
          <button type="button" class="product__button-like"></button>
          <button type="button" disabled class="product__button-bell"></button>
          <button type="button" class="button--large button--primary">장바구니 담기</button>
        </div>
      </div>
  `
  
  insertFirst('.product-top', product_top_contnet);
  initializeStepper(document.querySelector('.stepper'));

  const stepper_stat = document.querySelector('.stepper span');
  const total_amount = document.querySelector('.product__total-amount');

  document.querySelectorAll('.stepper button').forEach((element)=>{
    element.addEventListener('click', ()=>{
      total_amount.textContent = comma(calcDiscountPrice(price, discountRate) * Number(stepper_stat.textContent));
    })
  })

  const productLikeBtn = document.querySelector('.product__button-like');
  productLikeBtn.addEventListener('click', ()=>{
    if(!isAuth){
      viewModal('로그인하셔야 본 서비스를 이용하실 수 있습니다.', ()=>{
        location.href = '/src/pages/login/';
      })
    }
    productLikeBtn.style.backgroundPosition = '-9px 63px';
  })

 

  const product_description_contnet = /* html */`
        <img src="${getPbImageURL(data, 'productDetails', 0)}" alt="${productName}" />
        <p class="desc-sub_description">${productDescription}</p>
        <p class="desc-title">${productName}</p>
        <p class="desc-description">${productDetailDescription}</p>
        <p class="pick"><span>Kurly's Check Point</span></p>
        <img src="${getPbImageURL(data, 'productDetails', 1)}" alt="컬리 체크 포인트" />
  `

  insertFirst('#description', product_description_contnet);
  insertFirst('#detail', `<img src="${getPbImageURL(data, 'productDetails', 2)}" alt="상세정보" />`)
}



renderProduct();
