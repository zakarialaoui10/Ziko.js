import ZikoUIElement from "../../ZikoUIElement.js";

class ZikoUITextArea extends ZikoUIElement {
    constructor() {
      super();
      this.element = document.createElement("textarea");
      //Object.assign(this,inputComposer.call(this));
    }
    get value(){
      return this.element.textContent;
    }
    get isTextArea(){
      return true;
    }
  }

  const textarea =()=> new ZikoUITextArea();
  export {textarea}