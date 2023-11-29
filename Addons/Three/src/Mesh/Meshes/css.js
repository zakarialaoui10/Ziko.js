import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { ZikoThreeObject } from '../ZikoThreeMesh';
//const UI3=ui=>new CSS3DObject(ui.element)
class ZikoThreeCss extends ZikoThreeObject{
    constructor(UIElement){
        super()
        this.cache={
            type:"css"
        }
        this.element=new CSS3DObject(UIElement.element)
    }
}
const UI3=UIElement=>new ZikoThreeCss(UIElement)
export {UI3}