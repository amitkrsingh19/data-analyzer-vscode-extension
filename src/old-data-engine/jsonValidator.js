// Create class to validate all the parse csv 
// Input - data/parsedcsv
// It have 3 layers - schema validation, Data quality Validation, statistical validation
const chardet = require('chardet')
const fs = require('fs')
const analyzer = require('./jsonAnalyzer')

async function getFormatedData(data,filePath){
  console.log("...Validation Start...")
// Get all columns,rowCount,column-counts and numeric-columns of the data
  const rowCount = data.length 
  const columns = Object.keys(data[0])
  const columnCount = columns.length
  const numericColumns = getNumericColumns(data)
  
	const dataType = await analyzer.analyzeColumns(data)
  const encoding = chardet.detect(Buffer.from(data))
  const analysis = chardet.analyse(Buffer.from(data))
  // Get the file size
  const stats = fs.statSync(filePath)
  console.log("Validation End...")
  const result = {summary : {
  rows: rowCount,
  columns: columnCount,
  numeric_columns: numericColumns.length,
  filesize: `${Math.round((stats.size)/1000)} kb`,
  creationtime:stats.birthtime,
  file_encoding:encoding,
  file_analysis:analysis[0],
  },
  columns:dataType
  }
  return result;
}


// Get the numerical columns from data
function getNumericColumns(data){
  // Get the first object from data
	const columns = Object.keys(data[5])
	// filter all the NUmeric Columns
	return columns.filter(col => 
		data.every(row => !Number.isNaN(parseFloat(row[col])))
	)
}

module.exports = {
  getFormatedData
}