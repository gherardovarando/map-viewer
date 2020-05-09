'use babel';

import {
  CompositeDisposable,
  Disposable
} from 'atom';

require('leaflet');
require('leaflet-map-builder');
require('leaflet-multilevel');
require('leaflet-csvtiles');
require('./Leaflet.Editable');
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
    this.state = {
      draw: false
    }
    this.notifications = {}
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
        'map-viewer:levelDown': () => this.levelDown(),
        'map-viewer:polyline': () => this.drawPolyline(),
        'map-viewer:polygon': () => this.drawPolygon(),
        'map-viewer:circle': () => this.drawCircle()
      })
    );
    if (atom.config.get("map-viewer.layercontrol")) {
      this._options.builder.controls.layers = true
    }
    this.builder = L.mapBuilder(null, this._options.builder);
  }


  setConfiguration(configuration) {
    if (this.builder) {
      this.builder.clear();
    }
    if (this.map) {
      this.map.remove();
    }
    let mapOpt = Object.assign({}, this._options.map);
    mapOpt = Object.assign(mapOpt, {
      multilevel: configuration.multilevel || false,
      levelControl: {
        position: 'bottomleft'
      }
    });
    mapOpt.crs = CRSs[configuration.crs || 'EPSG3857'] || L.CRS.EPSG3857;
    mapOpt.editable = true;
    const map = L.map(this.element, mapOpt);
    this.map = map;
    let drawlayer = L.layerGroup();
    this.drawlayer = drawlayer;
    this.builder.setMap(map);
    this.configuration = configuration;
    this.builder.setConfiguration(configuration);
    this.map.addLayer(this.drawlayer);
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
    if (this.map && this.map.setLevel) {
      if (!this.map.getLevel()) this.map.setLevel(1)
      this.map.setLevel(this.map.getLevel() + 1)
    }

  }

  levelDown() {
    if (this.map && this.map.setLevel) {
      if (!this.map.getLevel()) this.map.setLevel(1)
      this.map.setLevel(this.map.getLevel() - 1)
    }
  }


  drawPolygon() {
    this.map.editTools.stopDrawing();
    let layer = this.map.editTools.startPolygon()
    layer.addTo(this.drawlayer);
    this.map.on("editable:drawing:end", () => {
      console.log("end");
      this.drawlayer.clearLayers();
    })
    this.map.on("editable:editing", () => {
      let latlngs = layer.getLatLngs()[0].map((x) => `[${x.lat}, ${x.lng}]`)
      let towrite = `{\n  "type":"polygon",\n  "latlngs": [${latlngs.join(',')}], \n  "options": {}\n}`
      atom.clipboard.write(towrite);
    })
  }

  drawCircle() {
    this.map.editTools.stopDrawing();
    let layer = this.map.editTools.startCircle()
    layer.addTo(this.drawlayer);
    this.map.on("editable:drawing:end", () => {
      console.log("end");
      this.drawlayer.clearLayers();
    })
    this.map.on("editable:editing", () => {
      let latlng = layer.getLatLng();
      let towrite = `{\n  "type":"circle",\n  "latlng": [${latlng.lat}, ${latlng.lng}], \n  "options": {"radius" : ${layer.getRadius()}}\n}`
      atom.clipboard.write(towrite);
    })
  }

  drawPolyline() {
    this.map.editTools.stopDrawing();
    let layer = this.map.editTools.startPolyline()
    layer.addTo(this.drawlayer);
    this.map.on("editable:drawing:end", () => {
      console.log("end");
      this.drawlayer.clearLayers();
    })
    this.map.on("editable:editing", () => {
      let latlngs = layer.getLatLngs().map((x) => `[${x.lat}, ${x.lng}]`)
      let towrite = `{\n  "type":"polyline",\n  "latlngs": [${latlngs.join(',')}], \n  "options": {}\n}`
      atom.clipboard.write(towrite);
    })
  }

}
