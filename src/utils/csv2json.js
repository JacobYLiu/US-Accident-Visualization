const e = require('express');
const fs            = require('fs');
const readline      = require('readline');
const Collection    = require('../db/collection');
const Database      = require('../db/db_manager');

module.exports = async (filePath, start) => {
    let firstLine = true;
    let fields = [];
    let values = [];
    let lineCounter = 0;
    let data = new Collection('accidents');

    const readStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: readStream
    });
    for await (const line of rl) {
        if (lineCounter != start) {
            lineCounter++;
            continue;
        }

        if (!line.trim() || line[0] === '-') continue;

        if (firstLine) {
            fields = line.split(',');
            Database.fields = fields;
            firstLine = false;
        } else {
            values = line.split(',');
            let map = new Map();
            for(var i = 0; i < values.length; i++) {
                map.set(fields[i], values[i]);
                if(fields[i] == 'State') {
                    dbMapInsertAccident(values[i]);
                }
                if(fields[i] == 'Start_Time') {
                    dbMapInsertDate(values[i]);
                }
            }
            checkWeather(map);
            dbMapInsertSeverity(map)
            data.insert(map);
        }
    }

    return data;
}

function dbMapInsertSeverity(map) {
    var state = map.get('State');
    var severity = map.get('Severity');
    severityInt = parseInt(severity);

    if(Database.stateSeverities.has(state)) {
        pair = Database.stateSeverities.get(state);
        score = pair[0];
        var scoreInt = parseInt(score);
        var newScore = scoreInt + severityInt;
        count = pair[1] + 1;
        Database.stateSeverities.set(state, [newScore, count]);
    }
    else {
        Database.stateSeverities.set(state, [severityInt, 1]);
    }
}

function dbMapInsertAccident(state) {
    if(Database.stateAccidents.has(state)) {
        amount = Database.stateAccidents.get(state);
        Database.stateAccidents.set(state, amount += 1);
    }
    else {
        Database.stateAccidents.set(state, 1);
    }
}

function dbMapInsertDate(dateAndTime) {
    var dateSplit = dateAndTime.split(" ");
    dateSplit.pop();
    var date = dateSplit[0];
    if(Database.accidentDates.has(date)) {
        amount = Database.accidentDates.get(date);
        Database.accidentDates.set(date, amount += 1);
    } else {
        Database.accidentDates.set(date, 1);
    }
}

function checkWeather(map) { 
    var state = map.get('State');
    var weather = map.get('Weather_Condition');
    if(weather == undefined) {
        weather = "Sunny";
    }
    var temperature = map.get('Temperature(F)');
    if(temperature == undefined) {
        temperature = 60;
    }
    var visibility = map.get('Visibility(mi)');
    if(visibility == undefined) {
        visibility = 10;
    }
    var wind = map.get('Wind_Speed(mph)');
    if(wind == undefined) {
        wind = 0;
    }

    if(weather.includes('Rain')) {
        Database.weatherAccidents['rain'].set(state, (Database.weatherAccidents['rain'].get(state) ?? 1) + 1);
    }
    if(weather.includes("Hail")) {
        Database.weatherAccidents['hail'].set(state, (Database.weatherAccidents['hail'].get(state) ?? 1) + 1);
    }
    if(weather.includes('Snow')) {
        Database.weatherAccidents['snow'].set(state, (Database.weatherAccidents['snow'].get(state) ?? 1) + 1)
    }
    if(visibility <= 0.25) {
        Database.weatherAccidents['visibility'].set(state, (Database.weatherAccidents['visibility'].get(state) ?? 1) + 1)
    }
    if(temperature <= 32) {
        Database.weatherAccidents['freezing'].set(state, (Database.weatherAccidents['freezing'].get(state) ?? 1) + 1)
    }
    if(wind >= 30) {
        Database.weatherAccidents['wind'].set(state, (Database.weatherAccidents['wind'].get(state) ?? 1) + 1)
    }
}
