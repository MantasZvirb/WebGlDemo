function LoadFileText(Url)
{
	var Req = new XMLHttpRequest();
	Req.open('GET', Url, false);
	Req.send(null);

	if(Req.status == 200)
	{
  		return Req.responseText;
	}
	return "";
}

function StrToFloatOrInt(Str,OutData,ParseInit)
{
	var Dat = "";
	var OutDataIndex = 0;
	for(var i = 0; i < Str.length;)
	{
		if(Str[i] != ' ')
		{
			Dat+=Str[i];
			i++;
			if(i > Str.length)
			{
				return;
			}
		}
		else
		{
			if(i == Str.length)
			{
				return;
			}
			OutData[OutDataIndex] = [];
			if(ParseInit == 1)
			{
				OutData[OutDataIndex] = parseInt(Dat);
			}
			else
			{
				OutData[OutDataIndex] = parseFloat(Dat);
			}
			Dat = "";
			OutDataIndex++;
			i++;
		}
	}
}

function LoadX3D(Url,OutVertex,OutIndex)
{
	var XmlData = LoadFileText(Url); 
	var ParserObj = new DOMParser();
	var Parser = ParserObj.parseFromString(XmlData,"text/xml");

	var GeometryBlock = Parser.getElementsByTagName("IndexedTriangleSet")[0];

	var IndexData = GeometryBlock.getAttribute("index");
	var VertexData = GeometryBlock.getElementsByTagName("Coordinate")[0].getAttribute("point");
	var VertexNormalData = GeometryBlock.getElementsByTagName("Normal")[0].getAttribute("vector");
	var UVdata = GeometryBlock.getElementsByTagName("TextureCoordinate")[0].getAttribute("point");


	var VertBuff = [];
	var VertNormalBuff = [];
	var UVBuff = [];
	var IndexBuff = [];
	var Ovx = 0;//OutVertexIndex
	var Uvx = 0;//UVIndex
	StrToFloatOrInt(VertexData,VertBuff,0);
	StrToFloatOrInt(VertexNormalData,VertNormalBuff,0);
	StrToFloatOrInt(UVdata,UVBuff,0);

	StrToFloatOrInt(IndexData,OutIndex,1);
	for(var i = 0; i < VertBuff.length;i+=3)
	{
		OutVertex[Ovx] = [];
		OutVertex[Ovx] = VertBuff[i];
		Ovx++;
		OutVertex[Ovx] = [];
		OutVertex[Ovx] = VertBuff[i+1];
		Ovx++;
		OutVertex[Ovx] = [];
		OutVertex[Ovx] = VertBuff[i+2];
		Ovx++;


		OutVertex[Ovx] = [];
		OutVertex[Ovx] = VertNormalBuff[i];
		Ovx++;
		OutVertex[Ovx] = [];
		OutVertex[Ovx] = VertNormalBuff[i+1];
		Ovx++;
		OutVertex[Ovx] = [];
		OutVertex[Ovx] = VertNormalBuff[i+2];
		Ovx++;

		OutVertex[Ovx] = [];
		OutVertex[Ovx] = UVBuff[Uvx];
		Ovx++;
		Uvx++;

		OutVertex[Ovx] = [];
		OutVertex[Ovx] = UVBuff[Uvx];
		Ovx++;
		Uvx++;			
	}

}

function LoadRaw(Url,OutVertex)
{
	var Dat = LoadFileText(Url)
	var Str = "";
	var OutVertexIndex = 0;
	for(var i = 0; i < Dat.length;)
	{
		if(Dat[i] != ' ')
		{
			if(Dat[i] != '\n')
			{
				Str+= Dat[i];
				i++;
				if(i > Dat.length)
				{
					return;
				}	
			}
			else
			{
				i++;
			}
		}
		else
		{
			OutVertex[OutVertexIndex] = [];
			OutVertex[OutVertexIndex] = parseFloat(Str);
			OutVertexIndex++;
			Str = ""
			i++;
			if(i > Dat.length)
			{
				return;
			}
		}
	}
}


