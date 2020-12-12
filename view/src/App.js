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

import {setAccesstoken, getAccessToken} from "./auth.js";

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      soal     : {
        status  : false,
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

  render(){
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              {
               (!this.state.fakeAuth.auth)?<LoginContainer onAuth={this.onAuthHandler} />:<Redirect to={{pathname: '/kode-test'}} />
              }
            </Route>
            <Route exact path="/kode-test">
              {
                (!this.state.fakeAuth.auth)?<Redirect to={{pathname: '/'}} />:<KodeQuizContainer onAuth={this.onAuthHandler} onKodeInput={this.onTesInput}  fakeAuth={this.state.fakeAuth}/>
              }
            </Route>
            <Route exact path="/test">
              {
                (!this.state.fakeAuth.auth)?<Redirect to={{pathname: '/'}} />: (!this.state.soal.status)?<Redirect to={{pathname: '/kode-test'}} />:<PanduanContainer onAuth={this.onAuthHandler}/>
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

  onTesInput = (status, data) => {
    this.setState({
      soal : {
        status  : status,
        data    : data
      }
    })
  }
}

export default App;
