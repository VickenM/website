class Cards extends HTMLElement {
  static observedAttributes = ["heading", "date", "class"];
         
  constructor() {
    super();

    const style = document.createElement("style");
    style.textContent = ``;

    const shadow = this.attachShadow({mode: "open"});

    const container = document.createElement("article");
    container.style.cssText = "display: flex; flex-direction: column;"; 

    const header = document.createElement("div");
    header.style.cssText = "display: flex;";

    const heading = document.createElement("h2");
    heading.style.cssText = "margin: 0rem; flex-grow: 1;"

    const date = document.createElement("h4");
    date.style.cssText = "margin: 0rem;"
    date.textContent = "wicked"

    const content = document.createElement("div");
    content.id = "content";

    header.appendChild(heading);
    header.appendChild(date);
    container.appendChild(header);
    container.appendChild(content);

    shadow.appendChild(style);
    shadow.appendChild(container);
    
    this.container = container;
    this.date = date;
    this.heading = heading;
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
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        const children = Array.from(this.children);
        children.forEach((child)=>{this.container.appendChild(child)})
      }.bind(this), {once: true})
    } else {
      const children = Array.from(this.children);
      children.forEach((child)=>{this.container.appendChild(child)})
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "heading") {
      this.heading.textContent = newValue;
    } else if (name == "date") {
      this.date.textContent = newValue;
    } else if (name == "class") {
      console.log(newValue)
      this.container.classList.add(newValue.split(" "))
    }
  } 
}

customElements.define('cards-element', Cards)
