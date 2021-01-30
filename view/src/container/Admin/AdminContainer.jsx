import React from "react"
import AdminHeaderComponent from "../../component/Admin/HeaderComponent/HeaderComponent"
import AdminSidebarContainer from "../../component/Admin/SidebarComponent/SidebarComponent"
// import AdminSidebarContainer from "./SidebarContainer"

import "./AdminContainer.css"

class AdminContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    render(){
        return(
            <div style={{ backgroundColor:"#f1f4f6", minHeight:"100vh", minWidth:"100vw" ,display:"inline-block"}}>
                <AdminHeaderComponent fakeAuth={this.props.fakeAuth} onAuth={this.props.onAuth} ></AdminHeaderComponent>
                <AdminSidebarContainer redirectTo={this.props.redirectTo}></AdminSidebarContainer>
                <div className="admin-body-container">
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default AdminContainer