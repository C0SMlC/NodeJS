/* eslint-disable */
// console.log('Hello from the client side!!!');
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaW52aW5jaWJsZTAxIiwiYSI6ImNsazZpdTZxbzAyaXQzZnF0aDViN3o2MGYifQ.jQFnz0mLGm16H1PytV2NSw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/invincible01/clk6njkgx000m01pbfqt88lrz',
    scrollZoom: false,
    // center: [lng, lat]
    // zoom:10
    // interactive:false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    const element = document.createElement('div');
    element.className = 'marker';

    new mapboxgl.Marker({
      element: element,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}:${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include currrent location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      right: 100,
      left: 100,
    },
  });
};
