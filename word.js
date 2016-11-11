var categories = {};

function addCategory() {
	var category = document.getElementById("category").value.toLowerCase();
	if(!categories[category]) {
		categories[category] = [];
		document.getElementById("categories").innerHTML += '<input type="radio" name="categories" onclick="selectCategory()" value=' + category + '>' + category + '<br>';
		addCategoryRow(category);
		}
	document.getElementById("category").value = null;
}

//when user selects category we need to keep track so we can add words to correct category
function selectCategory() {
	var currentCategory,
		radio = document.getElementsByName('categories');
	for (var i = 0; i < radio.length; i++) {
		if(radio[i].checked) {
			currentCategory = radio[i].value;
			break;
		}
	}
	document.getElementById("search-terms").innerHTML = categories[currentCategory].join(', ');
	return currentCategory;
}

function addWord() {
	var currentCategory = selectCategory();
	var word = document.getElementById("word").value.toLowerCase().trim();
	if(currentCategory && categories[currentCategory].indexOf(word) < 0) {
		categories[currentCategory].push(word);
		document.getElementById("search-terms").innerHTML = categories[currentCategory].join(', ');
		updateTable(categories[currentCategory].join(', '));

	}
	document.getElementById("word").value = null;
}

//for table view
function addCategoryRow(category) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(-1);
        row.setAttribute("id", category);
    var cell1 = row.insertCell(0);
    	cell1.innerHTML = category;
}

function updateTable(words) {
	var currentCategory = selectCategory();
	var cell2,
		row = document.getElementById(currentCategory);
	if (row.cells.length < 2) {
		cell2 = row.insertCell(1);
	} else {
		cell2 = row.cells[1]
	}
	cell2.innerHTML = words;
}

//where the bulk of the logic happens when user clicks 'Search' 
function countWords() {
	var searchTerms = [],
		dictionary = {}, //searchTerm: counter
		transcript = document.getElementById("inputString").value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\r?\n|\r/g," ").toLowerCase().split(' '); //emove punctuations, line breaks/returns, lowercase
	
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
	console.log(collapsedSearchTerms)
	console.log(dictionary)
	dictionary = {};
}

//need to collapse searchTerms (& remove duplicates)
function collapseSearchTerms(searchTerms) {
	for(var key in categories) {
		searchTerms = _.union(searchTerms, categories[key]) //use lodash method to combine arrays and return array with unique values 
	}
	return searchTerms;
}

