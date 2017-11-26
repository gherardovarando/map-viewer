'use babel';

import MapViewerView from './map-viewer-view.js';
import {
    CompositeDisposable,
    Disposable
} from 'atom';

export default {

    subscriptions: null,

    activate(state) {
        this.toDispose = []
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
        this.toDispose.forEach((d) => d.dispose())
    },


    toggle() {
        const editor = atom.workspace.getActiveTextEditor()
        if (editor) {
            let promise = atom.workspace.open('atom://map-view', {
                split: 'right'
            });
            promise.then((mvv) => {
                mvv.setMap(editor.getText())
                this.toDispose.push(editor.onDidSave(() => {
                    mvv.setMap(editor.getText())
                }));
            })
        } else {
            let promise = atom.workspace.open('atom://map-view', {
                split: 'right'
            });
            promise.then((mvv) => {
                mvv.setMap()
            })
        }
    }

};
