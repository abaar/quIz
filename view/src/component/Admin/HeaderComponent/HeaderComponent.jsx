import React from "react"
import "./HeaderComponent.css"
class AdminHeaderComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            navigation : false
        }
    }

    render(){
        return (
            <span>
                <nav className="navbar head-primary">
                    <div>
                    <span className="navbar-text color-white" >
                        <button className="btn color-white btn-hover btn-navigation-sm" onClick={ ()=>this.setState({navigation:!this.state.navigation}) } > <span className="fas fa-bars"></span> </button>
                    </span>
                    </div>
                    <div>
                        <button className="btn color-white btn-hover btn-navigation" onClick={ () => this.props.onLogout()}>
                            <span className="fas fa-sign-out-alt"></span> Logout</button>
                    </div>
                </nav>
                <div className={"navigation-sm-cover cover-white "+(this.state.navigation?"":"navigation-sm-cover-hidden")}>
                    <div>
                        <ul className="navigation-sm-buttons">
                            <li style={{ textAlign:"left" }}><span className="fas fa-window-close" onClick={ ()=>this.setState({navigation:!this.state.navigation}) }> </span></li>
                            <li>  <p><span className="fas fa-sign-out-alt"></span> Logout</p> </li>
                        </ul>
                    </div>
                </div>
            </span>

        );
    }

};

export default AdminHeaderComponent;