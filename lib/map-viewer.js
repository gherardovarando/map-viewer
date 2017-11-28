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

export default {

  subscriptions: null,

  activate(state) {
    this.toDispose = []
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri.startsWith('map-view://')) {
          return new MapViewerView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'map-viewer:open': () => this.open(),
        'map-viewer:newmap': () => this.newmap()
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
    this.toDispose.forEach((d) => d.dispose())
  },


  open() {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      let promise = atom.workspace.open(`map-view://${editor.id}`, {
        split: 'right'
      });
      promise.then((mvv) => {
        let conf = JSON.parse(editor.getText());

        mvv.setMap({
          crs: conf.crs,
          multilevel: conf.multilevel
        });
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
        this.toDispose.push(editor.onDidSave(() => {
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
      })
    }
  },

  newmap() {
    let promise = atom.workspace.open();
    promise.then((editor) => {
      editor.setText('{"type":"map", "layers": [], "crs": "EPSG3857", "author": "unknown"}');
      this.open();
    })
  }

};
