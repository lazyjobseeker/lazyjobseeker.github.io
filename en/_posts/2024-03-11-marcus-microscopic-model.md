---
revision: 1
title: Marcus Model of Electron Transfer
category: electrochemistry
tags:
  - electron-transfer
  - marcus-model
  - kinetics
created_at: 2024-03-05 11:43:24 +09:00
last_modified_at: 2024-05-06 22:57:19 +09:00
excerpt: The concept of Marcus microscopic model for isoenergetic, radiationless and configuration-preserving electron transfer is detailed.
---

## Summary

**Marcus microscopic model** explains how the kinetics of electron transfer reaction is determined.  Formulation of Marcus model is based on three crucial assumptions:

- Electron transfer is **isoenergetic**.  Therefore, it is **radiationless**
- **Configurative alteration** does **not** accompany duering electron transfer

Marcus model starts from assumption that free-energies of oxidized species ($O$) and reduced species ($R$) could both be described in quadratic form, formulating explicit equation explaining rate constants of forward- and backward-reaction.  In this process, the concept of **reorganization energy ($\lambda$)** is posed to be important.  Furthermore, the theory predicts the existence of so-called **Marcus inverted region**, where rate constants of reactions cannot be increased further by increasing the applied overpotential.

## Preliminary Concepts

In the infant stage of its development, the reacting species were thought to bump into each other by brownian motion of hard spheres.  After it further developed to consider so-called *precursor state*, which is termed to designate a coupling between 1) electrode and reacting species, or 2) oxidized and reduced species.  The former case describes *heterogeneous* reaction and the latter describes *homogeneous* case.  Any of those two coupled pair is considered to be an *unimolecular* entity, meaning that a combined free energy is assigned to the pair and any change to the free energy is regared to arise from the change in internal confirmation of an single entity. 

{% include img-gdrive alt="Homogeneous and Heterogeneous Reactions" id="1k8IkDUFKtOdfs32rCABJ-VUvWYDLilap" %}

Here the term **homogeneous** and **heterogeneous** needs to be elaborated.  Most simply, homogeneous reaction does not involves electrode but heterogeneous reaction does.  Furthermore, each kind of reaction is further divided into **outer-sphere** and **inner-sphere** reactions.  This classification is based on proximity of reacting species to each other, for outer-sphere reaction the reacting species are less intimate.  For example, in *heterogeneous outer-sphere* reaction, reacting species are a species in solution and electrode surface, and they are separated by solvent layer and not in direct contact to each other.  But in *inner-sphere* case, reacting species can get closer to the electrode surface and electon transfer occurs through some chemical bonding (ex. there is a ligand molecule briging electrode surface to reacting species).  The concept is similar for homogeneous reaction but in homogeneous case there are two different reacting species (oxidized and reduced), no electrode surface involved.

## Rate Constant

As introduced above, there are two different types of reactions - heterogeneous and homogeneous.  Before moving on further, we narrow our case to a simple reduction process of oxidized species $O$ to reduced species $R$.  And I also use a notation $K_\text{P,O}$ for the equilibrium constant of reaction between precursor state ($P$) and oxidized form ($O$).

An important conclusion deriving in formulation of rate constant is that the overall reaction rate can be written in following form, regardless of the given reaction is heterogeneous or homogeneous:

$$ k_\text{f} = k_{\text{f,pre}}K_\text{P,O} \tag{1} $$

Where $k_\text{f,pre}$ is rate constant for the reaction $\ce{O -> P}$.  Please note that our goal is deriving expression for $k_\text{f}$ which is for the reaction $\ce{O -> R}$ but now we are considering new state $P$ which exist in between.

Then we further assume that $k_\text{f,pre}$ takes well-accepted Arrhenius form, giving:

$$ k_\text{f} = K_\text{P,O}A'exp(-\Delta G_f^\ddagger / RT) \tag{2} $$

One can further refactor $A$' in **(2)** by introducing ***nuclear frequency factor*** $\nu_n$ and ***transmission coefficient*** $\kappa_\text{el}$.

With all above elaboration, remaining is to find expression for $-\Delta G_f^\ddagger$.

## Reaction Coordinate vs. Free Energy Plot

Let's consider a simple redox reaction involving single electron transfer and reaction coordinate *vs.* free energy plot.  Here we limit our consideration to *outer-sphere heterogeneous* case.

