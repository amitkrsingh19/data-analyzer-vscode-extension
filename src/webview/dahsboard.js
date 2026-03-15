// get the webview html content
function getWebViewContent(data, analysis){

	const columns = Object.keys(data[0] || {})
	const preview = data.slice(0,10)

	const columnRows = Object.keys(analysis.columns).map(col => {

		const info = analysis.columns[col]

		return `
		<tr>
			<td>${col}</td>
			<td>${info.schema}</td>
			<td>${info.stats.missing}</td>
			<td>${info.stats.unique}</td>
			<td>${info.stats.max}</td>
			<td>${info.stats.min}</td>
			<td>${info.stats.mean}</td>
			<td>${info.stats.median}</td>
			<td>${info.stats.mode}</td>
		</tr>
		`

	}).join("")

	const previewRows = preview.map(row => {

		return `
		<tr>
			${columns.map(c => `<td>${row[c] ?? ""}</td>`).join("")}
		</tr>
		`

	}).join("")

	return `
	<!DOCTYPE html>
	<html>
	<head>

	<style>

	body{
		font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
		padding:20px;
		background:#1e1e1e;
		color:#d4d4d4;
	}

	h1{
		margin-bottom:10px;
		color:#ffffff;
	}

	.card{
		background:#252526;
		padding:18px;
		border-radius:8px;
		margin-bottom:22px;
		box-shadow:0 4px 16px rgba(0,0,0,0.55);
		border:1px solid rgba(255,255,255,0.06);
	}

	table{
		width:100%;
		border-collapse:collapse;
		background:rgba(255,255,255,0.04);
	}

	th,td{
		padding:10px 12px;
		border:1px solid rgba(255,255,255,0.1);
		text-align:left;
		color:#d4d4d4;
	}

	th{
		background:rgba(255,255,255,0.08);
		color:#ffffff;
		font-weight:600;
	}

	tr:nth-child(even) {
		background:rgba(255,255,255,0.04);
	}

	.summary-grid{
		display:flex;
		flex-wrap:wrap;
		gap:20px;
	}

	.stat{
		font-size:18px;
		font-weight:700;
		color:#ffffff;
	}

	</style>

	</head>

	<body>

	<h1>CSV Inspector</h1>

	<div class="card">

	<h2>Dataset Summary</h2>

	<div class="summary-grid">

	<div>
	Rows
	<div class="stat">${analysis.summary.rows}</div>
	</div>

	<div>
	Columns
	<div class="stat">${analysis.summary.columns}</div>
	</div>

	<div>
	Numeric-Columns
	<div class="stat">${analysis.summary.numeric_columns}</div>
	</div>

	<div>
	File Size
	<div class="stat">${analysis.summary.filesize}</div>
	</div>

	<div>
	File Encoding Type
	<div class="stat">${analysis.summary.file_encoding}</div>
	</div>

	<div>
	Creation Time
	<div class="stat">${analysis.summary.creationtime}</div>
	</div>

	</div>

	</div>


	<div class="card">

	<h2>Column Analysis</h2>

	<table>

	<thead>
	<tr>
	<th>Column</th>
	<th>Type</th>
	<th>Missing</th>
	<th>Unique</th>
	<th>Max-Value</th>
	<th>Min-Value</th>
	<th>Mean</th>
	<th>Median</th>
	<th>Mode</th>
	</tr>
	</thead>

	<tbody>

	${columnRows}

	</tbody>

	</table>

	</div>


	<div class="card">

	<h2>Preview (First 10 rows)</h2>

	<table>

	<thead>
	<tr>
	${columns.map(c => `<th>${c}</th>`).join("")}
	</tr>
	</thead>

	<tbody>

	${previewRows}

	</tbody>

	</table>

	</div>

	</body>
	</html>
	`
}

module.exports = {getWebViewContent}