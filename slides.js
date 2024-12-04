class SlideSelector {
  constructor(params) {
    this.container = params.container;
    this.items = params.items;
    
    this.index = -1;
    this.direction = 0;
  }

  previous() {
    if (--this.index < 0) {this.index = this.items.length-1;}
    if (this.items[this.index] === undefined) {return}

    let newSlide = document.createElement("div");
    newSlide.classList.add('fadeInRight')
    newSlide.setAttribute('style', "position: relative; min-width: 100%; min-height: 100%; display: flex; right: 100%")
    newSlide.appendChild(this.items[this.index].cloneNode(true));

    if (this.container.children?.length == 1) {
      let prevSlide = this.container.children[0];
      prevSlide.style.right = '100%'
      prevSlide.classList.remove('fadeInLeft');
      prevSlide.classList.add('fadeOutRight')
      void prevSlide.offsetWidth;
      this.container.insertBefore(newSlide, prevSlide);
    } 
    else if (this.container.children?.length == 2) {
      if (this.direction < 0) { // im going in the same direction
        this.container.removeChild(this.container.children[1]);
        this.container.children[0].style.right = '100%';
        this.container.children[0].classList.remove('fadeInLeft');
        this.container.children[0].classList.remove('fadeInRight');
        void this.container.children[0].offsetWidth;
        this.container.children[0].classList.add('fadeOutRight')

        this.container.insertBefore(newSlide, this.container.children[0]);
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

    let newSlide = document.createElement("div");
    newSlide.classList.add('fadeInLeft')
    newSlide.setAttribute('style', "position: relative; min-width: 100%; min-height: 100%; display: flex;")
    newSlide.appendChild(this.items[this.index].cloneNode(true));

    if (this.container.children.length == 0) {
      this.container.appendChild(newSlide);
    }
    else if (this.container.children?.length == 1) {
      newSlide.style.right = '100%'
      let prevSlide = this.container.children[0];
      prevSlide.style.right = '100%'
      prevSlide.classList.remove('fadeInLeft');
      void prevSlide.offsetWidth;
      prevSlide.classList.add('fadeOutLeft')
      this.container.appendChild(newSlide);
    } 
    else if (this.container.children?.length == 2) {
      if (this.direction > 0) { // im going in the same direction
        this.container.removeChild(this.container.children[0]);
        this.container.children[0].style.right = '100%';
        this.container.children[0].classList.remove('fadeInLeft');
        this.container.children[0].classList.remove('fadeInRight');
        void this.container.children[0].offsetWidth;
        this.container.children[0].classList.add('fadeOutLeft')

        newSlide.style.right = '100%'
        this.container.appendChild(newSlide);
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
        this.selector = new SlideSelector({container: container, items: children});
        this.selector.next();
      }.bind(this), {once: true})
    } else {
      const children = Array.from(this.children);
      this.selector = new SlideSelector({container: container, items: children});
      this.selector.next();
    }
  }
}

customElements.define('slides-element', Slides)
