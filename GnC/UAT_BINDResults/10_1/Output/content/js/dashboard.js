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

    var data = {"OkPercent": 97.33333333333333, "KoPercent": 2.6666666666666665};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23170731707317074, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.95, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.45, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.7, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.65, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.05, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.05, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.2, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.8, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [0.9, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.85, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.05, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [0.4, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.95, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 300, 8, 2.6666666666666665, 6629.530000000001, 278, 127293, 1849.5, 9487.90000000002, 12636.799999999997, 118989.03000000001, 1.3595700133237862, 95.50538102940978, 1.7571291744464286], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 10, 0, 0.0, 9943.099999999999, 7542, 14053, 9197.5, 13975.2, 14053.0, 14053.0, 0.6471235358830001, 1.4231030180223905, 1.3151016388403547], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 10, 0, 0.0, 2723.5, 2058, 3287, 2653.5, 3285.4, 3287.0, 3287.0, 1.0811979673478214, 0.6852514461022813, 1.0452988160882257], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 20, 0, 0.0, 6467.0, 5346, 8025, 6171.0, 7992.1, 8025.0, 8025.0, 1.287415513356936, 0.7744608947537818, 5.63495735436112], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 10, 0, 0.0, 2986.3999999999996, 1827, 3736, 3114.0, 3728.7, 3736.0, 3736.0, 1.0902747492368077, 0.7506286115351068, 1.2712773931530745], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 10, 0, 0.0, 425.3, 366, 663, 395.0, 642.3000000000001, 663.0, 663.0, 1.310787783457858, 30.94995248394285, 1.2339838117708744], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 10, 0, 0.0, 1491.2, 476, 3532, 681.5, 3480.5, 3532.0, 3532.0, 1.5391719255040788, 45.50056756964753, 1.2836453363090659], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 10, 8, 80.0, 116962.5, 105803, 127293, 117861.0, 126872.2, 127293.0, 127293.0, 0.07803781712617934, 0.2501477841161827, 0.07559913534098624], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 10, 0, 0.0, 928.4000000000001, 555, 1163, 997.5, 1160.8, 1163.0, 1163.0, 1.6048788316482105, 141.13091297544537, 1.3118003731343284], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 10, 0, 0.0, 850.6999999999999, 379, 2039, 472.0, 2019.5, 2039.0, 2039.0, 1.380643379814994, 30.938006954991025, 1.146041868010493], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 10, 0, 0.0, 591.8, 440, 690, 657.5, 689.2, 690.0, 690.0, 4.149377593360996, 191.3657287344398, 3.407838433609958], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 10, 0, 0.0, 2329.6, 1515, 3126, 2427.0, 3113.9, 3126.0, 3126.0, 2.2381378692927485, 57.376325397269476, 1.805372929722471], "isController": false}, {"data": ["GOTO HOME PAGE", 10, 0, 0.0, 928.4000000000001, 555, 1163, 997.5, 1160.8, 1163.0, 1163.0, 1.6100466913540492, 141.58536769441312, 1.3160244928352922], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 10, 0, 0.0, 1721.1000000000001, 1439, 2073, 1623.0, 2070.1, 2073.0, 2073.0, 0.4314063848144953, 8.373623206967213, 0.3475686205780846], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 10, 8, 80.0, 118683.70000000001, 107352, 128881, 119653.0, 128496.4, 128881.0, 128881.0, 0.07710635279240656, 1.7438008299535048, 0.13681859670293237], "isController": true}, {"data": ["LOGIN PROCESS", 10, 0, 0.0, 11698.3, 8493, 13576, 11993.0, 13574.2, 13576.0, 13576.0, 0.7363228039172374, 613.6423645626243, 1.2835314501877624], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 10, 0, 0.0, 2151.9, 1606, 2944, 2177.0, 2913.0, 2944.0, 2944.0, 1.1705489874751258, 0.5372636954231536, 1.7215300538452536], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 10, 0, 0.0, 2320.2999999999997, 1371, 2984, 2490.5, 2965.5, 2984.0, 2984.0, 2.2794620469569185, 62.73195307157511, 1.8832274333257353], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 10, 0, 0.0, 990.1000000000001, 409, 1834, 859.0, 1813.9, 1834.0, 1834.0, 2.163097555699762, 99.76020035691108, 2.0215667585983126], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 10, 0, 0.0, 1703.1, 825, 2425, 2072.5, 2414.9, 2425.0, 2425.0, 1.9845207382417147, 92.70851421412979, 6.2946517166104385], "isController": false}, {"data": ["LOGIN ", 10, 0, 0.0, 11319.900000000001, 7922, 13223, 11667.0, 13216.9, 13223.0, 13223.0, 0.7559721802237678, 614.9021606629876, 0.68362328016329], "isController": false}, {"data": ["GET QUOTE", 10, 0, 0.0, 5111.700000000001, 3734, 5768, 5108.5, 5764.9, 5768.0, 5768.0, 0.7817997029161129, 0.3534895141114846, 1.581922836369322], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 10, 0, 0.0, 2022.5000000000002, 1727, 2357, 1991.5, 2348.0, 2357.0, 2357.0, 1.2224938875305624, 0.5611055929095354, 1.6045232273838632], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 10, 0, 0.0, 712.2, 397, 1324, 490.5, 1322.4, 1324.0, 1324.0, 3.1201248049921997, 1.861715093603744, 6.9806698517940715], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 20, 0, 0.0, 2617.55, 1751, 4845, 2388.5, 4596.300000000003, 4840.6, 4845.0, 2.207505518763797, 25.8801997102649, 5.954228752759382], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 10, 0, 0.0, 2329.6, 1515, 3126, 2427.0, 3113.9, 3126.0, 3126.0, 2.2381378692927485, 57.376325397269476, 1.805372929722471], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 10, 0, 0.0, 521.1, 313, 1268, 341.0, 1261.8, 1268.0, 1268.0, 3.250975292587776, 9.35607830786736, 2.4604549333550065], "isController": false}, {"data": ["GOTO QUOTE PAGE", 10, 0, 0.0, 481.1, 419, 590, 470.0, 585.1, 590.0, 590.0, 1.3061650992685476, 30.886467721394986, 1.090596835815047], "isController": false}, {"data": ["QUOTE CREATION", 10, 0, 0.0, 21671.8, 19861, 24587, 21484.5, 24467.8, 24587.0, 24587.0, 0.3847929813760197, 19.713688469197322, 3.064815972756657], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 10, 0, 0.0, 2320.2999999999997, 1371, 2984, 2490.5, 2965.5, 2984.0, 2984.0, 2.27842333105491, 62.70336708247892, 1.8823692754613806], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 10, 0, 0.0, 1315.6, 329, 2662, 1187.0, 2621.5, 2662.0, 2662.0, 1.328374070138151, 26.86908977318013, 1.1065459783475027], "isController": false}, {"data": ["LOGIN -0", 10, 0, 0.0, 1742.1000000000001, 1729, 1756, 1740.0, 1755.7, 1756.0, 1756.0, 5.6850483229107445, 4.075024872086413, 3.214495096645822], "isController": false}, {"data": ["GOTO URL", 10, 0, 0.0, 2479.9000000000005, 2107, 2768, 2508.5, 2768.0, 2768.0, 2768.0, 3.61271676300578, 13.106682397037574, 0.5080382947976879], "isController": false}, {"data": ["LOGIN -1", 10, 0, 0.0, 9574.5, 6165, 11482, 9919.5, 11475.8, 11482.0, 11482.0, 0.870928409684724, 707.7824257533531, 0.2951290607037102], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 10, 0, 0.0, 378.4, 318, 571, 352.0, 557.5, 571.0, 571.0, 1.7727353306151392, 35.446050678071266, 1.4870895009750045], "isController": false}, {"data": ["APPLICATION CREATION", 10, 0, 0.0, 3128.7999999999997, 1934, 4586, 3278.5, 4568.1, 4586.0, 4586.0, 1.604363869725654, 154.2852809642227, 8.99947858174234], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 10, 0, 0.0, 312.8, 278, 381, 297.0, 379.7, 381.0, 381.0, 4.608294930875576, 2.0881336405529956, 3.9602534562211984], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 10, 0, 0.0, 6135.899999999999, 4643, 6880, 6332.5, 6876.6, 6880.0, 6880.0, 0.8423890152472412, 21.00411454384635, 2.5896881054671046], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 10, 0, 0.0, 2479.9000000000005, 2107, 2768, 2508.5, 2768.0, 2768.0, 2768.0, 3.427004797806717, 12.432932445167923, 0.48192254969156956], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 10, 0, 0.0, 6981.2, 4955, 8630, 7078.5, 8574.7, 8630.0, 8630.0, 0.8515711487694797, 43.180395368517416, 3.7896579345141785], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 8, 100.0, 2.6666666666666665], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 300, 8, "500\/Internal Server Error", 8, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 10, 8, "500\/Internal Server Error", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
