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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47767857142857145, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, ""], "isController": true}, {"data": [0.875, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.625, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.375, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.125, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.375, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 172, 0, 0.0, 3814.186046511628, 252, 109920, 602.5, 3299.8000000000006, 10385.399999999961, 109162.99, 0.8034041917146607, 39.89934439502964, 1.1877909128913675], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 52, 0, 0.0, 12136.596153846156, 569, 111287, 2710.0, 18491.5, 100947.59999999992, 111287.0, 0.2525608210169459, 24.29958293314181, 1.095031017625831], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 4, 0, 0.0, 423.25, 376, 529, 394.0, 529.0, 529.0, 529.0, 5.319148936170213, 106.47647938829788, 4.467253989361702], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 4, 0, 0.0, 848.0, 792, 921, 839.5, 921.0, 921.0, 921.0, 3.142183817753339, 105.01460624509035, 9.972751374705421], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 4, 0, 0.0, 530.25, 513, 550, 529.0, 550.0, 550.0, 550.0, 3.6463081130355515, 2.5175193710118506, 3.535921832269827], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 4, 0, 0.0, 847.25, 701, 1042, 823.0, 1042.0, 1042.0, 1042.0, 2.51414204902577, 1.7554800439974858, 3.0002749842866123], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 4, 0, 0.0, 882.0, 741, 1184, 801.5, 1184.0, 1184.0, 1184.0, 2.7681660899653977, 100.92452422145328, 2.673551038062284], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 4, 0, 0.0, 1016.0, 954, 1065, 1022.5, 1065.0, 1065.0, 1065.0, 1.2158054711246202, 33.45008548632219, 1.0056515957446808], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 4, 0, 0.0, 7453.0, 6891, 8067, 7427.0, 8067.0, 8067.0, 8067.0, 0.4958472790380563, 1.0759498574439073, 1.008158237262923], "isController": false}, {"data": ["\/GnC.POS\/-581", 4, 0, 0.0, 3133.5, 2946, 3313, 3137.5, 3313.0, 3313.0, 3313.0, 1.194743130227001, 971.8850339755078, 1.08273596176822], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 4, 0, 0.0, 538.0, 500, 577, 537.5, 577.0, 577.0, 577.0, 6.896551724137931, 12.747508081896553, 6.485721982758621], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 4, 0, 0.0, 100546.0, 88913, 109920, 101675.5, 109920.0, 109920.0, 109920.0, 0.03579130092431035, 0.01946851036605553, 0.03470777521273454], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 4, 0, 0.0, 6797.75, 6338, 6999, 6927.0, 6999.0, 6999.0, 6999.0, 0.5699629524080935, 0.3523306141350812, 2.495257730122542], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 4, 0, 0.0, 16162.75, 14691, 16957, 16501.5, 16957.0, 16957.0, 16957.0, 0.23097355352812102, 0.13353158563344497, 1.0186294606767525], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 4, 0, 0.0, 2515.75, 2367, 2663, 2516.5, 2663.0, 2663.0, 2663.0, 1.4571948998178506, 1184.3280396174862, 0.49521857923497264], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 4, 0, 0.0, 611.5, 572, 688, 593.0, 688.0, 688.0, 688.0, 5.532503457814661, 3.998098201936376, 3.1336445366528354], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 4, 0, 0.0, 670.5, 618, 711, 676.5, 711.0, 711.0, 711.0, 3.2388663967611335, 1.7016700404858298, 7.39498987854251], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 4, 0, 0.0, 458.75, 314, 688, 416.5, 688.0, 688.0, 688.0, 3.875968992248062, 7.1671360222868215, 3.6450763081395348], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 4, 0, 0.0, 307.0, 259, 396, 286.5, 396.0, 396.0, 396.0, 4.319654427645789, 1.9826538876889848, 3.716421436285097], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 4, 0, 0.0, 645.5, 591, 683, 654.0, 683.0, 683.0, 683.0, 3.2441200324412005, 1.5080089213300891, 4.774305555555555], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 4, 0, 0.0, 472.0, 383, 579, 463.0, 579.0, 579.0, 579.0, 4.608294930875576, 151.23667914746545, 4.311275921658986], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 4, 0, 0.0, 292.25, 252, 386, 265.5, 386.0, 386.0, 386.0, 3.098373353989156, 1.4190792021688614, 2.9016992641363286], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 4, 0, 0.0, 446.0, 406, 528, 425.0, 528.0, 528.0, 528.0, 3.8095238095238093, 85.42131696428571, 3.165922619047619], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 4, 0, 0.0, 1341.5, 1210, 1595, 1280.5, 1595.0, 1595.0, 1595.0, 1.0473946059177797, 26.86505793401414, 0.845893885833988], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 4, 0, 0.0, 618.75, 607, 634, 617.0, 634.0, 634.0, 634.0, 3.182179793158314, 1.4792163882259348, 4.179718575974543], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 4, 0, 0.0, 430.75, 382, 459, 441.0, 459.0, 459.0, 459.0, 3.6968576709796674, 110.27484548290202, 3.0867317467652495], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 4, 0, 0.0, 888.25, 569, 1221, 881.5, 1221.0, 1221.0, 1221.0, 2.6525198938992043, 233.24560676392574, 2.1707145225464193], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 4, 0, 0.0, 479.25, 450, 504, 481.5, 504.0, 504.0, 504.0, 4.085801838610828, 134.0893130745659, 3.491285750766088], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 4, 0, 0.0, 2806.0, 2477, 3075, 2836.0, 3075.0, 3075.0, 3075.0, 1.244167962674961, 0.7690999222395024, 5.485760108864697], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 4, 0, 0.0, 375.5, 339, 413, 375.0, 413.0, 413.0, 413.0, 5.772005772005772, 3.4778589466089467, 12.919372294372295], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 4, 0, 0.0, 401.5, 346, 451, 404.5, 451.0, 451.0, 451.0, 4.020100502512563, 81.34323963567839, 3.352701005025126], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 4, 0, 0.0, 261.25, 256, 265, 262.0, 265.0, 265.0, 265.0, 12.779552715654951, 23.680860623003195, 12.018270766773163], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 4, 0, 0.0, 293.5, 260, 327, 293.5, 327.0, 327.0, 327.0, 1.3913043478260871, 2.5713315217391304, 1.3084239130434783], "isController": false}, {"data": ["\/GnC.POS\/-571", 4, 0, 0.0, 1843.75, 1145, 2496, 1867.0, 2496.0, 2496.0, 2496.0, 1.6025641025641024, 5.823379907852564, 0.22692558092948717], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 4, 0, 0.0, 886.0, 828, 1016, 850.0, 1016.0, 1016.0, 1016.0, 2.0304568527918785, 0.9299651015228426, 4.110485406091371], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 4, 0, 0.0, 1462.25, 1435, 1488, 1463.0, 1488.0, 1488.0, 1488.0, 2.688172043010753, 1.6617313508064517, 11.852633568548388], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 4, 0, 0.0, 323.25, 298, 379, 308.0, 379.0, 379.0, 379.0, 2.8429282160625444, 1.3020833333333333, 5.808013503909026], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 4, 0, 0.0, 545.25, 445, 724, 506.0, 724.0, 724.0, 724.0, 5.188067444876784, 170.26386186770426, 4.265969520103761], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 4, 0, 0.0, 267.75, 257, 279, 267.5, 279.0, 279.0, 279.0, 2.8169014084507045, 1.2901628521126762, 2.638094190140845], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 4, 0, 0.0, 354.5, 344, 367, 353.5, 367.0, 367.0, 367.0, 5.602240896358543, 16.155681022408963, 4.245448179271709], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 4, 0, 0.0, 2261.25, 1981, 2642, 2211.0, 2642.0, 2642.0, 2642.0, 1.3192612137203166, 49.930944920844325, 4.127844656992084], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 4, 0, 0.0, 341.0, 315, 365, 342.0, 365.0, 365.0, 365.0, 2.663115845539281, 1.219727862849534, 5.4406624500665774], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 4, 0, 0.0, 1424.5, 1344, 1504, 1425.0, 1504.0, 1504.0, 1504.0, 0.16520051212158757, 3.2071324030479493, 0.1332574443480775], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 4, 0, 0.0, 520.5, 455, 656, 485.5, 656.0, 656.0, 656.0, 2.9390154298310063, 69.51962596436444, 2.456833210874357], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 4, 0, 0.0, 286.75, 258, 333, 278.0, 333.0, 333.0, 333.0, 6.211180124223602, 2.8508346273291925, 5.34379852484472], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 172, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
