const __UI__={}
const __HYDRATION_MAP__ = new Map()
const __Config__={
    default:{
        target:null,
        render:true,
        math:{
            mode:"deg"
        }
    },
    setDefault:function(pairs){
        const keys=Object.keys(pairs);
        const values=Object.values(pairs);
        for(let i=0;i<keys.length;i++)this.default[keys[i]]=values[i];
    },
    init:()=>document.documentElement.setAttribute("data-engine","zikojs"),
    renderingMode :"spa",
    isSSC : false,
}
export {
    __UI__,
    __HYDRATION_MAP__,
    __Config__
}
