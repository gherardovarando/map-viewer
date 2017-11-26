'use babel';

require('leaflet');
require('leaflet-map-builder');
const djv = require('djv');
const env = djv({
    version: 'draft-04', // use json-schema draft-06
    formats: { /*...*/ }, // custom formats @see #addFormat
    errorHandler: () => { /*...*/ }, // custom error handler, @see #setErrorHandler
});
const fs = require('fs');
const mapSchema = JSON.parse(fs.readFileSync(`${__dirname}/schema.map.json`));
env.addSchema('map', mapSchema);
const id = 'map-leaflet'
const CRSs = {
    simple: L.CRS.Simple,
    EPSG3395: L.CRS.EPSG3395,
    EPSG3857: L.CRS.EPSG3857,
    EPSG4326: L.CRS.EPSG4326
}
export default class MapViewerView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('map-viewer');

        // Create message element
        const mapel = document.createElement('div');
        mapel.id = id;
        mapel.classList.add('map');


        const mapcont = document.createElement('div');
        mapcont.classList.add('map-cont');
        mapcont.appendChild(mapel);
        this.element.appendChild(mapcont);

        this._options = {
            map: {
                crs: 'simple'
            },
            builder: {
                controls: {
                    layers: true
                }
            }
        }
    }

    setMap(configuration) {
        if (env.validate('map', configuration)) {
            if (this.builder) this.builder.clear()
            return;
        }
        if (this.builder) {
            this.builder.setConfiguration(configuration)
        } else {
            let mapOpt = Object.assign({}, this._options.map);
            mapOpt.crs = CRSs[mapOpt.crs];
            const map = L.map(id, mapOpt);
            this.builder = L.mapBuilder(map, this._options.builder, configuration);
        }
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
