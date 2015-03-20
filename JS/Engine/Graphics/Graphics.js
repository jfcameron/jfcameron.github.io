//***************************************************************************
// Filename: Graphics.js
// Description: OpenGL graphics engine
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 1st, 2015
// Description: Initial implementation. Colored triangle rendering.
// Author: Joseph Cameron
//
// Date: March 2nd, 2015
// Description: Texturing added, triangle replaced with quad. Update function added.
// Author: Joseph Cameron
//
// Date: March 3rd, 2015
// Description: getShaderSource method modified to support shader code stored in child html documents (solution for file includes).
// Author: Joseph Cameron
//
// Date: March 5th, 2015
// Description: created Graphics prototype. Beginning to refactor code into something extendible.
//  Added a model matrix (needs to be refactored), added a perspective matrix.
// Author: Joseph Cameron
//
// Date: March 6th, 2015
// Description: removed model matrix. Model matricies now belong to gameobject mesh components.
// Author: Joseph Cameron
//
// Date: March 15th, 2015
// Description: removed update and clear. Clear and update behaviors have been refactored into camera. 
// Author: Joseph Cameron
//
function Graphics()
{
    //*************
    // Data members
    //*************
    //Context data
    var canvas              = null; //Reference to the html element
    var glContext           = null; //Reference to the gl context
    
    //User data
    var clearColor          = [0.535,0.535,0.8,1.0];
    var shaderPrograms      = []; //List of handles to shader programs
    var textures            = []; //List of handles to textures
    var VertexArrays        = []; //List of user defined vertex data
    
    //Special VBOs TODO: consider moving to vertexarrays
    var QuadVertexArray     = null; //Reference to the VBO containing Quad vertex data
    var TriVertexArray      = null; //Reference to the VBO containing Triangle vertex data
    var CubeVertexArray     = null;    
    
	//Lighting data
	var m_AmbientLight = [1,1,1,1];
	
    //Camera data, should be refactored to allow for variable # of cameras
    var projectionMatrix    = null;
    var viewMatrix          = null;
    
    //TODO: use this
    var m_ActiveCamera   = null;//test
    this.getActiveCamera = function() {return m_ActiveCamera;};
    this.setActiveCamera = function(aCamera) {m_ActiveCamera = aCamera;};
    
    //**********
    // Accessors
    //**********
    this.getContext            = function(){return glContext      ;};
    
    this.getQuadVertexArray    = function(){return QuadVertexArray;};
    this.getTriVertexArray     = function(){return TriVertexArray;};
    this.getCubeVertexArray    = function(){return CubeVertexArray;};
    
    this.getShaderPrograms     = function(){return shaderPrograms;};
    this.getShader             = function(y){return shaderPrograms.find(function(x){return x.getName() == y ? true : false;})}; 
    
    this.getTextures           = function(){return textures;};
    this.getTexture            = function(y){return textures.find(function(x){return x.getName() == y ? true : false;})};
    
    this.getViewMatrix         = function(){return viewMatrix;};
    this.getProjectionMatrix   = function(){return projectionMatrix;};
    
    //*********
    // Methods
    //*********
    //Initializers  
    this.initopenglContext = function ()
    {
        console.log("Init");
    
        canvas                   = document.getElementById("canvas");
        glContext                = canvas.getContext( "webgl" ); //must be webgl
        glContext.viewportWidth  = canvas.width;
        glContext.viewportHeight = canvas.height;
        
        //glContext.viewport(0,0,canvas.width,canvas.height);
        
    
    };
    
    this.initMatricies = function ()
    {
        //Main camera view matrix
        viewMatrix = mat4.create();
        mat4.identity(viewMatrix);
        mat4.translate(viewMatrix,[0,0,0]);
        mat4.inverse(viewMatrix,viewMatrix);
        
        //Main camera projection matrix
        projectionMatrix = mat4.create();
        mat4.identity(projectionMatrix);
       
        //mat4.ortho(0,10,0,10,-1,1,projectionMatrix);
        mat4.perspective(45, glContext.viewportWidth / glContext.viewportHeight , 0.1, 100.0, projectionMatrix);
        
    };
    
    this.initShader = function (aShaderProgramName) 
    {
        //Create two empty shaders for Vertex/Frag program
        var vertexShader = glContext.createShader( glContext.VERTEX_SHADER   );//glContext.createShader( glContext.VERTEX_SHADER   );
        var fragShader   = glContext.createShader( glContext.FRAGMENT_SHADER ); 
        
        //Compile the shaders
        glContext.shaderSource( vertexShader, this.getShaderSource(aShaderProgramName, "Vertex"));//alphaCutoff_Vert
        glContext.compileShader( vertexShader );
        glContext.shaderSource( fragShader, this.getShaderSource(aShaderProgramName, "Fragment"));//alphaCutoff_Frag
        glContext.compileShader( fragShader); 
        
        //Check for compile errors
        if( !glContext.getShaderParameter( vertexShader, glContext.COMPILE_STATUS) ) 
            alert( glContext.getShaderInfoLog(vertexShader) );
        if( !glContext.getShaderParameter( fragShader, glContext.COMPILE_STATUS) )
            alert( glContext.getShaderInfoLog(fragShader) );
        
        //Create the shader program & compile shaders into graphics programs     
        var shaderProgram = glContext.createProgram();
        shaderProgram.getName = function(){return aShaderProgramName;}; //Passes in name, for later retrieval
        
        glContext.attachShader(shaderProgram, fragShader);
        glContext.attachShader(shaderProgram, vertexShader);
        glContext.linkProgram(shaderProgram);
        
        //add to the list
        shaderPrograms.push(shaderProgram);
        
    };
    
    this.getShaderSource = function (aShaderProgram, id)
    {
        //get lib object
        var shaderLibraryScript = document.getElementById("GLSLLibrary").contentWindow.document.getElementById("Global");
        
        // get shader program doc, sanity check
        var shaderProgramDocument = document.getElementById(aShaderProgram);
        
        if (!shaderProgramDocument)
        {
            alert("Shader program " + aShaderProgram + " could not be found.\nAre you missing a reference?");
            return null;
        }
        
        // get shader source from doc, sanity check
        var shaderScript = document.getElementById(aShaderProgram).contentWindow.document.getElementById(id);
        
        if (!shaderScript)
        {
            alert("Shader " + aShaderProgram + "'s " + id + " shader could not be found.\nIs the object mislabeled?");
            return null;
    
        }
    
        //Convert object text to js string    
        var theSource = "";
        
        //Copy library code into shader source
        var currentChild = shaderLibraryScript.firstChild;
        while(currentChild) 
        {
            if (currentChild.nodeType == 3)
            theSource += currentChild.textContent;
            
            currentChild = currentChild.nextSibling;
            
        }
        
        //Copy shader code into shader source
        var currentChild = shaderScript.firstChild;
        while(currentChild) 
        {
            if (currentChild.nodeType == 3)
            theSource += currentChild.textContent;
            
            currentChild = currentChild.nextSibling;
            
        }
    
        return theSource;
        
    };
    
    this.initializeVertexData = function()
    {
        this.createQuadVertexBuffer();
        this.createTriangleVertexBuffer();
        this.createCubeVertexBuffer();    
        
    };
    
    this.createQuadVertexBuffer = function () 
    {
        //
        // Generate and store quad vertex data
        //
        QuadVertexArray = glContext.createBuffer();
        glContext.bindBuffer( glContext.ARRAY_BUFFER, QuadVertexArray );
        
        var size = 1.0;
        
        var vertices = 
        [
            //          x,               y,    z,   u,   v,  Nx,  Ny,  Nz,
           size -(size/2),  size -(size/2),  0.0, 1.0, 0.0, 0.0, 0.0, 1.0, // 1--0
           0.0  -(size/2),  size -(size/2),  0.0, 0.0, 0.0, 0.0, 0.0, 1.0, // | /
           0.0  -(size/2),  0.0  -(size/2),  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // 2
                                            
           size -(size/2),  size -(size/2),  0.0, 1.0, 0.0, 0.0, 0.0, 1.0, //    0
           0.0  -(size/2),  0.0  -(size/2),  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, //  / |
           size -(size/2),  0.0  -(size/2),  0.0, 1.0, 1.0, 0.0, 0.0, 1.0, // 1--2
            
        ];
        
        glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW );
        QuadVertexArray.itemSize = 8;
        QuadVertexArray.numItems = 6;
        
        //
        // Clean up. Its a state machine. Go back to null.
        //
        glContext.bindBuffer( glContext.ARRAY_BUFFER,null);

    };
    
    this.createTriangleVertexBuffer = function () 
    {
        //
        // Generate and store quad vertex data
        //
        TriVertexArray = glContext.createBuffer();
        glContext.bindBuffer( glContext.ARRAY_BUFFER, TriVertexArray );
        
        var size = 1.0;
        
        var vertices = 
        [
            //          x,               y,    z,   u,   v,  Nx,  Ny,  Nz,
           size -(size/2),  size -(size/2),  0.0, 1.0, 0.0, 0.0, 0.0, 0.0, // 1--0
           0.0  -(size/2),  size -(size/2),  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, // | /
           0.0  -(size/2),  0.0  -(size/2),  0.0, 0.0, 1.0, 0.0, 0.0, 0.0, // 2
            
        ];
        
        glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW );
        TriVertexArray.itemSize = 8;
        TriVertexArray.numItems = 3;
        
        //
        // Clean up. Its a state machine. Go back to null.
        //
        glContext.bindBuffer( glContext.ARRAY_BUFFER,null);

    };
    
    this.createCubeVertexBuffer = function () 
    {
        //
        // Generate and store quad vertex data
        //
        CubeVertexArray = glContext.createBuffer();
        glContext.bindBuffer( glContext.ARRAY_BUFFER, CubeVertexArray );
        
        var size = 1.0;
        
        var vertices = 
        [
           //North
           //           x,               y,        z,   u,   v,  Nx,  Ny,   Nz,
           size -(size/2),  size -(size/2),  -size/2, 0.0, 0.0, 0.0, 0.0, -1.0, // 2--0
           0.0  -(size/2),  0.0  -(size/2),  -size/2, 1.0, 1.0, 0.0, 0.0, -1.0, // | /
           0.0  -(size/2),  size -(size/2),  -size/2, 1.0, 0.0, 0.0, 0.0, -1.0, // 1
                            
           size -(size/2),  size -(size/2),  -size/2, 0.0, 0.0, 0.0, 0.0, -1.0, //    0
           size -(size/2),  0.0  -(size/2),  -size/2, 0.0, 1.0, 0.0, 0.0, -1.0, //  / |
           0.0  -(size/2),  0.0  -(size/2),  -size/2, 1.0, 1.0, 0.0, 0.0, -1.0, // 2--1
           
           //South
           //           x,               y,        z,   u,   v,   Nx,  Ny,   Nz,
           size -(size/2),  size -(size/2),   size/2, 1.0, 0.0,  0.0, 0.0, +1.0, // 1--0
           0.0  -(size/2),  size -(size/2),   size/2, 0.0, 0.0,  0.0, 0.0, +1.0, // | /
           0.0  -(size/2),  0.0  -(size/2),   size/2, 0.0, 1.0,  0.0, 0.0, +1.0, // 2
                                            
           size -(size/2),  size -(size/2),   size/2, 1.0, 0.0,  0.0, 0.0, +1.0, //    0
           0.0  -(size/2),  0.0  -(size/2),   size/2, 0.0, 1.0,  0.0, 0.0, +1.0, //  / |
           size -(size/2),  0.0  -(size/2),   size/2, 1.0, 1.0,  0.0, 0.0, +1.0, // 1--2
           
           //West
           //           x,              y,         z,   u,   v,   Nx,  Ny,  Nz,
           0.0  -(size/2), size -(size/2),    size/2, 1.0, 0.0, -1.0, 0.0, 0.0, // 2--0
           0.0  -(size/2), size -(size/2),   -size/2, 0.0, 0.0, -1.0, 0.0, 0.0, // | /
           0.0  -(size/2), 0.0  -(size/2),   -size/2, 0.0, 1.0, -1.0, 0.0, 0.0, // 1
                      
           0.0 -(size/2),  size -(size/2),    size/2, 1.0, 0.0, -1.0, 0.0, 0.0, //    0
           0.0 -(size/2),  0.0  -(size/2),   -size/2, 0.0, 1.0, -1.0, 0.0, 0.0, //  / |
           0.0 -(size/2),  0.0  -(size/2),    size/2, 1.0, 1.0, -1.0, 0.0, 0.0, // 2--1
           
           //East
           //           x,               y,        z,   u,   v,   Nx,   Ny,  Nz,
           size -(size/2),  size -(size/2),   size/2, 0.0, 0.0, +1.0,  0.0, 0.0, // 2--0
           size -(size/2),  0.0  -(size/2),  -size/2, 1.0, 1.0, +1.0,  0.0, 0.0, // | /
           size -(size/2),  size -(size/2),  -size/2, 1.0, 0.0, +1.0,  0.0, 0.0, // 1
                                                                       
           size -(size/2),  size -(size/2),   size/2, 0.0, 0.0, +1.0,  0.0, 0.0, //    0
           size -(size/2),  0.0  -(size/2),   size/2, 0.0, 1.0, +1.0,  0.0, 0.0, //  / |
           size -(size/2),  0.0  -(size/2),  -size/2, 1.0, 1.0, +1.0,  0.0, 0.0, // 2--1
           
           //Down
           //           x,              y,         z,   u,   v,   Nx,  Ny,  Nz,
           size -(size/2),  0.0 -(size/2),   -size/2, 1.0, 0.0,  0.0, -1.0, 0.0, // 2--0
           0.0  -(size/2),  0.0 -(size/2),    size/2, 0.0, 1.0,  0.0, -1.0, 0.0, // | /
           0.0  -(size/2),  0.0 -(size/2),   -size/2, 0.0, 0.0,  0.0, -1.0, 0.0, // 1
                                            
           size -(size/2),  0.0  -(size/2),  -size/2, 1.0, 0.0,  0.0, -1.0, 0.0, //    0
           size -(size/2),  0.0  -(size/2),   size/2, 1.0, 1.0,  0.0, -1.0, 0.0, //  / |
           0.0  -(size/2),  0.0  -(size/2),   size/2, 0.0, 1.0,  0.0, -1.0, 0.0, // 2--1
           
           //Up
           //           x,               y,       z,   u,   v,    Nx,   Ny,  Nz,
           size -(size/2),  1.0  -(size/2), -size/2, 1.0, 0.0,   0.0, +1.0, 0.0, // 1--0
           0.0  -(size/2),  1.0  -(size/2), -size/2, 0.0, 0.0,   0.0, +1.0, 0.0, // | /
           0.0  -(size/2),  1.0  -(size/2),  size/2, 0.0, 1.0,   0.0, +1.0, 0.0, // 2
                                                                       
           size -(size/2),  1.0  -(size/2), -size/2, 1.0, 0.0,   0.0, +1.0, 0.0, //    0
           0.0  -(size/2),  1.0  -(size/2),  size/2, 0.0, 1.0,   0.0, +1.0, 0.0, //  / |
           size -(size/2),  1.0  -(size/2),  size/2, 1.0, 1.0,   0.0, +1.0, 0.0, // 1--2
            
        ];
        
        glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW );
        CubeVertexArray.itemSize =  8;
        CubeVertexArray.numItems = 36;
        
        //
        // Clean up. Its a state machine. Go back to null.
        //
        glContext.bindBuffer( glContext.ARRAY_BUFFER,null);

    };
    
    handleTextureLoaded = function (image, texture)  //TODO: simplify. User should specify callback via parameter on loadText call
    {
    
        glContext.bindTexture(glContext.TEXTURE_2D, texture);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA,glContext.UNSIGNED_BYTE, image);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.GL_NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.GL_NEAREST);
        glContext.generateMipmap(glContext.TEXTURE_2D);
        glContext.bindTexture(glContext.TEXTURE_2D, null);
        
        console.log(texture.getName());
    
    };
    
    this.loadTexture = function(aTexturePath)
    {
        var texture = glContext.createTexture();
        {
            var image = new Image();
            image.onload = function() { handleTextureLoaded(image, texture); }
            image.src = "textures/"+aTexturePath;
            texture.getName = function(){return aTexturePath.toString();};
            
        }
        
        textures.push(texture);
        
    };
    
    this.initTextures = function () 
    {
        this.loadTexture("awesome.png");
        this.loadTexture("brick.png");
        this.loadTexture("grass.png");
        this.loadTexture("name.png");
    
    };
    
    this.initShaderPrograms = function ()
    {
        this.initShader("AlphaCutOff");
        this.initShader("Opaque");
    
    };
        
    //Program entry and update
    this.start = function ()
    {
        this.initopenglContext();
        this.initShaderPrograms();
        this.initializeVertexData();
        this.initTextures();
        this.initMatricies();
        
        glContext.clearColor(clearColor[0],clearColor[1],clearColor[2],clearColor[3]);
        
    };
    
}