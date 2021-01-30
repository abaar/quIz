import React from "react"
import "./NavigationComponent.css"

class AdminNavigationComponent extends React.Component{

    constructor(props){
        super(props)
        this.state ={
            active:false
        }
    }

    render(){
        return (
            <li className={"side-navigation"+(this.state.active?" active":"")}>
                <span>
                    AdminCompo
                </span>
            </li>
        )
    }
}

export default AdminNavigationComponent