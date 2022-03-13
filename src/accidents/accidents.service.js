const db = require('../db/db_manager');

exports.getAccidents = async (params) => {
    if (!params.page) params.page = 1;
    if (!params.limit) params.limit = 10;
    Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
    });
    const limit = parseInt(params.limit);
    const skip = (parseInt(params.page) - 1) * limit;
    delete params.page;
    delete params.limit;
    return await db.collection.findMany(params, skip, limit);
}

exports.totalAccidents = () => {
    return db.total;
}

exports.insertOne = (accident) => {
    console.log("yearly change");
    db.changeInYearlyChange = true;
    db.collection.addOneAccidentsPerDay(accident);
    db.collection.addOneStateSeverities(accident);
    return db.collection.insertOne(accident);
}

exports.updateOne = (id, accident) => {
    console.log("yearly change");
    db.changeInYearlyChange = true;
    //db.collection.updateAccidentsPerDay(accident);
    return db.collection.updateOne(id, accident);
}

exports.findOne = async (params) => {
    return await db.collection.findOneOrFail(params);
}

exports.findById = async (id) => {
    return await db.collection.findById(id);
}

exports.deleteOne = async (id) => {
    console.log("yearly change");
    db.changeInYearlyChange = true;
    db.collection.deleteOneAccidentsPerDay(id);
    db.collection.deleteOneStateSeverities(id);
    return await db.collection.deleteOne(id);
}

exports.getStateAccidents = () => {
    return db.stateAccidents;
}

exports.getStatePopAccidents = () => {
    return db.statePopulations;
}

exports.getWeatherAccidents = () => {
    return db.weatherAccidents;
}

exports.getAccidentDates = () => {
    return db.accidentDates;
}

exports.getSeverities = () => {
    //console.log("Severity list is: ", db.stateSeverities);
    return db.stateSeverities;
}

exports.totalWeatherAccidents = () => {
    var totalList = new Map();

    rain = db.weatherAccidents["rain"];
    hail = db.weatherAccidents["hail"];
    snow = db.weatherAccidents["snow"];
    visibility = db.weatherAccidents["visibility"];
    freezing = db.weatherAccidents["freezing"];
    wind = db.weatherAccidents["wind"];

    totalList.set("rainAccidents", getSum(rain));
    totalList.set("hailAccidents", getSum(hail));
    totalList.set("snowAccidents", getSum(snow));
    totalList.set("visibilityAccidents", getSum(visibility));
    totalList.set("freezingAccidents", getSum(freezing));
    totalList.set("windAccidents", getSum(wind));

    return totalList;
}

function getSum(weatherMap) {
    var sum = 0;
    weatherMap.forEach(count => {
        sum += count;
    });
    return sum;
}

exports.isFirstRun = () => {
    var run = db.firstRun;
    db.firstRun = false;
    return run;
}

exports.storeAccidentDates = (accidents) => {
    const map = new Map(Object.entries(accidents));
    db.accidentsPerDay = map;
}

exports.getCurrentAccidentDates = () => {
    return db.accidentsPerDay;
}

exports.storeYearlyChange = (obj) => {
    db.changeInYearlyChange = false;
    const map = new Map(Object.entries(obj));
    console.log("map is: ", map);
    db.yearlyChange = map;
}

exports.checkYearlyChange = () => {
    return db.changeInYearlyChange;
}

exports.getYearlyChange = () => {
    return db.yearlyChange;
}