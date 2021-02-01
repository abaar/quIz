import React from "react"
import "./ModalComponent.css"

class ModalComponent extends React.Component{
    render(){
        return(
            <span>
                <div className={"modal fade "+ (this.props.open === true?" show":"")} style={{ display:(this.props.open === true?"block":"none") }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" onClick={this.props.onAddHideHandler}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        {this.props.footer}
                        </div>
                    </div>
                </div>
                <div className={"modal-backdrop fade"+ (this.props.open === true?" show":"")} id="backdrop" style={{ display:(this.props.open?"block":"none") }}></div>
            </span>
        )
    }
}

export default ModalComponent;