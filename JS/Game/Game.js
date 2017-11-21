//***************************************************************************
// Filename: Demo/Game.js
// Description: Demo code.
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 7th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//// Date: March 11th, 2015
// Description: Added rigidbody spawner to button 1
// Author: Joseph Cameron
//
function cameraOverlayDrawTest()
{
    //
    // Prep context
    //
    var glContext = GRAPHICS.getContext();
    glContext.viewport  (0,0, glContext.viewportWidth/1, glContext.viewportHeight/1);
    glContext.clear     ( glContext.DEPTH_BUFFER_BIT );  
};

Game.prototype = new GameBase();
Game.prototype.constructor = Game;

function Game()
{     
    //***************
    // Game interface
    //***************
    this.start = function()
    {
        //***********************
        // Create the demo scene!
        //***********************
        //Create scene space
        this.m_RootGameObject.addChild(PREFABS.playerObject([+4,6.5,-14.5]));
        this.m_RootGameObject.addChild(PREFABS.waterObject());
        this.m_RootGameObject.addChild(PREFABS.namePlateObject());
        this.m_RootGameObject.addChild(PREFABS.rotatorTest());
        this.m_RootGameObject.addChild(PREFABS.groundObject());
        this.m_RootGameObject.addChild(PREFABS.textureDisplayObject([-15,-5,-8],[4,4,0],GRAPHICS.getRttTexture(),"Unlit"));
        this.m_RootGameObject.addChild(PREFABS.textureDisplayObject([-11,-5,-8],[4,4,0],GRAPHICS.getdepthTexture(),"DepthBufferGrayscaleRender"));
        this.m_RootGameObject.addChild(PREFABS.lightObject());
        
        //Create sky space //TODO: add sky camera etc.
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10, 10]));
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10,-30]));
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10,-70]));
        this.m_RootGameObject.addChild(PREFABS.cloudObject([0,10,-110]));
        this.m_RootGameObject.addChild(PREFABS.skyboxObject());  
    };
}
