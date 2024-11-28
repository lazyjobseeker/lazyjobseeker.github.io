var dates = [];
var counts = [];
var step;
var today = new Date();
var size = 29;

var rqsts = [];
var remainingUpdates = size;
function updateCounts() {
    counts[this.idx] = parseInt(JSON.parse(this.responseText).count.replace(/\s/g, ""));
    remainingUpdates--;
    if (remainingUpdates == 0) {
        const ctx = document.getElementById('myChart');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
            labels: dates,
            datasets: [{
                label: 'VISITORS',
                data: counts,
                borderWidth: 2,
                pointBackgroundColor: 'rgba(66, 173, 255, 1)',
                pointBorderColor: 'rgba(66, 173, 255, 1)',
                backgroundColor: 'rgba(66, 173, 255, 0.5)',
                borderColor: 'rgba(66, 173, 255, 1)',
                pointRadius: 1,
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
    rqsts[step].idx = size-step-1;
    rqsts[step].onload = updateCounts;
    rqsts[step].open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json?start=' + todayisostring.slice(0, 10) + '&end=' + tomorrowisostring.slice(0, 10));
    rqsts[step].send();
}

var today = new Date();
var yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
var today_cnt = new XMLHttpRequest();
today_cnt.addEventListener('load', function() {
    document.querySelector('#gc_today').innerText = JSON.parse(this.responseText).count.replace(/\s/g, ",");
})
today_cnt.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json?start=' + today.toISOString().slice(0, 10));
today_cnt.send()
var yesterday_cnt = new XMLHttpRequest();
yesterday_cnt.addEventListener('load', function() {
    document.querySelector('#gc_yesterday').innerText = JSON.parse(this.responseText).count.replace(/\s/g, ",");
})
yesterday_cnt.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json?start=' + yesterday.toISOString().slice(0, 10) + '&end=' + today.toISOString().slice(0, 10));
yesterday_cnt.send();
var total_cnt = new XMLHttpRequest();
total_cnt.addEventListener('load', function() {
    document.querySelector('#gc_total').innerText = JSON.parse(this.responseText).count.replace(/\s/g, ",");
})
total_cnt.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json');
total_cnt.send();