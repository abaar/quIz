import React from "react"
import "./NavigationComponent.css"

class AdminNavigationComponent extends React.Component{

    render(){
        return (
            <li className={"side-navigation"+(this.props.activeKey === this.props.index?" active":"")} onClick={()=>{ this.props.onActive(this.props.index); this.props.redirectTo(this.props.details.path); }}>
                <span>
                    {this.props.details.label}
                </span>
            </li>
        )
    }
}

export default AdminNavigationComponent