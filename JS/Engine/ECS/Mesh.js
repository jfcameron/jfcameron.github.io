//************************************************************************
// Filename: Mesh.js
// Description: A mesh defines the draw parameters, shader program,
// textures and vertex data to be used when rendering an object
// Author: Joseph Cameron
//************************************************************************
// CHANGELOG
//
// Date: March 6th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
Mesh.prototype = new Component();  //Is a component
Mesh.prototype.constructor = Mesh;

function Mesh(ownerGameObject)
{
    //*************
    // Data members
    //*************
    var m_GameObject   = ownerGameObject;
    var m_VertexBuffer = GRAPHICS.getCubeVertexArray(); //Handle to vertex buffer
    var m_Shader       = GRAPHICS.getShaderPrograms().find(function(x){return x.getName() == "AlphaCutOff"})  ; //Handle to shader program
    var m_MainTexture  = GRAPHICS.getTextures()[0];
    var m_Textures     = []  ; //Handle to textures
    
    //**********
    // Accessors
    //**********
    this.getGameObject   = function(){return m_GameObject;  };
    
    this.getShader       = function()              {return m_Shader;          };
    this.setShader       = function(aShaderProgram){m_Shader = aShaderProgram;};
    
    this.getMainTexture  = function()        {return m_MainTexture;    };
    this.setMainTexture  = function(aTexture){m_MainTexture = aTexture;}; 
    
    this.getVertexBuffer = function()             {return m_VertexBuffer         ;};
    this.setVertexBuffer = function(aVertexBuffer){m_VertexBuffer = aVertexBuffer;};
    
    //*******************
    // Material interface
    //*******************    
    this.draw = function()
    {        
        if (m_Shader.draw != undefined)
        {
            m_Shader.draw(this);
        
        }
        
    };
    
    this.update = function()
    {    
        //if (this.draw != undefined)
        //    this.draw();
    
    };
    
}





