import 'leaflet/dist/leaflet.css'
import '../../static/assets/reset.scss';
import './styles/main.scss';

import L from 'leaflet';
L.RasterCoords = require('leaflet-rastercoords');

let img = [
    16384,  // original width of image (here from `example/karta.jpg`)
    16384   // original height of image
];
let minZoom = 1;
let maxZoom = 6;
// create the map
let map = L.map('map', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    doubleClickZoom: false,
    preferCanvas: true,
    maxBoundsViscosity: 1,
    renderer: L.canvas({padding: 0.5})
});

// assign map and image dimensions
let rc = new L.RasterCoords(map, img);
// set max zoom Level (might be `x` if gdal2tiles was called with `-z 0-x` option)
map.setMaxZoom(rc.zoomLevel());
// all coordinates need to be unprojected using the `unproject` method
// set the view in the lower right edge of the image
map.setView(rc.unproject([img[0] / 2, img[1] / 2]), 1);

// set markers on click events in the map
// map.on('click', function (event) {
//     // any position in leaflet needs to be projected to obtain the image coordinates
//     let coords = rc.project(event.latlng);
//     let marker = L.marker(rc.unproject(coords))
//         .addTo(map);
//     marker.bindPopup('[' + Math.floor(coords.x) + ',' + Math.floor(coords.y) + ']')
//         .openPopup();
// });

// the tile layer containing the image generated with `gdal2tiles --leaflet -p raster -w none <img> tiles`
L.tileLayer('/assets/images/tiles/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 6,
    minNativeZoom: 1,
    maxNativeZoom: 6
}).addTo(map);