---
translated: true
title: Butler-Volmer Equation
category: electrochemistry
tags:
  - butler-volmer
  - electrode-kinetics
created_at: 2024-03-05 23:43:24 +09:00
last_modified_at: 2024-04-12 11:15:46 +09:00
random-teaser: true
excerpt: Derivation of Butler-Volmer equation from Gibbs free energy-dependent expression of rate constants.
---

## 1. Outline

In terms of kinetics theory of electrochemical reactions, **Butler-Volmer Equation** is a relation describing the extent of reaction current when the potential of working electrode is increased or decreased.  In this post we will brief how to derive this equation for simple redox reaction.

## 2. Rate Constant

It is well known experimentally that the **Arrhenius-type relation** holds for many chemical reactions.

$$ k = Ae^{-E_A/RT} \tag{1}$$

$e^{-E_A/RT}$ term is interpreted as the probability of reacting species to have enough energy to overcome the energy barrier $E_A$ at temperature $T$.  $A$ is the number of attempts the reacting species make to leap over the barrier and called **frequency factor**.  More attempts ($A\uparrow$) with smaller energy barrier ($E_A\downarrow$) leads to higher rate constant.

## 3. Reaction Coordinate *vs.* Free Energy Diagram

Keeping the expression for rate constant from previous section, now move on to an elemental electrode process: oxidized species ($\ce{O}$) and reduced species ($\ce{R}$) exchange an electron and no other reactions intervene.  For forward reaction (reduction) and backward reaction (oxidation), rate constant is given by ${k_f}$ and ${k_b}$ respectively.

$$\ce{O + e <=>[k_f][k_b] R} \tag{2}$$

By introducing a single **reaction coordinate**, along which we can display the progress of reaction from reactant to product, we can plot the change in free energy along this coordinate.

First of all, there are points where $O$ and $R$ have the lowest free energy, therefore the most stable.  Free energy increases as each species moves off from this stable point, and at a point ($A$) where free energies of two species becomes equal we can observe the reaction.

{% include jsxgraph.html graphName="240314-butlervolmer-0" jxgNo=0 width=300 height=300 caption="Reaction coordinate *vs.* free energy (1)"%}

We can think of three different cases:
1. $O$ and $R$ have same free energy in stable state.
2. $O$ has higher free energy than $R$ in stable state.
3. $R$ has higher free energy than $O$ in stable state.

In case (1) demonstrated by **Figure 1**, activation energy is same for forward and backward reactions ($\Delta G^\ddagger_{0c}=\Delta G^\ddagger_{0a}$).  If we assume the frequency factors are same for both reactions, rate constants are same for both reactions.

**Figure 2** depicts the situation for **case 2**.  In this case, free energy barrier is lower for forward reaction, and forward reaction is easier to occur.

{% include jsxgraph.html graphName="240314-butlervolmer-1" jxgNo=1 width=300 height=300 caption= "Reaction coordinate *vs.* free energy (2)"%}

This situation can be written as follows:

$$\ce{O + e <=>>[k_f][k_b] R} \tag{3}$$

**Figure 3** is the opposite case,

{% include jsxgraph.html graphName="240314-butlervolmer-2" jxgNo=2 width=300 height=300 caption="Reaction coordinate *vs.* free energy (3)" %}

and reaction equation can be written as follows:

$$\ce{O + e <<=>[k_f][k_b] R} \tag{4}$$

## 4. Derivation of Butler-Volmer Equation

Now let's derive Butler-Volmer equation.  In **Figure 4**, assume the potential of $O$ is given by <font color='red'>red dashed line</font>.  In this case, forward reaction is dominant and overall situation is same with **Figure 2**.

Consider we applies $\Delta E$ of electromotive force to move the potential of $O$ down to <font color='red'>red solid line</font>.  This alters activation free energies like $\Delta G^\ddagger_{0c} \rightarrow \Delta G^\ddagger_{c}$, $\Delta G^\ddagger_{0a} \rightarrow \Delta G^\ddagger_{a}$.

**Warning!**  Total change of free energy from potential change $\Delta E$ is given by $F\Delta E$, where $F$ is *Faraday Constant*, as free energy is a quantity for 1 mol of given species.
{: .notice--info}

Butler-Volmer equation describes how above potential change $\Delta E$ affects the free energy barrier height of forward and backward reactions, and thereby how it affects the reaction current $i$.

To get explicit form of Butler-Volmer equation, we turn to **Figure 4** again.  Observation lead us to below relations,

