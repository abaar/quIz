import React from "react";
import "./QuizContainer.css";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import Container from "../Container";
import QuestionComponent from "../../component/QuestionComponent/QuestionComponent";
import QNavComponent from "../../component/QNavComponent/QNavComponent";

class QuizContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            current:{
                id:1,
                index : 0,
                question:"1+1 = ",
                checked : null,
                answers : [
                    {
                        id:"1",
                        label : "2",
                    },
                    {
                        id:"2",
                        label : "1",
                    },
                    {
                        id:"3",
                        label : "3",
                    },
                    {
                        id:"4",
                        label : "2.5",
                    },
                    {
                        id:"5",
                        label : "5",
                    },
                ]
            },
            soals : [
                {
                    id : 1,
                    question:"1+1 = ",
                    checked : null,
                    answers : [
                        {
                            id:"1",
                            label : "2",
                        },
                        {
                            id:"2",
                            label : "1",
                        },
                        {
                            id:"3",
                            label : "3",
                        },
                        {
                            id:"4",
                            label : "2.5",
                        },
                        {
                            id:"5",
                            label : "5",
                        },
                    ]
                },
                {
                    id : 2,
                    question:"2+2 = ",
                    checked : null,
                    answers : [
                        {
                            id:"6",
                            label : "2",
                        },
                        {
                            id:"7",
                            label : "1",
                        },
                        {
                            id:"8",
                            label : "3",
                        },
                        {
                            id:"9",
                            label : "2.5",
                        },
                        {
                            id:"10",
                            label : "5",
                        },
                    ]
                },
                {
                    id : 3,
                    question:"4+4 = ",
                    checked : null,
                    answers : [
                        {
                            id:"11",
                            label : "2",
                        },
                        {
                            id:"12",
                            label : "1",
                        },
                        {
                            id:"13",
                            label : "3",
                        },
                        {
                            id:"14",
                            label : "2.5",
                        },
                        {
                            id:"15",
                            label : "5",
                        },
                    ]
                },
            ],
            sidenav : {
                status: false,
            }
        }
    }




    render(){
        const qnav = [];
        for(let i = 0; i< this.state.soals.length ; ++i){
            qnav.push(                                
                <QNavComponent number={i+1} index={i} checked={this.state.soals[i].checked != null} active={(this.state.current.index === i)} setQActive={this.moveToQuestion}>
                </QNavComponent>
            )
        }

        const nextbutton = <button className="btn q-nav-btn" onClick={this.moveToNextQuestion} id="q-nav-next">Selanjutnya*</button>
        const prevbutton = <button className="btn q-nav-btn" onClick={this.moveToPreviousQuestion} id="q-nav-before">Sebelumnya*</button>


        return (
            <div  onClick={()=>{
                if(this.state.sidenav.status)
                this.setState({
                    sidenav:{
                        status:false,
                        page : this.state.sidenav.page
                    }
                })
            }
            }>
                <HeaderComponent fakeAuth={this.props.fakeAuth} onLogout={this.onLogoutHandler} />
                <Container >
                    <span>
                        <div className={"sidenav-q-container " +(this.state.sidenav.status === true ? "active":"")}>
                            <div className="sidenav-q-body">
                                {qnav}
                            </div>
                            <div className={"sidenav-q-slider " +(this.state.sidenav.status === true ? "active":"") } onClick={()=>{this.setState({
                                    sidenav:{
                                        status:!this.state.sidenav.status,
                                        page : this.state.sidenav.page
                                    }
                                })}}>
                                <span className={"fas fa-chevron-"+(this.state.sidenav.status?'left':'right')} ></span>
                            </div>
                        </div>
                        <div className="q-body-container">
                            <div className="q-body">
                                <QuestionComponent setChecked={this.setChecked} details={this.state.current}></QuestionComponent>
                            </div>
                            <div className="q-nav">
                                {(this.state.current.index-1 >= 0)? prevbutton: <button disabled className="btn q-nav-btn disabled" onClick={this.moveToPreviousQuestion} id="q-nav-before">Sebelumnya*</button>}
                                {(this.state.current.index+1 < this.state.soals.length)? nextbutton:<button disabled className="btn q-nav-btn disabled" onClick={this.moveToNextQuestion} id="q-nav-next">Selanjutnya*</button>}
                                <br/>
                                <p>*Jawaban akan disimpan secara otomatis</p>
                            </div>
                        </div>
                    </span>
                </Container>
            </div>
        )
    }
    
    moveToNextQuestion = () => {
        let currentidx = this.state.current.index
        if(currentidx+1 < this.state.soals.length ){
            this.moveToQuestion(currentidx+1)
        }
    }

    moveToPreviousQuestion = () =>{
        let currentidx = this.state.current.index
        if(currentidx-1 >= 0){
            this.moveToQuestion(currentidx-1)
        }
    }
    

    moveToQuestion = (index) => {
        let current = this.state.soals[index];
        current['index'] = index
        this.setState({
            current : current
        })
    }

    setChecked = (idAnswers) =>{
        let current = this.state.current
        current.checked = idAnswers
        let soals = this.state.soals
        soals[current.index].checked = idAnswers
        this.setState({
            current : current,
            soals   : soals
        })
    }
}

export default QuizContainer;