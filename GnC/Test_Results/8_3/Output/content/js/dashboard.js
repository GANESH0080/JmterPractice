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

    var data = {"OkPercent": 97.96511627906976, "KoPercent": 2.0348837209302326};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43191964285714285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11538461538461539, 500, 1500, ""], "isController": true}, {"data": [0.875, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.375, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.4375, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [0.4375, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.375, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.6875, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.625, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [0.9375, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [0.8125, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.625, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [0.9375, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [0.5625, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [0.9375, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.375, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.25, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [0.875, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [0.625, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.1875, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.75, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 344, 7, 2.0348837209302326, 4814.008720930234, 250, 141447, 801.5, 7104.5, 12741.25, 130960.00000000007, 1.3190133473414596, 79.25510090188497, 1.9500919762577598], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 104, 7, 6.730769230769231, 14886.769230769234, 521, 142799, 3066.0, 23896.5, 125676.75, 142524.1, 0.4116985733060979, 53.39414964327704, 1.78500650206641], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 8, 0, 0.0, 438.5, 364, 601, 410.0, 601.0, 601.0, 601.0, 1.1448196908986834, 22.916517601602745, 0.9614696622781911], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 8, 0, 0.0, 933.7499999999999, 844, 1143, 887.0, 1143.0, 1143.0, 1143.0, 1.0676631522754572, 49.55666955825437, 3.388579340718003], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 8, 0, 0.0, 1355.25, 510, 5541, 595.5, 5541.0, 5541.0, 5541.0, 0.6006006006006006, 0.414672484984985, 0.5824183558558559], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 8, 0, 0.0, 837.875, 689, 1567, 744.0, 1567.0, 1567.0, 1567.0, 0.9356725146198831, 0.6533260233918128, 1.116593567251462], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 8, 0, 0.0, 1551.875, 936, 5583, 992.0, 5583.0, 5583.0, 5583.0, 0.5819874872690237, 21.215404708642513, 0.5620953368252583], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 8, 0, 0.0, 1623.0, 970, 3472, 1150.0, 3472.0, 3472.0, 3472.0, 0.8382229673093042, 23.061773103520537, 0.6933348176865046], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 8, 0, 0.0, 5071.5, 2340, 8692, 4247.0, 8692.0, 8692.0, 8692.0, 0.5391562205148942, 1.170979916430786, 1.096214112414072], "isController": false}, {"data": ["\/GnC.POS\/-581", 8, 0, 0.0, 8798.875, 6163, 12811, 8296.0, 12811.0, 12811.0, 12811.0, 0.6244633518070408, 507.98081238779173, 0.5659199125751307], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 8, 0, 0.0, 944.375, 294, 1961, 730.5, 1961.0, 1961.0, 1961.0, 2.1384656508954825, 3.9529767274792835, 2.0110765838011226], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 8, 6, 75.0, 122349.125, 104400, 141447, 121780.5, 141447.0, 141447.0, 141447.0, 0.054212295348585064, 0.16508543942453646, 0.052571102813618126], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 8, 0, 0.0, 5158.125, 2047, 7142, 5593.0, 7142.0, 7142.0, 7142.0, 0.9532888465204957, 0.5892889061010487, 4.1734315419447094], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 8, 1, 12.5, 19753.5, 15453, 23494, 19562.5, 23494.0, 23494.0, 23494.0, 0.3351346822504294, 0.34487126115370115, 1.4779963135184953], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 8, 0, 0.0, 8207.375, 5476, 12057, 7777.0, 12057.0, 12057.0, 12057.0, 0.6574081682964911, 534.3052787821514, 0.22341605719451063], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 8, 0, 0.0, 588.8749999999999, 403, 753, 632.0, 753.0, 753.0, 753.0, 6.384676775738229, 4.61392657621708, 3.616320830007981], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 8, 0, 0.0, 912.125, 867, 993, 903.5, 993.0, 993.0, 993.0, 1.0450685826257349, 0.5490692357935989, 2.3861038536903982], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 8, 0, 0.0, 533.625, 278, 2165, 300.5, 2165.0, 2165.0, 2165.0, 2.700877785280216, 4.993920387407157, 2.5399856515867656], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 8, 0, 0.0, 282.5, 263, 342, 273.5, 342.0, 342.0, 342.0, 1.132342533616419, 0.5197275300778486, 0.9742126680820948], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 8, 0, 0.0, 838.5, 764, 949, 829.0, 949.0, 949.0, 949.0, 1.0703773080010703, 0.49755820176612253, 1.5752525421461065], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 8, 0, 0.0, 568.3750000000001, 464, 787, 534.0, 787.0, 787.0, 787.0, 1.1232799775344005, 51.461360923897786, 1.0508810727323785], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 8, 0, 0.0, 331.5, 250, 570, 282.0, 570.0, 570.0, 570.0, 0.618190248048837, 0.2831359632176802, 0.5789496561316745], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 8, 0, 0.0, 534.2500000000001, 417, 800, 494.0, 800.0, 800.0, 800.0, 1.115137998327293, 25.002804180025088, 0.926740660719264], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 8, 0, 0.0, 1107.625, 938, 1384, 1020.5, 1384.0, 1384.0, 1384.0, 0.8714596949891067, 22.352430555555557, 0.7038058278867103], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 8, 0, 0.0, 873.7499999999999, 791, 1033, 837.5, 1033.0, 1033.0, 1033.0, 1.101624896722666, 0.5120834480859268, 1.4469584825117048], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 8, 0, 0.0, 463.75, 397, 549, 455.5, 549.0, 549.0, 549.0, 1.1815093782306896, 35.244805512479694, 0.9865141781125388], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 8, 0, 0.0, 901.25, 521, 1383, 933.5, 1383.0, 1383.0, 1383.0, 1.0244589576130105, 90.08323228806505, 0.8383755922653349], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 8, 0, 0.0, 555.875, 481, 710, 550.0, 710.0, 710.0, 710.0, 1.0905125408942202, 49.96017073336968, 0.9318344465648855], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 8, 0, 0.0, 2804.875, 1534, 3747, 2950.5, 3747.0, 3747.0, 3747.0, 1.7758046614872365, 1.0977386237513873, 7.829841842397337], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 8, 0, 0.0, 364.875, 338, 410, 358.5, 410.0, 410.0, 410.0, 1.193139448173005, 0.7189131245339299, 2.6705816554809845], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 8, 0, 0.0, 474.24999999999994, 370, 844, 429.5, 844.0, 844.0, 844.0, 1.1595883461371215, 23.4636869926801, 0.9670785621104507], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 8, 0, 0.0, 1101.0, 269, 1994, 1283.0, 1994.0, 1994.0, 1994.0, 2.4676125848241828, 4.569541371067243, 2.3206161320172733], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 8, 0, 0.0, 383.62499999999994, 257, 1205, 263.5, 1205.0, 1205.0, 1205.0, 0.9456264775413711, 1.748000701832151, 0.8892952127659574], "isController": false}, {"data": ["\/GnC.POS\/-571", 8, 0, 0.0, 1851.375, 1219, 2805, 1645.0, 2805.0, 2805.0, 2805.0, 2.1786492374727673, 7.916751770152505, 0.3085001361655773], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 8, 0, 0.0, 1435.875, 1193, 1692, 1388.0, 1692.0, 1692.0, 1692.0, 0.577408877661494, 0.264457776975821, 1.1689146517502707], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 8, 0, 0.0, 1561.0, 1323, 1878, 1531.0, 1878.0, 1878.0, 1878.0, 1.8450184501845017, 1.1405241005535054, 8.135017873616235], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 8, 0, 0.0, 309.75, 292, 342, 300.5, 342.0, 342.0, 342.0, 0.6165228113440198, 0.28237226418002465, 1.2595368372379778], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 8, 0, 0.0, 701.6249999999999, 513, 1108, 610.5, 1108.0, 1108.0, 1108.0, 1.1396011396011396, 52.209090099715105, 0.9370548433048433], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 8, 0, 0.0, 344.24999999999994, 262, 508, 305.0, 508.0, 508.0, 508.0, 0.6268609935746748, 0.28710723240871333, 0.5870700125372198], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 8, 0, 0.0, 294.0, 282, 302, 294.0, 302.0, 302.0, 302.0, 1.2039127163280663, 3.4718303235515426, 0.9123401053423628], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 8, 0, 0.0, 3746.875, 2137, 8165, 2330.0, 8165.0, 8165.0, 8165.0, 0.5319856363878176, 20.13142227191116, 1.6645331826040697], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 8, 0, 0.0, 1701.1250000000002, 294, 5230, 316.0, 5230.0, 5230.0, 5230.0, 0.6253908692933083, 0.28643390400250157, 1.2776540025015635], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 8, 0, 0.0, 3591.1250000000005, 1352, 12040, 2081.5, 12040.0, 12040.0, 12040.0, 0.18087680028940287, 74.65091572412896, 0.14590257523344413], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 8, 0, 0.0, 532.5000000000001, 458, 622, 522.5, 622.0, 622.0, 622.0, 0.6010066861993839, 14.215803658628202, 0.5024040267447976], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 8, 0, 0.0, 289.125, 260, 346, 277.0, 346.0, 346.0, 346.0, 1.1959934220361788, 0.5489422933173868, 1.0289748093885485], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 7, 100.0, 2.0348837209302326], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 344, 7, "500\/Internal Server Error", 7, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 8, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
