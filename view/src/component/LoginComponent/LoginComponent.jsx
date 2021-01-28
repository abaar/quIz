import React from "react";
import "./LoginComponent.css";

class LoginComponent extends React.Component{
    render(){
        return (
            <div className="padding-5 side-padding-15" id="login-container">
            <img id="logo" src="/logo.png" alt=""/>
            <form onSubmit={this.props.onSubmitHandler} method="post">
                {
                    (this.props.failed.status === true)?
                    (
                    <div className="form-group">
                        <div className="alert alert-danger">
                            {this.props.failed.message}
                        </div>
                    </div>
                    ):null
                }
                <div className="form-group">
                    <label htmlFor="">{this.props.naming.username.name}</label>
                    <input type="text" required className={'form-control ' + ((this.props.failed.status===true)?" is-invalid":"")} name="username" onChange={this.props.onChangeHandler} placeholder={this.props.naming.username.placeholder}/>
                </div>
                <div className="form-group">
                    <label htmlFor="">{this.props.naming.password.name}</label>
                    <input type="password" required className={"form-control" + ((this.props.failed.status===true)?" is-invalid":"")}name="password"  onChange={this.props.onChangeHandler} placeholder={this.props.naming.password.placeholder}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-warning col-sm-12">Masuk</button>
                </div>
                <span id="lupas-action">Lupa password?</span>
            </form>
        </div>
        );
    }
}

export default LoginComponent;