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

    var data = {"OkPercent": 97.91666666666667, "KoPercent": 2.0833333333333335};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3246951219512195, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.8125, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.4375, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.8125, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.75, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.25, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.25, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 240, 5, 2.0833333333333335, 7448.804166666666, 280, 147346, 1317.5, 11035.900000000001, 14734.1, 137487.96000000002, 0.9333037787136741, 68.22007439816488, 1.2062161434332357], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 8, 0, 0.0, 14802.125, 11799, 17609, 14726.0, 17609.0, 17609.0, 17609.0, 0.42973785990545765, 0.943828561452514, 0.8733246938117748], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 8, 0, 0.0, 4079.25, 3787, 4634, 4034.0, 4634.0, 4634.0, 4634.0, 0.7019391067824866, 0.4448813284197596, 0.6786325348775993], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 16, 0, 0.0, 8462.749999999998, 8311, 8583, 8466.5, 8583.0, 8583.0, 8583.0, 1.073897577018592, 0.650080332572656, 4.700399355661454], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 8, 0, 0.0, 4326.875, 3542, 4908, 4382.5, 4908.0, 4908.0, 4908.0, 0.7335411699981661, 0.5050259031725656, 0.8553204657986428], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 8, 0, 0.0, 528.375, 365, 1075, 399.0, 1075.0, 1075.0, 1075.0, 1.1218622914037302, 26.48865867339784, 1.0561281727667928], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 0, 0.0, 437.0, 375, 490, 438.0, 490.0, 490.0, 490.0, 14.869888475836431, 439.56748083178434, 12.401254646840147], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 5, 62.5, 123952.0, 109374, 147346, 120790.0, 147346.0, 147346.0, 147346.0, 0.05426340814900732, 0.14224272785544229, 0.05256767664435084], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 8, 0, 0.0, 908.125, 719, 1327, 805.5, 1327.0, 1327.0, 1327.0, 1.0866612333605, 95.5577416123336, 0.8882182151589242], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 8, 0, 0.0, 391.125, 354, 424, 390.5, 424.0, 424.0, 424.0, 7.633587786259541, 171.06244036259542, 6.336474236641221], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 0, 0.0, 1937.125, 1799, 2108, 1910.0, 2108.0, 2108.0, 2108.0, 2.849002849002849, 213.10485665954417, 2.339854878917379], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 0, 0.0, 1040.25, 896, 1237, 1036.0, 1237.0, 1237.0, 1237.0, 5.847953216374268, 149.91662097953215, 4.7171966374269], "isController": false}, {"data": ["GOTO HOME PAGE", 8, 0, 0.0, 908.125, 719, 1327, 805.5, 1327.0, 1327.0, 1327.0, 1.0936431989063566, 96.17171479835953, 0.8939251537935748], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 8, 0, 0.0, 1759.875, 1506, 2115, 1747.0, 2115.0, 2115.0, 2115.0, 0.20062192797672784, 3.894127459185977, 0.16163387752031297], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 8, 5, 62.5, 125711.875, 111327, 149461, 122373.5, 149461.0, 149461.0, 149461.0, 0.05348380109374373, 1.1783345791994813, 0.09490240877669176], "isController": true}, {"data": ["LOGIN PROCESS", 8, 0, 0.0, 11906.75, 9105, 14438, 11618.0, 14438.0, 14438.0, 14438.0, 0.5272871078302136, 439.4345875626153, 0.9191479369891906], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 8, 0, 0.0, 4323.25, 4185, 4434, 4336.0, 4434.0, 4434.0, 4434.0, 1.6155088852988693, 0.7414933360258481, 2.3759339660743133], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 8, 0, 0.0, 911.125, 857, 967, 905.5, 967.0, 967.0, 967.0, 5.947955390334572, 163.6907527881041, 4.9140334572490705], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 8, 0, 0.0, 835.8749999999999, 702, 915, 854.5, 915.0, 915.0, 915.0, 4.385964912280701, 328.06931880482455, 4.098992598684211], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 0, 0.0, 1311.875, 1246, 1505, 1295.0, 1505.0, 1505.0, 1505.0, 3.6101083032490977, 272.1894742779783, 11.45081227436823], "isController": false}, {"data": ["LOGIN ", 8, 0, 0.0, 11573.0, 8744, 14097, 11286.5, 14097.0, 14097.0, 14097.0, 0.5394470667565745, 438.7822403910991, 0.4878202966958867], "isController": false}, {"data": ["GET QUOTE", 8, 0, 0.0, 8509.0, 8255, 8686, 8543.5, 8686.0, 8686.0, 8686.0, 0.5395562150131517, 0.2439594995616106, 1.091758278815674], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 8, 0, 0.0, 4342.499999999999, 4069, 4475, 4411.0, 4475.0, 4475.0, 4475.0, 1.7467248908296944, 0.8017194323144105, 2.2925764192139737], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 8, 0, 0.0, 475.5, 388, 608, 432.0, 608.0, 608.0, 608.0, 6.130268199233717, 3.657806513409962, 13.715277777777779], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 16, 0, 0.0, 4576.437500000001, 4202, 4979, 4560.0, 4942.6, 4979.0, 4979.0, 2.8520499108734403, 33.43777852049911, 7.692736185383244], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 8, 0, 0.0, 1040.375, 897, 1237, 1036.0, 1237.0, 1237.0, 1237.0, 5.843681519357195, 149.80711285609934, 4.713750913075238], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 0, 0.0, 350.5, 317, 444, 338.5, 444.0, 444.0, 444.0, 6.8493150684931505, 19.711847174657535, 5.183807791095891], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 0, 0.0, 611.0, 408, 1068, 547.0, 1068.0, 1068.0, 1068.0, 1.083717149823896, 25.624645463627743, 0.9048614874017882], "isController": false}, {"data": ["QUOTE CREATION", 8, 0, 0.0, 32858.125, 29471, 35477, 33161.5, 35477.0, 35477.0, 35477.0, 0.2192742023900888, 11.232797467725577, 1.7464847604429339], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 0, 0.0, 911.125, 857, 967, 905.5, 967.0, 967.0, 967.0, 5.947955390334572, 163.6907527881041, 4.9140334572490705], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 8, 0, 0.0, 353.25, 306, 412, 355.5, 412.0, 412.0, 412.0, 9.66183574879227, 195.42926290760872, 8.04838466183575], "isController": false}, {"data": ["LOGIN -0", 8, 0, 0.0, 682.375, 520, 852, 697.5, 852.0, 852.0, 852.0, 4.415011037527594, 3.164666114790287, 2.4963783112582782], "isController": false}, {"data": ["GOTO URL", 8, 0, 0.0, 1724.875, 1202, 2643, 1519.0, 2643.0, 2643.0, 2643.0, 2.0871380120010437, 7.571989955648317, 0.29350378293764673], "isController": false}, {"data": ["LOGIN -1", 8, 0, 0.0, 10888.875, 8060, 13243, 10598.0, 13243.0, 13243.0, 13243.0, 0.562390158172232, 457.0408611599297, 0.1905755711775044], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 8, 0, 0.0, 333.625, 318, 361, 331.0, 361.0, 361.0, 361.0, 1.25, 24.993896484375, 1.048583984375], "isController": false}, {"data": ["APPLICATION CREATION", 8, 0, 0.0, 3895.25, 3670, 4022, 3926.5, 4022.0, 4022.0, 4022.0, 1.6106301590497283, 247.27577008254482, 9.034628548419569], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 0, 0.0, 295.75, 280, 321, 291.0, 321.0, 321.0, 321.0, 7.905138339920948, 3.5820158102766797, 6.793478260869565], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 8, 0, 0.0, 8936.0, 8556, 10182, 8799.5, 10182.0, 10182.0, 10182.0, 0.5226025607525476, 13.03035994251372, 1.6065945910634962], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 8, 0, 0.0, 1724.875, 1202, 2643, 1519.0, 2643.0, 2643.0, 2643.0, 2.041337075784639, 7.4058273794335285, 0.28706302628221486], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 8, 0, 0.0, 9456.0, 9094, 9701, 9524.5, 9701.0, 9701.0, 9701.0, 0.8177450679750587, 41.46442649238475, 3.6391252683226005], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 5, 100.0, 2.0833333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 240, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
