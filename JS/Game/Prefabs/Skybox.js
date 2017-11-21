if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.skyboxObject = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("Skybox");    
        
        gameObject.getMesh().setMainTexture(GRAPHICS.getTexture("brick.png"));
        gameObject.getMesh().setShader(GRAPHICS.getShader("Skybox"));
        
        gameObject.getTransform().setPosition([0,0,0]);
        gameObject.getTransform().setScale([100,100,100]);
    }
    
    return gameObject;    
}