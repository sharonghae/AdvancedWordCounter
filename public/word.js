var categories = {};
//var categoriesDemo = {};

function reset() {
    categories = {};
    d3.select("#categories")
        .selectAll("div")
        .remove();
    document.getElementById("mainInputText").value = null;
    d3.select(".chart")
        .selectAll("svg")
        .remove();
}

function demoFill() {
    document.getElementById("demo-click").remove();

	var textArea = document.getElementById("mainInputText");
    //var sampleTranscript;

    $.get('/db01.txt', function(data, status){
        textArea.value = data;

        demoCategories = {
            "Homeland Security": ["isis", "terrorists", "terrorism", "iraq", "islam"],
            //"Education": ["schools", "school", "children", "college", "education", "tuition"],
            //"Healthcare": ["medicare", "medicaid", "obamacare", "health insurance", "healthcare", "health"],
            "Science": ["climate change", "global warming", "nasa", "technology"]
        };

        categories = demoCategories;

        for(var key in demoCategories){
            if(!demoCategories.hasOwnProperty(key)) continue;

            var categoryId = key.replace(/\s+/g, '-');
            var html = '<div id="category-' + categoryId + '"><br><strong>' + key + '</strong><a class="button small alert" onclick="removeCategory(this)">-</a>\
				<div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-10 columns">\
				<input type="text" id="search-term-' + categoryId + '" placeholder="Enter search term">\
				</div><div class="small-2 columns">\
				<a class="button" onclick="addSearchTerm(' + '\''+ key + '\',\'' + categoryId + '\'' + ')">+</a>\
				</div></div></div></div></div>';

            $("#categories").append(html);

            for(var k = 0; k < demoCategories[key].length; k++) {
                //categories[category].push(searchTerm);
                d3.select("#category-" + categoryId)
                    .append("div")
                    .style("margin-left", "20px")
                    .html('<em>' + demoCategories[key][k] + '</em>');
            }
        }
        countSearchTerms();
    });

    // var client = new XMLHttpRequest();
    // client.open('GET', '/db01.txt');
    // client.onreadystatechange = function(){
    //     sampleTranscript = client.responseText;
    //
    //     textArea.value = sampleTranscript;
    //
    //     var categoriesDemo = {
    //         "Homeland Security": ["isis", "terrorists", "terrorism", "iraq", "islam"],
    //         "Education": ["schools", "school", "children", "college", "education", "tuition"],
    //         "Healthcare": ["medicare", "medicaid", "obamacare", "health insurance", "healthcare"],
    //         "Science": ["climate change", "global warming", "nasa", "technology", "green energy"]
    //     };
    //
    //     for(var key in categoriesDemo) {
    //         debugger;
    //         if(!categoriesDemo.hasOwnProperty(key)) continue;
    //         //document.getElementById("category").value = key;
    //         console.log(key);
    //         //addCategory();
    //         // var categoryID = key.replace(/\s+/g, '-');
    //         // for (var k = 0; k < categoriesDemo[key].length; k++) {
    //         //     document.getElementById("search-term-" + categoryID).value = categoriesDemo[key][k];
    //         //     addSearchTerm(categoriesDemo[key], categoryID)
    //         // }
    //     }
    // };
}

/*
 * @author: 		SHARON CHOE
 * @createdDate:	2016-11-12
 * @purpose:		A word counter to see through categories and discussion points etc.....
 */

function addCategory() {
	var category = document.getElementById("category").value.trim();

	var categoryID = category.replace(/\s+/g, '-');
	if(category !== "" && !categories[category]) {
		categories[category] = [];
		d3.select("#categories")
			.append("div")
			.style("margin-left", "20px")
			.attr("id", "category-" + categoryID)
			.html('<br><strong>' + category + '</strong><a class="button small alert" onclick="removeCategory(this)">-</a>\
				<div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-10 columns">\
				<input type="text" id="search-term-' + categoryID + '" placeholder="Enter search term">\
				</div><div class="small-2 columns">\
				<a class="button" onclick="addSearchTerm(' + '\''+ category + '\',\'' + categoryID + '\'' + ')">+</a>\
				</div></div></div></div>');
		}
	document.getElementById("category").value = null;
}

function removeCategory(element) {
	var category = element.previousSibling.textContent;
	delete categories[category];
	d3.select(element.parentNode).remove();
}

function addSearchTerm(category, categoryID) {
	var searchTerm = document.getElementById("search-term-" + categoryID).value.toLowerCase().trim();
	if(searchTerm !== "" && categories[category].indexOf(searchTerm) < 0) {
		categories[category].push(searchTerm);
		d3.select("#category-" + categoryID)
			.append("div")
			.style("margin-left", "20px")
			.html('<em>' + searchTerm + '</em><a class="button small alert" onclick="removeSearchTerm(this,' + '\''+ category + '\'' + ')">-</a>');
	}
	document.getElementById("search-term-" + categoryID).value = null;
}

