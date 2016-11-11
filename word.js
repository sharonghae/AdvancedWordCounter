var categories = {},
	currentCategory,
	searchTerms = [],
	transcript, 
	dictionary = {}; //searchTerm: counter


// (function(){
// 	var nonGlobal = "hi";

// 	function eins(str){
// 		console.log(str);
// 	}

// 	eins(nonGlobal);
// })();

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
	var radio = document.getElementsByName('categories');
	for (var i = 0; i < radio.length; i++) {
		if(radio[i].checked) {
			currentCategory = radio[i].value;
			break;
		}
	}
	document.getElementById("search-terms").innerHTML = categories[currentCategory].join(', ');
}

function addWord() {
	var word = document.getElementById("word").value.toLowerCase();
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
        row.setAttribute("id", category)
    var cell1 = row.insertCell(0);
    	cell1.innerHTML = category;
}

function updateTable(words) {
	var cell2;
	var row = document.getElementById(currentCategory);
	if (row.cells.length < 2) {
		cell2 = row.insertCell(1);
	} else {
		cell2 = row.cells[1]
	}
	cell2.innerHTML = words;
}

//where the bulk of the logic happens when user clicks 'Search' 
function countWords() {
	transcript = document.getElementById("inputString").value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\r?\n|\r/g," ").toLowerCase().split(' '), //remove punctuations and lowercase
	collapseSearchTerms() //helper function

	var max = Math.max.apply(null, searchTerms),
		min = Math.min.apply(null, searchTerms);

	for (var i = 0; i < transcript.length; i++) { //loop thru transcript
		for (var j = 0; j < searchTerms.length; j++) { //loop thru searchTerms
			if(transcript.slice(i, i + searchTerms[j].split(' ').length).join(' ') === searchTerms[j]) {
				if(dictionary[searchTerms[j]]) dictionary[searchTerms[j]]++;
				else dictionary[searchTerms[j]] = 1;
			}
		}
	}
	console.log(transcript)
	console.log(searchTerms)
	console.log(dictionary)
	dictionary = {};
}

//need to collapse searchTerms (& remove duplicates)
function collapseSearchTerms() {
	for(var key in categories) {
		searchTerms = _.union(searchTerms, categories[key]) //use lodash method to combine arrays and return array with unique values 
	}
}

