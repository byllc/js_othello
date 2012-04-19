function pretty_alert(message){
	
	var alert = document.createElement('div');
	var background_styles = "position: absolute; top: 0px; left: 0px; width: 99%; height: 300%; background-color: #ffffff; opacity: .5;";     
	var message_styles = "position: absolute; top: 200px; margin: auto; width: 30%; padding: 50px; background-color: #ffffff; border: 1px solid;";
	var background = "<div style='" + background_styles + "'>&nbsp;</div>";
	var message = "<div style='" + message_styles + "'>" + message + "</div>";
	
	    alert.innerHTML = background + message;
	    alert.style.visibility = "visible";
	    alert.style.position = "absolute";
	    alert.style.width = "99%;"
	    alert.style.top = "0px;";
	    alert.style.left = "0px";
	 
	    document.body.appendChild(alert);
	  
}