class CardSelector {
  constructor(params) {
    this.container = params.container;
    this.items = params.items;
    
    this.index = -1;
    this.direction = 0;
  }

  previous() {
    if (--this.index < 0) {this.index = this.items.length-1;}
    if (this.items[this.index] === undefined) {return}

    let newCard = document.createElement("div");
    newCard.classList.add('fadeInRight')
    newCard.setAttribute('style', "position: relative; min-width: 100%; min-height: 100%; display: flex; right: 100%")
    newCard.appendChild(this.items[this.index].cloneNode(true));

    if (this.container.children?.length == 1) {
      let prevCard = this.container.children[0];
      prevCard.style.right = '100%'
      prevCard.classList.remove('fadeInLeft');
      prevCard.classList.add('fadeOutRight')
      void prevCard.offsetWidth;
      this.container.insertBefore(newCard, prevCard);
    } 
    else if (this.container.children?.length == 2) {
      if (this.direction < 0) { // im going in the same direction
        this.container.removeChild(this.container.children[1]);
        this.container.children[0].style.right = '100%';
        this.container.children[0].classList.remove('fadeInLeft');
        this.container.children[0].classList.remove('fadeInRight');
        void this.container.children[0].offsetWidth;
        this.container.children[0].classList.add('fadeOutRight')

        this.container.insertBefore(newCard, this.container.children[0]);
      } else { // the direction switched
        this.container.children[0].style.right = '100%';
        this.container.children[0].classList.remove('fadeOutLeft');
        this.container.children[0].classList.remove('fadeOutRight');
        void this.container.children[0].offsetWidth;
        this.container.children[0].classList.add('fadeInRight')

        this.container.children[1].style.right = '100%';
        this.container.children[1].classList.remove('fadeInLeft');
        this.container.children[1].classList.remove('fadeInRight');
        void this.container.children[1].offsetWidth;
        this.container.children[1].classList.add('fadeOutRight')
      }
    }
    this.direction = -1;
  }

  next() {
    if (++this.index > this.items.length-1) {this.index = 0;}
    if (this.items[this.index] === undefined) {return}

    let newCard = document.createElement("div");
    newCard.classList.add('fadeInLeft')
    newCard.setAttribute('style', "position: relative; min-width: 100%; min-height: 100%; display: flex;")
    newCard.appendChild(this.items[this.index].cloneNode(true));

    if (this.container.children.length == 0) {
      this.container.appendChild(newCard);
    }
    else if (this.container.children?.length == 1) {
      newCard.style.right = '100%'
      let prevCard = this.container.children[0];
      prevCard.style.right = '100%'
      prevCard.classList.remove('fadeInLeft');
      void prevCard.offsetWidth;
      prevCard.classList.add('fadeOutLeft')
      this.container.appendChild(newCard);
    } 
    else if (this.container.children?.length == 2) {
      if (this.direction > 0) { // im going in the same direction
        this.container.removeChild(this.container.children[0]);
        this.container.children[0].style.right = '100%';
        this.container.children[0].classList.remove('fadeInLeft');
        this.container.children[0].classList.remove('fadeInRight');
        void this.container.children[0].offsetWidth;
        this.container.children[0].classList.add('fadeOutLeft')

        newCard.style.right = '100%'
        this.container.appendChild(newCard);
      } else { // the direction switched
        this.container.children[1].style.right = '100%';
        this.container.children[1].classList.remove('fadeInLeft');
        this.container.children[1].classList.remove('fadeInRight');
        this.container.children[1].classList.remove('fadeOutRight');
        void this.container.children[1].offsetWidth;
        this.container.children[1].classList.add('fadeInLeft')

        this.container.children[0].style.right = '100%';
        this.container.children[0].classList.remove('fadeOutLeft');
        this.container.children[0].classList.remove('fadeOutRight');
        void this.container.children[0].offsetWidth;
        this.container.children[0].classList.add('fadeOutLeft')
      }
    }
    this.direction = 1;
  }
}

class Slides extends HTMLElement {
  constructor() {
    super();
    this.selector = undefined;
  }

  handlePrevious() {
    this.selector.previous();
  }

  handleNext() {
    this.selector.next();
  }

  disconnectedCallback() {
  }

  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = `
      .container {
        min-width: 100%;
        min-height: 100%;
        flex-grow: 1;
        background-color: none;
        display: flex;
        overflow: hidden;
        z-index: 0;
      }

      .fadeInLeft {
        animation: 
          slideLeft 1s forwards, 
          fadeIn 1s forwards;
      }

      .fadeInRight {
        animation: 
          slideRight 1s forwards, 
          fadeIn 1s forwards;
      }

      .fadeOutLeft {
        animation: 
          slideLeft 1s forwards, 
          fadeOut 1s forwards;
      }

      .fadeOutRight {
        animation: 
          slideRight 1s forwards, 
          fadeOut 1s forwards;
      }

      @keyframes slideLeft {
        0% {transform: translate(100%, 0%);}
        100% {transform: translate(0%, 0%);}
      }

      @keyframes slideRight {
        0% {transform: translate(0%, 0%);}
        100% {transform: translate(100%, 0%);}
      }

      @keyframes fadeIn {
        from {opacity: 0%;}
        to {opacity: 100%;}
      }

      @keyframes fadeOut {
        from {opacity: 100%;}
        to {opacity: 0%;}
      }
    `;

    const shadow = this.attachShadow({mode: "open"});
    const container = document.createElement("div");
    container.classList.add("container");
    shadow.appendChild(style);
    shadow.appendChild(container);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        const children = Array.from(this.children);
        this.selector = new CardSelector({container: container, items: children});
        this.selector.next();
      }.bind(this), {once: true})
    } else {
      const children = Array.from(this.children);
      this.selector = new CardSelector({container: container, items: children});
      this.selector.next();
    }
  }
}

customElements.define('slides-element', Slides)
