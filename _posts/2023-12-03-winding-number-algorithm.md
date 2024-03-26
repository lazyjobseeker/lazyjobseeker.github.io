---
lang: ko
toc: true
toc_sticky: true
title: "점과 다각형의 포함관계 판정: Winding Number 알고리즘"
category: Programming
redirect_from:
  - /programming/231203-winding-number-algorithm/
tags:
  - python
published: true
created_at: 2023-12-03 15:34:31 +09:00
last_modified_at: 2024-03-26 13:57:03 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-6.png
excerpt: "2차원 평면에서 다각형과 점이 주어졌을 때 점이 다각형 안에 있는지 판정할 수 있는 Winding Number 알고리즘을 구현해 봅니다"
---

## 1. 기본 아이디어

와인딩넘버 알고리즘 (Winding Number Algorithm)은 2차원 평면에서 다각형과 한 점이 주어졌을 때, 점이 다각형 안에 있는지 밖에 있는지를 판정할 수 있는 알고리즘입니다.

![](/assets/images/20231203-winding-number-algorithm.png){: width="600" .align-center}

아이디어는 위의 그림과 같습니다. 주어진 점에서 시작하는 **반직선**을 그었을 때, 다각형이 점을 포함한다면 반직선과 다각형이 만나는 점의 개수(winding number)는 홀수 개가 되고, 포함하지 않는다면 짝수 개가 된다는 것을 이용합니다.

다각형은 x좌표와 y좌표로 구성된 꼭지점 튜플 (x, y)들을 원소로 갖는 리스트로 주어지며, 시계 방향으로 각 원소를 순회한다고 가정하겠습니다.

예를 들어 아래와 같은 사각형이 주어진다면 다각형을 나타내는 리스트는 **[(0,0),(0,1),(1,1),(1,0)]**이 됩니다.

![](/assets/images/20231203-square-example.png){: width="300" .align-center}

## 2. 구현하기

우선 다각형에서 연속된 두 꼭짓점을 골라 선분(segment)으로 보고, 다각형 안에 포함되는지 판정해야 하는 점 P(point)에서 +x 방향으로 반직선을 긋는 것으로 생각합니다. 만일 반직선이 선분을 지난다면 winding number에 1을 더하고, 이것을 주어진 다각형을 이루는 모든 선분들에 대해 반복하면 됩니다. 최종적으로 winding number(`total`)이 홀수이면 True(점 P가 다각형의 내부에 있음), 짝수이면 False(점이 다각형 밖에 있음)을 출력하도록 하겠습니다.

```python
import numpy as np

def is_in_polygon(point:tuple[float,float],
                  polygon:list[tuple[float,float]]) -> bool:

    polygon.append(polygon[0]) # ... (1)

    total = 0
    for i, v in enumerate(polygon[:-1]):
        p_x, p_y = point
        segment = np.asarray(polygon[i:i+2])
        x_coords = np.transpose(segment)[0]
        y_coords = np.transpose(segment)[1]

        if p_x > np.max(x_coords): continue  # ... (2)
        if (y_coords[0]-p_y)*(y_coords[1]-p_y)<0: # ... (3)
            total = total + 1
        if y_coords[0] == p_y: total = total + 0.5 # ... (4)
        if y_coords[1] == p_y: total = total + 0.5 # ... (4)

    polygon.pop(-1) # ... (5)

    return True if total % 2 != 0 else False
```

우선 다각형(polygon)이 꼭짓점들의 리스트로 주어지면, 가장 첫 번째 꼭짓점을 리스트의 끝에 `append`하도록 하였습니다. 마지막 꼭짓점과 첫 꼭짓점이 연결되어 만들어지는 선분도 winding number 계산에 반영하기 위해서입니다. **...(1)**

+x 방향으로 반직선을 그어서 만나는지 아닌지를 판정할 것이기 때문에, 만일 P의 x좌표(p_x)가 선분을 이루는 두 점의 x좌표들보다 크다면 해당 선분에 대해서는 계산할 필요가 없으며 따라서 `continue` 처리합니다. **...(2)**

P의 y좌표(p_y)가 선분을 이루는 점들의 y좌표들의 사이에 있다면, 반직선이 선분과 만나게 될 것이므로 winding number(`total`변수)에 1을 더해줍니다. **...(3)**

![](/assets/images/20231203-square-cornercase.png){: width="300" .align-center}

P의 y좌표(p_y)가 선분을 이루는 점들의 y좌표 중 하나와 같다면 winding number에 1이 아니라 0.5를 더해 줍니다. P로부터 그어진 반직선이 선분과 만나는 것은 맞지만, 이 경우 서로 다른 선분 두 개에서 winding number에 기여하는 것으로 계산되기 때문에 1을 더해 주면 잘못된 결과를 얻게 됩니다. **...(4)**

반복 호출 시 다각형을 나타내는 원본 리스트가 계속 길어지지 않도록, 모든 계산이 끝난 뒤 다각형 리스트를 원래대로 복원해 줍니다. **...(5)**

## 3. 동작 확인

이제 아래와 같이 실행해 보면,

```python
# 단위 사각형
polygon = [(0,0),
           (0,1),
           (1,1),
           (1,0)]

point_1 = (0.5, 0.5) # 사각형 안의 점
point_2 = (-10, -10) # 사각형 밖의 점
point_3 = (0.5, 1) # 사각형 안의 점 (반직선이 꼭짓점을 지남)
point_4 = (-10, 1) # 사각형 밖의 점 (반직선이 꼭짓점을 지남)

print(is_in_polygon(point_1, polygon))
print(is_in_polygon(point_2, polygon))
print(is_in_polygon(point_3, polygon))
print(is_in_polygon(point_4, polygon))
```

의도하는 대로 동작하는 것을 확인할 수 있습니다.

```
D:\repositories\devlog_codes\windingnumber>python windingnumber.py
True
False
True
False
```

와인딩넘버 알고리즘은 사용자가 임의의 다각형을 그려 특정한 점 집합을 선택하도록 하는 UI 툴 (ex. 포토샵의 올가미 툴)의 구현과 같은 작업에 활용될 수 있습니다.
