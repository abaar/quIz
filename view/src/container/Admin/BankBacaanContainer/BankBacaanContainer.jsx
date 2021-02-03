import React from "react"

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
    name: 'Mata Pelajaran',
    selector: 'subject',
    sortable: true,
    maxWidth:"150px",
},
{
    name: 'Judul',
    selector: 'name',
    sortable: true,
    maxWidth:"150px",
  },
  {
    name: 'Bacaan',
    cell: row => <span style={{ whiteSpace:"pre-wrap" }}>{row.passage}</span>,
    sortable: true,
  },
];
const swalinstance = withReactContent(Swal)

class BankBacaanContainer extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            selectedRows: [],
            modaladd : false,
            addsubmitting : false,
            overrideadd : false,
            value : {
                id          : "",
                name        : "",
                bacaan      : "",
                subject     : null,
            },
            select : {
                subjects : {
                    disabled:true,
                    loading :true,
                    data : []
                }
            }
        }

        this.subjectref = React.createRef()
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/admin/question/passage/all",{
        },
        {withCredentials:true}).then((res)=>{
            new Promise((resolve, reject)=>{
                let {subjects, passages} = res.data.data
                const _datas = []
                const _subject = []

                subjects.forEach(element => {
                    _subject.push({value :element.id, label:element.name})
                })

                for(let i = 0 ; i< passages.length ; ++i){
                    let element = passages[i]
                    _datas.push({
                        index       : (i+1),
                        id          : element.id,
                        name        : element.name,
                        passage     : element.passage,
                        subject_id  : element.subject_id,
                        subject     : element.subject.name
                    })
                }

                this.setState({
                    _display: _datas,
                    _datas : _datas,
                    select :{
                        subjects : {
                            disabled:false,
                            loading :false,
                            data : _subject
                        }
                    }
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
                    "no"              : element.index,
                    "mata pelajaran"  : element.subject,
                    "nama judul"      : element.name,
                    "bacaan"          : element.bacaan
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

    onEditHandler = () => {
        this.setState({
            modaladd : true,
            overrideadd : true,
            value : {
                id          : this.state.selectedRows[0].id,
                name        : this.state.selectedRows[0].name,
                bacaan      : this.state.selectedRows[0].passage,
                subject     : {value : this.state.selectedRows[0].subject_id , label : this.state.selectedRows[0].name}
            }
        }, () => {
            this.subjectref.current.select.setValue(this.state.value.subject, "set-value")
        })
    }

    onAddHideHandler = ()=>{
        this.setState({
            modaladd : false,
            overrideadd : false,
            value : {
                id          : "",
                name        : "",
                bacaan      : "",
                subject     : null,
            }
        },
         () =>{
             this.subjectref.current.select.clearValue()
         })
    }

    onSubmithandler = ()=>{
        if( (this.state.value.name === null) || (this.state.value.name === "") ){
            swalinstance.fire({title:"Nama tidak boleh kosong!", icon:"error"})
            return
        }else if( (this.state.value.bacaan === null) || (this.state.value.bacaan === "") ){
            swalinstance.fire({title:"Nama tidak boleh kosong!", icon:"error"})
            return
        }else if (this.state.value.subject === null){
            swalinstance.fire({title:"Pilihlah mata pelajaran!", icon : "error"})
        }
        else{
            this.setState({
                addsubmitting:true
            })
            const value = this.state.value
            value.subject_id = value.subject.value

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/question/passage/store",{
                value:value
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
        if( (this.state.value.name === null) || (this.state.value.name === "") ){
            swalinstance.fire({title:"Nama tidak boleh kosong!", icon:"error"})
            return
        }else if( (this.state.value.bacaan === null) || (this.state.value.bacaan === "") ){
            swalinstance.fire({title:"Nama tidak boleh kosong!", icon:"error"})
            return
        }else if (this.state.value.subject === null){
            swalinstance.fire({title:"Pilihlah mata pelajaran!", icon : "error"})
        }else{
            this.setState({
                addsubmitting:true
            })
            const value = this.state.value
            value.subject_id = value.subject.value

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/question/passage/update",{
                value:value
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
            allowOutsideClick: () => !swalinstance.isLoading()
        }).then((click)=>{
            if(click.isConfirmed){
                let value_ids = [];

                for(let i =0 ; i < this.state.selectedRows.length; ++i){
                    value_ids.push(this.state.selectedRows[i].id)
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
                axios.post("/admin/question/passage/destroy",{
                    value_ids:value_ids
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

    setSearch = (search) => {
        const datas   =  this.state._datas
        const display = []
        for(let i =0 ; i < datas.length ; ++i){
            let target = `${datas[i].name.toLowerCase()} ${datas[i].subject.toLowerCase()} ${datas[i].bacaan.toLowerCase()}`
            let tf = new RegExp(search.toLowerCase(),"i").test(target)
            if(tf === true){
                display.push(datas[i])
            }
        }
        this.setState({
            _display : display
        })
    }

    onValueChange = (what,event) => {
        const cvalue = this.state.value
        cvalue[what] = event.target.value
        this.setState({
            value : cvalue
        })
    }

    onSelectChangeHandler = (name, value) =>{
        if(name === "subject"){
            const cvalue = this.state.value
            cvalue.subject = value
            this.setState({
                value : cvalue
            })
        }
    }

    render(){
        const home = <div className="admin-content-container">
                        <div className="admin-content-header">
                            <div className="admin-title">
                                <h2 style={{ marginBottom:"0" }}>Bank Bacaan</h2>
                                <small>
                                    <span>Admin</span> <span> / </span> <span> Bank Bacaan</span>
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
                                    {this.state.loading?  <span> <span className="fas fa-spinner spinning"></span> Loading...</span>:<TableComponent setSearch={this.setSearch} onSelectedRowsHandler={this.onSelectedRowsHandler} data={this.state._display} cols={columns} title="Daftar Bacaan"/>}
                            </div>
                        </div>
                    </div>

        const body = <span>
            <input type="hidden" value={this.state.value.id}/>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Mata Pelajaran</label>
                </div>
                <div className="col-9">
                    <Select isDisabled={this.state.select.subjects.disabled}  ref={this.subjectref} 
                        isLoading={this.state.select.subjects.loading} options={this.state.select.subjects.data} onChange={(value)=>{this.onSelectChangeHandler("subject", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Nama</label>
                </div>
                <div className="col-9">
                    <input type="text" className="form-control" value={this.state.value.name} onChange={(event)=>{this.onValueChange("name",event)}} placeholder="Judul / Nama Bacaan..."/>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Bacaan</label>
                </div>
                <div className="col-9">
                    <textarea rows="10" placeholder="Bacaan" className="form-control" value={this.state.value.bacaan} onChange={(event)=>{this.onValueChange("bacaan",event)}} />
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
                <ModalComponent title={(this.state.overrideadd === true)?"Ubah Bacaan":"Tambah Bacaan"} body={body} footer={footer} open={this.state.modaladd?true:false} onAddHideHandler={this.onAddHideHandler}></ModalComponent>
            </span>
        )
    }
}

export default BankBacaanContainer