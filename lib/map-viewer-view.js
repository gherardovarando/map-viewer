'use babel';

require('leaflet');

export default class MapViewerView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('map-viewer');

    // Create message element
    const mapel = document.createElement('div');
    mapel.id = 'mapleaflet';
    mapel.style.height = '180px';
    this.element.appendChild(mapel);

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation.addedNodes);
      });
    });

    // configuration of the observer:
    var config = {
      childList: true
    };

    observer.observe(document, config);

    //const map = L.map('mapleaflet');

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
