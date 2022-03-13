function hideAll() {
    $("#total-accidents-title").hide();
    $("#total-accidents-display").hide();
    $("#accidents-per-100k-title").hide();
    $("#accidents-weather-title").hide();
    $("#accidents-weather-display").hide();
}

function radioListener() {
    hideAll();
    var radio = document.querySelector('input[name="radioButton"]:checked');
    var choice = radio['value'];
    geochartSelector(choice);
}

function geochartSelector(choice) {
    var chart;
    if(choice == "totalAcc") {
        chart = '/accidents/byState';
        $("#total-accidents-title").show();
        $("#total-accidents-display").show();
        retrieveTotal();
        renderGeoChart(chart);
    }
    if(choice == "accToState") {
        chart = '/accidents/byStatePopulation';
        $("#accidents-per-100k-title").show();
        renderGeoChartAccToPop(chart);
    }
    if(choice == "accWeather") {
        var conditions = [];
        $("#accidents-weather-title").show();
        $("#accidents-weather-display").show();

        var checkboxes = document.querySelectorAll('input[name="weatherButton"]:checked');
        for (var checkbox of checkboxes) {
            conditions.push(checkbox['value']);
        }
        retrieveTotalWeather(conditions);
    }  
}

function retrieveTotal() {
    $.ajax({
        url: '/accidents/total',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        $('.total-accidents-display').text(result.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    })
}

function retrieveTotalWeather(conditions) {
    $.ajax({
        url: '/accidents/totalWeather',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        determineWeatherAccidents(conditions, result.total);      
    })
}

function determineWeatherAccidents(conditions, accidents) {
    var accidentSum = 0;
    var actualConditions = [];
    for (var condition in accidents) {
        if(conditions.includes(condition)) {
            accidentSum += accidents[condition];
            actualConditions.push(condition);
        }
    }
    renderGeoChartWeather(actualConditions);  
    $('.accidents-weather-display').text(accidentSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function renderGeoChart(chart) {
    $.ajax({
        url: chart,
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        google.charts.setOnLoadCallback(drawRegionsMap(result));         
    })
    .fail(function(jqXHR) {
        console.log(jqXHR);
    })
}

function renderGeoChartAccToPop(chart) {
    $.ajax({
        url: chart,
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        google.charts.setOnLoadCallback(drawRegionsMapAccToPop(result.accidents, result.population));         
    })
    .fail(function(jqXHR) {
        console.log(jqXHR);
    })
}

function renderGeoChartWeather(conditions) {
    $.ajax({
        url: '/accidents/weatherAccidents',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        selectFromConditions(conditions, result.accidents);
    })
    .fail(function(jqXHR) {
        console.log(jqXHR);
    })
}

function selectFromConditions(conditions, accidents) {
    var accidentMap = [];
    for (const [key, value] of Object.entries(accidents)) {  
        if(conditions.includes(value[0])) { 
            for (const [state, accidents] of Object.entries(value[1])) { 
                var current; 
                current = accidentMap[state];
                if(isNaN(current)) {
                    current = 0;
                }
                accidentMap[state] = current + accidents;
            }
        }
    }
    google.charts.setOnLoadCallback(drawRegionsMap(accidentMap));      
}

function drawRegionsMap(accidents) {
    var data = [];
    var stateList = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

    for(var i in accidents)
        data.push([i, accidents[i]]);
        
    if(data.length > 0) {
        for(var pos in data) {
            var val = data[pos];
            if(stateList.includes(val[0])) {
                stateList = stateList.filter(state => state !== val[0]);
            }
        }
        for(var pos in stateList) {
            data.push([stateList[pos], 0]);
        }
    }

    data.unshift(['State', 'Accidents']);
    var data = google.visualization.arrayToDataTable(data);

    var options = {
        colorAxis: {colors: ['#3AB6D8', '#8FD44C', '#E8E754', '#ecc44d', '#ea9c4a', '#df4d4d'] },
        datalessRegionColor: '#F5F5F5',
        region: 'US',
        resolution: 'provinces',
        //defaultColor: '#ffffff',
        keepAspectRatio: true,
        is3D: true,
        backgroundColor: 'transparent'
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
}

function drawRegionsMapAccToPop(accidents, population) {
    var data = [];
    for(var i in population) {    
        stateAccidents = accidents[i];
        if(isNaN(stateAccidents)) {
            stateAccidents = 0;
        }   
        statePop = population[i];
        adjustedPop = statePop / 100000; 
        ratio = stateAccidents / adjustedPop; // accidents per 100k people
        roundedRatio = Math.round(ratio);
        data.push([i, roundedRatio]);
    }
    
    data.unshift(['State', 'Accidents']);
    var data = google.visualization.arrayToDataTable(data);

    var options = {
        colorAxis: {colors: ['#3AB6D8', '#8FD44C', '#E8E754', '#ecc44d', '#ea9c4a', '#df4d4d'] },
        datalessRegionColor: '#F5F5F5',
        region: 'US',
        resolution: 'provinces',
        //defaultColor: '#ffffff',
        keepAspectRatio: true,
        is3D: true,
        backgroundColor: 'transparent'
    };
    
    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
}

