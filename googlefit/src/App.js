import React from 'react';
import './App.css';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { LineChart, Line, YAxis, ReferenceLine, LabelList, Tooltip, CartesianGrid, XAxis, Label, Legend } from 'recharts'
import Button from 'react-bootstrap/Button';

/**
 * @author Prem
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      startDate: "2020-11-18",
      endDate: Date.now(),
      dataset: "",
      total_data: "",
      value: "8/5",
      heart_rate_token: '',
      distance_token: '',
      calories_token: '',
      step_count_token: '',
      activity_token: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    var url = window.location.href;
    while(url.includes("access_token")) {
      setTimeout(this.onsubmit(), 1000)
      break;
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

  dataSource = async () => {
    await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources',{
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
      }
    }).then((resp) => {
      // console.log(resp.data["dataSource"])
      var array = resp.data["dataSource"]
      var heart_rate_token = ''
      var step_count_token = ''
      var distance_token = ''
      var calories_token = ''
      var activity_token = ''
      // var oxygen_saturation_token = ''
      if(array.length === 0) {
        alert("There is no data sources linked with this account")
      } else {
        for (var q = 0; q < array.length; q++) {
          try {
            if (array[q]["device"]["uid"] === "e3fc9470") {
              // console.log(array[q]["dataStreamId"])
              if (array[q]["dataStreamId"].includes("heart_rate")) {
                heart_rate_token = array[q]["dataStreamId"]
              }
              if (array[q]["dataStreamId"].includes("distance")) {
                distance_token = array[q]["dataStreamId"]
              }
              if (array[q]["dataStreamId"].includes("step_count")) {
                step_count_token = array[q]["dataStreamId"]
              }
              if (array[q]["dataStreamId"].includes("calories")) {
                calories_token = array[q]["dataStreamId"]
              }
              if (array[q]["dataStreamId"].includes("activity")) {
                activity_token = array[q]["dataStreamId"]
              }
            }
            console.log(heart_rate_token)
            console.log(step_count_token)
            console.log(distance_token)
            console.log(calories_token)
            console.log(activity_token)
            this.setState({
              heart_rate_token: heart_rate_token,
              step_count_token: step_count_token,
              distance_token: distance_token,
              calories_token: calories_token,
              activity_token: activity_token
            })
            // console.log(oxygen_saturation_token)
            // console.log(array[q]["device"]["uid"])
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  }

  onHeart = async () => {
    var myDate = new Date(this.state.startDate+"T00:00:00+0000");
    console.log(this.state.token)
    var result1 = myDate.getTime();
    var result2 = this.state.endDate
    await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/'+this.state.heart_rate_token+'/datasets/'+result1+'000000-'+result2+'000000',{
        headers: {
            'Authorization': 'Bearer ' + this.state.token,
        }
    }).then((resp) => {
      var array = resp.data["point"]
      if(array.length === 0) {
        alert("There is no heart data associated with this account")
      } else {
        var dA = [];
        var items = [];
        for (var q = 0; q < array.length; q++) {
          let time = array[q].startTimeNanos;
          let val = array[q]["value"][0]["fpVal"];
          var b = parseInt(time);
          var date = new Date(b / 1000000);
          let obj = {
            'date': date.toLocaleDateString().slice(0, -5),
            'time': date.toTimeString().slice(0,-34),
            'val': Math.floor(val),
          };
          dA.push(obj);
          items.push(date.toLocaleDateString().slice(0, -5));
        }
        this.setState({
          dataset:dA
        })
        console.log(dA)
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
        this.setState({
          total_data: str
        })
      }
    });
  }

  onsubmit = async () => {
    var url = window.location.href;
    var a = url.split("access_token="); 
    var access_token = a[1].split("&")[0];
    console.log(access_token)
    await this.setState({
      token: access_token
    })
    if (this.state.token === '') {
      return
    } else {
      // await this.onStep();
      await this.dataSource();
      await this.onHeart();
    }
    return
  }

  ondownload = async () => {
    FileDownload(this.state.total_data,'heart-rate.csv');
  }

  onselectionchange(dict) {
    var list = []
    for (var k in dict) {
      list.push(k)
    }
    return list
  }

  handleDataset = () => {
    var dataSet = [];
    var dA = this.state.dataset;
    var oldDate = dA[0]["date"];
    var dict = {};
    for (var i = 0; i < dA.length; i = i + 1) {
      if (i === 0) {
        let obj = { name: oldDate, time: dA[0]["time"], HR: dA[0]["val"] };
        dataSet.push(obj);
      } else {
        if (dA[i]["date"] === oldDate) {
          let obj = { name: "", time: dA[i]["time"], HR: dA[i]["val"] };
          dataSet.push(obj);
        } else {
          dict[oldDate] = dataSet;
          dataSet = [];
          oldDate = dA[i]["date"];
          let obj = { name: oldDate, time: dA[i]["time"], HR: dA[i]["val"] };
          dataSet.push(obj);
        }
      }
    }
    dict[oldDate] = dataSet;
    return dict;
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    if(this.state.dataset !== '') {
      var res = this.handleDataset()
      let data = this.onselectionchange(res)
      return (
        <div>
          <div className="App-select">
            <br></br>
          </div>
          <div className="App-select" style={{textAlign: "center"}}>
            <div className="createAccount">
              To download the csv file:
              {' '}
              <Button type="Submit" onClick = {this.ondownload} style={{backgroundColor: "orange"}}>download</Button>
            </div>
          </div>
          <div className="App-select">
            <br></br>
          </div>
          <div className="App-select" style={{textAlign: "center"}}>
            <form>
              <div style={{textAlign: "center", marginLeft: "45%", width:"10%", backgroundColor: "lightblue"}}>
                Select a date
                <select onChange={this.handleChange} placeholder="Select a date">
                  {data.map((x,y) => (
                    <option key={y}>{x}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="App-graph-header">
            <LineChart 
              width={1350}
              height = {500}
              data={res[this.state.value]}
              margin={{top: 5, right: 30, bottom: 5, left: 20}}
            >
              <XAxis dataKey="time">
                <Label value="hourly data" position="insideBottomRight" offset={-22}></Label>
              </XAxis>
              <YAxis type="number" label={{ value: 'number of beats', angle: -90, position: 'insideBottomLeft' }} domain={[25, 125]}/>
              <Tooltip />
              <ReferenceLine y={72} stroke="red" strokeDasharray="3 3" />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              <Line type="monotone" dataKey="HR" stroke="#008080">
                <LabelList dataKey="name" position="top" />
              </Line>
            </LineChart>
          </div>
        </div>
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
            href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3000&prompt=consent&response_type=token&client_id=636081071621-u85kar6sv7pmh9bavag43feu809cqr5i.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.activity.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.blood_glucose.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.blood_pressure.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.body.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.body_temperature.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.heart_rate.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.location.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.nutrition.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.oxygen_saturation.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.reproductive_health.read+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.sleep.read&access_type=online"
            >
            Login
          </a>
        </header>
      </div>
    );
  }
}

export default App;
