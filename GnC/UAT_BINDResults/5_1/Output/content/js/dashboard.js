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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44634146341463415, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.4, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.9, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.6, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.6, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.1, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.3, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.9, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150, 0, 0.0, 4767.526666666667, 306, 95856, 911.5, 8040.4000000000015, 9463.349999999999, 94528.47000000003, 0.9010361916203634, 61.59829507058117, 1.1645130180958103], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 5, 0, 0.0, 5427.0, 3481, 9676, 4710.0, 9676.0, 9676.0, 9676.0, 0.5166890565257828, 1.1363122610313114, 1.0500292252247598], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 5, 0, 0.0, 864.0, 801, 1025, 829.0, 1025.0, 1025.0, 1025.0, 0.7405213270142179, 0.46933431760959715, 0.7159337048281991], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 10, 0, 0.0, 7857.599999999999, 7420, 8070, 7882.0, 8070.0, 8070.0, 8070.0, 0.6980315510261064, 0.4199096049141421, 3.055251378612313], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 5, 0, 0.0, 1254.2, 1028, 1619, 1188.0, 1619.0, 1619.0, 1619.0, 0.7173601147776184, 0.49388562589670015, 0.8364531025824964], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 5, 0, 0.0, 415.6, 352, 546, 398.0, 546.0, 546.0, 546.0, 0.8164598301763554, 19.225715422926193, 0.7686203870019596], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 5, 0, 0.0, 438.4, 382, 477, 470.0, 477.0, 477.0, 477.0, 4.844961240310077, 143.22443525920542, 4.040621971899225], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 5, 0, 0.0, 91894.8, 85957, 95856, 92780.0, 95856.0, 95856.0, 95856.0, 0.052122425152197484, 0.027903821746518225, 0.050493599366191314], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 5, 0, 0.0, 897.8, 452, 1230, 909.0, 1230.0, 1230.0, 1230.0, 0.7901390644753477, 69.48516884284133, 0.6458460907869785], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 5, 0, 0.0, 397.6, 381, 414, 395.0, 414.0, 414.0, 414.0, 5.89622641509434, 132.12959721403303, 4.894328567216982], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 5, 0, 0.0, 408.2, 376, 436, 407.0, 436.0, 436.0, 436.0, 5.694760820045558, 160.71571576025056, 4.677044775056948], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 5, 0, 0.0, 965.2, 854, 1151, 914.0, 1151.0, 1151.0, 1151.0, 4.0290088638195, 103.286632504029, 3.2499622280419014], "isController": false}, {"data": ["GOTO HOME PAGE", 5, 0, 0.0, 897.8, 452, 1230, 909.0, 1230.0, 1230.0, 1230.0, 0.7971938775510204, 70.105572136081, 0.6516125737404337], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 5, 0, 0.0, 1802.2, 1458, 2164, 1742.0, 2164.0, 2164.0, 2164.0, 0.4298486932599725, 8.343766119325997, 0.3463136444721458], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 5, 0, 0.0, 93697.0, 88067, 97598, 94317.0, 97598.0, 97598.0, 97598.0, 0.05122373502986344, 1.021723425766563, 0.09089211577076353], "isController": true}, {"data": ["LOGIN PROCESS", 5, 0, 0.0, 8433.2, 4770, 9871, 9134.0, 9871.0, 9871.0, 9871.0, 0.5063291139240507, 421.9684533227848, 0.8826147151898734], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 5, 0, 0.0, 1073.4, 962, 1231, 979.0, 1231.0, 1231.0, 1231.0, 3.5335689045936394, 1.6218529151943462, 5.196830830388692], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 5, 0, 0.0, 1079.0, 857, 1165, 1146.0, 1165.0, 1165.0, 1165.0, 4.156275976724855, 114.38282548836241, 3.4337983167082293], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 5, 0, 0.0, 415.6, 384, 467, 414.0, 467.0, 467.0, 467.0, 5.707762557077626, 161.08264661815068, 5.334305436643835], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 5, 0, 0.0, 845.4, 786, 872, 853.0, 872.0, 872.0, 872.0, 3.912363067292645, 112.74788487871675, 12.409526604068857], "isController": false}, {"data": ["LOGIN ", 5, 0, 0.0, 8065.8, 4369, 9498, 8805.0, 9498.0, 9498.0, 9498.0, 0.5262603936427744, 428.0562983501737, 0.4758956294074308], "isController": false}, {"data": ["GET QUOTE", 5, 0, 0.0, 1385.6, 1243, 1517, 1366.0, 1517.0, 1517.0, 1517.0, 0.6992029086841001, 0.31614350265697105, 1.414793385540484], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 5, 0, 0.0, 1075.6, 989, 1378, 999.0, 1378.0, 1378.0, 1378.0, 3.1948881789137378, 1.4664037539936103, 4.193290734824282], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 5, 0, 0.0, 429.4, 386, 467, 435.0, 467.0, 467.0, 467.0, 5.793742757821553, 3.4570086181923525, 12.962367830243338], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 10, 0, 0.0, 1243.2, 1011, 1490, 1244.5, 1486.9, 1490.0, 1490.0, 5.170630816959669, 60.62110182911065, 13.946564762150983], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 5, 0, 0.0, 965.2, 854, 1151, 914.0, 1151.0, 1151.0, 1151.0, 4.0290088638195, 103.286632504029, 3.2499622280419014], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 5, 0, 0.0, 391.0, 380, 404, 391.0, 404.0, 404.0, 404.0, 6.361323155216285, 18.307440760178118, 4.814477973918575], "isController": false}, {"data": ["GOTO QUOTE PAGE", 5, 0, 0.0, 449.8, 395, 510, 451.0, 510.0, 510.0, 510.0, 0.8130081300813008, 19.22462525406504, 0.6788300304878049], "isController": false}, {"data": ["QUOTE CREATION", 5, 0, 0.0, 9798.6, 7838, 14033, 9398.0, 14033.0, 14033.0, 14033.0, 0.3563030000712606, 18.23116159231811, 2.8378977232238296], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 5, 0, 0.0, 1079.0, 857, 1165, 1146.0, 1165.0, 1165.0, 1165.0, 4.156275976724855, 114.38282548836241, 3.4337983167082293], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 5, 0, 0.0, 332.4, 315, 347, 334.0, 347.0, 347.0, 347.0, 9.596928982725528, 194.12038147792705, 7.994316818618042], "isController": false}, {"data": ["LOGIN -0", 5, 0, 0.0, 609.4, 569, 679, 581.0, 679.0, 679.0, 679.0, 7.062146892655367, 5.062124823446328, 3.9931475105932206], "isController": false}, {"data": ["GOTO URL", 5, 0, 0.0, 2513.8, 2130, 2790, 2602.0, 2790.0, 2790.0, 2790.0, 1.7355085039916696, 6.296302824540091, 0.24405588337382855], "isController": false}, {"data": ["LOGIN -1", 5, 0, 0.0, 7454.4, 3688, 8924, 8162.0, 8924.0, 8924.0, 8924.0, 0.5602868668758404, 455.3315672624384, 0.18986283477140298], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 5, 0, 0.0, 367.4, 325, 409, 373.0, 409.0, 409.0, 409.0, 0.9082652134423251, 18.16086938010899, 0.7619138851044505], "isController": false}, {"data": ["APPLICATION CREATION", 5, 0, 0.0, 1979.2, 1905, 2057, 1967.0, 2057.0, 2057.0, 2057.0, 2.026753141467369, 122.35730391163357, 11.368818402918524], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 5, 0, 0.0, 334.6, 306, 348, 339.0, 348.0, 348.0, 348.0, 6.775067750677507, 3.0699525745257454, 5.822323848238482], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 5, 0, 0.0, 2536.2, 2347, 2996, 2459.0, 2996.0, 2996.0, 2996.0, 0.6112469437652812, 15.201663737775062, 1.879106815403423], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 5, 0, 0.0, 2513.8, 2130, 2790, 2602.0, 2790.0, 2790.0, 2790.0, 1.680672268907563, 6.097360819327731, 0.23634453781512604], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 5, 0, 0.0, 2919.8, 2685, 3157, 2957.0, 3157.0, 3157.0, 3157.0, 1.3888888888888888, 70.42616102430556, 6.180826822916666], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
