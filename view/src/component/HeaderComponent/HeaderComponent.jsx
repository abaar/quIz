import React from "react"
import "./HeaderComponent.css"

import Axios from "axios"

class HeaderComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            navigation : false
        }
    }

    onLogoutHandler = ()=>{
        Axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        Axios.post(
            "/auth/logout",{},
            {withCredentials:true}
        ).then((res)=>{
            this.props.onAuth(false,null)
        }).catch(()=>{
            this.props.onAuth(false,null)
        })
    }

    render(){
        return (
            <span>
                <nav className="navbar head-primary">
                    <div>
                    <span className="navbar-text color-white" >
                        {this.props.fakeAuth.data.user.name}
                    </span>
                    </div>
                    <div>
                        <button className="btn color-white btn-hover btn-navigation-sm" onClick={ ()=>this.setState({navigation:!this.state.navigation}) } > <span className="fas fa-bars"></span> </button>
                        <button className="btn color-white btn-hover btn-navigation" onClick={ ()=>{alert("blm implement")} }>Profile</button>
                        <button className="btn color-white btn-hover btn-navigation" onClick={ this.onLogoutHandler }>
                            <span className="fas fa-sign-out-alt"></span> Logout</button>
                    </div>
                </nav>
                <div className={"navigation-sm-cover cover-white "+(this.state.navigation?"":"navigation-sm-cover-hidden")}>
                    <div>
                        <ul className="navigation-sm-buttons">
                            <li><span className="fas fa-window-close" onClick={ ()=>this.setState({navigation:!this.state.navigation}) }> </span></li>
                            <li>  <p >Profile</p> </li>
                            <li onClick={ this.onLogoutHandler }>  <p><span className="fas fa-sign-out-alt"></span> Logout</p> </li>
                        </ul>
                    </div>
                </div>
            </span>

        );
    }

};

export default HeaderComponent;