//url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

//get earthquake data
d3.json(url).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

    // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    //create circles
    function pointToLayer(feature, latlng) {
        var depth = feature.geometry.coordinates[2];
        var mag = feature.properties.mag

        var color = "";
        if (depth <= 10) {
            color = "green";
        }
        else if (depth <= 20) {
            color = "yellow";
        }
        else if (depth <= 40) {
            color = "orange";
        }
        else if (depth <= 60) {
            color = "darkorange";
        }
        else if (depth <= 90) {
            color = "orangered";
        }
        else  {
            color = "red";
        };

        return new L.circleMarker(latlng, {
            radius: mag * 3,
            color: color
        });
    }

        var earthquakes = L.geoJson(earthquakeData, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer,
        });
      // Sending our earthquakes layer to the createMap function
        createMap(earthquakes);

};

function createMap(earthquakes) {
     // Define streetmap
    var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

    var overlayMaps = {
      Earthquakes: earthquakes
  };

  // Create a map object
    var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetMap, earthquakes]
  });
// set up legend 
    var legend = L.control({position: "bottomright"});
        legend.onAdd = function(myMap) {
            var div = L.DomUtil.create("div", "info legend")
            var depth = [10, 20, 40, 60, 90]
            var colors = [
                "#008000",
                "#FFFF00",
                "#FFA500",
                "#FF8C00",
                "#FF4500",
                "#FF0000"
            ];
            //for loop
            for (var i = 0; i < depth.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
            }
            return div;

        };
        legend.addTo(myMap);
    // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
    L.control.layers(overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}



    
