## Map viewer for Atom

#### an Atom package for visualizing [map.json](https://github.com/gherardovarando/map.schema.json) file.

##### it uses [leaflet](http://leafletjs.com/) and [leaflet-map-builder](https://www.npmjs.com/package/leaflet-map-builder).

### How to use
![map-viewer gui in action](images/myimage.gif){:height="50px"}

Open a valid map.json file and lunch the viewer with **Packages -> map-viewer -> open**.

The map will be updated every time the file is saved.

##### Changing the csr

If your map.json has a csr valid field the corresponding csr will be loaded. If then you change this value you need to manually close and reopen the map viewer to allow the changes to take place.


###### Example

Copy paste the following map.json in your editor and lunch the map-viewer.

```
{
  "type": "map",
  "layers": {
      "a": {
          "name": "OpenStreetMap",
          "type": "tileLayer",
          "url": "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "baseLayer": true,
          "options": {
              "tileSize": 256,
              "noWrap": true,
              "attribution": "©<a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
          }
      },
      "b": {
          "name": "Stamen Watercolor",
          "type": "imageOverlay",
          "url": "http://c.tile.stamen.com/watercolor/0/0/0.jpg",
          "bounds": [
              [
                  360,
                  180
              ],
              [
                  -360,
                  -180
              ]
          ],
          "options": {
              "attribution": "© stamen",
              "opacity": 0.4
          }
      },
      "karona": {
          "name": "korona.geog.uni-heidelberg",
          "type": "tileLayer",
          "url": "http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}",
          "baseLayer": true,
          "options": {
              "tileSize": 256,
              "maxZoom": 18,
              "noWrap": true
          }
      },
      "featgr": {
          "name": "some shapes",
          "type": "featureGroup",
          "layers": {
              "1": {
                  "type": "polygon",
                  "latlngs": [
                      [
                          34,
                          -10
                      ],
                      [
                          7,
                          9
                      ],
                      [
                          19,
                          -54
                      ],
                      [
                          78,
                          -90
                      ]
                  ],
                  "name": "polygon_3",
                  "options": {
                      "color": "#ed8414",
                      "fillColor": "#ed8414"
                  }
              },
              "2": {
                  "type": "polygon",
                  "latlngs": [
                      [
                          70,
                          123
                      ],
                      [
                          104,
                          115
                      ],
                      [
                          88,
                          140
                      ],
                      [
                          60,
                          110
                      ]
                  ],
                  "name": "polygon_4",
                  "tooltip": {
                    "content": "I am a permanent tooltip",
                    "options": {
                      "permanent": true
                    }
                  },
                  "options": {
                      "color": "#ed8414",
                      "fillColor": "#ed8414"
                  }
              },
              "circ": {
                  "name": "circle",
                  "type": "circle",
                  "latlng": [
                      0,
                      0
                  ],
                  "options": {
                      "radius": 200000
                  }
              },
              "circ2": {
                  "name": "circle",
                  "type": "circle",
                  "latlng": [
                      -20,
                      80
                  ],
                  "popup": "That's a circle!",
                  "options": {
                      "radius": 3000000
                  }
              }
          }
      }
  }
}
```

#### Known issues

- Some images are missing from the style so markers icons, and some other icons are not displayed.

### LICENSE

The MIT License (MIT)

Copyright (c) 2017 Gherardo Varando (gherardo.varando@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
