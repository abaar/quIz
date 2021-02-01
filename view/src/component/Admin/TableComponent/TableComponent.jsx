import React from "react"
import DataTable from 'react-data-table-component';
import "./TableComponent.css"

class TableComponent extends React.Component{
    render(){
        return(
            <div>
                <div style={{ padding:"0px 0px 0px 16px" }}>
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm"><span className="fas fa-search"></span></span>
                        </div>
                        <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Cari data..."/>
                    </div>
                </div>
                <DataTable
                    overflowY={true}
                    pagination={true}
                    title={this.props.title}
                    columns={this.props.cols}
                    data={this.props.data}
                    selectableRows={true}
                    onSelectedRowsChange={this.props.onSelectedRowsHandler}
                    />
            </div>
        )
    }
}

export default TableComponent