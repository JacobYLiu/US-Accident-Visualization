const accidentsService = require('./accidents.service');
const express = require('express');

module.exports = (app) => {
    //app.use(express.json({limit: '700mb'}));
    //app.use(express.urlencoded({limit: '700mb'}));

    app.get('/accidents', async (req, res) => {
        try {
            const accidents = await accidentsService.getAccidents(req.query);
            res.status(200).json(
                {
                    numberOfAccidents: accidents.length,
                    accidents: accidents
                }
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/accidents/total', (req, res) => {
        res.status(200).json({ total: accidentsService.totalAccidents() });
    });

    app.get('/accidents/totalWeather', (req, res) => {
        const weatherList = accidentsService.totalWeatherAccidents(req.query);
        const weatherListJSON = Object.fromEntries(weatherList);

        res.status(200).json({ total: weatherListJSON });
    });

    app.get('/accidents/byState', (req, res) => {
        try {
            const stateAccidents = accidentsService.getStateAccidents(req.query);
            const stateAccidentsJSON = Object.fromEntries(stateAccidents);
            res.status(200).json(
                stateAccidentsJSON
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/accidents/byStatePopulation', (req, res) => {
        try {
            const stateAccidents = accidentsService.getStateAccidents(req.query);
            const statePopAccidents = accidentsService.getStatePopAccidents(req.query);
            const stateAccidentsJSON = Object.fromEntries(stateAccidents);
            const statePopAccidentsJSON = Object.fromEntries(statePopAccidents);
            res.status(200).json(
                {
                    accidents: stateAccidentsJSON,
                    population: statePopAccidentsJSON
                }  
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/accidents/bySeverity', (req, res) => {
        try {
            const accidentSeverity = accidentsService.getSeverities(req.query);
            const accidentSeverityJSON = Object.fromEntries(accidentSeverity);
            res.status(200).json(
                accidentSeverityJSON
            );
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/accidents/weatherAccidents', (req, res) => {
        try {
            var weatherList = [];
            const weatherAccidents = accidentsService.getWeatherAccidents(req.query);
            for (const [key, value] of Object.entries(weatherAccidents)) {
                valueJSON = Object.fromEntries(value);
                weatherList.push([key+"Accidents", valueJSON]);
            }
            res.status(200).json({ accidents: weatherList });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/accidents/accidentDates', (req, res) => {
        try {
            const accidentDates = accidentsService.getAccidentDates(req.query);
            const accidentDatesJSON = Object.fromEntries(accidentDates);
            res.status(200).json({ accidents: accidentDatesJSON });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get(`/accidents/isFirstRun`, (req, res) => {
        const run = accidentsService.isFirstRun();
        res.status(200).json({ run });
    });

    app.get('/accidents/accidentDates', (req, res) => {
        try {
            const accidentDates = accidentsService.getAccidentDates(req.query);
            const accidentDatesJSON = Object.fromEntries(accidentDates);
            res.status(200).json({ accidents: accidentDatesJSON });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/accidents/storeAccidentDates', async (req, res) => {
        try {
            const obj = JSON.parse(Object.keys(req.body));
            accidentsService.storeAccidentDates(obj);
            res.status(200).json({ result: "Accident dates stored successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get(`/accidents/fetchYearlyChange`, (req, res) => {
        const yearlyChange = accidentsService.getYearlyChange(); 
        const yearlyChangeJSON = Object.fromEntries(yearlyChange);
        res.status(200).json({ obj: yearlyChangeJSON });
    });

    app.post('/accidents/storeYearlyChange', async (req, res) => {
        try {
            let keylist = [];
            let valuelist = [];

            console.log("the req.body is: ", req.body);
            const temp = Object.keys(req.body);
            console.log("temp is: ", temp);
            
            // const partialObj = Object.values(req.body);
            
            // const string = partialObj[0];
            // console.log("string is: ", string);

            // Object.entries(string).forEach(entry => {
            //     const [key, value] = entry;
            //     keylist.push(key);
            //     valuelist.push(Object.entries(value));
            // })

            // console.log("keylist is: ", keylist[0]);
            // console.log("valuelist is: ", valuelist[0]);


            // const temp = string;
            // console.log("temp is: ", temp);

            // const obj = Object.values(partialObj);
            // console.log("obj is: ", obj);

            // const thing = Object.values(obj);
            // console.log("thing is: ", thing);

            // console.log("thing[0] is: ", thing[0]);

            //accidentsService.storeYearlyChange(temp);
            res.status(200).json({ result: "Yearly  change stored successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/accidents/checkYearlyChange', (req, res) => {
        res.status(200).json({ result: accidentsService.checkYearlyChange() });
    });

    app.get(`/accidents/getCurrentAccidentDates`, (req, res) => {
        const accidentsPerDay = accidentsService.getCurrentAccidentDates(); 
        const accidentsPerDayJSON = Object.fromEntries(accidentsPerDay);
        res.status(200).json({ accidents: accidentsPerDayJSON });
    });
    

    app.get('/accidents/:id', async (req, res) => {
        try {
            const result = await accidentsService.findById(req.params.id);
            res.status(200).json({ accident: result });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    });

    app.post('/accidents', async (req, res) => {
        try {
            const insertedAccident = accidentsService.insertOne(req.body);
            res.status(200).json({ inserted: insertedAccident });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.put('/accidents/:id', async (req, res) => {
        try {
            const result = await accidentsService.updateOne(req.params.id, req.body);
            res.status(200).json({ updated: result });
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    });

    app.delete('/accidents/:id', async (req, res) => {
        try {
            await accidentsService.deleteOne(req.params.id);
            res.status(200).send('deleted');
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    });
}
