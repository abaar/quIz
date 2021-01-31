import React from "react"
import "./UserContainer.css"

import AdminContainer from "../AdminContainer"
import TableComponent from "../../../component/Admin/TableComponent/TableComponent"
import axios from "axios"

const data = [{ id: 1, title: 'Conan the Barbarian',  title2: 'Conan the Barbarian', year: '1982' }];
const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Title',
    selector: 'title2',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

class UserContainer extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            loading : true,
        }
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/admin/user/all",{
        },
        {withCredentials:true}).then((res)=>{
            console.log(res)
            this.setState({
                loading:false
            })
        })
    }

    render(){
        const home = <div className="admin-content-container">
                        <div className="admin-content-header">
                            <div className="admin-title">
                                <h2 style={{ marginBottom:"0" }}>Kelola User</h2>
                                <small>
                                    <span>Admin</span> <span> / </span> <span> Kelola User</span>
                                </small>
                            </div>
                            <div className="admin-action">
                                <button className="btn btn-sm btn-outline-primary btn__table__action"> <span className="fas fa-plus"></span> <span className="label">Tambah</span> </button>
                                <button className="btn btn-sm btn-outline-warning btn__table__action"> <span className="fas fa-edit"></span> <span className="label">Ubah</span></button>
                                <button className="btn btn-sm btn-outline-danger btn__table__action"> <span className="fas fa-trash"></span> <span className="label">Hapus</span></button>
                                <button className="btn btn-sm btn-outline-success btn__table__action" onClick={ () => {this.downloadCSV(this.props.data)} }> <span className="fas fa-file-download"></span> <span className="label">Export CSV</span></button>
                            </div>
                        </div>
                        <div className="admin-content-body">
                            <div className="admin-content-body data">
                                    
                                    {this.state.loading?  <span> <span className="fas fa-spinner spinning"></span> Loading...</span>:<TableComponent data={data} cols={columns} title="Daftar User"/>}
                            </div>
                        </div>
                    </div>

        return(
            <AdminContainer content={home} fakeAuth={this.props.fakeAuth} onActive={this.props.onActive} activeKey={this.props.activeKey} onAuth={this.props.onAuth}  redirectTo={this.props.redirectTo} navProvider={this.props.navProvider} ></AdminContainer>
        )
    }
}

export default UserContainer