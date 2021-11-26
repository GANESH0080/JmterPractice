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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3902439024390244, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [1.0, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.5, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 0, 0.0, 4178.077777777777, 289, 68888, 818.5, 9655.900000000009, 13475.7, 68888.0, 0.6094134057406743, 41.36082701207993, 0.7876152489623044], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 3, 0, 0.0, 7149.0, 5431, 8332, 7684.0, 8332.0, 8332.0, 8332.0, 0.3598848368522073, 0.7911140310100767, 0.7313675248920345], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 3, 0, 0.0, 621.6666666666666, 601, 637, 627.0, 637.0, 637.0, 637.0, 0.9055236945366737, 0.5739110134319347, 0.8754574781165106], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 6, 0, 0.0, 7715.0, 7667, 7793, 7685.0, 7793.0, 7793.0, 7793.0, 0.42878582148216965, 0.25794147073536766, 1.8767754412920745], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 3, 0, 0.0, 928.0, 750, 1239, 795.0, 1239.0, 1239.0, 1239.0, 0.7643312101910827, 0.5262241242038217, 0.8912221337579618], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 3, 0, 0.0, 436.0, 400, 463, 445.0, 463.0, 463.0, 463.0, 0.9640102827763496, 22.6871912154563, 0.9075253052699228], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 3, 0, 0.0, 468.0, 422, 500, 482.0, 500.0, 500.0, 500.0, 5.617977528089887, 166.06134421816478, 4.68530547752809], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 3, 0, 0.0, 62992.333333333336, 56949, 68888, 63140.0, 68888.0, 68888.0, 68888.0, 0.043500957021054464, 0.023279809030798678, 0.04214155211414651], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 3, 0, 0.0, 989.3333333333334, 813, 1098, 1057.0, 1098.0, 1098.0, 1098.0, 0.7488766849725411, 65.85848765913629, 0.6121189309785322], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 3, 0, 0.0, 379.6666666666667, 359, 399, 381.0, 399.0, 399.0, 399.0, 7.5, 168.06884765625, 6.2255859375], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 3, 0, 0.0, 446.6666666666667, 420, 476, 444.0, 476.0, 476.0, 476.0, 5.9171597633136095, 137.8282174556213, 4.859698594674557], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 3, 0, 0.0, 2997.0, 2986, 3006, 2999.0, 3006.0, 3006.0, 3006.0, 0.998003992015968, 25.58457304141717, 0.8050305638722556], "isController": false}, {"data": ["GOTO HOME PAGE", 3, 0, 0.0, 989.3333333333334, 813, 1098, 1057.0, 1098.0, 1098.0, 1098.0, 0.7444168734491315, 65.46627830334987, 0.6084735576923077], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 3, 0, 0.0, 2263.3333333333335, 1845, 2896, 2049.0, 2896.0, 2896.0, 2896.0, 0.20118025751072963, 3.9048747443334224, 0.16208370356089055], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 3, 0, 0.0, 65255.666666666664, 58794, 71784, 65189.0, 71784.0, 71784.0, 71784.0, 0.041754234575289845, 0.8327876649292265, 0.07408930099931801], "isController": true}, {"data": ["LOGIN PROCESS", 3, 0, 0.0, 12371.0, 11163, 14130, 11820.0, 14130.0, 14130.0, 14130.0, 0.21231422505307856, 176.94006269904457, 0.3700985270700637], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 3, 0, 0.0, 736.6666666666666, 717, 757, 736.0, 757.0, 757.0, 757.0, 3.963011889035667, 1.818960535006605, 5.828413969616909], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 3, 0, 0.0, 1156.3333333333333, 1083, 1228, 1158.0, 1228.0, 1228.0, 1228.0, 2.425222312045271, 66.74334958569118, 2.0036504648342763], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 3, 0, 0.0, 385.6666666666667, 362, 404, 391.0, 404.0, 404.0, 404.0, 4.405286343612335, 102.61219713656386, 4.117049834801762], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 3, 0, 0.0, 1210.6666666666667, 1053, 1344, 1235.0, 1344.0, 1344.0, 1344.0, 2.2172949002217295, 52.97039564855876, 7.032982261640798], "isController": false}, {"data": ["LOGIN ", 3, 0, 0.0, 11957.333333333334, 10708, 13776, 11388.0, 13776.0, 13776.0, 13776.0, 0.21777003484320556, 177.13253007948606, 0.19692876197735193], "isController": false}, {"data": ["GET QUOTE", 3, 0, 0.0, 909.3333333333334, 824, 1058, 846.0, 1058.0, 1058.0, 1058.0, 0.8045052292839903, 0.3637557823813355, 1.6278660498793243], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 3, 0, 0.0, 775.3333333333334, 767, 787, 772.0, 787.0, 787.0, 787.0, 3.676470588235294, 1.6874425551470589, 4.825367647058824], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 3, 0, 0.0, 824.0, 661, 981, 830.0, 981.0, 981.0, 981.0, 3.0303030303030303, 1.8081202651515151, 6.779711174242424], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 6, 0, 0.0, 1722.8333333333335, 1396, 2046, 1732.0, 2046.0, 2046.0, 2046.0, 2.8749401054144705, 33.70614593315764, 7.754477120268327], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 3, 0, 0.0, 2997.0, 2986, 3006, 2999.0, 3006.0, 3006.0, 3006.0, 0.998003992015968, 25.58457304141717, 0.8050305638722556], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 3, 0, 0.0, 342.3333333333333, 334, 356, 337.0, 356.0, 356.0, 356.0, 7.978723404255319, 22.962204953457448, 6.038584607712766], "isController": false}, {"data": ["GOTO QUOTE PAGE", 3, 0, 0.0, 462.6666666666667, 442, 501, 445.0, 501.0, 501.0, 501.0, 0.9640102827763496, 22.794198867287918, 0.8049109294665809], "isController": false}, {"data": ["QUOTE CREATION", 3, 0, 0.0, 10508.666666666666, 8713, 11885, 10928.0, 11885.0, 11885.0, 11885.0, 0.25237654580634306, 12.909569671700176, 2.0101397535122403], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 3, 0, 0.0, 1156.3333333333333, 1083, 1228, 1158.0, 1228.0, 1228.0, 1228.0, 2.4232633279483036, 66.68943734854604, 2.00203200726979], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 3, 0, 0.0, 366.3333333333333, 346, 391, 362.0, 391.0, 391.0, 391.0, 7.672634271099745, 155.18352381713555, 6.39136429028133], "isController": false}, {"data": ["LOGIN -0", 3, 0, 0.0, 658.0, 526, 903, 545.0, 903.0, 903.0, 903.0, 3.3076074972436604, 2.3708827177508267, 1.87021947353914], "isController": false}, {"data": ["GOTO URL", 3, 0, 0.0, 2638.0, 2326, 2910, 2678.0, 2910.0, 2910.0, 2910.0, 1.0302197802197803, 3.737564925309066, 0.1448746565934066], "isController": false}, {"data": ["LOGIN -1", 3, 0, 0.0, 11296.666666666666, 9803, 13230, 10857.0, 13230.0, 13230.0, 13230.0, 0.22660321776569228, 184.15494703149784, 0.07678839508271017], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 3, 0, 0.0, 413.6666666666667, 354, 455, 432.0, 455.0, 455.0, 455.0, 0.8779631255487269, 17.55497558165057, 0.73649445785777], "isController": false}, {"data": ["APPLICATION CREATION", 3, 0, 0.0, 2302.3333333333335, 2132, 2443, 2332.0, 2443.0, 2443.0, 2443.0, 1.2264922322158627, 61.954626175388384, 6.8798548650858535], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 3, 0, 0.0, 302.6666666666667, 289, 321, 298.0, 321.0, 321.0, 321.0, 8.241758241758243, 3.7345467032967035, 7.082760989010989], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 3, 0, 0.0, 1987.6666666666667, 1779, 2287, 1897.0, 2287.0, 2287.0, 2287.0, 0.6055712555510698, 15.05234879642713, 1.8616585082761405], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 3, 0, 0.0, 2638.0, 2326, 2910, 2678.0, 2910.0, 2910.0, 2910.0, 0.9996667777407531, 3.6267207805731423, 0.1405781406197934], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 3, 0, 0.0, 2346.3333333333335, 2291, 2380, 2368.0, 2380.0, 2380.0, 2380.0, 1.2396694214876034, 62.854306559917354, 5.51677104855372], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
