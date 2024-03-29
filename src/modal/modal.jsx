import React, { Component } from "react";
import "./modal.css";
import { FaWindowClose } from 'react-icons/fa'

export default class modal extends Component {
  clickHandler = (operator) => {
    // console.log(this.props);
    let item = this.props.currentDrawItem;
    item.operation = operator;
    this.props.grabDrawData(item);
  };

  cancelHandler = () => {
    // console.log(this.props);
    this.props.removeDrawnDataAfterModalCancel();
    this.props.toggleModal();
  };

  render() {
    return (
      <div className="modal-cont">
        {/* <p onClick={() => this.cancelHandler()} className="modal-cancel">
          
        </p> */}
        <div className="modal-content">
        <FaWindowClose className='x-button' onClick={() => this.cancelHandler()}/>
          <p>Is this an addition or subtraction?</p>
          <div className="button-container">
            <button
              className="modal-button addition"
              onClick={() => this.clickHandler("addition")}
            >
              Addition
            </button>
            <button
              className="modal-button subtraction"
              onClick={() => this.clickHandler("subtraction")}
            >
              Subtraction
            </button>
          </div>
        </div>
      </div>
    );
  }
}
