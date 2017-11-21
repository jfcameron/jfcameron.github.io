if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.textureDisplayObject = function(aPosition,aScale,aTexture,aShaderName)
{
    var gameObject = new GameObject();
    {
        gameObject.setName("textureDisplay");    
        
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().setMainTexture(aTexture);
        gameObject.getMesh().setShader(GRAPHICS.getShader(aShaderName));

        gameObject.getTransform().setPosition(aPosition);
        gameObject.getTransform().setScale(aScale);
    }
    
    return gameObject;     
}
