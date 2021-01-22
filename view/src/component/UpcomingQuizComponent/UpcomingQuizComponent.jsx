import React from "react";
import "./UpcomingQuizComponent.css"

class UpcomingQuizComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            starting : false
        }
    }

    render(){

        const loading = <span className="fas fa-spinner spinning"></span>

        const startbutton = <button className="btn btn-primary" onClick={()=>{this.props.onStartHandler(this.props.details.id,this.props.details)}}>Mulai</button>
        const continuebutton = <button className="btn btn-warning" onClick={()=>{this.props.onContinueHandler(this.props.details.id,this.props.details); this.setState({starting:true})}}>
            {(this.state.starting)? loading : 'Lanjutkan'}
        </button>;
        return (
            (this.props.empty !== true && this.props.loading !== true)?
            <div className="upcoming-quiz-card">
                <div className="upcoming-quiz-header">
                    <div className="upcoming-quiz-title flex-90">
                        <h3>{this.props.details.kode} - {this.props.details.title}</h3>
                    </div>
                    <div className="upcoming-quiz-start flex-10"> 
                        {this.props.details.open? (this.props.details.taken?continuebutton:startbutton):""}
                    </div>
                </div>
                <hr/>
                <div className="upcoming-quiz-body">
                    <div className="flex-50">
                        <p>
                            <b>Jenis Tes</b>
                            <br/>
                            {this.props.details.type === "conventional" ?  <span >Pilihan Ganda</span>  : <span className="badge badge-danger">Adaptive Test</span> }
                            
                        </p>
                    </div>
                    <div className="flex-50">
                        <p>
                            <b>Dimulai pada</b>
                            <br/>
                            {this.props.details.date}
                        </p>
                    </div>
                </div>
                <span>
                    {this.props.details.note != null?            
                        <p>
                            <b>Catatan</b>
                            <br/>
                            {this.props.details.note}
                        </p>
                    : ""}
                </span>
                
            </div>:
            (this.props.loading !== true)?
            <div>Tidak ada ujian untuk Anda / silahkan mencoba memasukkan Kode Kuis</div>
            :
            <div>Loading...</div>
        )
}

}

export default UpcomingQuizComponent;