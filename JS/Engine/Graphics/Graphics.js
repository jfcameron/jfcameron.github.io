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
// Date: December 18th, 2015
// Description: 1. naive implementation of rendertexture: object that contains a handle to an FBO and handles to textures attached to 
//      the color and depth buffers. Currently fixed to only 1 FBO. Generalizing this in another update.
//  2. reversed uv values on quad and flipped texture data loaded from disk. - After rendering the output of an FBO texture 
//      I finally realized I had been rendering textures upside down.
//  3. wrote enableExtensions and enableExtension functions to handle enabling openGL functionality that is not part of the 
//      current webGL specification
//  4. Began writing the generalized implemenation of rendertexture. Rendertexture hashtable, new xml fileformat .rtex, 
//      writing loadRenderTexture function
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
    var gl                  = null;
    
    //User data
    var clearColor          = [0.535,0.535,0.8,1.0];
    var shaderPrograms      = []; //List of handles to shader programs
    var textures            = []; //List of handles to textures
    var renderTextures      = []; //List of renderTextures
    var VertexArrays        = []; //List of user defined vertex data
    
    //Special VBOs TODO: move to VertexArrays
    var QuadVertexArray             = null; //Reference to the VBO containing Quad vertex data
    var TriVertexArray              = null; //Reference to the VBO containing Triangle vertex data
    var CubeVertexArray             = null;    
    var tessellatedPlaneVertexArray = null;
    
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
    
    this.getQuadVertexArray             = function(){return QuadVertexArray;};
    this.getTriVertexArray              = function(){return TriVertexArray;};
    this.getCubeVertexArray             = function(){return CubeVertexArray;};
    this.getTessellatedPlaneVertexArray = function(){return tessellatedPlaneVertexArray;};
    
    this.getShaderPrograms     = function(){return shaderPrograms;};
    this.getShader             = function(y){return shaderPrograms.find(function(x){return x.getName() == y ? true : false;})}; 
    
    this.getTextures           = function(){return textures;};
    this.getTexture            = function(y){return textures.find(function(x){return x.getName() == y ? true : false;})};
    
    this.getRenderTexture      = function(y){return renderTextures.find(function(x){return x.getName() == y ? true : false;})};
    
    this.getViewMatrix         = function(){return viewMatrix;};
    this.getProjectionMatrix   = function(){return projectionMatrix;};
    
    //*********
    // Methods
    //*********
    //Initializers  
    this.initopenglContext = function ()
    {
        console.log("Init");
        
        if (canvas == undefined)
        {
            canvas                   = document.getElementById("canvas");
            glContext                = canvas.getContext( "webgl" ); //must be webgl
            gl                       = canvas.getContext( "webgl" ); //must be webgl
            glContext.viewportWidth  = canvas.width;
            glContext.viewportHeight = canvas.height;
            
        }
        
        glContext.clearColor(clearColor[0],clearColor[1],clearColor[2],clearColor[3]);
        
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
        
        //Get the draw code
        //shaderProgram.draw = function()
        //{
        //    var drawSource = GRAPHICS.getShaderDrawSource(aShaderProgramName);
        //    
        //    if (drawSource != null)            
        //        eval(drawSource);
        //    
        //};
        //shaderProgram.draw();
        
        var drawSource = this.getShaderDrawSource(aShaderProgramName);
        
        if (drawSource != null)
        {
            shaderProgram.draw = eval("new (function(){return (function(aMesh){ " + drawSource + "});})");
            
        }
        
        //add to the list
        shaderPrograms.push(shaderProgram);
        
    };
    
    this.getShaderDrawSource = function(aShaderProgram)
    {
        // get shader program doc, sanity check
        var shaderProgramDocument = document.getElementById(aShaderProgram);
        
        if (!shaderProgramDocument)
        {
            alert("Shader program " + aShaderProgram + " could not be found.\nAre you missing a reference?");
            return null;
        }
        
        // get shader source from doc, sanity check
        var shaderScript = document.getElementById(aShaderProgram).contentWindow.document.getElementById("Draw");
        
        if (!shaderScript)
        {
            alert("Shader " + aShaderProgram + "'s " + "draw code" + " could not be found.\nIs the object mislabeled?");
            return null;
    
        }
        
        return shaderScript.innerHTML;
        
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
        this.createTessellatedPlaneVertexBuffer();
        
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
           size -(size/2),  size -(size/2),  0.0, 1.0, 1.0, 0.0, 0.0, 1.0, // 1--0
           0.0  -(size/2),  size -(size/2),  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // | /
           0.0  -(size/2),  0.0  -(size/2),  0.0, 0.0, 0.0, 0.0, 0.0, 1.0, // 2
                                            
           size -(size/2),  size -(size/2),  0.0, 1.0, 1.0, 0.0, 0.0, 1.0, //    0
           0.0  -(size/2),  0.0  -(size/2),  0.0, 0.0, 0.0, 0.0, 0.0, 1.0, //  / |
           size -(size/2),  0.0  -(size/2),  0.0, 1.0, 0.0, 0.0, 0.0, 1.0, // 1--2
            
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
    
    this.createTessellatedPlaneVertexBuffer = function () 
    {
        //
        // Generate and store quad vertex data
        //
        tessellatedPlaneVertexArray = glContext.createBuffer();
        glContext.bindBuffer( glContext.ARRAY_BUFFER, tessellatedPlaneVertexArray );
        
        var size = 1.0;
        var vertices = [];
        
        tessellatedPlaneVertexArray.numItems = 0;
        
        for(var y = 0; y < 20; y++)
            for(var x = 0; x < 20; x++)
            {
                vertices = vertices.concat
                ([
                    //               x,   y,                  z,   u,   v,  Nx,  Ny,  Nz,
                    size -(size/2) + x - 10, 0.0, size -(size/2) + y - 10, 1.0, 0.0, 0.0, 0.0, 1.0, // 1--0
                    0.0  -(size/2) + x - 10, 0.0, 0.0  -(size/2) + y - 10, 0.0, 1.0, 0.0, 0.0, 1.0, // 2
                    0.0  -(size/2) + x - 10, 0.0, size -(size/2) + y - 10, 0.0, 0.0, 0.0, 0.0, 1.0, // | /
                    
                    
                    size -(size/2) + x - 10, 0.0, size -(size/2) + y - 10, 1.0, 0.0, 0.0, 0.0, 1.0, //    0
                    size -(size/2) + x - 10, 0.0, 0.0  -(size/2) + y - 10, 1.0, 1.0, 0.0, 0.0, 1.0, // 1--2
                    0.0  -(size/2) + x - 10, 0.0, 0.0  -(size/2) + y - 10, 0.0, 1.0, 0.0, 0.0, 1.0, //  / |
                    
                    
                ]);
                
                tessellatedPlaneVertexArray.numItems += 6;
                
            }
        
        glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW );
        tessellatedPlaneVertexArray.itemSize = 8; //num of atts
        //tessellatedPlaneVertexArray.numItems = 6 *2; //num of vex
        
        //
        // Clean up. Its a state machine. Go back to null.
        //
        glContext.bindBuffer(glContext.ARRAY_BUFFER,null);

    };
    
    handleTextureLoaded = function (image, texture, aTextureName)  //TODO: simplify. User should specify callback via parameter on loadText call
    {        
        //Load texture's meta data.
        jQuery.get("Textures/" + aTextureName.replace(".png","") + ".meta", function(data) 
        {
            //alert(data);
            //alert(aTextureName);
            //bind texture to TEXTURE_2D
            glContext.bindTexture(glContext.TEXTURE_2D, texture);
            glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
            {
                //Assign texture parameters from meta file
                eval(data.getElementsByTagName("TextureParameters")[0].childNodes[0].nodeValue);
                
            }
            
        }, "xml");
        
        console.log(texture.getName() + " texture did load");
    
    };
    
    this.loadTexture = function(aTextureName)
    {
        var texture = glContext.createTexture();
        {
            var image = new Image();
            image.onload = function() { handleTextureLoaded(image, texture, aTextureName); }
            image.src = "Textures/"+aTextureName;
            texture.getName = function(){return aTextureName.toString();};
            
        }
        
        textures.push(texture);
        
    };
    
    this.initTextures = function () 
    {
        this.loadTexture("awesome.png");
        this.loadTexture("brick.png");
        this.loadTexture("grass.png");
        this.loadTexture("name.png");
        this.loadTexture("Water.png");
        this.loadTexture("Cloud.png");
    
    };
    
    this.initShaderPrograms = function ()
    {
        this.initShader("AlphaCutOff");
        this.initShader("Opaque");
        this.initShader("Water");
        this.initShader("Island");
        this.initShader("Sky");
        this.initShader("Skybox");
        this.initShader("Bounce");
        this.initShader("Unlit");
        this.initShader("DepthBufferGrayscaleRender");
        
    };
        
    //Program entry and update
    this.start = function ()
    {
        this.initopenglContext();
        this.enableExtensions();
        this.initShaderPrograms();
        this.initializeVertexData();
        this.initTextures();
        this.initMatricies();
        this.initRenderTextures();
        
        this.renderTextureTest();
        
    };
    
    //
    // Redner tegsture tegst
    //
    var rttFramebuffer; //FBO
    var rttTexture; //textures to render color + depth data to
    var depthTexture;   
    
    this.getRttTexture     = function(){return rttTexture    ;};//this.getRenderTexture("LightTexture").getColorTexture();};
    this.getdepthTexture   = function(){return depthTexture  ;};//this.getRenderTexture("LightTexture").getDepthTexture();};
    this.getRttFramebuffer = function(){return rttFramebuffer;};//this.getRenderTexture("LightTexture").getFBO         ();};
    
    
    
    this.renderTextureTest = function()
    {
        var textureSize = [1024,256];
        
        //create FBO
        rttFramebuffer = glContext.createFramebuffer();
        glContext.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        
        //create color texture
        rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, rttTexture);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S    , glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T    , glContext.CLAMP_TO_EDGE);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, textureSize[0], textureSize[1], 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
        
        //create depth texture
        depthTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, textureSize[0], textureSize[1], 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
        
        //attach color and depthbuffer and depth texture
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
        
        //Cleanup
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        console.log("init rendertex");
        
    };
    
    this.enableExtensions = function()
    {
        this.enableExtension("WEBGL_depth_texture");
        
    };
    
    this.enableExtension = function(aExtensionName)
    {
        if (!(extensionDidEnable = glContext.getExtension(aExtensionName)))
            console.log("extension " + aExtensionName + " is not supported");
        else
            console.log("extension " + aExtensionName + " is supported");
        
    };
    
    this.initRenderTextures = function()
    {
        this.loadRenderTexture("LightTexture");
        
    };
    
    this.loadRenderTexture = function(aRenderTextureName)
    {
        var renderTexture = new RenderTexture();
        {
            jQuery.get("Textures/" + aRenderTextureName + ".rtex", function(data) 
            {   
                //set name
               // renderTexture.setName(aRenderTextureName);
            
                //create FBO
                var fbo = renderTexture.getFBO();
                {
                    fbo = glContext.createFramebuffer();
                    glContext.bindFramebuffer(gl.FRAMEBUFFER, fbo);
                
                }
                
                //create color texture
                var colorTexture = renderTexture.getColorTexture();
                {
                    colorTexture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
                    eval(data.getElementsByTagName("ColorTextureParameters")[0].childNodes[0].nodeValue);
                    
                }
                
                //create depth texture
                var depthTexture = renderTexture.getDepthTexture();
                {
                    depthTexture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
                    eval(data.getElementsByTagName("DepthTextureParameters")[0].childNodes[0].nodeValue);
                    
                }                
                
            }, "xml");
            
        }
        
        renderTextures.push(renderTexture);
        
    };
    
}











