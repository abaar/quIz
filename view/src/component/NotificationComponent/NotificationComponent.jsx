import React from "react";
import "./NotificationComponent.css";

class NotificationComponent extends React.Component{
    render(){
        return (
            <div className={'col-md-3 notification '+ this.props.type + ((this.props.status)?' alert-shown':' alert-hidden')}  >
                {this.props.message}
            </div>
        );
    }
}

export default NotificationComponent;