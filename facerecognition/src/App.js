import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Singin from './components/Signin/Signin';
import Register from './components/Register/Register';

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 1500
      }
    }
  }

}

const app = new Clarifai.App({apiKey: '049e3c05d4ab4c50a21028db0f1c0a51'});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joind: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joind: data.joind
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value })
  }
  
  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
    if (response) {
      fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route:route});
  }

  render (){
   const { isSignedIn, imgUrl, route, box } = this.state;
    return (
      <div className="App">
      <Particles className='particles'
              params={particlesOptions}      
       />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home'
      ? <div>
      <Logo/>
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={box} imgUrl={imgUrl}/>
      </div>
      : 
      ( route === 'signin'
      ?  <Singin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      :  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )

      
      }
      </div>
    );
  }
}
export default App;

//FACE_DETECT_MODEL
//049e3c05d4ab4c50a21028db0f1c0a51
//const app = new Clarifai.App({apiKey: '049e3c05d4ab4c50a21028db0f1c0a51'});
//TEST PIC URL - https://images.unsplash.com/photo-1568967729548-e3dbad3d37e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80