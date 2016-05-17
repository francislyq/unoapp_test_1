$(document).ready(function($) {

	// init items object
	var items = {};

	// get JSON object
	$.ajax({
		url: "data/data.json",
		type: "GET",
		dataType: "json",
		cache: true,
		error: function(){
			alert("Error when get data.json!");
		},
		success: function(data){
			// put data into object
			items.items = data;
			items.stats = getStats(items.items);
			items.termTypes = getTermTypes(items.items);

			$("#stats-total").text("[" + items.stats.totalItems + "]");
			addStatsElements(items);
			addDataElements(items);
			//return items
	  },
	});

	// implement data filter
	$(".nav-elem-wrap").on("click", "li", function(evt) {
		// get filter name
		var filterName = $(this).data("filter");

		// prevent default action of browser
		evt.preventDefault();

		// set active to this filter and set back to default to other filter
		$(this).addClass("active").siblings().removeClass("active");

		// hide all data items
		$(".data-item").hide();

		// show filted out data items
		if(filterName == "all") {
			// show all data-items
			$(".data-item").show();
		} else {
			$("." + filterName).show();
		}
	});
});

// add data elements
function addDataElements(items) {

	// get first data item
	var data = $(".data-item").first();

	// loop all items
	for (var i = 0; i < items.items.length; i++) {
		var newData = data.clone();
		var type = items.items[i].data.main.term_type.toLowerCase();

		// add new attr to data-items
		newData.addClass(type);

		// modify html elements
		newData.find("h4").closest("div").removeClass("accent-html").addClass("accent-" + type).text(items.items[i].data.main.term_type_short);
		newData.find("span").first().html(items.items[i].data.main.term).removeClass("data-term data-term-html").addClass("data-term data-term-" + items.items[i].data.main.term_type.toLowerCase());
		newData.find("span").last().html(items.items[i].data.main.desc.preview);

		// append to parent element
		newData.appendTo("#data_wrap");
	}

	// remove the example element
	data.remove();

}

// add stats elements to index.html
function addStatsElements(items) {

	// loop the term type
	for (var i = 0; i < items.termTypes.length; i++) {
		var newElements = $("#stats_wrap li:first").clone();
		var newStatsAttr = "stats-" + items.termTypes[i];
		var newAccAttr = "accent-" + items.termTypes[i];
		var per = items.stats[items.termTypes[i]] / items.stats.totalItems * 100;

		// stats items
		newElements.find("h4").text(items.termTypes[i] + ":").append("<span id=" + newStatsAttr + "></span>");
		newElements.appendTo("#stats_wrap");
		$("#" + newStatsAttr).text(" [" + items.stats[items.termTypes[i]] + " OF " + items.stats.totalItems + "]");

		// stats bar
		newElements.find(".stats-bar").addClass(newAccAttr);
		//newElements.find("." + newAccAttr).css("width", per + "%");
		newElements.find("." + newAccAttr).append("<progress value='4' max='10'></progress>");

	}

	// add total bar css at the first row
	$("#stats_wrap li:first").find(".stats-bar").addClass("accent-all");

}

// stats of JSON object
function getStats(items) {

	// init object
	var stats = {};

	stats.html = 0;
	stats.css = 0;
	stats.javascript = 0;
	stats.totalItems = items.length;

	// get stats
	for (var i = 0; i < items.length; i++) {
		if(items[i].data.main.term_type_short.toLowerCase() == "html") {
			stats.html++;
		}
		if(items[i].data.main.term_type_short.toLowerCase() == "css") {
			stats.css++;
		}
		if(items[i].data.main.term_type_short.toLowerCase() == "js") {
			stats.javascript++;
		}
	};

	return stats

}

// get term types
function getTermTypes(items) {

	// init array
	var termTypes = [];

	// get array values
	for (var i = 0; i < items.length; i++) {
		if(termTypes.indexOf(items[i].data.main.term_type.toLowerCase()) == -1) {
			termTypes.push(items[i].data.main.term_type.toLowerCase());
		}
	};

	return termTypes

}
