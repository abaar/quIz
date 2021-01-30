import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Admin from "./Admin.js"

import LoginContainer from "./container/LoginContainer/LoginContainer";
import KodeQuizContainer from "./container/KodeQuizContainer/KodeQuizContainer";
import PanduanContainer from "./container/PanduanContainer/PanduanContainer";
import QuizContainer from "./container/QuizContainer/QuizContainer";
import {setAccesstoken} from "./auth.js";

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
      },
      redirect : null,
      adminactive:null,
    }
  }

  componentDidUpdate(){
  }

  render(){

    if(this.state.redirect !== null){
      let to = this.state.redirect
      this.setState({
        redirect : null
      })
      return ( 
      <Router>
        <Redirect to={{ pathname: to }} />
      </Router>
      )
    }

    const loginComponent    = <LoginContainer onAuth={this.onAuthHandler} onTestStart={this.onTesInput} />;
    const loginRedirect     = <Redirect to={{pathname: '/'}} />;
    const kodeComponent     = <KodeQuizContainer onAuth={this.onAuthHandler} onTestStart={this.onTesInput}  fakeAuth={this.state.fakeAuth}/>;
    const kodeRedirect      = <Redirect to={{pathname: '/daftar-ujian'}}/>;
    const panduanComponent  = <PanduanContainer  onAuth={this.onAuthHandler}  fakeAuth={this.state.fakeAuth} details={this.state.ujian} startTest={this.startTest} ></PanduanContainer>
    const panduanRedirect   = <Redirect to={{ pathname: '/ujian/panduan' }}/>;
    const quizComponent     = <QuizContainer onAuth={this.onAuthHandler}  fakeAuth={this.state.fakeAuth} quiz={this.state.ujian}  startTest={this.startTest} ></QuizContainer>
    const quizRedirect      = <Redirect to={{ pathname: "/ujian/live" }}/>

    return (
      <Router>
        <div className="App">
          <Admin redirectTo={this.redirectTo} fakeAuth={this.state.fakeAuth}  onAuth={this.onAuthHandler} onActive={this.onAdminActive} activeKey={this.state.adminactive} ></Admin>
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

  redirectTo = (to)=>{
    this.setState({
      redirect : to
    })
  }

  onAuthHandler = (status, data) =>{
    if(status === true && data.userlevel > 0){
      this.setState({
        fakeAuth:{
          auth  : status,
          data  : {
            user : data,
          },
        }
      }, ()=>{
        this.setState({
          redirect:"/admin"
        })
      })
    }

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

  
  onAdminActive = (act) =>{
      this.setState({
          adminactive:act
      })
  }

}

export default App;
