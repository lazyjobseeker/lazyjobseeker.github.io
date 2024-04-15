---
title: "Winding Number Algorithm to Determine Point-Polygon Inclusion"
category: programming
tags:
  - python
created_at: 2023-12-03 03:34:31 +09:00
last_modified_at: 2024-04-15 09:42:39 +09:00
excerpt: "Implementing winding-number algorithm to determine if a point is placed inside a polygon"
---

## 1. Basic Idea

**Winding Number Algorithm** is an algorithm to determine if a point is located inside a polygon or not.

![](/assets/images/20231203-winding-number-algorithm.png){: width="600" .align-center}

The basic idea looks like above image.  If we cast a ray starting from the point we want to determine its inclusion inside a given polygon, and if the ray makes **odd** numbers of intersection with the polygon, the point lays inside the polygon.

Let's brief how can I implement this in `python`.  Before moving on, a convention is made to describe a polygon: a polygon is given as a list containing its vertices as elements, and looping through this list is same as counting all the vertices clockwise.  Each vertex is given as a tuple of $(x, y)$  format.

For a square like below,  list **[(0,0),(0,1),(1,1),(1,0)]** can describe this square, for example.

![](/assets/images/20231203-square-example.png){: width="300" .align-center}

## 2. Implementation

If I choose two adjacent vertices from given polygon, it forms a segment.  If there are $N$ total vertices, 4 different segments can be chosen from this polygon.  To check if a ray cast from the point $P$ whose inclusion in polygon we want to know, we need to check for all $N$ segments whether a ray cast from $P$ has intersection with each segment and count the total number of intersections. 

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

Once a polygon is provided, append the very first vertex at the end of the polygon.  This is not to omit the segment joining first vertex with last one. **...(1)**

The ray can be cast along any direction, but in this example I will cast it in $+x$ direction.  In this case, if the $x$-coordinate of point $P$ is larger than both of the points comprising, such case can be skipped because ray along $+x$ cast from $P$ can never intersect with such segment. **...(2)**

And if the $y$-coordinate of $P$ locates between the $y$-coordinates of segment-comprising points, ray will interect the segment, so increase counter by 1 for `winding number` variable. **...(3)**

![](/assets/images/20231203-square-cornercase.png){: width="300" .align-center}

It needs to be noted that there is a corner-case to be handled.  When $y$-coordinate of $P$ is same with one of the points comprising a segment, I let the winding number increase by 0.5 than 1.  Unless I do this, the vertex whose $y$ coordinate coincide with that of $P$ contribute twice in winding number calculation and spoil the result. **...(4)**

Finally, for the original polygon list not being lengthened infinitely due to the head-point appending, I restored the original polygon list after winding number calculation. **...(5)**

## 3. Check Operation

Now let's check how above implementation works.

```python
# Unit square
polygon = [(0,0),
           (0,1),
           (1,1),
           (1,0)]

point_1 = (0.5, 0.5) # Point in square
point_2 = (-10, -10) # Point out of square
point_3 = (0.5, 1) # Point in square: +x ray passes through one vertex
point_4 = (-10, 1) # Point out of square: +x ray passes through one vertex

print(is_in_polygon(point_1, polygon))
print(is_in_polygon(point_2, polygon))
print(is_in_polygon(point_3, polygon))
print(is_in_polygon(point_4, polygon))
```

Running the script shows expected results.

```
D:\repositories\devlog_codes\windingnumber>python windingnumber.py
True
False
True
False
```

Winding number algorithm can be used to implement UI tool (ex. lasso tool of photoshop) which allows user to draw arbitrary closing shape to choose a set of points.
