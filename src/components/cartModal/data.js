import { comma } from '/lib/index.js';

// 데이터 임포트 테스트용...
const productData = [
  {
    image: '/assets/images/product/product01.png',
    name: '[풀무원] 탱탱쫄면 (4개입)',
    discount: '0',
    price: '4980',
    originalPrice: '4980',
    description: '설명설명',
  },
  {
    image: '/assets/images/product/product02.png',
    name: '[온더바디] 죠르디 시카 자석 선쿠션',
    discount: '10',
    price: '30000',
    originalPrice: '27000',
    description: '설명설명',
  },
  {
    image: '/assets/images/product/product04.png',
    name: '[멤버스특가][르네휘테르] 포티샤 샴푸 듀오 선물세트 BEST 4종(택1)[멤버스특가][르네휘테르] 포티샤 샴푸 듀오 선물세트 BEST 4종(택1)',
    discount: '25',
    price: '90000',
    originalPrice: '',
    description: '설명설명',
  },
];

function truncateText(text, maxBytes) {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    bytes += new Blob([char]).size;
    if (bytes > maxBytes) {
      return text.substring(0, i) + '...';
    }
  }
  return text;
}

productData.forEach((item) => {
  const { name, price, discount, originalPrice } = item;

  const truncatedName = truncateText(name, 134);

  const productName = document.querySelector('.cart-modal__title');
  productName.textContent = truncatedName;

  const discountElement = document.querySelector(
    '.cart-modal__product-discount'
  );
  if (discount && discount !== '0') {
    discountElement.textContent = `${discount}%`;
  } else {
    discountElement.textContent = '';
  }

  const productPrice = document.querySelector('.cart-modal__product-price');
  productPrice.textContent = `${comma(price)}원`;

  let calculatedOgPrice = originalPrice;
  if (!originalPrice || originalPrice === '0') {
    calculatedOgPrice = Math.round(price / (1 - discount / 100));
  }

  const productOriginalPrice = document.querySelector(
    '.cart-modal__product-og-price'
  );
  productOriginalPrice.textContent = `${comma(calculatedOgPrice)}원`;

  // 추후 수량카운터에서 카운팅 된 수 * 가격 으로 변경
  const productTotal = document.querySelector('.cart-modal__total-price');
  productTotal.textContent = `${comma(price - price * (discount * 0.01))}원`;

  const productEarn = document.querySelector('.cart-modal__earn');
  productEarn.textContent = `구매 시 ${Math.floor(price * 0.001)}원 적립`;
});
