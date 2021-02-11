import React, { Component } from "react";
import Image from "./Image";
import "./ImageList.css"
import logo from './images/usa.png';

export default class Gallery extends Component {
  render() {
    return (
      <div>
        <div className="h1">MEME GENERATOR</div>
        <img className="icon" src={logo} alt="Logo" style={{position: 'absolute', top: 8, right: 15, width: '5%', height: 100}}/>

        <div>
          <button className="btn-gallery" onClick={() => this.props.handleRandom()}>Random Meme</button>
        </div>

        <div className="image-list">
          {this.props.images.map((image) => {
            return (
              <Image
                key={image.id}
                image={image}
                handleclick={this.props.handleclick}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
