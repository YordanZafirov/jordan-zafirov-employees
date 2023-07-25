import React, { useState } from 'react';
import Papa from 'papaparse';
import ResultTable from './ResultTable';

const UploadFile = () => {
    const [data, setData] = useState([]);
    const [values, setValues] = useState();

    const handleFile = e => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: result => {
                const valuesArr = [];
                result.data.map(d => {
                    valuesArr.push(Object.values(d));
                });
                setData(result.data);
                setValues(valuesArr);
            },
        });
        console.log(values);
    };

    return (
        <div>
            <input 
            type="file"
            name="file"
            accept=".csv"
            onChange={handleFile} />

            <br />
            {data.length > 0 && <ResultTable values={values}/>}
            
        </div>
    );
};

export default UploadFile;