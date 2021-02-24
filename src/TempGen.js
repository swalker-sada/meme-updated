import React, { Component } from "react";
import "./styling/Generator.css";
import Image from "./Image2";
import "./styling/ImageList.css"
import * as svg from "save-svg-as-png";
import utils from './utils/utils';
import {saveMemes, getMemesSaved} from './utils/api';
import MemeLikesService from './utils/tutorial.service';



// {"authToken":"b53e5f7b-b696-4d3e-9f17-e18934278e32"}
//export ASTRA_AUTHORIZATION_TOKEN=b53e5f7b-b696-4d3e-9f17-e18934278e32
//export ASTRA_AUTHORIZATION_TOKEN=b53e5f7b-b696-4d3e-9f17-e18934278e32

//{"authToken":"f9f2be4b-4272-4955-ae3a-d963ab932e75"}

const initialState = {
    toptext: "",
    bottomtext: "",
    isTopDragging: false,
    isBottomDragging: false,
    topX: "50%",
    topY: "10%",
    bottomX: "50%",
    bottomY: "90%",
    saved_images: [],
    
};

class TempGen extends Component {
    constructor() {
        super();
        this.state = {
            ...initialState,
           
        };
    }

   

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
    };

    getStateObj = (e, type) => {
        let rect = this.imageRef.getBoundingClientRect();
        const xOffset = e.clientX - rect.left;
        const yOffset = e.clientY - rect.top;
        let stateObj = {};
        if (type === "bottom") {
            stateObj = {
                isBottomDragging: true,
                isTopDragging: false,
                bottomX: `${xOffset}px`,
                bottomY: `${yOffset}px`,
            };
        } else if (type === "top") {
            stateObj = {
                isTopDragging: true,
                isBottomDragging: false,
                topX: `${xOffset}px`,
                topY: `${yOffset}px`,
            };
        }
        return stateObj;
    };

    changeText = (event) => {
        this.setState({
            [event.currentTarget.id]: event.currentTarget.value,
        });
        let type = event.currentTarget.name
        this.resizeText(type)
    };

    handleMouseDown = (e, type) => {
        const stateObj = this.getStateObj(e, type);
        document.addEventListener("mousemove", (event) =>
            this.handleMouseMove(event, type)
        );
        this.setState({
            ...stateObj,
        });
    };

    handleMouseMove = (e, type) => {
        if (this.state.isTopDragging || this.state.isBottomDragging) {
            let stateObj = {};
            if (type === "bottom" && this.state.isBottomDragging) {
                stateObj = this.getStateObj(e, type);
            } else if (type === "top" && this.state.isTopDragging) {
                stateObj = this.getStateObj(e, type);
            }
            this.setState({
                ...stateObj,
            });
        }
    };

    handleMouseUp = (event) => {
        document.removeEventListener("mousemove", this.handleMouseMove);
        this.setState({
            isTopDragging: false,
            isBottomDragging: false,
        });
    };

    saveMeme = () => {

        let name = document.getElementById("memename").value
        name.length > 0 ?
            svg.saveSvgAsPng(document.getElementById("svg_ref"), `${name}.png`) :
            svg.saveSvgAsPng(document.getElementById("svg_ref"), "meme.png")
        
        svg.svgAsPngUri(document.getElementById("svg_ref")).then(image_source => {
            //console.log(image_source);
            const sessionId = this.getSessionId();
            const meme = this.props.meme;
            meme['sessionid'] = sessionId;
            meme['memename'] = document.getElementById("memename").value;
            meme['toptext'] = document.getElementById("toptext").value;
            meme['bottomtext'] = document.getElementById("bottomtext").value;
            meme['image_source'] = image_source;

            saveMemes(meme,sessionId)
              .then(data => {
                    //console.log(data);
                });

        });
        
    };

    resetBoxes = () => {
        this.setState({
            toptext: "",
            bottomtext: "",
            topX: "50%",
            topY: "10%",
            bottomX: "50%",
            bottomY: "90%"
        });
        document.getElementById("toptext").value = "";
        document.getElementById("bottomtext").value = "";
        document.getElementById("memename").value = "";
        document.getElementById("tiptoptext").style.fontSize = "50px"
        document.getElementById("bittybottomtext").style.fontSize = "50px"
    }

    resizeText = (type) => {
        let currentWidth = document.getElementById(type).textLength.baseVal.value
        let imageWidth = this.props.meme.width
        if (currentWidth > imageWidth) {
            document.getElementById(type).style.fontSize = `${(imageWidth / currentWidth) * 40}px`;
        }
    }

    componentDidMount() {
        const imageId = this.props.meme.id;
        //console.log(imageId);
        //const query = [];
        //    query['columnNames'] = ["image_source"];
        //    query['filters'] = [{"value":["161865971"],"columnName":"image_source","operator":"eq"}];
        // i had some issues building the object so I just ended up using the original test string
        const query = '{ "columnNames": ["uuid","id","name","image_source"], "filters": [{"value": ["' + imageId + '"],"columnName": "id","operator": "eq"}]}';
        getMemesSaved(query)
          .then(data => {
                this.setState({ saved_images: data.rows });
            });
    }

    memeLikeHandler = () => {
        const noOfLikes = this.props.memeInfo?.likes ? +this.props.memeInfo?.likes + 1 : 1
        if (!this.props.memeInfo) {
            const data = { memeId: this.props?.meme?.id, likes: noOfLikes }
            MemeLikesService.create(data)
                .then(() => {
                    this.setState({
                        submitted: true,
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            MemeLikesService.update(this.props.memeInfo?.key, { likes: noOfLikes })
                .then(() => {
                    this.setState({
                        updated: true,
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    render() {
        const image = this.props.meme;
        
        var wrh = image?.width / image?.height;
        var newWidth = 500;
        var newHeight = newWidth / wrh;

        const textStyle = {
            fontFamily: "Impact",
            fontSize: "50px",
            textTransform: "uppercase",
            fill: "#FFF",
            stroke: "#000",
            userSelect: "none"
        };

        return (
            <div>
                <div className="h1" onClick={() => this.props.toggleSelected()}>
                    MEME GENERATOR
                </div>
                <div className="main-content">
                    <div className="meme-gen-modal">
                        <svg
                            id="svg_ref"
                            ref={(el) => { this.svgRef = el; }}
                            height={newHeight}
                            width={newWidth}
                        >
                            <image
                                ref={(el) => {
                                    this.imageRef = el;
                                }}
                                xlinkHref={this.props.meme.url}
                                height={newHeight}
                                width={newWidth}
                            />

                            <text
                                id="tiptoptext"
                                style={{ ...textStyle, zIndex: this.state.isTopDragging ? 4 : 1 }}
                                x={this.state.topX}
                                y={this.state.topY}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                onMouseDown={(event) => this.handleMouseDown(event, "top")}
                                onMouseUp={(event) => this.handleMouseUp(event, "top")}
                            >
                                {this.state.toptext}
                            </text>

                            <text
                                id="bittybottomtext"
                                style={textStyle}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                x={this.state.bottomX}
                                y={this.state.bottomY}
                                onMouseDown={(event) => this.handleMouseDown(event, "bottom")}
                                onMouseUp={(event) => this.handleMouseUp(event, "bottom")}
                            >
                                {this.state.bottomtext}
                            </text>
                        </svg>
                        <div className="meme-form">
                            <input
                                className="form-control"
                                type="text"
                                name="tiptoptext"
                                id="toptext"
                                placeholder="Add text to the top"
                                onChange={this.changeText}
                            />

                            <input
                                className="form-control"
                                type="text"
                                name="bittybottomtext"
                                id="bottomtext"
                                placeholder="Add text to the bottom"
                                onChange={this.changeText}
                            />
                            <input
                                className="form-control"
                                type="text"
                                id="memename"
                                placeholder="Save meme as..."
                            />
                        </div>
                        <div className="buttons">{console.log(this.props)}
                            <button onClick={this.saveMeme} className="btn btn-primary">Download Meme</button>
                            <button onClick={this.resetBoxes} className="btn btn-primary">Reset</button>
                            <button onClick={() => this.props.toggleSelected()} className="btn btn-primary">Back to Gallery</button>
                            <button onClick={this.memeLikeHandler} className="btn btn-primary">
                                {`LIKE = ${this.props?.memeInfo?.likes ? this.props?.memeInfo?.likes : 0}`}
                            </button>
                             {/* <button className="btn-gallery" onClick={this.handleClick}>Like = {this.state.count}</button> */}

                        </div>

                    </div>
                </div>
                <div className="image-list">
                  {this.state.saved_images.map((image) => {
                    return (
                      <Image
                        key={image.uuid}
                        image={image}
                      />
                    );
                  })}
                </div>
            </div>
        );
    }
}

export default TempGen;
