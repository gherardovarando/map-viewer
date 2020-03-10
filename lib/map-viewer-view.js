'use babel';

import {
  CompositeDisposable,
  Disposable
} from 'atom';
require('leaflet');
require('leaflet-map-builder');
require('leaflet-multilevel');
require('leaflet-csvtiles');
window.Papa = require('papaparse');
L.Marker.prototype.options.icon = L.divIcon({
  className: 'icon icon-location text-info'
});
const id = 'map-leaflet';
const CRSs = {
  simple: L.CRS.Simple,
  EPSG3395: L.CRS.EPSG3395,
  EPSG3857: L.CRS.EPSG3857,
  EPSG4326: L.CRS.EPSG4326,
  custom: L.CRS.Simple
}
export default class MapViewerView {

  constructor(serializedState, uri) {
    // Create root element
    this.toDispose = [];
    this._uri = uri;
    this.title = '';
    this._id = uri.split('://')[1];
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
          layers: false
        },
        tooltip: {
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false,
          circleMarker: false
        },
        popup: {
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false,
          circleMarker: false
        }
      }
    }

    this.subscription = new CompositeDisposable(
      atom.commands.add('atom-workspace', {
        'map-viewer:levelUp': () => this.levelUp(),
        'map-viewer:levelDown': () => this.levelDown()
      })
    );

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
    this._crs = mapOpt.crs || 'EPSG3857';
    this._multilevel = options.multilevel || false;
    mapOpt.crs = CRSs[this._crs] || L.CRS.EPSG3857;
    mapOpt.editable = true;
    const map = L.map(this.element, mapOpt);
    this.map = map;
    this.builder.setMap(map);
  }


  setConfiguration(configuration) {
    if (!this.map) {
      //if there is no map create it
      this.setMap({
        crs: configuration.crs,
        multilevel: configuration.multilevel,
        levelControl: {
          position: 'bottomleft'
        }
      });
    } else if ((configuration.crs || 'EPSG3857') != this._crs || (configuration.multilevel || false) != this._multilevel) {
      // if the map has different crs or multilevel options re-create it
      this.setMap({
        crs: configuration.crs,
        multilevel: configuration.multilevel
      });
    }
    this.configuration = configuration
    this.builder.setConfiguration(configuration);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.toDispose.forEach((d) => d.dispose());
    this.subscription.dispose();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return `Map viewer ${this.title}`;
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return this._uri;
  }

  levelUp() {
    if (this.map && this.map.setLevel){
      if (!this.map.getLevel()) this.map.setLevel(1)
      this.map.setLevel(this.map.getLevel() + 1)
    }

  }

  levelDown() {
    if (this.map && this.map.setLevel){
      if (!this.map.getLevel()) this.map.setLevel(1)
      this.map.setLevel(this.map.getLevel() - 1)
    }
  }

}
