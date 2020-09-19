/**
 * Project: CoGAP Website
 *
 * Copyright © MPM IT UG (haftungsbeschränkt)
 * http://www.mpm-it.com
 *
 * @author MPM IT <info@mpm-it.com>
 */

$(function () {

    var generatePieChart = function (id, data, options) {
        var pieCtx = document.getElementById(id);
        var pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    };

    var pieData1 = {
        datasets: [{
            data: [30, 23, 26, 21],
            backgroundColor: [
                '#fa6161', // Alpha
                '#fbbc05', // Beta
                '#34c453', // Gamma
                '#3d9be9' // Delta
            ]
        }],
        labels: ['Alpha', 'Beta', 'Gamma', 'Delta']
    };

    var pieChartOptions1 = {
        cutoutPercentage: 60,
        responsive: false,
        maintainAspectRatio: false,
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.datasets[0].data[tooltipItems.index] + ' %';
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    generatePieChart('chart1', pieData1, pieChartOptions1);

    var pieData2 = {
        datasets: [{
            label: [],
            data: [63, 37],
            backgroundColor: [
                '#3d9be9', // Endurance
                '#fa6161' // Speed
            ]
        }],
        labels: ['Endurance', "Speed"]
    };

    var pieChartOptions2 = {
        cutoutPercentage: 60,
        responsive: false,
        maintainAspectRatio: false,
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.datasets[0].data[tooltipItems.index] + ' %';
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    generatePieChart('chart2', pieData2, pieChartOptions2);

    var pieData3 = {
        datasets: [{
            label: [],
            data: [15, 15, 12, 12, 20, 6, 16, 5],
            backgroundColor: [
                '#ffa3a0', // AE
                '#f27e80', // AS

                '#ffe294', // BE
                '#f2cd6f', // BS

                '#94ffb0', // YE
                '#6ff292', // YS

                '#a3d6ff', // DE
                '#80c1f2' // DS
            ]
        }],
        labels: ['α/E', 'α/S', 'β/E', 'β/S', 'γ/E', 'γ/S', 'δ/E', 'δ/S']
    };

    var pieChartOptions3 = {
        cutoutPercentage: 60,
        responsive: false,
        maintainAspectRatio: false,
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.datasets[0].data[tooltipItems.index] + ' %';
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    generatePieChart('chart3', pieData3, pieChartOptions3);
});
