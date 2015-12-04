if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.waterObject = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("Water");    
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getTessellatedPlaneVertexArray());
        gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[4]);
        gameObject.getMesh().setShader(GRAPHICS.getShader("Water"));
        gameObject.getTransform().setPosition([0,-9,0]);
        gameObject.getTransform().setScale([5,1,5]);
        
    }
    
    return gameObject;
     
}