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

    var data = {"OkPercent": 99.4186046511628, "KoPercent": 0.5813953488372093};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5044642857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11538461538461539, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.625, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.125, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 172, 1, 0.5813953488372093, 3428.8313953488378, 254, 92403, 511.5, 6614.000000000006, 8179.349999999987, 91533.57, 0.9016139938878958, 47.89963581609171, 1.3320060845839732], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 52, 1, 1.9230769230769231, 10702.346153846154, 573, 93942, 2584.5, 12481.300000000001, 91737.4, 93942.0, 0.2847754654983571, 31.069715652382257, 1.2341910254654984], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 4, 0, 0.0, 393.25, 355, 488, 365.0, 488.0, 488.0, 488.0, 1.170617500731636, 23.43292727538777, 0.9831357916300849], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 4, 0, 0.0, 846.0, 778, 908, 849.0, 908.0, 908.0, 908.0, 4.3383947939262475, 120.34808839479392, 13.769319414316703], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 4, 0, 0.0, 474.5, 452, 503, 471.5, 503.0, 503.0, 503.0, 1.0790396547073104, 0.6902060291340707, 1.046373415160507], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 4, 0, 0.0, 766.75, 665, 894, 754.0, 894.0, 894.0, 894.0, 0.984251968503937, 0.68724624753937, 1.174566313976378], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 4, 0, 0.0, 440.0, 396, 476, 444.0, 476.0, 476.0, 476.0, 1.0787486515641855, 25.41854183522114, 1.0165941882416396], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 4, 0, 0.0, 1018.75, 967, 1156, 976.0, 1156.0, 1156.0, 1156.0, 1.4290818149339048, 39.31789255091104, 1.1820627902822436], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 4, 0, 0.0, 5717.75, 3925, 7265, 5840.5, 7265.0, 7265.0, 7265.0, 0.5484711367064308, 1.1906751336898396, 1.1151532291238173], "isController": false}, {"data": ["\/GnC.POS\/-581", 4, 0, 0.0, 5784.75, 4367, 7319, 5726.5, 7319.0, 7319.0, 7319.0, 0.5465227490094275, 444.5786437696407, 0.4952862412897937], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 4, 0, 0.0, 499.0, 305, 1024, 333.5, 1024.0, 1024.0, 1024.0, 3.003003003003003, 5.558048282657658, 2.8241131756756754], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 4, 0, 0.0, 87244.25, 75599, 92403, 90487.5, 92403.0, 92403.0, 92403.0, 0.04256904166444953, 0.02315523067099452, 0.04128033044218592], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 4, 0, 0.0, 7233.75, 7056, 7353, 7263.0, 7353.0, 7353.0, 7353.0, 0.5404675043912984, 0.33409758816376167, 2.3661287326037024], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 4, 1, 25.0, 10432.75, 9714, 10898, 10559.5, 10898.0, 10898.0, 10898.0, 0.3413260517108968, 0.5051558900076799, 1.5053012202406348], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 4, 0, 0.0, 5209.75, 3788, 6731, 5160.0, 6731.0, 6731.0, 6731.0, 0.5842827928717499, 474.87298696319016, 0.19856485539000876], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 4, 0, 0.0, 573.0, 463, 664, 582.5, 664.0, 664.0, 664.0, 5.997001499250374, 4.333770614692654, 3.3967391304347823], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 4, 0, 0.0, 554.25, 553, 556, 554.0, 556.0, 556.0, 556.0, 5.3120849933598935, 2.7909196547144752, 12.128569057104913], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 4, 0, 0.0, 377.75, 301, 511, 349.5, 511.0, 511.0, 511.0, 3.0303030303030303, 5.61227509469697, 2.8497869318181817], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 4, 0, 0.0, 260.75, 254, 267, 261.0, 267.0, 267.0, 267.0, 8.81057268722467, 4.043915198237885, 7.580189977973568], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 4, 0, 0.0, 600.0, 522, 668, 605.0, 668.0, 668.0, 668.0, 5.3908355795148255, 2.5058962264150946, 7.933583221024259], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 4, 0, 0.0, 423.0, 402, 453, 418.5, 453.0, 453.0, 453.0, 7.326007326007326, 198.81095467032966, 6.853823260073259], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 4, 0, 0.0, 305.25, 256, 363, 301.0, 363.0, 363.0, 363.0, 1.1025358324145536, 0.5049700248070562, 1.0325506477398014], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 4, 0, 0.0, 422.0, 409, 431, 424.0, 431.0, 431.0, 431.0, 6.359300476947536, 142.59054550874404, 5.2849264705882355], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 4, 0, 0.0, 1296.75, 1230, 1352, 1302.5, 1352.0, 1352.0, 1352.0, 1.2590494176896443, 32.293879839471195, 1.0168299496380233], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 4, 0, 0.0, 534.75, 523, 543, 536.5, 543.0, 543.0, 543.0, 5.943536404160475, 2.762815750371471, 7.8066957652303115], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 4, 0, 0.0, 453.25, 403, 509, 450.5, 509.0, 509.0, 509.0, 6.163328197226503, 183.87212297765794, 5.146138289676425], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 4, 0, 0.0, 745.25, 573, 978, 715.0, 978.0, 978.0, 978.0, 0.9947774185525989, 87.47046754538673, 0.8140854265108183], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 4, 0, 0.0, 404.25, 371, 452, 397.0, 452.0, 452.0, 452.0, 6.700167504187605, 181.8271042713568, 5.725240787269682], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 4, 0, 0.0, 2389.0, 2131, 2501, 2462.0, 2501.0, 2501.0, 2501.0, 1.1494252873563218, 0.7105334051724138, 5.068022629310345], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 4, 0, 0.0, 422.25, 375, 457, 428.5, 457.0, 457.0, 457.0, 8.547008547008549, 5.149906517094017, 19.130608974358974], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 4, 0, 0.0, 410.25, 368, 499, 387.0, 499.0, 499.0, 499.0, 8.016032064128256, 162.1759143286573, 6.685245490981964], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 4, 0, 0.0, 274.5, 271, 277, 275.0, 277.0, 277.0, 277.0, 12.5, 23.0560302734375, 11.75537109375], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 4, 0, 0.0, 319.75, 304, 337, 319.0, 337.0, 337.0, 337.0, 1.7738359201773837, 3.2848011363636367, 1.6681679600886918], "isController": false}, {"data": ["\/GnC.POS\/-571", 4, 0, 0.0, 2331.5, 1998, 2603, 2362.5, 2603.0, 2603.0, 2603.0, 1.536688436419516, 5.584001632731463, 0.21759748367268533], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 4, 0, 0.0, 647.0, 623, 673, 646.0, 673.0, 673.0, 673.0, 1.000250062515629, 0.45812234308577143, 2.0249202925731433], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 4, 0, 0.0, 1579.5, 1255, 2237, 1413.0, 2237.0, 2237.0, 2237.0, 1.7520805957074026, 1.0830732588699081, 7.725238173455979], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 4, 0, 0.0, 309.5, 306, 315, 308.5, 315.0, 315.0, 315.0, 1.0911074740861975, 0.49973574740861976, 2.2290984724495364], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 4, 0, 0.0, 444.0, 427, 462, 443.5, 462.0, 462.0, 462.0, 8.264462809917356, 224.2784736570248, 6.795583677685951], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 4, 0, 0.0, 277.75, 260, 303, 274.0, 303.0, 303.0, 303.0, 1.1037527593818985, 0.5055273868653422, 1.0336903283664458], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 4, 0, 0.0, 340.0, 333, 347, 340.0, 347.0, 347.0, 347.0, 11.3314447592068, 32.677496458923514, 8.587110481586402], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 4, 0, 0.0, 1683.0, 1554, 1818, 1680.0, 1818.0, 1818.0, 1818.0, 0.7930214115781126, 19.746930139770026, 2.462703211736717], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 4, 0, 0.0, 303.75, 300, 306, 304.5, 306.0, 306.0, 306.0, 1.0905125408942202, 0.4994632633587786, 2.227883042529989], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 4, 0, 0.0, 1941.0, 1308, 3364, 1546.0, 3364.0, 3364.0, 3364.0, 0.20998477610373248, 45.37075847157331, 0.16938225103679982], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 4, 0, 0.0, 491.25, 468, 515, 491.0, 515.0, 515.0, 515.0, 1.0584810796507012, 25.03917620402223, 0.884824027520508], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 4, 0, 0.0, 264.25, 256, 279, 261.0, 279.0, 279.0, 279.0, 14.184397163120567, 6.510416666666667, 12.203568262411348], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 1, 100.0, 0.5813953488372093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 172, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 4, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
