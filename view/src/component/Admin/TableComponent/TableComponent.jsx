import React from "react"
import DataTable from 'react-data-table-component';
import "./TableComponent.css"

class TableComponent extends React.Component{


    constructor(props){
        super(props)
        this.state = {
            inDebounce : null,
        }
    }

    setSearch = (event) => setTimeout(() => {
        this.props.setSearch(event.target.value)
    }, 1000)


    onSearchInputChange = (event) =>{
        if("setSearch" in this.props){
            clearInterval(this.state.inDebounce)
            this.setState({
                inDebounce:this.setSearch(event)
            })
        }
    }

    render(){
        return(
            <div>
                <div style={{ padding:"0px 0px 0px 16px" }}>
                    {("setSearch" in this.props)? <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm"><span className="fas fa-search"></span></span>
                        </div>
                        <input type="text" className="form-control" onChange={(event)=>{this.onSearchInputChange(event)}} placeholder="Cari data..."/>
                    </div>:""}
                </div>
                <DataTable
                    overflowY={true}
                    
                    pagination={("pagination" in this.props)?this.props.pagination:true}
                    title={this.props.title}
                    columns={this.props.cols}
                    data={this.props.data}
                    selectableRows={true}
                    onSelectedRowsChange={this.props.onSelectedRowsHandler}
                    selectableRowSelected={("preselect" in this.props)? this.props.preselect: false}
                    expandableRows={("expandableRows" in this.props)}
                    expandableRowsComponent={("expandableRows" in this.props)?this.props.expandableRowsComponent:<span></span>}
                    />
            </div>
        )
    }
}

export default TableComponent