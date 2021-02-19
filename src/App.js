import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
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
      route: "SignIn",
      isSignedIn: false,
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

  onRouteChange = (route) => {
    if (route === "SignOut") {
      this.setState({ isSignedIn: false });
    } else if (route === "Home") {
      this.setState({ isSignedIn: true });
    }

    this.setState({ route: route });
  };

  render() {
    const { route, box, imgUrl, isSignedIn } = this.state;

    return (
      <div className="App">
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "Home" ? (
          <div>
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              OnButtonSubmit={this.OnButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imgUrl} />
          </div>
        ) : route === "SignIn" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
