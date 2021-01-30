import React from "react"
import AdminHeaderComponent from "../../component/Admin/HeaderComponent/HeaderComponent"
import AdminSidebarContainer from "../../component/Admin/SidebarComponent/SidebarComponent"
// import AdminSidebarContainer from "./SidebarContainer"

import "./AdminContainer.css"

class AdminContainer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            active : null
        }
    }
    render(){
        return(
            <div style={{ backgroundColor:"#f1f4f6", minHeight:"100vh", minWidth:"100vw" ,display:"inline-block"}}>
                <AdminHeaderComponent  navProvider={this.props.navProvider}  fakeAuth={this.props.fakeAuth} onAuth={this.props.onAuth} redirectTo={this.props.redirectTo}  onActive={this.props.onActive} activeKey={this.props.activeKey}></AdminHeaderComponent>
                <AdminSidebarContainer navProvider={this.props.navProvider}  redirectTo={this.props.redirectTo}  onActive={this.props.onActive} activeKey={this.props.activeKey}></AdminSidebarContainer>
                <div className="admin-body-container">
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default AdminContainer