import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import LoginContainer from "./container/LoginContainer/LoginContainer";
import KodeQuizContainer from "./container/KodeQuizContainer/KodeQuizContainer";
import PanduanContainer from "./container/PanduanContainer/PanduanContainer";
import QuizContainer from "./container/QuizContainer/QuizContainer";
import {setAccesstoken, getAccessToken} from "./auth.js";
import axios from "axios";

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      ujian     : {
        status  : -1,
        data    : null,
      },
      fakeAuth : {
        auth   : false,
        data   : {
          user  : null,
          // token : null,
        },
      }
    }
  }

  componentDidUpdate(){
  }

  render(){

    const loginComponent    = <LoginContainer onAuth={this.onAuthHandler} onTestStart={this.onTesInput} />;
    const loginRedirect     = <Redirect to={{pathname: '/'}} />;
    const kodeComponent     = <KodeQuizContainer onAuth={this.onAuthHandler} onTestStart={this.onTesInput}  fakeAuth={this.state.fakeAuth}/>;
    const kodeRedirect      = <Redirect to={{pathname: '/daftar-ujian'}}/>;
    const panduanComponent  = <PanduanContainer  onAuth={this.onAuthHandler}  fakeAuth={this.state.fakeAuth} details={this.state.ujian} startTest={this.startTest} ></PanduanContainer>
    const panduanRedirect   = <Redirect to={{ pathname: '/ujian/panduan' }}/>;
    const quizComponent     = <QuizContainer onAuth={this.onAuthHandler}  fakeAuth={this.state.fakeAuth} quiz={this.state.ujian}></QuizContainer>
    const quizRedirect      = <Redirect to={{ pathname: "/ujian/live" }}/>

    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              {
               (!this.state.fakeAuth.auth)?loginComponent:kodeRedirect
              }
            </Route>
            <Route exact path="/daftar-ujian">
              {
                (!this.state.fakeAuth.auth)?loginRedirect:((this.state.ujian.status === -1)?kodeComponent:panduanRedirect)
              }
            </Route>
            <Route exact path="/ujian/panduan">
              {
                (!this.state.fakeAuth.auth)?loginRedirect:((this.state.ujian.status === -1)?kodeRedirect:(this.state.ujian.status === 1)?quizRedirect:panduanComponent)
              }
            </Route>
            <Route exact path="/ujian/live">
              {
                (!this.state.fakeAuth.auth)?loginRedirect:((this.state.ujian.status === -1)?kodeRedirect:(this.state.ujian.status === 1)?quizComponent:panduanRedirect)
              }
            </Route>
          </Switch>
        </div>
      </Router>

    );
  }

  onAuthHandler = (status, data) =>{
    this.setState({
      fakeAuth:{
        auth  : status,
        data  : {
          user : data,
          // token : (data)?data.token:null,
        },
      }
    }) 

    setAccesstoken(data? data.token:"")
  }

  onTesInput = (statusx, data) => {
    this.setState({
      ujian : {
        status  : statusx,
        data    : data,
      },
    })
  }
  
  startTest = (status, details = null) =>{
    if(status === 1){
      this.setState({
        ujian : {
          status : 1,
          data : details
        }
      })
    }else{
      this.setState({
        ujian : {
          status : -1,
          data : details
        }
      })
    }
  }
}

export default App;
