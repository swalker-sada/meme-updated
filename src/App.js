import React, { Component } from "react";
import Gallery from "./Gallery";
import TempGen from "./TempGen";
import utils from './utils/utils';
import {getMemes} from './utils/api';

export default class App extends Component {
  state = {
    images: [],
    memes: [],
    selected: null,
    selectedImg: [],
  };

  handleImgClick = (e) => {
    this.setState({
      selectedImg: this.state.images.find(i => i.id === e.target.id),
    });
    this.toggleSelected()
  };

  chooseRandom = () => {
    this.setState({ selected: true, selectedImg: this.state.images[Math.floor(Math.random() * this.state.images.length)] })
  }

  toggleComponent = () => {
    if (this.state.selected) {
      return <TempGen meme={this.state.selectedImg} toggleSelected={this.toggleSelected} />;
    } else {
      return (
        <Gallery
          handleRandom={this.chooseRandom}
          images={this.state.images}
          handleclick={this.handleImgClick}
        />
      );
    }
  };

  getSessionId() {
    // Check if a session id query parameter exists
    const params = new URLSearchParams(window.location.search);
    if (params.get('session-id')) {
      return params.get('session-id');
    }

    // Check if a session id is stored to local storage
    if (utils.store('session-id')) {
      return utils.store('session-id');
    }

    // Otherwise, generate a new session id
    const sid = utils.uuid();
    utils.store('session-id', sid);
    return sid;
  }

  render() {
    
    return <div>
      {this.toggleComponent()}
    </div>;
  }

  toggleSelected = () => {
    this.setState({ selected: !this.state.selected })
  }

  componentDidMount() {
    const sessionId = this.getSessionId();
    getMemes(sessionId)
      .then(data => {
            this.setState({ images: data.rows.filter((i) => i.box_count === 2) });
        });
    //fetch("https://api.imgflip.com/get_memes")
    //  .then((r) => r.json())
    //  .then((images) => {
    //    console.log(images);
    //    this.setState({ images2: images.data.memes.filter((i) => i.box_count === 2) });
    //  });
  }
  
}
