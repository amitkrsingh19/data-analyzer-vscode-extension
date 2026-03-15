// This is to read the csv file from Users activate text editor if file is A CSV File
const fs = require('fs'); // import file path to get the file 
const papa = require('papaparse'); // import papaparse for parsing the csv

// It also validates file structure
function readCsv(filePath){
  return new Promise((resolve,reject) => {
    const stream = fs.createReadStream(filePath,'utf-8')
    if(!stream) throw new Error("Parsing failed")
   // create parsing stream
    const parseStream = papa.parse(papa.NODE_STREAM_INPUT,{
      header:true,
      dynamicTyping:true
  })
 
    stream.pipe(parseStream)
    const data = []

    parseStream.on('data', chunk => {
      console.log("Started CSV parsing")
      data.push(chunk)
    })

    parseStream.on('end', () => {
      console.log("parsing ended")
      resolve(data) // return the parsed data
    })

    parseStream.on('error', err => {
      reject(err)
    })
  })
}

module.exports = { readCsv }