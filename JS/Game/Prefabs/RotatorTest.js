if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.rotatorTest = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("RotatorTest");    
        
        gameObject.getMesh().setShader(GRAPHICS.getShader("Opaque"));
        gameObject.getMesh().setMainTexture(GRAPHICS.getTextures()[1]);
        
        gameObject.getTransform().setPosition([0,-5,-10]);
        gameObject.getTransform().setScale([2,1,2]);
        
        gameObject.addBehavior(new rotator());    
    }
        
    return gameObject;
}