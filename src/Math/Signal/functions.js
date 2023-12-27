import { Complex , complex } from "../Complex";
import { abs , pow , sqrtn } from "../Functions";
import { mul } from "../Utils";
import { E } from "../const";
import { Matrix  } from "../Matrix";
const zeros=(n)=>new Array(n).fill(0);
const ones=(n)=>new Array(n).fill(1);
const nums=(num,n)=>new Array(n).fill(num);
const norm=(value, min, max)=>{
    if (typeof value === "number") return min !== max ? (value - min) / (max - min) : 0;
    else if (value instanceof Matrix) return new Matrix(value.rows, value.cols, norm(value.arr.flat(1), min, max));
    else if (value instanceof Complex) return new Complex(norm(value.a, min, max), norm(value.b, min, max));
    else if (value instanceof Array) {
        if (value.every((n) => typeof (n === "number"))) {
            return value.map((n) => norm(n, min, max));
        } else {
            let y = new Array(value.length);
            for (let i = 0; i < value.length; i++) {
                y[i] = norm(value[i]);
            }
        }
    }
}
const lerp=(value, min, max)=>{
    if (typeof value === "number") return (max - min) * value + min;
    else if (value instanceof Matrix) return new Matrix(value.rows, value.cols, lerp(value.arr.flat(1), min, max));
    else if (value instanceof Complex) return new Complex(lerp(value.a, min, max), lerp(value.b, min, max));
    else if (value instanceof Array) {
        if (value.every((n) => typeof (n === "number"))) {
            return value.map((n) => lerp(n, min, max));
        } else {
            let y = new Array(value.length);
            for (let i = 0; i < value.length; i++) {
                y[i] = lerp(value[i]);
            }
        }
    }
}
const map=(value, a, b, c, d)=>{
    if (typeof value === "number") return lerp(norm(value, a, b), c, d);
    else if (value instanceof Matrix) return new Matrix(value.rows, value.cols, map(value.arr.flat(1), a, b, c, d));
    else if (value instanceof Complex) return new Complex(map(value.a, b, c, d), map(value.b, a, b, c, d));
    else if (value instanceof Array) {
        if (value.every((n) => typeof (n === "number"))) {
            return value.map((n) => map(n, a, b, c, d));
        } else {
            let y = new Array(value.length);
            for (let i = 0; i < value.length; i++) {
                y[i] = map(value[i], a, b, c, d);
            }
        }
    }
}
const clamp=(value, min, max)=>{
    if (typeof value === "number") return min(max(value, min), max);
    else if (value instanceof Matrix) return new Matrix(value.rows, value.cols, clamp(value.arr.flat(1), min, max));
    else if (value instanceof Complex) return new Complex(clamp(value.a, min, max), clamp(value.b, min, max));
    else if (value instanceof Array) {
        if (value.every((n) => typeof (n === "number"))) {
            return value.map((n) => clamp(n, min, max));
        } else {
            let y = new Array(value.length);
            for (let i = 0; i < value.length; i++) {
                y[i] = clamp(value[i], min, max);
            }
        }
    }
}
const arange=(a, b, step , include = false)=>{
    let tab = [];
    if(a<b){
        for (let i = a; include?i<=b:i<b; i += step) tab.push((i * 10) / 10);
    }
    else{
        for(let i = a; include?i>=b:i>b; i -= step) tab.push((i * 10) / 10);
    }
    return tab;
}
const linspace=(a,b,n=abs(b-a)+1,endpoint=true)=>{
    if(Math.floor(n)!==n)return;
    if([a,b].every(n=>typeof n==="number")){
        const [max,min]=[a,b].sort((a,b)=>b-a);
        var Y = [];
        let step ;
        endpoint ? step = (max - min) / (n - 1) : step = (max - min) / n;
        for (var i = 0; i < n; i++) {
            a<b?Y.push(min+step*i):Y.push(max-step*i);
        }
        return Y
    }

    if([a,b].some(n=>n instanceof Complex)){
        const z1=complex(a)
        const z2=complex(b)
        n=n||Math.abs(z1.a-z2.a)+1;
        const X=linspace(z1.a,z2.a,n,endpoint);
        const Y=linspace(z1.b,z2.b,n,endpoint);
        let Z=new Array(n).fill(null);
        Z=Z.map((n,i)=>complex(X[i],Y[i]));
        return Z;
    }
}
const logspace=(a,b,n=b-a+1,base=E,endpoint=true)=>{
    return linspace(a,b,n,endpoint).map(n=>pow(base,n))
}
const geomspace=(a,b,n=abs(b-a)+1,endpoint=true)=>{
    if(Math.floor(n)!==n)return;
    if([a,b].every(n=>typeof n==="number")){
        const [max,min]=[a,b].sort((a,b)=>b-a);
        let base;
        endpoint ? base = sqrtn(max/min,n-1) : base = sqrtn(max/min,n) ;
        const Y = [min];
        for (let i = 1; i < n; i++) {
            Y.push(Y[i-1]*base)
        }
        return a<b?Y:Y.reverse()
    }

    if([a,b].some(n=>n instanceof Complex)){
        const z1=complex(a)
        const z2=complex(b)
        n=n||Math.abs(z1.a-z2.a)+1;
        let base;
        endpoint ? base = sqrtn(z2.div(z1),n-1) : base = sqrtn(z2.div(z1),n) ;
        const Y = [z1];
        for (let i = 1; i < n; i++) {
            Y.push(mul(Y[i-1],base))
        } 
        return Y;
    }
}
export {
    zeros,
    ones,
    nums,
    norm,
    lerp,
    map,
    clamp,
    arange,
    linspace,
    logspace,
    geomspace,

}