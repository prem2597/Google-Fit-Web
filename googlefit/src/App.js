import React from 'react';
import Button from 'react-bootstrap/Button'
import './App.css';
import FirstPage from './FirstPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      viewPage: "initial"
    }
  }

  onsubmit = async (e) => {
    e.preventDefault();
    var url = window.location.href;
    var a = url.split("access_token="); 
    var access_token = a[1].split("&")[0];
    console.log(access_token); 
    await this.setState({
      token: access_token
    })
    if (this.state.token === '') {
      return
    }
    this.setState({
      viewPage:"First"
    })
  }

  render() {
    if (this.state.viewPage === "First") {
      return (
        <FirstPage details = {this.state}/>
      )
    }
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Click here to login to your Google account
          </p>
          <a
            className="App-link"
            href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://master.d2m969ldhi4wsh.amplifyapp.com/&prompt=consent&response_type=token&client_id=636081071621-u85kar6sv7pmh9bavag43feu809cqr5i.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.activity.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.blood_glucose.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.blood_pressure.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.body.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.body_temperature.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.location.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.nutrition.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.oxygen_saturation.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.reproductive_health.read&access_type=online"
          >
            Login
          </a>
          <div>
            <br />
            <Button type="Submit" onClick={this.onsubmit} style={{backgroundColor: "orange"}}>Continue</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
