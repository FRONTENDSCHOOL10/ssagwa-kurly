import '/src/components/product/product.css';
import { comma } from "/src/lib/math/comma.js";
import { calcDiscountPrice } from "/src/lib/math/calcDiscountPrice.js";


document.addEventListener('DOMContentLoaded', function() {
  const productData = [
      { 
          image: "/src/assets/images/product/product01.png", 
          name: "[풀무원] 탱탱쫄면 (4개입)", 
          discount: "30", 
          price: "2980", 
          originalPrice: "24000", 
          description: "CJ즉석밥 고소한 맛의 발아 현미밥"
      }
  ];

  const productList = document.querySelector('.product__list');



  
  productData.forEach((item) => {

    const discountPrice = calcDiscountPrice(Number(item.originalPrice), Number(item.discount));
    //할인율이 0%로 입력이 되었거나 빈문자일 경우
    const noDiscounted = item.discount !== '0' && item.discount !== '';

    const template = `
        <a href=""><li class="product__wrapper">
            <figure class="product__visual" aria-label="상품 이미지">
                <img src="${item.image}" alt="${item.name}" />
                <figcaption class="sr-only">상품 이미지: ${item.name}</figcaption>
            </figure>
            <button type="button" class="product__basket" aria-label="장바구니에 상품 담기"><img src="/public/svg/Cart-1.svg" alt="장바구니 아이콘" aria-hidden="true"/>담기</button>
            <span class="product__delivery" aria-label="배송 설명">샛별배송</span>
            <span class="product__title" aria-label="상품이름">${item.name}</span>
            <div class="product__price--wrap">
                ${noDiscounted ? `<div class="product__discount" aria-label="할인율">${item.discount}%</div>` : ''}
                <div class="product__real-price" aria-label="가격">${noDiscounted ? `${comma(discountPrice)}원` : `${comma(item.originalPrice)}원`}</div>
            </div>
            <span class="product__price" aria-label="원가">${comma(item.originalPrice)}원</span>
            <span class="product__description" aria-label="상품 설명">${item.description}</span>
            <div class="product__tag">
                <span class="tag--only tag--primary">Karly Only</span>
                <span class="tag--only">한정수량</span>
            </div>
        </li></a>
    `;
    productList.insertAdjacentHTML('beforeEnd', template);
  });
});

