/* eslint-disable */
console.log('Hello from the client side!!!');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiaW52aW5jaWJsZTAxIiwiYSI6ImNsazZpdTZxbzAyaXQzZnF0aDViN3o2MGYifQ.jQFnz0mLGm16H1PytV2NSw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});
