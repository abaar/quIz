import React from "react";
import "./KodeQuizContainer.css";
import FlexContainer from "../FlexContainer";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import Axios from "axios";

class KodeQuizContainer extends React.Component{
    render(){
        return (
            <div>
                <HeaderComponent fakeAuth={this.props.fakeAuth} onLogout={this.onLogoutHandler} />
                <FlexContainer>
                    <div className="col-md-4 col-sm-12 padding-5 side-padding-15 border-login">
                        <h1 style={{ marginBottom:"0px" }}>Kode Tes</h1>
                        <small>Untuk melanjutkan, silahkan mengisi kode tes</small>
                        <form action="halohalo" method="post" style={{ marginTop:"10px" }}>
                            <div className="form-group">
                            <label htmlFor="">Kode Tes</label>
                            <input type="number" className="form-control" name="username" placeholder="Masukkan Kode Tes"/>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary col-sm-12">Mulai Tes</button>
                            </div>
                        </form>
                    </div>
                </FlexContainer>
            </div>

        );
    }

    onLogoutHandler = ()=>{
        Axios.post(
            "/auth/logout",{},
            {withCredentials:true}
        ).then((res)=>{
            this.props.onAuth(false,null)
        }).catch(()=>{
            this.props.onAuth(false,null)
        })
    }
}

export default KodeQuizContainer;