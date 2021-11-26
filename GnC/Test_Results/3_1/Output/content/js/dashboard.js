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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5148809523809523, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11538461538461539, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 129, 0, 0.0, 3194.8217054263573, 261, 87566, 494.0, 6194.0, 8013.0, 84051.49999999987, 0.696266070792448, 33.65300767376966, 1.0286338156595096], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 39, 0, 0.0, 9986.666666666668, 576, 90098, 2772.0, 11275.0, 77270.0, 90098.0, 0.22029666617711852, 20.579143033612187, 0.9547457603482947], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 3, 0, 0.0, 399.0, 371, 428, 398.0, 428.0, 428.0, 428.0, 0.8693132425383947, 17.40154574760939, 0.7300872935381049], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 3, 0, 0.0, 913.3333333333334, 776, 1169, 795.0, 1169.0, 1169.0, 1169.0, 2.557544757033248, 65.39971627237851, 8.117207480818413], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 3, 0, 0.0, 445.0, 428, 459, 448.0, 459.0, 459.0, 459.0, 0.7987220447284344, 0.5109013079073482, 0.7745419828274761], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 3, 0, 0.0, 784.0, 679, 934, 739.0, 934.0, 934.0, 934.0, 0.7433102081268582, 0.5190105457135779, 0.8870362054013876], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 3, 0, 0.0, 423.3333333333333, 410, 433, 427.0, 433.0, 433.0, 433.0, 0.8071025020177562, 19.017615432472425, 0.7605995258272801], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 3, 0, 0.0, 1071.0, 966, 1242, 1005.0, 1242.0, 1242.0, 1242.0, 0.9487666034155597, 26.117024430740038, 0.7847708135673624], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 3, 0, 0.0, 6009.666666666667, 3898, 7251, 6880.0, 7251.0, 7251.0, 7251.0, 0.41373603640877116, 0.9143404788994621, 0.8412094021514274], "isController": false}, {"data": ["\/GnC.POS\/-581", 3, 0, 0.0, 4988.333333333333, 3672, 6730, 4563.0, 6730.0, 6730.0, 6730.0, 0.44576523031203563, 362.615649377786, 0.40397473997028227], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 3, 0, 0.0, 1289.0, 321, 1893, 1653.0, 1893.0, 1893.0, 1893.0, 1.3268465280849182, 2.455443526094648, 1.2478058657673594], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 3, 0, 0.0, 79282.33333333333, 74430, 87566, 75851.0, 87566.0, 87566.0, 87566.0, 0.03378796923042269, 0.018378807481782652, 0.03276509125567356], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 3, 0, 0.0, 6846.0, 6570, 6985, 6983.0, 6985.0, 6985.0, 6985.0, 0.4294917680744452, 0.26549637616320687, 1.8802847619899785], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 3, 0, 0.0, 9037.666666666666, 8775, 9246, 9092.0, 9246.0, 9246.0, 9246.0, 0.2788104089219331, 0.16118726765799257, 1.229597467472119], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 3, 0, 0.0, 4436.333333333333, 3143, 6194, 3972.0, 6194.0, 6194.0, 6194.0, 0.4839490240361349, 393.3272062530247, 0.16446705113728022], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 3, 0, 0.0, 549.6666666666666, 524, 590, 535.0, 590.0, 590.0, 590.0, 5.084745762711864, 3.674523305084746, 2.8800317796610173], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 3, 0, 0.0, 587.0, 559, 638, 564.0, 638.0, 638.0, 638.0, 3.131524008350731, 1.6452733559498958, 7.1499054018789145], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 3, 0, 0.0, 292.6666666666667, 263, 333, 282.0, 333.0, 333.0, 333.0, 1.6629711751662972, 3.0763884077050996, 1.5639074625831486], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 3, 0, 0.0, 352.6666666666667, 287, 390, 381.0, 390.0, 390.0, 390.0, 4.261363636363636, 1.955899325284091, 3.6662708629261367], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 3, 0, 0.0, 496.3333333333333, 485, 510, 494.0, 510.0, 510.0, 510.0, 3.4364261168384878, 1.5974012027491409, 5.057318513745704], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 3, 0, 0.0, 522.3333333333334, 398, 770, 399.0, 770.0, 770.0, 770.0, 3.7688442211055273, 94.10332914572864, 3.525930433417085], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 3, 0, 0.0, 290.3333333333333, 261, 312, 298.0, 312.0, 312.0, 312.0, 0.8312551953449709, 0.3807213736492103, 0.7784899729842062], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 3, 0, 0.0, 411.6666666666667, 396, 429, 410.0, 429.0, 429.0, 429.0, 3.802281368821293, 85.25675301013942, 3.1599037547528517], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 3, 0, 0.0, 1235.0, 1185, 1317, 1203.0, 1317.0, 1317.0, 1317.0, 0.9267840593141798, 23.839347775718256, 0.748486735403151], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 3, 0, 0.0, 486.6666666666667, 480, 494, 486.0, 494.0, 494.0, 494.0, 3.40522133938706, 1.5828958569807037, 4.472678419409761], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 3, 0, 0.0, 436.3333333333333, 434, 440, 435.0, 440.0, 440.0, 440.0, 3.6452004860267313, 108.73424210206562, 3.0436000151883356], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 3, 0, 0.0, 857.6666666666666, 576, 1065, 932.0, 1065.0, 1065.0, 1065.0, 0.7356547327121138, 64.68517234244727, 0.6020299472780775], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 3, 0, 0.0, 408.3333333333333, 394, 423, 408.0, 423.0, 423.0, 423.0, 3.6452004860267313, 91.01609963547996, 3.1147953371810453], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 3, 0, 0.0, 2021.6666666666667, 1974, 2089, 2002.0, 2089.0, 2089.0, 2089.0, 0.851305334846765, 0.526246364216799, 3.7535581902667423], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 3, 0, 0.0, 390.3333333333333, 376, 399, 396.0, 399.0, 399.0, 399.0, 7.444168734491315, 4.4854024503722085, 16.66214330024814], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 3, 0, 0.0, 385.3333333333333, 379, 391, 386.0, 391.0, 391.0, 391.0, 3.870967741935484, 78.32787298387096, 3.2283266129032255], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 3, 0, 0.0, 288.6666666666667, 280, 304, 282.0, 304.0, 304.0, 304.0, 9.868421052631579, 18.28163548519737, 9.280556126644736], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 3, 0, 0.0, 294.3333333333333, 271, 339, 273.0, 339.0, 339.0, 339.0, 1.2908777969018934, 2.390561128442341, 1.213979803141136], "isController": false}, {"data": ["\/GnC.POS\/-571", 3, 0, 0.0, 2330.6666666666665, 2040, 2583, 2369.0, 2583.0, 2583.0, 2583.0, 1.1614401858304297, 4.2204286440185825, 0.1644617450638792], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 3, 0, 0.0, 654.6666666666666, 564, 721, 679.0, 721.0, 721.0, 721.0, 0.757002271006813, 0.3467129542013626, 1.5324860427706284], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 3, 0, 0.0, 2088.3333333333335, 1723, 2312, 2230.0, 2312.0, 2312.0, 2312.0, 1.2836970474967906, 0.7935353818998716, 5.660050946726572], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 3, 0, 0.0, 353.3333333333333, 318, 397, 345.0, 397.0, 397.0, 397.0, 0.8266740148801323, 0.37862315720584183, 1.6888691788371453], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 3, 0, 0.0, 495.6666666666667, 493, 500, 494.0, 500.0, 500.0, 500.0, 5.7034220532319395, 142.40731939163499, 4.689727899239544], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 3, 0, 0.0, 331.6666666666667, 278, 399, 318.0, 399.0, 399.0, 399.0, 0.8241758241758241, 0.37747896634615385, 0.7718599759615384], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 3, 0, 0.0, 425.3333333333333, 424, 427, 425.0, 427.0, 427.0, 427.0, 7.02576112412178, 20.260813085480095, 5.3242096018735365], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 3, 0, 0.0, 1654.0, 1536, 1804, 1622.0, 1804.0, 1804.0, 1804.0, 0.6114961271911944, 15.22669148746433, 1.8989821137382799], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 3, 0, 0.0, 334.3333333333333, 302, 391, 310.0, 391.0, 391.0, 391.0, 0.8187772925764192, 0.3750063966975982, 1.6727364219432315], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 3, 0, 0.0, 1740.0, 1269, 2532, 1419.0, 2532.0, 2532.0, 2532.0, 0.1939487975174554, 3.765144673681148, 0.15644697924747866], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 3, 0, 0.0, 457.0, 450, 462, 459.0, 462.0, 462.0, 462.0, 0.800854244527496, 18.94599030632675, 0.6694640950347037], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 3, 0, 0.0, 280.3333333333333, 279, 281, 281.0, 281.0, 281.0, 281.0, 10.676156583629894, 4.900189056939501, 9.185247998220639], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 129, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
