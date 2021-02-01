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
            key:0,
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
                    label   : "Kelola Mata Pelajaran"
                },
                {
                    path    : "/admin/test/question",
                    label   : "Kelola Topik"
                },
                {
                    path    : "/admin/test/question",
                    label   : "Kelola Kompetensi Dasar"
                },
                {
                    path    : "/admin/test/question",
                    label   : "Kelola Kompetensi Khusus"
                },
                {
                    path    : "/admin/test/question",
                    label   : "Bank Soal"
                },
                {
                    path    : "/admin/test",
                    label   : "Kelola Ujian"
                },
                {
                    path    : "/admin/test/result",
                    label   : "Hasil Ujian"
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
                    <UserContainer key={this.state.key} remount={()=>{this.setState({key:this.state.key+1})}} navProvider={navigations}  redirectTo={this.redirectTo}  fakeAuth={this.props.fakeAuth} onAuth={this.props.onAuth} onActive={this.props.onActive} activeKey={this.props.activeKey} downloadCSV={this.downloadCSV} ></UserContainer>
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

    
    convertArrayOfObjectsToCSV = (array) => {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            
            ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    downloadCSV = (data) => {
        const link = document.createElement('a');
        let csv = this.convertArrayOfObjectsToCSV(data);
        if (csv == null) return;
      
        const filename = 'export.csv';
      
        if (!csv.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
        }
      
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }


    redirectTo = (to)=>{
        this.props.redirectTo(to)
    }

}

export default Admin