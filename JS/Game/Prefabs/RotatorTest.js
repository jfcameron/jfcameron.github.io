if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.rotatorTest = function()
{
    var whatIsJavaScript3 = new GameObject();
        {
            whatIsJavaScript3.setName("RotatorTest");    
            whatIsJavaScript3.getMesh().draw = drawTest;
            whatIsJavaScript3.getMesh().setShader(GRAPHICS.getShader("Opaque"));
            whatIsJavaScript3.getMesh().setMainTexture(GRAPHICS.getTextures()[1]);
            whatIsJavaScript3.getTransform().setPosition([0,-5,-10]);
            whatIsJavaScript3.getTransform().setScale([2,1,2]);
            whatIsJavaScript3.addBehavior(new rotator());
        
        }
        
        return whatIsJavaScript3;
    
}