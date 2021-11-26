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

    var data = {"OkPercent": 99.2248062015504, "KoPercent": 0.7751937984496124};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44345238095238093, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11538461538461539, 500, 1500, ""], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 258, 2, 0.7751937984496124, 4156.302325581394, 252, 131414, 684.0, 3941.999999999999, 8470.449999999984, 117422.63000000016, 1.0791502319336448, 53.917338379737494, 1.5954669546840559], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 78, 2, 2.5641025641025643, 13263.51282051282, 587, 135536, 3141.5, 14797.000000000011, 116955.34999999999, 135536.0, 0.3378539344823255, 32.76446731560972, 1.4648374050868675], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 6, 0, 0.0, 544.8333333333334, 465, 784, 505.5, 784.0, 784.0, 784.0, 3.5169988276670576, 70.40179879835874, 2.9537294841735053], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 6, 0, 0.0, 927.1666666666667, 783, 1005, 949.5, 1005.0, 1005.0, 1005.0, 3.9603960396039604, 144.0168626237624, 12.569616336633665], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 6, 0, 0.0, 593.0, 504, 662, 584.5, 662.0, 662.0, 662.0, 3.3994334277620397, 2.347069759206799, 3.2965208923512748], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 6, 0, 0.0, 810.8333333333334, 695, 892, 825.5, 892.0, 892.0, 892.0, 3.0075187969924815, 2.0999765037593985, 3.5890507518796992], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 6, 0, 0.0, 947.5, 801, 1136, 929.5, 1136.0, 1136.0, 1136.0, 2.61210274270788, 95.24226572703526, 2.5228218872442314], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 6, 0, 0.0, 1089.1666666666665, 948, 1505, 1018.0, 1505.0, 1505.0, 1505.0, 0.9498179515592844, 26.132051903593478, 0.7856404345417128], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 6, 0, 0.0, 7725.333333333334, 7219, 8423, 7623.5, 8423.0, 8423.0, 8423.0, 0.7076306168180211, 1.5361942003774032, 1.438756781460078], "isController": false}, {"data": ["\/GnC.POS\/-581", 6, 0, 0.0, 3020.333333333333, 2454, 3366, 3072.5, 3366.0, 3366.0, 3366.0, 1.7246335153779822, 1402.9337857502155, 1.5629491233112962], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 6, 0, 0.0, 462.1666666666667, 297, 575, 512.5, 575.0, 575.0, 575.0, 7.058823529411765, 13.061810661764707, 6.638327205882353], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 6, 1, 16.666666666666668, 115384.0, 102938, 131414, 114260.5, 131414.0, 131414.0, 131414.0, 0.044010856011149416, 0.04840191309689723, 0.042678496112374384], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 6, 0, 0.0, 6956.5, 6545, 7395, 6939.5, 7395.0, 7395.0, 7395.0, 0.8007473642065929, 0.49499324369411446, 3.5056156579474176], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 6, 1, 16.666666666666668, 11739.5, 9372, 14447, 11469.0, 14447.0, 14447.0, 14447.0, 0.39121079741800874, 0.4477529829823303, 1.7253007433005152], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 6, 0, 0.0, 2361.0, 2026, 2666, 2370.5, 2666.0, 2666.0, 2666.0, 1.9665683382497543, 1598.3188145280235, 0.6683259587020649], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 6, 0, 0.0, 656.5, 422, 726, 697.0, 726.0, 726.0, 726.0, 7.299270072992701, 5.274863138686132, 4.134352189781022], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 6, 0, 0.0, 702.3333333333334, 669, 753, 693.0, 753.0, 753.0, 753.0, 4.076086956521739, 2.141537873641304, 9.306534476902174], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 6, 0, 0.0, 585.8333333333334, 263, 881, 624.5, 881.0, 881.0, 881.0, 3.6607687614399023, 6.766821423123856, 3.4426956223306893], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 6, 0, 0.0, 268.0, 252, 308, 257.5, 308.0, 308.0, 308.0, 5.623242736644799, 2.5809805529522025, 4.837965674789128], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 6, 0, 0.0, 716.0, 675, 754, 711.0, 754.0, 754.0, 754.0, 4.132231404958678, 1.9208419421487604, 6.0813210227272725], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 6, 0, 0.0, 545.8333333333334, 449, 669, 543.0, 669.0, 669.0, 669.0, 5.58659217877095, 199.7861382681564, 5.226518854748603], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 6, 0, 0.0, 271.8333333333333, 264, 281, 272.5, 281.0, 281.0, 281.0, 4.059539918809201, 1.85930099797023, 3.8018542794316645], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 6, 0, 0.0, 506.8333333333333, 455, 637, 484.5, 637.0, 637.0, 637.0, 4.590665646518746, 102.92610104246366, 3.8150942042846214], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 6, 0, 0.0, 1327.6666666666667, 1154, 1718, 1267.5, 1718.0, 1718.0, 1718.0, 0.9236453201970443, 23.690961264624384, 0.7459518357450738], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 6, 0, 0.0, 681.1666666666667, 636, 736, 675.0, 736.0, 736.0, 736.0, 4.123711340206186, 1.916881443298969, 5.416398195876289], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 6, 0, 0.0, 482.3333333333333, 449, 563, 470.0, 563.0, 563.0, 563.0, 4.335260115606936, 129.32114794075144, 3.6197728504335265], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 6, 0, 0.0, 677.6666666666666, 587, 756, 683.0, 756.0, 756.0, 756.0, 3.237992444684296, 284.71197466945495, 2.6498414732865623], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 6, 0, 0.0, 531.5, 425, 750, 503.0, 750.0, 750.0, 750.0, 4.803843074459567, 171.79368494795835, 4.104846377101681], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 6, 0, 0.0, 2807.166666666667, 2301, 3362, 2652.5, 3362.0, 3362.0, 3362.0, 1.6194331983805668, 1.0010754048582995, 7.140371963562753], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 6, 0, 0.0, 380.6666666666667, 333, 440, 373.5, 440.0, 440.0, 440.0, 6.269592476489028, 3.7776743730407527, 14.033111285266457], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 6, 0, 0.0, 428.16666666666663, 392, 513, 412.0, 513.0, 513.0, 513.0, 5.080440304826418, 102.7962267146486, 4.23700783234547], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 6, 0, 0.0, 296.5, 288, 312, 295.5, 312.0, 312.0, 312.0, 12.195121951219512, 22.5780456046748, 11.468654725609756], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 6, 0, 0.0, 293.3333333333333, 258, 402, 266.5, 402.0, 402.0, 402.0, 1.1037527593818985, 2.040972509657837, 1.0380018625827814], "isController": false}, {"data": ["\/GnC.POS\/-571", 6, 0, 0.0, 2057.6666666666665, 1164, 2818, 2081.5, 2818.0, 2818.0, 2818.0, 2.1269053527118045, 7.728725407656859, 0.30117312123360507], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 6, 0, 0.0, 962.0, 932, 984, 963.0, 984.0, 984.0, 984.0, 2.7816411682892905, 1.2740133866481225, 5.631193497913769], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 6, 0, 0.0, 2621.166666666667, 2242, 2973, 2635.5, 2973.0, 2973.0, 2973.0, 2.0046775810223854, 1.2392196374874709, 8.838983670230538], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 6, 0, 0.0, 329.66666666666663, 295, 373, 327.0, 373.0, 373.0, 373.0, 3.9447731755424065, 1.806736932938856, 8.059048323471401], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 6, 0, 0.0, 981.1666666666667, 672, 1404, 857.0, 1404.0, 1404.0, 1404.0, 4.219409282700422, 150.89332805907173, 3.4694752109704643], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 6, 0, 0.0, 271.83333333333337, 257, 293, 267.5, 293.0, 293.0, 293.0, 4.045853000674309, 1.853032282535401, 3.7890361598111935], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 6, 0, 0.0, 287.0, 278, 302, 284.0, 302.0, 302.0, 302.0, 6.586169045005488, 18.9931222557629, 4.991081229418222], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 6, 0, 0.0, 2353.3333333333335, 2212, 2523, 2354.5, 2523.0, 2523.0, 2523.0, 1.6625103906899419, 62.926992414796345, 5.2018391521197005], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 6, 0, 0.0, 317.6666666666667, 303, 363, 309.5, 363.0, 363.0, 363.0, 3.947368421052632, 1.8079255756578947, 8.064350328947368], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 6, 0, 0.0, 3030.5, 1424, 4122, 3173.5, 4122.0, 4122.0, 4122.0, 0.15991897438631095, 3.1047290206295477, 0.12899714144833285], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 6, 0, 0.0, 521.6666666666667, 449, 603, 510.5, 603.0, 603.0, 603.0, 3.629764065335753, 85.8571536600121, 3.034255898366606], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 6, 0, 0.0, 266.6666666666667, 262, 275, 264.0, 275.0, 275.0, 275.0, 6.8181818181818175, 3.1294389204545454, 5.866033380681818], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 2, 100.0, 0.7751937984496124], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 258, 2, "500\/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 6, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 6, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
