var timer;
timer = setInterval(addTerm, 1000);

function addTerm(){
	var term = $("#term");
	if(term.length != 0 && term.children().length == 1){
 		if(timer){
 			clearInterval(timer);
 		}
		term.append("<option value='20151'>Spring 2015</option>");
	}
}