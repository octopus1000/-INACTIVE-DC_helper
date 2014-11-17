
 var httpReq;
 var parser;
 const url_context = "https://vsoeapp1.vsoe.usc.edu/secure_student/";
 const url_login = "https://shibboleth.usc.edu/idp/Authn/UserPassword";
 const url_frame = "https://myviterbi.usc.edu/";
 const url_course = "https://vsoeapp1.vsoe.usc.edu/secure_student/d_clearance/request_course.php?department_id=6";
 const url_logout = "https://vsoeapp1.vsoe.usc.edu/logout.php";
 const bg = chrome.extension.getBackgroundPage();

 function handlec_req(){
  if(httpReq.readyState==4 && httpReq.status == 200)
  {
    httpReq.onreadystatechange = handlel_req;
    httpReq.open("POST",url_login,true);
    httpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpReq.send("j_username="+ bg.config.j_username + "&j_password=" + bg.config.j_password);
  }
}
function handlel_req(){
  if(httpReq.readyState==4 && httpReq.status == 200)
  {
    var xmlTmp = parser.parseFromString(httpReq.responseText,"text/html");
    window.open(url_context,"_blank");
  }
}
function login(){
  document.getElementById("login").innerText = "Wait...";
  chrome.tabs.onCreated.addListener(function(){
    document.getElementById("login").innerText = "Connected";
    chrome.tabs.onCreated.removeListener();
  });
  if(bg.con_stat.connected){
    window.open(url_context,"_blank");
    return;
  }
  httpReq.onreadystatechange = handlec_req;  
  httpReq.open("GET",url_context, true); 
  httpReq.send(null);
}

function logout(){
/*
//cookie is not accessable by js
  var us = ["myviterbi.usc.edu","shibboleth.usc.edu","vsoeapp1.vsoe.usc.edu"];
  us.forEach(function(u){
    chrome.cookies.getAll({url: u}, function(cookies) {
      cookies.forEach(function(cookie){
        chrome.cookies.remove({url: u, name: cookies[i].name});
      });
    });
  });*/
  window.open(url_logout, "_blank");
}

function isConnected(){
  //check if login
  httpReq.onreadystatechange = function(){
    if(httpReq.readyState == 4 && httpReq.status == 200){
      var xmlTmp = parser.parseFromString(httpReq.responseText,"text/html");
      var loginform = $("#loginform",xmlTmp);
      if(loginform.length == 0){
        //connected
        bg.con_stat.connected = 1;
      }
      else{
        bg.con_stat.connected = 0;
      }
    }
  }   
  httpReq.open("GET", url_context);
  httpReq.send(null);
}

function autoRefresh()
{
  if(bg.con_stat.refresh){//refresh on
    chrome.runtime.sendMessage({autoRefresh:"off"},function(response){
      if(response.status = "success")
        $("#refresh").text("Refresh(off)");
      return;    
    });
  }
  chrome.runtime.sendMessage({autoRefresh:"on"},function(response){
    if(response.status = "success")
      $("#refresh").text("Refresh(on)");
  });
}

function init(){
  httpReq = new XMLHttpRequest();
  parser = new DOMParser();

  isConnected();
  //event listener
  $("#login").click(login);
  $("#refresh").click(autoRefresh).text(bg.con_stat.refresh ? "Refresh(on)" : "Refresh(off)");
  //content
  $("#cs").attr("href",url_course);
  $("#login").text(bg.con_stat.connected? "Connected" : "Connect");
  $("#logout").parent().css("display", bg.con_stat.connected ? "block" : "none");
}
document.addEventListener('DOMContentLoaded', init);