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
        console.log(this.state.startDate)
        console.log(this.state.endDate)
        console.log(this.state.token)
        console.log(this.state.viewPage)
        await axios.get('',{
            headers: {
                'Authorization': 'Bearer '+this.state.token,
            }
        }).then((resp) => {
            var str = 'data'
            FileDownload(str, 'heart-rate.csv');
        });
    }

    onStep = async (e) => {
        e.preventDefault();
        await axios.get('',{
            headers: {
                'Authorization': 'Bearer '+this.state.token,
            }
        }).then((resp) => {
            var str = 'data'
            FileDownload(str, 'steps.csv');
        });
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
