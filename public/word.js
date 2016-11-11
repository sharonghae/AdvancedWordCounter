var categories = {};

function addCategory() {
	var category = document.getElementById("category").value.toLowerCase();
	if(category !== "" && !categories[category]) {
		categories[category] = [];
		d3.select("#categories")
			.append("div")
			.style("margin-left", "20px")
			.attr("id", category)
			.html('<br><strong>' + category + '</strong><input type="submit" value="-" onclick="removeCategory(this)"><br><input type="text" id="search-term-' + category + '"><input type="submit" value="+" onclick="addSearchTerm(' + '\''+ category + '\'' + ')">');
		}
	document.getElementById("category").value = null;
}

function removeCategory(element) {
	var category = element.parentNode;
	delete categories[category.textContent];
	d3.select(category).remove();
}

function addSearchTerm(category) {
	var searchTerm = document.getElementById("search-term-" + category).value.toLowerCase().trim();
	if(searchTerm !== "" && categories[category].indexOf(searchTerm) < 0) {
		categories[category].push(searchTerm);
		d3.select("#" + category)
			.append("div")
			.style("margin-left", "20px")
			.html('<em>' + searchTerm + '</em><input type="submit" value="-" onclick="removeSearchTerm(this,' + '\''+ category + '\'' + ')">');
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
	console.log(transcript)
	console.log(dictionary)
}

//need to collapse searchTerms (& remove duplicates)
function collapseSearchTerms(searchTerms) {
	for(var key in categories) {
		searchTerms = _.union(searchTerms, categories[key]) //use lodash method to combine arrays and return array with unique values 
	}
	return searchTerms;
}

 