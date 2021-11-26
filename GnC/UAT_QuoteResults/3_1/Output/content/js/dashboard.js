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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.25510204081632654, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.5, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 37, 0, 0.0, 2501.891891891891, 327, 8606, 1216.0, 6198.400000000005, 8109.200000000001, 8606.0, 1.3855602156980227, 203.7412758856351, 1.4967326992210905], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 3, 0, 0.0, 5351.0, 4054, 7720, 4279.0, 7720.0, 7720.0, 7720.0, 0.3881987577639751, 0.8546185542831263, 0.7889078270574534], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 3, 0, 0.0, 654.6666666666666, 455, 931, 578.0, 931.0, 931.0, 931.0, 0.7093875620714116, 11.323876064081343, 0.6618179534168834], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 3, 0, 0.0, 2176.6666666666665, 879, 3173, 2478.0, 3173.0, 3173.0, 3173.0, 0.6669630947087594, 0.412292616162739, 0.7802947143174744], "isController": false}, {"data": ["GOTO QUOTE PAGE", 3, 0, 0.0, 567.0, 413, 769, 519.0, 769.0, 769.0, 769.0, 0.7232401157184186, 17.0973775012054, 0.6038772450578592], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 60.016457804568525, 2.364570114213198], "isController": false}, {"data": ["QUOTE CREATION", 3, 0, 0.0, 9586.666666666666, 8567, 10594, 9599.0, 10594.0, 10594.0, 10594.0, 0.28293879090823354, 14.361077790483826, 2.0665952442704896], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 3, 0, 0.0, 1342.6666666666667, 748, 2064, 1216.0, 2064.0, 2064.0, 2064.0, 0.9256402344955261, 81.40150127275533, 0.7566024182351127], "isController": true}, {"data": ["LOGIN -0", 3, 0, 0.0, 524.0, 508, 551, 513.0, 551.0, 551.0, 551.0, 5.226480836236934, 3.7463251306620213, 2.9552074259581884], "isController": false}, {"data": ["GOTO URL", 3, 0, 0.0, 3016.3333333333335, 2746, 3222, 3081.0, 3222.0, 3222.0, 3222.0, 0.9188361408882082, 3.333472913476263, 0.12921133231240428], "isController": false}, {"data": ["LOGIN -1", 3, 0, 0.0, 6094.666666666667, 4922, 8054, 5308.0, 8054.0, 8054.0, 8054.0, 0.37000493339911195, 300.6940483164775, 0.1253825311420819], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 3, 0, 0.0, 707.3333333333334, 327, 996, 799.0, 996.0, 996.0, 996.0, 0.8593526210254941, 17.18285636279003, 0.7208827162704096], "isController": false}, {"data": ["GOTO HOME PAGE", 3, 0, 0.0, 1342.6666666666667, 748, 2064, 1216.0, 2064.0, 2064.0, 2064.0, 0.9171507184347294, 80.6549268190156, 0.7496632337205748], "isController": false}, {"data": ["LOGIN PROCESS", 3, 0, 0.0, 7329.666666666667, 6439, 8933, 6617.0, 8933.0, 8933.0, 8933.0, 0.33497096918267083, 279.1606840037405, 0.5839093554600269], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 3, 0, 0.0, 2964.3333333333335, 1730, 4106, 3057.0, 4106.0, 4106.0, 4106.0, 0.5871990604815032, 14.364777537189275, 1.4171529408886279], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 3, 0, 0.0, 3016.3333333333335, 2746, 3222, 3081.0, 3222.0, 3222.0, 3222.0, 0.8807985907222549, 3.1954753559894304, 0.12386230182031709], "isController": true}, {"data": ["LOGIN ", 3, 0, 0.0, 6622.333333333333, 5443, 8606, 5818.0, 8606.0, 8606.0, 8606.0, 0.34766485108355544, 282.78800954629736, 0.3143922383821996], "isController": false}, {"data": ["GET QUOTE", 3, 0, 0.0, 704.3333333333334, 670, 731, 712.0, 731.0, 731.0, 731.0, 0.6811989100817438, 0.3080030228201635, 1.3783634196185286], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 37, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
