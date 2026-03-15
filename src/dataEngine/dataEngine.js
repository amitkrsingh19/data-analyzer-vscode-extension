const ss = require('simple-statistics')

class DatasetEngine{

  analyze(data){
    console.log("...Analyzing Columns...")
    const columns = Object.keys(data[0])

    const report = {}

    for(const col in columns){
      const values = data.map(row => row[col])

      const numbers = values.every(v => parseFloat(v))

      const stats = this.computeStats(values,numbers) // Mean/Median/Mode/Min/Max
      const schema = this.detectSchema(data) // data type of each column
    }
  }

// we will get the parsed data and do some analysis on it return 
// columns analysis
  computeStats(values,numbers){
    const report = {}
   // detect missing values
    const missing = values.filter(v => v == 0 || v == null).length;
    // Unique values
    const unique = new Set(values).size
    // Max Values of each col
    const max = Math.max(...values)
    // Min values of each col'
    const min = Math.min(...values)

    // Get the Mean/Median/Mode Values
    const mean = Math.round(ss.mean(numbers))
    const median = ss.median(numbers)
    const mode = ss.mode(numbers)


    report[col] = {type,missing,unique,max,min,mean,median,mode}
  }
  console.log("Analyzation END...")
  return report;
  
}

  detectSchema(values){
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
}