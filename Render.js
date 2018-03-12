var ROB = {};//Render Object Buffer 
var ROBL = 0;

var VertexShader = 0;
var FragmentShader = 0;
var LinkedShader = 0;



//VertFormat
//[X,Y,Z],[nX,nY,nZ],[U,V]
var VertAttrib = 0;
var NormAttrib = 0;
var UvAttrib = 0;

var gl = 0;

var PM = mat4.create(); // projection matrix
var VM = mat4.create(); // view matrix

var MatrixUniform = 0;
var Smp1Uniform = 0; 
var WorldMatUniform = 0;
var LightMatUniform = 0;
var ViewMatUniform = 0;
var CameraVecToUniform = 0;
var CameraEyeUniform = 0;

function CompileShaders()
{
	VertexShader = gl.createShader(gl.VERTEX_SHADER);
	var ShaderSource = document.getElementById("VertexShaderSource").text;
	gl.shaderSource(VertexShader,ShaderSource);
	gl.compileShader(VertexShader);
	var CompileResult = gl.getShaderParameter(VertexShader,gl.COMPILE_STATUS);
	if(!CompileResult)
	{
		alert(gl.getShaderInfoLog(VertexShader));
		throw new Error (["Cant compile vertex shader"]);
	}
	FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	ShaderSource = document.getElementById("FragmentShaderSource").text;
	gl.shaderSource(FragmentShader,ShaderSource);
	gl.compileShader(FragmentShader);
	CompileResult = gl.getShaderParameter(FragmentShader,gl.COMPILE_STATUS);
	if(!CompileResult)
	{
		alert(gl.getShaderInfoLog(FragmentShader));
		throw new Error (["Cant compile Fragment shader"]);
	}
	LinkedShader = gl.createProgram();
	gl.attachShader(LinkedShader,VertexShader);
	gl.attachShader(LinkedShader,FragmentShader);
	gl.linkProgram(LinkedShader);
	CompileResult = gl.getProgramParameter(LinkedShader,gl.LINK_STATUS);
	if(!CompileResult)
	{
		alert(gl.getProgramInfoLog(LinkedShader));
		throw new Error (["Cant link shader"]);
	}

	VertAttrib = gl.getAttribLocation(LinkedShader, "vPos");
	NormAttrib = gl.getAttribLocation(LinkedShader,"vNor");
	UvAttrib = gl.getAttribLocation(LinkedShader,"Uv");


	MatrixUniform = gl.getUniformLocation(LinkedShader,"MVP");
	Smp1Uniform = gl.getUniformLocation(LinkedShader,"Smp1");
	WorldMatUniform = gl.getUniformLocation(LinkedShader,"ViewWorldMat");
	LightMatUniform = gl.getUniformLocation(LinkedShader,"NormalMat");
	ViewMatUniform = gl.getUniformLocation(LinkedShader,"ViewMat");
	CameraVecToUniform = gl.getUniformLocation(LinkedShader,"CameraVecTo");
	CameraEyeUniform = gl.getUniformLocation(LinkedShader,"CameraEye");
	
}


var CameraVecEye = [0,0,-5];
var CameraVecCenter = [0,0,0];
var CameraVecUp = [0,1,0];

function TranslateCamera(x,y,z)
{
	CameraVecEye[0] += x;
	CameraVecEye[1] += y;
	CameraVecEye[2] += z;
	CameraVecCenter[0]+= x;
	CameraVecCenter[1]+= y;
	CameraVecCenter[2] = -1; 
}

function RotateCamera(theta,phi)
{
	CameraVecCenter[0] = cos(theta)*cos(phi);
	CameraVecCenter[1] = sin(theta);
	CameraVecCenter[2] = cos(theta)*sin(phi);
}

function TranslateObject(Ob,x,y,z)
{
	mat4.translate(Ob.WorldMat,Ob.WorldMat,[x,y,z]);
}

function RotateObjectX(Ob,deg)
{
	mat4.rotateX(Ob.WorldMat,Ob.WorldMat,deg);
}

