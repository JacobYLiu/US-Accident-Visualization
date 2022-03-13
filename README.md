# cs180project-022-kernel-panic

## Requirements

### Dataset
Download from https://www.kaggle.com/sobhanmoosavi/us-accidents

### Libraries & Tools
- NodeJS
- npm
- Google Maps API (heatmap)
- Chart.js (graph visualization)

## Installation
- Clone the repo 
- Run `npm install`
- Run `npm run start`
- Go to `localhost:3000` within browser
- On the Choose Database screen, upload the .csv dataset 
- Wait for the program to fully parse and populate the database - the page will redirect automatically when finished

## Project Directory Structure
### Sprint-1 through Sprint-6 
- Contain artifacts and demo pdfs for each respective sprint.

### public
Contains:
- **assets**: All of the .png files used are located here.
- **css**: All of the .css files are located here. They are used by the .ejs files (located in **views**), which render the HTML pages.
- **js**: All of the .js files which handle frontend logic - such as ajax calls and formating what will be rendered on the webpages - are located here.

### src
Contains:
- **accidents**: 
  - ***accidents.controller.js***: Receives and handles all ajax GET and POST requests from the frontend. Performs function calls to ***accidents.service.js*** to receive data to return to the frontend via responses.
  - ***accidents.service.js***: Receives data requests fom ***accidents.controller.js***, performs minimal logic depending on the request parameters, and requests data from ***db/collection.js*** to retrieve data to return to ***accidents.controller.js***.
- **analysis**: Handles ajax GET request to render the Analysis webpage.
- **dashboard**: Handles ajax GET requets to render the Dashboard webpage and any .csv import or export requests.
- **db**:
  - ***collection.js***: Handles requests from ***accidents/accidents.service.js***. Functions here access the database to perform insertions, updates, deletions, or to retrieve data. 
  - ***db_manager.js***: Holds the database and all the entries, maps which hold pre-determined data, and functions necessary to edit the maps.
  - ***db.controller.js***: Handles ajax GET and POST requests for rendering the database webpage, exporting the current database, and importing a different .csv file.
  - ***db.service.js***: Holds function to export the current database to a .csv file.
  - ***document.js***: Holds the Document class constructor.

- **map**: Unused.

- **middleware**: Handles ajax GET request to render the Choose Database webpage.

- **search**: Handles ajax GET request to render the Search webpage.

- **server**: Starts the server process to run the program.

- **utils**: Handles parsing .csv files and populating the database. Also populates maps which are used by certain analytics.

- ***app.controller.js***: Parent file of al other controller files.

- **temp**: Holds unused files.

- **views**: Holds all the .ejs files which generate the HTML for the webpages.
