import React from "react";
import "./LoginComponent.css";

class LoginComponent extends React.Component{
    render(){
        return (
            <div className="col-md-4 col-sm-12 padding-5 side-padding-15 border-login">
            <h1>Masuk</h1>
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
                    <button className="btn btn-success col-sm-12">Masuk</button>
                </div>
            </form>
        </div>
        );
    }
}

export default LoginComponent;