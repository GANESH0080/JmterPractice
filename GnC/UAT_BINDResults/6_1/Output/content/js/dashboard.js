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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3516260162601626, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.25, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.25, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.0, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180, 0, 0.0, 5022.75, 277, 106831, 1153.0, 6682.6, 8008.549999999997, 106248.61, 0.989201220014838, 67.96812208906933, 1.278458855411755], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 6, 0, 0.0, 7638.5, 5253, 9743, 7228.0, 9743.0, 9743.0, 9743.0, 0.5592841163310962, 1.2287137047912007, 1.1365920371923937], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 6, 0, 0.0, 1129.0, 1065, 1225, 1098.0, 1225.0, 1225.0, 1225.0, 0.8723466123873219, 0.5528837416400116, 0.8433819787728991], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 12, 0, 0.0, 7369.999999999999, 6602, 8019, 7577.5, 8019.0, 8019.0, 8019.0, 0.8419280151547043, 0.5064723216165018, 3.68507945695643], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 6, 0, 0.0, 1431.5, 1205, 1678, 1406.0, 1678.0, 1678.0, 1678.0, 0.8078632018311567, 0.5561948801669584, 0.9419811161976572], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 6, 0, 0.0, 443.0, 361, 543, 421.0, 543.0, 543.0, 543.0, 0.9668063164679342, 22.783835703351595, 0.9101575088623912], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 6, 0, 0.0, 429.6666666666667, 391, 461, 437.5, 461.0, 461.0, 461.0, 3.3463469046291134, 98.9220231455661, 2.790801031790296], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 6, 0, 0.0, 97641.83333333333, 80321, 106831, 103933.5, 106831.0, 106831.0, 106831.0, 0.056158742044178214, 0.030071982637588916, 0.05440378135529764], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 6, 0, 0.0, 748.0, 552, 1237, 664.0, 1237.0, 1237.0, 1237.0, 0.8778346744696416, 77.19501531638625, 0.7175269751280176], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 6, 0, 0.0, 480.66666666666663, 408, 579, 473.0, 579.0, 579.0, 579.0, 3.019627579265224, 67.67229177151485, 2.506526799194766], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 6, 0, 0.0, 413.5, 379, 491, 398.5, 491.0, 491.0, 491.0, 4.198740377886634, 132.99428140307907, 3.448379548635409], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 6, 0, 0.0, 2699.6666666666665, 2477, 2840, 2721.0, 2840.0, 2840.0, 2840.0, 2.112676056338028, 54.16001870598592, 1.7041703345070423], "isController": false}, {"data": ["GOTO HOME PAGE", 6, 0, 0.0, 748.0, 552, 1237, 664.0, 1237.0, 1237.0, 1237.0, 0.8775778850372971, 77.17243377029399, 0.7173170798595876], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 6, 0, 0.0, 1921.1666666666667, 1693, 2245, 1899.0, 2245.0, 2245.0, 2245.0, 0.21082220660576248, 4.0918860901264935, 0.16985187543921293], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 6, 0, 0.0, 99563.0, 82566, 108776, 105781.5, 108776.0, 108776.0, 108776.0, 0.05515719801434087, 1.1000916413862842, 0.09787170780474352], "isController": true}, {"data": ["LOGIN PROCESS", 6, 0, 0.0, 5544.666666666666, 3871, 9157, 4263.5, 9157.0, 9157.0, 9157.0, 0.6100660904931368, 508.42157314438225, 1.0634452846975089], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 6, 0, 0.0, 1167.8333333333335, 1020, 1358, 1165.0, 1358.0, 1358.0, 1358.0, 2.34375, 1.07574462890625, 3.44696044921875], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 6, 0, 0.0, 2126.5, 2001, 2343, 2104.5, 2343.0, 2343.0, 2343.0, 2.5391451544646637, 69.8785640605163, 2.0977703131612357], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 6, 0, 0.0, 467.66666666666663, 388, 734, 424.0, 734.0, 734.0, 734.0, 2.951303492375799, 93.48196169454009, 2.758200627151992], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 6, 0, 0.0, 977.0, 763, 1515, 818.5, 1515.0, 1515.0, 1515.0, 2.4519820187985286, 79.12909940743768, 7.7773804658765835], "isController": false}, {"data": ["LOGIN ", 6, 0, 0.0, 4932.166666666666, 3515, 7426, 3883.0, 7426.0, 7426.0, 7426.0, 0.7403751233958539, 602.2156303985687, 0.6695189104146101], "isController": false}, {"data": ["GET QUOTE", 6, 0, 0.0, 1685.6666666666667, 1488, 1903, 1676.5, 1903.0, 1903.0, 1903.0, 0.8286148322054965, 0.37465690167103993, 1.6766503245408093], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 6, 0, 0.0, 1076.0, 1012, 1174, 1042.5, 1174.0, 1174.0, 1174.0, 2.5284450063211126, 1.1605167509481669, 3.31858407079646], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 6, 0, 0.0, 508.6666666666667, 373, 1079, 405.5, 1079.0, 1079.0, 1079.0, 2.9835902536051715, 1.7802477001491794, 6.6752004599701635], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 12, 0, 0.0, 1539.8333333333335, 1219, 1897, 1524.5, 1895.2, 1897.0, 1897.0, 3.638568829593693, 42.661982640994545, 9.81418662825955], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 6, 0, 0.0, 2699.6666666666665, 2477, 2840, 2721.0, 2840.0, 2840.0, 2840.0, 2.112676056338028, 54.16001870598592, 1.7041703345070423], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 6, 0, 0.0, 324.5, 306, 350, 322.0, 350.0, 350.0, 350.0, 4.672897196261682, 13.44826956775701, 3.5366165303738315], "isController": false}, {"data": ["GOTO QUOTE PAGE", 6, 0, 0.0, 463.5, 413, 536, 457.0, 536.0, 536.0, 536.0, 0.963855421686747, 22.789909638554217, 0.8047816265060241], "isController": false}, {"data": ["QUOTE CREATION", 6, 0, 0.0, 12793.0, 10008, 15252, 12358.5, 15252.0, 15252.0, 15252.0, 0.3696857670979667, 18.92124441620456, 2.9444893715341958], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 6, 0, 0.0, 2126.5, 2001, 2343, 2104.5, 2343.0, 2343.0, 2343.0, 2.5380710659898473, 69.8490046002538, 2.096882931472081], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 6, 0, 0.0, 387.3333333333333, 322, 490, 361.5, 490.0, 490.0, 490.0, 3.468208092485549, 70.14766979768787, 2.889044436416185], "isController": false}, {"data": ["LOGIN -0", 6, 0, 0.0, 1559.8333333333333, 489, 3801, 641.0, 3801.0, 3801.0, 3801.0, 1.397624039133473, 1.0018125436757512, 0.7902581236897275], "isController": false}, {"data": ["GOTO URL", 6, 0, 0.0, 4085.3333333333335, 2394, 6712, 3301.5, 6712.0, 6712.0, 6712.0, 0.8841732979664013, 3.2077185565870914, 0.1243368700265252], "isController": false}, {"data": ["LOGIN -1", 6, 0, 0.0, 3370.3333333333335, 3024, 4210, 3271.5, 4210.0, 4210.0, 4210.0, 0.8069939475453933, 655.8244367854742, 0.27346376933423], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 6, 0, 0.0, 612.5, 352, 1731, 380.5, 1731.0, 1731.0, 1731.0, 0.9879795817553103, 19.754767516054667, 0.8287836530545035], "isController": false}, {"data": ["APPLICATION CREATION", 6, 0, 0.0, 2001.5, 1756, 2534, 1885.0, 2534.0, 2534.0, 2534.0, 1.6802016241949034, 113.03950224026883, 9.424880985718286], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 6, 0, 0.0, 286.33333333333337, 277, 292, 287.5, 292.0, 292.0, 292.0, 4.7281323877068555, 2.1424349881796694, 4.0632387706855795], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 6, 0, 0.0, 3005.333333333333, 2710, 3290, 3025.0, 3290.0, 3290.0, 3290.0, 0.6701664246621244, 16.679334091924495, 2.0602381883167653], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 6, 0, 0.0, 4085.3333333333335, 2394, 6712, 3301.5, 6712.0, 6712.0, 6712.0, 0.8738712496358869, 3.170343449606758, 0.12288814448004662], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 6, 0, 0.0, 3060.833333333333, 2814, 3316, 3069.0, 3316.0, 3316.0, 3316.0, 1.3783597518952446, 69.889838904204, 6.133970106822881], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
