import React from "react";
import "./QuizContainer.css";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";
import Container from "../Container";
import QuestionComponent from "../../component/QuestionComponent/QuestionComponent";
import QNavComponent from "../../component/QNavComponent/QNavComponent";

import ProgressNotification from "../../component/NotificationComponent/SubmittingComponent/SubmittingComponent"
import axios from "axios";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swalinstance = withReactContent(Swal)

class QuizContainer extends React.Component{
    constructor(props){
        super(props)
        let current;
        let soals = []

        let date = new Date()
        for(let i = 0 ; i < this.props.quiz.data.questions.length; ++i){
            let iter    = this.props.quiz.data.questions[i]
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


        date                = new Date()
        let day  = date.getDate()
        if(day < 10){
            day = "0"+day
        }

        let month = date.getMonth() + 1
        if(month < 10){
            month = "0" + month
        }

        let year    = date.getFullYear()
        date        = year+"-"+month+"-"+day;
        let start           = new Date(`${this.props.quiz.data.start}`)
        let end             = new Date(`${date} ${this.props.quiz.data.end}`)
        let diff            = Math.abs(end.getTime() - (new Date() > start ? new Date().getTime() : start.getTime())) / 1000
        let hour    = Math.floor(diff / (60*60))
        diff        = ~~diff % 3600
        
        let mins    = Math.floor(diff / 60)
        let secs    = ~~diff % 60

        this.state = {
            current:current,
            soals : soals,
            sidenav : {
                status: false,
            },
            remaining:{
                diff    : diff,
                hour    : hour,
                mins    : mins,
                secs    : secs
            },
            submitting:{
                answers     : {},
                current     : null,
                submitting  : false,
            },
            submitstatus : {
                status  : null,
                tid     : null
            },
            currenttime : new Date(),
            intervalrender  : null
        }
    }

    componentDidMount(){
        let date            = new Date()
        let day  = date.getDate()
        if(day < 10){
            day = "0"+day
        }

        let month = date.getMonth() + 1
        if(month < 10){
            month = "0" + month
        }

        let year    = date.getFullYear()
        date        = year+"-"+month+"-"+day;
        let start           = new Date(`${this.props.quiz.data.start}`)
        if(new Date() > start){
            start           = new Date()
        }
        let end             = new Date(`${date} ${this.props.quiz.data.end}`)
        let diff            = Math.floor(Math.abs(end.getTime() - start.getTime() ) / 1000)
        let fixeddiff       = diff
        let hour    = Math.floor(diff / (60*60))
        diff        = ~~diff % 3600
        
        let mins    = Math.floor(diff / 60)
        let secs    = ~~diff % 60
        this.setState({
            remaining:{
                diff    : fixeddiff,
                hour    : hour,
                mins    : mins,
                secs    : secs
            },
            intervalrender:this.startCountDown(),
        })
    }

    startCountDown = () => setInterval(this.renderTime,1000)


    renderTime = () =>{
        if(this.state.remaining.diff <= 0){
            clearInterval(this.state.intervalrender)
            this.finishQuiz(false)
            return
        }
        let remaining = this.state.remaining
        let seconds   = remaining.secs - 1
        remaining.secs = seconds
        if(seconds === -1){
            remaining.secs = 59
            remaining.mins = remaining.mins - 1
            if(remaining.mins === -1 ){
                remaining.mins = 59
                remaining.hour = remaining.hour -1
            }
        }
        this.setState({
            remaining:{
                diff     : remaining.diff-1,
                hour     : remaining.hour,
                mins     : remaining.mins,
                secs     : remaining.secs
            }
        })
    }

    render(){
        const qnav = [];
        for(let i = 0; i< this.state.soals.length ; ++i){
            qnav.push(                                
                <QNavComponent number={i+1} key={i} index={i} checked={this.state.soals[i].checked != null} active={(this.state.current.index === i)} setQActive={this.moveToQuestion}>
                </QNavComponent>
            )
        }

        const prevbutton = <button className="btn q-nav-btn" onClick={this.moveToPreviousQuestion} id="q-nav-before">Sebelumnya</button>
        const nextbutton = <button className="btn q-nav-btn" onClick={this.moveToNextQuestion} id="q-nav-next">Selanjutnya</button>
        const finnbutton = <button className="btn q-nav-btn" onClick={this.finishQuiz} id="q-nav-finish">Selesaikan</button>

        
        const remaining = {
            secs : (this.state.remaining.secs < 10)? "0"+this.state.remaining.secs : this.state.remaining.secs,
            mins : (this.state.remaining.mins < 10)? "0"+this.state.remaining.mins : this.state.remaining.mins,
            hour : (this.state.remaining.hour < 10)? "0"+this.state.remaining.hour : this.state.remaining.hour,
        }

        return (
            <div>
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
                                <span className={"fas fa-chevron-"+(this.state.sidenav.status?'left':'right')}  ></span>
                            </div>
                        </div>
                        <div className="q-body-container">
                            <div className="q-header">
                                <span className="q-header-timer">Sisa Waktu : {remaining.hour+":"+remaining.mins+":"+remaining.secs}</span>
                            </div>
                            <div className="q-body">
                                <QuestionComponent setChecked={this.setChecked} details={this.state.current}></QuestionComponent>
                            </div>
                        </div>
                        <div className="q-nav-container">
                                {(this.state.current.index-1 >= 0)? prevbutton: <button disabled className="btn q-nav-btn disabled" onClick={this.moveToPreviousQuestion} id="q-nav-before">Sebelumnya</button>}
                                {(this.state.current.index+1 < this.state.soals.length)? nextbutton:finnbutton}
                                <br/>
                                <br/>
                                {(this.state.submitstatus.status !== null)? <ProgressNotification type={(this.state.submitstatus.status === -1)?"error":((this.state.submitstatus.status === 0)?"loading":"success")} ></ProgressNotification> :''}
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
            current : current,
            currenttime: new Date()
        })
    }

