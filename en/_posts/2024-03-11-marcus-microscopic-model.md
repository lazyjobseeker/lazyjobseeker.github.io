---
title: Marcus Model of Electron Transfer
category: electrochemistry
tags:
  - electron-transfer
  - marcus-model
  - kinetics
created_at: 2024-03-05 11:43:24 +09:00
last_modified_at: 2024-04-15 09:44:27 +09:00
excerpt: The concept of Marcus microscopic model for isoenergetic, radiationless and configuration-preserving electron transfer is detailed.
---

## 1. Summary

**Marcus microscopic model** explains how the kinetics of electron transfer reaction is determined.  Formulation of Marcus model is based on three crucial assumptions:

- Electron transfer is **isoenergetic**.  Therefore, it is **radiationless**
- **Configurative alteration** does **not** accompany duering electron transfer

Marcus model starts from assumption that free-energies of oxidized species ($O$) and reduced species ($R$) could both be described in quadratic form, formulating explicit equation explaining rate constants of forward- and backward-reaction.  In this process, the concept of **reorganization energy ($\lambda$)** is posed to be important.  Furthermore, the theory predicts the existence of so-called **Marcus inverted region**, where rate constants of reactions cannot be increased further by increasing the applied overpotential.

## 2. Reaction Coordinate vs. Free Energy Plot

Let's consider a simple redox reaction involving single electron transfer and reaction coordinate *vs.* free energy plot.

$$\ce{O + e -> R} \tag{1}$$

And further assume that we can plot free energies of $O$ and $R$ on the plot, having quadratic expression like below:

$$G^{0}_{O}(q)=(k/2)(q-q_O)^2 \tag{2}$$

$$G^{0}_{R}(q)=(k/2)(q-q_R)^2+\Delta G^0 \tag{3}$$

Then we can plot $(2)$ and $(3)$ as follows.

{% include jsxgraph.html graphName="240314-marcus-0" jxgNo=0 width=300 height=300 caption="Reaction coordinate vs. free energy"%}

- $q_O$ : Coordinate of oxidized form in its most stable state.
- $q_R$ : Coordinate of reduced form in its most stable state.
- $q^\ddagger$ : Coordinate where electron transfer occurs.
- $\Delta G^\ddagger_f$ : Activation energy of forward reaction (reduction).
- $\Delta G^\ddagger_b$ : Activation energy of backward reaction (oxidization).

Take a look at the path for forward-reaction($\ce{O + e -> R}$).  Starting from its stable state($q_O$), reactant should overcome energy barrier of $\Delta G^\ddagger_f$ to get to the **transition state** ($q^\ddagger$) where actual electon transfer occurs.  After electron transfer the species, now in reduced form, proceeds to get down along the energy landscape to reach $q_R$.

To formulate activation energies of forward and backward reactions and thereby predict rate constants of those reactions, we have to calculate the coordinate of electron transfer ($q^\ddagger$) first.

$$q^\ddagger =\frac{q_R+q_O}{2}+\frac{\Delta G_0}{k(q_R-q_O)}\tag{4}$$ 

If we write $G_O(q_O)=0$, activation energy for forward reaction ($\Delta G^\ddagger_f$) can be found.

$$\Delta G^\ddagger_f=\frac{k(q_R-q_O)^2}{8}\left[1+\frac{2\Delta G_0}{k(q_R-q_O)
^2}\right]^2 \tag{5}$$

Similar sequence can be done to get the same for backward reaction ($\Delta G^\ddagger_b$).

## 3. Reorganization Energy

**Reorganization energy** is defined as follows:

$$\lambda = \frac{k}{2}(q_R-q_O)^2\tag{6}$$

With $(6)$, we can simplify $(5)$.

$$\Delta G^\ddagger_f=\frac{\lambda}{4}\left(1+\frac{\Delta G_0}{\lambda}\right)^2 \tag{7}$$

Reorganization energy is the amount of energy required to distort the reactant ($O$) from its stable state ($q_O$) to that of product ($q_R$), without allowing electron transfer at transition state.

## 4. Marcus Inverted Region

An important prediction from Marcus theory is existence of **inverted region**.  Let's examine this interesting phenomenon with an interactive plot below.

In initial state, activation energy of forward-reaction ($\Delta G^\ddagger_{f}$) is larger than that of backward-reaction ($\Delta G^\ddagger_{b}$).  What can we do to faciliate the forward reaction?  By dragging the slider up, we can simulate a situation where we increase the potential of working electrode.  This makes the free energy of the system including oxidized from ($O$) goes higher.  As expected, $\Delta G^\ddagger_{f}$ decreases and this increases the reduction rate constant.

{% include jsxgraph.html graphName="240314-marcus-1" jxgNo=1 width=300 height=300 caption="Change of $\Delta G^\ddagger_f$ by increasing free energy of $O$"%}

However, at some point of pulling up the slider $\Delta G^\ddagger_{f}$ starts to increase again.  This shows that, when we try to increase or decrease the potential of working electrode to control a reaction rate constant, we cannot limitlessly increase the reaction rate but it inevitably reaches *peak* and starts to decline again.  Such a region, where increasing potential rather starts to deter a given reaction, is called **Marcus inverted region**.