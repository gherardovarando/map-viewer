## Map viewer for Atom

#### an Atom package for visualizing and editing [map.json](https://github.com/gherardovarando/map.schema.json) files.

##### it uses [leaflet](http://leafletjs.com/) and [leaflet-map-builder](https://www.npmjs.com/package/leaflet-map-builder).

### How to use

- Open a valid map.json file and lunch the viewer with **Packages -> Map Viewer -> Open** or with `ctrl-alt-m`.

- Create an empty map.json with **Packages -> Map Viewer -> New -> Map** and manually add layers.

- The map will be updated every time the file is saved.

- Switch on/off layer control in package setting.

#### Adding layers

Some layer templates can be loaded from the context menu (right-click) on the editor or via keybindings: `ctrl-alt-n` followed by `m` (marker), `p` (polygon), `l` (polyline), `t` (tile layer), `g` (GeoJSON).

Similarly, you can activate drawing capabilities via `ctrl-alt-v` followed by `p` (polygon), `l` (polyline), .... Once drawing is done the skeleton of the layer configuration is available in the clipboard, just paste the text in the configuration file and save it to reload the map.

#### Minimal example

Copy paste the following map.json in your editor and lunch the map-viewer (e.g. with `ctrl-alt-m`).

```
{
  "type": "map",
  "layers": [{
      "name": "OpenStreetMap",
      "type": "tileLayer",
      "author": "OpenStreetMap",
      "url": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "options": {
        "attribution": "© OpenStreetMap contributors",
        "minZoom": 15,
        "maxZoom": 20
      }
    },
    {
      "type": "circleMarker",
      "latlng": [43.776, 11.2475],
      "options": {
        "radius": 5,
        "fillColor": null,
        "color": "red"
      },
      "popup": "This is the main train station in Florence",
      "tooltip": "SMN train station"
    }
  ],
  "center": [43.77, 11.25],
  "zoom": 15,
  "author": "Gherardo Varando"
}
```

Check more map examples in the [examples.map.json](https://github.com/gherardovarando/examples.map.json) repository.


### LICENSE

The MIT License (MIT)

Copyright (c) 2020 Gherardo Varando (gherardo.varando@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
