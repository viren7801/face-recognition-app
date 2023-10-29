import React, { Component } from 'react';
import './App.css';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

// const requestOptionClarifai = (imageUrl) => {

//   const PAT = '75fbbda358094bfd81e6e2e4ec65b564';
//   const APP_ID = 'face-recognition-app'
//   const USER_ID = 'viren19'
//   // const MODEL_ID = 'face-detection'
//   const IMAGE_URL = imageUrl

//   const raw = JSON.stringify({
//     "user_app_id": {
//       "user_id": USER_ID,
//       "app_id": APP_ID
//     },
//     "inputs": [
//       {
//         "data": {
//           "image": {
//             "url": IMAGE_URL
//           }
//         }
//       }
//     ]
//   });

//   const requestOptions = {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Key ' + PAT
//     },
//     body: raw
//   };

//   return requestOptions

// }


class App extends Component {
  constructor() {
    super()
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    // this.setState({ imageUrl: this.state.input });
    // // app.models.predict('face-detection', this.state.input)
    // fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, requestOptionClarifai(this.state.input))
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log('hi', response)
    //     if (response) {
    //       fetch('http://localhost:3000/image', {
    //         method: 'put',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           id: this.state.user.id
    //         })
    //       })
    //         .then(response => response.json())
    //         .then(count => {
    //           this.setState(Object.assign(this.state.user, { entries: count }))
    //         })
    //         .catch(console.log)

    //     }
    //     this.displayFaceBox(this.calculateFaceLocation(response))
    //   })
    //   .catch(err => console.log(err));

    this.setState({imageUrl: this.state.input});
      fetch('https://smart-brain-api-9iz9.onrender.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://smart-brain-api-9iz9.onrender.com/image', {
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
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));





  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState) 
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route })
  }


  render() {
    return (
      <div className="App">
        <ParticlesBg type="fountain" bg={true}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )

        }
      </div>
    );
  }
}

export default App;
