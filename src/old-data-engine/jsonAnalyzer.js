// we will get the parsed data and do some analysis on it return 
// columns analysis
const ss = require('simple-statistics')

async function analyzeColumns(data){
  // for every column find the data type
  console.log("...Analyzing Columns...")
  const columns = Object.keys(data[0])
  //const slicedData = data.slice(0,5)

  const report = {}
  // Map each col with top row-array [..]
  for(const col of columns){

    const values = data.map(row => row[col])

    // Get the number array for each column
    const number = values.map(v => parseFloat(v))

    // detect type of data
    const type = detectType(values)

    // detect missing values
    const missing = values.filter(v => v == 0 || v == null).length;
    // Unique values
    const unique = new Set(values).size

    // Max Values of each col
    const max = Math.max(...values)
    // Min values of each col'
    const min = Math.min(...values)

    // Get the Mean/Median/Mode Values
    const mean = Math.round(ss.mean(number))
    const median = ss.median(number)
    const mode = ss.mode(number)


    report[col] = {type,missing,unique,max,min,mean,median,mode}
  }
  console.log("Analyzation END...")
  return report;
  
}

async function statisticalAnalysis(array1,array2){
  // Correlation Between different numeric Columns
  ss.sampleCorrelation(array1,array2)
}


function detectType(values){
  const isNumber = values.every(v => !Number.isNaN(v));
  if (isNumber) return "number"

  const isDate = values.every(v => !Number.isNaN(Date.parse(v)))
  if (isDate) return "date"

  const uniqueValues = new Set(values).size
  const totalrows = values.size
  const percentage = (totalrows - uniqueValues / totalrows)*100
  if(percentage >= 80){
    return "categorical"
  }

  const isBoolean = values.every(v => typeof(v) === 'boolean')

  if(isBoolean) return "Boolean"

  return "string"
  
}
module.exports = {analyzeColumns}