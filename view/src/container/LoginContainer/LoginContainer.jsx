import React from 'react';
import "./LoginContainer.css"
import LoginComponent from "../../component/LoginComponent/LoginComponent"
import NotificationComponent from "../../component/NotificationComponent/NotificationComponent"
import FlexContainer from "../FlexContainer";
import axios from 'axios';

class LoginContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            username : null,
            password : null,
            loading  : true,
            failed   : {
                status : false,
                message : null,
            },
            notif   : {
                status : false,
                type  : null,
                message : null,
            }
        }
    }
    
    componentDidMount(){
        axios.post("/auth/refresh",
        {},
        {withCredentials:true})
        .then((res)=>{
            this.props.onAuth(true,res.data.data)
            // this.setState({
            //     loading : false
            // })
        }).catch((err)=>{
            this.setState({
                loading:false,
            })
            this.setState({
                notif :{
                    status : true,
                    type : "alert-shown alert-error",
                    message : "Sesi Anda telah habis, silahkan login kembali!"
                }
            })

            setTimeout(()=>{
                this.setState({
                    notif :{
                        status : false,
                    }
                }) 
            }, 3000)
        })
    }

    render(){
        const naming = {
            username:{
                name:"Username",
                placeholder:"Masukkan Username"
            },
            password:{
                name:"Kata Sandi",
                placeholder:"Masukkan Kata Sandi"
            },
        };

        return (
            <FlexContainer>
                {
                 (this.state.loading)? "Loading...":<LoginComponent onSubmitHandler={this.onSubmitHandler} naming={naming} onChangeHandler={this.onChangeHandler} failed={this.state.failed}/>
                }
            
                <NotificationComponent message={this.state.notif.message} type={this.state.notif.type} status={this.state.notif.status}></NotificationComponent>
                
            </FlexContainer>
        );
    }

    onChangeHandler = (event) =>{
        this.setState({
            failed: {
                status  : false,
                message : null
            },
        })
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmitHandler = (event)=>{
        event.preventDefault();
        axios.post("/auth/attempt",{
            username:this.state.username,
            password:this.state.password
        }).then((res)=>{

            if(res.data.status){
                let {id, name, username , token} = res.data.data
                let user = {
                    id : id,
                    name : name,
                    username : username,
                    token : token,
                };

                this.props.onAuth(true, user);
            }else{
                this.setState({
                    failed:{
                        status  : true,
                        message : res.data.message
                    }
                })
            }
        })
    }
}

export default LoginContainer;