function RotateObjectY(Ob,deg)
{
	mat4.rotateX(Ob.WorldMat,Ob.WorldMat,deg);
}


function InitWebGlContext()
{
	let CanvasContext = document.getElementById("RenderCanvas");
	gl = CanvasContext.getContext("webgl", {alpha:1,deph:1,antialias: false});
	if(gl == 0)
	{
		let Message = "Cant create WebGl context";
		alert(Message);
		throw new Error ([Message])
	}

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0,0,0.3,1);
	gl.depthFunc(gl.LEQUAL);
	CompileShaders();
	gl.useProgram(LinkedShader);
	mat4.perspective(PM,45,gl.drawingBufferWidth/gl.drawingBufferHeight,0.1,100);
}


function LoadTexture(url)
{
	var Img = new Image();
	var OutTextureId = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,OutTextureId);
	var Pixels = new Uint8Array([0,0,255,255]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,Pixels);

	Img.onload = Img.addEventListener('load', function()
	{
		gl.bindTexture(gl.TEXTURE_2D,OutTextureId);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,Img);
		gl.generateMipmap(gl.TEXTURE_2D);	
	});
	Img.src = url;
	gl.bindTexture(gl.TEXTURE_2D, null);

	return OutTextureId;
}


function AddRenderObject(VertexData,IndexData,TextureUrl)
{
	ROB.length = ROBL+1;
	ROBL = ROB.length; 
	ROB[ROBL] = {};	
	var CO = ROB[ROBL];
	CO.VertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,CO.VertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(VertexData),gl.STATIC_DRAW);

	CO.IndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,CO.IndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(IndexData),gl.STATIC_DRAW);
	
	CO.TextureId = LoadTexture(TextureUrl);
	
	CO.WorldMat = mat4.create();
	CO.LightMat = mat3.create();
	CO.IndexCount = IndexData.length;
	mat4.identity(CO.WorldMat);
	return CO; 
}

var ProjectionViewMat = mat4.create();
var ProjViewObMat = mat4.create();

var ViewWorldMat = mat4.create();

function RenderFrame()
{
	mat4.lookAt(VM,CameraVecEye,CameraVecCenter,CameraVecUp);
	mat4.multiply(ProjectionViewMat,PM,VM);

	gl.uniformMatrix4fv(ViewMatUniform,false,VM);
	gl.uniform3f(CameraVecToUniform,CameraVecCenter[0],CameraVecCenter[1],CameraVecCenter[2]);
	gl.uniform3f(CameraEyeUniform,CameraVecEye[0],CameraVecEye[1],CameraVecEye[2]);

	gl.clear(gl.COLOR_BUFFER_BIT);
	for(var i = 1; i <= ROBL;i++)
	{
		mat4.multiply(ProjViewObMat,ProjectionViewMat,ROB[i].WorldMat);
		mat4.multiply(ViewWorldMat,VM,ROB[i].WorldMat);		
		mat3.normalFromMat4(ROB[i].LightMat,ViewWorldMat);



		gl.uniformMatrix4fv(WorldMatUniform,false,ViewWorldMat);
		gl.uniformMatrix3fv(LightMatUniform,false,ROB[i].LightMat);

		gl.uniformMatrix4fv(MatrixUniform,false,ProjViewObMat);
		gl.bindBuffer(gl.ARRAY_BUFFER,ROB[i].VertexBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ROB[i].IndexBuffer);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D,ROB[i].TextureId);
		gl.uniform1i(Smp1Uniform,0);

		gl.vertexAttribPointer(VertAttrib,3,gl.FLOAT,false,4*8,0);
		gl.enableVertexAttribArray(VertAttrib);

		gl.vertexAttribPointer(NormAttrib,3,gl.FLOAT,false,4*8,4*3);
		gl.enableVertexAttribArray(NormAttrib);
		
		gl.vertexAttribPointer(UvAttrib,2,gl.FLOAT,false,4*8,4*6);
		gl.enableVertexAttribArray(UvAttrib);

		gl.drawElements(gl.TRIANGLES,ROB[i].IndexCount,gl.UNSIGNED_SHORT,0);
	}
}





