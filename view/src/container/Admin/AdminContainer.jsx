import React from "react"
import AdminHeaderComponent from "../../component/Admin/HeaderComponent/HeaderComponent"
import AdminSidebarContainer from "../../component/Admin/SidebarComponent/SidebarComponent"
// import AdminSidebarContainer from "./SidebarContainer"

const component = (props) =>{
    return(
        <div style={{ backgroundColor:"#f1f4f6", minHeight:"100vh" }}>
            <AdminHeaderComponent fakeAuth={props.fakeAuth} ></AdminHeaderComponent>
            <AdminSidebarContainer redirectTo={props.redirectTo}></AdminSidebarContainer>
            {props.content}
            <p>asdasd</p>
        </div>
    )
}

export default component