import React from 'react';
import "./LoginContainer.css"
import LoginComponent from "../../component/LoginComponent/LoginComponent"
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
        }
    }
    
    componentDidMount(){
        axios.post("/auth/refresh",
        {},
        {withCredentials:true})
        .then((res)=>{
            console.log(res.data)
            this.props.onAuth(true,res.data.data)
            // this.setState({
            //     loading : false
            // })
        }).catch((err)=>{
            this.setState({
                loading:false,
            })
            alert("Sesi Anda telah habis, silahkan login kembali!")
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

        console.log(this.state.loading)
        return (
            <FlexContainer>
                {
                 (this.state.loading)? "Loading...":<LoginComponent onSubmitHandler={this.onSubmitHandler} naming={naming} onChangeHandler={this.onChangeHandler} failed={this.state.failed}/>
                }
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
                let {id, name, username} = res.data.data
                let user = {
                    id : id,
                    name : name,
                    username : username
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