

function KeyDownEventHandler(event)
{
	if(event.keyCode == '38')//UpArrow
	{
		TranslateCamera(0,1,0);
		return;
	}
	if(event.keyCode == '40')//DownArrow
	{
		TranslateCamera(0,-1,0);
		return;
	}
	if(event.keyCode == '37')//LeftArrow
	{
		TranslateCamera(-1,0,0);
		return;
	}
	if(event.keyCode == '39')//RightArrow
	{
		TranslateCamera(1,0,0);
		return;
	}
	if(event.keyCode == '107')//add
	{
		TranslateCamera(0,0,1);
		return;
	}
	if(event.keyCode == '109')//subtract
	{	
		TranslateCamera(0,0,-1);
		return;
	}


	if(event.keyCode == '100')//NUM4
	{
		RotateObjectY(Ob3,1);
		return;
	} 
	if(event.keyCode == '102')//NUM6
	{
		return;
	}
	if(event.keyCode == '98')//NUM2
	{
		return;
	}
	if(event.keyCode == '104')//NUM8
	{
		return;
	}
}

function RenderCanvasCallback(Timestamp)
{
	RenderFrame();
	window.requestAnimationFrame(RenderCanvasCallback);
}

//EntryPointHere------------------------
var Vd = [];
var Id = [];
LoadX3D("./obj/T2.x3d",Vd,Id);

var V3 = [];
var I3 = [];
LoadX3D("./obj/P1.x3d",V3,I3);

var V4 = [];
var I4 = [];
LoadX3D("./obj/T1.x3d",V4,I4);

var V5 = [];
var I5 = [];
LoadX3D("./obj/CubeHd.x3d",V5,I5);

InitWebGlContext();
var Ob1 = AddRenderObject(Vd,Id,"./obj/TX1.png");
var Ob3 = AddRenderObject(V3,I3,"./obj/PT1.png");
var Ob4 = AddRenderObject(V4,I4,"./obj/T1.png");
var Ob5 = AddRenderObject(V5,I5,"./obj/CT1.png");
TranslateObject(Ob3,5,0,-5);
TranslateObject(Ob4,-10,0,0);
TranslateObject(Ob5,0,0,-5);
//RotateObjectX(Ob3,20);
//RotateObjectY(Ob3,60);
//RotateObjectX(Ob1,90);
TranslateCamera(0,0,-5);

document.addEventListener('keydown',KeyDownEventHandler);
//setInterval(RenderTimer,33);//33 ms
window.requestAnimationFrame(RenderCanvasCallback);