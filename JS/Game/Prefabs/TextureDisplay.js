if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.textureDisplayObject = function(aPosition,aScale,aTexture,aShaderName)
{
    var gameObject = new GameObject();
    {
        gameObject.setName("textureDisplay");    
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().setMainTexture(aTexture);
        //gameObject.getMesh().setMainTexture(GRAPHICS.getTexture("awesome.png"));
        gameObject.getMesh().setShader(GRAPHICS.getShader(aShaderName));
        gameObject.getTransform().setPosition(aPosition);
        gameObject.getTransform().setScale(aScale);
        
    }
    
    return gameObject;
     
}