import React from "react"
import "./UserContainer.css"

import AdminContainer from "../AdminContainer"
import TableComponent from "../../../component/Admin/TableComponent/TableComponent"
import ModalComponent from "../../../component/ModalComponent/ModalComponent"

import axios from "axios"
import Select from 'react-select';
import Swal from "sweetalert2"
import withReactContent from 'sweetalert2-react-content'
// const data = [{ id: 1, title: 'Conan the Barbarian',  title2: 'Conan the Barbarian', year: '1982' }];
const columns = [
  {
    name: '#',
    selector: 'index',
    sortable: false,
    maxWidth:"50px",
    minWidth:"10px"
  },
  {
    name: 'Username',
    selector: 'username',
    sortable: true,
  },
  {
    name: 'Nama',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Tingkat',
    selector: 'userlevel',
    sortable: true,
  },
  {
    name: 'Sekolah',
    selector: 'school',
    sortable: true,
  },
  {
    name: 'Kelas',
    selector: 'class',
    sortable: true,
  },
  {
    name: 'Sub Kelas',
    selector: 'subclass',
    sortable: true,
  },
  {
    name: 'Aktif',
    selector: 'active',
    sortable: true,
  },
];
const swalinstance = withReactContent(Swal)
class UserContainer extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            selectedRows: [],
            modaladd : false,
            addsubmitting : false,
            overrideadd : false,
            select:{
                class:{
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                subclass : {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            },
            value : {
                id          : "",
                username    : "",
                password    : "",
                name        : "",
                userlevel   : { value:0,label:"Siswa" },
                school      : null,
                class       : null,
                subclass    : null,
            },
        }

        this.schoolref = React.createRef()
        this.classref = React.createRef()
        this.subclassref = React.createRef()
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/admin/user/all",{
        },
        {withCredentials:true}).then((res)=>{
            new Promise((resolve, reject)=>{
                let {_schools, users} = res.data.data
                
                let _datas  = []
                let schools = []
                _schools.forEach(element => {
                    schools.push({
                        value   : element.id,
                        label   : element.name,
                        classes : element.classes
                    })
                })
                
                _schools = schools


                for(let i = 0 ; i< users.length ; ++i){
                    let element = users[i]
                    _datas.push({
                        index       : (i+1),
                        id          : element.id,
                        username    : element.username,
                        name        : element.name,
                        userlevel   : (element.userlevel === 0)?"Siswa":"Admin",
                        school      : (element.school)? element.school.name : "-",
                        class       : (element.class)? element.class.name : "-",
                        subclass    : (element.subclass)? element.subclass.name : "-",
                        active      : (element.active === 1)? "Aktif" : "Nonaktif",
                        school_id   : element.school_id,
                        subclass_id : element.subclass_id,
                        class_id    : element.class_id
                    })
                }

                this.setState({
                    _school:_schools,
                    _display: _datas,
                    _datas : _datas,
                },()=>{
                    resolve(true)
                })

                
            }).then((res) =>{
                this.setState({
                    loading:false
                })
            })
        })
    }

    onSelectedRowsHandler = (state) =>{
        this.setState({
            selectedRows : state.selectedRows
        })
    }

    onDownloadHandler = () =>{
        if(this.state.loading === false){
            const _data = this.state._display

            const download = []

            _data.forEach(element => {
                download.push({
                    "no"         : element.index,
                    "username"  : element.username,
                    "nama"      : element.name,
                    "tingkat"   : element.active,
                    "sekolah"   : element.school,
                    "kelas"     : element.class,
                    "subkelas"  : element.subclass,
                    "active"    : element.active,
                })
            });

            this.props.downloadCSV(download)
        }
    }

    onAddHandler = () =>{
        this.setState({
            modaladd : true
        })
    }

    findSchoolClassesSubclasses = ()=>{
        const school = this.state._school
        for(let i =0 ; i < school.length; ++i){
            if(school[i].value === this.state.selectedRows[0].school_id){
                const classes = school[i].classes
                for(let j =0 ; j < classes.length; ++j){
                    if(classes[j].id === this.state.selectedRows[0].class_id){
                        const subclasses =  classes[j].subclass
                        return [school, classes, subclasses]
                    }
                }
            }
        }

        return [[],[],[]]
    }

    onEditHandler = () => {
        const [school, classes, subclasses] = this.findSchoolClassesSubclasses()
      
        this.setState({
            modaladd : true,
            overrideadd : true,
            value : {
                id          : this.state.selectedRows[0].id,
                username    : this.state.selectedRows[0].username,
                password    : "",
                name        : this.state.selectedRows[0].name,
                userlevel   : (this.state.selectedRows[0].userlevel === "Siswa")?{ value:0,label:"Siswa" }:{value : 3, label:"Admin"},
                school      : (this.state.selectedRows[0].userlevel === "Siswa")?{value: this.state.selectedRows[0].school_id, label : this.state.selectedRows[0].school, classes: classes}:null,
                class       : (this.state.selectedRows[0].userlevel === "Siswa")?{value: this.state.selectedRows[0].class_id, label : this.state.selectedRows[0].class, subclass : subclasses}:null,
                subclass    :(this.state.selectedRows[0].userlevel === "Siswa")? {value: this.state.selectedRows[0].subclass_id, label : this.state.selectedRows[0].subclass}:null, 
            }
        }, () =>{
            if(this.state.value.school !== null){
                this.schoolref.current.select.setValue(this.state.value.school, 'set-value')            
            }
            
            if(this.state.value.class !== null){
                this.classref.current.select.setValue(this.state.value.class, 'set-value')
            }            
            
            if(this.state.value.subclass !== null){
                this.subclassref.current.select.setValue(this.state.value.subclass, 'set-value')
            }            
        })
    }

    onAddHideHandler = ()=>{
        this.schoolref.current.select.clearValue()
        this.classref.current.select.clearValue()
        this.subclassref.current.select.clearValue()

        this.setState({
            modaladd : false,
            overrideadd : false,
            value : {
                id          : "",
                username    : "",
                password    : "",
                name        : "",
                userlevel   : null,
                school_id   : null,
                class_id    : null,
                subclass_id : null,
            },
            select:{
                class:{
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                subclass : {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            },
        })
    }

    onSelectChangeHandler = (name, value) =>{
        if(name === "school"){
            let classes = []
            if(value === null){
                this.setState({
                    value : {
                        id          : this.state.value.id,
                        username    : this.state.value.username,
password    : this.state.value.password,
                        name        : this.state.value.name,
                        userlevel   : this.state.value.userlevel,
                        school      : null,
                        class       : null,
                        subclass    : null,
                    },
                    select:{
                        class:{
                            disabled : true,
                            loading  : true,
                            data     : [],
                        },
                        subclass : {
                            disabled : true,
                            loading  : true,
                            data     : []
                        }
                    }
                })
            }else{
                value.classes.forEach(element =>{
                    classes.push({
                        value    : element.id,
                        label    : element.name,
                        subclass : element.subclass,
                    })
                })

                this.setState({
                    value : {
                        id          : this.state.value.id,
                        username    : this.state.value.username,
                        password    : this.state.value.password,
                        name        : this.state.value.name,
                        userlevel   : this.state.value.userlevel,
                        school      : value,
                        class       : null,
                        subclass    : null,
                    },
                    select:{
                        class:{
                            disabled : false,
                            loading  : false,
                            data     : classes,
                        },
                        subclass : {
                            disabled : true,
                            loading  : true,
                            data     : []
                        }
                    }
                })
            }

        }else if(name === "class"){
            if( value === null ){
                this.setState({
                    value : {
                        id          : this.state.value.id,
                        username    : this.state.value.username,
                        password    : this.state.value.password,
                        name        : this.state.value.name,
                        userlevel   : this.state.value.userlevel,
                        school      : this.state.value.school,
                        class       : null,
                        subclass    : null,
                    },
                    select:{
                        class:{
                            disabled : false,
                            loading  : false,
                            data     : this.state.select.class.data,
                        },
                        subclass : {
                            disabled : true,
                            loading  : true,
                            data     : []
                        }
                    }
                })
            }else{
                let subclass = []
                value.subclass.forEach(element =>{
                    subclass.push({
                        value    : element.id,
                        label    : element.name,
                    })
                })
                
                this.setState({
                    value : {
                        id          : this.state.value.id,
                        username    : this.state.value.username,
                        password    : this.state.value.password,
                        name        : this.state.value.name,
                        userlevel   : this.state.value.userlevel,
                        school      : this.state.value.school,
                        class       : value,
                        subclass    : null,
                    },
                    select:{
                        class:{
                            disabled : false,
                            loading  : false,
                            data     : this.state.select.class.data,
                        },
                        subclass : {
                            disabled : false,
                            loading  : false,
                            data     : subclass
                        }
                    }
                })
            }
        }else if(name === "subclass"){
            this.setState({
                value : {
                    id          : this.state.value.id,
                    username    : this.state.value.username,
                    password    : this.state.value.password,
                    name        : this.state.value.name,
                    userlevel   : this.state.value.userlevel,
                    school      : this.state.value.school,
                    class       : this.state.value.class,
                    subclass    : (value !== null )?value:null,
                },
            })
        }else if(name === "userlevel"){
            if(value === 3){
                this.setState({
                    value : {
                        id          : this.state.value.id,
                        username    : this.state.value.username,
                        password    : this.state.value.password,
                        name        : this.state.value.name,
                        userlevel   : value,
                        school      : this.state.value.school,
                        class       : this.state.value.class,
                        subclass    : this.state.value.subclass,
                    },
                    select:{
                        class:{
                            disabled : true,
                            loading  : true,
                            data     : [],
                        },
                        subclass : {
                            disabled : true,
                            loading  : true,
                            data     : []
                        }
                    }
                }, () =>{
                    this.schoolref.current.select.clearValue()
                    this.classref.current.select.clearValue()
                    this.subclassref.current.select.clearValue()
                })
            }else{
                this.setState({
                    value : {
                        id          : this.state.value.id,
                        username    : this.state.value.username,
                        password    : this.state.value.password,
                        name        : this.state.value.name,
                        userlevel   : value,
                        school      : this.state.value.school,
                        class       : this.state.value.class,
                        subclass    : this.state.value.subclass,
                    },
                })
            }
        }
    }

    onSubmithandler = ()=>{
        if(this.state.value.username === null || this.state.value.username === null){
            swalinstance.fire({title:"Isian tidak lengkap", icon:"error"})
            return
        }else{
            this.setState({
                addsubmitting:true
            })
            let user = this.state.value
            user.school     = (user.school)? user.school.value : null
            user.class      = (user.class)? user.class.value : null
            user.subclass   = (user.subclass)? user.subclass.value : null
            user.userlevel  = (user.userlevel)? user.userlevel.value : 0
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/user/store",{
                user:user
            },
            {withCredentials:true}).then((res)=>{
                this.setState({
                    addsubmitting:false,
                })
                if(res.data.status){
                    swalinstance.fire({title:"Berhasil", text:res.data.message, icon:"success"}).then(()=>{
                        this.props.remount()
                    })
                }else{
                    swalinstance.fire({title:"Gagal", text:res.data.message, icon:"error"})
                }
            })
        }
    }

    onUpdateHandler = () =>{
        if(this.state.value.password.length >0  && this.state.value.password.length < 6){
            swalinstance.fire({title:"Apabila ingin merubah password, minimal 6 karakter", icon:"error"})
            return
        }else{
            this.setState({
                addsubmitting:true
            })
            let user = this.state.value
            user.school     = (user.school)? user.school.value : null
            user.class      = (user.class)? user.class.value : null
            user.subclass   = (user.subclass)? user.subclass.value : null
            user.userlevel  = (user.userlevel)? user.userlevel.value : 0

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/user/update",{
                user:user
            },
            {withCredentials:true}).then((res)=>{
                this.setState({
                    addsubmitting:false,
                })
                if(res.data.status){
                    swalinstance.fire({title:"Berhasil", text:res.data.message, icon:"success"}).then(()=>{
                        this.props.remount()
                    })
                }else{
                    swalinstance.fire({title:"Gagal", text:res.data.message, icon:"error"})
                }
            })
        }
    }

    onDeleteHandler = () =>{
        swalinstance.fire({
            title:"Apakah Anda yakin?",
            text: "Anda akan menghapus "+this.state.selectedRows.length+" data. Data yang akan dihapus tidak dapat dikembalikan!",
            confirmButtonColor: '#d33',
            icon : "warning",
            confirmButtonText: `Hapus`,
            showCancelButton: true,
            cancelButtonText: `Batal`,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
        }).then((click)=>{
            if(click.isConfirmed){
                let user_ids = [];

                for(let i =0 ; i < this.state.selectedRows.length; ++i){
                    user_ids.push(this.state.selectedRows[i].id)
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
                axios.post("/admin/user/destroy",{
                    user_ids:user_ids
                },
                {withCredentials:true}).then((res)=>{
                    if(res.data.status){
                        swalinstance.fire({title:"Berhasil", text:res.data.message, icon:"success"}).then(()=>{
                            this.props.remount()
                        })
                    }else{
                        swalinstance.fire({title:"Gagal", text:res.data.message, icon:"error"})
                    }
                })
            }
        })
    }

    onUsernameValueChangeHandler = (event) => {
        this.setState({
            value : {
                id          : this.state.value.id,
                username    : event.target.value,
                password    : this.state.value.password,
                name        : this.state.value.name,
                userlevel   : this.state.value.userlevel,    
                school      : this.state.value.school,
                class       : this.state.value.class,
                subclass    : this.state.value.subclass,
            },
        })
    }

    onNameValueChangeHandler = (event) => {
        this.setState({
            value : {
                id          : this.state.value.id,
                username    : this.state.value.username,
                password    : this.state.value.password,
                name        : event.target.value,
                userlevel   : this.state.value.userlevel,    
                school      : this.state.value.school,
                class       : this.state.value.class,
                subclass    : this.state.value.subclass,
            },
        })
    }

    onPasswordValueChangeHandler = (event) => {
        this.setState({
            value : {
                id          : this.state.value.id,
                username    : this.state.value.username,
                password    : event.target.value,
                name        : this.state.value.name,
                userlevel   : this.state.value.userlevel,    
                school      : this.state.value.school,
                class       : this.state.value.class,
                subclass    : this.state.value.subclass,
            },
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
                                <button className="btn btn-sm btn-outline-primary btn__table__action" onClick={ this.onAddHandler }> <span className="fas fa-plus"></span> <span className="label">Tambah</span> </button>
                                <button className={"btn btn-sm btn-outline-warning btn__table__action" + ((this.state.selectedRows.length !== 1)?" disabled":"")} onClick={ this.onEditHandler } disabled={(this.state.selectedRows.length !== 1)}> <span className="fas fa-edit"></span> <span className="label">Ubah</span></button>
                                <button className={"btn btn-sm btn-outline-danger btn__table__action" + ((this.state.selectedRows.length === 0)?" disabled":"")}  onClick={ this.onDeleteHandler } disabled={(this.state.selectedRows.length ===0)}> <span className="fas fa-trash"></span> <span className="label">Hapus</span></button>
                                <button className="btn btn-sm btn-outline-success btn__table__action" onClick={ this.onDownloadHandler }> <span className="fas fa-file-download"></span> <span className="label">Export CSV</span></button>
                            </div>
                        </div>
                        <div className="admin-content-body">
                            <div className="admin-content-body data">
                                    
                                    {this.state.loading?  <span> <span className="fas fa-spinner spinning"></span> Loading...</span>:<TableComponent onSelectedRowsHandler={this.onSelectedRowsHandler} data={this.state._display} cols={columns} title="Daftar User"/>}
                            </div>
                        </div>
                    </div>

        const body = <span>
            <input type="hidden" value={this.state.value.id}/>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Username</label>
                </div>
                <div className="col-9">
                    <input type="text" className="form-control" disabled={this.state.overrideadd} value={this.state.value.username} onChange={this.onUsernameValueChangeHandler} placeholder="Username..."/>
                </div>
            </div>
            
            {
                (this.state.overrideadd)?<div className="form-group row">
                    <div className="col-3">
                        <label htmlFor="" className="control-label">Password</label>
                    </div>
                    <div className="col-9">
                        <input type="text" className="form-control" value={this.state.value.password} onChange={this.onPasswordValueChangeHandler} placeholder="Password..."/>
                    </div>
                </div>:""
            }
            
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Nama</label>
                </div>
                <div className="col-9">
                    <input type="text" className="form-control" value={this.state.value.name} onChange={this.onNameValueChangeHandler} placeholder="Nama"/>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Tingkat</label>
                </div>
                <div className="col-9">
                    <Select options={[{value:0,label:"Siswa"}, {value:3, label:"Admin"}]}  onChange={(value)=>{this.onSelectChangeHandler("userlevel", value)}} defaultValue={this.state.value.userlevel}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Sekolah</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Sekolah...'} 
                    isClearable={true} ref={this.schoolref} options={this.state._school} onChange={(value)=>{this.onSelectChangeHandler("school", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Kelas</label>
                </div>
                <div className="col-9">
                    <Select isDisabled={this.state.select.class.disabled}  ref={this.classref} 
                        isLoading={this.state.select.class.loading} isClearable={true} options={this.state.select.class.data} onChange={(value)=>{this.onSelectChangeHandler("class", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Sub- Kelas</label>
                </div>
                <div className="col-9">
                    <Select isDisabled={this.state.select.subclass.disabled} ref={this.subclassref} 
                        isLoading={this.state.select.subclass.loading} isClearable={true}  options={this.state.select.subclass.data} onChange={(value)=>{this.onSelectChangeHandler("subclass", value)}}></Select>
                </div>
            </div>
        </span>
                
        const addconfirm = <button type="button" className={"btn btn-primary btn-sm"+ (this.state.addsubmitting?" disabled":"")} disabled={this.state.addsubmitting} onClick={this.onSubmithandler}> {(this.state.addsubmitting? <span><span className="fas fa-spin spinning"></span> Sedang menambahkan...</span>:"Tambah")}</button>
        const ediconfirm = <button type="button" style={{ color:"white" }} className={"btn btn-warning btn-sm"+ (this.state.addsubmitting?" disabled":"")} disabled={this.state.addsubmitting} onClick={this.onUpdateHandler}> {(this.state.addsubmitting? <span><span className="fas fa-spin spinning"></span> Sedang menyimpan...</span>:"Simpan")}</button>
        const footer     = <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={this.onAddHideHandler}>Batal</button>
                {(this.state.overrideadd)? ediconfirm:addconfirm }
        </div>

        return(
            <span>
                <AdminContainer content={home} fakeAuth={this.props.fakeAuth} onActive={this.props.onActive} activeKey={this.props.activeKey} onAuth={this.props.onAuth}  redirectTo={this.props.redirectTo} navProvider={this.props.navProvider} ></AdminContainer>
                <ModalComponent title={(this.state.overrideadd === true)?"Ubah User":"Tambah User"} body={body} footer={footer} open={this.state.modaladd?true:false} onAddHideHandler={this.onAddHideHandler}></ModalComponent>
            </span>
        )
    }
}

export default UserContainer