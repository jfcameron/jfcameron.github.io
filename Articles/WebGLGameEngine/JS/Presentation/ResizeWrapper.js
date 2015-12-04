function resizeWrapper()
{
    document.getElementById("wrapper").style.height = "0px";
    {
        //alert('asdf');
    
        var height = 
        
        Math.max
        (
            $(document).height(),
            $(window).height(),
            /* For opera: */
            document.documentElement.clientHeight
        
        );
    
    }
    
    alert(height);
    
    document.getElementById("wrapper").style.height =  ""+height + "px";// "500px";
    
}

document.body.addEventListener("load", resizeWrapper(), false);            
window.addEventListener("resize", resizeWrapper);