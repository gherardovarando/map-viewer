'use babel';

import MapViewerView from './map-viewer-view.js';
import {
  CompositeDisposable,
  Disposable
} from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://map-view') {
          return new MapViewerView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'map-viewer:toggle': () => this.toggle()
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

  toggle() {
    let promise  = atom.workspace.toggle('atom://map-view');
    console.log('Toggle it!')
  }

};
