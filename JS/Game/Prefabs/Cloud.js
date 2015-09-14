if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.cloudObject = function(aPosition)
{
    var gameObject = new GameObject();
    {
        gameObject.setName("Cloud");    
        //gameObject123.getMesh().draw = drawTest;
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[5]);
        gameObject.getMesh().setShader(GRAPHICS.getShader("Sky"));
        gameObject.getTransform().setPosition(aPosition);
        gameObject.getTransform().setScale([140,140,0]);
        gameObject.getTransform().setRotation([-90,0,0]);
        
    }
    
    return gameObject;
     
}