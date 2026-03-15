const ss = require('simple-statistics')
const chardet = require('chardet')
const fs = require('fs')

class DatasetEngine{

  constructor(data){
    if(!data) throw new Error("Data cannot be empty")
    this.data = data;
  }

  analyze(){
    console.log("...Analyzing Columns...")
    const columns = Object.keys(this.data[5])

    const report = {}

    for(const col of columns){
      const rawValues = this.data.map(row => row[col])

      const numericValues = rawValues.map(v => parseFloat(v)).filter(v => !Number.isNaN(v))

      const isAllNumber = numericValues.length === rawValues.length ;
      const stats = this.computeStats(rawValues,numericValues,isAllNumber) // Mean/Median/Mode/Min/Max
      const schema = this.detectSchema(rawValues,numericValues) // data type of each column

      report[col] = {schema,stats}
    }
    console.log("...Analyzing Ended...")
    return report;
  }

// we will get the parsed data and do some analysis on it return 
// columns analysis
  computeStats(rawValues,numericValues,isAllNumber){
   // detect missing values / Unique values
    const missing = rawValues.filter(v => v === '' || v == null || v === 'NaN').length;
    const unique = new Set(rawValues).size

    let mathStats = {}
    if(numericValues.length>0){
      mathStats = {
        missing  :   missing,
        unique   :   unique,
        max      :   ss.max(numericValues) || "NaN",
        min      :   ss.min(numericValues) || "NaN",
        mean     :   Math.round(ss.mean(numericValues)) || "NaN",
        median   :   ss.median(numericValues) || "NaN",
        mode     :   ss.mode(numericValues) || "NaN",

      }
      return {...mathStats};
    }
    // Max/Min  Values of each col  

    // Get the Mean/Median/Mode Values


    return {missing,unique,...mathStats}
  }

  detectSchema(rawValues,numericValues){
    if (numericValues.length === rawValues.length) return "number"

    const isDate = rawValues.every(v => !Number.isNaN(Date.parse(v)))
    if (isDate) return "date"

    const uniqueValues = new Set(rawValues).size
    const totalrows = rawValues.length
    if((uniqueValues / totalrows) < 0.2) return "categorical"

    const isBoolean = rawValues.every(v => v === "true" || v === "false")
    if(isBoolean) return "Boolean"

    return "string"
  
  }


// Get the numerical columns from data
 getNumericColumns(data){
  if(!data.length) return [];
  // Get the first object from data
  const columns = Object.keys(data[10])
  // filter all the NUmeric Columns
  return columns.filter(col => 
    data.every(row => row[col] !== undefined && !Number.isNaN(parseFloat(row[col])))
  )
}


// It have 3 layers - schema validation, Data quality Validation, statistical validation
  getFormatedData(filePath){
  console.log("...Validation Start...")
// Get all columns,rowCount,column-counts and numeric-columns of the data
  const rowCount = this.data.length 
  const columns = Object.keys(this.data[0])
  const columnCount = columns.length
  const numericColumns = this.getNumericColumns(this.data)
  
  const columnAnalysis = this.analyze()

// Use a sample of the data for encoding detection to avoid Buffer errors
  const fileBuffer = fs.readFileSync(filePath); 
  const encoding = chardet.detect(fileBuffer);
  // Get the file size
  const stats = fs.statSync(filePath)
  console.log("Validation End...")
  const result = {
    summary : {
      rows: rowCount,
      columns: columnCount,
      numeric_columns: numericColumns.length,
      filesize: `${Math.round((stats.size)/1000)} kb`,
      creationtime:stats.birthtime,
      file_encoding:encoding,
      },
    columns:{...columnAnalysis},
  }
  return result;
}


}

module.exports = DatasetEngine;