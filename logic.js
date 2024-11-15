// Creating the map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Define the USGS Earthquake data URL (for the past 7 days' all earthquakes)
  var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Define the Tectonic Plates data URL
  var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  
  // Define a function to determine color based on earthquake depth
  function getColor(depth) {
    return depth > 90 ? "#ff5f65" :
           depth > 70 ? "#fca35d" :
           depth > 50 ? "#fdb72a" :
           depth > 30 ? "#f7db11" :
           depth > 10 ? "#dcf400" :
                        "#a3f600";
  }
  
  // Define a function to determine the radius based on earthquake magnitude
  function getRadius(magnitude) {
    return magnitude * 4;
  }
  
  // Retrieve earthquake GeoJSON data and add to map
  d3.json(earthquakeURL).then(function(data) {
    // Create a GeoJSON layer for earthquake data
    L.geoJson(data, {
      // Convert points to circle markers
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // Style each marker based on magnitude and depth
      style: function(feature) {
        return {
          color: "#000000",
          weight: 0.5,
          fillColor: getColor(feature.geometry.coordinates[2]), // Depth
          fillOpacity: 0.8,
          radius: getRadius(feature.properties.mag) // Magnitude
        };
      },
      // Add popups with information
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
          <hr><p>Magnitude: ${feature.properties.mag}</p>
          <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
      }
    }).addTo(myMap);
    
    // Retrieve Tectonic Plates GeoJSON data and add to map
    d3.json(tectonicPlatesURL).then(function(tectonicData) {
      L.geoJson(tectonicData, {
        color: "orange",
        weight: 2
      }).addTo(myMap);
    });
  
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
          depths = [-10, 10, 30, 50, 70, 90],
          colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];
  
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km");
      }
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  });
  
  
