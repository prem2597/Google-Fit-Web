import React from 'react';
import Button from 'react-bootstrap/Button'
import './App.css';
import axios from 'axios';
import FileDownload from 'js-file-download';

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
      if(array.length === 0) {
        alert("There is no step data associated with this account")
      } else {
        var dA = [];
        var items = [];
        for (var q = 0; q < array.length; q++) {
          let time = array[q].startTimeNanos;
          let val = array[q]["value"][0]["fpVal"];
          var b = parseInt(time);
          var date = new Date(b / 1000000);
          let obj = {
            'date': date.toLocaleDateString(),
            'time': date.toTimeString(),
            'val': val,
          };
          dA.push(obj);
          items.push(date.toLocaleDateString());
        }
        var uniqueItems = Array.from(new Set(items));
        var str = "time," + uniqueItems.toString();
        var columns = str.split(",");
        var times = [];
        var totalData = [];
        for (var i = 0; i < dA.length; i++) {
          var line = new Array(columns.length);
          var index = 0;
          var isAv = 0;
          for (var j = 0; j < columns.length; j++) {
            if (dA[i]["date"] === columns[j]) {
              index = j;
            }
          }
          for (var r = 0; r < times.length; r++) {
            if (dA[i]["time"] === times[r]) {
              totalData[r][index] = dA[i]["val"];
              isAv = 1;
            }
          }
          if (isAv === 0) {
            for (var k = 0; k < line.length; k++) {
              if (k === 0) {
                line[k] = dA[i]["time"];
                times.push(dA[i]["time"]);
              } else if (k === index) {
                line[k] = dA[i]["val"];
              } else {
                line[k] = "--";
              }
            }
            totalData.push(line);
          }
        }
        str += "\r\n";
        for (var p = 0; p < totalData.length; p++) {
          str += totalData[p].toString() + "\r\n";
        }
        FileDownload(str,'steps.csv');
        alert("Please wait till the file get downloaded")
      }
    });
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
    } else {
      // await this.onStep();
      await this.onHeart();
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
