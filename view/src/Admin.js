import React from "react"
import { act } from "react-dom/test-utils";
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

        let navigations = []
        if(this.props.fakeAuth.data.user.userlevel === 3){
            navigations = [
                {
                    path    : "/admin",
                    label   : "Dashboard"
                },
                {
                    path    : "/admin/user",
                    label   : "Kelola User"
                },
                {
                    path    : "/admin/test/question",
                    label   : "Bank Soal"
                },
                {
                    path    : "/admin/test",
                    label   : "Kelola Test"
                },
                {
                    path    : "/admin/test/result",
                    label   : "Hasil Test"
                },
                {
                    path    : "/admin/school",
                    label   : "Kelola Sekolah"
                },
                {
                    path    : "/admin/school/class",
                    label   : "Kelola Kelas"
                },
                {
                    path    : "/admin/school/class/subclass",
                    label   : "Kelola Subkelas"
                },
                
            ]
        }

        return (
            <Switch>
                <Route exact path="/admin">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth} onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
                <Route exact path="/admin/user">
                    <UserContainer navProvider={navigations}  redirectTo={this.redirectTo}  fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth} ></UserContainer>
                </Route>
                <Route exact path="/admin/test">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth}  onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
                <Route exact path="/admin/test/result">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth}  onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
                <Route exact path="/admin/test/question">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth}  onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
                <Route exact path="/admin/school">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth}  onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
                <Route exact path="/admin/school/class">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth}  onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
                <Route exact path="/admin/school/class/subclass">
                    <HomeContainer navProvider={navigations}  redirectTo={this.redirectTo} fakeAuth={this.props.fakeAuth}  onAuth={this.props.onAuth}  onActive={this.props.onActive} activeKey={this.props.activeKey}></HomeContainer>
                </Route>
            </Switch>
        )
    }


    redirectTo = (to)=>{
        this.props.redirectTo(to)
    }

}

export default Admin