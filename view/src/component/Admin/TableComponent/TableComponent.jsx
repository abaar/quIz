import React from "react"
import DataTable from 'react-data-table-component';
import "./TableComponent.css"

class TableComponent extends React.Component{

    convertArrayOfObjectsToCSV = (array) => {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            
            ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    downloadCSV = (array) => {
        const link = document.createElement('a');
        let csv = this.convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
      
        const filename = 'export.csv';
      
        if (!csv.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
        }
      
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }



    render(){
        return(
            <div>
                <div style={{ padding:"0px 0px 0px 16px" }}>
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-sm"><span className="fas fa-search"></span></span>
                        </div>
                        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Cari data..."/>
                    </div>
                </div>
                <DataTable
                    overflowY={true}
                    pagination={true}
                    title={this.props.title}
                    columns={this.props.cols}
                    data={this.props.data}
                    />
            </div>
        )
    }
}

export default TableComponent