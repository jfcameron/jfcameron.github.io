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

//for(var i = 0; i < shaderPrograms.length; i++)
//{
//    shaderPrograms[i].addEventListener("load", tryBoot, false);
//    console.log('callback succeded');
//    
//}