import React from "react"
import "./QNavComponent.css"


const QNavComponent = (props) => {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         active : false,
    //     }
    // }

    // render(){
        return(
            <button className={"btn q-btn "+(props.checked === true? ' checked ': '')+(props.active === true? 'active':'')}
                onClick = {() => {
                    props.setQActive(props.index); 
                }
                }
            >
                {props.number}
            </button>
        )
    // }
}

export default QNavComponent;