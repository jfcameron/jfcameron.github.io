//**********************************************************
// Filename: Time.js
// Description: Manages time events. Stores global counters.
// Author: Joseph Cameron
//**********************************************************
// CHANGELOG
//
// Date: March 7th, 2015
// Description: Initial implementation.
// Author: Joseph Cameron
//
function Time()
{
    //*************
    // Data members
    //*************
    var m_IntervalHandle = null; //handle to setInterval callback
    var m_TimeSinceStart = 0;    //Counts time since program start
    
    //**********
    // Accessors
    //**********
    this.getTime = function()
    {
        return m_TimeSinceStart;
        
    };
    
    this.setDeltaTime = function(aTimeInMiliseconds)
    {
        clearInterval(Update);
        m_IntervalHandle = setInterval(Update,aTimeInMiliseconds);
        
    }
    
    //***************
    // Time interface
    //***************
    this.start = function()
    {
        this.setDeltaTime(16);
        
    };
    
    this.update = function()
    {
        m_TimeSinceStart++;
        
    };
    
}



