import React from "react";
import "./UpcomingQuizComponent.css"

const component = (props) => {
    return (
        <div className="upcoming-quiz-card">
            <div className="upcoming-quiz-header">
                <div className="upcoming-quiz-title flex-90">
                    <h3>{props.details.kode} - {props.details.title}</h3>
                </div>
                <div className="upcoming-quiz-start flex-10"> 
                    <button className="btn btn-primary" onClick={()=>{props.onStartHandler(props.details.id,props.details.kode)}}>Mulai</button>
                </div>
            </div>
            <hr/>
            <div className="upcoming-quiz-body">
                <div className="flex-50">
                    <p>
                        <b>Jenis Tes</b>
                        <br/>
                        {props.details.type === "conventional" ?  <span >Pilihan Ganda</span>  : <span className="badge badge-danger">Adaptive Test</span> }
                        
                    </p>
                </div>
                <div className="flex-50">
                    <p>
                        <b>Dimulai pada</b>
                        <br/>
                        {props.details.date}
                    </p>
                </div>
            </div>
            <span>
                {props.details.note != null?            
                    <p>
                        <b>Catatan</b>
                        <br/>
                        {props.details.note}
                    </p>
                : ""}
             </span>
            
        </div>
    )
}

export default component;