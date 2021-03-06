<html>
<body>
//
// Name: GameOfLife
// Description: Compute shader implementation of game of life.
// 
//
#pragma kernel Main
#pragma kernel UserInput
#pragma kernel CopyColorBuffer

//*********
// Uniforms
//*********
RWTexture2D<float> _Input;
RWTexture2D<float> _Output;
float2 _TexelCoordinate;
int _InputDown;

//          x, y, z
[numthreads(3, 3, 1)]
//                                                  pos in dispatch          pos in no.threads
void Main (uint3 dtid : SV_DispatchThreadID, uint3 Gid : SV_GroupID,  uint3 GTid : SV_GroupThreadID)
{
	//Calc offset
    float2 offset = float2(Gid.x * 1, Gid.y * 1) + float2(GTid.x-2,GTid.y-2).xy + float2(0,0);
    
    //Collect neighbour data
    float neighbourValue = 0;
    
    neighbourValue += int(_Input[offset + float2(-1,1)]);
    neighbourValue += int(_Input[offset + float2( 0,1)]);
    neighbourValue += int(_Input[offset + float2( 1,1)]);
    
    neighbourValue += int(_Input[offset + float2(-1,0)]);
    neighbourValue += int(_Input[offset + float2( 1,0)]);
    
    neighbourValue += int(_Input[offset + float2(-1,-1)]);
    neighbourValue += int(_Input[offset + float2( 0,-1)]);
    neighbourValue += int(_Input[offset + float2( 1,-1)]);    
    
    //Evaluate
    //Im alive
    if ((_Input[offset + float2( 0,0)]) == 1.0)
    {
    	if (neighbourValue < 2 || neighbourValue > 3) //CORRECT
    	{
    		_Output[offset + float2( 0,0)] = 0.0;
    	
    	}
    	else
    		_Output[offset + float2( 0,0)] = 1;
    	
    }
    //Im dead
    else if (ceil(_Input[offset + float2( 0,0)]) < 1.0)
    {
    	if (neighbourValue == 3)
    		_Output[offset + float2( 0,0)] = 1.0;
    	
    }
                    
}

//           x,  y, z
[numthreads(30, 30, 1)]
//                                                  pos in dispatch          pos in no.threads
void UserInput (uint3 dtid : SV_DispatchThreadID, uint3 Gid : SV_GroupID,  uint3 GTid : SV_GroupThreadID)
{
    float2 offset = float2(Gid.x * 30, Gid.y * 30) + float2(GTid.x-29,GTid.y-29).xy;

    //Handle input
    if (_InputDown)
	    _Output[offset + _TexelCoordinate] = 1.0;
    
}

//           x,  y, z
[numthreads(30, 30, 1)]
//                                                  pos in dispatch          pos in no.threads
void CopyColorBuffer (uint3 dtid : SV_DispatchThreadID, uint3 Gid : SV_GroupID,  uint3 GTid : SV_GroupThreadID)
{
	float2 offset = float2(Gid.x * 30, Gid.y * 30) + float2(GTid.x-29,GTid.y-29).xy;

	//Copy color
	_Input[dtid.xy] = _Output[dtid.xy];

}
</body>
</html>