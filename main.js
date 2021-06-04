
var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};
var cellPadding = 10;

chartWidth = svgWidth - (4*padding.r) ;
chartHeight = svgHeight - (2*padding.t);

var dateDomain = [new Date(2009, 0), new Date(2017, 2)];

minYear = 2010
maxYear = 2016
minProfit = 0
maxProfit = 800000000

genresList = ['Comedy', 'Drama', 'Romance', 'Biography', 'Sport', 'Action', 'Adventure', 'History', 'War', 'Horror', 
                'Mystery', 'Sci-Fi', 'Thriller', 'Crime', 'Documetary', 'Music', 'Fantasy', 'Western', 'Musical', 'Family', 'Animation'];
clicked = genresList;
var colorsMap = {
    'Comedy' : 'rgb(31, 119, 180)',
    'Drama' : 'rgb(174, 199, 232)',
    'Romance' : 'rgb(255, 127, 14)',
    'Biography' : 'rgb(255, 187, 120)',
    'Sport' : 'rgb(44, 160, 44)',
    'Action' : 'rgb(152,223,138)',
    'Adventure' : 'rgb(214, 39, 40)',
    'History' : 'rgb(255, 152, 150)',
    'War': 'rgb(148, 103, 189)',
    'Horror': 'rgb(197, 176, 213)',
    'Mystery': 'rgb(140, 86, 75)',
    'Sci-Fi': 'rgb(196, 156, 148)',
    'Thriller': 'rgb(227, 119, 194)',
    'Crime': 'rgb(247, 182, 210)',
    'Documentary': 'rgb(127, 127, 127)',
    'Music': 'rgb(199, 199, 199)',
    'Fantasy': 'rgb(188, 189, 34)',
    'Western': 'rgb(219, 219, 141)',
    'Musical': 'rgb(199, 199, 199)',
    'Family': 'rgb(23, 190, 207)',
    'Animation': 'rgb(158, 218, 229)'
};

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        // console.log('genres: ', d['genres'])
        // return "<h5 id='title-tip'>"+d['title']+"<h5/> <h5>Box office: "+d['profit']+" USD</h5> <h5>Genre: "
        // +d['genres']+"</h5>" ;
        return "<h5>"+d['title']+"<h5>" +
        `<table>
            <thead>
                <tr>
                    <td>Box Office</td>
                    <td>Director</td>
                    <td>Genre</td>
                    <td>IMDB Score</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>`+ d['profit'] +`</td>
                    <td>`+ d['director'] +`</td>
                    <td>`+ d['genres'] +`</td>
                    <td>`+ d['imdb'] +`</td>
                </tr>
            </tbody>
        </table>
        `
    });
svg.call(toolTip);

function onCategoryChanged() {
    var select = d3.select('#form').node();
    var children = select.children; 
    // console.log(children);
    var gCount = 0;
    clicked = [];

    for (var i = 0; i < children.length; i++) {
        if (children[i].tagName == 'INPUT' && children[i].type == 'checkbox') {
            gCount++;
            clicked.push(children[i].checked);
        }
    }
    updateChart();
}


// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');


d3.csv('movies.csv', dataPreprocessor).then(function(dataset) {
    var yScale = d3.scaleLinear()
    .domain([minProfit, maxProfit])
    .range([0, chartHeight]);

    var xScale = d3.scaleTime()
    .domain(dateDomain)
    .range([0, chartWidth]);

    movies = dataset
    // ****************
    var clip = chartG.append("defs").append("chartG:clipPath")
      .attr("id", "clip")
      .append("chartG:rect")
      .attr("width", chartWidth )
      .attr("height", chartHeight )
      .attr("x", 0)
      .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = chartG.append('g')
        .attr("clip-path", "url(#clip)")
    // ****************

    var yAx = d3.axisTop(yScale);
    var xAx = d3.axisBottom(xScale);

    xAxis = chartG.append('g')
    .attr('class', 'bottom-axis')
    .attr('transform', 'translate(0,' + chartHeight+ ')')
    .call(xAx);

    yAxis = chartG.append('g')
    .attr('class', 'top-axis')
    .attr('transform', 'rotate(270) translate(-' + chartHeight + ', 0)')
    .call(yAx);

    var xGrid = d3.axisTop(xScale)
        .tickSize(-chartHeight, 0, 0)
        .tickFormat('');

    var yGrid = d3.axisLeft(yScale)
        .tickSize(-chartWidth, 0, 0)
        .tickFormat('') ;

    chartG.append('g')
        .call(xGrid)
        .attr('class', 'x grid');

    chartG.append('g')
        .call(yGrid)
        .attr('class', 'y grid');
    
    // info = chartG.append('g')

    // info.append('rect')
    //     .attr('class', 'info-box')
    //     .attr('width', 225)
    //     .attr('height', 40)
    //     .attr('x', chartWidth-225)
    //     .attr('y', 0)
    //     .attr('stroke', 'black')
    //     .attr('fill', 'white');
    
    // info.append('text')
    // .text('Hover on dots for information')
    // .attr('text-anchor', 'right')
    // .attr('x', chartWidth-205)
    // .attr('y', 15);

    // info.append('text')
    // .text('Zoom/pan for a closer look')
    // .attr('text-anchor', 'right')
    // .attr('x', chartWidth-195)
    // .attr('y', 30);

    var key = chartG.append('g')
        .selectAll('swatch')
        .data(genresList)
        .enter()
        .append('g')
        .attr('class', 'swatch')
        // .attr('transform', 'translate('+chartWidth+padding.l + ',200)');
    
    key.append('rect')
        .attr('fill', function(d,i) {
            return colorsMap[d];
        })
        .attr('x', chartWidth + 10)
        .attr('y', function(d,i) {
            return 100 + 20*i;
        })
        .attr('width', 10)
        .attr('height', 10)
    
    key.append('text')
        .attr('class', 'key-text')
        .text(function(d,i) {
            return d;
        })
        .attr('x', chartWidth + 25)
        .attr('y', function (d, i) {
            return 110 + 20*i;
        })

    
    var allGenres = []
    for (var i = 0; i < 21; i++) {
        allGenres.push('true');
    }

    // console.log('finished set up')
    //****************
    var zoom = d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [chartWidth, chartHeight]])
      .on("zoom", updateChart);
    
    // updateChart(allGenres);
    // console.log('created zoom var')

