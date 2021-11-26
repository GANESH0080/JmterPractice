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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.34494773519163763, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.25, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.0, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 210, 0, 0.0, 6022.657142857143, 271, 127784, 1245.5, 7783.8, 10630.349999999997, 127229.91999999994, 1.009338786967033, 69.7699710145537, 1.3044849563460976], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 7, 0, 0.0, 9429.57142857143, 4951, 10958, 9808.0, 10958.0, 10958.0, 10958.0, 0.6194142111317582, 1.3617088642598, 1.2587900130519423], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 7, 0, 0.0, 1411.1428571428573, 1251, 1569, 1354.0, 1569.0, 1569.0, 1569.0, 0.8378216636744464, 0.5310022067624177, 0.8100033662477558], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 14, 0, 0.0, 7846.857142857143, 7128, 8192, 7800.0, 8192.0, 8192.0, 8192.0, 0.9473541751251862, 0.5698927459737447, 4.1465248172959805], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 7, 0, 0.0, 1780.857142857143, 1382, 2740, 1680.0, 2740.0, 2740.0, 2740.0, 0.813953488372093, 0.5603878997093024, 0.9490824854651163], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 7, 0, 0.0, 449.2857142857143, 400, 525, 431.0, 525.0, 525.0, 525.0, 0.9644530173601543, 22.74860498759989, 0.9079420983742078], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 7, 0, 0.0, 396.2857142857143, 373, 424, 394.0, 424.0, 424.0, 424.0, 3.8845726970033296, 114.83822228773585, 3.239672932852386], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 7, 0, 0.0, 118461.28571428571, 88222, 127784, 122707.0, 127784.0, 127784.0, 127784.0, 0.05468579106902909, 0.029265442876785102, 0.052976860098121935], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 7, 0, 0.0, 858.0, 469, 1300, 827.0, 1300.0, 1300.0, 1300.0, 1.0889856876166772, 95.76556544609521, 0.8901181841163659], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 7, 0, 0.0, 458.42857142857144, 396, 518, 468.0, 518.0, 518.0, 518.0, 3.6363636363636362, 81.48640422077922, 3.018465909090909], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 7, 0, 0.0, 500.71428571428567, 414, 642, 475.0, 642.0, 642.0, 642.0, 4.5811518324607325, 164.01328840804973, 3.7624498936518322], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 7, 0, 0.0, 2616.5714285714284, 2558, 2835, 2578.0, 2835.0, 2835.0, 2835.0, 2.341137123745819, 60.01678772993311, 1.88845631270903], "isController": false}, {"data": ["GOTO HOME PAGE", 7, 0, 0.0, 858.0, 469, 1300, 827.0, 1300.0, 1300.0, 1300.0, 1.0995915802701854, 96.69824924403079, 0.8987872584825637], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 7, 0, 0.0, 2118.1428571428573, 1571, 3203, 1896.0, 3203.0, 3203.0, 3203.0, 0.1690045631232043, 3.2804992877664843, 0.1361609029068785], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 7, 0, 0.0, 120579.42857142858, 90847, 129377, 124603.0, 129377.0, 129377.0, 129377.0, 0.05397195000655374, 1.0765175273907646, 0.09576858707217592], "isController": true}, {"data": ["LOGIN PROCESS", 7, 0, 0.0, 8370.142857142857, 7004, 12122, 8057.0, 12122.0, 12122.0, 12122.0, 0.5771291944925385, 480.9723692956963, 1.006030871258966], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 7, 0, 0.0, 1309.9999999999998, 1215, 1496, 1237.0, 1496.0, 1496.0, 1496.0, 2.5584795321637426, 1.1743021290204678, 3.7627638432017543], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 7, 0, 0.0, 2298.8571428571427, 2125, 2392, 2359.0, 2392.0, 2392.0, 2392.0, 2.6080476900149034, 71.77479682842771, 2.1546956501490313], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 7, 0, 0.0, 527.8571428571429, 413, 709, 482.0, 709.0, 709.0, 709.0, 4.032258064516129, 144.36192666330646, 3.768428679435484], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 7, 0, 0.0, 971.4285714285714, 794, 1106, 995.0, 1106.0, 1106.0, 1106.0, 3.1746031746031744, 115.55059523809524, 10.069444444444445], "isController": false}, {"data": ["LOGIN ", 7, 0, 0.0, 7999.142857142858, 6669, 11703, 7627.0, 11703.0, 11703.0, 11703.0, 0.5977796754910333, 486.2295513983774, 0.5405702924850555], "isController": false}, {"data": ["GET QUOTE", 7, 0, 0.0, 2084.0, 1898, 2190, 2152.0, 2190.0, 2190.0, 2190.0, 0.8195761620419155, 0.37057008107949885, 1.6583611403816882], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 7, 0, 0.0, 1267.4285714285716, 1228, 1422, 1238.0, 1422.0, 1422.0, 1422.0, 2.6737967914438503, 1.227230949197861, 3.509358288770054], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 7, 0, 0.0, 443.14285714285717, 381, 624, 395.0, 624.0, 624.0, 624.0, 4.062681369704005, 2.4241194500870575, 9.08945607225769], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 14, 0, 0.0, 1581.3571428571427, 1291, 1930, 1574.5, 1925.0, 1930.0, 1930.0, 4.35052827843381, 51.005209951833436, 11.734530376009944], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 7, 0, 0.0, 2616.5714285714284, 2558, 2835, 2578.0, 2835.0, 2835.0, 2835.0, 2.341137123745819, 60.01678772993311, 1.88845631270903], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 7, 0, 0.0, 356.57142857142856, 303, 484, 343.0, 484.0, 484.0, 484.0, 4.827586206896552, 13.893453663793103, 3.653690732758621], "isController": false}, {"data": ["GOTO QUOTE PAGE", 7, 0, 0.0, 458.7142857142857, 427, 517, 439.0, 517.0, 517.0, 517.0, 0.9776536312849162, 23.116161836592177, 0.8163025925279329], "isController": false}, {"data": ["QUOTE CREATION", 7, 0, 0.0, 15615.57142857143, 11953, 17469, 15725.0, 17469.0, 17469.0, 17469.0, 0.39299348753649227, 20.12298810142039, 3.130131722995733], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 7, 0, 0.0, 2298.8571428571427, 2125, 2392, 2359.0, 2392.0, 2392.0, 2392.0, 2.60707635009311, 71.74806506052141, 2.153893156424581], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 7, 0, 0.0, 372.28571428571433, 320, 454, 330.0, 454.0, 454.0, 454.0, 4.247572815533981, 85.9226856416869, 3.5382613395024274], "isController": false}, {"data": ["LOGIN -0", 7, 0, 0.0, 1164.142857142857, 1159, 1172, 1165.0, 1172.0, 1172.0, 1172.0, 5.937234944868533, 4.255791454622561, 3.357088899491094], "isController": false}, {"data": ["GOTO URL", 7, 0, 0.0, 2594.4285714285716, 2206, 2910, 2610.0, 2910.0, 2910.0, 2910.0, 2.3890784982935154, 8.667408809726963, 0.3359641638225256], "isController": false}, {"data": ["LOGIN -1", 7, 0, 0.0, 6827.285714285714, 5500, 10530, 6448.0, 10530.0, 10530.0, 10530.0, 0.664073617303861, 539.6765457499288, 0.22503275898871075], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 7, 0, 0.0, 371.0, 309, 558, 334.0, 558.0, 558.0, 558.0, 1.2822861329913904, 25.63946149706906, 1.0756677619527386], "isController": false}, {"data": ["APPLICATION CREATION", 7, 0, 0.0, 2139.5714285714284, 1952, 2377, 2103.0, 2377.0, 2377.0, 2377.0, 2.1224984839296543, 160.3149636143117, 11.905889933292904], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 7, 0, 0.0, 310.85714285714283, 271, 372, 291.0, 372.0, 372.0, 372.0, 4.9365303244005645, 2.236865303244006, 4.242330747531735], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 7, 0, 0.0, 3643.285714285714, 3209, 4677, 3469.0, 4677.0, 4677.0, 4677.0, 0.664325709404954, 16.54790114596185, 2.0422825519597607], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 7, 0, 0.0, 2594.4285714285716, 2206, 2910, 2610.0, 2910.0, 2910.0, 2910.0, 2.317880794701987, 8.409108547185431, 0.3259519867549669], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 7, 0, 0.0, 3346.0, 3144, 3602, 3362.0, 3602.0, 3602.0, 3602.0, 1.402524544179523, 71.12098652574635, 6.241508152173913], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 210, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
