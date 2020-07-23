import React, { Component } from "react";
import Map from "../map/map";
import InfoPanel from "../infoPanel/info_panel";
import Modal from "../modal/modal";
import ConfirmationModal from "../confirmation_modal/confirmation_modal"

export default class main extends Component {
  state = {
    selectedCode: "",
    showModal: false,
    drawGeom: [],
    currentDrawItem: {},
    noCodeGeom: "",
    hasZoomed: false,
    zoomGeom: "",
    numberClickZoom: false,
    confirmationModal: false,
  };

  componentDidMount() {
    // call grabCodeGeom
    // console.log(this.props);
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props);
    return {
      codeData: props.geomData,
    };
  }

  grabCodeGeom = (code) => {
    if (this.props.geomData.length > 0) {
      // console.log(this.props.geomData)
      let foundCode = this.props.geomData.find(
        (element) => element.codes === code
      );
      // console.log(foundCode)
      this.setState({
        selectedCodeData: foundCode,
      });
    }
  };

  hasZoomed = () => {
    this.setState({ hasZoomed: false });
  };

  hasZoomedTrue = () => {
    this.setState({ hasZoomed: true });
  };

  hasZoomedNumberClick = () => {
    this.setState({ numberClickZoom: false });
  };

  hasZoomedNumberClickTrue = () => {
    this.setState({ numberClickZoom: true });
  };

  toggleModal = () => {
    if (this.state.showModal === true) {
      this.removeDrawnDataAfterModalCancel(this.state.currentDrawItem.id);
    }
    this.setState({ showModal: !this.state.showModal });
  };

  grabDrawData = (geom) => {
    //   popup modal
    //   grab data once drawn
    this.setState({
      drawGeom: [...this.state.drawGeom, geom],
      showModal: false,
    });
  };

  deleteDrawData = (id) => {
    //   popup modal
    //   grab data once drawn
    // console.log(id);
    const currentDrawGeom = this.state.drawGeom;
    const currentDrawGeomFilter = currentDrawGeom.filter((x) => x.id !== id);
    this.setState({ drawGeom: currentDrawGeomFilter });
  };

  removeDrawnDataWithoutCodeSelected = (id) => {
    // console.log(id);
    this.setState({ noCodeGeom: id });
  };

  removeDrawnDataAfterModalCancel = (id) => {
    this.setState({ noCodeGeom: id });
  };

  zoomToGeomNumberClick = (id) => {
    console.log(id);
    if (id.type === "Polygon") {
      let coordArr = [];
      id.coordinates[0].forEach((element) => {
        coordArr.push(element.join(" "));
      });
      let geomType = id.type;
      let geomCoords = coordArr.toString();
      let polyStr = `${geomType} ((${geomCoords}))`;
      this.setState({ zoomGeom: polyStr });
    } else if (id.type === "Point") {
      const str = `${id.type}(${id.coordinates[0]} ${id.coordinates[1]})`;
      this.setState({ zoomGeom: str });
    } else if (id.type === "LineString") {
      let coordArr = [];
      id.coordinates.forEach((element) => {
        coordArr.push(element.join(" "));
      });
      let geomType = id.type;
      let geomCoords = coordArr.toString();
      let lineStr = `${geomType} (${geomCoords})`;
      console.log(lineStr);
      this.setState({ zoomGeom: lineStr });
    }
  };

  selectedDrawItemHandler = (item) => {
    if (this.state.selectedCodeData === undefined) {
      alert("Please select a code to edit.");
      //   console.log(item.id);
      //   tconst currentDrawGeom = this.state.drawGeom;
      this.removeDrawnDataWithoutCodeSelected(item.id);
    } else {
      item.code = this.state.selectedCodeData.codes;
      //   console.log(item, this.state.selectedCode);
      this.toggleModal(item);
      this.setState({ currentDrawItem: item });
    }
  };

  handleConfirmationModal = () => {
    this.setState({ confirmationModal: !this.state.confirmationModal });
  };

  render() {
    // console.log(this.state);
    return (
      <div id="main_cont">
        <InfoPanel
          codeGeom={this.grabCodeGeom}
          codes={this.props.codes}
          drawGeom={this.state.drawGeom}
          hasZoomed={this.hasZoomed}
          zoomToGeomNumberClick={this.zoomToGeomNumberClick}
          hasZoomedNumberClick={this.hasZoomedNumberClick}
          handleConfirmationModal={this.handleConfirmationModal}
        />
        <Map
          codes={this.props.codes}
          selectedData={this.state.selectedCodeData}
          toggleModal={this.toggleModal}
          deleteDrawData={this.deleteDrawData}
          selectedDrawItemHandler={this.selectedDrawItemHandler}
          noCodeGeom={this.state.noCodeGeom}
          drawGeom={this.state.drawGeom}
          hasZoomedProp={this.state.hasZoomed}
          hasZoomedTrue={this.hasZoomedTrue}
          zoomGeom={this.state.zoomGeom}
          numberClickZoom={this.state.numberClickZoom}
          hasZoomedNumberClick={this.hasZoomedNumberClick}
          hasZoomedNumberClickTrue={this.hasZoomedNumberClickTrue}
        />
        {this.state.showModal ? (
          <Modal
            toggleModal={this.toggleModal}
            deleteDrawData={this.deleteDrawData}
            grabDrawData={this.grabDrawData}
            currentDrawItem={this.state.currentDrawItem}
            removeDrawnDataAfterModalCancel={
              this.removeDrawnDataAfterModalCancel
            }
          />
        ) : null}

        {this.state.confirmationModal ? (
          <ConfirmationModal
            handleConfirmationModal={this.handleConfirmationModal}
          />
        ) : null}
      </div>
    );
  }
}
