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

    var data = {"OkPercent": 81.8289786223278, "KoPercent": 18.171021377672208};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35526315789473684, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09423076923076923, 500, 1500, ""], "isController": true}, {"data": [0.675, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.325, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.6, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.025, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.725, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.275, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.05, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.6, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.525, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [0.6, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.475, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [0.65, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.375, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.45, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.45, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.55, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [0.675, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [0.7, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [0.8, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.15, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [0.6, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [0.55, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [0.6, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [0.65, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.075, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [0.575, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.2, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.475, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [0.675, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 842, 153, 18.171021377672208, 3859.1674584323027, 262, 151403, 722.5, 3166.9000000000024, 11563.849999999991, 138702.3499999999, 2.8952118971890313, 206.3745849630362, 4.245559507435743], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 260, 87, 33.46153846153846, 11529.292307692309, 440, 152729, 2429.0, 15025.900000000001, 116033.64999999995, 149172.16, 0.9198102360728349, 149.50991637244533, 3.9467819023798323], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 20, 0, 0.0, 712.85, 425, 1097, 718.0, 1067.4, 1095.65, 1097.0, 1.3383297644539613, 26.79012061697002, 1.1239878881156316], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 20, 6, 30.0, 865.9999999999999, 325, 2596, 812.5, 1283.9000000000003, 2530.949999999999, 2596.0, 1.2030075187969924, 27.2453007518797, 3.480498120300752], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 20, 0, 0.0, 840.25, 561, 1238, 830.5, 1224.6000000000001, 1237.45, 1238.0, 1.3214403700033035, 35.49706289230261, 1.2647887760158574], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 20, 0, 0.0, 789.0500000000001, 369, 1517, 764.0, 1324.6000000000001, 1507.8999999999999, 1517.0, 1.2944983818770226, 0.8697411003236246, 1.5448017799352751], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 14, 0, 0.0, 913.5, 706, 1401, 846.0, 1256.5, 1401.0, 1401.0, 0.9267227113258755, 33.65239417157609, 0.8950476186536044], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 20, 6, 30.0, 6084.5, 440, 34628, 2343.5, 14396.7, 33619.89999999999, 34628.0, 0.2946853497178388, 93.18206881087094, 0.2437485265732514], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 20, 20, 100.0, 868.2499999999998, 389, 1419, 831.5, 1287.1000000000001, 1412.8, 1419.0, 1.3163090693694879, 0.8018687475319205, 2.6763237133078843], "isController": false}, {"data": ["\/GnC.POS\/-581", 20, 0, 0.0, 9596.650000000001, 3836, 18066, 9682.0, 17365.0, 18032.05, 18066.0, 1.08038029386344, 878.8545521148444, 0.9790946413137425], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 20, 0, 0.0, 622.0999999999999, 266, 1814, 417.0, 1689.2000000000012, 1810.5, 1814.0, 1.002757583354224, 1.8126018425670594, 0.9430230007520681], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 20, 19, 95.0, 96562.34999999999, 306, 151403, 126202.0, 147988.7, 151234.35, 151403.0, 0.09513842641042718, 0.3372815160902864, 0.09225825920464276], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 20, 6, 30.0, 1326.6999999999998, 633, 2818, 1067.5, 2753.000000000001, 2817.25, 2818.0, 0.9542440001908488, 1.5299587885872419, 4.177613137554273], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 20, 6, 30.0, 1751.7, 637, 3719, 1539.5, 3379.7000000000003, 3702.5, 3719.0, 0.780579189758801, 1.2531192676215752, 3.4424761923347122], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 20, 0, 0.0, 8946.800000000001, 2435, 17376, 9004.0, 16837.8, 17349.6, 17376.0, 1.11333778668448, 904.8598499081497, 0.3783608884435538], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 20, 0, 0.0, 648.5500000000001, 383, 1399, 580.0, 935.8000000000004, 1376.6499999999996, 1399.0, 2.0134903855834088, 1.4550614114567604, 1.1404535387093526], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 20, 0, 0.0, 699.5, 416, 1087, 633.0, 1011.7000000000002, 1083.55, 1087.0, 1.1277135607555682, 0.5935914152805187, 2.5747991260219907], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 20, 0, 0.0, 705.5, 276, 3413, 367.5, 2489.500000000003, 3374.4999999999995, 3413.0, 0.825866127100797, 2.1613658535326423, 0.7766690238262378], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 20, 6, 30.0, 466.95000000000005, 265, 1836, 353.0, 942.0000000000009, 1793.3999999999994, 1836.0, 1.1823126034523528, 1.5076794898321115, 1.0172044957436746], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 20, 0, 0.0, 772.0, 539, 2358, 654.0, 1237.7000000000005, 2303.0499999999993, 2358.0, 1.1217049915872126, 0.5225129697139653, 1.6507904514862592], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 14, 0, 0.0, 540.2857142857143, 424, 904, 476.5, 845.5, 904.0, 904.0, 0.8601093567610739, 25.834358872949558, 0.8046726208760827], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 20, 6, 30.0, 419.65, 262, 1017, 345.0, 872.1000000000006, 1011.1999999999999, 1017.0, 1.3191741969527075, 1.8977299897764, 1.2354375535914517], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 20, 6, 30.0, 784.75, 389, 2140, 562.0, 1976.1000000000017, 2136.0499999999997, 2140.0, 1.1297520194317348, 19.01855882477546, 0.9388857114613343], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 20, 6, 30.0, 6638.05, 455, 34383, 2001.5, 30581.000000000036, 34283.299999999996, 34383.0, 0.3456499948152501, 79.26164502933705, 0.27915287667208183], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 20, 0, 0.0, 1021.7499999999999, 523, 2303, 659.0, 2139.6000000000004, 2295.4, 2303.0, 1.0995052226498077, 0.5121718664101154, 1.4441743402968663], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 20, 6, 30.0, 751.6499999999999, 453, 1674, 637.0, 1262.0000000000005, 1654.4999999999998, 1674.0, 1.0705491917353602, 23.239960674044536, 0.8938667567712237], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 20, 0, 0.0, 1085.0999999999997, 720, 1692, 1011.0, 1607.7000000000005, 1688.8999999999999, 1692.0, 1.251721116535236, 110.06393556765553, 1.0243577106020778], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 20, 6, 30.0, 476.95, 266, 1193, 432.0, 630.6, 1164.9499999999996, 1193.0, 1.2228676245796393, 26.859379776826657, 1.0449308315499848], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 20, 6, 30.0, 1545.0000000000002, 755, 2694, 1437.0, 2667.7000000000003, 2693.8, 2694.0, 0.9255831173639393, 1.4859043814790818, 4.0810622801740095], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 14, 0, 0.0, 497.0, 323, 1808, 388.0, 1200.0, 1808.0, 1808.0, 0.8840058091810318, 0.5326480315084928, 1.9786536275809812], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 20, 0, 0.0, 555.0, 374, 828, 526.0, 784.9000000000001, 825.9499999999999, 828.0, 1.1167569378524764, 22.596278843737785, 0.9313578368418114], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 20, 0, 0.0, 692.35, 297, 1639, 523.0, 1461.6000000000001, 1630.25, 1639.0, 0.9713453132588635, 1.7396946333171444, 0.9134819694026226], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 20, 0, 0.0, 508.3, 314, 977, 461.5, 823.7000000000002, 969.7499999999999, 977.0, 0.8170935980716592, 3.240765565633043, 0.768419077092781], "isController": false}, {"data": ["\/GnC.POS\/-571", 20, 0, 0.0, 1831.5, 1029, 2709, 1961.0, 2401.0, 2693.7, 2709.0, 1.7274140611504578, 6.27705832181724, 0.24460453014337538], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 20, 0, 0.0, 849.0999999999999, 517, 1453, 821.5, 1009.0000000000001, 1431.1499999999996, 1453.0, 1.2799180852425445, 0.7797000991936517, 2.591084170613081], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 20, 6, 30.0, 1335.2000000000003, 682, 2201, 1280.0, 2184.4, 2200.45, 2201.0, 0.9529708867394101, 1.5298719147567543, 4.20181987659027], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 20, 6, 30.0, 439.0, 319, 711, 386.5, 700.9000000000002, 710.9, 711.0, 1.3180440226703571, 1.8644402019902466, 2.6927227494398314], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 20, 6, 30.0, 472.0, 268, 821, 465.0, 666.8, 813.3, 821.0, 1.3906271728549575, 30.54409374565429, 1.1434649214295647], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 20, 6, 30.0, 469.1, 265, 1012, 367.5, 919.9000000000001, 1007.55, 1012.0, 1.322226629644321, 1.9021211407510248, 1.238296228348539], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 20, 6, 30.0, 352.35, 270, 641, 305.0, 592.8000000000002, 638.9, 641.0, 1.3772207684891888, 4.0874137085112245, 1.0436751136207134], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 20, 0, 0.0, 2270.0000000000005, 1212, 3673, 2267.5, 3174.7000000000003, 3648.3999999999996, 3673.0, 1.1319900384876613, 59.942962736302924, 3.1996405931627803], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 20, 6, 30.0, 512.8499999999999, 312, 1156, 386.0, 917.1000000000004, 1144.7999999999997, 1156.0, 1.323276432446738, 1.871841711327246, 2.7034123991001717], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 20, 0, 0.0, 4581.15, 1326, 14769, 2270.5, 11933.400000000001, 14632.299999999997, 14769.0, 0.09963831292408556, 41.12250752424947, 0.08037231101102996], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 20, 6, 30.0, 912.4000000000001, 445, 2953, 582.5, 2582.500000000001, 2936.8999999999996, 2953.0, 1.3468013468013469, 23.48096853956229, 1.1258417508417509], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 20, 6, 30.0, 342.50000000000006, 262, 1108, 277.0, 484.5000000000001, 1077.0499999999997, 1108.0, 1.4034102869974037, 1.7896222194933689, 1.2074262332467898], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/Total Premium\\\/", 20, 13.071895424836601, 2.375296912114014], "isController": false}, {"data": ["500\/Internal Server Error", 133, 86.9281045751634, 15.795724465558195], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 842, 153, "500\/Internal Server Error", 133, "Test failed: text expected to contain \\\/Total Premium\\\/", 20, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 20, 20, "Test failed: text expected to contain \\\/Total Premium\\\/", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 20, 19, "500\/Internal Server Error", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 20, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
