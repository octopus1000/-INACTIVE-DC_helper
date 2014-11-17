var timer;
var httpReq = new XMLHttpRequest();;
const url_context = "https://vsoeapp1.vsoe.usc.edu/secure_student/";

var config = {
	j_username :"",
	j_password : "",
	courses : [],
};

var con_stat = {
	connected : 0,
	refresh : 0,
};

function getConfig(){
	chrome.storage.local.get(["username","password","courses"],function(items){
		config.j_username = items.username;
		config.j_password = items.password;
		config.courses = items.courses ? items.courses : [];//here must use array to init or undefined error occur
	});
}

function autoRefreshControl(message, sender, sendResponse){
	if(con_stat.refresh == 0 && message.autoRefresh == "on"){
		if(timer)
			clearInterval(timer);
		timer = setInterval(function(){
 		   	httpReq.open("GET", url_context, true);//async 
 		   	httpReq.send(null);
 		   },1000 * 60 * 3);
		con_stat.refresh = 1;
		sendResponse({status:"success"});
		return true;
	}
	if(con_stat.refresh == 1 && message.autoRefresh == "off"){
		if(timer)
			clearInterval(timer);
		con_stat.refresh = 0;
		sendResponse({status:"success"});
	}

}

//init
chrome.storage.onChanged.addListener(function(changes, namespace){
	getConfig();
});
chrome.runtime.onMessage.addListener(autoRefreshControl);
getConfig();
