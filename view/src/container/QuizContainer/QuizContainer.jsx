import React from "react";
import "./QuizContainer.css";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import Container from "../Container";
import QuestionComponent from "../../component/QuestionComponent/QuestionComponent";
import QNavComponent from "../../component/QNavComponent/QNavComponent";

class QuizContainer extends React.Component{
    constructor(props){
        super(props)
        let current;
        let soals = []
        for(let i = 0 ; i < this.props.quiz.data.length; ++i){
            let iter    = this.props.quiz.data[i]
            let holder  = {
                id          : iter.id,
                index       : i,
                question    : iter.question,
                checked     : iter.test_taker_answer,
                answers     : [],
            }
            for(let j = 0 ; j < iter.answers.length; ++j){
                let jter = iter.answers[j]
                holder.answers.push({
                    id      : jter.id,
                    label   : jter.label
                })
            }

            if(i === 0){
                current = holder
            }
            soals.push(holder)
        }
        this.state = {
            current:current,
            soals : soals,
            sidenav : {
                status: false,
            }
        }
    }




    render(){
        const qnav = [];
        for(let i = 0; i< this.state.soals.length ; ++i){
            qnav.push(                                
                <QNavComponent number={i+1} key={i} index={i} checked={this.state.soals[i].checked != null} active={(this.state.current.index === i)} setQActive={this.moveToQuestion}>
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