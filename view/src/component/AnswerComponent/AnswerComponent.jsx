import React from "react"
import "./AnswerComponent.css"

class AnswerComponent extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            clicked : this.props.isChecked
        }
    }

    render(){
        return (
            <span>
                <label  className="answers-choice" htmlFor={"answersof"+this.props.qid} onClick={()=>{
                    this.props.setChecked(this.props.id)
                }}>
                    <input type="radio" name={"answersof"+this.props.qid} value={this.props.id} checked={this.props.isChecked} readOnly/> {this.props.label}
                </label>
                <br/>
            </span>
        )
    }
}

export default AnswerComponent