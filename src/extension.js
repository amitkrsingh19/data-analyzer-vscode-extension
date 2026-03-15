// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const reader = require('./dataEngine/csvReader.js')
const dashboard = require('./webview/dahsboard.js')
const DatasetEngine = require('./dataEngine/dataEngine.js')

/**
 * @param {vscode.ExtensionContext} context
 */
// Activate function to activte the extension
function activate(context) {

	console.log('Congratulations, your extension "CSV-Visualizer" is now active!');
	// Create a disposble which will get check active text editor
	let disposable = vscode.commands.registerCommand('csv.validateCsv',async () => {
		const filePath = getActiveTextEditor()
		if(!filePath){
			vscode.window.showInformationMessage("Open a csv file")
			return
		}
		vscode.window.showInformationMessage('CSV file Detected');
		console.log("Reading a CSV File")
		try {
			// asynchrounously wait for readcsv to execute
			const data = await reader.readCsv(filePath);

			if(!data || data.length === 0){
				vscode.window.showErrorMessage("The CSV file appears to be empty.")
				return;
			}
			// show message of data-parsed
			vscode.window.showInformationMessage(`data parsed of length : ${data.length}`)

			// stringify the top 5 data
			// console.log(JSON.stringify(data.slice(0,5),null,2))
			
			const engine = new DatasetEngine(data)
			// Get JSON Formated Object of - DATA SUMMARY
			const analysis = engine.getFormatedData(filePath)

			if(!analysis) throw new Error("Analysis failed to generate report.")
			console.log(JSON.stringify(analysis,null,2))
			// Create a WebView panel
			const panel = vscode.window.createWebviewPanel(
				'CsvInspector',
				'Csv Inspector',
				vscode.ViewColumn.One,
				{
					enableScripts : true
				}
			);
			// Send myVariable to the webview by injecting a script
			panel.webview.html = dashboard.getWebViewContent(data,analysis);
		}catch(err){
			vscode.window.showErrorMessage(err.message || "unExpected Error")
		}
	});
	context.subscriptions.push(disposable);
}

  // Find the missing values 

// Get the active text editor
function getActiveTextEditor(){
	let editor = vscode.window.activeTextEditor;
		if(!editor){
			return
		}
		const fileUri = editor.document.uri
		if(editor.document.fileName.endsWith('.csv')){
			return fileUri.fsPath
		}
		return null;
	}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
};
