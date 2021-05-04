import React, { Component } from "react";
import "./info_panel.css";
import { FaInfoCircle } from "react-icons/fa";
import ReactTooltip from "react-tooltip";

export default class info_panel extends Component {
  state = {
    showInfoPanel: true,
    codes: [],
    selectedCode: "",
    confirmation: false,
    confirmationError: false,
    buffer: "",
    spinner: false,
  };

  togglePanel = () => {
    this.setState({ showInfoPanel: !this.state.showInfoPanel });
  };

  codeHandler = (code) => {
    // console.log(code)
    this.setState({
      selectedCode: code,
    });
    this.props.codeGeom(code);
    this.props.hasZoomed();
  };

  handleGeomZoom = (id) => {
    this.props.zoomToGeomNumberClick(id);
    this.props.hasZoomedNumberClick();
  };

  handleConfirmation = (ev) => {
    this.setState({ confirmation: ev.target.checked });
    // console.log(ev.target.checked)
  };

  handleConfirmationButtonClick = () => {
    if (this.state.confirmation && this.props.drawGeom.length >= 1) {
      // console.log("button click");
      this.props.handleSpinner()
      // console.log(this.state.buffer);
      let drawObj = {
        drawGeom: this.props.drawGeom,
        buffer: this.state.buffer,
      }
      this.props.drawGeom.forEach((geom, index) => {
        let converter = this.props.wktConverter(geom)
        drawObj.drawGeom[index].string = converter
      })
      fetch("https://msauserver.sc811.com//submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(drawObj),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.status);
          }
          // return res.json();
          // console.log(window.location.href)
          // localStorage.clear()
          window.location.reload(false)          
        })
        .catch((error) => this.setState({ error }));
    } else {
      this.setState({ confirmationError: true });
      alert('please make an edit before submitting')
    }
  };

  handleBuffer = (ev) => {
    // console.log(ev.target.value);
    this.setState({ buffer: ev.target.value });
  };

  // handleSpinner = () => {
  //   console.log('spinning')
  //   this.props.handleSpinner()
  //   // this.setState({spinner: !this.state.spinner})
  // }

  render() {
    // console.log(this.state)
    return (
      <div id="info_panel_cont">
        <div
          className={
            this.state.showInfoPanel
              ? "info_panel_content show"
              : "info_panel_content blurry"
          }
        >
          <div className="header-background">
            <h1>MSAU Edit Tracking</h1>
          </div>
          <h2>Editable Codes</h2>
          <hr />
          {this.props.codes && this.props.codes[0] &&
            this.props.codes[0].codes.map((x) => {
              // console.log(x)
              return (
                <>
                  <p onClick={() => this.codeHandler(x)} className="code-text">
                    {x}
                  </p>
                  {this.props.drawGeom
                    .filter((item) => {
                      // console.log(item, 'filter')
                      return item.code === x;
                    })
                    .map((item, index) => {
                      // console.log(item, "map");
                      return (
                        <p
                          className={item.operation}
                          onClick={() => this.handleGeomZoom(item)}
                        >
                          {index + 1}
                        </p>
                      );
                    })}
                </>
              );
            })}

          <hr className="low-hr" />

          <form className="buffer-form">
            <label htmlFor="buffer">Buffer Size (ft): </label>
            <input
              type="text"
              onChange={this.handleBuffer}
              className="input-text-buffer"
              placeholder="25"
            />
            <div>
              <div data-tip="Buffers are for points and lines. If you do not specify one, 25ft will be applied.">
                <ReactTooltip />
                <FaInfoCircle />
              </div>
            </div>
          </form>

          <div className="confirmation-area">
            <input
              type="checkbox"
              name="confirmation"
              value="confirmation"
              onChange={this.handleConfirmation}
            />
            <p>
              I accept the SC811 MSAU{" "}
              <span
                onClick={this.props.handleConfirmationModal}
                style={{ color: "blue", cursor: "pointer" }}
              >
                terms of service
              </span>
            </p>
          </div>

          <button
            onClick={this.handleConfirmationButtonClick}
            disabled={!this.state.confirmation}
            className="submit-button"
            // className={this.state.confirmation ? "submit-button-able" : "submit-button-disable"}
          >
            Submit Edits
          </button>
        </div>
        {/* <button
          onClick={this.togglePanel}
          className={
            this.state.showInfoPanel
              ? "info_panel_toggle open"
              : "info_panel_toggle close"
          }
        >
          {">"}
        </button> */}
      </div>
    );
  }
}
