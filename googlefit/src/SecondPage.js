import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import FileDownload from 'js-file-download';

class SecondPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.details.startDate,
            endDate: this.props.details.endDate,
            token: this.props.details.token,
            viewPage: this.props.details.viewPage,
        }
    }
    
    onHeart = async (e) => {
        e.preventDefault();
        var myDate = new Date(this.state.startDate+"T00:00:00+0000");
        var result1 = myDate.getTime();
        var myDate2 = new Date(this.state.endDate+"T00:00:00+0000");
        var result2 = myDate2.getTime();
        await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm/datasets/'+result1+'000000-'+result2+'000000',{
            headers: {
                'Authorization': 'Bearer '+this.state.token,
            }
        }).then((resp) => {
            var array = resp.data["point"]
            var str = 'date,time,value';
            if(array.length === 0) {
                alert("There is no data associated with this account")
            } else {
                for (var i = 0; i < array.length; i++) {
                    var line = '';
                    var x = array[i].startTimeNanos
                    var y = array[i].endTimeNanos
                    x = new Date(parseInt(x)/1000000).toLocaleString()
                    y = new Date(parseInt(y)/1000000).toLocaleString()
                    var res = array[i].value[0].fpVal
                    var data = [x,res];
                    for (i in data) {
                        if (line !== '') line += ','
                        line += data[i];
                    }
                    str += '\r\n' + line;
                }
                FileDownload(str, 'heart-rate.csv');
                alert("Please wait till the file get downloaded")
            }
        });
    }

    onStep = async (e) => {
        e.preventDefault();
        var myDate = new Date(this.state.startDate+"T00:00:00+0000");
        var result1 = myDate.getTime();
        var myDate2 = new Date(this.state.endDate+"T00:00:00+0000");
        var result2 = myDate2.getTime();
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
                alert("There is no data associated with this account")
            } else {
                for (var i = 0; i < array.length; i++) {
                    var line = '';
                    var x = array[i].startTimeMillis
                    var y = array[i].endTimeMillis
                    var res = array[i].dataset[0].point[0].value[0].intVal
                    x = new Date(parseInt(x)).toLocaleString()
                    y = new Date(parseInt(y)).toLocaleString()
                    var data = [x,y,res];
                    for (i in data) {
                        if (line !== '') line += ','
                        line += data[i];
                    }
                    str += '\r\n' + line;
                }
                FileDownload(str, 'steps.csv');
                alert("Please wait till the file get downloaded")
            }
        })
    }

    render() {
        return (
            <div>
                <div>
                    <h1 style={{textAlign: "center"}}>You can Download your Fit Bit Data Here</h1>
                </div>
                <div style={{textAlign: "center", backgroundColor: "lightblue"}}>
                    <div className="createAccount">
                        To see the step count download this csv file:
                        {' '}
                        <Button type="Submit" onClick = {this.onStep} style={{backgroundColor: "orange"}}>download</Button>
                    </div>
                    <br />
                    <div className="createAccount">
                        To see the heart rate download this csv file:
                        {' '}
                        <Button type="Submit" onClick = {this.onHeart} style={{backgroundColor: "orange"}}>download</Button>
                    </div>
                </div>
            </div>
        )
    }

}


export default SecondPage
