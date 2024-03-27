---
lang: en
translated: true
toc: true
toc_sticky: true
title: Pourbaix Diagrams
category: Electrochemistry
tags:
  - electron
  - transfer
  - Marcus
  - model
  - kinetics
published: true
created_at: 2024-03-15 09:24:59 +09:00
last_modified_at: 2024-03-27 01:10:09 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-2.png
excerpt: How to interpret Pourbaix diagram or potential-pH diagram, with step-by-step instruction to draw ones for water and iron system.
---

## 1. Pourbaix Diagram

Potential-pH diagrams or **Pourbaix diagrams** are specific types of graphs representing thermodynamic equilibrium conditions of reduction-oxidation reactions.  Having pH on $x$-axis andf potential on $y$-axis, Pourbaix diagram divides potential-pH landscape into multiple sections, to each section of which we can assign predominant chemical species.

### 1.1. Redox Reactions

Oxidation-reduction reaction is basically a process of oxidized species ($\ce{O}$) receiving some protons ($q\ce{H+}$) or electrons (+$n\ce{e}$) to yield reduced species ($\ce{R}$) and *vice versa*.  So we can write down generalized redox reaction equation as follows:

$$\ce{O + qH+ + ne <=> R \tag{1}}$$

### 1.2. Nernst Equation

**Nernst equation** expresses the deviation of reaction potential $E$ from its standard cell potential $E^0$ using the activities of redox species and their stoichiometric coefficients. 

Derivation of Nernst equation for $(1)$ starts from Gibbs-free energy expression given below.

$$\Delta G = \Delta G^0 + RT\frac{a_\text{R}}{a_\text{O}a^q_\ce{H+}} \tag{2}$$

And now we can use $\Delta G = -nFE$, $\Delta G^0 = -nFE^0$ to get $(3)$.  This is the Nernst equation for reaction $(1)$.

$$E = E^0 + \frac{qRT}{nF}\ln{\frac{a_\ce{O}a_\ce{H+}}{a_\ce{R}}} \tag{3}$$

Separating pH term from above equation leads to equation $(4)$ below:

$$E = E^0 - 0.059 \left( \frac{q}{n} \right) \left(\text{pH}-\log{\frac{a_\ce{O}}{a_\ce{R}}} \right) \tag{4}$$

Now, for the given system, Pourbaix diagram can be constructed using $(4)$.  In many cases, activities of species except for $\ce{H+}$ and $\ce{OH-}$ are regarded to be unity.  Therefore, equation $(4)$ further shrinks down to following form: 

$$E = E^0 - 0.059 \left( \frac{q}{n} \right) \text{pH} \tag{5}$$

Let's move on to actually drawing Pourbaix diagrams of some systems.  For the most cases we can rely on $(5)$, but sometimes we will resort to other chemical constants like reaction-specific solubility product constant $K_\text{sp}$

**Warning!**  Formulation for Nernst equation involves **natural logarithm**, while pH is given using **common logarithm**.  Therefore, relation $\ln{x} = (\log x/\log e) = 2.303\log(x)$ was used to rearrange $(3)$ into $(4)$.
{: .notice--warning}

## 2. Pourbaix Diagram of Water

Pourbaix diagram for water is where on can easily start from.  There are four species involved:  $\ce{H2O}$, $\ce{H2}$, $\ce{O2}$, and $\ce{H+}$

First of all, equation for reduction reaction is as follows:

$$\ce{H+ + e- <=> 1/2H2} \newline (E^0 = \text{0.0V vs. NHE}) \tag{6}$$

Nernst equatio for above reaction is given by:

$$E = 0.0 - 0.059\text{pH} \tag{7}$$

Secondly, equation for oxidation reaction and Nernst equation are like:

$$\ce{O2 + 4H+ + 4e- <=> 2H2O} \newline (E^0 =\text{1.229V vs. NHE}) \tag{8}$$

$$E = 1.229 - 0.059\text{pH} \tag{9}$$

For future convenience, let's call equations like $(7)$ and $(9)$ the **equlibrium lines**.  Pourbaix diagram is completed by drawing all the equilibrium lines on the potential-pH coordinate.

{% include jsxgraph.html graphName="240315-pourbaix-0" jxgNo=0 width=300 height=300 caption="Pourbaix diagram of water"%}

Each section of above Pourbaix diagram is assigned to $\ce{O2}$, $\ce{H2O}$, $\ce{H2}$ from the top, designating the species which is the most stable in the region. Note that lower potential means higher energy for electrons supplied from working electrode.  Electrons with higher energy have more power to reduce adjacent species and, therefore, region of high potential (larger $y$ values) is dominated by more oxidized species and *vice versa*.

## 3. Pourbaix Diagram of Iron

Revisiting equation $(5)$ we can observe a trend: the more(less) protons(electrons) involved, the slope of given equilibrium line increases.

$$E = E^0 - 0.059 \left( \frac{q}{n} \right)\text{pH}$$

