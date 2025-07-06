---
title: Machine Learning for Battery Cycle Life Prediction
category: machine-learning
tags:
  - programming
  - battery
  - machine-learning
created_at: 2025-03-03 04:06:10 -05:00
last_modified_at: 2025-06-09 04:31:45 -05:00
excerpt: Review for data-driven and machine-learning models for battery cycle life prediction problem
published: true
---
## KA Severson, PM Attia et al. (2019)[^1]

This paper might be the very first and seminal work in this field.  The authors first employed linear regression model over elaborated set of features.  124 LFP cells were thoroughly analyzed and thereby the authors proposed $\Delta Q_{100-10}$ as the most valuable source of feature extraction.  This feature is basically a function of voltage where each voltage value during discharging corresponds to the difference of accumulated capacity between two discharge profiles taken in different cycle numbers.  Theoretically any pair of cycles can be chosen to calculate $\Delta Q_{m-n}$ and the authors reported that 10-100 pair resulted in the best result.  The variance of $\Delta Q_{100-10}$ was found to be the most explanative of the cycle number at EOL so $\text{Var}(\Delta Q_{100-10})$ was crucial in their model.  A myriads of following researches relied on this feature in proposing different versions of data-driven model for battery cycle life predictors.

It is noticeable that the authors relied on simple linear regression model with penalty (Elastic Net) than complicated deep neural network structures.  The authors wrote that the choice of linear model allowed them more interpretable and lightweight model.  As will be further discussed, the SOTA model named BatLiNet proposed in 2025 also partly relied on the merit of using linear segment to avoid overfitting from data scarcity problem.

[^1]: KA Severson, PM Attia, N Jin, N Perkins, B Jiang, Z Yang, MH Chen, M Aykol, PK Herring, D Fraggedakis, MZ Bazant, SJ Harris, WC Chueh, and RD Braatz, "Data-Driven Prediction of Battery Cycle Life Before Capacity Degradation," *Nature Energy* **4**, 383-391 (2019)

## H Zhang, Y Li et al. (2025) - BatLiNet[^2]

In this article, the authors argue that cycle life prediction models can largely be benefited by adding the scheme of **inter-cell learning**.  Though there is no broadly-accepted large dataset or framework to evaluate different machine learning models in the field of battery cycle life prediction problem, BatLiNet proposed in this paper is the SOTA model up until 2025 considering its broad coverage of publicized dataset.  According to the authors, previous approaches focused on **intra-cell learning**, where the difference between two discharging profiles picked out of the aging trajectory of a same single cell and the features from there were handled to be the main source of cycle life modeling.

The authors then proposes their inter-cell learning strategy.  While intra-cell learning works by assessing the difference between discharge profiles at two different cycles, inter-cell learning compares **two different cells** but at same cycle along their aging pathways.  In this process, one of the cells being compared is called **reference cell** for which we know the final EOL cycle life.  The target cell for which we want to predict its EOL cycle is called **target cell**.

Compared to the work of Severson and coworkers, the approach differs first in terms of their choice of $\Delta V$ rather than $\Delta Q$.  Furthermore, while Severson's paper compared 10th cycle with 100th cycle and those two cycles are the only data taken out of initial 100 cycles of charging/discharging data, implementation of BatLiNet makes 100 different comparisons between $n$-th cycle ($n \le 100$) and 10th cycle.  Final dataset forms a tensor with size $(B, 6, H, W)$, where $B$ is batch size, $H$ is the number of cycles which is compared with 10th cycle's data to calculate $\Delta V$ profile, and $W$ is the number of points used to interpolate original $Q-V$ and $Q-I$ plot.  Second dimension's size became 6 because BatLiNet make use of 1) $\Delta V$ during charging, 2) $\Delta V$ during discharging, 3) $\Delta I$ during charging, 4) $\Delta I$ during charging, 5) $\Delta V / \Delta I$ during charging, and 6) 5) $\Delta V / \Delta I$ during discharging.

{% include img-gdrive alt="BatLiNet architecture (2025)" id="1CY0l9iWSknQ7EFof368LthmiLIHiSLCS" %}

The authors used CNN as their main feature encoder and combined resulting embeddings into a single linear layer $\text{w}$ to output the final cycle life of a target battery cell.  It is noticeable to review their justification of using linear model at the last layer of the whole architecture.

First of all, let's put the intra-cell feature of a battery cell as $\text{x}$ and a cycle life predictor for this feature as $f_\theta$ ($\theta$ be a set of parameters for model $f$).  Then the problem of training $f$ can be written as follows:

$$ \operatorname*{min}\limits_{\theta}\Bbb{E}_{(\textbf{x},y)\in D}{\lVert f_\theta(\textbf{x}) - y \rVert}^2_2 \tag{ZL1}$$

At this point the authors say that due to the data scarcity issue of battery cycle life prediction problem, it is risky to solely rely on the neural network in the modeling.  The authors tackle this problem by modeling additional problem, which does not only share the optimality condition with $\text{ZL1}$ but also work to practically expand the size of available dataset.

The additional problem proposed by authors is predicting the **difference** between EOL cycle life between a target cell and a reference cell.  If we call this model $g_\phi$ and suppose this model takes a feature difference $\Delta\textbf{x}$ as input and outputs cycle life difference $\Delta y$, the description for this problem becomes,

$$ \operatorname*{min}\limits_{\phi}\Bbb{E}_{(\Delta\textbf{x},\Delta y)\in D}{\lVert g_\phi(\Delta\textbf{x}) - \Delta y \rVert}^2_2 \tag{ZL2}$$

The most important take is that when $f$ and $g$ are both linear models, they share the optimal solution.  This cross-optimality required the authors to preprocess their data to make $\Delta y$ zero-centered (have zero expectation value).  Short justification for this statement is given like this: if we have an optimal objective function for model $g$ to be $g_{\phi^\ast}(x)=\text{w}_g^\ast \Delta\textbf{x}$, below holds:

$$ \begin{aligned}
   &\Bbb{E}_{(\Delta\textbf{x},\Delta y)\in D}{\lVert {\text{w}_g^\ast}^T\Delta\textbf{x} - \Delta y \rVert}^2_2 = \newline
   &\Bbb{E}_{(\textbf{x},y)\in D}{\lVert{\text{w}_g^\ast}^T\textbf{x} - y \rVert}^2_2 
   +\Bbb{E}_{(\textbf{x}',y')\in D}{\lVert{\text{w}_g^\ast}^T\textbf{x}' - y' \rVert}^2_2
   = \newline
   &2 \times \Bbb{E}_{(\textbf{x},y)\in D}{\lVert{\text{w}_g^\ast}^T\textbf{x} - y \rVert}^2_2   \end{aligned} 
   \tag{ZL3} $$

which can only be satisfied when $\textbf{w}_g^* = \textbf{w}_f^*$.

[^2]: H Zhang, Y Li, S Zheng, Z Lu, X Gui, W Xu, and J Bian, "Battery Lifetime Prediction Across Diverse Ageing Conditions with Inter-Cell Deep Learning," *Nature Machine Intelligence* **7**, 270-277 (2025)