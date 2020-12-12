import React from "react"
import "./HeaderComponent.css"

const HeaderComponent = (props) =>{
    return (
        <nav className="navbar bg-primary">
            <div>
            <span className="navbar-text color-white" >
                {props.fakeAuth.data.user.name}
            </span>
            </div>
            <div>
                <button className="btn color-white btn-hover" onClick={ () => props.onLogout()}>Logout</button>
            </div>
        </nav>
    );
};

export default HeaderComponent;