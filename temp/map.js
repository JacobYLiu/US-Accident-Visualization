// Initialize and add the map
function initMap() {
  //  var heatMapData = [
  //    {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
  //    new google.maps.LatLng(37.782, -122.445),
  //    {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
  //    {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
  //    {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
  //    new google.maps.LatLng(37.782, -122.437),
  //    {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},

  //    {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
  //    {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
  //    new google.maps.LatLng(37.785, -122.443),
  //    {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
  //    new google.maps.LatLng(37.785, -122.439),
  //    {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
  //    {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
  //  ];
  var points = [
    result.forEach
  ];

  var geocoder = new google.maps.Geocoder();
  temp = result.accidents;
  
  //var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(40.40665145250237, -99.13774485989127),
    zoom: 5,
    mapTypeId: 'roadmap'
  });

  // geocoder.geocode({'address': "San Francisco"}, function(results, status) {
  //   if (status === 'OK') {
  //     map.setCenter(results[0].geometry.location);
  //   } else {
  //     alert('Geocode was not successful for the following reason: ' + status);
  //   }
  // });

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData
  });
  heatmap.setMap(map);
}
