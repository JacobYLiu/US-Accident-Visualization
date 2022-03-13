class Database {
    static collection;
    static total = 0;
    static fields = [];
    static firstRun = true;
    static changeInYearlyChange = false;
    static accidentsPerDay = new Map();
    static stateAccidents = new Map();
    static weatherAccidents = new Map();
    static accidentDates = new Map();
    static stateSeverities = new Map();
    static yearlyChange = new Map();
    static statePopulations = new Map([
        ['AL', 5024279],
        ['AK', 733391],
        ['AZ', 7151502],
        ['AR', 3011524],
        ['CA', 39538223],
        ['CO', 5773714],
        ['CT', 3605944],
        ['DE', 989948],
        ['FL', 21538187],
        ['GA', 10711908],
        ['HI', 1455271],
        ['ID', 1839106],
        ['IL', 12812508],
        ['IN', 6785528],
        ['IA', 3190369],
        ['KS', 2937880],
        ['KY', 4505836],
        ['LA', 4657757],
        ['ME', 1362359],
        ['MD', 6177224],
        ['MA', 7029917],
        ['MI', 10077331],
        ['MN', 5706494],
        ['MS', 2961279],
        ['MO', 6154913],
        ['MT', 1084225],
        ['NE', 1961504],
        ['NV', 3104614],
        ['NH', 1377529],
        ['NJ', 9288994],
        ['NM', 2117522],
        ['NY', 20201249],
        ['NC', 10439388],
        ['ND', 779094],
        ['OH', 11799448],
        ['OK', 3959353],
        ['OR', 4237256],                
        ['PA', 13002700],
        ['RI', 1097379],
        ['SC', 5118425],
        ['SD', 886667],
        ['TN', 6910840],
        ['TX', 29145505],
        ['UT', 3271616],
        ['VT', 643077],
        ['VA', 8631393],
        ['WA', 7705281],
        ['WV', 1793716],
        ['WI', 5893718],
        ['WY', 576851]
    ])
}

Database.weatherAccidents["rain"] = new Map();
Database.weatherAccidents["hail"] = new Map();
Database.weatherAccidents["snow"] = new Map();
Database.weatherAccidents["visibility"] = new Map();
Database.weatherAccidents["wind"] = new Map();
Database.weatherAccidents["freezing"] = new Map();

module.exports = Database;