function removeSearchTerm(element, category) {
	var searchTerm = element.parentNode;
	var index = categories[category].indexOf(searchTerm.textContent);
	categories[category].splice(index, 1);
	d3.select(searchTerm).remove();
}

//where the bulk of the logic happens when user clicks 'Search' 
function countSearchTerms() {
	var dictionary = {}, //searchTerm: counter
		transcript = document.getElementById("mainInputText").value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\r?\n|\r/g," ").toLowerCase().split(' '); //remove punctuations, line breaks/returns, lowercase

	//TO DO: remove "/" when not testing
	if(transcript == "") return;

	var collapsedSearchTerms = collapseSearchTerms(); //helper function

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
		for (var j = 0; j < categories[key].length; j++) {
			if(!dictionary[categories[key][j]]) continue;
			else count += dictionary[categories[key][j]];

		}
		var obj = {"category": key, "count": count}
		categoriesCount.push(obj)
	}
	//TO DO: createBarChart(categoriesCount) when not testing
	createBarChart(categoriesCount);
}

//need to collapse searchTerms (& remove duplicates)
function collapseSearchTerms() {
    var ret = [];
	for(var key in categories) {
        ret = _.union(ret, categories[key]) //use lodash method to combine arrays and return array with unique values
	}
	return ret;
}


//TO DO: createBarChart(categoriesCount) when not testing
function createBarChart(categoriesCount) {
	var fakeData = [{
		"category": "Homeland Security",
		"count": 10
	},{
		"category": "Science",
		"count": 27
	},{
		"category": "Education",
		"count": 15
	},{
		"category": "Women's Rights",
		"count": 19
	}];

	d3.select(".chart")
	  .selectAll("svg")
	  .remove();

	var div = d3.select("body").append("div").attr("class", "toolTip");
	
	var axisMargin = 20,
		margin = 40,
		valueMargin = 4,
		width = parseInt(d3.select('.chart').style('width'), 10),
		height = parseInt(d3.select('.chart').style('width'), 10) / 2,
		barHeight = (height - axisMargin - margin * 2) * 0.4 / categoriesCount.length,
		barPadding = (height - axisMargin - margin * 2) * 0.6 / categoriesCount.length,
		bar, svg, max, scale, xAxis, labelWidth = 0;

	max = d3.max(categoriesCount, function(d) {
		return d.count;
	});

	svg = d3.select('.chart')
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	bar = svg.selectAll("g")
		.data(categoriesCount)
		.enter()
		.append("g");

	bar.attr("class", "bar")
		.attr("cx", 0)
		.attr("transform", function(d, i){
			return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
		});

	bar.append("text")
		.attr("class", "label")
		.attr("y", barHeight / 2)
		.attr("dy", ".35em") //vertical align middle
		.text(function(d){
			return d.category;
		}).each(function() {
		labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
	});

	//scale = d3.scale.linear()
	scale = d3.scaleLinear()
		.domain([0, max])
		.range([0, width - margin*2 - labelWidth]);

	//xAxis = d3.svg.axis()
	xAxis = d3.axisBottom()
		.scale(scale)
		.tickSize(-height + 2*margin + axisMargin);
		//.orient("bottom");

	bar.append("rect")
		.attr("transform", "translate("+labelWidth+", 0)")
		.attr("height", barHeight)
		.attr("width", function(d){
			return scale(d.count);
		});

	bar.append("text")
		.attr("class", "value")
		.attr("y", barHeight / 2)
		.attr("dx", -valueMargin + labelWidth) //margin right
		.attr("dy", ".35em") //vertical align middle
		.attr("text-anchor", "end")
		.text(function(d){
			return (d.count);
		})
		.attr("x", function(d){
			var width = this.getBBox().width;
			return Math.max(width + valueMargin, scale(d.count));
		});

	bar
		.on("mousemove", function(d){
			div.style("left", d3.event.pageX+10+"px");
			div.style("top", d3.event.pageY-25+"px");
			div.style("display", "inline-block");
			div.html((d.category)+"<br>"+(d.count));
		});
	bar
		.on("mouseout", function(d){
			div.style("display", "none");
		});

	svg.insert("g",":first-child")
		.attr("class", "axisHorizontal")
		.attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
		.call(xAxis);

	// d3.select(".chart")
	//   	.selectAll("div")
	// 	.data(fakeData) //need to collect data!
	//   	.enter().append("div")
	// 	.attr("x", function(d){
	// 		return x
	// 	});
		// .attr("x", d => d.category)
		// .attr("y", d => d.count)
		// .attr("width", "10px")
		// .attr("height", d => d.count * 10 + "px");
	    //.style("width", function(d) { return d.count * 10 + "px"; })
	    //.text(function(d) { return `${d.category}: ${d.count}`; });
}