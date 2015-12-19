if (typeof PREFABS == 'undefined')PREFABS = new Object();

//pos in form [0,10,-30]
PREFABS.namePlateObject = function()
{
    var gameObject = new GameObject();
    {
        gameObject.setName("Name");    
        gameObject.getMesh().setVertexBuffer(GRAPHICS.getQuadVertexArray());
        gameObject.getMesh().setMainTexture(GRAPHICS.getTexture("name.png"));
        
        gameObject.getMesh().setShader(GRAPHICS.getShader("Bounce"));
        gameObject.getTransform().setPosition([0,2.8,-30]);
        gameObject.getTransform().setScale([80,80,0]);
        
    }
    
    return gameObject;
     
}