export function calcDiscountPrice(origPrice, discRate) {
  // 할인율을 퍼센트가 아닌 소수로 변환
  const discount = origPrice * (discRate / 100);
  // 할인된 가격 계산
  const discountedPrice = origPrice - discount;
  return discountedPrice;
}