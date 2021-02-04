import React from "react"

import AdminContainer from "../AdminContainer"
import TableComponent from "../../../component/Admin/TableComponent/TableComponent"
import ModalComponent from "../../../component/ModalComponent/ModalComponent"
import katex from "katex"
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
    maxWidth:"100px",
  },
  {
    name: 'Soal',
    cell: row => <div data-tag="allowRowEvents">{(row.is_katex === 1? row.katek:row.label)}</div>,
    minWidth : "500px"
  },
  {
    name : "Komponen Foto",
    cell : row => <div data-tag="allowRowEvents">{(row.image === null)? "-": <img src={row.image} alt={"Soal " + row.label}/>}</div>
  },
];
const swalinstance = withReactContent(Swal)

const ExpandableComponent = ({ data }) => <span> {(data.specific_raw.length !== 0)?data.specific:""} <br/> {(data.answers)}</span>

class BankSoalContainer extends React.Component{
    
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
                },
                bases : {
                    disabled : true,
                    loading  : true,
                    data     : [],
                },
                specific : {
                    disabled : true,
                    loading  : true,
                    data     : []
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
                base        : null,
                specific    : null,
                is_katex    : 0,
                answers     : [],
            },
        }

        this.subjectref = React.createRef()
        this.topicref   = React.createRef()
        this.coreref    = React.createRef()
        this.baseref    = React.createRef()
        this.specificref= React.createRef()
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
        axios.get("/admin/question/question/all",{
        },
        {withCredentials:true}).then((res)=>{
            new Promise((resolve, reject)=>{
                let {subjects , questions } = res.data.data

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

                for(let i =0 ; i < questions.length; ++i){
                    const answers = []
                    for( let j =0 ; j <questions[i].answers.length; ++j){
                        answers.push(<li key={j+1} style={{ listStyle:"none" }}> {"Pilihan " + (j+1) +" => "} {questions[i].answers[j].label}</li>) 
                    }

                    const specifics = []
                    for ( let j =0 ; j < questions[i].specificCompetencies.length; ++j){
                        specifics.push(<li key={j+1}>{questions[i].specificCompetencies[j].description}</li>)
                    }

                    _datas.push({
                        index : (i+1),
                        id : questions[i].id,
                        subject : (questions[i].subject === null )? "-" : questions[i].subject.name,
                        subject_id : (questions[i].subject === null )? null : questions[i].subject.id,

                        image : questions[i].path_image,
                        is_katex : questions[i].is_katex,
                        katek : <BlockMath math={questions[i].question} renderError={(error) => {
                            return <b>TeX Salah!: {error.name}</b>
                        }}/>,
                        label : questions[i].question,
                        answers : <ul>{answers}</ul>,
                        answers_raw : questions[i].answers,
                        specific_raw : questions[i].specificCompetencies,
                        specific : <ul>{specifics}</ul>,

                        true_count : questions[i].true_count,
                        false_count : questions[i].false_count,

                        class: (questions[i].specificCompetencies.length !==0)? questions[i].specificCompetencies[0].specificCompetency.class:null,
                        topic: (questions[i].specificCompetencies.length !==0)? questions[i].specificCompetencies[0].specificCompetency.topic:null,
                        core: (questions[i].specificCompetencies.length !==0)? questions[i].specificCompetencies[0].specificCompetency.coreCompetency:null,
                        base: (questions[i].specificCompetencies.length !==0)? questions[i].specificCompetencies[0].specificCompetency.baseCompetency:null
                    })
                }

                const _selects = this.state.select
                _selects.subjects = {
                    disabled : false,
                    loading  : false,
                    data     : _subjects,
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
        const data = this.state.select.subjects.data
        let subject_id, topic_id, core_id, base_id;

        subject_id = this.state.selectedRows[0].subject_id
        topic_id = this.state.selectedRows[0].topic !== null ? this.state.selectedRows[0].topic.id : null
        core_id = this.state.selectedRows[0].core !== null ? this.state.selectedRows[0].core.id : null
        base_id = this.state.selectedRows[0].base !== null ? this.state.selectedRows[0].base.id : null

        let topics = []
        let cores  = []
        let bases  = []
        let specifics = []

        for(let i =0 ; i < data.length; ++i){
            if(subject_id === null){
                break
            }
            if(data[i].value === subject_id){
                topics = data[i].topics
                for( let  j = 0 ; j < topics.length ; ++j){
                    if(topics[j].id === topic_id){
                        cores = topics[j].coreCompetencies
                        for ( let k = 0 ; k < cores.length; ++ k){
                            if(cores[k].id === core_id){
                                bases = cores[k].baseCompetencies
                                for(let l = 0 ; l < bases.length; ++l){
                                    if(bases[l].id === base_id){
                                        specifics = bases[l].specificCompetencies
                                        k = Number.MAX_SAFE_INTEGER
                                        break
                                    }
                                }
                                j = Number.MAX_SAFE_INTEGE
                                break
                            }
                        }
                        i = Number.MAX_SAFE_INTEGE
                        break
                    }
                }
            }
        }


        let subject_label = this.state.selectedRows[0].subject
        let topic_label = this.state.selectedRows[0].topic !== null ? this.state.selectedRows[0].topic.name : null
        let core_label = this.state.selectedRows[0].core !== null ? this.state.selectedRows[0].core.name : null
        let base_label = this.state.selectedRows[0].base !== null ? this.state.selectedRows[0].base.name : null

        const selected_specific = []
        for(let i =0 ; i< this.state.selectedRows[0].specific_raw.length; ++i){
            selected_specific.push({id: this.state.selectedRows[0].specific_raw[i].id , value: this.state.selectedRows[0].specific_raw[i].specificCompetency.id, label: this.state.selectedRows[0].specific_raw[i].specificCompetency.description })
        }

        const answers = []
        for(let i =0 ; i< this.state.selectedRows[0].answers_raw.length; ++i){
            answers.push({id: this.state.selectedRows[0].answers_raw[i].id, label: this.state.selectedRows[0].answers_raw[i].label, is_correct : (this.state.selectedRows[0].answers_raw[i].is_correct===1) })
        }


        this.setState({
            modaladd : true,
            overrideadd : true,
            value : {
                id          : this.state.selectedRows[0].id,
                subject     : (subject_id !== null)?{value : subject_id, label: subject_label, topics: topics}:null,
                topic       : (topic_id !== null)?{value : topic_id, label: topic_label, cores : cores}:null,
                class       : this.state.selectedRows[0].class,
                description : this.state.selectedRows[0].label,
                core        : (core_id !== null)?{value : core_id , label :core_label, bases : bases}:null,
                base        : (base_id !== null)?{value : base_id , label : base_label, specs : specifics}:null,
                specific    : selected_specific,
                is_katex    : this.state.selectedRows[0].is_katex,
                answers     : answers,
                true_count  : this.state.selectedRows[0].true_count,
                false_count : this.state.selectedRows[0].false_count,
                katex_obj   : <BlockMath math={`${this.state.selectedRows[0].label}`} renderError={(error) => {
                    return <b>TeX Salah!: {error.name}</b>
                }}/>
            }
        }, () =>{

            if(selected_specific.length !== 0){
                this.subjectref.current.select.setValue(this.state.value.subject, 'set-value') 
                this.topicref.current.select.setValue(this.state.value.topic, 'set-value')
                this.coreref.current.select.setValue(this.state.value.core, 'set-value')          
                this.baseref.current.select.setValue(this.state.value.base , "set-value") 
                this.specificref.current.select.setValue(this.state.value.specific , "set-value") 
            }
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
                class       : "",
                core        : null,
                base        : null,
                specific    : null,
                is_katex    : 0,
                answers     : [],
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
        if(this.state.value.description === "" || this.state.value.description === null){
            swalinstance.fire({title:"Soal tidak boleh kosong!", icon:"error"})
            return
        }else if(this.state.value.answers.length === 0){
            swalinstance.fire({title:"Miminal ada 1 jawaban!", icon:"error"})
            return
        }
        else{
            this.setState({
                addsubmitting:true
            })

            const value = this.state.value
            let valuex = {
                passage_id : value.passage_id,
                question   : value.description,
                is_katex   : value.is_katex,
                path_image : value.image,
                answers    : value.answers,
                specifics  : value.specific,
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/question/question/store",{
                value:valuex
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
        if(this.state.value.description === "" || this.state.value.description === null){
            swalinstance.fire({title:"Soal tidak boleh kosong!", icon:"error"})
            return
        }else if(this.state.value.answers.length === 0){
            swalinstance.fire({title:"Miminal ada 1 jawaban!", icon:"error"})
            return
        }else{
            this.setState({
                addsubmitting:true
            })

            const value = this.state.value
            let valuex = {
                id         : value.id,
                passage_id : value.passage_id,
                question   : value.description,
                is_katex   : value.is_katex,
                path_image : value.image,
                answers    : value.answers,
                specifics  : value.specific,
                true_count : value.true_count,
                false_count: value.false_count,
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.fakeAuth.data.user.token}` 
            axios.post("/admin/question/question/update",{
                value:valuex
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

    onDescriptionChange = (event) =>{
        const value = this.state.value
        value.description = event.target.value
        value.katex_obj = <BlockMath math={`${this.state.value.description}`} renderError={(error) => {
            return <b>TeX Salah!: {error.name}</b>
        }}/>
        this.setState({
            value : value
        })
    }

    onKatexChange = (event) =>{
        const value = this.state.value
        value.is_katex = !(value.is_katex === 1 || value.is_katex === true )
        value.katex_obj = <BlockMath math={`${this.state.value.description}`} renderError={(error) => {
            return <b>TeX Salah!: {error.name}</b>
        }}/>
        this.setState({
            value : value
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

                selects.bases = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }

                selects.specific = {
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

                selects.bases = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }

                selects.specific = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            }else{
                value.cores.forEach(element => {
                    cores.push({
                        value : element.id,
                        label : element.name,
                        class : element.class.name,
                        bases : element.baseCompetencies
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
            const selects  = this.state.select

            const bases = []
            if(value === null){
                selects.bases = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }

                selects.specific = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            }else{
                curvalue.class = value.class
                value.bases.forEach(element => {
                    bases.push({
                        value : element.id,
                        label : element.description,
                        specs : element.specificCompetencies
                    })
                })
                selects.bases = {
                    disabled : false,
                    loading  : false,
                    data     : bases
                }
            }
            curvalue.core  = value
            this.setState({
                value:curvalue,
                select : selects
            })
        }else if(name === "base"){
            const curvalue = this.state.value
            const selects  = this.state.select

            const specifics = []
            if(value === null){
                selects.specific = {
                    disabled : true,
                    loading  : true,
                    data     : []
                }
            }else{
                value.specs.forEach(element => {
                    specifics.push({
                        value : element.id,
                        label : element.description
                    })
                })

                selects.specific = {
                    disabled : false,
                    loading  : false,
                    data     : specifics,
                }
            }
            curvalue.base = value
            this.setState({
                value : curvalue
            })
        }else if (name === "specific"){
            const curvalue  = this.state.value
            curvalue.specific = value

            this.setState({
                value : curvalue,
            })
        }
    }

    addAnswer = ()=>{
        const value = this.state.value
        value.answers.push({
            label : "",
            is_correct: false,
        })

        this.setState({
            value:value
        })
    }

    delAnswer = (key) =>{
        const answers = this.state.value.answers

        answers.splice(key,1)

        const value = this.state.value
        value.answers = answers

        this.setState({
            value:value
        })
    }   

    onAnswerChange = (key, event)=>{
        const value = this.state.value
        value.answers[key].label = event.target.value

        this.setState({
            value:value
        })
    }

    onAnswersCheck = (key)=>{
        const value = this.state.value
        value.answers[key].is_correct = !value.answers[key].is_correct

        this.setState({
            value:value
        })
    }

    render(){
        const home = <div className="admin-content-container">
                        <div className="admin-content-header">
                            <div className="admin-title">
                                <h2 style={{ marginBottom:"0" }}>Bank Soal</h2>
                                <small>
                                    <span>Admin</span> <span> / </span> <span> Bank Soal</span>
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
                                    {this.state.loading?  <span> <span className="fas fa-spinner spinning"></span> Loading...</span>:<TableComponent setSearch={this.setSearch} onSelectedRowsHandler={this.onSelectedRowsHandler} data={this.state._display} cols={columns} expandableRows={true}  expandableRowsComponent={<ExpandableComponent />} title="Daftar Soal"/>}
                            </div>
                        </div>
                    </div>
        
        const answers = []
        for(let i =0 ; i < this.state.value.answers.length; ++i){
            answers.push(
                <div className="form-group row" key={i+1}>
                    <div className="col-3">
                        <label htmlFor="" className="control-label required">Jawaban {i+1}</label>
                    </div>
                    <div className="col-8">
                        <input placeholder="Jawaban" className="form-control" value={this.state.value.answers[i].label} onChange={(event)=>{this.onAnswerChange(i,event)}} />
                    </div>
                    <div className="col-1">
                        <button className="btn btn-danger" onClick={()=>{this.delAnswer(i)}}><span className="fas fa-trash"></span></button>
                    </div>

                    <div className="col-3">
                    </div>
                    <div className="col-9">
                        <label htmlFor="">
                            <input name="" type="checkbox" checked={(this.state.value.answers[i].is_correct)} onChange={(event)=>this.onAnswersCheck(i)} /> Apakah jawaban kunci?
                        </label>
                    </div>
                </div>
            )
        }

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
                    <label htmlFor="" className="control-label">Kompetensi Dasar</label>
                </div>
                <div className="col-9">
                    <Select isDisabled={this.state.select.bases.disabled}  ref={this.baseref} 
                        isLoading={this.state.select.bases.loading} options={this.state.select.bases.data} onChange={(value)=>{this.onSelectChangeHandler("base", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label">Indikator</label>
                </div>
                <div className="col-9">
                    <Select isMulti={true} isDisabled={this.state.select.specific.disabled}  ref={this.specificref} 
                        isLoading={this.state.select.specific.loading} options={this.state.select.specific.data} onChange={(value)=>{this.onSelectChangeHandler("specific", value)}}></Select>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">
                    <label htmlFor="" className="control-label required">Soal</label>
                </div>
                <div className="col-9">
                    <textarea placeholder="Soal" className="form-control" value={this.state.value.description} onChange={this.onDescriptionChange} />
                </div>
            </div>
            <div className="form-group row">
                <div className="col-3">

                </div>
                <div className="col-9">
                    <label htmlFor="is_katex">
                        <input name="is_katex" type="checkbox" checked={(this.state.value.is_katex === 1 || this.state.value.is_katex === true)} onChange={this.onKatexChange} /> Apakah soal merupakan teks TeX?
                    </label>
                </div>
            </div>
            {(this.state.value.is_katex === true || this.state.value.is_katex ===1)? <div className="form-group">
                <div className="col-3">
                </div>
                <div className="col-9">
                    {this.state.value.katex_obj}
                </div>
            </div>:""}
            {answers}
            <div style={{ textAlign:"center" }}>
                <button className="btn btn-outline-primary" onClick={this.addAnswer}>Tambah Jawaban</button>
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
                <ModalComponent title={(this.state.overrideadd === true)?"Ubah Soal":"Tambah Soal"} body={body} footer={footer} open={this.state.modaladd?true:false} onAddHideHandler={this.onAddHideHandler}></ModalComponent>
            </span>
        )
    }
}

export default BankSoalContainer