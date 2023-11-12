# Demo 
# Get Started 
## Extract All Methodes
```js
 Ziko.ExtractAll()
 // if you want to extract only UI methodes you can use Ziko.UI.Extractll()
```
```js
text("hello world")
  .style({ color: "red" })
  .onPtrMove(throttle(() => console.log("hi")));

```

## Math
 ### Functions
 ```js
 const a = cos(0);
 const b = sin(0,PI/2,PI)
 const c = ln([1,2,3])
 const d= cos({
             a:PI,
             b:PI/2,
             c:{
              d:PI/4,
              e:[PI,PI/2,PI/3,PI/4,PI/6]
         }})
```    
 ### Matrix
 ### Complex
 ### Random
 ### Signal 
 ### Utils 
## UI
 ### Text
 ### List 
 ### Media 
 ### Input
 ### Table 
 ### Flex 
 ### Grid 
## Time
 ### loop
 ### animation
## Graphics
 ### Canvas
 ### Svg
 ### 3D 
## Events
 ### Pointer
  #### Simple Paint sketch
  ```js
const Scene=Canvas().view(-10,-10,10,10).size(500,500).adjust()
c.onPtrDown(e=>{
    c.ctx.beginPath()
    c.ctx.moveTo(
        map(e.dx,0,c.element.offsetWidth,c.Xmin,c.Xmax),
        map(e.dy,0,c.element.offseHeight,c.Ymin,c.Ymax)
        )
})
c.onPtrMove(e=>{
    if(e.isDown){
        const x=map(e.mx,0,c.element.offsetWidth,c.axisMatrix[0][0],c.axisMatrix[1][0])
        const y=map(e.my,0,c.element.offsetHeight,c.axisMatrix[1][1],c.axisMatrix[0][1])
        c.append(canvasCircle(x,y,1).color({fill:"#5555AA"}).fill())
   }
c.onPtrUp(()=>{})
  ```
 ### Key
  ```
   const inp=input().onKeyDown(throttle(e=>console.log(e.kd),1000));
  ```
 ### Drag
## Reactivite
 ### Watch Size
 ### Watch Intersction
## Data
 ### Parser 
## Router 
 ### Single Page Application
 ```js
const main= Section()
const p1=Section()
const p2=Section()
S=Ziko.SPA(
   main,{
     "/page1":p1,
     "/svg":P2
 })
 ```
## Multithreading
 ```js
Ziko.Multi(() => {
  s = 0;
  for (i = 0; i < 10000000000; i++) s += i;
  return s;
}, console.log);
 ```
 
 

# License 
This projet is licensed under the terms of MIT License .<br>
<img src="https://img.shields.io/github/license/zakarialaoui10/zikojs?color=rgb%2820%2C21%2C169%29">

 






