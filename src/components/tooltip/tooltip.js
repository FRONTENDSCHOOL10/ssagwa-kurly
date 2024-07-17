import '/src/styles/global.css';
import '/src/components/tooltip/tooltip.css';
import { getPbImageURL } from '/src/lib';

export function openCartTooltip(product, isDuplicate) {
  let tooltip = document.getElementById('cart-tooltip');

  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'cart-tooltip';
    tooltip.className = 'cart-tooltip';

    tooltip.innerHTML = `
      <div class="product-info">
        <img src="" alt="Product Image" id="tooltip-img" />
        <div class="content">
          <p id="tooltip-title"></p>
          <div class="tooltip-message">
            <p id="tooltip-message">장바구니에 상품을 담았습니다.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);
  }

  if (isDuplicate) {
    let duplicateMessage = tooltip.querySelector('#tooltip-duplicate');
    if (!duplicateMessage) {
      duplicateMessage = document.createElement('p');
      duplicateMessage.id = 'tooltip-duplicate';
      duplicateMessage.textContent = '이미 담은 상품의 수량을 추가했습니다.';
      tooltip.querySelector('.tooltip-message').appendChild(duplicateMessage);
    }
  }

  const tooltipImg = tooltip.querySelector('#tooltip-img');
  const tooltipTitle = tooltip.querySelector('#tooltip-title');

  tooltipImg.src = `${getPbImageURL(product)}`;
  tooltipTitle.textContent = product.productName;

  tooltip.style.display = 'flex';
  tooltip.style.opacity = '0';
  setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 0);

  setTimeout(() => {
    tooltip.style.opacity = '0';
    setTimeout(() => {
      tooltip.style.display = 'none';
      const duplicateMessage = tooltip.querySelector('#tooltip-duplicate');
      if (duplicateMessage) {
        duplicateMessage.remove();
      }
    }, 2000);
  }, 2000);
}
