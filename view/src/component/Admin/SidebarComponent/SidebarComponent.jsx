import React from "react"
import AdminNavigationComponent from "../NavigationComponent/NavigationComponent.jsx"

import "./SidebarComponent.css"

class AdminSidebarContainer extends React.Component{

    render(){
        const navigation = []

        for(let i =0 ; i < this.props.navProvider.length ; ++i){
            navigation.push(<AdminNavigationComponent key={i} index={i} activeKey={this.props.activeKey} redirectTo={this.props.redirectTo} onActive={this.props.onActive} details={this.props.navProvider[i]}></AdminNavigationComponent>)
        }

        return(
            <div className="sidebar-container side-dark-primary ">
                <div className="sidebar">
                    <ul style={{ paddingLeft:"0px" }}>
                        {navigation}
                    </ul>

                </div>
            </div>
        )
    }
}

export default AdminSidebarContainer