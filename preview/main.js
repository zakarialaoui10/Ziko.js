Ziko.UI.ExtractAll()
const info=p(
    text("Last triggered event :"),
    text("").color("red")
    ).style({fontSize:"20px"})
hr();
var el=FlexMain(
    btn("Ziko.js").size("70%","11%"),
    btn("ziko.js").size("50%","15%"),
    btn("ziko.js").size("80%","11%")
    )
    .vertical(0,"space-around")
    .size("80vw","50vh")
    .style({
        margin:"20px auto",
        background:"#111188",
        cursor:"pointer",
    })
   .onClick(()=>info[1].setValue("Click"))
   .onPointerenter(()=>info[1].setValue("Enter"))
   .onPointerleave(()=>info[1].setValue("Leave"))
sl=slider({min:20,max:100,value:50})
   .onChange(e=>el[0].style({width:`${e.target.value}%`}));
hr();