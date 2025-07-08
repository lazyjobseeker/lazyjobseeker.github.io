---
title: Kramers-Kronig Relations
category: electrochemistry
tags:
  - EIS
created_at: 2025-07-05 11:36:58 -05:00
last_modified_at: 2025-07-08 06:52:36 -05:00
excerpt: What is Kramers-Kronig (KK) Relations - theory and an animated pictorial proof
published: true
---
**Kramers-Kronig (KK) relations** states that if you have a complex function $\mathcal{H}(\omega)$ which is **analytic** in the upper half part of complex plane, the real part of this function $\text{Re }\mathcal{H}$ can be directly calculated from the imaginary part of it and vice versa:

$$\text{Re }\mathcal{H}(\omega) = \displaystyle{\frac{1}{\pi}\mathcal{P}\int_{-\infty}^{\infty}}\frac{\text{Im }\mathcal{H}(\omega ')}{\omega ' - \omega}d\omega' \tag{1}$$

It is relation's' because $\text{Eq. 1}$ is paired with one whose left-hand side is $\text{Im }\mathcal{H}(\omega )$.

There are two different versions of proof for KK relations.  The first and more readily accessible one on the web uses contour integration for complex function.  The other one, less prevalent from web search but more visually comprehensive, starts from the time-domain representation of $\mathcal{H}$ (let's name it $H$). 

Roughly there are two different versions of proof for KK relations. One using contour integration of complex function is more readily found, but there is another approach which I find was easier to animate and therefore provides more visually engaging illustration.  

{% include video id="zKD_MZPjT7Q" provider="youtube" %}
  
This version of proof starts from time-domain representation of a causal response function H(t). Causality means that the cause (input signal) precedes the effect (output signal), whose mathematical condition is given by "H(t)=0 for t < 0".  
  
There are two key observations completing this proof.  One is that a causal function H can be represented as a sum of an odd and an even function, where the even one can be rewritten in terms of the odd one using the signum function.  The other is the property of Fourier transformation that an odd(even) function in the time domain transforms into purely real(imaginary) function in the frequency domain.  
  
EIS results are said to be compliant with KK relations, meaning that the impedance response is thought to be causal. In the other version of proof using the contour integral, the condition of causality translates into analyticity of H(ω) in upper half plain of complex number coordinate.

