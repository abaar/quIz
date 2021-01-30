import React from "react"
import "./HeaderComponent.css"
import axios from "axios"

class AdminHeaderComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            navigation : false
        }
    }

    render(){

        const component = []
        for(let i =0 ; i < this.props.navProvider.length ; ++i){
            component.push(<li key={i} onClick={()=>{this.props.onActive(i); this.props.redirectTo(this.props.navProvider[i].path);}}><p  className={(this.props.activeKey === i)?"active":""}>{this.props.navProvider[i].label}</p></li>)
        }

        return (
            <span style={{ position:"fixed", zIndex:1000 }}>
                <nav className="admin navbar head-primary">
                    <div>
                    <span className="admin navbar-text color-white" >
                        <button className="admin btn color-white btn-hover btn-navigation-sm" onClick={ ()=>{this.setState({navigation:!this.state.navigation});}} > <span className="fas fa-bars"></span> </button>
                        <strong>iXam Admin</strong>
                    </span>
                    </div>
                    <div>
                        <button className="admin btn color-white btn-hover" onClick={this.onLogoutHandler}>
                            <span className="admin fas fa-sign-out-alt"></span> Logout
                        </button>
                    </div>
                </nav>
                <div className={"admin navigation-sm-cover cover-white "+(this.state.navigation?"":"navigation-sm-cover-hidden")}>
                    <div>
                        <ul className="admin navigation-sm-buttons">
                            <li style={{ textAlign:"left" }}><span className="fas fa-window-close" onClick={ ()=>{this.setState({navigation:!this.state.navigation}); } }> </span></li>
                            {component}
                        </ul>
                    </div>
                </div>
            </span>

        );
    }

    onLogoutHandler = ()=>{

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.post(
            "/auth/logout",{},
            {withCredentials:true}
        ).then((res)=>{
            this.props.onAuth(false,null)
        }).catch(()=>{
            this.props.onAuth(false,null)
        })
    }

};

export default AdminHeaderComponent;