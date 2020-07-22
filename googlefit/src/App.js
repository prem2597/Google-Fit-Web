import React from 'react';
import Button from 'react-bootstrap/Button'
import './App.css';
import axios from 'axios';
import FileDownload from 'js-file-download';
// import data from './config'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      startDate: "2020-07-05",
      endDate: Date.now()
    }
  }

  onStep = async () => {
    var myDate = new Date(this.state.startDate+"T00:00:00+0000");
    var result1 = myDate.getTime();
    var result2 = this.state.endDate
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.state.token,
        },
        body: JSON.stringify({
            "aggregateBy": [{
              "dataTypeName": "com.google.step_count.delta",
              "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": result1,
            "endTimeMillis": result2
        })
    };
    fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', requestOptions)
    .then(response => response.json())
    .then((responseText) => {
        var array = responseText["bucket"]
        var str = 'start-date,time,end-date,time,value';
        if(array.length === 0) {
            alert("There is no step data associated with this account")
        } else {
            for (var i = 0; i < array.length; i++) {
                console.log("i",i)
                var line = '';
                var x = array[i].startTimeMillis
                var y = array[i].endTimeMillis
                var res = array[i].dataset[0].point[0].value[0].intVal
                x = new Date(parseInt(x)).toLocaleString()
                y = new Date(parseInt(y)).toLocaleString()
                var data = [x,y,res];
                for (var j in data) {
                    if (line !== '') line += ','
                    line += data[j];
                }
                str += '\r\n' + line;
            }
            FileDownload(str,'steps.csv');
            alert("Please wait till the file get downloaded")
        }
    })
  }

  onHeart = async () => {
    var myDate = new Date(this.state.startDate+"T00:00:00+0000");
    var result1 = myDate.getTime();
    var result2 = this.state.endDate
    await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm/datasets/'+result1+'000000-'+result2+'000000',{
        headers: {
            'Authorization': 'Bearer '+this.state.token,
        }
    }).then((resp) => {
        var array = resp.data["point"]
        var str = 'date,time,value';
        if(array.length === 0) {
            alert("There is no heart data associated with this account")
        } else {
          for (var i = 0; i < array.length; i++) {
              var line = '';
              var x = array[i].startTimeNanos
              var y = array[i].endTimeNanos
              x = new Date(parseInt(x)/1000000).toLocaleString()
              y = new Date(parseInt(y)/1000000).toLocaleString()
              var res = array[i].value[0].fpVal
              var data = [x,res];
              for (var j in data) {
                  if (line !== '') line += ','
                  line += data[j];
              }
              str += '\r\n' + line;
          }
          FileDownload(str, 'heart-rate.csv');
          alert("Please wait till the file get downloaded")
        }
    });
  }

  // ontest = () => {
  //   var resp = data
  //   var array = resp.data["point"]
  //   var title_array = [" "]
  //   console.log(array)
  //   var time_array = []
  //   for (var i = 0; i < array.length; i++) {
  //     var x = array[i].startTimeNanos
  //     x = new Date(parseInt(x)/1000000).toLocaleString()
  //     var res = array[i].value[0].fpVal
  //     const answer_array = x.split(',');
  //     console.log(answer_array)
  //     if (title_array[title_array.length-1] === answer_array[0]) {
  //       var exg = 1
  //     } else {
  //       title_array.push(answer_array[0])
  //       var exg = 0
  //     }
  //     if (exg === 0) {

  //     }
  //   }
  //   console.log(title_array[title_array.length-1])
  // }

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
    } else {
      await this.onStep();
      await this.onHeart();
      // await this.ontest();
    }
  }

  render() {
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
            <Button type="Submit" onClick={this.onsubmit} style={{backgroundColor: "orange"}}>Download the data</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
