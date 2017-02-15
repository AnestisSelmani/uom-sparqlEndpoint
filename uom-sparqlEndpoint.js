$(document).ready(function () {
    $("#uomSparqlQuerySubmitBtn").on("click", function (e) {
        var query = $("#query").val(),
        defaultGraphUri = $("#default-graph-uri").val(),
        resultsFormat = $("#format").val(),
        timeout = $("#timeout").val(),
        options = $("#options").is(':checked');

        var url = createSparqlEndpointUrl(query, defaultGraphUri, resultsFormat, timeout, options);
    });
});

/*
 Creates the sparql query url and opens the result in a new window
*/
function createSparqlEndpointUrl(query, defaultGraphUri, resultsFormat, timeout, options) {
    var graphUri = '';
    if (defaultGraphUri) {
        graphUri = defaultGraphUri;
    }
    var siteDomain = "data.dai.uom.gr:8890";
    var url = "http://" + siteDomain + "/sparql";
    url += "?default-graph-uri=" + graphUri;
    url += "&query=" + encodeURIComponent(query);
    url += "&format=" + encodeURIComponent(resultsFormat);
    url += "&timeout=" + timeout;
    if (options) {
        url += "&debug=on";
    }
    window.open(url);
    return url;

}

function getTableHeaders(headerVars) {
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('td'));
    for (var i in headerVars) {
        tr.appendChild(document.createElement('td'));
        tr.cells[i].appendChild(document.createTextNode(headerVars[i]));
    }
    return tr;
}

function getTableRow(headerVars, rowData) {
    var tr = document.createElement('tr');
    for (var i in headerVars) {
        tr.appendChild(getTableCell(headerVars[i], rowData));
    }
    return tr;
}

function getTableCell(fieldName, rowData) {
    var td = document.createElement('td');
    var fieldData = rowData[fieldName];
    td.appendChild(document.createTextNode(fieldData["value"]));
    return td;
}

function createJsonTable() {
    $.ajax({
        dataType: 'script',
        url: url,
        success: function (data) {

            var w = window.open();
            $(w.document.body).html(data);

            // get the table element
            var table = $("#results")[0];
            var tableHeaders = $("#results > thead")[0];
            var tableBody = $("#results > tbody")[0];

            // get the sparql variables from the 'head' of the data.
            var headerVars = data.head.vars;

            // using the vars, make some table headers and add them to the table;
            var trHeaders = getTableHeaders(headerVars);
            tableHeaders.appendChild(trHeaders);

            // grab the actual results from the data.                                          
            var bindings = data.results.bindings;

            // for each result, make a table row and add it to the table.
            for (rowIdx in bindings) {
                table.append(getTableRow(headerVars, bindings[rowIdx]));
            }

            $("#results").DataTable({
                "lengthMenu": [[-1, 10, 20, 50], ["Σύνολο", 10, 20, 50]]
            });
        }
    });
}
