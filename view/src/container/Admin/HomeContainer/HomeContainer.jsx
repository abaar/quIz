import React from "react"
import "./HomeContainer.css"

import AdminContainer from "../AdminContainer"

class HomeContainer extends React.Component{
    
    constructor(props){
        super(props)
        this.state ={
            state:"Asdasd"
        }

    }

    render(){
        const home = <p>Halo</p>

        return(
            <AdminContainer content={home} fakeAuth={this.props.fakeAuth} onAuth={this.props.onAuth}  redirectTo={this.props.redirectTo}></AdminContainer>
        )
    }
}

export default HomeContainer