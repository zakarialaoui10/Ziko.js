import { ZikoUseStyle } from "../../reactivity/hooks/ui/useStyle.js";
import { ZikoUIElementStyle } from "../style/index.js";
import { 
  usePointerEvent,
  useMouseEvent, 
  useWheelEvent,
  useKeyEvent, 
  useDragEvent , 
  useDropEvent, 
  useClickEvent , 
  useClipboardEvent ,
  useFocusEvent,
  useCustomEvent,
  useSwipeEvent,
  watchIntersection, 
  watchSize,
  watchAttr,
  watchChildren
} from "../../reactivity"
import { Random } from "../../math";
import { Str } from "../../data";
class ZikoUIElement {
  constructor(element ,name="") {
    this.target = globalThis.__Ziko__.__Config__.default.target||globalThis?.document?.body;
    if(typeof element === "string") {
      element === "svg" ? element=globalThis?.document?.createElementNS("http://www.w3.org/2000/svg", "svg"): element = globalThis?.document?.createElement(element);
    }
    this.element = element;
    this.uuid=this.constructor.name+"-"+Random.string(10);
    this.cache = {
      name,
      parent:null,
      isBody:false,
      isRoot:false,
      isHidden: false,
      isFrozzen:false,
      legacyParent : null,
      style: new ZikoUIElementStyle({}),
      attributes: {},
      filters: {},
      temp:{}
    };
    this.events = {
      ptr:null,
      mouse:null,
      wheel:null,
      key:null,
      drag:null,
      drop:null,
      click:null,
      clipboard:null,
      focus:null,
      swipe:null,
      custom:null,
    }
    this.observer={
      resize:null,
      intersection:null
    }
    this.cache.style.linkTo(this);
    this.style({ 
      position: "relative",
      boxSizing:"border-box",
      // fontFamily:"verdana",
      margin:0,
      padding:0,
     });
    this.size("auto", "auto");
    globalThis.__Ziko__.__UI__[this.cache.name]?globalThis.__Ziko__.__UI__[this.cache.name]?.push(this):globalThis.__Ziko__.__UI__[this.cache.name]=[this];
    globalThis.__Ziko__.__Config__.default.render && this.render()
  }
  get st(){
    return this.cache.style;
  }
  get attr(){
    return this.cache.attributes;
  }
  get evt(){
    return this.cache.events;
  }
  get html(){
    return this.element.innerHTML;
  }
  get text(){
    return this.element.textContent;
  }
  get isBody(){
    return this.element === globalThis?.document.body;
  }
  get __app__(){
    if(this.cache.isRoot)return this;
    let root=this.cache.parent;
    while(1){
      if(!root)return null;
      if(root.cache.isRoot)return root;
      root=root.parent;
    }
  }
  get parent(){
    return this.cache.parent;
  }
  get width(){
    return this.element.getBoundingClientRect().width;
  }
  get height(){
    return this.element.getBoundingClientRect().height;
  }
  get top(){
    return this.element.getBoundingClientRect().top;
  }
  get right(){
    return this.element.getBoundingClientRect().right;
  }
  get bottom(){
    return this.element.getBoundingClientRect().bottom;
  }
  get left(){
    return this.element.getBoundingClientRect().left;
  }
  clone(render=false) {
    const UI = new this.constructor();
    UI.__proto__=this.__proto__;
    if(this.items.length){
      const items = [...this.items].map(n=>n.clone());
      UI.append(...items);
    }
    else UI.element=this.element.cloneNode(true);
    return UI.render(render);
  }
  style(styles){
    styles instanceof ZikoUseStyle ? this.st.style(styles.current): this.st.style(styles);
    return this;
  }
  size(width,height){
    this.st.size(width,height);
    return this; 
  }
  get #SwitchedStyleRTL_LTR(){
    const CalculedStyle = globalThis.getComputedStyle(this.element); 
    const SwitchedStyle = {}
    if(CalculedStyle.marginRight!=="0px")Object.assign(SwitchedStyle, {marginLeft: CalculedStyle.marginRight});
    if(CalculedStyle.marginLeft!=="0px")Object.assign(SwitchedStyle, {marginRight: CalculedStyle.marginLeft});
    if(CalculedStyle.paddingRight!=="0px")Object.assign(SwitchedStyle, {paddingLeft: CalculedStyle.paddingRight});
    if(CalculedStyle.paddingLeft!=="0px")Object.assign(SwitchedStyle, {paddingRight: CalculedStyle.paddingLeft});
    if(CalculedStyle.left!=="0px")Object.assign(SwitchedStyle, {right: CalculedStyle.left});
    if(CalculedStyle.right!=="0px")Object.assign(SwitchedStyle, {left: CalculedStyle.right});
    if(CalculedStyle.textAlign === "right")Object.assign(SwitchedStyle, {textAlign: "left"});
    if(CalculedStyle.textAlign === "left")Object.assign(SwitchedStyle, {textAlign: "right"});
    if(CalculedStyle.float === "right")Object.assign(SwitchedStyle, {float: "left"});
    if(CalculedStyle.float === "left")Object.assign(SwitchedStyle, {float: "right"});
    if(CalculedStyle.borderRadiusLeft!=="0px")Object.assign(SwitchedStyle, {right: CalculedStyle.borderRadiusRight});
    if(CalculedStyle.borderRadiusRight!=="0px")Object.assign(SwitchedStyle, {right: CalculedStyle.borderRadiusLeft});
    if(["flex","inline-flex"].includes(CalculedStyle.display)){
      if(CalculedStyle.justifyContent === "flex-end")Object.assign(SwitchedStyle, {justifyContent: "flex-start"});
      if(CalculedStyle.justifyContent === "flex-start")Object.assign(SwitchedStyle, {justifyContent: "flex-end"});
    }
    return SwitchedStyle;
  }
  useRtl(switchAll = false){
    switchAll ? this.style({
      ...this.#SwitchedStyleRTL_LTR,
      direction : "rtl"
    }) : this.style({direction : "rtl"}); 
    return this;
  }
  useLtr(switchAll = false){
    switchAll ? this.style({
      ...this.#SwitchedStyleRTL_LTR,
      direction : "ltr"
    }) : this.style({direction : "ltr"}); 
    return this;
  }
  freeze(freeze){
    this.cache.isFrozzen=freeze;
    return this;
  }
  setTarget(tg) {
    if(this.isBody) return ;
    if (tg instanceof ZikoUIElement) tg = tg.element;
    this.unrender();
    this.target = tg;
    this.render();
    return this;
  }
  describe(label){
    if(label)this.setAttr("aria-label",label)
  }
  render(target = this.target) {
    if(this.isBody)return ;
    if(target instanceof ZikoUIElement)target=target.element;
    this.target=target;
    this.target?.appendChild(this.element);
    return this;
  }
  unrender(){
    if(this.cache.parent)this.cache.parent.remove(this);
    else if(this.target?.children?.length && [...this.target?.children].includes(this.element)) this.target.removeChild(this.element);
    return this;
  }
  renderAfter(t = 1) {
    setTimeout(() => this.render(), t);
    return this;
  }
  unrenderAfter(t = 1) {
    setTimeout(() => this.unrender(), t);
    return this;
  }
  after(ui){
    if(ui instanceof ZikoUIElement) ui=ui.element;
    this.element?.after(ui)
    return this;
  }
  before(ui){
    if(ui instanceof ZikoUIElement) ui=ui.element;
    this.element?.before(ui)
    return this;
  }
  animate(keyframe, {duration=1000, iterations=1, easing="ease"}={}){
    this.element?.animate(keyframe,{duration, iterations, easing});
    return this;
  }
    // Attributes
  #setAttr(name, value){
    name = Str.isCamelCase(name) ? Str.camel2hyphencase(name) : name;
    if(this?.attr[name] && this?.attr[name]===value) return;
    this.element.setAttribute(name, value)
    Object.assign(this.cache.attributes, {[name]:value});
  }
  setAttr(name, value) {
    if(name instanceof Object){
      const [names,values]=[Object.keys(name),Object.values(name)];
      for(let i=0;i<names.length;i++){
        if(values[i] instanceof Array)value[i] = values[i].join(" ");
        this.#setAttr(names[i], values[i])
      }
    }
    else{
      if(value instanceof Array)value = value.join(" ");
      this.#setAttr(name, value)
    }
    return this;
  }
  removeAttr(...names) {
    for(let i=0;i<names.length;i++)this.element?.removeAttribute(names[i]);
    return this;
  }
  getAttr(name){
    name = Str.isCamelCase(name) ? Str.camel2hyphencase(name) : name;
    return this.element.attributes[name].value;
  }
  setContentEditable(bool = true) {
    this.setAttr("contenteditable", bool);
    return this;
  }
  get children() {
    return [...this.element.children];
  }
  get cloneElement() {
    return this.element.cloneNode(true);
  }
  setClasses(...value) {
    this.setAttr("class", value.join(" "));
    return this;
  }
  get classes(){
    const classes=this.element.getAttribute("class");
    return classes===null?[]:classes.split(" ");
  }
  addClass() {
    /*this.setAttr("class", value);
        return this;*/
  }
  setId(id) {
    this.setAttr("id", id);
    return this;
  }
  get id() {
    return this.element.getAttribute("id");
  }
  onPtrMove(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onMove(...callbacks);
    return this;
  }
  onPtrDown(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onDown(...callbacks);
    return this;
  }
  onPtrUp(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onUp(...callbacks);
    return this;
  }
  onPtrEnter(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onEnter(...callbacks);
    return this;
  }
  onPtrLeave(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onLeave(...callbacks);
    return this;
  }
  onPtrOut(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onOut(...callbacks);
    return this;
  }
  onPtrCancel(...callbacks){
    if(!this.events.ptr)this.events.ptr = usePointerEvent(this);
    this.events.ptr.onCancel(...callbacks);
    return this;
  }
  onSwipe(width_threshold, height_threshold,...callbacks){
    if(!this.events.swipe)this.events.swipe = useSwipeEvent(this, width_threshold, height_threshold);
    this.events.swipe.onSwipe(...callbacks);
    return this;
  }
  onMouseMove(...callbacks){
    if(!this.events.mouse)this.events.mouse = useMouseEvent(this);
    this.events.mouse.onMove(...callbacks);
    return this;
  }
  onMouseDown(...callbacks){
    if(!this.events.mouse)this.events.mouse = useMouseEvent(this);
    this.events.mouse.onDown(...callbacks);
    return this;
  }
  onMouseUp(...callbacks){
    if(!this.events.mouse)this.events.mouse = useMouseEvent(this);
    this.events.mouse.onUp(...callbacks);
    return this;
  }
  onMouseEnter(...callbacks){
    if(!this.events.mouse)this.events.mouse = useMouseEvent(this);
    this.events.mouse.onEnter(...callbacks);
    return this;
  }
  onMouseLeave(...callbacks){
    if(!this.events.mouse)this.events.mouse = useMouseEvent(this);
    this.events.mouse.onLeave(...callbacks);
    return this;
  }
  onMouseOut(...callbacks){
    if(!this.events.mouse)this.events.mouse = useMouseEvent(this);
    this.events.mouse.onOut(...callbacks);
    return this;
  }
  onWheel(...callbacks){
    if(!this.events.wheel)this.events.wheel = useWheelEvent(this);
    this.events.wheel.onWheel(...callbacks);
    return this;
  }
  onKeyDown(...callbacks){
    if(!this.events.key)this.events.key = useKeyEvent(this);
    this.events.key.onDown(...callbacks);
    return this;
  }
  onKeyPress(...callbacks){
    if(!this.events.key)this.events.key = useKeyEvent(this);
    this.events.key.onPress(...callbacks);
    return this;
  }
  onKeyUp(...callbacks){
    if(!this.events.key)this.events.key = useKeyEvent(this);
    this.events.key.onUp(...callbacks);
    return this;
  }
  onKeysDown({keys=[],callback}={}){
    if(!this.events.key)this.events.key = useKeyEvent(this);
    this.events.key.handleSuccessifKeys({keys,callback});
    return this;
  }
  onDragStart(...callbacks){
    if(!this.events.drag)this.events.drag = useDragEvent(this);
    this.events.drag.onStart(...callbacks);
    return this;
  }
  onDrag(...callbacks){
    if(!this.events.drag)this.events.drag = useDragEvent(this);
    this.events.drag.onDrag(...callbacks);
    return this;
  }
  onDragEnd(...callbacks){
    if(!this.events.drag)this.events.drag = useDragEvent(this);
    this.events.drag.onEnd(...callbacks);
    return this;
  }
  onDrop(...callbacks){
    if(!this.events.drop)this.events.drop = useDropEvent(this);
    this.events.drop.onDrop(...callbacks);
    return this;
  }
  onClick(...callbacks){
    if(!this.events.click)this.events.click = useClickEvent(this);
    this.events.click.onClick(...callbacks);
    return this;
  }
  onDbClick(...callbacks){
    if(!this.events.click)this.events.click = useClickEvent(this);
    this.events.click.onDbClick(...callbacks);
    return this;
  }
  onCopy(...callbacks){
    if(!this.events.clipboard)this.events.clipboard = useClipboardEvent(this);
    this.events.clipboard.onCopy(...callbacks);
    return this;
  }
  onCut(...callbacks){
    if(!this.events.clipboard)this.events.clipboard = useClipboardEvent(this);
    this.events.clipboard.onCut(...callbacks);
    return this;
  }
  onPaste(...callbacks){
    if(!this.events.clipboard)this.events.clipboard = useClipboardEvent(this);
    this.events.clipboard.onPaste(...callbacks);
    return this;
  }
  onSelect(...callbacks){
    if(!this.events.clipboard)this.events.clipboard = useClipboardEvent(this);
    this.events.clipboard.onSelect(...callbacks);
    return this;
  }
  onFocus(...callbacks){
    if(!this.events.focus)this.events.focus = useFocusEvent(this);
    this.events.focus.onFocus(...callbacks);
    return this;
  }
  onBlur(...callbacks){
    if(!this.events.focus)this.events.focus = useFocusEvent(this);
    this.events.focus.onFocus(...callbacks);
    return this;
  }
  on(event_name,...callbacks){
    if(!this.events.custom)this.events.custom = useCustomEvent(this);
    this.events.custom.on(event_name,...callbacks);
    return this;
  }
  emit(event_name,detail={}){
    if(!this.events.custom)this.events.custom = useCustomEvent(this);
    this.events.custom.emit(event_name,detail);
    return this;
  }
  watchAttr(callback){
    if(!this.observer.attr)this.observer.attr = watchAttr(this,callback);
    return this;
  }
  watchChildren(callback){
    if(!this.observer.children)this.observer.children = watchChildren(this,callback);
    return this;
  }
  watchSize(callback){
    if(!this.observer.resize)this.observer.resize = watchSize(this,callback);
    this.observer.resize.start();
    return this;
  }
  watchIntersection(callback,config){
    if(!this.observer.intersection)this.observer.intersection = watchIntersection(this,callback,config);
    this.observer.intersection.start();
    return this;
  }
  setFullScreen(set = true, e) {
    if(!this.element.requestFullscreen){
      console.error("Fullscreen API is not supported in this browser.");
      return this;
    }
    if (set) this.element.requestFullscreen(e);
    else globalThis.document.exitFullscreen();
    return this;
  }
  toggleFullScreen(e) {
    if (!globalThis.document.fullscreenElement) this.element.requestFullscreen(e);
    else globalThis.document.exitFullscreen();
    return this;
  }
  toPdf(){
    if(__ZikoPdf__){

    }
    return this;
  }
}
class ZikoUIContainerElement extends ZikoUIElement{
  constructor(element, name=""){
      super(element, name)
      this.items = [];
  }
  maintain() {
    for (let i = 0; i < this.items.length; i++)
      Object.assign(this, { [[i]]: this.items[i] });
    this.length = this.items.length;
    return this;
  }
  at(index) {
    return this.items.at(index);
  }
  append(...ele) {
      if(this.cache.isFrozzen){
        console.warn("You can't append new item to frozzen element");
        return this;
      }
      for (let i = 0; i < ele.length; i++){
      if(["number","string"].includes(typeof ele[i]))ele[i]=text(ele[i]);
        if (ele[i] instanceof ZikoUIElement) {
          ele[i].cache.parent=this;
          this.element?.appendChild(ele[i].element);
          ele[i].target = this.element;
          this.items.push(ele[i]);
        } else if (ele[i] instanceof Object) {
          if (ele[i]?.style) this.style(ele[i]?.style);
          if (ele[i]?.attr) {
            Object.entries(ele[i].attr).forEach((n) =>
              this.setAttr("" + n[0], n[1]),
            );
          }
        }
      }
      this.maintain();
      return this;
    }
    insertAt(index, ...ele) {
      if (index >= this.element.children.length) this.append(...ele);
      else
        for (let i = 0; i < ele.length; i++) {
          if(["number","string"].includes(typeof ele[i]))ele[i]=text(ele[i]);
          this.element?.insertBefore(ele[i].element, this.items[index].element);
          this.items.splice(index, 0, ele[i]);
        }
      return this;
    }
    // remove(...ele) {
    //   if(ele.length==0){
    //     if(this.cache.parent)this.cache.parent.remove(this);
    //     else if(this.target.children.length && [...this.target.children].includes(this.element)) this.target.removeChild(this.element);
    //   }
    //   else {
    //     const remove = (ele) => {
    //       if(typeof ele === "number") ele=this.items[ele];
    //       if(ele instanceof ZikoUIElement)this.element?.removeChild(ele.element);
    //         this.items=this.items.filter(n=>n!==ele);
    //     };
    //     for (let i = 0; i < ele.length; i++) remove(ele[i]);
    //     for (let i = 0; i < this.items.length; i++)Object.assign(this, { [[i]]: this.items[i] });
    //     // Remove from item 
    //   }
    //   return this;
    // }
    remove(...ele) {
        const remove = (ele) => {
          if(typeof ele === "number") ele=this.items[ele];
          if(ele instanceof ZikoUIElement)this.element?.removeChild(ele.element);
            this.items=this.items.filter(n=>n!==ele);
        };
        for (let i = 0; i < ele.length; i++) remove(ele[i]);
        for (let i = 0; i < this.items.length; i++)Object.assign(this, { [[i]]: this.items[i] });
        // Remove from item 
      return this;
    }
    forEach(callback){
      this.items.forEach(callback);
      return this;
    }
    map(callback){
      return this.items.map(callback);
    }
    find(condition){
      return this.items.filter(condition);
    }
    filter(condition_callback,if_callback=()=>{},else_callback=()=>{}){
      const FilterItems=this.items.filter(condition_callback);
      FilterItems.forEach(if_callback);
      this.items.filter(item => !FilterItems.includes(item)).forEach(else_callback);
      return this;
    }
    filterByTextContent(text,exactMatch=false){
      this.items.forEach(n=>n.render());
      this.filter(
        n=>!(exactMatch?n.text===text:n.text.includes(text)),
        e=>e.unrender()
      )
      // this.items.filter(n=>{
      //   const content=n.element.textContent;
      //   return !(exactMatch?content===text:content.includes(text))
      // }).map(n=>n.unrender());
      //  return this;
    }
    filterByClass(value){
      this.items.map(n=>n.render());
      this.items.filter(n=>!n.classes.includes(value)).map(n=>n.unrender());
      return this; 
    }
    sortByTextContent(value, displays) {
      let item = this.children;
      item
        .filter((n) => !n.textContent.toLowerCase().includes(value.toLowerCase()))
        .map((n) => {
          n.style.display = "none";
        });
      item
        .filter((n) => n.textContent.toLowerCase().includes(value.toLowerCase()))
        .map((n, i) => (n.style.display = displays[i]));
      //return item.filter(n=>n.style.display!="none")
      item.filter((n) => n.style.display != "none");
      return this;
    }
}
export {ZikoUIContainerElement};
export {ZikoUIElement};
// export default ZikoUIElement;