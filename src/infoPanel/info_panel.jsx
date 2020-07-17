import React, { Component } from "react";
import "./info_panel.css";

export default class info_panel extends Component {
  state = {
    showInfoPanel: true,
    codes: [],
    selectedCode: '',
  };

  componentDidMount() {
    this.grabCodeGeom()
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
  }

  codeHandler = (code) => {
    console.log(code)
    this.setState({
      selectedCode: code
    })
    this.props.codeGeom(code)
  }

  render() {
    // console.log(this.state)
    return (
      <div id='info_panel_cont'>
        <div
          className={
            this.state.showInfoPanel
              ? "info_panel_content show"
              : "info_panel_content hide"
          }
        >
          <h1>Info Panel</h1>
          <h2>codes</h2>
          {this.props.codes && this.props.codes[0].codes.map((x) => {
            console.log(x)
            return (
              <div>
                <p onClick={() => this.codeHandler(x)}>{x}</p>
                {this.props.drawGeom.filter((item) => {
                  console.log(item, 'filter')
                  return item.code === x
                }).map((item, index) => {
                  console.log(item, 'map')
                  return (<p className={item.operation}>{index + 1}</p>)
                })}
              </div>
            )
          })}
          <button>Submit</button>
        </div>
        <button
          onClick={this.togglePanel}
          className={
            this.state.showInfoPanel
              ? "info_panel_toggle open"
              : "info_panel_toggle close"
          }
        >
          {">"}
        </button>
      </div>
    );
  }
}
