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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35365853658536583, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.875, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.75, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [1.0, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [0.75, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.125, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.875, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.125, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120, 0, 0.0, 5811.016666666667, 276, 109093, 1125.0, 8657.6, 11417.249999999987, 108633.72999999998, 0.6152804909938318, 44.424583355765435, 0.7951979600888055], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 4, 0, 0.0, 10474.75, 7680, 12334, 10942.5, 12334.0, 12334.0, 12334.0, 0.32318009210632626, 0.7101125070695645, 0.6567751676496727], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 4, 0, 0.0, 2618.75, 2563, 2750, 2581.0, 2750.0, 2750.0, 2750.0, 0.5604595768530195, 0.3552131497828219, 0.5418505674653216], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 8, 0, 0.0, 8838.25, 8669, 8939, 8872.5, 8939.0, 8939.0, 8939.0, 0.5284713964856652, 0.317908574448408, 2.313094530321046], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 4, 0, 0.0, 2859.25, 2671, 2986, 2890.0, 2986.0, 2986.0, 2986.0, 0.5295207836907598, 0.3645626489277204, 0.6174295075456712], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 4, 0, 0.0, 446.25, 373, 574, 419.0, 574.0, 574.0, 574.0, 0.8062890546260835, 19.000548024591815, 0.7590455553315864], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 4, 0, 0.0, 424.0, 391, 496, 404.5, 496.0, 496.0, 496.0, 6.666666666666667, 197.07845052083334, 5.559895833333334], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 4, 0, 0.0, 106887.5, 105086, 109093, 106685.5, 109093.0, 109093.0, 109093.0, 0.03663641109716892, 0.019615148812522326, 0.03549152325038239], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 4, 0, 0.0, 777.75, 512, 1043, 778.0, 1043.0, 1043.0, 1043.0, 0.7359705611775529, 64.72012994480221, 0.6015696872125116], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 4, 0, 0.0, 372.0, 365, 380, 371.5, 380.0, 380.0, 380.0, 8.064516129032258, 180.71131552419354, 6.694178427419355], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 4, 0, 0.0, 506.5, 460, 571, 497.5, 571.0, 571.0, 571.0, 5.486968449931412, 365.4138803155007, 4.506387174211248], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 4, 0, 0.0, 1280.0, 1207, 1355, 1279.0, 1355.0, 1355.0, 1355.0, 2.904865649963689, 74.46838689179376, 2.3431826434277414], "isController": false}, {"data": ["GOTO HOME PAGE", 4, 0, 0.0, 777.75, 512, 1043, 778.0, 1043.0, 1043.0, 1043.0, 0.7356998344675372, 64.69632265035865, 0.60134839985286], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 4, 0, 0.0, 1743.0, 1605, 1869, 1749.0, 1869.0, 1869.0, 1869.0, 0.6735140596059942, 13.072519837093786, 0.5426260734130325], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 4, 0, 0.0, 108630.5, 106955, 110937, 108315.0, 110937.0, 110937.0, 110937.0, 0.03601656762110571, 0.7183441101656762, 0.06390830406987213], "isController": true}, {"data": ["LOGIN PROCESS", 4, 0, 0.0, 6681.25, 4808, 9592, 6162.5, 9592.0, 9592.0, 9592.0, 0.41684035014589416, 347.38961872134223, 0.7266211181742392], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 4, 0, 0.0, 2502.0, 2482, 2525, 2500.5, 2525.0, 2525.0, 2525.0, 1.5331544653123803, 0.7036939440398621, 2.2548150632426216], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 4, 0, 0.0, 905.75, 819, 1029, 887.5, 1029.0, 1029.0, 1029.0, 3.8240917782026767, 105.24094765774379, 3.1593570745697894], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 4, 0, 0.0, 450.25, 445, 457, 449.5, 457.0, 457.0, 457.0, 5.943536404160475, 395.8197901188707, 5.554652674591382], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 4, 0, 0.0, 833.5, 815, 848, 835.5, 848.0, 848.0, 848.0, 3.835091083413231, 257.69265340364336, 12.164429530201343], "isController": false}, {"data": ["LOGIN ", 4, 0, 0.0, 6179.75, 4457, 9153, 5554.5, 9153.0, 9153.0, 9153.0, 0.436871996505024, 355.3484395478375, 0.39506198121450414], "isController": false}, {"data": ["GET QUOTE", 4, 0, 0.0, 4675.25, 4489, 4775, 4718.5, 4775.0, 4775.0, 4775.0, 0.43029259896729777, 0.19455612629087782, 0.8706701807228916], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 4, 0, 0.0, 2472.25, 2386, 2558, 2472.5, 2558.0, 2558.0, 2558.0, 1.5037593984962407, 0.6902020676691729, 1.9736842105263157], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 4, 0, 0.0, 382.25, 369, 390, 385.0, 390.0, 390.0, 390.0, 6.791171477079796, 4.052154074702886, 15.193919779286928], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 8, 0, 0.0, 2875.0, 2598, 3129, 2859.5, 3129.0, 3129.0, 3129.0, 2.4714241581711462, 28.974069354340436, 6.666087426629595], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 4, 0, 0.0, 1280.0, 1207, 1355, 1279.0, 1355.0, 1355.0, 1355.0, 2.9069767441860463, 74.52250635901163, 2.344885537790698], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 4, 0, 0.0, 325.75, 315, 353, 317.5, 353.0, 353.0, 353.0, 7.299270072992701, 21.006786040145982, 5.524349908759124], "isController": false}, {"data": ["GOTO QUOTE PAGE", 4, 0, 0.0, 436.75, 403, 481, 431.5, 481.0, 481.0, 481.0, 0.7974481658692185, 18.85373056220096, 0.6658380681818182], "isController": false}, {"data": ["QUOTE CREATION", 4, 0, 0.0, 21512.75, 18667, 23683, 21850.5, 23683.0, 23683.0, 23683.0, 0.168584313229654, 8.628092468495806, 1.342747713575252], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 4, 0, 0.0, 905.75, 819, 1029, 887.5, 1029.0, 1029.0, 1029.0, 3.8240917782026767, 105.24094765774379, 3.1593570745697894], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 4, 0, 0.0, 446.75, 361, 536, 445.0, 536.0, 536.0, 536.0, 6.329113924050633, 128.01467316060126, 5.2722013449367084], "isController": false}, {"data": ["LOGIN -0", 4, 0, 0.0, 543.75, 502, 597, 538.0, 597.0, 597.0, 597.0, 6.472491909385114, 4.6394619741100325, 3.659739077669903], "isController": false}, {"data": ["GOTO URL", 4, 0, 0.0, 1906.75, 1252, 2542, 1916.5, 2542.0, 2542.0, 2542.0, 1.5220700152207, 5.521962994672755, 0.21404109589041095], "isController": false}, {"data": ["LOGIN -1", 4, 0, 0.0, 5634.25, 3928, 8555, 5027.0, 8555.0, 8555.0, 8555.0, 0.4624277456647399, 375.80382947976875, 0.15670158959537572], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 4, 0, 0.0, 501.5, 333, 883, 395.0, 883.0, 883.0, 883.0, 0.7792713812585232, 15.581622589129164, 0.6537051918955776], "isController": false}, {"data": ["APPLICATION CREATION", 4, 0, 0.0, 1956.75, 1929, 2009, 1944.5, 2009.0, 2009.0, 2009.0, 1.8674136321195145, 256.061799719888, 10.475023342670402], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 4, 0, 0.0, 291.0, 276, 310, 289.0, 310.0, 310.0, 310.0, 7.590132827324478, 3.439278937381404, 6.522770398481973], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 4, 0, 0.0, 5926.0, 5791, 6164, 5874.5, 6164.0, 6164.0, 6164.0, 0.3738667165155622, 9.304680928124125, 1.149348069913076], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 4, 0, 0.0, 1906.75, 1252, 2542, 1916.5, 2542.0, 2542.0, 2542.0, 1.4684287812041115, 5.327356369309838, 0.2064977973568282], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 4, 0, 0.0, 5845.0, 5818, 5899, 5831.5, 5899.0, 5899.0, 5899.0, 0.6637902422834384, 33.65818432625291, 2.953996224692997], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
