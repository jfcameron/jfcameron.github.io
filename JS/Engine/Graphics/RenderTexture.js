//
// RenderTexture is unity speak for an object that abstracts away from the mess that is FBO with attached textures
// It is best practice to attach textures to an FBO at init and then swap FBOs as needed rather than simply create 1
// nondefault FBO and reattach textures as needed, since this results in the need for verification etc it works but is slower.
//

function RenderTexture()
{
    //*************
    // Data members
    //*************
    var m_Name = 'test';
    var m_FBO;
    var m_ColorTexture;
    var m_DepthTexture;
    
    //**********
    // Accessors
    //**********
    this.getName         = function() {return m_Name        ;};
    this.getFBO          = function() {return m_FBO         ;};
    this.getColorTexture = function() {return m_ColorTexture;};
    this.getDepthTexture = function() {return m_DepthTexture;};

    this.setName         = function(aName        ) {m_Name         = aName        ;};
    this.setFBO          = function(aFBO         ) {m_FBO          = aFBO         ;};
    this.setColorTexture = function(aColorTexture) {m_ColorTexture = aColorTexture;};
    this.setDepthTexture = function(aDepthTexture) {m_DepthTexture = aDepthTexture;};
    
    //
    // TODO: think about abstracting away initialization
    //
    
}