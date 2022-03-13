const Document = require('./document');
const Database = require('./db_manager');

class Collection {
    constructor(name) {
        this.name = name;
        this.rows = new Map();
    }

    insert(values) {
        let doc = new Document(values.get('ID'), values);
        this.rows.set(values.get('ID'), doc);
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            const result = this.rows.get(id);
            if (!result) reject({ message: 'Could not find any records' });
            resolve(Object.fromEntries(result.values));
        });
    }

    findOneOrFail(queryParams) {
        return new Promise((resolve, reject) => {
            this.rows.forEach(row => {
                const accident = row.values;
                let found = true;
                Object.keys(queryParams).forEach(key => {
                    if (accident.get(key) !== queryParams[key])
                        found = false;
                });
                if (found)
                    resolve(Object.fromEntries(accident));
            });
            reject({ message: 'Could not find any records' });
        });
    }

    findMany(queryParams, skip, limit) {
        return new Promise((resolve, reject) => {
            if (skip < 0)
                reject({ message: 'Cannot have a negative skip number' });
            let count = 0;
            let results = [];
            let startTime = Date.parse(queryParams['Start_Time']);
            let endTime = Date.parse(queryParams['End_Time']);

            if (isNaN(startTime)) startTime = 0;
            if (isNaN(endTime)) endTime = 1634689405000;

            for (let [key, value] of this.rows) {
                const accident = value.values;
                let found = true;
                delete queryParams.Start_Time;
                delete queryParams.End_Time;
                Object.keys(queryParams).forEach(key => {
                    if (accident.get(key) !== queryParams[key])
                        found = false;
                });

                if (!(Date.parse(accident.get('Start_Time')) >= startTime && (Date.parse(accident.get('Start_Time')) <= endTime)))
                    found = false;

                if (found && results.length < limit) {
                    count++;
                    if (count > skip)
                        results.push(Object.fromEntries(accident));
                    if (results.length == limit) {
                        resolve(results);
                        return;
                    }
                }
            };
            resolve(results);
        });
    }

    insertOne(accident) {
        const lastID = Array.from(this.rows)[this.rows.size-1][0];
        accident.ID = 'A-' + (parseInt(lastID.substring(2)) + 1).toString();

        let map = new Map();
        Database.fields.forEach(key => {
            map.set(key, accident[key]);
        });
        this.insert(map);
        Database.total += 1;
        this.insertStateAccident(map);
        this.insertAccidentDate(map);
        return Object.fromEntries(map);
    }

    updateOne(id, accident) {
        return new Promise((resolve, reject) => {
            let accidentToUpdate = this.rows.get(id);
            if (!accidentToUpdate) {
                reject({ message: 'Cannot find any records' });
                return;
            }
            Object.keys(accident).forEach(key => {
                accidentToUpdate.values.set(key, accident[key]);
            });
            resolve(Object.fromEntries(accidentToUpdate.values));
        });
    }

    deleteOne(id) {
        return new Promise((resolve, reject) => {
            if (!this.rows.has(id)) reject({ message: 'Could not find any records' });       
            let map = this.rows.get(id).values;
            this.deleteStateAccident(map);
            this.deleteAccidentDate(map);
            this.rows.delete(id);
            Database.total -= 1;
            resolve();
        });
    }

    insertStateAccident(map) {
        let state = map.get('State');

        if(Database.stateAccidents.has(state)) {
            amount = Database.stateAccidents.get(state);
            Database.stateAccidents.set(state, amount += 1);
        }
        else {
            Database.stateAccidents.set(state, 1);
        }
    }
    
    insertAccidentDate(map) {
        let dateAndTime = map.get('Start_Time');
        var dateSplit = dateAndTime.split(" ");
        dateSplit.pop();
        var date = dateSplit[0];

        if(Database.accidentDates.has(date)) {
            amount = Database.accidentDates.get(date);
            Database.accidentDates.set(date, amount += 1);
        } 
        else {
            Database.accidentDates.set(date, 1);
        } 
    }

    deleteStateAccident(map) {
        let state = map.get('State');

        if(Database.stateAccidents.has(state)) {
            amount = Database.stateAccidents.get(state);
            Database.stateAccidents.set(state, amount -= 1);
        }
    }

    deleteAccidentDate(map) {
        let dateAndTime = map.get('Start_Time');
        var dateSplit = dateAndTime.split(" ");
        dateSplit.pop();
        var date = dateSplit[0];

        if(Database.accidentDates.has(date)) {
            amount = Database.accidentDates.get(date);
            Database.accidentDates.set(date, amount -= 1);
        }  
    }

    addOneAccidentsPerDay(accident) {
        if(accident.Start_Time) {
            var dateAndTime = accident.Start_Time;
            let dateSplit = dateAndTime.split(" ");
            let date = dateSplit[0];

            if(Database.accidentsPerDay.has(date)) {
                amount = parseInt(Database.accidentsPerDay.get(date)) + 1;
                amount = amount.toString();
                Database.accidentsPerDay.set(date, amount);
            }
            else {
                Database.accidentsPerDay.set(date, 1);
            }
            this.sortAccidentsPerDay();
        }
    }

    deleteOneAccidentsPerDay(id) {
        const result = this.rows.get(id).values;
        let dateAndTime = result.get("Start_Time");
        let dateSplit = dateAndTime.split(" ");
        let date = dateSplit[0];

        if(Database.accidentsPerDay.has(date)) {
            amount = parseInt(Database.accidentsPerDay.get(date));
            if(amount > 0) {
                amount -= 1;
                amount = amount.toString();
                Database.accidentsPerDay.set(date, amount);
                this.sortAccidentsPerDay();
            }  
        }
    }

    sortAccidentsPerDay() {
        const mapSorted = new Map([...Database.accidentsPerDay.entries()].sort((a, b) => b[1] - a[1]));
        Database.accidentsPerDay = mapSorted;
    }

    addOneStateSeverities(accident) {
        if(accident.Severity) {
            let state = accident.State;
            let severity = parseInt(accident.Severity);

            //console.log("state severity before:", Database.stateSeverities.get(state));

            if(Database.stateSeverities.has(state)) {
                let stateVals = Database.stateSeverities.get(state);
                let severityScore = stateVals[0];
                severityScore += severity;
                let accidentCount = stateVals[1];
                accidentCount += 1;
                
                Database.stateSeverities.set(state, [severityScore, accidentCount])
            }
            else {
                Database.stateSeverities.set(state, [severity, 1]);
            }

            //console.log("state severity after:", Database.stateSeverities.get(state));
        } 
    }

    deleteOneStateSeverities(id) {
        const result = this.rows.get(id).values;
        let state = result.get("State");
        let severity = parseInt(result.get("Severity"));

        //console.log("state severity before:", Database.stateSeverities.get(state));

        if(Database.stateSeverities.has(state)) {
            let stateVals = Database.stateSeverities.get(state);
            let severityScore = stateVals[0];
            severityScore -= severity;
            let accidentCount = stateVals[1];
            accidentCount -= 1;
            
            Database.stateSeverities.set(state, [severityScore, accidentCount])

            //console.log("state severity after:", Database.stateSeverities.get(state));
        }
    }

    // updateAccidentsPerDay(accident) {

    // }

    
    


    // updateAccidentsPerDayOrder(curDate) {
    //     console.log("updating AccidentsPerDay");
    //     console.log("Database.accidentsPerDay before: ", Database.accidentsPerDay);
    //     let curVal = Database.accidentsPerDay.get(curDate);
    //     let nextVal = this.findNextVal(curDate);
    //     let priorVal = this.findPriorVal(curDate);
        
    //     console.log("priorVal is: ", priorVal);
    //     console.log("curVal is: ", curVal);
    //     console.log("nextVal is: ", nextVal);
        
    //     //let nextDate = Database.accidentsPerDay.get(nextVal);
    //     //const obj = Object.fromEntries(Database.accidentsPerDay);
    

    //     //while (curVal < nextVal) {
    //     let nextDate = this.findNextDate(curDate);

    //     Database.accidentsPerDay.set(curDate, nextVal);
    //     Database.accidentsPerDay.set(nextDate, curVal);

    //     delete Object.assign(Database.accidentsPerDay, {curDate: Database.accidentsPerDay[nextDate] })[nextDate];

        

    //     delete Object.assign(Database.accidentsPerDay, {nextDate: Database.accidentsPerDay[curDate] })[curDate];

    //     console.log("Database.accidentsPerDay after: ", Database.accidentsPerDay);
    //     console.log("curDate is: ", curDate);
    //     //}


    //     //console.log("current index: ", date);
    //     //console.log("next index: ", nextIndex);

    //     //const db = Database.accidentsPerDay;
    //     //console.log("Database.accidentsPerDay is: ", db);
        
    //     //const datesArr = Array.from(Database.accidentsPerDay);

    //     //console.log("datesArr is: ", datesArr);
    //     console.log("done updating");
    // }

    // findNextDate(key) {
    //     const obj = Object.fromEntries(Database.accidentsPerDay);
    //     var keys = Object.keys(obj);
    //     let nextKey = keys[(keys.indexOf(key) + 1) % keys.length];
        
    //     return nextKey;
    // }

    // findNextVal(key) {
    //     const obj = Object.fromEntries(Database.accidentsPerDay);
    //     var keys = Object.keys(obj);
    //     let nextKey = keys[(keys.indexOf(key) + 1) % keys.length];
    //     let nextVal = Database.accidentsPerDay.get(nextKey);
        
    //     return nextVal;
    // }

    // findPriorDate(key) {
    //     const obj = Object.fromEntries(Database.accidentsPerDay);
    //     var keys = Object.keys(obj);
    //     let priorKey = keys[(keys.indexOf(key) - 1) % keys.length];
        
    //     return priorKey;
    // }

    // findPriorVal(key) {
    //     const obj = Object.fromEntries(Database.accidentsPerDay);
    //     var keys = Object.keys(obj);
    //     let priorKey = keys[(keys.indexOf(key) - 1) % keys.length];
    //     let priorVal = Database.accidentsPerDay.get(priorKey);
        
    //     return priorVal;
    // }
}

module.exports = Collection;
