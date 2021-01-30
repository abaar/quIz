import React from "react"
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";


import HomeContainer from "./container/Admin/HomeContainer/HomeContainer";
import UserContainer from "./container/Admin/UserContainer/UserContainer";

class Admin extends React.Component{
    constructor(props){
        super(props)
        this.state ={

        }
    }


    render(){
        if(this.props.fakeAuth.auth === false || (this.props.fakeAuth.auth && this.props.fakeAuth.data.user.userlevel === 0)){
            return (<Redirect to={{ pathname:"/" }}/>)
        }

        return (
            <Switch>
                <Route exact path="/admin">
                    <HomeContainer redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth} ></HomeContainer>
                </Route>
                <Route exact path="/admin/user">
                    <UserContainer redirectTo={this.redirectTo}></UserContainer>
                </Route>
                {/* <Route exact path="/admin/test" component={Home}>
                </Route>
                <Route exact path="/admin/test/result" component={Home}>
                </Route>
                <Route exact path="/admin/test/question" component={Home}>
                </Route>
                <Route exact path="/admin/school" component={Home}>
                </Route>
                <Route exact path="/admin/school/class" component={Home}>
                </Route>
                <Route exact path="/admin/school/class/subclass" component={Home}>
                </Route> */}
            </Switch>
        )
    }


    redirectTo = (to)=>{
        this.props.redirectTo(to)
    }
    

}

export default Admin