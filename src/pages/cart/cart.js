import '/src/pages/cart/cart.css';
import '/src/components/button/button.css';
import pb from '/src/api/pocketbase.js';
import { renderCartAccordion } from '/src/components/cart-accordion/cartAccordion.js';
import {
  calcDiscountPrice,
  getPbImageURL,
  comma,
  getStorage,
  setDocumentTitle,
} from '/src/lib/index.js';

setDocumentTitle('장바구니 - 컬리');

async function getProductData() {
  try {
    const productData = await pb.collection('products').getFullList();
    const groupedProducts = productData.reduce((acc, item) => {
      const packagingType = item.packagingType.substring(0, 2);
      let type = 'refrigerated';

      if (packagingType === '냉동') {
        type = 'frozen';
      } else if (packagingType === '냉장') {
        type = 'refrigerated';
      } else if (packagingType === '상온') {
        type = 'normal';
      }
      const existingGroup = acc.find((group) => group.type === type);
      const discountedPrice = item.discountRate 
        ? Math.round(calcDiscountPrice(item.price, item.discountRate))
        : item.price;
      const displayOriginalPrice = discountedPrice !== item.price;

      const productItem = {
        title: item.productName,
        description: item.productDescription,
        discountedPrice: discountedPrice,
        originalPrice: item.price,
        img: getPbImageURL(item),
        displayOriginalPrice,
      };

      if (existingGroup) {
        existingGroup.items.push(productItem);
      } else {
        acc.push({
          type,
          typeName: `${packagingType} 상품`,
          items: [productItem],
        });
      }

      return acc;
    }, []);

    return groupedProducts;
  } catch (error) {
    console.error('데이터를 불러오지 못했어요:', error);
    return [];
  }
}

export function calculateTotals(products) {
  let totalAmount = 0;
  let discountAmount = 0;
  let defaultDeliveryCost = 3000;

  products.forEach(product => {
    product.items.forEach(item => {

      const quantity = item.quantity || 1; 

      totalAmount += item.originalPrice * quantity;
      discountAmount += (item.originalPrice - item.discountedPrice) * quantity;
    });
  });

  if (totalAmount === 0 || totalAmount >= 40000) {
    defaultDeliveryCost = 0;
  }

  const estimatedAmount = totalAmount - discountAmount + defaultDeliveryCost;
  return {
    totalAmount,
    discountAmount,
    defaultDeliveryCost,
    estimatedAmount,
    rewardAmount: Math.round(estimatedAmount * 0.01)
  };
}

export function updateTotals(totals) {
  document.getElementById('totalAmount').textContent = `${comma(totals.totalAmount)}원`;
  document.getElementById('discountAmount').textContent = `${comma(totals.discountAmount)}원`;
  document.getElementById('deliveryCost').textContent = `${comma(totals.defaultDeliveryCost)}원`;
  document.getElementById('estimatedAmount').textContent = `${comma(totals.estimatedAmount)}원`;
  document.getElementById('rewardAmount').textContent = `최대 ${comma(totals.rewardAmount)}원 적립 일반 %`;
}

async function createCartInProduct() {
  const cartProductSection = document.querySelector('.cart__product-section');
  const products = await getProductData();

  const accordionData = {
    selectedCount: 0,
    totalCount: products.reduce((total, product) => total + product.items.length, 0),
    products: products,
  };

  const accordion = renderCartAccordion(accordionData);
  cartProductSection.appendChild(accordion);

  const totals = calculateTotals(products);
  updateTotals(totals);
}

async function isLogin() {
  const auth = await getStorage("auth");
  const orderButton = document.getElementById('orderButton');
  const addressBox = document.querySelector('.cart__total-delivery');
  const addressElement = document.querySelector('.address__client-address');
  
  if (auth && auth.isLogin) {
    addressBox.style.display = 'block';
    orderButton.textContent = "주문하기";
    if (addressElement) {
      addressElement.textContent = `${auth.address}`;
    }
  } else {
    addressBox.style.display = 'none';
    orderButton.textContent = "로그인";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createCartInProduct().then(isLogin);
});
