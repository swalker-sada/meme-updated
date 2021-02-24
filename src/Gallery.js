import React, { Component } from "react";
import Image from "./Image";
import "./ImageList.css";
import logo from './images/gcp.png';


export default class Gallery extends Component {

  state = {
    showMemesWithHighLikes: false,  
  }
  

  getMemesWithHigherLikes = () => {
    let memesWithLikes = [];
    const { memeLikesList, images} = this.props;
    
    for (let i = 0; i < memeLikesList.length; i++) {
      if (memeLikesList[i].likes >= 10) {
        for (let j = 0; j < images?.length; j++) {
          if (images[j].id === memeLikesList[i].memeId) {
            memesWithLikes.push(images[j]);
          }
        }
      }
    }
    return memesWithLikes;
  }

  render() {
    const memesList = !this.state?.showMemesWithHighLikes ? this.props.images : this.getMemesWithHigherLikes();
    return (
      <div>
        <div className="h1">
          MEME GENERATOR 
           </div>
           <img className="icon" src={logo} alt="Logo" style={{position: 'absolute', top: 10, right: 15, width: '7%', height: 100}}/>

       

        <div>
          <button className="btn-gallery" onClick={() => this.props.handleRandom()}>Gimme a Random Meme</button>
          <button
            className="btn-gallery"
            style={{ marginLeft: '1rem' }}
            onClick={() => this.setState({ showMemesWithHighLikes: !this.state?.showMemesWithHighLikes })}
          >
            {!this.state?.showMemesWithHighLikes ? 'Top Liked Memes' : 'Show All Memes'}
            
          </button>
         
          
        
        </div>

        <div className="image-list">
          
          {memesList?.map((image) => {
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
