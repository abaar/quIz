import React from "react"
import  "./QuestionComponent.css"

import AnswerComponent from "../AnswerComponent/AnswerComponent";

class QuestionComponent extends React.Component {
    render(){
        const answers = [];
        for (let i =0 ; i < this.props.details.answers.length ; ++i){
                answers.push(<AnswerComponent 
                    key={i}
                    qid={this.props.details.id} 
                    label={this.props.details.answers[i].label} 
                    id={this.props.details.answers[i].id}
                    index = {i} 
                    setChecked = {this.setChecked}
                    isChecked={this.props.details.checked!=null && this.props.details.checked === this.props.details.answers[i].id }>
                    </AnswerComponent>)
        }

        return (        
            <span>
                <span className="q-number-container"> No {this.props.details.index+1}</span>
                <div className="q-question-container"> 
                    {(this.props.details.image === null)?"":
                        <img style={{ float:"left", marginRight:"10px" }} src={'data:image/jpeg;base64,' + btoa(new Uint8Array(this.props.details.image.data).reduce((data,byte)=> {return data+ String.fromCharCode(byte)},''))} alt={"Soal " + this.props.details.label}/>
                    }
                    <p className="q-question" >{this.props.details.question}</p>
                    {answers}
                </div>
                
            </span>
        )
    }

    setChecked = (idAnswers)=>{
        this.props.setChecked(idAnswers)
    }
}

export default QuestionComponent