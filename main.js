// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNrZW5lZWZqZSIsImEiOiJja21rbDkxMjgxMjVyMm9rNTB1ZWZzejA3In0.D5z7TG4cs2i52Zg9eozWkQ';

// api token for openWeatherMap
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = '22ac17834b2fe56187cd234217cec1cf';

// Determine cities
var cities = [
  {
    name: 'Amsterdam',
    coordinates: [4.895168, 52.370216]
  },
  {
    name: 'Rotterdam',
    coordinates: [4.47917, 51.9225]
  },
  {
    name: 'Nijmegen',
    coordinates: [5.85278, 51.8425]
  },
  {
    name: 'Maastricht',
    coordinates: [5.68889, 50.84833]
  },
  {
    name: 'Groningen',
    coordinates: [6.56667, 53.21917]
  },
  {
    name: 'Enschede',
    coordinates: [6.89583, 52.21833]
  },
  {
    name: 'Florida',
    coordinates: [-80.73407219943293, 30.103896320472405]
  },
  {
    name: 'Kourou',
    coordinates: [-52.59532464237342, 5.170415478395597]
  },
  {
    name: 'Jiuquan',
    coordinates: [100.20873042973776,  40.98476899107218]
  },
  {
    name: 'Esrange',
    coordinates: [21.12453039138415, 67.88399334275596]
  },
  {
    name: 'Kapoestin Jar',
    coordinates: [45.76944911002347, 48.57194413536261]
  },
  {
    name: 'Xichang',
    coordinates: [102.08103272465647, 27.92477361282209]
  },
  {
    name: 'Sriharikota',
    coordinates: [80.22629700576447, 13.727246259984913]
  },
];

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',

// Positioning the map on a certain longitute + latitude and zooming in
center: [4.322840, 52.067101],
zoom: 1.5,
});

var popup = new mapboxgl.Popup().setHTML('<h3>De Haagse Hogeschool</h3><p>Closed at the moment.</p>');
var popup2 = new mapboxgl.Popup().setHTML('<h3>Kennedy Space Center</h3><p>NASAs launch site at Cape Canaveral on Merritt Island, Florida.</p>');
var popup3 = new mapboxgl.Popup().setHTML('<h3>Kourou Center Spatial Guyanais</h3><p> Is best known because the launch site Center Spatial Guyanais (CSG) is located here.</p>');
var popup4 = new mapboxgl.Popup().setHTML('<h3>Launch Site Jiuquan</h3><p>In 1970 Chinas first satellite was launched here.</p>');
var popup5 = new mapboxgl.Popup().setHTML('<h3>Esrange</h3><p>Esrange is a launch site and space research center located north of the Swedish city of Kiruna.</p>');
var popup6 = new mapboxgl.Popup().setHTML('<h3>Kapoestin Jar</h3><p>a test and launch base for missiles.</p>');
var popup7 = new mapboxgl.Popup().setHTML('<h3>Xichang</h3><p>200 km north of Panzhihua, located on the Yangtze River, in the high mountains. Not far from here is a missile launch site..</p>');
var popup8 = new mapboxgl.Popup().setHTML('<h3>Satish Dhawan Space Centre</h3><p>Satish Dhawan Space Center SHAR is a launch site of the Indian Space Research Organization (ISRO), the Indian space research organization.</p>');

// Adding a marker based on lon lat coordinates
var marker = new mapboxgl.Marker()
.setLngLat([4.324439, 52.067200])
.setPopup(popup)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([-80.73407219943293, 30.103896320472405])
.setPopup(popup2)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([-52.59532464237342,  5.170415478395597])
.setPopup(popup3)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([100.20873042973776,  40.98476899107218])
.setPopup(popup4)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([21.12453039138415, 67.88399334275596])
.setPopup(popup5)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([45.76944911002347, 48.57194413536261])
.setPopup(popup6)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([102.08103272465647, 27.92477361282209])
.setPopup(popup7)
.addTo(map);

var marker = new mapboxgl.Marker()
.setLngLat([80.22629700576447, 13.727246259984913])
.setPopup(popup8)
.addTo(map);
// get weather data and plot on map
map.on('load', function () {
  cities.forEach(function(city) {
    // Usually you do not want to call an api multiple times, but in this case we have to
    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    // Get current weather based on cities' coordinates
    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        // Then plot the weather response + icon on MapBox
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'https://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.3
        }
      });
    }
  );
}


  // style: 'mapbox://styles/mapbox/satellite-v9'
  // style: 'mapbox://styles/mapbox/dark-v10'
  // pitch: 45,
  // bearing: -17.6,
  // Positioning the map on a certain longitute + latitude and zooming in
  // Let op de volgorde van de lat, lon!!
  // center: [4.322840, 52.067101],
  // zoom: 15,



// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


function clock(){
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var midday;

      hours = updateTime(hours);
      minutes = updateTime(minutes);
      seconds = updateTime(seconds);
      var name = "Eef";

      //IF ElSE CONDITION
      midday = (hours >= 12) ? "PM" : "AM";

      document.getElementById("clock").innerHTML = hours + ":" + minutes + ":" + seconds + midday;

      var time = setTimeout(function(){
        clock();
      }, 1000);
}

function updateTime(k){
      if(k < 10){
        return "0" + k
      }
      else{
        return k;
      }
}
    //call clock function
          clock();
