//***************************************************************************
// Filename: FunctionExtensions.js
// Description: Contains all function extensions to base javascript types.
// Author: Joseph Cameron
//***************************************************************************
// CHANGELOG
//
// Date: March 6th, 2015
// Description: Initial implementation.
// Added Array.Prototype.find, a lambda based find function.
// Author: Joseph Cameron
//

//**************************
// Array function extensions
//**************************
//---------------------------------------------------------------------------------------
// Function name: Array.prototype.find
// Arguments: a function pointer "aSearchFunction"
// Return: a member of the array.
// Description: takes a function which defines the terms of the search,
// returns a reference to a member of the array when/if the criteria has been
// met. If no object is found, the function returns undefined.
// Direct copy of C#'s list<T>.find() function.
// https://msdn.microsoft.com/en-us/library/x0b5b5bc%28v=vs.110%29.aspx
//
// Note: aSearchFunction must have the following signature:
// bool functionName(index)
//
// I unfortunately cannot enforce this in JS, but although any other kind of
// signature will not throw an error, find will not behave as intended.
//
// Usage: exampleArray.find(function(x){return x.getName() == "Lebowski" ? true : false;}
//---------------------------------------------------------------------------------------
Array.prototype.find = function(aSearchFunction)
{    
    for(var i = 0; i < this.length; i++)        
        if (aSearchFunction(this[i]) == true)
            return this[i];
     
}

function Include(aSource)
{    
    var gameSource = null;
    {   
        //Load js
        gameSource = document.createElement("script");
        gameSource.setAttribute("type","text/javascript");
        gameSource.setAttribute("src", aSource);
        
    }
    
    document.body.appendChild(gameSource);
    
}

function EndIncludes()
{
    Start();

}
