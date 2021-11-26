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

    var data = {"OkPercent": 98.83720930232558, "KoPercent": 1.1627906976744187};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5044642857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09615384615384616, 500, 1500, ""], "isController": true}, {"data": [0.75, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 86, 1, 1.1627906976744187, 2909.3604651162786, 260, 62971, 496.5, 6702.799999999999, 12782.09999999997, 62971.0, 0.4996456002138018, 23.996174406816095, 0.7381551130883908], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 26, 1, 3.8461538461538463, 9146.115384615385, 551, 64696, 2750.0, 29117.300000000032, 62991.84999999999, 64696.0, 0.15862944162436546, 14.703145114670784, 0.6874856051408141], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 2, 0, 0.0, 462.5, 383, 542, 462.5, 542.0, 542.0, 542.0, 3.289473684210526, 65.8472964638158, 2.762643914473684], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 2, 0, 0.0, 725.0, 712, 738, 725.0, 738.0, 738.0, 738.0, 2.628120893561104, 57.39005009855453, 8.341204007884363], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 2, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 2.5031289111389237, 1.6011224968710889, 2.427350594493116], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 2, 0, 0.0, 1085.0, 1084, 1086, 1085.0, 1086.0, 1086.0, 1086.0, 1.8416206261510129, 1.2858972145488028, 2.197715239410681], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 2, 0, 0.0, 493.5, 487, 500, 493.5, 500.0, 500.0, 500.0, 4.0, 94.16015625, 3.76953125], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 2, 0, 0.0, 5702.5, 972, 10433, 5702.5, 10433.0, 10433.0, 10433.0, 0.19109497420217847, 5.2603370437607495, 0.15806390932543476], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 2, 0, 0.0, 7013.0, 7007, 7019, 7013.0, 7019.0, 7019.0, 7019.0, 0.2849408747684855, 0.6294299401624163, 0.5793426770195185], "isController": false}, {"data": ["\/GnC.POS\/-581", 2, 0, 0.0, 3108.0, 2997, 3219, 3108.0, 3219.0, 3219.0, 3219.0, 0.6205398696866273, 504.78918612317716, 0.5623642569035061], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 2, 0, 0.0, 261.0, 260, 262, 261.0, 262.0, 262.0, 262.0, 4.3763676148796495, 8.068927789934355, 4.115666028446389], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 2, 0, 0.0, 60648.5, 58326, 62971, 60648.5, 62971.0, 62971.0, 62971.0, 0.027592676903549797, 0.015008907261012927, 0.026757351723852487], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 2, 0, 0.0, 6746.0, 6638, 6854, 6746.0, 6854.0, 6854.0, 6854.0, 0.2917152858809801, 0.1803279062135356, 1.2771090103558926], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 2, 1, 50.0, 14264.0, 14047, 14481, 14264.0, 14481.0, 14481.0, 14481.0, 0.13811200883916858, 0.32896014605344936, 0.6090955389821145], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 2, 0, 0.0, 2585.0, 2472, 2698, 2585.0, 2698.0, 2698.0, 2698.0, 0.7412898443291327, 602.4797013991846, 0.2519227205337287], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 2, 0, 0.0, 517.5, 516, 519, 517.5, 519.0, 519.0, 519.0, 3.8461538461538463, 2.7794471153846154, 2.1784855769230766], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 2, 0, 0.0, 470.0, 468, 472, 470.0, 472.0, 472.0, 472.0, 3.3333333333333335, 1.7513020833333335, 7.610677083333334], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 2, 0, 0.0, 345.0, 327, 363, 345.0, 363.0, 363.0, 363.0, 3.8610038610038613, 7.120611124517374, 3.631002654440154], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 2, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 5.089058524173028, 2.3357983460559795, 4.378379452926208], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 2, 0, 0.0, 490.5, 490, 491, 490.5, 491.0, 491.0, 491.0, 3.048780487804878, 1.4172065548780488, 4.48682831554878], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 2, 0, 0.0, 386.5, 371, 402, 386.5, 402.0, 402.0, 402.0, 4.761904761904763, 101.11607142857143, 4.4549851190476195], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 2, 0, 0.0, 290.5, 270, 311, 290.5, 311.0, 311.0, 311.0, 6.430868167202572, 2.9453878617363345, 6.022658762057878], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 2, 0, 0.0, 467.0, 447, 487, 467.0, 487.0, 487.0, 487.0, 3.257328990228013, 73.02906148208469, 2.707018526058632], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 2, 0, 0.0, 1343.0, 1204, 1482, 1343.0, 1482.0, 1482.0, 1482.0, 1.3495276653171389, 34.71343623481781, 1.0899017375168691], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 2, 0, 0.0, 449.5, 442, 457, 449.5, 457.0, 457.0, 457.0, 2.849002849002849, 1.324341168091168, 3.742098468660969], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 2, 0, 0.0, 526.5, 516, 537, 526.5, 537.0, 537.0, 537.0, 2.628120893561104, 78.40603441195795, 2.194378285151117], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 2, 0, 0.0, 595.5, 551, 640, 595.5, 640.0, 640.0, 640.0, 3.125, 274.78179931640625, 2.557373046875], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 2, 0, 0.0, 472.5, 431, 514, 472.5, 514.0, 514.0, 514.0, 3.552397868561279, 75.43294849023091, 3.035496225577265], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 2, 0, 0.0, 2648.0, 2632, 2664, 2648.0, 2664.0, 2664.0, 2664.0, 0.708215297450425, 0.4377932453966006, 3.122648503895184], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 2, 0, 0.0, 337.5, 335, 340, 337.5, 340.0, 340.0, 340.0, 5.58659217877095, 3.3661400139664805, 12.504364525139666], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 2, 0, 0.0, 434.0, 386, 482, 434.0, 482.0, 482.0, 482.0, 3.0911901081916535, 62.54829984544049, 2.5780042503863987], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 2, 0, 0.0, 267.5, 267, 268, 267.5, 268.0, 268.0, 268.0, 7.407407407407407, 13.661024305555555, 6.966145833333333], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 2, 0, 0.0, 270.0, 269, 271, 270.0, 271.0, 271.0, 271.0, 3.929273084479371, 7.250353020628683, 3.6952050589390963], "isController": false}, {"data": ["\/GnC.POS\/-571", 2, 0, 0.0, 2145.5, 1954, 2337, 2145.5, 2337.0, 2337.0, 2337.0, 0.8557980316645272, 3.1097895271715874, 0.12118233846812151], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 2, 0, 0.0, 608.0, 601, 615, 608.0, 615.0, 615.0, 615.0, 3.252032520325203, 1.4894563008130082, 6.583460365853659], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 2, 0, 0.0, 1425.5, 1326, 1525, 1425.5, 1525.0, 1525.0, 1525.0, 1.3114754098360655, 0.8107069672131147, 5.782530737704918], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 2, 0, 0.0, 318.5, 313, 324, 318.5, 324.0, 324.0, 324.0, 6.116207951070336, 2.801271024464832, 12.495221712538227], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 2, 0, 0.0, 408.5, 384, 433, 408.5, 433.0, 433.0, 433.0, 4.273504273504274, 90.7451923076923, 3.5139556623931623], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 2, 0, 0.0, 371.0, 369, 373, 371.0, 373.0, 373.0, 373.0, 5.361930294906166, 2.4558059651474533, 5.021573391420912], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 2, 0, 0.0, 287.0, 285, 289, 287.0, 289.0, 289.0, 289.0, 6.41025641025641, 18.48582732371795, 4.857772435897436], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 2, 0, 0.0, 2378.0, 2371, 2385, 2378.0, 2385.0, 2385.0, 2385.0, 0.8385744234800838, 20.861995545073377, 2.604166666666667], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 2, 0, 0.0, 319.0, 315, 323, 319.0, 323.0, 323.0, 323.0, 6.116207951070336, 2.801271024464832, 12.495221712538227], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 2, 0, 0.0, 1613.0, 1501, 1725, 1613.0, 1725.0, 1725.0, 1725.0, 0.12592079581942958, 2.444326776270226, 0.10157282944028206], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 2, 0, 0.0, 467.0, 441, 493, 467.0, 493.0, 493.0, 493.0, 4.056795131845842, 95.9685598377282, 3.3912271805273835], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 2, 0, 0.0, 298.5, 279, 318, 298.5, 318.0, 318.0, 318.0, 5.797101449275362, 2.6607789855072466, 4.987545289855073], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 1, 100.0, 1.1627906976744187], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 86, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 2, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
