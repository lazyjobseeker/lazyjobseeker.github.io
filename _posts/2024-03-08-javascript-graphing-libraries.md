---
toc: true
toc_sticky: true
title: "자바스크립트로 차트 그리기"
category: Programming
tags:
  - "Minimal Mistakes"
  - Jekyll
  - "Github Blog"
  - Javascript
published: false
created_at: 2024-03-05 23:43:24 +09:00
last_modified_at: 2024-03-09 15:26:36 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-6.png
excerpt: "차트 그리기"
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<style>
  .graph-controller {
    box-sizing: border-box;
    width: 100%;
    margin: 1em 0 1em 0;
    padding: 0.1em 1em 0.1em 1em;
    background-color: #cccccc;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
  .graph-ctrl-btn {
    font-size: 1em;
    display: block;
    margin: 5px 5px;
    padding: .5em .75em;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .graph-ctrl-btn:hover {
    background-color: #2980b9;
  }
</style>

<div class="graph-controller">
  <button class="graph-ctrl-btn" onc>UP</button>
  <button class="graph-ctrl-btn">DOWN</button>
</div>

<canvas id="myChart" width="300" height="100"></canvas>
<script>
  let myCt = document.getElementById('myChart');
  let myChart = new Chart(myCt, {
    type: 'bar',
    data: {
      labels: ['2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Dataset',
          data: [10,20,30,40],
        }
      ]
    },
  });
</script>