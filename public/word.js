var categories = {};

function addCategory() {
	var category = document.getElementById("category").value.toLowerCase();
	if(category !== "" && !categories[category]) {
		categories[category] = [];
		d3.select("#categories")
			.append("div")
			.style("margin-left", "20px")
			.attr("id", "category-" + category)
			.html('<br><strong>' + category + '</strong><a class="button small alert" onclick="removeCategory(this)">-</a>\
				<div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-10 columns">\
				<input type="text" id="search-term-' + category + '">\
				</div><div class="small-2 columns">\
				<a class="button" onclick="addSearchTerm(' + '\''+ category + '\'' + ')">+</a>\
				</div></div></div></div>');
		}
	document.getElementById("category").value = null;
}

function removeCategory(element) {
	var category = element.previousSibling.textContent;
	delete categories[category];
	d3.select(element.parentNode).remove();
}

function addSearchTerm(category) {
	var searchTerm = document.getElementById("search-term-" + category).value.toLowerCase().trim();
	if(searchTerm !== "" && categories[category].indexOf(searchTerm) < 0) {
		categories[category].push(searchTerm);
		d3.select("#category-" + category)
			.append("div")
			.style("margin-left", "20px")
			.html('<em>' + searchTerm + '</em><a class="button small alert" onclick="removeSearchTerm(this,' + '\''+ category + '\'' + ')">-</a>');
	}
	document.getElementById("search-term-" + category).value = null;
}

function removeSearchTerm(element, category) {
	var searchTerm = element.parentNode;
	var index = categories[category].indexOf(searchTerm.textContent);
	categories[category].splice(index, 1);
	d3.select(searchTerm).remove();
}

//where the bulk of the logic happens when user clicks 'Search' 
function countSearchTerms() {
	var searchTerms = [],
		dictionary = {}, //searchTerm: counter
		transcript = document.getElementById("inputString").value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\r?\n|\r/g," ").toLowerCase().split(' '); //remove punctuations, line breaks/returns, lowercase
	
	if(transcript == "") return;

	var collapsedSearchTerms = collapseSearchTerms(searchTerms); //helper function

	//Goal: decrease words to search thru by filtering out words not in range

	//collapse search terms to find max and min length of words
	var sortedSearchTerms = collapsedSearchTerms.join(' ').split(' ').filter((i, idx, arr) => arr.indexOf(i) === idx);
		sortedsearchTerms = sortedSearchTerms.sort((a, b) => a.length - b.length);
	var lastIndex = sortedsearchTerms.length - 1;
	var max = sortedsearchTerms[lastIndex].length,
		min = sortedsearchTerms[0].length;

	//remove transcript words not within range of min and max 
	transcript = transcript.filter(i => i.length >= min && i.length <= max);

	for (var i = 0; i < transcript.length; i++) { //loop thru transcript
		for (var j = 0; j < collapsedSearchTerms.length; j++) { //loop thru searchTerms
			if(transcript.slice(i, i + collapsedSearchTerms[j].split(' ').length).join(' ') === collapsedSearchTerms[j]) {
				if(dictionary[collapsedSearchTerms[j]]) dictionary[collapsedSearchTerms[j]]++;
				else dictionary[collapsedSearchTerms[j]] = 1;
			}
		}
	}

	var categoriesCount = [];
	for(var key in categories) {
		var count = 0;
		for (var i = 0; i < categories[key].length; i++) {
			if(!dictionary[categories[key][i]]) continue;
			else count += dictionary[categories[key][i]];

		}
		var obj = {"category": key, "count": count}
		categoriesCount.push(obj)
	}
	createBarChart(categoriesCount);
}

//need to collapse searchTerms (& remove duplicates)
function collapseSearchTerms(searchTerms) {
	for(var key in categories) {
		searchTerms = _.union(searchTerms, categories[key]) //use lodash method to combine arrays and return array with unique values 
	}
	return searchTerms;
}


function createBarChart(categoriesCount) {
	d3.select(".chart")
	  .selectAll("div")
	  .remove();
	  
	d3.select(".chart")
	  .selectAll("div")
	    .data(categoriesCount) //need to collect data!
	  .enter().append("div")
	    .style("width", function(d) { return d.count * 10 + "px"; })
	    .text(function(d) { return `${d.category}: ${d.count}`; });
}
