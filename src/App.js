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
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  onLoadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

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
    console.log(this.state.user.id);

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.imgUrl)
      .then((response) => {
        if (response) {
          fetch("http://localhost:5000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.detectFaceBox(this.calculateFaceArea(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    debugger;
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
            <Rank
              userName={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              OnButtonSubmit={this.OnButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imgUrl} />
          </div>
        ) : route === "SignIn" ? (
          <SignIn
            onLoadUser={this.onLoadUser}
            onRouteChange={this.onRouteChange}
          />
        ) : (
          <Register
            onLoadUser={this.onLoadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
