/**
 * Project: CoGAP Website
 *
 * Copyright © MPM IT UG (haftungsbeschränkt)
 * http://www.mpm-it.com
 *
 * @author MPM IT <info@mpm-it.com>
 */

$(function () {

    var generateBarChart = function (id, data, options) {
        var barCtx = document.getElementById(id);
        var barChart = new Chart(barCtx, {
                type: 'bar',
                data: data,
                options: options
            }
        );
    };

    var barData = {
        labels: ['', ''],
        datasets: [
            {
                label: '',
                backgroundColor: [
                    '#3d9be9',
                    '#fa6161'
                ]
            }
        ]
    };

    var barChartOptions = {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false,
        },
        scales: {
            xAxes: [{
                gridLines: {display: false},
                barPercentage: 0.5
            }],
            yAxes: [{
                ticks: {
                    callback: function (value) {
                        return project.numberWithCommas(value);
                    },
                    min: 0
                },
            }],
        }
    };

    barData.datasets[0].data = [6, 2.2];
    barChartOptions.scales.yAxes[0].ticks.max = 7;
    barChartOptions.scales.yAxes[0].ticks.stepSize = 1;

    generateBarChart('chart1', barData, barChartOptions);

    barData.datasets[0].data = [2.33, 0.43];
    barChartOptions.scales.yAxes[0].ticks.max = 3;
    barChartOptions.scales.yAxes[0].ticks.stepSize = 0.5;

    generateBarChart('chart2', barData, barChartOptions);

    barData.labels = ['Ja', 'Nein'];
    barData.datasets[0].data = [90.6, 9.4];
    barChartOptions.scales.yAxes[0].ticks.max = 100;
    barChartOptions.scales.yAxes[0].ticks.stepSize = 20;

    generateBarChart('chart3', barData, barChartOptions);

    barData.labels = ['Ja', 'Nein'];
    barData.datasets[0].data = [87, 13];
    barChartOptions.scales.yAxes[0].ticks.max = 100;
    barChartOptions.scales.yAxes[0].ticks.stepSize = 20;

    generateBarChart('chart4', barData, barChartOptions);
});
