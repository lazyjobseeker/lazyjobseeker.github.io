---
translated: true
title: "Electrochemistry by A.J.Bard - 3rd Ed Ch. 1"
category: Electrochemistry
redirect_from:
  - /electrochemistry/ajbard-electrochemistry-chapter-1/
tags:
  - Electrochemistry
published: false
created_at: 2024-02-27 00:30:11 +09:00
last_modified_at: 2024-04-02 16:25:40 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-4.png
excerpt: "Allen J. Bard의 <Electrochemical Methods: Fundamentals and Applications (3rd Ed.)> 챕터 1 정리"
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

In above cases, working electrodes are platinum and mercury, respectively.  On the Pt working electrode, hydrogen evolution reaction occurs at 0 V (vs. NHE).  However, 
에서 발생하지만 수은 작동전극의 경우 훨씬 낮은 전압에서 발생한다.  즉, 수은 작동전극을 사용한 경우에 수소발생반응을 일으키는 데 필요한 전자의 에너지가 훨씬 크다.  이것은 수소발생반응에 대한 속도상수가 수은 전극에서 훨씬 작기 때문이다.

### 전기화학 셀의 개회로전압 (Open Circuit Potential)

**개회로전압** 혹은 **개방회로전압** (Open-Circuit Potential; OCP)은 전기화학 셀의 각 전극이 외부 전도회로로 이어지지 않은 상태에서 셀 양단에 발생하는 전위차를 말한다.

#### 전기화학 셀의 개회로전압 추정

- 기본적으로, OCP는 가장 산화되기 쉬운 환원종(reduced form)의 산화 발생하기 시작하는 전위와 가장 환원되기 쉬운 산화종(oxidized form)의 환원이 발생하는 전위 사이에 존재한다.
- 전해액에 오직 산화종(oxidized form)만 존재하는 경우, OCP는 배경산화전류가 발생하기 시작하는 전위와 가장 환원되기 쉬운 산화종의 환원반응이 시작되는 전위 사이에 존재한다.
- 전해액에 오직 환원종(reduced form)만 존재하는 경우, OCP는 배경환원전류가 발생하기 시작하는 전위와 가장 산화되기 쉬운 환원종의 산화반응이 시작되는 전위 사이에 존재한다.

### 패러데이 과정과 비-패러데이 과정

계면에서의 전하 이동을 수반하는 전극 반응을 **패러데이 과정(Faradaic Process)**, 그렇지 않은 경우 **비패러데이 과정(Nonfaradaic Process)**이라고 한다.

### 이상분극전극과 이상비분극전극

실제 패러데이 과정이 발생하는 전위가 열역학적으로 예상되는 평형 전위로부터 벗어나는 것을 **분극(polarization)**이라고 하고, 열역학적 평형 전위와 실제 전극과정 전위 사이의 차이를 **과전위(overpotential)**라고 한다.

즉, 분극이 큰 전극일수록 과전위가 크게 측정된다.

이러한 관점에서, 분극을 일으키는 것이 무한히 쉬운 전극을 **이상분극전극(Ideally Polarizable Electrode; IPE)**이라고 한다.  즉, IPE는 아주 약간의 전극 반응에도 큰 과전위가 발생하는 전극이다.  $i$-$E$ 곡선을 그려 보면, 아주 약간의 환원전류만 흘러도 (-)방향의 과전위가 크게 발생하고, 아주 약간의 산화전류만 흘러도 (+)방향의 과전위가 크게 발생하기 때문에, 넓은 전위 영역에서 전류가 0인 것처럼 보인다.

반대로, 분극을 일으키는 것이 무한히 어려운 전극을 **이상비분극전극(Ideally Nonpolarizable Electrode; INE)**라고 한다.  이러한 전극은 전극반응에 의한 산화전류 혹은 환원전류의 크기가 아주 커지지 않는 한 평형에서 벗어나지 않는다.  즉, $i$-$E$ 곡선을 그려 보면, 넓은 전류 영역에서 항상 동일한 반응 전위를 유지하는 것처럼 보인다.
