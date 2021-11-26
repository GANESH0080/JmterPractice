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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40853658536585363, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.875, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.875, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.375, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.875, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.375, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.125, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.375, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.875, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.375, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.625, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.875, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.375, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.75, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120, 0, 0.0, 4496.383333333333, 288, 86041, 842.5, 7662.5, 8807.699999999993, 86003.83, 0.7572124485726546, 51.556406806077895, 0.9786330027890658], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 4, 0, 0.0, 6532.0, 3251, 8834, 7021.5, 8834.0, 8834.0, 8834.0, 0.44969083754918493, 0.9885293704328275, 0.9138736649803261], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 4, 0, 0.0, 788.5, 726, 838, 795.0, 838.0, 838.0, 838.0, 0.9825595676737902, 0.6227355072463768, 0.9499355195283715], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 8, 0, 0.0, 7474.0, 6847, 7736, 7656.5, 7736.0, 7736.0, 7736.0, 0.5742176284811944, 0.3454277921332185, 2.513323643410853], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 4, 0, 0.0, 860.0, 787, 911, 871.0, 911.0, 911.0, 911.0, 0.950344499881207, 0.6542899144689951, 1.108116535994298], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 4, 0, 0.0, 498.25, 378, 762, 426.5, 762.0, 762.0, 762.0, 1.0012515644555695, 23.57438986232791, 0.942584480600751], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 4, 0, 0.0, 511.5, 384, 805, 428.5, 805.0, 805.0, 805.0, 3.1847133757961785, 94.13253881369427, 2.656001194267516], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 4, 0, 0.0, 82899.5, 75882, 86041, 84837.5, 86041.0, 86041.0, 86041.0, 0.04575402635431918, 0.024496723582769032, 0.044324213030746705], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 4, 0, 0.0, 1146.5, 723, 2128, 867.5, 2128.0, 2128.0, 2128.0, 0.9640877319836105, 84.78040642323451, 0.7880287418655098], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 4, 0, 0.0, 410.5, 382, 440, 410.0, 440.0, 440.0, 440.0, 5.194805194805195, 116.42400568181817, 4.3120941558441555], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 4, 0, 0.0, 440.25, 372, 604, 392.5, 604.0, 604.0, 604.0, 5.952380952380952, 151.53576078869045, 4.888625372023809], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 4, 0, 0.0, 947.5, 927, 966, 948.5, 966.0, 966.0, 966.0, 4.132231404958678, 105.93281895661157, 3.333225723140496], "isController": false}, {"data": ["GOTO HOME PAGE", 4, 0, 0.0, 1146.5, 723, 2128, 867.5, 2128.0, 2128.0, 2128.0, 0.963855421686747, 84.75997740963855, 0.7878388554216866], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 4, 0, 0.0, 1842.0, 1437, 2123, 1904.0, 2123.0, 2123.0, 2123.0, 0.30821390044691016, 5.982630461165049, 0.2483168631530282], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 4, 0, 0.0, 84741.5, 78005, 87704, 86628.5, 87704.0, 87704.0, 87704.0, 0.04500500680700728, 0.8976718874818573, 0.07985751696126193], "isController": true}, {"data": ["LOGIN PROCESS", 4, 0, 0.0, 8561.75, 7176, 9297, 8887.0, 9297.0, 9297.0, 9297.0, 0.4286326618088298, 357.2171861605229, 0.7471770520788683], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 4, 0, 0.0, 822.5, 786, 920, 792.0, 920.0, 920.0, 920.0, 3.2025620496397114, 1.469925940752602, 4.710018014411529], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 4, 0, 0.0, 1573.75, 1192, 2607, 1248.0, 2607.0, 2607.0, 2607.0, 1.5343306482546988, 42.22555859225163, 1.26762082853855], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 4, 0, 0.0, 422.75, 348, 610, 366.5, 610.0, 610.0, 610.0, 5.277044854881266, 134.3430491424802, 4.931769459102902], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 4, 0, 0.0, 1006.5, 873, 1182, 985.5, 1182.0, 1182.0, 1182.0, 3.2025620496397114, 83.44175340272217, 10.15812650120096], "isController": false}, {"data": ["LOGIN ", 4, 0, 0.0, 7976.75, 6461, 8929, 8258.5, 8929.0, 8929.0, 8929.0, 0.4466279589102278, 363.28386696069674, 0.4038842675301474], "isController": false}, {"data": ["GET QUOTE", 4, 0, 0.0, 1464.5, 1062, 2473, 1161.5, 2473.0, 2473.0, 2473.0, 0.6190992106485065, 0.2799247407522055, 1.2527085590465872], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 4, 0, 0.0, 835.5, 788, 869, 842.5, 869.0, 869.0, 869.0, 3.041825095057034, 1.3961501901140685, 3.9923954372623576], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 4, 0, 0.0, 582.75, 490, 648, 596.5, 648.0, 648.0, 648.0, 5.420054200542006, 3.234036246612466, 12.126312669376693], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 8, 0, 0.0, 1060.0, 840, 1280, 1049.0, 1280.0, 1280.0, 1280.0, 4.9658597144630665, 58.226402467411546, 13.394242706393545], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 4, 0, 0.0, 947.5, 927, 966, 948.5, 966.0, 966.0, 966.0, 4.140786749482402, 106.152141563147, 3.340126811594203], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 4, 0, 0.0, 329.25, 323, 343, 325.5, 343.0, 343.0, 343.0, 9.592326139088728, 27.606040167865707, 7.259817146282974], "isController": false}, {"data": ["GOTO QUOTE PAGE", 4, 0, 0.0, 526.0, 419, 820, 432.5, 820.0, 820.0, 820.0, 0.9076469253460404, 21.46022130984797, 0.7578497277059224], "isController": false}, {"data": ["QUOTE CREATION", 4, 0, 0.0, 10670.25, 8911, 12511, 10629.5, 12511.0, 12511.0, 12511.0, 0.3181167488468268, 16.275290902855097, 2.5337501988229683], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 4, 0, 0.0, 1573.75, 1192, 2607, 1248.0, 2607.0, 2607.0, 2607.0, 1.5343306482546988, 42.22555859225163, 1.26762082853855], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 4, 0, 0.0, 346.25, 329, 365, 345.5, 365.0, 365.0, 365.0, 4.9079754601226995, 99.28345475460124, 4.088381901840491], "isController": false}, {"data": ["LOGIN -0", 4, 0, 0.0, 607.5, 583, 624, 611.5, 624.0, 624.0, 624.0, 6.1443932411674345, 4.404281874039938, 3.4742223502304146], "isController": false}, {"data": ["GOTO URL", 4, 0, 0.0, 2793.75, 2456, 3077, 2821.0, 3077.0, 3077.0, 3077.0, 1.297016861219196, 4.705485976005188, 0.1823929961089494], "isController": false}, {"data": ["LOGIN -1", 4, 0, 0.0, 7367.25, 5873, 8304, 7646.0, 8304.0, 8304.0, 8304.0, 0.4784688995215311, 388.8400867224881, 0.16213741028708134], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 4, 0, 0.0, 585.0, 359, 898, 541.5, 898.0, 898.0, 898.0, 1.4010507880910683, 28.01417469352014, 1.175295534150613], "isController": false}, {"data": ["APPLICATION CREATION", 4, 0, 0.0, 2074.5, 1906, 2436, 1978.0, 2436.0, 2436.0, 2436.0, 1.6420361247947455, 90.05541871921183, 9.210796387520526], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 4, 0, 0.0, 298.5, 288, 307, 299.5, 307.0, 307.0, 307.0, 10.178117048346056, 4.611959287531806, 8.746819338422391], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 4, 0, 0.0, 2147.75, 1892, 2367, 2166.0, 2367.0, 2367.0, 2367.0, 0.6979584714709475, 17.356264177281453, 2.145677019717327], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 4, 0, 0.0, 2793.75, 2456, 3077, 2821.0, 3077.0, 3077.0, 3077.0, 1.2586532410320956, 4.566305459408433, 0.17699811202013846], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 4, 0, 0.0, 2515.75, 2323, 2941, 2399.5, 2941.0, 2941.0, 2941.0, 1.2228676245796393, 62.005001337511466, 5.441999770712321], "isController": true}]}, function(index, item){
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
