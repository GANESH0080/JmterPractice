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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2804878048780488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.5, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.25, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.5, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 0, 0.0, 3629.166666666666, 285, 51460, 960.0, 7137.400000000001, 27567.449999999968, 51460.0, 0.23525352488198115, 15.917228987939335, 0.30404527012985993], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 1, 0, 0.0, 8019.0, 8019, 8019, 8019.0, 8019.0, 8019.0, 8019.0, 0.12470382840753212, 0.27388565438333956, 0.25342643253522884], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.8383453207671958, 1.2788318452380951], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 2, 0, 0.0, 7142.0, 7142, 7142, 7142.0, 7142.0, 7142.0, 7142.0, 0.1492537313432836, 0.08978544776119403, 0.6532765858208955], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 1, 0, 0.0, 1730.0, 1730, 1730, 1730.0, 1730.0, 1730.0, 1730.0, 0.5780346820809249, 0.3979633309248555, 0.6739974710982659], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 1, 0, 0.0, 1507.0, 1507, 1507, 1507.0, 1507.0, 1507.0, 1507.0, 0.6635700066357001, 15.608799560384872, 0.6246889515593895], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 39.948004645270274, 1.1270059121621623], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 1, 0, 0.0, 51460.0, 51460, 51460, 51460.0, 51460.0, 51460.0, 51460.0, 0.0194325689856199, 0.010399460746210648, 0.018825301204819275], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 1, 0, 0.0, 1667.0, 1667, 1667, 1667.0, 1667.0, 1667.0, 1667.0, 0.5998800239952009, 52.752535430413914, 0.49033162117576484], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 28.290719696969695, 1.0480784406565655], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 24.65366097383721, 0.9549872819767442], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 1, 0, 0.0, 2593.0, 2593, 2593, 2593.0, 2593.0, 2593.0, 2593.0, 0.38565368299267255, 9.886518390860008, 0.3110839278827613], "isController": false}, {"data": ["GOTO HOME PAGE", 1, 0, 0.0, 1667.0, 1667, 1667, 1667.0, 1667.0, 1667.0, 1667.0, 0.5998800239952009, 52.752535430413914, 0.49033162117576484], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 1, 0, 0.0, 1722.0, 1722, 1722, 1722.0, 1722.0, 1722.0, 1722.0, 0.5807200929152149, 11.27186774099884, 0.4678653092334495], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 1, 0, 0.0, 53182.0, 53182, 53182, 53182.0, 53182.0, 53182.0, 53182.0, 0.01880335451844609, 0.3750387819186943, 0.03336493667970366], "isController": true}, {"data": ["LOGIN PROCESS", 1, 0, 0.0, 7806.0, 7806, 7806, 7806.0, 7806.0, 7806.0, 7806.0, 0.12810658467845248, 106.76245135953113, 0.22331079458109146], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.5945393458549223, 1.9050558613989637], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 32.723552690249704, 0.9823684601664685], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 31.317796805760707, 1.3804583641063515], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 1, 0, 0.0, 1081.0, 1081, 1081, 1081.0, 1081.0, 1081.0, 1081.0, 0.9250693802035153, 20.165428422756708, 2.934204440333025], "isController": false}, {"data": ["LOGIN ", 1, 0, 0.0, 7096.0, 7096, 7096, 7096.0, 7096.0, 7096.0, 7096.0, 0.14092446448703494, 114.62691348999437, 0.12743755284667418], "isController": false}, {"data": ["GET QUOTE", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 0.5203089039125431, 2.3284666283084006], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.7487510195758564, 2.141109298531811], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 1.480594758064516, 5.551624534739454], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 2, 0, 0.0, 1219.0, 823, 1615, 1219.0, 1615.0, 1615.0, 1615.0, 1.238390092879257, 14.517221362229103, 3.340267027863777], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 1, 0, 0.0, 2593.0, 2593, 2593, 2593.0, 2593.0, 2593.0, 2593.0, 0.38565368299267255, 9.886518390860008, 0.3110839278827613], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 9.435835040983607, 2.4814293032786887], "isController": false}, {"data": ["GOTO QUOTE PAGE", 1, 0, 0.0, 1051.0, 1051, 1051, 1051.0, 1051.0, 1051.0, 1051.0, 0.9514747859181732, 22.499033658420554, 0.7944442792578497], "isController": false}, {"data": ["QUOTE CREATION", 1, 0, 0.0, 13934.0, 13934, 13934, 13934.0, 13934.0, 13934.0, 13934.0, 0.07176690110521028, 3.6701340919692838, 0.5716121537247022], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 32.723552690249704, 0.9823684601664685], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 47.48019366197183, 1.9554174002347418], "isController": false}, {"data": ["LOGIN -0", 1, 0, 0.0, 1305.0, 1305, 1305, 1305.0, 1305.0, 1305.0, 1305.0, 0.7662835249042146, 0.5492696360153257, 0.4332794540229885], "isController": false}, {"data": ["GOTO URL", 1, 0, 0.0, 2849.0, 2849, 2849, 2849.0, 2849.0, 2849.0, 2849.0, 0.351000351000351, 1.2734045937170937, 0.04935942435942436], "isController": false}, {"data": ["LOGIN -1", 1, 0, 0.0, 5786.0, 5786, 5786, 5786.0, 5786.0, 5786.0, 5786.0, 0.17283097131005876, 140.45554463359835, 0.058566745160732805], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 28.16213688380282, 1.1815030809859155], "isController": false}, {"data": ["APPLICATION CREATION", 1, 0, 0.0, 2531.0, 2531, 2531, 2531.0, 2531.0, 2531.0, 2531.0, 0.3951007506914263, 18.30582032793362, 2.216268273409719], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.5899122807017545, 3.015350877192983], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 1, 0, 0.0, 3995.0, 3995, 3995, 3995.0, 3995.0, 3995.0, 3995.0, 0.2503128911138924, 6.218955334793492, 0.7695165832290363], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 1, 0, 0.0, 2849.0, 2849, 2849, 2849.0, 2849.0, 2849.0, 2849.0, 0.351000351000351, 1.2734045937170937, 0.04935942435942436], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 1, 0, 0.0, 2551.0, 2551, 2551, 2551.0, 2551.0, 2551.0, 2551.0, 0.3920031360250882, 19.876932452959622, 1.7444905184241473], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
