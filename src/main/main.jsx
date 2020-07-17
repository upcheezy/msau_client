import React, { Component } from "react";
import Map from "../map/map";
import InfoPanel from "../infoPanel/info_panel";
import Modal from "../modal/modal";

export default class main extends Component {
  state = {
    selectedCode: "",
    showModal: false,
    drawGeom: [],
    currentDrawItem: {},
    noCodeGeom: ''
  };

  componentDidMount() {
    // call grabCodeGeom
    console.log(this.props);
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props);
    return {
      codeData: props.geomData,
    };
  }

  grabCodeGeom = (code) => {
    console.log(this.props);
    // do if check to make sure codeData has data length > 0
    // then do a this.state.codeData.find where the code it equal to the parmeter code
    // setState for selectedCodeData
    // pass state to map component so it can display the geom
    // console.log(typeof this.state.codeData)
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

  toggleModal = () => {
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
    console.log(id);
    const currentDrawGeom = this.state.drawGeom;
    const currentDrawGeomFilter = currentDrawGeom.filter((x) => x.id !== id);
    this.setState({ drawGeom: currentDrawGeomFilter });
  };

  removeDrawnDataWithoutCodeSelected = (id) => {
    console.log(id);
    this.setState({noCodeGeom: id})
  };

  removeDrawnDataAfterModalCancel = () => {
      console.log(this.state.currentDrawItem.id)
      this.setState({noCodeGeom: this.state.currentDrawItem.id})
  }

  selectedDrawItemHandler = (item) => {
    if (this.state.selectedCodeData === undefined) {
      alert("Please select a code to edit.");
      console.log(item.id);
      //   tconst currentDrawGeom = this.state.drawGeom;
      this.removeDrawnDataWithoutCodeSelected(item.id);
    } else {
      item.code = this.state.selectedCodeData.codes;
      console.log(item, this.state.selectedCode);
      this.removeDrawnDataAfterModalCancel();
      this.toggleModal();
      this.setState({ currentDrawItem: item });
    }
  };

  //   7/15 figure out how to delete on modal
  // get callback in main to info_panel set up on submit

  render() {
    console.log(this.state);
    return (
      <div id="main_cont">
        <InfoPanel
          codeGeom={this.grabCodeGeom}
          codes={this.props.codes}
          drawGeom={this.state.drawGeom}
        />
        <Map
          codes={this.props.codes}
          selectedData={this.state.selectedCodeData}
          toggleModal={this.toggleModal}
          deleteDrawData={this.deleteDrawData}
          selectedDrawItemHandler={this.selectedDrawItemHandler}
          noCodeGeom={
            this.state.noCodeGeom
          }
        />
        {this.state.showModal ? (
          <Modal
            toggleModal={this.toggleModal}
            deleteDrawData={this.deleteDrawData}
            grabDrawData={this.grabDrawData}
            currentDrawItem={this.state.currentDrawItem}
            removeDrawnDataAfterModalCancel={this.removeDrawnDataAfterModalCancel}
          />
        ) : null}
      </div>
    );
  }
}
