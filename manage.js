 const bg = chrome.extension.getBackgroundPage();
 const url_request = "https://vsoeapp1.vsoe.usc.edu/secure_student/d_clearance/request_course.php?department_id=6";
 const url_res = "https://vsoeapp1.vsoe.usc.edu/secure_student/d_clearance/manage_requests.php";
 var httpReq;
 var timer_req;//auto request
 var timer_time;//auto request one time
 var parser;

 function init(){
 	$("#add_course").submit(function(){
 		var course = $("#course").val();
 		var course_section = $("#course_section").val();
 		bg.config.courses.push(course + "+" + course_section);
 		reloadCourse();
 		return false;
 	});
 	$("#btn_save").click(function(){
 		chrome.storage.local.set({"courses" : bg.config.courses});
 	});
 	$("#btn_auto_req").click(function(){
 		if(timer_req){
 			clearInterval(timer_req);
 		}
 		timer_req = setInterval(requestCheckedCourse, 3000) ;//3 seconds
 	});
 	$("#btn_stop_req").click(function(){
 		if(timer_req){
 			clearInterval(timer_req);
 		}
 	});

 	$("#btn_test").click(function(){
 		var fire_time = prompt("Request send time:","7:00:00");
 		if(fire_time == null) return;
 		var splits = fire_time.split(":");
 		var date = new Date();
 		var seconds = (parseInt(splits[0]) - date.getHours()) * 60 * 60 + (parseInt(splits[1]) - date.getMinutes()) * 60 +  (parseInt(splits[2]) - date.getSeconds());
 		if(seconds > 0)
 		{
 			if(timer_time)
 				clearTimeout(timer_time);
 			timer_time = setTimeout(function(){
 				requestCheckedCourse();
 			},1000 * seconds);
 			alert("Request will be sent after " + seconds + " seconds. \nClose browser to cancel.")
 		}
 	});
 	httpReq = new XMLHttpRequest();
 	parser = new DOMParser();
 	reloadCourse();
 	reloadResult();
 	
 }


 function requestCourse(course_id){
 	var splits = bg.config.courses[course_id].split("+");
 	httpReq.onreadystatechange = parseResponse;
 	httpReq.open("POST",url_request,true);
    httpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpReq.send("department_id=6&term=20151&course="+ splits[0] + "&course_section=" + splits[1] + "&Submit=Submit Request");
 }

 function requestCheckedCourse(){
 	checked_courses = $("input[name='auto_request']:checked", "#course_table");
 	checked_courses.each(function(){
 		requestCourse($(this).parent().parent().index() - 1);
 	});
 }

 function parseResponse(){
 	//parseResponse to get result
 	//set checkbox value = 0 to avoid re-request
    if(httpReq.readyState == 4 && httpReq.status == 200){
    	$("#page_box").html(httpReq.responseText);
      }
 }
 function reloadCourse(){
 	var course_table = $("#course_table");
 	course_table.empty();
 	course_table.append("<tr><th>Delete</th><th>Course + Section</th><th>Request</th><th>Check</th></tr>");
 	if(bg.config.courses){
 		for (var i = 0; i < bg.config.courses.length; i++) {
 			var del, txt, req, sel;
 			del = "<td><button class = 'del'>delete</button></td>";
 			txt = "<td>" + bg.config.courses[i] + "</td>";
 			req = "<td><button class = 'req'>request</button></td>";
 			sel = "<td><input type = 'checkbox' name = 'auto_request'/></td>"
 			course_table.append("<tr>" + del + txt + req + sel + "</tr>");
 		}; 		
 	}
 	$(".del").click(function(){
 		var id = $(this).parent().parent().index();
 		bg.config.courses.splice(id - 1, 1);
 		reloadCourse();
 	});
 	$(".req").click(function(){
 		var id = $(this).parent().parent().index();
 		requestCourse(id);
 	})
 }

 function reloadResult(){
 	httpReq.open("GET", url_res,true);
 	httpReq.onreadystatechange = function(){
 		 if(httpReq.readyState == 4 && httpReq.status == 200){
 		 	var xmlTmp = parser.parseFromString(httpReq.responseText,"text/html");
 		 	var res = $("#body",xmlTmp);
 		 	if(res.length){
 		 		res.appendTo("#view_result");
 		 	}
 		 }
 	};
 	httpReq.send(null);

 }
 document.addEventListener('DOMContentLoaded', init);