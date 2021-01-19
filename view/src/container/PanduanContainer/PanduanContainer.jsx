import React from "react";
import "./PanduanContainer.css";
import FlexContainer from "../FlexContainer";
import HeaderComponent from "../../component/HeaderComponent/HeaderComponent";

class PanduanContainer extends React.Component{
    render(){
        return (
            <div>
                <HeaderComponent fakeAuth={this.props.fakeAuth} onLogout={this.onLogoutHandler} />
                <FlexContainer>
                    <div className="col-md-5 col-sm-12 padding-5 side-padding-15 border-login">
                        <h1 style={{ marginBottom:'0px', paddingBottom:'0px' }}>Matematika</h1>
                        <small>K.D. Pecahan ADSAASJDAISJDAISJDAISJDASIdj</small>
                        <br/>
                        <br/>
                        <h2>Petunjuk Pengerjaan Soal</h2>
                        <ol>
                            <li>
                                Jawablah dengan seksama, hanya bisa menjawab <strong>1 (satu)</strong> kali!
                            </li>
                            <li>Soal yang telah dijawab, <strong>tidak bisa</strong> diubah!</li>
                            <li>Kerjakanlah soal dengan <strong>jujur dan mandiri!</strong></li>
                            <li>Jumlah soal <strong>tidak menentu</strong> atau disesuaikan dengan kemampuan</li>
                        </ol>
                        <br/>
                        <div className="row">
                            <div className="col-md-6">
                                <button className="btn btn-secondary" onClick={() => {this.props.startTest(-1)}}>Kembali</button>
                            </div>
                            <div className="col-md-6" style={{ textAlign:'right' }}>
                                <button className="btn btn-primary"  onClick={() => {this.props.startTest(1)}}>Mulai Kerjakan</button>
                            </div>
                        </div>
                    </div>
                </FlexContainer>
            </div>

        );
    }

    onLogoutHandler = ()=>{
        this.props.onAuth(false,null)
    }
}

export default PanduanContainer;