---
translated: true
title: "Electrochemistry by A.J.Bard - 3rd Ed Ch. 1"
category: electrochemistry
tags:
  - electrochemistry
created_at: 2024-02-27 00:30:11 +09:00
last_modified_at: 2024-04-12 10:56:47 +09:00
random-teaser: true
excerpt: "Summary of the contents of chapter 1 of <Electrochemical Methods: Fundamentals and Applications (3rd Ed.)> by A. J. Bard."
---

## Electrode Process

Experimentally it is not possible to separate single interface from system.  We can only handle a **electrochemical cell** comprised of mutiple interfaces.

### Notation for Electrochemical Cell

- Slash(/) indicates *phase boundary*.
- If two or more components exist within single phase, use comma(,) to separate the components.

$$\ce{Zn/Zn^2,Cl-/AgCl/Ag}$$

- Gaseous phases are written on the side of adjacent conductor phase.

$$\ce{Pt/H2/H+,Cl-/AgCl/Ag}$$

### Difference of Interfacial Potential and Cell Potential

**Cell potential** is the capability of electrochemical cell to work and can be calculated by summing up all the interfacial potential exist along the conduction path inside a cell.

Passing phase boundary accompanies abrupt potential change, meaning there is strong electric field there.  Hence, there are large difference in energy of electrons, which controls the direction and rate of electron transfer.

### Working Electrode and Reference Electrode

**Working electrode** is the electrode an electrochemist want to analyze.  To facilitate the analysis, it is paired with **Reference electrode** which is designed to have consistent interfacial potential difference regardless of externally applied potential.

Having a working electrode - reference electrode pair, there is a fixed potential difference at the interface in reference electrode side and this difference can be calculated based on Nernst equation.  Therefore, if we apply some potential difference from external source, this *change* can be wholly assigned to working electrode.

If potential of working electrode is increased to (-) side, electrons in working electrode obtain higher energy.  Sufficiently energetic electrons can transit to vacant electronic levels in electrolyte to reduce it, yielding **reductive current**.  On the way back, (+) side increase of potential can contribute to **oxidative current**

### Several Reference Electrodes

#### Standard Hydrogen Electrode (SHE/NHE)

Cell notation for standard(normal) hydrogen electrode looks like:

$$\ce{Pt/H2(a=1)/H+(a=1, aq)}$$

#### Standard Calomel Electrode (SCE)

Cell notation for standard calomel electrode looks like:

$$\ce{Hg/Hg2Cl2/KCl(saturated in water)}$$

At 25 deg., cell potential of SCE is +0.244 V compared with NHE.

#### Ag/AgCl Electrode

Cell notation for Ag/AgCl electrode looks like:

$$\ce{Ag/AgCl/KCl(saturated in water)}$$

At 25 deg., cell potential of SCE is +0.197 V compared with NHE.

### Background Current *vs.* Potential Curve

Analysis on background $i$-$E$ curve must precede to the analysis of specific redox reaction from a electrochemical cell.  Continuously increasing the potential of working electrode to -(+) side leads to abrupt increase of unwanted reductive(oxidative) current at some point.  As such rise of background current obscures reaction current from redox reaction in concern, it must be guaranteed that a redox reaction in concern is located somewhere in the middle of the points where those unwanted currents dominate.

### Choice of Working Electrode and Overpotential

Consider below two kinds of electrochemical cells:

$$\ce{Pt/H^+(1 M),Br^-(1 M)/AgBr/Ag}$$

$$\ce{Hg/H^+(1 M),Br^-(1 M)/AgBr/Ag}$$

In above cases, working electrodes are platinum and mercury, respectively.  On the Pt working electrode, hydrogen evolution reaction occurs at 0 V (vs. NHE).  However, if mecury is chosen as working electrode, far lower (negatively larger) potential or far larger electronic energy is required to drive the same reaction.  This is because of the kinetics: reaction rate for hydrogen evolution reaction is much slower with Hg electrode. 

### Open Circuit Potential

**Open-Circuit Potential** or **OCP** indicates the potential difference between electrodes in a electrochemical cell when the external conduction path is not applied.

#### Locating OCP of Electrochemical Cell

- Basically, OCP is located between the potential at which the easiest-to-be-oxidized species starts to oxidize and the potential at which the easiest-to-be-reduced species starts to reduce.
- If an electrolyte is comprised only of the oxidized forms, OCP is located between the potential at which the background oxidative current onsets and the potential where the easiest-to-be-reduced species starts to reduce.
- If an electrolyte is comprised only of the reduced forms, OCP is located between the potential at which the background reductive current onsets and the potential where the easiest-to-be-oxidized species starts to oxidize.

### Faradaic and Nonfaradaic Process

If an electrode reaction accompanies with charge transfer at interface, the reaction is called **Faradaic Process**.  If not, it is called **Non-Faradaic Process**

### Ideally Polarizable and Ideally Nonpolarizable Electrodes

It is called **polarization** if the potential for an electrode reaction deviates from its expected value from themodynamic estimation.  And the extent of such descrepancy is called **overpotential**.  Therefore, if higher polarization level is involved with an electrode, larger overpotential is expected.

In such perspective, it is called **Ideally Polarizable Electrode** or **IPE** if an electrode is unlimitedly easy to be polarized.  It means that IPE shows large overpotential even with infinitesimally small amount of reactions proceeding.  On $i$-$E$ plot, graph for IPE has $y = constant$ form.

On the other hand, **Ideally Nonpolarizable Electrode** or **INE** is an electrode which is infinitely difficult to deviate from themodynamically expected reaction potential.  Potential of such electrode cannot off from its thermodynamic equilibrium value unless sufficiently huge mass of reactants participate in reaction at once.  This makes $i$-$E$ curve of INE have $x = constant$ form.