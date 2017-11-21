// © 2015 Joseph Cameron - All Rights Reserved
// Project: WebGLEngine
// Created on 2015-03-10.

var shaderPrograms = document.getElementsByClassName("ShaderProgram");
var shaderInitCount = 0;

console.log('beginning bootstrap');

function tryBoot()
{
    console.log('GLSL file ' + shaderPrograms[shaderInitCount].id + ' did load');

    if (++shaderInitCount >= shaderPrograms.length)
    {
        console.log('booting engine');
        console.log('**************');
        
        Start();   
    }    
}
