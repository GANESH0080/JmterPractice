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

    var data = {"OkPercent": 99.06976744186046, "KoPercent": 0.9302325581395349};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41785714285714287, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08461538461538462, 500, 1500, ""], "isController": true}, {"data": [0.6, 500, 1500, "\/GnC.POS\/ApplicationStatus-582"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/Home\/Search-619-0"], "isController": false}, {"data": [0.3, 500, 1500, "\/GnC.POS\/Home\/Search-619-2"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/ApplicationForm-783"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581"], "isController": false}, {"data": [0.9, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-581-1"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/-581-0"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694"], "isController": false}, {"data": [0.9, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Property\/SaveProperty-715"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648"], "isController": false}, {"data": [0.8, 500, 1500, "\/GnC.POS\/HO3\/Property\/Index-697"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Summary-770"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/Index-730"], "isController": false}, {"data": [0.4, 500, 1500, "\/GnC.POS\/Home-602"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-676"], "isController": false}, {"data": [0.1, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Occupancy\/Index-716"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/-571"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/SaveQuote-650"], "isController": false}, {"data": [0.1, 500, 1500, "\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754"], "isController": false}, {"data": [0.9, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649"], "isController": false}, {"data": [0.5, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder-659"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/RiskQualifiers\/Index-672"], "isController": false}, {"data": [0.0, 500, 1500, "\/GnC.POS\/Home\/Search-619"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653"], "isController": false}, {"data": [0.2, 500, 1500, "\/GnC.POS\/HO3\/Policy-803"], "isController": false}, {"data": [0.6, 500, 1500, "\/GnC.POS\/HO3\/Quote-621"], "isController": false}, {"data": [1.0, 500, 1500, "\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 215, 2, 0.9302325581395349, 4439.800000000001, 249, 117851, 892.0, 8363.200000000003, 13698.999999999995, 106504.16, 0.9275557396286326, 47.70773996055731, 1.3713424576236453], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["", 65, 2, 3.076923076923077, 13254.138461538463, 964, 120173, 3000.0, 15515.199999999999, 105791.69999999998, 120173.0, 0.29070937560098575, 29.25516851220532, 1.2604321688372966], "isController": true}, {"data": ["\/GnC.POS\/ApplicationStatus-582", 5, 0, 0.0, 691.6, 461, 951, 626.0, 951.0, 951.0, 951.0, 2.1834061135371177, 43.706502456331876, 1.8337199781659388], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675", 5, 0, 0.0, 1192.8, 1152, 1236, 1180.0, 1236.0, 1236.0, 1236.0, 2.339728591483388, 121.90123055100608, 7.425896408516612], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-1", 5, 0, 0.0, 769.6, 558, 1118, 755.0, 1118.0, 1118.0, 1118.0, 2.2624434389140275, 1.5620581165158371, 2.1939514988687785], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-0", 5, 0, 0.0, 917.0, 731, 1263, 795.0, 1263.0, 1263.0, 1263.0, 1.8796992481203008, 1.312485314849624, 2.2431567199248117], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619-2", 5, 0, 0.0, 1396.2, 1090, 1655, 1429.0, 1655.0, 1655.0, 1655.0, 1.6463615409944024, 60.02466969871584, 1.5900894180111953], "isController": false}, {"data": ["\/GnC.POS\/HO3\/ApplicationForm-783", 5, 0, 0.0, 1074.2, 964, 1326, 1036.0, 1326.0, 1326.0, 1326.0, 1.2056908608632746, 33.1718052959971, 0.9972853116710875], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/GetQuoteEstimation-655", 5, 0, 0.0, 7659.8, 6754, 8554, 7702.0, 8554.0, 8554.0, 8554.0, 0.5197505197505198, 1.1283255912162162, 1.056758380977131], "isController": false}, {"data": ["\/GnC.POS\/-581", 5, 0, 0.0, 14336.2, 13586, 15416, 14233.0, 15416.0, 15416.0, 15416.0, 0.32431731205811765, 263.8216817271518, 0.29391256405266913], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-756", 5, 0, 0.0, 525.8, 265, 942, 467.0, 942.0, 942.0, 942.0, 3.080714725816389, 5.693906923906346, 2.897195586876155], "isController": false}, {"data": ["\/GnC.POS\/ApplicationForm\/GeneratePolicyForms-798", 5, 0, 0.0, 104701.4, 91152, 117851, 105245.0, 117851.0, 117851.0, 117851.0, 0.04224828471964038, 0.022989008052523068, 0.04096928391269814], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-745", 5, 0, 0.0, 7242.4, 6747, 7729, 7240.0, 7729.0, 7729.0, 7729.0, 0.6469142191745374, 0.3998991218139475, 2.832144965390089], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 5, 2, 40.0, 9944.6, 9113, 11846, 9389.0, 11846.0, 11846.0, 11846.0, 0.3820585313670054, 0.7721761098800336, 1.6849378199740201], "isController": false}, {"data": ["\/GnC.POS\/-581-1", 5, 0, 0.0, 13661.2, 12939, 14728, 13570.0, 14728.0, 14728.0, 14728.0, 0.33852403520649965, 275.13375666469193, 0.11504527758970887], "isController": false}, {"data": ["\/GnC.POS\/-581-0", 5, 0, 0.0, 671.8, 641, 729, 661.0, 729.0, 729.0, 729.0, 6.830601092896175, 4.936176571038252, 3.8688951502732243], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/SavePolicyHolder-694", 5, 0, 0.0, 1011.0, 942, 1041, 1024.0, 1041.0, 1041.0, 1041.0, 2.8735632183908044, 1.5097431752873562, 6.560928520114943], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-763", 5, 0, 0.0, 373.2, 249, 625, 278.0, 625.0, 625.0, 625.0, 2.635740643120717, 4.87251663811281, 2.478728749341065], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-689", 5, 0, 0.0, 282.0, 259, 327, 273.0, 327.0, 327.0, 327.0, 4.63821892393321, 2.1288700139146566, 3.9904988984230054], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/SaveProperty-715", 5, 0, 0.0, 1006.6, 987, 1040, 999.0, 1040.0, 1040.0, 1040.0, 2.858776443682104, 1.328884362492853, 4.20720322327044], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-1", 5, 0, 0.0, 811.4, 765, 857, 818.0, 857.0, 857.0, 857.0, 2.857142857142857, 147.13727678571428, 2.6729910714285716], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-648", 5, 0, 0.0, 333.0, 272, 487, 313.0, 487.0, 487.0, 487.0, 2.321262766945218, 1.0631564821262767, 2.173916985840297], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Property\/Index-697", 5, 0, 0.0, 498.4, 466, 522, 496.0, 522.0, 522.0, 522.0, 4.038772213247173, 90.55605689620356, 3.3564405795638126], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Summary-770", 5, 0, 0.0, 1236.8, 937, 1423, 1222.0, 1423.0, 1423.0, 1423.0, 1.2431626056688214, 31.88639241981601, 1.0039994871954252], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/SaveOccupancy-729", 5, 0, 0.0, 978.0, 945, 1010, 982.0, 1010.0, 1010.0, 1010.0, 2.868617326448652, 1.3334588353413654, 3.767861625071715], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/Index-730", 5, 0, 0.0, 632.8, 570, 689, 648.0, 689.0, 689.0, 689.0, 3.668378576669112, 109.42730305392517, 3.0629528154805574], "isController": false}, {"data": ["\/GnC.POS\/Home-602", 5, 0, 0.0, 1412.6, 1082, 1975, 1394.0, 1975.0, 1975.0, 1975.0, 1.618646811265782, 142.32805671333765, 1.324634792813208], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-676", 5, 0, 0.0, 830.6, 702, 1032, 804.0, 1032.0, 1032.0, 1032.0, 2.9620853080568716, 152.54160804206163, 2.531078754443128], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-758", 5, 0, 0.0, 1553.2, 1306, 1709, 1607.0, 1709.0, 1709.0, 1709.0, 1.6903313049357673, 1.0449020664300201, 7.452974454868154], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Save-675-0", 5, 0, 0.0, 380.4, 361, 392, 385.0, 392.0, 392.0, 392.0, 3.8402457757296466, 2.3138980894777266, 8.595550115207374], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Occupancy\/Index-716", 5, 0, 0.0, 411.2, 376, 473, 401.0, 473.0, 473.0, 473.0, 4.504504504504505, 91.137915259009, 3.7566863738738734], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-747", 5, 0, 0.0, 300.6, 296, 304, 301.0, 304.0, 304.0, 304.0, 11.7096018735363, 21.598726580796253, 11.012057230679158], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/GetMortgagee-769", 5, 0, 0.0, 278.8, 255, 300, 278.0, 300.0, 300.0, 300.0, 1.483239394838327, 2.7413856237021657, 1.394882360575497], "isController": false}, {"data": ["\/GnC.POS\/-571", 5, 0, 0.0, 2449.2, 2087, 2752, 2476.0, 2752.0, 2752.0, 2752.0, 1.804402742692169, 6.556818950739805, 0.2555062477444966], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/SaveQuote-650", 5, 0, 0.0, 1616.0, 1557, 1656, 1627.0, 1656.0, 1656.0, 1656.0, 1.40964195094446, 0.6456270263603044, 2.8536989885819], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-754", 5, 0, 0.0, 1813.2, 1325, 2453, 1809.0, 2453.0, 2453.0, 2453.0, 2.02757502027575, 1.2533740115571774, 8.939942594282238], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-649", 5, 0, 0.0, 378.4, 320, 558, 334.0, 558.0, 558.0, 558.0, 2.2311468094600624, 1.0218826695671575, 4.558163208389112], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder-659", 5, 0, 0.0, 849.8, 740, 1122, 801.0, 1122.0, 1122.0, 1122.0, 2.7487630566245187, 141.55592873831776, 2.2602133727322706], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateRiskQualifiers-652", 5, 0, 0.0, 280.8, 268, 318, 273.0, 318.0, 318.0, 318.0, 2.207505518763797, 1.0110547737306843, 2.0673806567328916], "isController": false}, {"data": ["\/GnC.POS\/HO3\/RiskQualifiers\/Index-672", 5, 0, 0.0, 313.4, 292, 327, 320.0, 327.0, 327.0, 327.0, 4.019292604501607, 11.590792051848874, 3.0458701768488745], "isController": false}, {"data": ["\/GnC.POS\/Home\/Search-619", 5, 0, 0.0, 3084.2, 2971, 3143, 3129.0, 3143.0, 3143.0, 3143.0, 1.0195758564437194, 38.58855653548124, 3.1901572695758564], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote\/ValidateTIVForOpenAggreggate-653", 5, 0, 0.0, 320.8, 311, 341, 317.0, 341.0, 341.0, 341.0, 2.2143489813994686, 1.0141891330823738, 4.523845770593446], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Policy-803", 5, 0, 0.0, 1801.0, 1323, 2322, 1826.0, 2322.0, 2322.0, 2322.0, 0.17139723022075964, 3.327918252091046, 0.13825596890854244], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Quote-621", 5, 0, 0.0, 605.6, 462, 842, 562.0, 842.0, 842.0, 842.0, 2.0798668885191347, 49.199007513519135, 1.7386387271214643], "isController": false}, {"data": ["\/GnC.POS\/HO3\/PolicyHolder\/ShowRiskPopUp?showPopUp=false-671", 5, 0, 0.0, 283.8, 271, 298, 286.0, 298.0, 298.0, 298.0, 4.078303425774878, 1.871877548939641, 3.508774724714519], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 2, 100.0, 0.9302325581395349], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 215, 2, "500\/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/GnC.POS\/HO3\/Coverages\/SaveCoveragesAndRate-766", 5, 2, "500\/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