//   This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom

    chartG.append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + padding.l + ',' + padding.t + ')')
        .call(zoom);
    //****************
    
    updateChart(); 
});


function updateChart() {

    var yScale = d3.scaleLinear()
    .domain([minProfit, maxProfit])
    .range([0, chartHeight]);

    var xScale = d3.scaleTime()
    .domain(dateDomain)
    .range([0, chartWidth]);

    //***************
    if (d3.event != null) {
        // var newX = d3.event.transform.rescaleX(xScale);
        var newY = d3.event.transform.rescaleY(yScale);
    
        // // update axes with these new boundaries
        // xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisTop(newY))

        // xScale = newX;
        yScale = newY;
    }
    //****************


    // console.log('updating');
    //get all genres that are selected

    var chartGenres = []
    // console.log('clicked: ', clicked)
    for (var i = 0; i <= clicked.length; i++) {
        if (clicked[i]) {
            chartGenres.push(genresList[i]);
        }
    }
    // console.log('chartGenres: '+ chartGenres);

    //filter data to only include selected genres
    filteredMovies = []
    movies.forEach(function(d,i) {
        var g = d['genres'].split('|');
        for (var i = 0; i < g.length; i++) {
            if (chartGenres.includes(g[i])) {
                // filteredMovies.push([d['director'], g[i], d['profit'], 
                //     d['title'], d['year']]);

                // console.log('unedited for movie ' + d['title'] +': ' + d['genres']);
                d['genres'] = g[i];
                filteredMovies.push(d);
            }
        }
    });

    // console.log('filteredMovies: ', filteredMovies)

    var circ = chartG
        .selectAll('.dot')
        .data(filteredMovies, function(d) {
            return d;
        });

    var circEnter = circ.enter()
        .append('g')
        .attr('class', 'dot');

    circEnter.merge(circ)
    
    circEnter.append('circle')
        .attr('cx', function (d) { 
            // return xScale(new Date(d.year)); 
            return xScale(new Date(d.year));
        } )
        .attr('cy', function (d) {
             return chartHeight - yScale(d.profit); 
            } )
        .attr('r', 3)
        .attr('fill', function(d, i) {
            genres = d['genres'].split('|');
            return colorsMap[genres[0]];
        })

    // var infotext = circEnter.append('text')
    //     .text(function(d){
    //         // console.log(d['title']);
    //         return d['title'] + ', released in ' + d['year'] 
    //             + ', had a profit of ' + d['profit'] + ' USD';
    //     })
    //     .attr('x', function(d) {
    //         // return chartWidth-190;
    //         return chartWidth/2 -150
    //     })
    //     .attr('y', function (d) {
    //         return -10;
    //        } )
    //     .attr('font-family', 'Roboto')
    //     .attr('font-weight', 200);

    circEnter.on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);

    // console.log('appended');
    circ.exit().remove();
}


function dataPreprocessor(row) {
    return {
        'director': row['director_name'],
        'title': row['movie_title'],
        'genres': row['genres'],
        'year': d3.timeParse(row['title_year']),
        'profit': row['gross'],
        'imdb': row['imdb_score']
    };
}