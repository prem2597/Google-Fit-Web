import React from 'react';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import SecondPage from './SecondPage';

class FirstPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.details.token,
            startDate: "",
            endDate: "",
            viewPage: this.props.details.viewPage
        }
    }

    handleStartDate = (event) => {
        this.setState({
            startDate: event.target.value
        });
    }

    handleEndDate = (event) => {
        this.setState({
            endDate: event.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.startDate === '' || this.state.endDate === '') {
          return
        }
        this.setState({viewPage:"secondPage"})
      }

    render() {
        if(this.state.viewPage === "secondPage") {
            return (
                <SecondPage details = {this.state}/>
            )
        }
        return (
            <div>
                <div>
                    <h1 style={{textAlign: "center"}}>My Fit Bit Details</h1>
                </div>
                <div style={{backgroundColor: "lightblue", padding : 100, margin : 100, textAlign: "center"}}>
                    <form>
                        <div>
                            <h4>Enter the start date : </h4>
                            <InputGroup className='mb-3'>
                                <FormControl 
                                placeholder="YYYY-MM-DD"
                                aria-label="YYYY-MM-DD"
                                aria-describedby="basic-addon2"
                                onChange = {this.handleStartDate}
                                required
                                />
                            </InputGroup>
                        </div>
                        <div>
                            <h4>Enter the End date : </h4>
                            <InputGroup className='mb-3'>
                                <FormControl 
                                placeholder="YYYY-MM-DD"
                                aria-label="YYYY-MM-DD"
                                aria-describedby="basic-addon2"
                                onChange = {this.handleEndDate}
                                required
                                />
                            </InputGroup>
                        </div>
                        <div className="createAccount">
                        <br />
                        <Button type="Submit" onClick = {this.onSubmit} style={{backgroundColor: "orange"}}>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>           
        )
    }
    
}

export default FirstPage
