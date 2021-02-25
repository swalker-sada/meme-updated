import React, { Component } from "react";
import Gallery from "./Gallery";
import TempGen from "./TempGen";
import utils from './utils/utils';
import {getMemes} from './utils/api';
import MemeLikesService from './utils/tutorial.service';
import TemplateNames from "./utils/templates.js";

export default class App extends Component {
  state = {
    images: [],
    memes: [],
    selected: null,
    selectedImg: [],
    memesLikes: [],
    moreLikedImages: [],
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
    const memeLikesInfo = this.state.memesLikes?.find(meme => meme?.memeId === this.state.selectedImg?.id)
    if (this.state.selected) {
      return <TempGen meme={this.state.selectedImg} memeInfo={memeLikesInfo} toggleSelected={this.toggleSelected} />;
    } else {
      return (
        <Gallery
        handleMoreLikes={this.chooseMoreLikeMemes}
          handleRandom={this.chooseRandom}
          images={this.state.images}
          handleclick={this.handleImgClick}
          memeLikesList={this.state.memesLikes}
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
    MemeLikesService.getAll().on("value", memes => {
      let memesLikes = [];

      memes.forEach(meme => {
        let key = meme.key;
        let { memeId, likes } = meme.val();
        memesLikes.push({ key, memeId, likes });
        this.setState({ memesLikes })
      });
    });

    /* fetch("https://api.imgflip.com/get_memes")
      .then((r) => r.json())
      .then((images) => {
        this.setState({ images: images.data.memes.filter((i) => i.box_count === 2) });
      });
       */

        var images = [];
        TemplateNames.map((n) => {
          return images.push ({
            id: n.id,
            name: n.id,
            //url: n.blank,
            url: "https://storage.cloud.google.com/sada-u/templates/"+ n.id + "/"  + n.imagefile,
            width: 1200,
            height: 1200,
            box_count: 2
          });
        });
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        images = images.filter((i) => i.box_count === 2);
        var offset = getRandomInt(images.length - 11);
        console.log('offset', offset);
        images = images.slice(offset, offset + 8);
        this.setState( { images: images});
        
   /*
    getMemes(sessionId)
      .then(data => {
            this.setState({ images: data.rows.filter((i) => i.box_count === 2) });
        });
   */
   
  }
  
}
