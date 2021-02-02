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
    maxWidth:"100px",
  },
  {
    name: 'Topik',
    selector: 'topic',
    sortable: true,
    maxWidth:"100px",
  },
  {
    name: 'Kompetensi Inti',
    selector: 'core',
    sortable: true,
  },
  {
    name: 'Kelas',
    selector: 'class',
    sortable: true,
    maxWidth:"100px",
  },
  {
    name: 'Kompetensi Dasar',
    selector: 'description',
    sortable: true,
    minWidth : "500px"
  },
];
const swalinstance = withReactContent(Swal)

class KompetensiDasarContainer extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            selectedRows: [],
            modaladd : false,
            addsubmitting : false,
            overrideadd : false,
            select:{
                subjects:{
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                topics : {
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                cores : {
                    disabled : true,
                    loading  : true,
                    data     : [],
                }
            },
            value : {
                id          : "",
                name        : "",
                subject     : null,
                topic       : null,
                description : "",
                class       : "",
                core        : null,
            },
        }

        this.subjectref = React.createRef()
        this.topicref = React.createRef()
        this.coreref = React.createRef()
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/admin/competency/base/all",{
        },
        {withCredentials:true}).then((res)=>{
            new Promise((resolve, reject)=>{
                let {subjects , competencies } = res.data.data

                const _subjects = []
                const _datas    = []


                for(let i = 0 ; i< subjects.length ; ++i){
                    let element = subjects[i]
                    _subjects.push({
                        value          : element.id,
                        label          : element.name,
                        topics         : element.topics
                    })
                }

                for(let i =0 ; i < competencies.length; ++i){
                    _datas.push({
                        index   : i+1,
                        id      : competencies[i].id,
                        core    : competencies[i].coreCompetency.name,
                        core_id : competencies[i].coreCompetency.id,
                        description : competencies[i].description,
                        class   : competencies[i].class,
                        subject : competencies[i].subject.name,
                        subject_id: competencies[i].subject.id,
                        topic   : competencies[i].topic.name,
                        topic_id: competencies[i].topic.id
                    })
                }

                this.setState({
                    loading : false,
                    _display: _datas,
                    _datas  : _datas,
                    select:{
                        subjects:{
                            disabled : false,
                            loading  : false,
                            data     : _subjects,
                        },
                        topics : {
                            disabled : true,
                            loading  : true,
                            data     : [],
                        },
                        cores : {
                            disabled : true,
                            loading  : true,
                            data     : [],      
                        }
                    },
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
                    "topik"           : element.topic,
                    "kompetensi inti" : element.core,
                    "kelas"           : element.class,
                    "kompetensi dasar": element.description,
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
        const data = this.state.select.subjects.data
        let topics = null
        let cores  = null

        for(let i =0 ; i < data.length; ++i){
            if(data[i].value === this.state.selectedRows[0].subject_id){
                topics = data[i].topics
                for( let  j = 0 ; j < topics.length ; ++j){
                    if(topics[j].id === this.state.selectedRows[0].topic_id){
                        cores = topics[j].coreCompetencies
                        i = 99999
                        break
                    }
                }
            }
        }

        this.setState({
            modaladd : true,
            overrideadd : true,
            value : {
                id          : this.state.selectedRows[0].id,
                name        : this.state.selectedRows[0].name,
                subject     : {value : this.state.selectedRows[0].subject_id, label: this.state.selectedRows[0].subject, topics: topics},
                topic       : {value : this.state.selectedRows[0].topic_id, label: this.state.selectedRows[0].topic, cores : cores},
                class       : this.state.selectedRows[0].class,
                description : this.state.selectedRows[0].description,
                core        : {value : this.state.selectedRows[0].core_id , label :this.state.selectedRows[0].core}
            }
        }, () =>{
            this.subjectref.current.select.setValue(this.state.value.subject, 'set-value') 
            this.topicref.current.select.setValue(this.state.value.topic, 'set-value')
            this.coreref.current.select.setValue(this.state.value.core, 'set-value')           
        })
    }

    onAddHideHandler = ()=>{
        this.setState({
            modaladd : false,
            overrideadd : false,
            value : {
                id          : "",
                name        : "",
                subject     : null,
                topic       : null,
                description : "",
                class       : null,
                core        : null,
            }
        }, ()=>{
            this.subjectref.current.select.clearValue()
            this.topicref.current.select.clearValue()
            this.coreref.current.select.clearValue()
        })
    }

    onSubmithandler = ()=>{
        if( (this.state.value.subject === null)){
            swalinstance.fire({title:"Wajib memilih Mata Pelajaran!", icon:"error"})
            return
        }else if(this.state.value.topic === null){
            swalinstance.fire({title:"Wajib memilih Topik Mata Pelajaran!", icon:"error"})
            return
        }
        else if(this.state.value.core === null){
            swalinstance.fire({title:"Wajib memilih Kompetensi Inti!", icon:"error"})
            return
        }else if(this.state.value.description === "" || this.state.value.description === null){
            swalinstance.fire({title:"Kompetensi Dasar tidak boleh kosong!", icon:"error"})
            return
        }else{
            this.setState({
                addsubmitting:true
            })

            const value = this.state.value
            value.core_id = value.core.value
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/competency/base/store",{
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
        if( (this.state.value.subject === null)){
            swalinstance.fire({title:"Wajib memilih Mata Pelajaran!", icon:"error"})
            return
        }else if(this.state.value.topic === null){
            swalinstance.fire({title:"Wajib memilih Topik Mata Pelajaran!", icon:"error"})
            return
        }
        else if(this.state.value.core === null){
            swalinstance.fire({title:"Wajib memilih Kompetensi Inti!", icon:"error"})
            return
        }else if(this.state.value.description === "" || this.state.value.description === null){
            swalinstance.fire({title:"Kompetensi Dasar tidak boleh kosong!", icon:"error"})
            return
        }else{
            this.setState({
                addsubmitting:true
            })

            const value = this.state.value
            value.core_id = value.core.value
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/competency/base/update",{
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
                axios.post("/admin/competency/base/destroy",{
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
            let target = `${datas[i].core.toLowerCase()} ${datas[i].subject.toLowerCase()} ${datas[i].topic.toLowerCase()} ${datas[i].class.toLowerCase} ${datas[i].description.toLowerCase()}`
            let tf = new RegExp(search,"i").test(target)
            if(tf === true){
                display.push(datas[i])
            }
        }
        this.setState({
            _display : display
        })
    }

    onDescriptionChange = (event) =>{
        this.setState({
            value : {
                id      : this.state.value.id,
                name    : this.state.value.name,
                subject     : this.state.value.subject,
                topic       : this.state.value.topic,
                description : event.target.value,
                class       : this.state.value.class,
                core        : this.state.value.core,
            }
        })
    }

    onSelectChangeHandler = (name, value) =>{
        if(name === "subject"){
            const curvalue = this.state.value
            const topics = []
            const selects = this.state.select
            if(value === null){
                selects.topics = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }

                selects.cores = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            }else{
                value.topics.forEach(element =>{
                    topics.push({
                        value : element.id,
                        label : element.name,
                        cores : element.coreCompetencies
                    })
                })

                selects.topics = {
                    disabled : false,
                    loading  : false,
                    data     : topics
                }
            }

            curvalue.subject = value
            this.setState({
                select: selects,
                value : curvalue
            })
        }else if(name === "topic"){
            const curvalue = this.state.value
            const cores = []
            const selects = this.state.select

            if(value === null){
                selects.cores = {
                    disabled : true,
                    loading  : true,
                    data     : cores
                }
            }else{
                value.cores.forEach(element => {
                    cores.push({
                        value : element.id,
                        label : element.name,
                        class : element.class.name
                    })
                })
                selects.cores = {
                    disabled : false,
                    loading  : false,
                    data     : cores
                }
            }
            curvalue.topic = value
            this.setState({
                value  : curvalue,
                select : selects
            })
        }else if(name === "core"){
            const curvalue = this.state.value
            curvalue.class = value.class
            curvalue.core  = value
            this.setState({
                value:curvalue
            })
        }
    }

    render(){
        const home = <div className="admin-content-container">
                        <div className="admin-content-header">
                            <div className="admin-title">
                                <h2 style={{ marginBottom:"0" }}>Kompetensi Dasar</h2>
                                <small>
                                    <span>Admin</span> <span> / </span> <span> Kompetensi Dasar</span>
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
                                    {this.state.loading?  <span> <span className="fas fa-spinner spinning"></span> Loading...</span>:<TableComponent setSearch={this.setSearch} onSelectedRowsHandler={this.onSelectedRowsHandler} data={this.state._display} cols={columns} title="Daftar Kompetensi Dasar"/>}
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
                    <label htmlFor="" className="control-label">Topik</label>
                </div>
                <div className="col-9">
                    <Select isDisabled={this.state.select.topics.disabled}  ref={this.topicref} 
                        isLoading={this.state.select.topics.loading} options={this.state.select.topics.data} onChange={(value)=>{this.onSelectChangeHandler("topic", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Kelas</label>
                </div>
                <div className="col-9">
                    <input type="text" value={this.state.value.class} disabled className="form-control" placeholder="Pilih Kompetensi Inti"/>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Kompetensi Inti</label>
                </div>
                <div className="col-9">
                    <Select isDisabled={this.state.select.cores.disabled}  ref={this.coreref} 
                        isLoading={this.state.select.cores.loading} options={this.state.select.cores.data} onChange={(value)=>{this.onSelectChangeHandler("core", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Kompetensi Dasar</label>
                </div>
                <div className="col-9">
                    <textarea placeholder="Deskripsi" className="form-control" value={this.state.value.description} onChange={this.onDescriptionChange} />
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
                <ModalComponent title={(this.state.overrideadd === true)?"Ubah Kompetensi Dasar":"Tambah Kompetensi Dasar"} body={body} footer={footer} open={this.state.modaladd?true:false} onAddHideHandler={this.onAddHideHandler}></ModalComponent>
            </span>
        )
    }
}

export default KompetensiDasarContainer