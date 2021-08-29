/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.66666666666667, "KoPercent": 3.3333333333333335};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7166666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, " HIT1 1"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 10"], "isController": false}, {"data": [1.0, 500, 1500, " HIT3 10"], "isController": false}, {"data": [1.0, 500, 1500, " HIT3 9"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 9"], "isController": false}, {"data": [0.5, 500, 1500, " HIT3 8"], "isController": false}, {"data": [0.0, 500, 1500, " HIT1 9"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 8"], "isController": false}, {"data": [0.5, 500, 1500, " HIT3 7"], "isController": false}, {"data": [1.0, 500, 1500, " HIT1 8"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 7"], "isController": false}, {"data": [0.5, 500, 1500, " HIT3 6"], "isController": false}, {"data": [1.0, 500, 1500, " HIT1 7"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 6"], "isController": false}, {"data": [0.5, 500, 1500, " HIT3 5"], "isController": false}, {"data": [0.5, 500, 1500, " HIT1 6"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 5"], "isController": false}, {"data": [0.5, 500, 1500, " HIT3 4"], "isController": false}, {"data": [1.0, 500, 1500, " HIT1 5"], "isController": false}, {"data": [0.5, 500, 1500, " HIT2 4"], "isController": false}, {"data": [1.0, 500, 1500, " HIT3 3"], "isController": false}, {"data": [0.5, 500, 1500, " HIT1 4"], "isController": false}, {"data": [1.0, 500, 1500, " HIT2 3"], "isController": false}, {"data": [1.0, 500, 1500, " HIT3 2"], "isController": false}, {"data": [0.5, 500, 1500, " HIT1 3"], "isController": false}, {"data": [1.0, 500, 1500, " HIT2 2"], "isController": false}, {"data": [1.0, 500, 1500, " HIT3 1"], "isController": false}, {"data": [1.0, 500, 1500, " HIT1 2"], "isController": false}, {"data": [1.0, 500, 1500, " HIT2 1"], "isController": false}, {"data": [1.0, 500, 1500, " HIT1 10"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 1, 3.3333333333333335, 508.56666666666655, 68, 853, 493.0, 704.0, 797.9999999999999, 853.0, 9.110233829334954, 7.613213634983298, 5.471478325235347], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": [" HIT1 1", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 1.8263796542553192, 1.277842420212766], "isController": false}, {"data": [" HIT2 10", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 1.670035870622568, 1.1684551313229572], "isController": false}, {"data": [" HIT3 10", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 2.253014271653543, 1.5763410433070866], "isController": false}, {"data": [" HIT3 9", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 1.830273853944563, 1.2805670309168444], "isController": false}, {"data": [" HIT2 9", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 1.1399713645418326, 0.7975908864541833], "isController": false}, {"data": [" HIT3 8", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 1.4698603381849316, 1.028400577910959], "isController": false}, {"data": [" HIT1 9", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 2.599379595588235, 8.832146139705882], "isController": false}, {"data": [" HIT2 8", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 1.0063287661195779, 0.7040866793669402], "isController": false}, {"data": [" HIT3 7", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 1.5355964892665472, 1.0743934481216457], "isController": false}, {"data": [" HIT1 8", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 2.358237465659341, 1.6499613667582418], "isController": false}, {"data": [" HIT2 7", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 1.4928668478260871, 1.0444972826086958], "isController": false}, {"data": [" HIT3 6", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 1.7031715029761905, 1.1916387648809523], "isController": false}, {"data": [" HIT1 7", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 2.0293107269503547, 1.4198249113475179], "isController": false}, {"data": [" HIT2 6", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 1.2193159623579546, 0.8531050248579546], "isController": false}, {"data": [" HIT3 5", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 1.3912454416531606, 0.9733969813614263], "isController": false}, {"data": [" HIT1 6", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 1.595536129182156, 1.1163307388475836], "isController": false}, {"data": [" HIT2 5", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 1.30654252283105, 0.9141338470319634], "isController": false}, {"data": [" HIT3 4", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 1.3539407531545742, 0.9472964313880126], "isController": false}, {"data": [" HIT1 5", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 2.7078815063091484, 1.8945928627760251], "isController": false}, {"data": [" HIT2 4", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 1.2193159623579546, 0.8531050248579546], "isController": false}, {"data": [" HIT3 3", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 1.8263796542553192, 1.277842420212766], "isController": false}, {"data": [" HIT1 4", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 1.3006036931818181, 0.9099786931818181], "isController": false}, {"data": [" HIT2 3", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 2.124748607673267, 1.4865988551980196], "isController": false}, {"data": [" HIT3 2", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 1.8701491013071894, 1.3084660947712419], "isController": false}, {"data": [" HIT1 3", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 1.2908247180451127, 0.9031367481203008], "isController": false}, {"data": [" HIT2 2", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 1.7809096213692948, 1.2460289159751037], "isController": false}, {"data": [" HIT3 1", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 2.0585094424460433, 1.44025404676259], "isController": false}, {"data": [" HIT1 2", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 2.0585094424460433, 1.44025404676259], "isController": false}, {"data": [" HIT2 1", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 3.340071741245136, 2.3369102626459144], "isController": false}, {"data": [" HIT1 10", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 2.539640347633136, 1.776881471893491], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 1, 100.0, 3.3333333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 1, "429/Too Many Requests", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [" HIT1 9", 1, 1, "429/Too Many Requests", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
