import React from "react";
import "./PanduanContainer.css";
import FlexContainer from "../FlexContainer";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import axios from "axios";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swalinstance = withReactContent(Swal)

class PanduanContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loading : true,
            starting : false,
        }
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/quiz/test/questionCount",{
            params:{
                test_id : this.props.details.data.id
            },
        },
            {withCredentials:true}
        ).then((res)=>{
            if(res.data.status){
                this.setState({
                    loading:res.data.data
                })
            }
        }).catch((err)=>{
            swalinstance.fire({
                title : <p>Terjadi Kesalahan</p>,
                icon  : "error",
                text  : "Terjadi kesalahan, mohon hubungi proktor / penjaga ujian!",
                confirmButtonColor: '#d33',
            })
        })
    }


    render(){
        const adaptif = <span>                            
            <li>Jawablah dengan seksama, hanya bisa menjawab <strong>1 (satu)</strong> kali!</li>
            <li>Soal yang telah dijawab, <strong>tidak bisa</strong> diubah!</li>
            <li>Kerjakanlah soal dengan <strong>jujur dan mandiri!</strong></li>
            <li>Jumlah soal <strong>tidak menentu</strong> atau disesuaikan dengan kemampuan</li>
        </span>;

        const loading = <span className="fas fa-spinner spinning"></span>
        let diff = (this.props.details.data.time.start.getTime() - this.props.details.data.time.end.getTime()) / (1000 * 60)
        diff = Math.abs(Math.round(diff))

        const conventional = <span>
            <li>Jawablah dengan seksama dan <strong>jujur</strong> </li>
            <li>Jumlah pertanyaan adalah {this.state.loading === true? loading:this.state.loading} soal</li>
            <li>Waktu pengerjaan <strong>{diff}</strong> menit</li>
        </span>

        const startbutton = <button className="btn btn-primary" disabled={this.state.starting} onClick={this.onStartClicked}>
            {this.state.starting?<span>Sedang memulai {loading}</span> :'Mulai Kerjakan'}
        </button>

        const waitButton = <button className="btn btn-primary" disabled>{loading}</button>

        const disabledButton = <button className="btn btn-default disabled" disabled>Menunggu Soal</button>

        return (
            <div>
                <HeaderComponent fakeAuth={this.props.fakeAuth} onAuth={this.props.onAuth}  />
                <FlexContainer>
                    <div className="col-md-5 col-sm-12 padding-5 side-padding-15 border-login">
                        <h1 style={{ marginBottom:'0px', paddingBottom:'0px' }}>{this.props.details.data.title}</h1>
                        <br/>
                        <h3>Petunjuk Pengerjaan Soal</h3>
                        <ol>
                            {(this.props.details.data.type==="conventional")?conventional:adaptif}
                        </ol>
                        <p>{this.props.details.data.note}</p>
                        <br/>
                        <div className="row">
                            <div className="col-md-6">
                                <button className="btn btn-secondary" onClick={() => {this.props.startTest(-1)}}>Kembali</button>
                            </div>
                            <div className="col-md-6" style={{ textAlign:'right' }}>
                                { this.state.loading===true && this.props.details.data.type === "conventional"?waitButton:(this.state.loading !== true && this.state.loading=== 0 ? disabledButton:startbutton) }
                            </div>
                        </div>
                    </div>
                </FlexContainer>
            </div>

        );
    }

    onStartClicked = () =>{
        swalinstance.fire({
            title: <p>Apakah Anda yakin?</p>,
            icon:"warning",
            showCancelButton: true,
            confirmButtonText: `Mulai`,
            cancelButtonText: `Batal`,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !swalinstance.isLoading()
        }).then((res)=>{
            if(res.isConfirmed){
                this.setState({
                    starting:true
                })
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
                axios.post("/quiz/test/start",{
                    test_id : this.props.details.data.id
                },{withCredentials:true}).then((res)=>{
                    if(res.data.status){
                       this.props.startTest(1, res.data.data)
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
                        text  : "Terjadi kesalahan, mohon hubungi proktor / penjaga ujian!",
                        confirmButtonColor: '#d33',
                    })
                })
            }
        })
    }
}

export default PanduanContainer;