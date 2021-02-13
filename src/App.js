import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Rank />
        <ImageLinkForm />
        <FaceRecognition />
      </div>
    );
  }
}

export default App;
