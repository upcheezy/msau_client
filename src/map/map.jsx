import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./map.css";
import config from "../config";
import * as turf from "@turf/turf";
const MapboxDraw = require("@mapbox/mapbox-gl-draw");
const MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");
const Parse = require("wellknown");

export default class map extends Component {
  state = {
    codeGeom: {},
    hasZoomed: false,
  };

  componentDidMount() {
    this.buildMap();
    // this.updateCodeGeom();
  }

  componentDidUpdate() {
    // console.log('inside did update')
    this.updateCodeGeom();
    if (this.props.zoomGeom) {
      // console.log("inside did update");
      // todo: zoom to this.props.zoomGeom using parse here
      if (this.props.numberClickZoom === false) {
        this.props.hasZoomedNumberClickTrue()
        let parseGeom = Parse(this.props.zoomGeom);
        // console.log(parseGeom);
        let parseBounds = turf.bbox(parseGeom);
        window.map.fitBounds(parseBounds, { padding: 20 });
      }
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    // console.log(props);
    // if (props.noCodeGeom) {
    //   console.log(this)
    // }
    if (props.selectedData) {
      return {
        codeGeom: Parse(props.selectedData.geom),
      };
    }
    // console.log(props);
  };

  updateCodeGeom = () => {
    if (this.props.selectedData) {
      // console.log('inside if')
      // this.setState({
      //   codeGeom: Parse(this.props.selectedData.geom),
      // });
      if (window.map.getLayer("membergeom")) {
        // console.log(this.props);
        window.map.getSource("membergeom").setData(this.state.codeGeom);
      } else {
        // console.log("inside else");
        window.map.addSource("membergeom", {
          type: "geojson",
          data: this.state.codeGeom,
          generateId: true,
        });

        window.map.addLayer({
          id: "membergeom",
          type: "fill",
          source: "membergeom",
          paint: {
            "fill-color": "fuchsia",
            "fill-opacity": 0.6,
          },
        });
      }

      // this.setState({hasZoomed: this.props.hasZoomed})
      // console.log(this.props);
      if (this.props.hasZoomedProp === false) {
        // this.setState({hasZoomed: true})
        this.props.hasZoomedTrue();
        let bounds = turf.bbox(this.state.codeGeom);
        window.map.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  buildMap = (id) => {
    // console.log(id);
    mapboxgl.accessToken = config.REACT_APP_MAPBOX_API_TOKEN;
    window.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-81.276855, 33.596319],
      zoom: 7,
    });

    // window.map.on('sourcedata', function() {
    //   console.log('A sourcedata event occurred.');
    //   });

    const address = new MapboxGeocoder({
      accessToken: config.REACT_APP_MAPBOX_API_TOKEN,
      mapboxgl: mapboxgl,
      countries: "us",
      bbox: [-83.726807, 31.784217, -78.013916, 35.415915],
    }).on("result", function ({ result }) {
      // fetchIntersect(result.geometry.coordinates, "point");
    });
    window.map.addControl(address);

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash:true
      }
    });
    window.map.addControl(draw, "bottom-right");

    window.map.on("draw.create", (ev) => {
      // console.log(ev)
      let drawnGeom = { ...ev.features[0].geometry, id: ev.features[0].id };
      this.props.selectedDrawItemHandler(drawnGeom);
      draw.delete(this.props.noCodeGeom);
    });

    window.map.on("draw.delete", (ev) => {
      // console.log(ev)
      this.props.deleteDrawData(ev.features[0].id);
    });
  };

  render() {
    // console.log(this.props)
    // console.log('rendered')
    return <div id="map"></div>;
  }
}
