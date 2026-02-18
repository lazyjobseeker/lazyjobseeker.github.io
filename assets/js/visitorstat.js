// Visitor Statistics
var dates = [];
var counts = [];
var step;
var today = new Date();
var size = 29;
var rqsts = [];
var subtrrqsts = [];
var remainingUpdates = size*2;

for (step = 0; step < size; step++) {
    counts[step] = 0;
}

function updateTodayYesterday() {
    document.querySelector('#gc_today').innerText = counts[size-1];
    document.querySelector('#gc_yesterday').innerText = counts[size-2];
}

function drawChart() {
    const ctx = document.getElementById('myChart');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'PAGEVIEWS',
                data: counts,
                borderWidth: 2,
                pointBackgroundColor: 'rgba(66, 173, 255, 1)',
                pointBorderColor: 'rgba(66, 173, 255, 1)',
                backgroundColor: 'rgba(66, 173, 255, 0.5)',
                borderColor: 'rgba(66, 173, 255, 1)',
                pointRadius: 1.5,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        callback: function(val, index) {
                            return index % 7 === 0 ? this.getLabelForValue(val) : "";
                        }
                      }
                },
                y: {
                    grid: {
                        display: true,
                    },
                    beginAtZero: true
                }
            },
            maintainAspectRatio: false,
            responsive: true
        }
    });
}

function plusCounts() {
    counts[this.idx] = counts[this.idx] + parseInt(JSON.parse(this.responseText).count.replace(/\s/g, ""));
    remainingUpdates--;
    if (remainingUpdates == 0) {
        drawChart();
        updateTodayYesterday();
    }
}

function minusCounts() {
    counts[this.idx] = counts[this.idx] - parseInt(JSON.parse(this.responseText).count.replace(/\s/g, ""));
    remainingUpdates--;
    if (remainingUpdates == 0) {
        drawChart();
        updateTodayYesterday();
    }
}
for (step = 0; step < size; step++) {
    var tmptomorrow = new Date(today);
    var tmptoday = new Date(today);
    tmptomorrow.setDate(tmptomorrow.getDate() - step + 1);
    tmptoday.setDate(tmptoday.getDate() - step);
    tomorrowisostring = tmptomorrow.toISOString();
    todayisostring = tmptoday.toISOString();
    dates[size-step-1] = todayisostring.substring(5, 10);
    rqsts[step] = new XMLHttpRequest();
    subtrrqsts[step] = new XMLHttpRequest();
    rqsts[step].idx = size-step-1;
    subtrrqsts[step].idx = size-step-1;
    rqsts[step].onload = plusCounts;
    subtrrqsts[step].onload = minusCounts;
    rqsts[step].open('GET', basejson + '?start=' + todayisostring.slice(0, 10) + '&end=' + tomorrowisostring.slice(0, 10));
    subtrrqsts[step].open('GET', basejson + '?start=' + tomorrowisostring.slice(0, 10) + '&end=' + tomorrowisostring.slice(0, 10));
    rqsts[step].send();
    subtrrqsts[step].send();
}

var total_cnt = new XMLHttpRequest();
total_cnt.addEventListener('load', function() {
    document.querySelector('#gc_total').innerText = JSON.parse(this.responseText).count.replace(/\s/g, ",");
})
total_cnt.open('GET', basejson);
total_cnt.send();