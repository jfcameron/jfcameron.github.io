//
// Modified version of the code that is automatically generated for web projects by unity.
// Purpose: generalizes file loading, uses the page name to load a .unity3d file.
//
var config = 
{
	width: 960, 
	height: 600,
	params: { enableDebugging:"0" }
	
};

var u = new UnityObject2(config);

jQuery(function() 
{
	var $missingScreen = jQuery("#unityPlayer").find(".missing");
	var $brokenScreen = jQuery("#unityPlayer").find(".broken");
	$missingScreen.hide();
	$brokenScreen.hide();
	
	u.observeProgress(function (progress) 
    {
		switch(progress.pluginStatus) 
        {
			case "broken":
				$brokenScreen.find("a").click(function (e) 
                {
					e.stopPropagation();
					e.preventDefault();
					u.installPlugin();
					return false;
                    
				});
				$brokenScreen.show();
			break;
            
			case "missing":
				$missingScreen.find("a").click(function (e) 
                {
					e.stopPropagation();
					e.preventDefault();
					u.installPlugin();
					return false;
				});
				$missingScreen.show();
			break;
            
			case "installed":
				$missingScreen.remove();
			break;
            
			case "first":
			break;
            
		}
        
	});
             
	u.initPlugin(jQuery("#unityPlayer")[0], window.location.pathname.split("/").pop().split(".")[0] + ".unity3d");
             
});
