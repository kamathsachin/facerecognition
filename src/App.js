import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "62f61165802140128aa8974abc0af6e9",
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imgUrl: "",
      box: {},
    };
  }

  calculateFaceArea = (data) => {
    const boundBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("FaceDetectImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: boundBox.left_col * width,
      topRow: boundBox.top_row * height,
      rightCol: width - boundBox.right_col * width,
      bottomRow: height - boundBox.bottom_row * height,
    };
  };

  detectFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  OnButtonSubmit = () => {
    this.setState({ imgUrl: this.state.input });

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => this.detectFaceBox(this.calculateFaceArea(response)))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Navigation />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          OnButtonSubmit={this.OnButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imgUrl} />
      </div>
    );
  }
}

export default App;
