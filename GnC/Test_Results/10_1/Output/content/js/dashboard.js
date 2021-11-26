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

    var data = {"OkPercent": 98.13953488372093, "KoPercent": 1.8604651162790697};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.39553571428571427, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08076923076923077, 500, 1500, ""], "isController": true}, {"data": [0.75, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.15, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [0.35, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.45, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.8, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.4, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.85, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.35, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.35, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [0.85, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.2, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.85, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.2, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [0.95, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [0.95, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.05, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [0.35, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [0.85, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.05, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.65, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [0.7, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 430, 8, 1.8604651162790697, 5222.944186046509, 264, 186023, 947.5, 7665.800000000017, 12036.3, 129092.93, 1.3518994186832498, 82.39034214255622, 1.9987123059788536], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 130, 8, 6.153846153846154, 16330.946153846153, 708, 187994, 4553.0, 19159.4, 128832.7, 187021.22, 0.41953347877160596, 55.30086286237204, 1.818976396804446], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 10, 0, 0.0, 484.2, 373, 656, 474.5, 650.4, 656.0, 656.0, 1.5961691939345573, 31.951441540303275, 1.3405327214684757], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 10, 0, 0.0, 1872.3, 1054, 3647, 1807.0, 3527.2000000000007, 3647.0, 3647.0, 2.2670596236681027, 126.25352456925869, 7.19525759464974], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 10, 0, 0.0, 627.0, 541, 705, 637.5, 704.6, 705.0, 705.0, 1.4072614691809737, 0.9716150963974106, 1.3646588270475655], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 10, 0, 0.0, 888.0999999999999, 750, 1360, 830.0, 1328.9, 1360.0, 1360.0, 1.37797988149373, 0.962163686785173, 1.644425210141932], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 10, 0, 0.0, 1541.5, 1154, 2772, 1357.5, 2697.0, 2772.0, 2772.0, 1.084010840108401, 39.51674712059621, 1.0469596883468835], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 10, 0, 0.0, 2067.8, 965, 10677, 1102.5, 9757.200000000003, 10677.0, 10677.0, 0.517437648763324, 14.236104373641727, 0.42799774267825724], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 10, 0, 0.0, 9756.9, 4710, 12712, 10283.5, 12647.4, 12712.0, 12712.0, 0.7049203440011279, 1.5303793132313548, 1.4332462462991682], "isController": false}, {"data": ["\/GnC.POS\/-581", 10, 0, 0.0, 7357.599999999999, 5133, 10841, 7216.5, 10668.2, 10841.0, 10841.0, 0.9178522257916476, 746.643206459385, 0.8318035796236806], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 10, 0, 0.0, 624.8, 279, 1280, 324.0, 1279.9, 1280.0, 1280.0, 2.405580947798893, 4.446566033197017, 2.2622797389944673], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 10, 5, 50.0, 137018.30000000002, 114478, 186023, 126061.0, 185752.6, 186023.0, 186023.0, 0.04896080687409729, 0.10827797192097725, 0.04747859494724473], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 10, 0, 0.0, 7683.8, 5334, 8916, 8149.0, 8892.5, 8916.0, 8916.0, 1.121327651939897, 0.6931644567167526, 4.909093616842342], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 10, 3, 30.0, 14037.6, 11543, 16528, 13953.0, 16424.8, 16528.0, 16528.0, 0.4937052579609973, 0.8094066279930882, 2.1773173290545547], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 10, 0, 0.0, 6600.1, 4420, 10179, 6394.5, 9990.900000000001, 10179.0, 10179.0, 0.9819324430479183, 798.0607984951886, 0.33370360369206603], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 10, 0, 0.0, 755.6999999999999, 661, 849, 752.5, 846.6, 849.0, 849.0, 11.402508551881414, 8.240094070695553, 6.458452109464082], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 10, 0, 0.0, 1414.8999999999999, 1054, 2427, 1244.0, 2390.0, 2427.0, 2427.0, 1.795654516071108, 0.9434200484826719, 4.099844002513916], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 10, 0, 0.0, 614.0, 268, 2957, 282.0, 2742.000000000001, 2957.0, 2957.0, 1.4536996656490768, 2.686931012865242, 1.3671023222852159], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 10, 0, 0.0, 300.09999999999997, 268, 360, 293.0, 356.90000000000003, 360.0, 360.0, 2.8546959748786755, 1.3102608478447044, 2.4560421424493293], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 10, 0, 0.0, 1524.3000000000002, 1067, 2530, 1362.5, 2497.3, 2530.0, 2530.0, 1.7137960582690661, 0.7966473864610112, 2.522158847472151], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 10, 0, 0.0, 1451.1000000000001, 673, 3259, 1278.5, 3142.0000000000005, 3259.0, 3259.0, 2.4844720496894412, 136.86432453416148, 2.324340062111801], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 10, 0, 0.0, 293.2, 267, 346, 290.0, 342.20000000000005, 346.0, 346.0, 1.2110936175366356, 0.5546903385006661, 1.1342175578297202], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 10, 0, 0.0, 500.5, 419, 731, 470.0, 717.0, 731.0, 731.0, 1.9267822736030829, 43.20545821290944, 1.6012614402697494], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 10, 0, 0.0, 1030.2, 967, 1089, 1031.5, 1088.8, 1089.0, 1089.0, 1.027326895418122, 26.350332918122046, 0.8296868579206904], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 10, 0, 0.0, 1679.1000000000001, 918, 2445, 1650.0, 2441.9, 2445.0, 2445.0, 1.7972681524083394, 0.835448867721064, 2.3606695947160317], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 10, 0, 0.0, 519.6, 418, 734, 481.0, 727.1, 734.0, 734.0, 2.536783358701167, 75.67541856925418, 2.118115011415525], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 10, 0, 0.0, 918.5, 708, 1123, 917.0, 1116.0, 1123.0, 1123.0, 1.4771048744460857, 129.88151426329395, 1.2088026218611523], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 10, 0, 0.0, 889.4, 593, 1310, 843.0, 1292.9, 1310.0, 1310.0, 2.403268445085316, 132.39098924537373, 2.0535741107906755], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 10, 0, 0.0, 1622.6, 1188, 2021, 1664.5, 2020.0, 2021.0, 2021.0, 1.8450184501845017, 1.1405241005535056, 8.135017873616237], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 10, 0, 0.0, 420.8, 333, 560, 390.0, 553.5, 560.0, 560.0, 3.4059945504087192, 2.0522447632833787, 7.6235737397820165], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 10, 0, 0.0, 451.3, 360, 607, 451.5, 593.0, 607.0, 607.0, 1.9677292404565132, 39.81615567197954, 1.64105544077135], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 10, 0, 0.0, 305.5, 271, 325, 311.5, 324.8, 325.0, 325.0, 25.974025974025977, 47.90482954545455, 24.42674512987013], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 10, 0, 0.0, 297.9, 269, 323, 296.5, 322.6, 323.0, 323.0, 1.1068068622025455, 2.046403742390703, 1.0408740315439955], "isController": false}, {"data": ["\/GnC.POS\/-571", 10, 0, 0.0, 2284.5, 1916, 2610, 2289.0, 2606.3, 2610.0, 2610.0, 3.7608123354644603, 13.665998730725837, 0.5325369029710418], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 10, 0, 0.0, 3256.9, 2596, 4166, 3050.5, 4165.2, 4166.0, 4166.0, 0.8263779852904718, 0.37848757334104616, 1.6729312143624493], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 10, 0, 0.0, 2837.2999999999997, 1284, 4147, 2799.0, 4143.3, 4147.0, 4147.0, 2.403846153846154, 1.4859713040865383, 10.598989633413462], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 10, 0, 0.0, 340.1, 305, 375, 340.5, 374.2, 375.0, 375.0, 1.20598166907863, 0.5523490261698022, 2.4637828630004823], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 10, 0, 0.0, 1210.3, 670, 2404, 1053.0, 2329.4000000000005, 2404.0, 2404.0, 3.635041802980734, 200.2467852599055, 2.9889699200290805], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 10, 0, 0.0, 284.3, 264, 324, 276.5, 323.2, 324.0, 324.0, 1.0237510237510237, 0.4688859669328419, 0.9587668279074528], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 10, 0, 0.0, 433.9, 284, 952, 313.0, 924.4000000000001, 952.0, 952.0, 3.4746351633078527, 10.020114880125087, 2.633121959694232], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 10, 0, 0.0, 3058.2, 2574, 4766, 2797.5, 4645.8, 4766.0, 4766.0, 0.9378223764419019, 35.48989130052518, 2.9343582950389195], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 10, 0, 0.0, 325.50000000000006, 296, 368, 320.5, 367.2, 368.0, 368.0, 1.0206164523372117, 0.4674503087364768, 2.0850875178607877], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 10, 0, 0.0, 3941.3, 1440, 10973, 2501.0, 10703.0, 10973.0, 10973.0, 0.11547877500115479, 47.66024439278373, 0.09314987124116587], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 10, 0, 0.0, 516.0, 439, 589, 514.5, 587.1, 589.0, 589.0, 1.1824524062906467, 27.971119523767292, 0.9884563083835874], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 10, 0, 0.0, 549.5999999999999, 265, 881, 539.5, 870.4000000000001, 881.0, 881.0, 3.562522265764161, 1.6351420555753473, 3.0650215977912363], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 8, 100.0, 1.8604651162790697], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 430, 8, "500\/Internal Server Error", 8, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 10, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 10, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
