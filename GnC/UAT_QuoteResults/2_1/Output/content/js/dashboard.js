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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.75, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.75, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.5, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24, 0, 0.0, 3019.5833333333335, 313, 10923, 1582.5, 8872.0, 10754.5, 10923.0, 0.780386291214151, 117.9079347401964, 0.8234447145086817], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 2, 0, 0.0, 4827.0, 2159, 7495, 4827.0, 7495.0, 7495.0, 7495.0, 0.266844563042028, 0.5875010423615744, 0.5422886090727151], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 2, 0, 0.0, 499.0, 456, 542, 499.0, 542.0, 542.0, 542.0, 0.3359086328518643, 7.939121808867989, 0.307697556264696], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 2, 0, 0.0, 2320.0, 2306, 2334, 2320.0, 2334.0, 2334.0, 2334.0, 0.25637738751442124, 0.14947001986924752, 0.2991904082809896], "isController": false}, {"data": ["GOTO QUOTE PAGE", 2, 0, 0.0, 488.5, 479, 498, 488.5, 498.0, 498.0, 498.0, 0.33846674564224066, 7.9994169381452025, 0.2826065112540193], "isController": false}, {"data": ["QUOTE CREATION", 2, 0, 0.0, 8855.5, 6122, 11589, 8855.5, 11589.0, 11589.0, 11589.0, 0.17257744412805245, 8.716172124428336, 1.2034917270687722], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 2, 0, 0.0, 980.5, 955, 1006, 980.5, 1006.0, 1006.0, 1006.0, 0.3079765937788728, 27.08299247382199, 0.2517347744071451], "isController": true}, {"data": ["LOGIN -0", 2, 0, 0.0, 659.5, 646, 673, 659.5, 673.0, 673.0, 673.0, 2.9717682020802374, 2.130154160475483, 1.6803259658246656], "isController": false}, {"data": ["GOTO URL", 2, 0, 0.0, 7179.0, 7179, 7179, 7179.0, 7179.0, 7179.0, 7179.0, 0.2785903329154478, 1.0107061394344616, 0.03917676556623485], "isController": false}, {"data": ["LOGIN -1", 2, 0, 0.0, 7251.5, 4254, 10249, 7251.5, 10249.0, 10249.0, 10249.0, 0.19476093095724997, 158.27749172266044, 0.06599808890836498], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 2, 0, 0.0, 574.5, 313, 836, 574.5, 836.0, 836.0, 836.0, 0.316105579263474, 6.320568100995732, 0.26517059822980876], "isController": false}, {"data": ["GOTO HOME PAGE", 2, 0, 0.0, 980.5, 955, 1006, 980.5, 1006.0, 1006.0, 1006.0, 0.307455803228286, 27.037194946195235, 0.2513090891621829], "isController": false}, {"data": ["LOGIN PROCESS", 2, 0, 0.0, 8490.0, 5744, 11236, 8490.0, 11236.0, 11236.0, 11236.0, 0.177999288002848, 148.34241639595942, 0.31028196199715197], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 2, 0, 0.0, 2820.5, 2793, 2848, 2820.5, 2848.0, 2848.0, 2848.0, 0.24213075060532688, 5.863867660411622, 0.504360245157385], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 2, 0, 0.0, 7180.0, 7180, 7180, 7180.0, 7180.0, 7180.0, 7180.0, 0.2626740215392698, 0.9529628808773313, 0.03693853427895981], "isController": true}, {"data": ["LOGIN ", 2, 0, 0.0, 7915.5, 4908, 10923, 7915.5, 10923.0, 10923.0, 10923.0, 0.18309988098507735, 148.93208424883275, 0.16557665018767737], "isController": false}, {"data": ["GET QUOTE", 2, 0, 0.0, 719.5, 672, 767, 719.5, 767.0, 767.0, 767.0, 0.3277613897082924, 0.14819680022943296, 0.6632046869878728], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
