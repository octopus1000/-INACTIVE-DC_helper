 const bg = chrome.extension.getBackgroundPage();
 function init(){
 	$("#username").val(bg.config.j_username);
 	$("#password").val(bg.config.j_password);
 	$("#user").submit(function(){
 		var name = $("#username").val();
 		var psw = $("#password").val();
 		chrome.storage.local.set({"username" : name, "password" :psw});
		return false;//remove auto submit
	});
 }
 document.addEventListener("DOMContentLoaded", init);