However, more complex system could also include horizontal/vertical lines rather than slanted lines as given by equation $(5)$.  The most frequently visited example is Pourbaix diagram of iron.

Before starting to work on detailed reactions, observe below diagram.  Every single equilibrium lines we would consider are shown in this diagram.

{% include jsxgraph.html graphName="240315-pourbaix-1" jxgNo=1 width=300 height=300 caption="Equilibrium lines for iron system"%}

Keep in mind there are horizontal/vertical lines also, differently from Pourbaix diagram of water.  From next section we will brief in which case such equilibrium lines occur and how to place them on potential-pH coordinate.

### 3.1. Proton-Free Reactions (Horizontal Lines)

Consider equation $(5)$ but the case where proton is not involved ($q=0$).  Equation $(5)$ collapsed down to $y=k$ form in such case, yielding horizontal line passing standard cell potential.

$$E = E^0 - 0.059(q/n)\text{pH} \tag{9} = E^0$$

In above **Figure 2**, there are two horizontal equilibrium lines.  See both reaction equations do not involve proton transfer.

$$\ce{Fe^2+ + 2e <=> Fe} \newline (E^0 = \text{-0.44V vs. NHE}) \tag{A, 11}$$

$$\ce{Fe^3+ + e <=> Fe^2+} \newline (E^0 = \text{0.77V vs. NHE}) \tag{B, 12}$$

### 3.2. Electron-Free Reactions (Vertical Lines)

There are two other reactions where **electrons** are not involved.  One of both is precipitation of $\ce{Fe3+}$ into $\ce{Fe(OH)3}$

$$
\begin{aligned}
\ce{Fe^3+ + 3H2O &<=>\newline
&Fe(OH)3 + 3H+} \tag{C, 13}
\end{aligned}
$$

As proton-free reactions defined horizontal lines, it is natural to infer that electron-free reactions will define vertical equilibrium lines.  A tricky point is that we do not rely on equation $(5)$ any more.  The pH value where vertical line will be drawn is directly calculated using solubility product constant ($K_\text{sp}$) of $\ce{Fe(OH)3}$ and ion-product constant of water ($K_\text{w}$).

$$K_\text{sp}=a_\ce{Fe^3+}a^3_\ce{OH-}=4×10^{-38} \tag{14}$$

$$K_\text{w} = a_\ce{H+} a_\ce{OH-} = 10^{-14} \tag{15}$$


By setting $a_\ce{Fe^{3+}}=1$, we have:

$$
\begin{aligned}
\text{pH}
&=-\log a_\ce{H+}\newline
&=-\log \left( 10^{-14}×\left(4×10^{-38}\right)^{-1/3} \right)\newline
&= 1.53\newline
\end{aligned}
\tag{16}
$$

Therefore, $\text{pH} = 1.53$ is the vertical equilibrium line for reaction $(13)$.

On the other hands, $\ce{Fe^{2+}}$ also precipitates to $\ce{Fe(OH)2}$ by following reaction:

$$\ce{Fe(OH)2 <=> Fe^{2+} + 2OH-} \tag{D, 17}$$

This reaction also is vertical line where electron transfer is not involved, and target pH can be found by similar process using $K_\text{sp} = 1.6×10^{-15}$ and $K_\text{w}$.  Calculation confirms $\text{pH} = 6.6$ to be the equilibrium line we seek for reaction $(17)$.

### 3.3. Placing Remaining Equilibrium Lines

With horizontal and vertical equilibrium lines drawn, now we are to locate remaining equilibrium lines normally given by equation $(5)$.  One of the remaining reactions is:

$$\ce{Fe(OH)3 + 3H+ + e <=> Fe^{2+} + 3H2O} \tag{E, 18}$$

Equilibriu line for this reaction, referring to $(5)$, is given as follows.

$$E = E^0 - 3×0.059\text{pH} \tag{19}$$

For this equilibrium line, we know its slope but $E^0$ value is unknown.  However, still we can locate this line on E-pH coordinate.  We know that on the line defined by $(19)$ there are $\ce{Fe^{2+}}$ and $\ce{Fe(OH)3}$ already in equilibrium, and simultaneous existence of $\ce{Fe^{3+}}$ can only be achieved only on single point because of the **Gibbs phase rule**.  Inspecting horizontal and vertical lines we already drew, it derives that $(19)$ must pass $(1.53, 0.77)$ where equilibrium line **A** and **C** intersects.

Two more equilibrium lines can be drawn with same approach.

$$\ce{Fe(OH)3 + H+ + e <=> Fe(OH)2 + H2O \tag{F, 20}}$$

$$\ce{Fe(OH)2 + 2H+ + 2e <=> Fe + 2H2O \tag{G, 21}}$$

After completing all the possible equilibrium lines, we can make only some segments remain, finishing the Pourbaix diagram of iron finally.

{% include jsxgraph.html graphName="240315-pourbaix-2" jxgNo=2 width=300 height=300 caption="Pourbaix Diagram of Iron"%}