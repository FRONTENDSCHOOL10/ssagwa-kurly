class ProductDetail extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'})
  }

  connectedCallback(){
    this.render();
  }

  render(){
    
  }
}



//html 템플릿 추가
const template = document.createElement('template');
template.innerHTML = /* html */`
  
`

