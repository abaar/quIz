import React from "react"

import AdminContainer from "../AdminContainer"
import TableComponent from "../../../component/Admin/TableComponent/TableComponent"
import ModalComponent from "../../../component/ModalComponent/ModalComponent"
import axios from "axios"
import Select from 'react-select';
import Swal from "sweetalert2"
import withReactContent from 'sweetalert2-react-content'

import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

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
  },
  {
    name: 'Topik',
    selector: 'topic',
    sortable: true,
  },
  {
    name: 'Tipe',
    selector: 'type_str',
    sortable: true,
  },
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Waktu',
    selector: 'date',
    sortable: true,
  },
  {
    name: 'Random Soal',
    selector: 'randomques',
    sortable: true,
  },
  {
    name: 'Random Jawaban',
    selector: 'randomansw',
    sortable: true,
  },
  {
    name: 'Treshold',
    selector: 'treshold',
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
    name: 'Sub kelas',
    selector: 'subclass',
    sortable: true,
  },

];
const swalinstance = withReactContent(Swal)

const ExpandableComponent = ({ data }) => <span>asdasd</span>

class UjianContainer extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            selectedRows: [],
            modaladd : false,
            addsubmitting : false,
            overrideadd : false,
            select:{
                subject:{
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                topic : {
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                school : {
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                class : {
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                subclass : {
                    disabled : true,
                    loading  : true,
                    data     : []
                },
                algo :{
                    disabled : true,
                    loading  : true,
                    data     : [],
                }
            },
            value : {
                id          : "",
                type        : null,
                title       : "",
                description : "",
                subject     : null,
                topic       : null,
                date        : "",
                start       : "",
                end         : "",
                treshold    : null,
                school      : null,
                class       : null, 
                subclass    : null,
                randomanswer    : false,
                randomquestion  : false,
            },
        }

        this.subjectref = React.createRef()
        this.topicref   = React.createRef()
        this.schoolref  = React.createRef()
        this.classref   = React.createRef()
        this.subclassref= React.createRef()
        this.typeref    = React.createRef()
        this.tresholdref= React.createRef()
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/admin/test/all",{
        },
        {withCredentials:true}).then((res)=>{
            new Promise((resolve, reject)=>{
                let {subjects , tests, schools, algos } = res.data.data

                const _subjects = []
                const _datas    = []
                const _algos    = []
                const _school   = []

                for(let i = 0 ; i< subjects.length ; ++i){
                    let element = subjects[i]
                    _subjects.push({
                        value          : element.id,
                        label          : element.name,
                        topics         : element.topics
                    })
                }

                for(let i =0 ; i < schools.length; ++i){
                    _school.push({
                        value : schools[i].id,
                        label : schools[i].name,
                        class : schools[i].classes
                    })
                }

                const key = Object.keys(algos)
                for(let i =0 ; i < key.length; ++i){
                    _algos.push({
                        value : key[i],
                        label : algos[key[i]]
                    })
                }

                for(let i =0 ; i < tests.length; ++i){
                    _datas.push({
                        index       : (i+1),
                        id          : tests[i].id,
                        code        : tests[i].code,
                        type        : tests[i].type,
                        type_str    : (tests[i].type === 1)?"Adaptive":"Pilihan Ganda",
                        title       : tests[i].title,
                        description : tests[i].description,
                        topic_id    : tests[i].topic_id,
                        topic       : (tests[i].topic_id !== null)?tests[i].topic.name:"-",
                        subject_id  : tests[i].subject_id,
                        subject     : (tests[i].subject_id)?tests[i].subject.name:"-",
                        date        : tests[i].date,
                        start       : tests[i].start,
                        end         : tests[i].end,
                        treshold_code : tests[i].treshold_code,
                        treshold    : tests[i].treshold,
                        subclass_id : tests[i].subclass_id,
                        subclass    : (tests[i].subclass_id !== null )?tests[i].subclass.name:"-",
                        class_id    : tests[i].class_id,
                        class       : (tests[i].class_id !== null)? tests[i].class.name : "-",
                        school_id   : tests[i].school_id,
                        school      : (tests[i].school_id !== null )? tests[i].school.name : "-",
                        randomansw  : (tests[i].type === 1 || tests[i].randomanswers === 1)?"Random":"Urut",
                        randomques  : (tests[i].type === 1 || tests[i].randomquestion === 1)? "Random" :"Urut", 
                    })
                }

                const _selects = this.state.select
                _selects.subject = {
                    disabled : false,
                    loading  : false,
                    data     : _subjects,
                }

                _selects.school = {
                    disabled : false,
                    loading  : false,
                    data     : _school,
                }

                _selects.algo = {
                    disabled : false,
                    loading  : false,
                    data     : _algos,
                }

                this.setState({
                    loading : false,
                    _display: _datas,
                    _datas  : _datas,
                    select  : _selects,
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
                    "kompetensi dasar": element.base,
                    "indikator"       : element.description,
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
        // const data = this.state.select.subjects.data
        this.setState({

        }, () =>{
            this.subjectref.current.select.setValue(this.state.value.subject, 'set-value') 
            this.topicref.current.select.setValue(this.state.value.topic, 'set-value')
            this.schoolref.current.select.setValue(this.state.value.core, 'set-value')          
            this.classref.current.select.setValue(this.state.value.base , "set-value") 
            this.subclassref.current.select.setValue(this.state.value.specific , "set-value") 
        })
    }

    onAddHideHandler = ()=>{
        this.setState({
            modaladd : false,
            overrideadd : false,
            value : {
                id          : "",
                type        : null,
                title       : "",
                description : "",
                topic       : null,
                subject     : null,
                date        : "",
                start       : "",
                end         : "",
                treshold    : null,
                school      : null,
                class       : null, 
                subclass    : null,
                randomanswer    : false,
                randomquestion  : false,
            }
        }, ()=>{
            this.subjectref.current.select.clearValue()
            this.topicref.current.select.clearValue()
            this.coreref.current.select.clearValue()
            this.baseref.current.select.clearValue()
            this.specificref.current.select.clearValue()

        })
    }

    onSubmithandler = ()=>{
        if(this.state.value.title === "" || this.state.value.title === null){
            swalinstance.fire({title:"Judul Ujian tidak boleh kosong!", icon:"error"})
            return
        }
        else{
            this.setState({
                addsubmitting:true
            })

            const value = this.state.value
            console.log(value)

            // axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            // axios.post("/admin/question/question/store",{
            //     value:valuex
            // },
            // {withCredentials:true}).then((res)=>{
            //     this.setState({
            //         addsubmitting:false,
            //     })
            //     if(res.data.status){
            //         swalinstance.fire({title:"Berhasil", text:res.data.message, icon:"success"}).then(()=>{
            //             this.props.remount()
            //         })
            //     }else{
            //         swalinstance.fire({title:"Gagal", text:res.data.message, icon:"error"})
            //     }
            // })
        }
    }

    onUpdateHandler = () =>{
      
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
                axios.post("/admin/question/question/destroy",{
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
            let target = `${datas[i].core.toLowerCase()} ${datas[i].subject.toLowerCase()} ${datas[i].topic.toLowerCase()} ${datas[i].class.toLowerCase} ${datas[i].base.toLowerCase()} ${datas[i].description.toLowerCase()}`
            let tf = new RegExp(search,"i").test(target)
            if(tf === true){
                display.push(datas[i])
            }
        }
        this.setState({
            _display : display
        })
    }


    onValueChange = (name, event) =>{
        const value = this.state.value
        value[name] = event.target.value

        this.setState({
            value : value
        })
    }

    onCheckChange = (name)=>{
        const value = this.state.value
        value[name] = !value[name]

        this.setState({
            value:value
        })
    }


    onSelectChangeHandler = (name, value) =>{
        const curvalue = this.state.value
        const select   = this.state.select
        if(name === "school"){
            this.classref.current.select.clearValue()
            this.subclassref.current.select.clearValue()
            curvalue.school = value

            let classes = []
            if(value === null){

                curvalue.school   = null
                curvalue.class    = null
                curvalue.subclass = null
                select.class = {
                    disabled : true,
                    loading  : true,
                    data     : [],
                }

                select.subclass = {
                    disabled : true,
                    loading  : true,
                    data     : [],
                }
            }else{
                value.class.forEach(element =>{
                    classes.push({
                        value    : element.id,
                        label    : element.name,
                        subclass : element.subclass,
                    })
                })

                select.class = {
                    disabled : false,
                    loading  : false,
                    data     : classes,
                }

                select.subclass = {
                    disabled : true,
                    loading  : true,
                    data     : [],
                }
            }

            this.setState({
                value : curvalue,
                select: select,
            })

        }else if(name === "class"){
            this.subclassref.current.select.clearValue()
            curvalue.class  = value

            if( value === null ){
                select.subclass = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            }else{
                let subclass = []
                value.subclass.forEach(element =>{
                    subclass.push({
                        value    : element.id,
                        label    : element.name,
                    })
                })

                select.subclass = {
                    disabled : false,
                    loading  : false,
                    data     : subclass
                }
            }
            this.setState({
                value : curvalue,
                select: select
            })

        }else if(name === "subclass"){
            curvalue.subclass  = value 
            this.setState({
                value : curvalue,
            })
        }else if(name === "subject"){
            this.topicref.current.select.clearValue()
            curvalue.topic = value
            
            if(value === null){
                select.topic = {
                    disabled : true,
                    loading  : true,
                    data     : [],
                }
            }else{
                let topics = []

                value.topics.forEach(element => {
                    topics.push({value : element.id, label : element.name})
                })

                select.topic = {
                    disabled : false,
                    loading  : false,
                    data     : topics,
                }
            }

            this.setState({
                value : curvalue,
                select: select,
            })

        }else if(name === "topic"){
            curvalue.topic  = value 
            this.setState({
                value : curvalue,
            })
        }else if(name === "type"){
            if(value.value === 0){
                select.algo = {
                    disabled : false,
                    loading  : false,
                    data     : this.state.select.algo.data,
                }
            }else{
                this.tresholdref.current.select.clearValue()
                select.algo = {
                    disabled : true,
                    loading  : true,
                    data     : this.state.select.algo.data,
                }
            }
            curvalue.type = value.value
            this.setState({
                value : curvalue,
                select: select
            })
        }else if(name === "algo"){
            curvalue.treshold  = value 
            this.setState({
                value : curvalue,
            })
        }
    }


    render(){
        const home = <div className="admin-content-container">
                        <div className="admin-content-header">
                            <div className="admin-title">
                                <h2 style={{ marginBottom:"0" }}>Kelola Ujian</h2>
                                <small>
                                    <span>Admin</span> <span> / </span> <span> Kelola Ujian</span>
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
                                    {this.state.loading?  <span> <span className="fas fa-spinner spinning"></span> Loading...</span>:<TableComponent onSelectedRowsHandler={this.onSelectedRowsHandler} data={this.state._display} cols={columns} expandableRows={true}  expandableRowsComponent={<ExpandableComponent />} title="Daftar Ujian"/>}
                            </div>
                        </div>
                    </div>
        
        const body = <span>
            <input type="hidden" value={this.state.value.id}/>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Title</label>
                </div>
                <div className="col-9">
                    <input type="text" value={this.state.value.title} onChange={(event)=>{this.onValueChange("title",event)}} className="form-control" placeholder="Judul Ujian"/>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Deskripsi Ujian</label>
                </div>
                <div className="col-9">
                    <textarea type="text" value={this.state.value.description} onChange={(event)=>{this.onValueChange("description",event)}} className="form-control" placeholder="Deskripsi"/>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">

                </div>
                <div className="col-9">
                    <label htmlFor="randomquestion">
                        <input name="randomquestion" type="checkbox" checked={(this.state.value.randomquestion === 1 || this.state.value.randomquestion === true)} onChange={(event)=>{this.onCheckChange("randomquestion")}} />  Urutan soal Random
                    </label>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">

                </div>
                <div className="col-9">
                    <label htmlFor="randomanswer">
                        <input name="randomanswer" type="checkbox" checked={(this.state.value.randomanswer === 1 || this.state.value.randomanswer === true)} onChange={(event)=>{this.onCheckChange("randomanswer")}} /> Urutan jawaban Random
                    </label>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Tipe Ujian</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Tipe Ujian...'} 
                    isClearable={true} ref={this.typeref} options={[{value:1,label:"Adaptif Assesment"}, {value:0, label:"Pilihan Ganda"}]} onChange={(value)=>{this.onSelectChangeHandler("type", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Treshold/Algo</label>
                </div>
                <div className="col-9">
                <Select placeholder={'Pilih Treshold / Algo...'} isDisabled={this.state.select.algo.disabled}  ref={this.tresholdref} 
                        isLoading={this.state.select.algo.loading} isClearable={true} options={this.state.select.algo.data} onChange={(value)=>{this.onSelectChangeHandler("algo", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Sekolah</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Sekolah...'} 
                    isClearable={true} ref={this.schoolref} options={this.state.select.school.data} onChange={(value)=>{this.onSelectChangeHandler("school", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Kelas</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Kelas...'} isDisabled={this.state.select.class.disabled}  ref={this.classref} 
                        isLoading={this.state.select.class.loading} isClearable={true} options={this.state.select.class.data} onChange={(value)=>{this.onSelectChangeHandler("class", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Sub - Kelas</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Sub Kelas...'} isDisabled={this.state.select.subclass.disabled} ref={this.subclassref} 
                        isLoading={this.state.select.subclass.loading} isClearable={true}  options={this.state.select.subclass.data} onChange={(value)=>{this.onSelectChangeHandler("subclass", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Mata Pelajaran</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Mata Pelajaran...'} isDisabled={this.state.select.subject.disabled} ref={this.subjectref} 
                        isLoading={this.state.select.subject.loading} isClearable={true}  options={this.state.select.subject.data} onChange={(value)=>{this.onSelectChangeHandler("subject", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Topik</label>
                </div>
                <div className="col-9">
                    <Select placeholder={'Pilih Topik...'} isDisabled={this.state.select.topic.disabled} ref={this.topicref} 
                        isLoading={this.state.select.topic.loading} isClearable={true}  options={this.state.select.topic.data} onChange={(value)=>{this.onSelectChangeHandler("topic", value)}}></Select>
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
                <ModalComponent title={(this.state.overrideadd === true)?"Ubah Ujian":"Tambah Ujian"} body={body} footer={footer} open={this.state.modaladd?true:false} onAddHideHandler={this.onAddHideHandler}></ModalComponent>
            </span>
        )
    }
}

export default UjianContainer