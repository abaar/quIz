import React from "react";
import "./KodeQuizContainer.css";
import Container from "../Container";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import UpcomingQuizComponent from "../../component/UpcomingQuizComponent/UpcomingQuizComponent";
import Axios from "axios";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";

class KodeQuizContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            list : true,
        }
    }

    componentDidMount(){
        
        const datas = [
            {
                id    : "1",
                type  : "conventionalx",
                kode  : "A2X2K",
                title : "Matematika",
                date  : "10.00 - 12.00 WIB | Selasa, 26 Januari 2021",
                note  : "Materi Pecahan dan Perkalian",
            },
            {
                id    : "2",
                type  : "conventional",
                kode  : "A2X2J",
                title : "Matematika",
                date  : "12.30 - 15.00 WIB | Selasa, 26 Januari 2021",
                note  : "Materi Bilangan Bulat",
            }
        ];

        let components = [];

        for (let i =0 ; i < datas.length ; ++i){
            components.push(<UpcomingQuizComponent key={datas[i].id} onStartHandler={this.startUjian} details={datas[i]}></UpcomingQuizComponent>)
        }

        this.setState({
            upcomingquizdata : datas,
            upcomingquiz : components,
        });
    }

    searchUjian = (event) => {
        let value = event.target.value.toLowerCase();
        let components = [];

        for (let i =0 ; i < this.state.upcomingquizdata.length ; ++i){
            let {kode, title, date} = this.state.upcomingquizdata[i]

            if(kode.toLowerCase().includes(value) || title.toLowerCase().includes(value) || date.toLowerCase().includes(value,16)){
                components.push(<UpcomingQuizComponent key={i}  details={this.state.upcomingquizdata[i]}></UpcomingQuizComponent>)
            }
        }

        this.setState({
            upcomingquiz : components,
        });
    }

    render(){

        const list =  <div className="col-sm-12 col-md-12">
                            <input type="text" className="search-input" placeholder="Cari Kode / Mata Pelajaran / Hari" onChange={this.searchUjian}/>
                            <br/>
                            {this.state.upcomingquiz}
                        </div>
                    ;

        const kode =  <div className="col-md-4 col-sm-12 padding-5 side-padding-15 border-login">
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
                    ;
        
        return (
            <div  >
                <HeaderComponent fakeAuth={this.props.fakeAuth} onLogout={this.onLogoutHandler} />
                <Container>
                    <div style={{ width:"100%" }}>
                        <div className="col-sm-12">
                            <div className="tabs">
                                <div className="flex-50">
                                   <p className={(this.state.list?'active':'')} onClick={()=>this.setState({list:true})}>
                                        Ujian yang akan datang
                                   </p>
                                </div>
                                <div className="flex-50" onClick={()=>this.setState({list:false})}>
                                    <p className={(this.state.list?'':'active')} >
                                        Kode Kuis
                                    </p>
                                </div>
                            </div>
                        </div>
                    {
                        (this.state.list)? list: <div style={{ display:'flex',justifyContent: 'center',alignItems: 'center' }}>{kode}</div> 
                    }
                    </div>
                </Container>
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

    startUjian = (id, kode) =>{
        // fetch data dulu baru start
        this.props.onTestStart(0,[])
    }
}

export default KodeQuizContainer;