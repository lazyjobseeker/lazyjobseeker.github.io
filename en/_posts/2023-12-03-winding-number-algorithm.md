---
revision: 1
title: Winding Number Algorithm to Determine Point-Polygon Inclusion
category: programming
tags:
  - python
created_at: 2023-12-03 03:34:31 +09:00
last_modified_at: 2024-07-28 10:17:26 +09:00
excerpt: Implementing winding-number algorithm to determine if a point is placed inside a polygon
---

## 1. Basic Idea

**Winding Number Algorithm** is an algorithm to determine if a point is located inside a polygon or not.

{% include img-gdrive alt="Winding number algorithm" id="1_kl89dX1XsrOMeqqihb89RYRh_qK7g0u" %}

The basic idea looks like above image.  If we cast a ray starting from the point we want to determine its inclusion inside a given polygon, and if the ray makes **odd** numbers of intersection with the polygon, the point lays inside the polygon.

Let's brief how can I implement this in `python`.  Before moving on, a convention is made to describe a polygon: a polygon is given as a list containing its vertices as elements, and looping through this list is same as counting all the vertices clockwise.  Each vertex is given as a tuple of $(x, y)$  format.

For a square like below,  list **[(0,0),(0,1),(1,1),(1,0)]** can describe this square, for example.

{% include img-gdrive alt="Example Square" id="1fxhhxvBL5x2xRhavm0GgA5SkmXLBLxIn" %}

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

{% include img-gdrive alt="Cornercases" id="14ek7Ow5kcww4lrYaujrcOSOg2vEmHadc" %}

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

## 4. Complexity

There are already many posts introducing different methods applicable for solving this ***point-in-polygon*** determination problem.  So I just want to metion a different light, the time complexity of various approches suggested till now.  Googling will do if you are to see the detail of different approches.

I would like to give some summary of below journal paper:

C-W Huang and T-Y Shih, *"On the Complexity of Point-in-Polygon Algorithms"*, Computers & Geosciences 23(1) 109-118, 1997.

Before moving on, let me note that the authors systematically divided the overall process of solving a point-in-polygon problem into three features: 1) preprocess, 2) storage, and 3) query. 

- ***Preprocess*** is required if you need to build extra objects and store them in following steps.  Time complexity is $O(1)$ for any algorithm which does not require this step.
- ***Storage*** is to described the required memory storage for the given algorithm so a related complexity is *space complexity*.
- ***Query*** is the main step checking the given point's inclusion in the target polygon and time complexity is assessed.

First of all, you can think of two different ways to handle polygons: 1) raster type and 2) vector type.  Rasterized polygons are given as ***a set of square grids***.  You might simply imagine a pixelated image.  When you magnify such an image you see an array of squares.

It is said that:
- ***Grid method*** is the most efficient one for raster-format inputs.

For the grid method, preprocess is not required.  So the time complexity for preprocessing is $O(1)$.  Storage step features $O(N)$ space complexity.  Finally, the query step features $O(N)$ time complexity as in this scheme the coordinates of given point $p$ needs to be back-to-back compared with every single grid to confirm if there is any grid $G$ containingg $p$ (i.e. point is included in polygon) or not.

When it comes to ***vectoral polygons***, grid method does not work.  There are several methods applicable:

- Ray intersection
- Sum of Angle
- Swath
- Sign of Offset
- Sum of Area
- Orientation
- Wedge

It is said that:
- ***Swath method*** is efficient for vector-formatted inputs, with some sacrifice in space complexity.
- If you know the target polygon is convex, ***wedge method*** is decent - $O(N)$ for preprocessing and $O(logN)$ for query.
- Practically (when the number of nodes are limited and target polygons are usually concave) ***swath method*** and ***ray intersection method*** both decent.  If the number of $N$ increases, the former beats the latter.

When you have a vectoral polygon composed of vertices $v = \lbrace v_i\rbrace _{i<N}$, swath method uses $N$ half-lines starting from each $v_i$.  
