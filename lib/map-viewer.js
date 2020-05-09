'use babel';

import MapViewerView from './map-viewer-view.js';
import {
  CompositeDisposable,
  Disposable
} from 'atom';

const schema = require(`${__dirname}/map.schema.json`);

var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
var validate = ajv.compile(schema);

//atom.grammars.loadGrammar(, callback)
export default {
  config : {
     layercontrol: {
       type : 'boolean',
       default: false
     }
  },

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri.startsWith('map-view://')) {
          return new MapViewerView(null, uri);
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'map-viewer:open': () => this.open(),
        'map-viewer:newmap': () => this.newmap()
      }),

      atom.commands.add('atom-text-editor', {
        'map-viewer:newtilelayer': () => this.newtilelayer(),
        'map-viewer:newmarker': () => this.newmarker(),
        'map-viewer:newpolygon': () => this.newpolygon(),
        'map-viewer:newpolyline': () => this.newpolyline(),
        'map-viewer:newgeojson': () => this.newgeojson()
      }),

      // Destroy any MapViewerViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof MapViewerView) {
            item.destroy();
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },


  open() {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      let uri = `map-view://${editor.id}`;
      let promise = atom.workspace.open(uri, {
        split: 'right'
      });
      promise.then((mvv) => {
        mvv.title = editor.getTitle();
        let conf = JSON.parse(editor.getText());
        if (validate(conf)) {
          mvv.setConfiguration(conf);
        } else {
          mvv.builder.clear()
          atom.notifications.addWarning('Not a valid map.json', {
            detail: `${validate.errors[0].message} in ${validate.errors[0].dataPath}`,
            buttons: [{
              text: 'Display anyway',
              onDidClick: () => {
                mvv.setConfiguration(conf);
              }
            }]
          });
        }
        mvv.toDispose.push(editor.onDidSave(() => {
          let c = JSON.parse(editor.getText());
          if (validate(c)) {
            mvv.setConfiguration(c);
          } else {
            mvv.builder.clear()
            atom.notifications.addWarning('Not a valid map.json', {
              detail: `${validate.errors[0].message} in ${validate.errors[0].dataPath}`
            });
          }
        }));

      });
    }
  },

  newmap() {
    let promise = atom.workspace.open();
    promise.then((editor) => {
      editor.setText('{\n  "type":"map",\n  "layers": [],\n  "crs": "EPSG3857",\n  "author": "unknown"\n}');
      this.open();
    })
  },

  newtilelayer() {
    const editor = atom.workspace.getActiveTextEditor();
    editor.insertText('{\n  "type":"tileLayer",\n  "url": "",\n  "options": {}\n}');
  },

  newmarker() {
    const editor = atom.workspace.getActiveTextEditor();
    editor.insertText('{\n  "type":"marker",\n  "latlng": { "lat": 0, "lng": 0}, \n  "options": {}\n}');
  },

  newpolygon() {
    const editor = atom.workspace.getActiveTextEditor();
    editor.insertText('{\n  "type":"polygon",\n  "latlngs": [], \n  "options": {}\n}');
  },

  newpolyline() {
    const editor = atom.workspace.getActiveTextEditor();
    editor.insertText('{\n  "type":"polyline",\n  "latlngs": [], \n  "options": {}\n}');
  },

  newgeojson() {
    const editor = atom.workspace.getActiveTextEditor();
    editor.insertText('{\n  "type":"GeoJSON",\n  "data": {}, \n  "options": {}\n}');
  }

};
