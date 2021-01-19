import React from "react"
import  "./QuestionComponent.css"

import AnswerComponent from "../AnswerComponent/AnswerComponent";

class QuestionComponent extends React.Component {
    render(){
        const answers = [];
        for (let i =0 ; i < this.props.details.answers.length ; ++i){
                answers.push(<AnswerComponent 
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
                <h6>Pertanyaan No {this.props.details.index+1}</h6>
                <p>{this.props.details.question}</p>
                {answers}
                
            </span>
        )
    }

    setChecked = (idAnswers)=>{
        this.props.setChecked(idAnswers)
    }
}

export default QuestionComponent