$$\ce{O + e -> R} \tag{3}$$

And further assume that we can plot free energies of $O$ and $R$ on the plot, having quadratic expression like below:

$$G^{0}_{O}(q)=(k/2)(q-q_O)^2 \tag{4}$$

$$G^{0}_{R}(q)=(k/2)(q-q_R)^2+\Delta G^0 \tag{5}$$

Then we can plot $(4)$ and $(5)$ as follows.

{% include jsxgraph.html graphName="240314-marcus-0" jxgNo=0 width=300 height=300 caption="Reaction coordinate vs. free energy"%}

- $q_O$ : Coordinate of oxidized form in its most stable state.
- $q_R$ : Coordinate of reduced form in its most stable state.
- $q^\ddagger$ : Coordinate where electron transfer occurs.
- $\Delta G^\ddagger_f$ : Activation energy of forward reaction (reduction).
- $\Delta G^\ddagger_b$ : Activation energy of backward reaction (oxidization).

Take a look at the path for forward-reaction($\ce{O + e -> R}$).  Starting from its stable state($q_O$), reactant should overcome energy barrier of $\Delta G^\ddagger_f$ to get to the **transition state** ($q^\ddagger$) where actual electon transfer occurs.  After electron transfer the species, now in reduced form, proceeds to get down along the energy landscape to reach $q_R$.

To formulate activation energies of forward and backward reactions and thereby predict rate constants of those reactions, we have to calculate the coordinate of electron transfer ($q^\ddagger$) first.

$$q^\ddagger =\frac{q_R+q_O}{2}+\frac{\Delta G_0}{k(q_R-q_O)}\tag{6}$$ 

If we write $G_O(q_O)=0$, activation energy for forward reaction ($\Delta G^\ddagger_f$) can be found.

$$\Delta G^\ddagger_f=\frac{k(q_R-q_O)^2}{8}\left[1+\frac{2\Delta G_0}{k(q_R-q_O)
^2}\right]^2 \tag{7}$$

Similar sequence can be done to get the same for backward reaction ($\Delta G^\ddagger_b$).

## Reorganization Energy

**Reorganization energy** is defined as follows:

$$\lambda = \frac{k}{2}(q_R-q_O)^2\tag{8}$$

With $(8)$, we can simplify $(7)$.

$$\Delta G^\ddagger_f=\frac{\lambda}{4}\left(1+\frac{\Delta G_0}{\lambda}\right)^2 \tag{9}$$

Reorganization energy is the amount of energy required to distort the reactant ($O$) from its stable state ($q_O$) to that of product ($q_R$), without allowing electron transfer at transition state.

## Butler-Volmer Kinetics and Marcus Theory

An important appreciation should be given to the linkage between Marcus theory and Butler-Volmer (BV) kinetics, which I will only brief here.  By plugging Gibbs free energy terms into rate constant forms like **(2)**, one can affirm that rate constants from Marcus theory leads to BV-type expression for *reaction current vs. overpotential* relation.  Most of BV kinetics' characteristic holds for its Marcus theory version.  However, an astonishing deviation from BV kinetics' expectation also comes out - the **Inverted region**.

## Marcus Inverted Region

An important prediction from Marcus theory is existence of **inverted region**.  Let's examine this interesting phenomenon with an interactive plot below.

In initial state, activation energy of forward-reaction ($\Delta G^\ddagger_{f}$) is larger than that of backward-reaction ($\Delta G^\ddagger_{b}$).  What can we do to faciliate the forward reaction?  By dragging the slider up, we can simulate a situation where we increase the potential of working electrode.  This makes the free energy of the system including oxidized from ($O$) goes higher.  As expected, $\Delta G^\ddagger_{f}$ decreases and this increases the reduction rate constant.

{% include jsxgraph.html graphName="240314-marcus-1" jxgNo=1 width=300 height=300 caption="Change of $\Delta G^\ddagger_f$ by increasing free energy of $O$"%}

However, at some point of pulling up the slider $\Delta G^\ddagger_{f}$ starts to increase again.  This shows that, when we try to increase or decrease the potential of working electrode to control a reaction rate constant, we cannot limitlessly increase the reaction rate but it inevitably reaches *peak* and starts to decline again.  Such a region, where increasing potential rather starts to deter a given reaction, is called **Marcus inverted region**.