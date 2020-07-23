import React, { Component } from "react";
import "./info_panel.css";

export default class info_panel extends Component {
  state = {
    showInfoPanel: true,
    codes: [],
    selectedCode: "",
    confirmation: false,
    confirmationError: false,
  };

  componentDidMount() {
    this.grabCodeGeom();
  }

  togglePanel = () => {
    this.setState({ showInfoPanel: !this.state.showInfoPanel });
  };

  grabCodeGeom = () => {
    //   grab the member geom per code and add to state
    //   callback prop to pass to main.jsx and then main.jsx passes to map.jsx
    // this.setState({
    //   codes: this.props.codes,
    //   geom:
    // })
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
    if (this.state.confirmation) {
      // post API call here
    } else {
      this.setState({ confirmationError: true });
    }
  };

  render() {
    // console.log(this.state)
    return (
      <div id="info_panel_cont">
        <div
          className={
            this.state.showInfoPanel
              ? "info_panel_content show"
              : "info_panel_content hide"
          }
        >
          <div className='header-background'>
            <h1>MSAU Edit Tracking</h1>
          </div>
          <h2>Editable Codes</h2>
          <hr />
          {this.props.codes &&
            this.props.codes[0].codes.map((x) => {
              // console.log(x)
              return (
                <>
                  <p onClick={() => this.codeHandler(x)} className='code-text'>{x}</p>
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
