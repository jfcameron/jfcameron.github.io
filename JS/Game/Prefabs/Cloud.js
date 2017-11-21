if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.cloudObject = function(aPosition)
{
    var gameObject = new GameObject();
    {
        gameObject.setName("Cloud");    
        
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[5]);
        gameObject.getMesh().setShader(GRAPHICS.getShader("Sky"));
        
        gameObject.getTransform().setPosition(aPosition);
        gameObject.getTransform().setScale([140,140,0]);
        gameObject.getTransform().setRotation([-90,0,0]);
    }
    
    return gameObject; 
}