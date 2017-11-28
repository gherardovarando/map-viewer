'use babel';

require('leaflet');
require('leaflet-map-builder');
require('leaflet-multilevel');
require('leaflet-csvtiles');
window.Papa = require('papaparse');
const id = 'map-leaflet';
const CRSs = {
  simple: L.CRS.Simple,
  EPSG3395: L.CRS.EPSG3395,
  EPSG3857: L.CRS.EPSG3857,
  EPSG4326: L.CRS.EPSG4326,
  custom: L.CRS.Simple
}
export default class MapViewerView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('map-viewer');

    this._options = {
      map: {
        crs: 'simple',
        multilevel: false,
        levelControl: {
          position: 'bottomleft'
        }
      },
      builder: {
        controls: {
          layers: true
        },
        tooltip: {
          polygon: true,
          rectangle: true,
          circle: true,
          marker: true,
          circleMarker: true
        },
        popup: {
          polygon: true,
          rectangle: true,
          circle: true,
          marker: true,
          circleMarker: true
        }
      }
    }

    this.builder = L.mapBuilder(null, this._options.builder);
  }

  setMap(options) {
    if (this.builder) {
      this.builder.clear();
    }
    if (this.map) {
      this.map.remove();
    }
    let mapOpt = Object.assign({}, this._options.map);
    mapOpt = Object.assign(mapOpt, options);
    mapOpt.crs = CRSs[mapOpt.crs || 'EPSG3857'] || L.CRS.EPSG3857;
    const map = L.map(this.element, mapOpt);
    this.builder.setMap(map);
  }


  setConfiguration(configuration) {
    this.builder.setConfiguration(configuration);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Map viewer';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://map-view';
  }

}
