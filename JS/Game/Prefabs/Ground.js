if (typeof PREFABS == 'undefined')PREFABS = new Object();

PREFABS.groundObject = function()
{
    var groundObject = new GameObject();
    {
        groundObject.setName("Ground");    
        
        //init mesh
        groundObject.getMesh().setShader(GRAPHICS.getShader("Island"));//"Island" Opaque
        groundObject.getMesh().setMainTexture(GRAPHICS.getTextures()[2]);
        groundObject.getMesh().setVertexBuffer(GRAPHICS.getTessellatedPlaneVertexArray());
        
        //init transform
        groundObject.getTransform().setPosition([0,-10,0]);
        groundObject.getTransform().setScale([100,1,100]);
        groundObject.getTransform().setRotation([0,0,0]);
        
        //init rigidbody
        groundObject.getRigidbody().setMass(0);
        groundObject.getRigidbody().setShape(new CANNON.Box(new CANNON.Vec3(0,0,0)));
        groundObject.getRigidbody().init();
    }
    
    return groundObject;    
}