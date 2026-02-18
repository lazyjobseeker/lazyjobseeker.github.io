// Word count statistics

fetch("/dailywordcounter_kr.json")
  .then(res => res.json())
  .then(data => {
    const size = 29;
    const total = Object.values(data).reduce((acc, val) => acc + val, 0);
    const entries = Object.entries(data).slice(-size);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    document.querySelector('#wc_today').innerText = values[size-1].toLocaleString();
    document.querySelector('#wc_yesterday').innerText = values[size-2].toLocaleString();
    document.querySelector('#wc_total').innerText = total.toLocaleString();

    new Chart(document.getElementById("myWordCountChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          data: values,
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
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: true },
            ticks: { autoSkip: false,
                     maxRotation: 0,
                     callback: function(value, index) {
                       if (index % 7 !== 0) return "";
                       const label = this.getLabelForValue(value);
                       const [y, m, d] = label.split("-").map(Number);
                       const utcd = new Date(Date.UTC(y, m - 1, d));
                       const mm = String(utcd.getUTCMonth() + 1).padStart(2, "0");
                       const dd = String(utcd.getUTCDate()).padStart(2, "0");
                       return `${mm}-${dd}`;
                     }
                    },
          },
          y: {
            grid: { display: true },
            beginAtZero: true
          }
        },
        maintainAspectRatio: false,
        responsive: true
      }
    });
  });