import React from "react";
import Moment from "react-moment";
import 'moment/locale/id';

import "./KodeQuizContainer.css";
import Container from "../Container";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import UpcomingQuizComponent from "../../component/UpcomingQuizComponent/UpcomingQuizComponent";
import Axios from "axios";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const swalinstance = withReactContent(Swal)


class KodeQuizContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            list : true,
            upcomingquiz: [],
            upcomingquizdata :[],
            loading:true,
        }

    }

    componentDidMount(){
        const datas = []
        Axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        Axios.get("/quiz/test",{
            params:{
                id:this.props.fakeAuth.data.user.id,
            }
        },{withCredentials:true}).then((res)=>{
            if(res.data.status){
                for(let i = 0 ; i < res.data.data.length; ++i){
                    let {
                        id, code, type, title, start, end, description, date, takers
                    } = res.data.data[i]

                    let date_str, startdate, enddate, curdate, opentest;
                    if(date !== null){
                        date_str  = <span> {start.substr(0,start.length-3)} - {end.substr(0,end.length-3)} WIB | <Moment locale="id" format="dddd, DD MMMM YYYY">{date}</Moment></span> 
                        date      = new Date(date)
                        
                        let day       = date.getDate()
                        if(day<10){
                            day   = "0"+day
                        }
                        let month     = date.getMonth()+1
                        if(month<10){
                            month = "0"+month
                        }
                        let year      = date.getFullYear()
                        date          = year+"-"+month+"-"+day;

                        startdate = new Date(`${date} ${start}`)
                        enddate   = new Date(`${date} ${end}`)
                        curdate   = new Date()
                        opentest  = (startdate <= curdate && curdate <= enddate)
                    }else{
                        date_str  = "Tidak dibatasi waktu"
                        opentest  = 1;
                    }
                    datas.push({
                        id      :id,
                        type    : (type === 0)? "conventional":"adaptive",
                        kode    : code,
                        title   : title,
                        date    : date_str,
                        note    : description,
                        open    : opentest,
                        time    : {
                            start : startdate,
                            end   : enddate 
                        },
                        cont    : (takers.length && takers[0].start !== null && takers[0].end  == null),
                        taken   : (takers.length && takers[0].end !== null),
                        score   : (takers.length)? takers[0].score:0
                    })
                }
                
        
                this.setState({
                    upcomingquizdata : datas,
                    upcomingquiz : datas,
                    loading:false,
                });
            }else{
                swalinstance.fire({
                    title : <p>Terjadi Kesalahan</p>,
                    icon  : "error",
                    text  : "Terjadi kesalahan, mohon hubungi proktor / pengawas ujian!",
                    confirmButtonColor: '#d33',
                })
            }
        }).catch((err)=>{
            swalinstance.fire({
                title : <p>Terjadi Kesalahan</p>,
                icon  : "error",
                text  : "Terjadi kesalahan, mohon hubungi proktor / pengawas ujian!",
                confirmButtonColor: '#d33',
            })
        })
    }

    searchUjian = (event) => {
        let value = event.target.value.toLowerCase();
        let components = [];

        for (let i =0 ; i < this.state.upcomingquizdata.length ; ++i){
            let {kode, title} = this.state.upcomingquizdata[i]

            if(kode.toLowerCase().includes(value) || title.toLowerCase().includes(value)){
                components.push(this.state.upcomingquizdata[i])
            }
        }

        this.setState({
            upcomingquiz : components,
        });        
    }

    render(){
        let components = [];

        for (let i =0 ; i < this.state.upcomingquiz.length ; ++i){
            components.push(<UpcomingQuizComponent key={this.state.upcomingquiz[i].id} onContinueHandler={this.continueUjian} onStartHandler={this.startUjian} details={this.state.upcomingquiz[i]} starting={false}></UpcomingQuizComponent>)
        }

        const list =  <div className="col-sm-12 col-md-12">
                            <input type="text" className="search-input" placeholder="Cari Kode / Mata Pelajaran" onChange={this.searchUjian}/>
                            <br/>
                            {components.length === 0? (this.state.loading? <UpcomingQuizComponent loading={true}></UpcomingQuizComponent> :<UpcomingQuizComponent empty={true}></UpcomingQuizComponent>):components }
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

    startUjian = (id, details) =>{
        this.props.onTestStart(0,details)
    }

    continueUjian = (id, details) =>{
        Axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        Axios.post("/quiz/test/continue",{
            test_id : details.id
        },{withCredentials:true}).then((res)=>{
            if(res.data.status){
                if(res.data.data.questions.length){
                    this.props.onTestStart(1, res.data.data)
                }else{
                    const data = this.state.upcomingquizdata

                    this.setState({
                        upcomingquiz:[]
                    },()=>{
                        this.setState({
                            upcomingquiz : data
                        })
                    })

                    swalinstance.fire({
                        title : <p>Gagal</p>,
                        icon  : "error",
                        text  : "Ujian ini belum soalnya, mohon hubungi proktor / pengawas ujian!",
                        confirmButtonColor: '#d33',
                    })
                }
            }else{
                swalinstance.fire({
                    title : <p>Terjadi Kesalahan</p>,
                    icon  : "error",
                    text  : res.data.message,
                    confirmButtonColor: '#d33',
                })
            }
        }).catch((err)=>{
            swalinstance.fire({
                title : <p>Terjadi Kesalahan</p>,
                icon  : "error",
                text  : "Terjadi kesalahan, mohon hubungi proktor / pengawas ujian!",
                confirmButtonColor: '#d33',
            })
        })
    }
}

export default KodeQuizContainer;