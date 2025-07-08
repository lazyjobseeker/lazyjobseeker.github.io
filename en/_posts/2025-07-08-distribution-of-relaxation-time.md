---
title: Distribution of Relaxation Time (DRT) Method
category: electrochemistry
tags:
  - EIS
created_at: 2025-07-08 10:41:59 -05:00
last_modified_at: 2025-07-08 11:18:04 -05:00
excerpt: What is the distribution of relaxation time (DRT) methods with an explanatory animation.
published: true
---
**Distribution of Relaxation time (DRT) analysis** for impedance data provides unique perspective than standard EIS analysis based on equivalent circuit modeling.
  
When fitting a given EIS data with equivalent circuit, a priori knowledge of electrochemical processes inside an electrochemical system is required to choose proper circuit and find optimal fitting parameters.  
 
While equivalent circuit model fitting gives you a predetermined finite number of parameters, DRT analysis outputs a continuous response function g(τ).  In nature g(τ) is similar to the resistive part of RC circuits appearing in equivalent circuit model, but it is different in that g(τ) provides the electrochemical system's resistive property at all timescales of interest in functional form.  Roughly, it can be said that DRT method uses equivalent circuit with infinite number of infinitesimal RC circuits.  
  
Attached video is an illustrative demo for your reference, showing an example of cycle-dependent evolution of EIS spectra (measured at the end of CCCV charging and followed resting for each cycle) and their corresponding DRT analysis results.  DRT analysis was done with open-sourced software of pyDRTtools[^1], and I could find some public cycle retention and EIS data to conduct this analysis from Y Zhang, Q Tang et. al. (2020)[^2], where the authors publicized their data in public repository. The paper is not about DRT but shows great approach of using EIS for ML-powered battery degradation prediction so give it a look if you are interested - It is open access!

{% include video id="17B4eJKMw3yuwu4Lw03BLQM12fp3Ehc9L" provider="google-drive" %}

[^1]: [ciuccislab/pyDRTtools: An intuitive python GUI to compute the DRT](https://github.com/ciuccislab/pyDRTtools)
[^2]: Y Zhang, Q Tang et. al., Nat. Commun. (2020); 10.1038/s41467-020-15235-7
