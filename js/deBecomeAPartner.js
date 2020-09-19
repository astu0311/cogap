/**
 * Project: CoGAP Website
 *
 * Copyright © MPM IT UG (haftungsbeschränkt)
 * http://www.mpm-it.com
 *
 * @author MPM IT <info@mpm-it.com>
 */

$(function () {

    var generateBarChart = function (id, barData, barChartOptions) {
        var barCtx = document.getElementById(id);
        var barChart = new Chart(barCtx, {
                type: 'bar',
                data: barData,
                options: barChartOptions
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

    barData.labels = ['Ja', 'Nein'];
    barData.datasets[0].data = [95.8, 4.2];
    barChartOptions.scales.yAxes[0].ticks.max = 100;
    barChartOptions.scales.yAxes[0].ticks.stepSize = 20;

    generateBarChart('chart1', barData, barChartOptions);
});
