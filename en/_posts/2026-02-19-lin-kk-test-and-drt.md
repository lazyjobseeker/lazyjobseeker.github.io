---
title: Lin-KK Test and DRT Analysis - Similarities and Differences
category: electrochemistry
tags:
  - electrochemistry
created_at: 2026-02-19 01:52:55 -05:00
last_modified_at: 2026-02-20 03:00:29 -05:00
excerpt: Examining the similarities and differences between the Lin-KK test, used to assess whether impedance measurement results satisfy the Kramers–Kronig (KK) relations, and the relaxation time distribution (DRT) analysis.
published: true
---

## Lin-KK Test

The Lin-KK test is a method for rapidly determining whether an arbitrary electrochemical impedance (EIS) spectrum satisfies the [Kramers–Kronig (KK) relations](https://lazyjobseeker.github.io/posts/kramers-kronig-relations/). It leverages the fact that a single parallel RC circuit satisfies the KK relations and that any linear combination of such circuits also satisfies them. Using this, it evaluates how well the given impedance data can be approximated by a linear combination of a finite number of RC circuits. In this approach, the time constants of each RC circuit are forced to be logarithmically evenly distributed within the required time domain, which reduces one degree of freedom in the optimization (only the R values of each RC circuit need to be fitted).

## Comparison with DRT

However, considering the concept of the [distribution of relaxation times (DRT)](https://lazyjobseeker.github.io/en/posts/distribution-of-relaxation-time/), the principle of the Lin-KK test appears somewhat like a series version (with a finite number of terms) of the integral equation solved in DRT analysis.


$$Z(\omega) = R_0 + \sum_{i=1}^M \frac{R_i}{1+j\omega\tau_i} \tag{\text{Lin-KK}}$$


$$Z(\omega) = R_0 + \int_{0}^{\infty} \frac{g(\tau)}{1+j\omega\tau} d\tau \tag{DRT}$$


Lin-KK test expressions do not include the $\Delta\tau$ term that converges to zero at the end of the integral as required for the Riemann integral - a significant difference -but the analogy can still be made.

If we ignore this difference, one might think:

> Could the distribution of $R_i$ obtained from the Lin-KK test be almost identical to the distribution of $\gamma(\tau)$ obtained from DRT?

## Differences

{% include video id="XYSGHabtTvM" provider="youtube" %}

If you actually test by increasing the number of RC circuits ($M$) used in the Lin-KK test toward infinity, you will see that the $R_i$ distribution does not converge to $\gamma(\tau)$. It's not just they are different a bit; beyond a certain $M$, the $R_i$ values start to alternate between positive and negative and their absolute values even start to diverge.

This divergence occurs because, unlike DRT analysis, the Lin-KK test does not apply the regularization used in DRT to obtain physically meaningful results. In DRT analysis, Ridge regularization (also called Tikhonov regularization) is applied as a mathematical tool to prevent such divergence and produce meaningful analytical results. Lin-KK test only concerns the given data's conformity to KK relation, neglecting the physical meanings (it doesn't care when you scream that there couldn't be negative resistance terms involved in the electrochemical processes you concern).