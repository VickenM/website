class Cards extends HTMLElement {
  static observedAttributes = ["heading", "date", "class"];
         
  constructor() {
    super();

    this.innerHTML = `
      <article 
          class="${this.getAttribute('className')}" 
          style="display: flex; flex-direction: column; gap: 1rem;"
      >
        <div style="display: flex;">
          <h2 style="margin: 0rem; flex-grow: 1;">${this.getAttribute('heading')}</h2>
          <h4 style="margin: 0rem;">${this.getAttribute('date')}</h4>
        </div>
        <div>
          ${Array.from(this.children).map(element => `${element.innerHTML}`).join('')}
        </div>
      </article>
    `;
  }

  disconnectedCallback() {
  }

  connectedCallback() {
//    if (document.readyState === "loading") {
//      document.addEventListener("DOMContentLoaded", function() {
//        const children = Array.from(this.children);
//        children.forEach((child)=>{this.root.appendChild(child)})
//      }.bind(this), {once: true})
//    } else {
//      const children = Array.from(this.children);
//      children.forEach((child)=>{this.root.appendChild(child)})
//    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "heading") {
      console.log(`new heading: ${oldValue} -> ${newValue}`)
    } else if (name === "date") {
      console.log(`new date: ${oldValue} -> ${newValue}`)
    } else if (name === "class") {
      console.log(`class list: ${newValue}`)
    }
  } 
}

customElements.define('cards-element', Cards)
