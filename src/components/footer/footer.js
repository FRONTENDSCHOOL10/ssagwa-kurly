class KurlyFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>@import url('/components/footer/footer.css');</style>
      <footer class="footer">
        <div class="footer__maininner">
          <div class="footer__top">
            <section class="footer__customer-service" aria-labelledby="customer-service__title">
              <h2 id="customer-service__title">고객행복센터</h2>
              <div class="number">
                <p class="tel-number"><a href="tel:1644-1107" aria-label="전화 문의 1644-1107">1644-1107</a></p>
                <p>월~토요일 오전 7시 - 오후 6시</p>
              </div>
              <ul>  
                <li>
                  <button type="button" class="button">카카오톡 문의</button>
                  <p>월~토요일 | 오전 7시 - 오후 6시<br />
                  일/공휴일 | 오전 7시 - 오후 1시</p>
                </li>
                <li>
                  <button type="button" class="button">1:1 문의</button>
                    <p>365일<br />
                    고객센터 운영시간에 순차적으로 답변드리겠습니다.</p>
                </li>
                <li>
                  <button type="button" class="button">대량주문 문의</button>
                    <p>월~금요일 | 오전 9시 - 오후 6시<br />
                    점심시간 | 낮 12시 - 오후 1시</p>
                </li>
              </ul>
              <div class="mail">
                <p>비회원 문의 : <a href="mailto:help@karlycorp.com">help@karlycorp.com</a></p>
                <p>비회원 대량주문 문의 : <a href="mailto:help@karlycorp.com">help@karlycorp.com</a></p>
              </div>
            </section>
            <section class="footer__company-info" aria-label="회사 정보">
              <nav>
                <ul>
                  <li><a href="#">칼리소개</a></li>
                  <li><a href="#">칼리소개영상</a></li>
                  <li><a href="#">인재채용</a></li>
                  <li><a href="#">이용약관</a></li>
                  <li><a href="#">개인정보처리방침</a></li>
                  <li><a href="#">이용안내</a></li>
                </ul>
              </nav>
              <address>
                <p class="company-info__business-info">법인명 (상호) : 주식회사 컬리 | 사업자등록번호 : 261-81-23567 | <a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=2618123467"  target="_blank" rel="noopener noreferrer">사업자정보 확인</a></p>
                <p>통신판매업 : 제 2018-서울강남-01646호 |
                개인정보보호책임자 : 이원준</p> 
                <p>주소 : 서울특별시 강남구 테헤란로 133, 18층(역삼동) | 대표이사 : 김슬아</p>
                <p>입점문의 : 입점문의하기 | 제휴문의 :
                <a href="mailto:business@karlycrop.com">business@karlycorp.com</a></p>
                <p>채용문의 :
                <a href="mailto:recruit@karlycorp.com">recruit@karlycorp.com</a></p>
                <p>팩스 : 070 - 7500 - 6098</p>
              </address>
              <ul class="company-info__sns-links" aria-label="sns링크">
                <li><a href="https://blog.naver.com/marketkurly" target='_blank' aria-label="칼리 블로그"><img src="/assets/svg/Blog.svg" alt=""></a></li>
                <li><a href="https://www.instagram.com/marketkurly/" target='_blank' aria-label="칼리 인스타그램"><img src="/assets/svg/Instagram.svg" alt=""></a></li>
                <li><a href="https://www.facebook.com/Marketkurly/" target='_blank' aria-label="칼리 페이스북"><img src="/assets/svg/FaceBook.svg" alt=""></a></li>
                <li><a href="https://m.post.naver.com/marketkurly" target='_blank' aria-label="칼리 네이버 포스트"><img src="/assets/svg/NaverPost.svg" alt=""></a></li>
                <li><a href="https://www.youtube.com/channel/UCfpdjL5pl-1qKT7Xp4UQzQg" target='_blank' aria-label="칼리 유튜브"><img src="/assets/svg/Youtube.svg" alt=""></a></li>
              </ul>
            </section>
          </div>
          <div class="footer__middle">
            
              <a href="/" target='_blank'>
                <img src="/assets/svg/isms.svg" alt="">
                <p>[인증범위] 마켓칼리 쇼핑몰 서비스 개발 운영<br />(심사받지 않은 물리적 인프라 제외)<br /> [유효기간] 2022.01.19 ~ 2025.01.18</p>
              </a>
              <a href="/" target='_blank'>
                <img src="/assets/svg/logo_privacy.svg" alt="">
                <p>개인정보보호 우수 웹사이트<br />개인정보처리시스템 인증 (ePRIVACY PLUS)</p>
              </a>
              <a href="/" target='_blank'>
                <img src="/assets/svg/logo_tosspayments.svg" alt="">
                <p>토스페이먼츠 구매안전(에스크로)서비스<br />를 이용하실 수 있습니다.</p>
              </a>
              <a href="/" target='_blank'>
                <img src="/assets/svg/logo_wooriBank.svg" alt="">
                <p>고객님이 현금으로 결제한 금액에 대해 우리은행과채무지급보<br />증 계약을 체결하여 안전거래를 보장하고있습니다.</p>
              </a>
            
          </div>
        </div>
        <div class="footer__bottom">
          <div class="footer__subinner">
            <small>마켓칼리에서 판매되는 상품 중에는 마켓칼리에 입점한 개별 판매자가 판매하는 마켓플레이스(오픈마켓) 상품이 포함되어 있습니다.<br />
            마켓플레이스(오픈마켓) 상품의 경우 칼리는 통신판매중개자로서 통신판매의 당사자가 아닙니다. 칼리는 해당 상품의 주문, 품질, 교환/환불 등 의무와 책임을 부담하지 않습니다.</small>
            <small>© KURLY CORP. ALL RIGHTS RESERVED</small>
          </div>
        </div>
      </footer>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ssagwakurly-footer', KurlyFooter);