- $F\Delta E + \Delta G^\ddagger_{0c} = \Delta G^\ddagger_c + (1-\alpha)F\Delta E$
- $\Delta G^\ddagger_{a} + (1-\alpha)F\Delta E =  \Delta G^\ddagger_{0a}$

each of which can be rearranged as follows.

- $\Delta G^\ddagger_{0c} -\Delta G^\ddagger_c = -F\alpha\Delta E$
- $\Delta G^\ddagger_{0a} - \Delta G^\ddagger_a = (1-\alpha)F\Delta E$

{% include jsxgraph.html graphName="240314-butlervolmer-3" jxgNo=3 width=300 height=300 caption="Reaction coordinate *vs.* free energy diagram with varying electrode potential."%}

After arrangement, this is the observation.  Total potential change of $\Delta E$ contributes to change the free energy barrier of forward reaction by some fraction ($\alpha$), and remaining fraction ($1-\alpha$) constributes to that of backward reaction.

As we know how the free energy barrier changes with potential difference $\Delta E$ applied, we can get to the expression for forward and backward reaction rate constants.

Forward reaction:

$$\begin{aligned}k_f &= A_f e^{-{\Delta G^\ddagger_{c}}/{RT}}\newline
&= A_f e^{-{(\Delta G^\ddagger_{0c} - \alpha F\Delta E)}/{RT}}\newline
&= A_f e^{-\Delta G^\ddagger_{0c}/{RT}} e^{\alpha F\Delta E/{RT}}
\end{aligned}  \tag{5}
$$

Backward reaction:

$$
\begin{aligned}
k_b &= A_b e^{-{\Delta G^\ddagger_{a}}/{RT}}\newline
&= A_b e^{-(\Delta G^\ddagger_{0a} + {(1-\alpha)}F\Delta E)}\newline
&= A_b e^{-\Delta G^\ddagger_{0a}/{RT}} e^{-{(1-\alpha) F\Delta E}/{RT}}
\end{aligned} \tag{6}
$$

Now we are all ready.  When the concentrations of $O$ and $R$ are $C_O$ and $C_R$ respectively, below expression gives overall reaction current.  As we have expressions for $k_f$ and $k_b$, remaining is just plugging them into right places to complete Butler-Volmer equation.

$$ i = FA({C_O}{k_f}-{C_R}{k_b}) \tag{7} $$

But before completing, let's add some assumptions and manipulations to simplify our final equation.  A good device is defining some standard values based on equilibrium.

First of all, take a special case where $C_{O, eq} = C_{R, eq}$ and equilibrium is attained at applied potential of $E_{eq}$ in such system.  As there should be no apparent reaction current ($i=0$) if a redox system is in equilibrium, $k_f = k_b$ should hold.  So we define $k_0 = k_f = k_b$ for such case.

Now expressions for rate constants can be simplified.

$$ k_f = k_0 e^{-{\alpha F(E-E_{eq})}/{RT}} \tag{8} $$

$$ k_b = k_0 e^{-{(1-\alpha) F(E-E_{eq})}/{RT}} \tag{9} $$

Plugging $(8)$ and $(9)$ into $(7)$ finishes derivation of well-known Butler-Volmer equation.  Note that $f = F/{RT}$ was further defined for more simplification. 

$$\begin{aligned}i = &FAk_0(C_O e^{\alpha f(E-E_{eq})}\newline&- C_R e^{-(1-\alpha) f(E- E_{eq})})\end{aligned} \tag{10} $$

## 5. Transfer Coefficient

The core observation during derivation of Butler-Volmer equation was that the given potential change is distributed between free energy barrier changes of redox reactions.  The fraction of distribution $\alpha$ is called **transfer coefficient**, which is commonly considered to be independent from $\Delta E$ but determinted to be constant according to the characteristic of given chemical system.

From $\alpha$ one can infer the extent of *local variation in free energy*  along the reaction coordinate.  In detail,

- If $\alpha = 1/2$, local variation of free energy is same for $O$ and $R$.
- If $\alpha\gt 1/2$, local variation of free energy is larger for $O$.
- If $\alpha\lt 1/2$, local variation of free energy is larger for $R$.

Below is an interactive plot where you can see what happens when the local variation of free energy changes.  By pulling up(down) the slider, local free energy variation goes larger(smaller).  Try dragging and check yourself whether above cases are correct.

{% include jsxgraph.html graphName="240314-butlervolmer-4" jxgNo=4 width=300 height=300 caption="Local variation of free energy and transfer coefficient"%}