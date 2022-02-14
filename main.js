// requires API_ENDPOINT_URL_STR in window scope

var
	$item_select = $("[data-role='item_select']");
	$filter_type = $("[data-role='filter_type']"),
	$item_info = $("[data-role='item_info']");

function g_ajaxer(url_str, params, ok_cb, fail_cb){
	$.ajax({
		url: url_str,
		type: "POST",
		data: JSON.stringify(params),
		crossDomain: true,
		contentType: "application/json",
		dataType: "json",
		success: ok_cb,
		error: fail_cb,
		timeout: 3000
	});
}
function clearFilter(){
	$item_select.val("All");
	$item_info.html("");
	$item_info
		.attr("data-showing", "not_showing")
	$filter_type.text("Showing all items");
	//do new search
	postRequest("all");
}
function handleFailure(fe){
	console.log("FAIL");
	if(fe.status === 405){
		$filter_type.text("No API to call");
	}else{
		$filter_type.text("Failed due to CORS");
	}
}
function handleSuccess(data_arr){
	var 
		filter_str = $item_select.val();
	if(data_arr.length === 0){
		$filter_type.text("No " + filter_str.toLowerCase() + " items found");
		$item_info
			.attr("data-showing", "not_showing")
	}
	showItems(data_arr);
}
function postRequest(item_str){
	showSearching();
	var params = {
		item_str: item_str
	};
	g_ajaxer(window.API_ENDPOINT_URL_STR, params, handleSuccess, handleFailure);
}
function showItems(data_arr){
	var 
		html_str = '',
		itemName_str = "",
		description_str = "",
		// date_str = "",
		filter_str = $item_select.val();
	for(var i_int = 0; i_int < data_arr.length; i_int += 1){
		itemName_str = data_arr[i_int].itemname.S || data_arr[i_int].itemname;
		description_str = data_arr[i_int].description.S || data_arr[i_int].description;
		// date_str = new Date(data_arr[i_int].data_found.S).toLocaleDateString();
		html_str += '<article>';
		html_str += 	'<h4>' + itemName_str + ' : ' + description_str + '</h4>';
		// html_str += '<h5>Found:' + date_str + '</h5>';
		html_str += 	'<figure>';
		html_str += 		'<img alt="this is a picture of ' +  itemName_str + ' " src="images/' + itemName_str.toLowerCase() + '.png" width="300" height="300" />'; 
		html_str += 	'</figure>';
		html_str += '</article>';
	}
	$filter_type.text("Showing " + filter_str.toLowerCase() + " items");
	$item_info
		.attr("data-showing", "showing")
		.append(html_str);
	if(data_arr.length === 0){
		$item_info.html('<h6>No items found!</h6>');
	}

}
function showSearching(){
	var 
		filter_str = $item_select.val();
	$filter_type.text("Searching database for " + filter_str.toLowerCase() + " items...");
	$item_info.attr("data-showing", "not_showing").html("");
}
function submitItem(se){
	se.preventDefault();
	//validate todo
	postRequest($item_select.val());
}

// handlers
$(document).on("change", "[data-action='choose_item']", submitItem);


//onm load
postRequest("All");