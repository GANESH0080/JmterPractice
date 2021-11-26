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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2421875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.375, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48, 0, 0.0, 2891.229166666667, 327, 8652, 2493.0, 5851.700000000001, 7050.849999999997, 8652.0, 1.5960099750623442, 241.09258104738154, 1.6867986284289278], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 4, 0, 0.0, 7258.75, 6398, 8652, 6992.5, 8652.0, 8652.0, 8652.0, 0.4623208506703652, 0.8261050551895516, 0.9395407131299123], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 4, 0, 0.0, 810.25, 696, 937, 804.0, 937.0, 937.0, 937.0, 2.0090406830738323, 47.522444751381215, 1.8403126569563033], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 4, 0, 0.0, 3926.25, 3334, 4336, 4017.5, 4336.0, 4336.0, 4336.0, 0.8567144998929107, 0.4994712465195974, 1.0085637984579139], "isController": false}, {"data": ["GOTO QUOTE PAGE", 4, 0, 0.0, 938.25, 576, 1342, 917.5, 1342.0, 1342.0, 1342.0, 2.4125452352231602, 57.06529421743064, 2.0143810313630883], "isController": false}, {"data": ["QUOTE CREATION", 4, 0, 0.0, 14321.0, 13995, 14546, 14371.5, 14546.0, 14546.0, 14546.0, 0.27105780307650607, 13.588095903638951, 1.8930369909195637], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 4, 0, 0.0, 650.5, 567, 764, 635.5, 764.0, 764.0, 764.0, 4.395604395604396, 386.5470467032967, 3.5928914835164836], "isController": true}, {"data": ["LOGIN -0", 4, 0, 0.0, 587.25, 565, 601, 591.5, 601.0, 601.0, 601.0, 6.420545746388443, 4.602227126805778, 3.6303671749598716], "isController": false}, {"data": ["GOTO URL", 4, 0, 0.0, 3315.75, 2950, 3600, 3356.5, 3600.0, 3600.0, 3600.0, 1.1104941699056081, 4.028794766796224, 0.15616324264297612], "isController": false}, {"data": ["LOGIN -1", 4, 0, 0.0, 5082.25, 4975, 5183, 5085.5, 5183.0, 5183.0, 5183.0, 0.7717538105344395, 627.1856309087401, 0.2615220432182134], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 4, 0, 0.0, 328.75, 327, 333, 327.5, 333.0, 333.0, 333.0, 7.604562737642586, 152.05412309885932, 6.379218155893536], "isController": false}, {"data": ["GOTO HOME PAGE", 4, 0, 0.0, 650.5, 567, 764, 635.5, 764.0, 764.0, 764.0, 4.291845493562231, 377.42254560085837, 3.5080807403433476], "isController": false}, {"data": ["LOGIN PROCESS", 4, 0, 0.0, 6001.5, 5887, 6118, 6000.5, 6118.0, 6118.0, 6118.0, 0.6515719172503665, 543.0120184476299, 1.1357967502850628], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 4, 0, 0.0, 4738.25, 4272, 5204, 4738.5, 5204.0, 5204.0, 5204.0, 0.7224128589488893, 17.50934057251219, 1.5121991827704533], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 4, 0, 0.0, 3315.75, 2950, 3600, 3356.5, 3600.0, 3600.0, 3600.0, 1.0692328254477412, 3.879101510291366, 0.15036086607858862], "isController": true}, {"data": ["LOGIN ", 4, 0, 0.0, 5672.75, 5560, 5791, 5670.0, 5791.0, 5791.0, 5791.0, 0.6907269901571405, 561.8322073044379, 0.6246222586772577], "isController": false}, {"data": ["GET QUOTE", 4, 0, 0.0, 1385.75, 776, 2036, 1365.5, 2036.0, 2036.0, 2036.0, 1.4179369018078696, 0.6411179546260191, 2.869106699751861], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
