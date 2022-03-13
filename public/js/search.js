function search(event) {
    event.preventDefault();
    mapReset();

    let urlString = ''; 
    const city = $('#searchForm').find('#city').val();
    const state = $('#searchForm').find('#state').val();
    const startDate = $('#searchForm').find('#datepicker-from').val();
    const endDate = $('#searchForm').find('#datepicker-to').val();
    
    $.ajax({
        url: `/accidents?City=${city}&State=${state}&Start_Time=${startDate}&End_Time=${endDate}&page=1&limit=1000`,
        type: 'get',
        datatype: 'json'
    })
    .done(function(result) {
        console.log(result);
        if (result.accidents.length === 0)
            $('#accidentsList').append('No accidents found');
        populateAccidentsList(result.accidents);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    })
}

function mapInit() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(39.117896837624635, -99.13774485989127),
        zoom: 5,
        mapTypeId: 'roadmap'
    });
}

function mapReset() {
    coordinateList = [];
    mapInit(); 
    document.getElementById("accidentsList").innerHTML = "";
}

function populateAccidentsList(accidents) {
    var bounds = new google.maps.LatLngBounds(), count = 0;
    
    accidents.forEach(accident => {
        $('#accidentsList').append(generateAccidentsHTML(accident, accidents.indexOf(accident)+1));

        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(accident.Start_Lat, accident.Start_Lng),
            //***Line below determines if markers are shown on map  
            // map: map
            //*** 
        })

        bounds.extend(marker.position);
        coordinateList[count] = { 
            location: new google.maps.LatLng(accident.Start_Lat, accident.Start_Lng),
            weight: accident['Severity'] * 0.82
        };
        count += 1;
    });
    map.fitBounds(bounds);
    generateHeatmap(coordinateList);
}

function generateHeatmap(coordinateList) {
    console.log(coordinateList.length);
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: coordinateList,
        //dissipating: false,
        maxIntensity: 50,
        radius: 30,
        opacity: 0.6
    });
    heatmap.setMap(map);
}

function generateAccidentsHTML(accident, index) {
    const HTML = `
        <div>
            ${index + ")"}
            ${accident.ID}
            ${accident.City}
            ${accident.County}
            ${accident.State}
        </div>
        <div>
            ${accident.Description}
        </div>
        </br>
    `;

    return HTML;
}

$( function() {
	$(".datepicker").datepicker({
		duration: "fast"
	});
} );