    setChecked = (idAnswers) =>{
        let current = this.state.current
        current.checked = idAnswers
        let soals = this.state.soals
        soals[current.index].checked = idAnswers
        this.setState({
            current : current,
            soals   : soals,
        })
        
        if(idAnswers === null){
            return
        }

        if(this.state.submitting.current === current.id){
            clearTimeout(this.state.submitting.submitting)
        }

        if(this.state.submitstatus.tid !== null){
            clearTimeout(this.state.submitstatus.tid)
            this.setState({
                submitstatus :{
                    status  : null,
                    tid     : null
                }
            })
        }

        let currentSubmission = this.state.submitting.answers
        currentSubmission[current.id] = {
            id      :   idAnswers,
            q_id    :   current.id,
            time    :   new Date(),
        }

        this.setState({
            submitting  : {
                answers     : currentSubmission,
                current     : current.id,
                submitting  : this.delaySubmitting(),
            }
        })
    }

    delaySubmitting =  () => setTimeout(() =>{
        let start = this.state.currenttime
        this.setState({
            submitstatus :{
                status  : 0,
                tid     : null
            },
            currenttime: new Date()
        })
        let values = this.state.submitting.answers
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.post("/quiz/live/submit",{
            data:{
                user_id     : this.props.fakeAuth.data.user.id,
                test_id     : this.props.quiz.data.id,
                answers     : Object.values(this.state.submitting.answers),
                start       : start
            }
        },
        {withCredentials:true}).then((result)=>{
            if(result.data.status){
                let newvalues = {}
                let currentvalues = this.state.submitting.answers
                for(const key in currentvalues){
                    if(!(key in values)){
                        newvalues[key] = currentvalues[key]
                    }
                }
                this.setState({
                    submitstatus : {
                        status : 1,
                        tid    : null
                    },
                    submitting:{
                        answers     : newvalues,
                        current     : null,
                        submitting  : null,
                    }
                })
                this.setState({
                    submitstatus:{
                        status : this.state.submitstatus.status,
                        tid    : this.hideProgressBar()
                    }
                })
            }else{

                if("code" in result.data && (result.data.code === -1 || result.data.code === 1)){
                    swalinstance.fire({
                        title: <p>Waktu Habis</p>,
                        text: "Mohon maaf, waktu ujian telah selesai...",
                        icon:"error",
                    }).then(()=>{
                        this.props.startTest(-1)
                    })
                }else{
                    this.setState({
                        submitstatus : {
                            status : -1,
                            tid    : null
                        }
                    })
                }
            }
        })
    }, 700)

    hideProgressBar = ()=>setTimeout(()=>{
        this.setState({submitstatus:{status:null, tid:null}})
    }, 3000)

    finishQuiz = (confirm = true) =>{
        if(confirm){
            swalinstance.fire({
                title: <p>Apakah Anda yakin?</p>,
                icon:"warning",
                showCancelButton: true,
                confirmButtonText: `Selesaikan`,
                cancelButtonText: `Batal`,
            }).then((res)=>{
                if(res.isConfirmed){
                    axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
                    axios.post("/quiz/test/finish",{
                        test_id : this.props.quiz.data.id
                    },
                    {withCredentials:true}).then((res)=>{
                        if(res.data.status){
                            this.props.startTest(-1)
                        }
                    })  
                }
            })
        }else if(confirm === false){
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/quiz/test/finish",{
                test_id : this.props.quiz.data.id
            },
            {withCredentials:true}).then((res)=>{
                if(res.data.status){
                    this.props.startTest(-1)
                }
            })  
        }
    }
}

export default QuizContainer;