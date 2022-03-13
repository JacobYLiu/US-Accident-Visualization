function initialize() {
    $.ajax({
        url:`/accidents/isFirstRun`,
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        let val = result.run;
        if(val == true) {
            console.log("First run");
            firstRun();
        }
        else {
            console.log("Not first run");
            notFirstRun();
        }
    })
}

function firstRun() {
    getAccidentDateListFirstRun();
    getAccidentSeverities();
}

function notFirstRun() {
    getAccidentDateListNotFirstRun();
    getAccidentSeverities();
}

function getAccidentDateListFirstRun() {
    $.ajax({
        url: '/accidents/accidentDates',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        const accidents = result.accidents;
        const sortedAccidents = sortAccidentDates(accidents);
        storeAccidentDates(sortedAccidents);
        const arrTop10 = Array.from(sortedAccidents).slice(0,10);
        const arrBottom10 = Array.from(sortedAccidents).slice(-10).reverse();

        displayTop10Dates(arrTop10);
        displayBottom10Dates(arrBottom10);
        separateByYear(accidents);
        generateList(accidents);
    })
}

function getAccidentDateListNotFirstRun() {
    $.ajax({
        url: '/accidents/getCurrentAccidentDates',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        const accidents = result.accidents;
        const accidentsObj = Object.entries(accidents);
        const top10 = accidentsObj.slice(0,10);
        const bottom10 = accidentsObj.slice(-10).reverse();
        
        displayTop10Dates(top10);
        displayBottom10Dates(bottom10);
        checkYearlyChange(accidents);
    })
}

function sortAccidentDates(accidents) {
    const accidentMap = new Map(Object.entries(accidents));
    const mapSortedDesc = new Map([...accidentMap.entries()].sort((a, b) => b[1] - a[1]));

    return mapSortedDesc;
}

function storeAccidentDates(accidents) {
    const obj = Object.fromEntries(accidents);
    const objStr = JSON.stringify(obj);
    $.ajax({
        url: '/accidents/storeAccidentDates',
        type: 'post',
        data: objStr
    })
    .done(result => {
        console.log(result);
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })
}

function displayTop10Dates(accidents) {
    let dateList = [];
    let num_accidents = [];
    const top10 = Object.entries(accidents).sort((a, b) => b[1] - a[1]).slice(0, 10);
    for (let i = 0; i < top10.length; i++) {
        let tuple = top10[i][1];
        dateList.push(tuple[0]);
        num_accidents.push(tuple[1]);
        $('#top-accidents-display').append(generateAccidentsHTML(top10[i], i+1));
    }

    const ctx = document.getElementById('top10_accidents');
    const top10_graph = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateList,
            datasets: [{
                label: '# of Accidents',
                data: num_accidents,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayBottom10Dates(accidents) {
    let dateList = [];
    let num_accidents = [];
    const bottom10 = Object.entries(accidents).sort((a, b) => a[1] - b[1]).slice(0, 10);
    for (let i = 0; i < bottom10.length; i++) {
        let tuple = bottom10[i][1];
        dateList.push(tuple[0]);
        num_accidents.push(tuple[1]);
        $('#fewest-accidents-display').append(generateAccidentsHTML(bottom10[i], i+1));
    }

    const ctx = document.getElementById('bottom10_accidents');
    const bottom10_graph = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateList,
            datasets: [{
                label: '# of Accidents',
                data: num_accidents,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateAccidentsHTML(accident, index) {
    const HTML = `
        <div>
            ${index + ")"}
            ${"Date: " + accident[1][0]}
            <br>
            ${"Number of accidents: " + accident[1][1]}
        </div>
        <br>
    `;

    return HTML;
}

function generateList(accidents) {
    const ordered = Object.keys(accidents).sort().reduce(
        (obj, key) => {
            obj[key] = accidents[key];
            return obj;
        },
        {}
    );
    let dateList = Object.keys(ordered);
    let accidentList = [];
    for(let i = 0; i < dateList.length; i++) {
        accidentList.push(ordered[dateList[i]]);
    }

    generateAllChart(dateList, accidentList)
}

function generateAllChart(dateList, accidentList) {
    const ctx = document.getElementById('all_chart');
    const all_chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateList,
            datasets: [{
                label: '# of Accidents',
                data: accidentList,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getAccidentSeverities() {
    $.ajax({
        url: '/accidents/bySeverity',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        getStateAverage(result);
    })
}

function getStateAverage(result) {
    let stateAvgList = [];
    let stateAvgListToPass = [];
    let stateList = [];
    stateList = Object.entries(result);

    for (let i = 0; i < stateList.length; i++) {
        let state = stateList[i][0];
        let values = stateList[i][1];

        let score = values[0];
        let count = values[1];
        let avgScore = score / count;
        stateAvgListToPass.push([state, avgScore]);
        stateAvgList.push([state, avgScore.toFixed(3)]);
    }
    stateAvgList.sort(function(a,b) { return b[1] - a[1]; });
    for (let i = 0; i < stateAvgList.length; i++) {
        $('#each-state-severity-display').append(generateStateScoresHTML(stateAvgList[i][0], stateAvgList[i][1], i+1));
    }
    displaySeverityChart(stateAvgList);
    getCountryAverage(stateAvgListToPass);
}

function displaySeverityChart(stateAvgList){
    stateArr = []
    severityArr = []
    for (let i = 0; i < stateAvgList.length; i++) {
        tuple = stateAvgList[i];
        stateArr.push(tuple[0]);
        severityArr.push(parseFloat(tuple[1]));
    }

    const ctx = document.getElementById('severity_accidents');
    const severity_accidents = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stateArr,
            datasets: [{
                label: 'Severity score',
                data: severityArr,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getCountryAverage(stateAvgList) {
    let countryScore = 0;
    for (let i = 0; i < stateAvgList.length; i++) {
        let stateScore = parseFloat(stateAvgList[i][1]);
        countryScore += stateScore;
    }
    countryScore = (countryScore / stateAvgList.length).toFixed(3);
    $('#country-severity-display').append(countryScore);
}

function generateStateScoresHTML(state, avgScore, index) {
    const HTML = `
        <div>
            ${index + ")"}
            ${"State: " + state + ", "}
            ${"Average severity score: " + avgScore}
        </div>
        <br>
    `;

    return HTML;
}

function checkYearlyChange(accidents) {
    $.ajax({
        url: '/accidents/checkYearlyChange',
        type: 'get',
        datatype: 'json'
    })
    .done((result) => {
        const change = result.result;

        generateList(accidents);
        separateByYear(accidents);
    })
}

function separateByYear(accidents) {
    let accidentsByYearList = new Map();
    let accidentList = [];
    accidentList = Object.entries(accidents);

    for(let i = 0; i < accidentList.length; i++) {
        let date = accidentList[i][0];
        let year = date.substring(0,4);
        let accidentCount = parseInt(accidentList[i][1]);

        if(accidentsByYearList.has(year)) {
            total = accidentsByYearList.get(year);
            accidentsByYearList.set(year, total += accidentCount);
        }
        else {
            accidentsByYearList.set(year, accidentCount);
        }
    }
    sortYearlyChange(accidentsByYearList)
}

function sortYearlyChange(yearMap) {
    let yearList = Array.from(yearMap);
    yearList.sort(function(a,b) { return a[0] - b[0]; }); 

    getYearlyChange(yearList);
}

function getYearlyChange(yearList) {
    let yearlyChangeList = [];
    let yearArr = [];
    let totalAccidentsArr = [];
    yearlyChangeList.push([yearList[0][0], yearList[0][1], 0]);
    $('#yearly-change-display').append(generateYearlyChangeHTML(yearlyChangeList[0][0], yearlyChangeList[0][1], yearlyChangeList[0][2]));
    for (let i = 1; i < yearList.length; i++) {
        let currentYear = yearList[i][0];
        let priorYearTotal = yearList[i-1][1];
        let currentYearTotal = yearList[i][1];

        let difference = currentYearTotal - priorYearTotal;
        let percentChange = ((difference / priorYearTotal) * 100).toFixed(2);

        yearArr.push(currentYear);
        totalAccidentsArr.push(currentYearTotal);
        yearlyChangeList.push([currentYear, currentYearTotal, percentChange]); 

        $('#yearly-change-display').append(generateYearlyChangeHTML(currentYear, currentYearTotal, percentChange));
    }

    displayPercentChangeChart(yearArr, totalAccidentsArr);
}

function generateYearlyChangeHTML(year, total, change) {
    const HTML = `
        <div>
            ${"Year: " + year}
            <br>
            ${"Total Accidents: " + total}
            <br>
            ${"Percent change from previous year: " + change + "%"}
        </div>
        <br>
    `;

    return HTML;
}

function displayPercentChangeChart(yearArr, totalAccidentsArr){
    const ctx = document.getElementById('percentage-change-chart');
    let percentage_chart = new Chart(ctx, {
        data: {
            datasets: [          
                {
                    type: 'bar',
                    label: 'Yearly Accidents Change',
                    data: totalAccidentsArr,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    order: 1,
                }],    
                    labels: yearArr,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
