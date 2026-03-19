---
title: "Lithium-Ion Battery Cathodes: Materials, Properties, and Degradation Behavior"
category: lithium-ion-battery
tags:
  - battery
created_at: 2026-03-17 01:46:56 -05:00
last_modified_at: 2026-03-18 11:48:08 -05:00
excerpt: A comprehensive guide to lithium-ion battery cathode materials, covering major chemistries such as LFP, NCM, and LCO, along with their properties and degradation mechanisms.
published: true
---

Cathode materials for lithium ion batteries play a critical role determining a battery cell's performance, cyclability, and safety.  This post provides a comprehensive summary of various cathode materials, their properties, and degradation mechanisms.

This post will be regularly updated reflecting state-of-art discoveries by actively reviewing scientific journal papers.

## Layered Oxide

Layered oxide cathodes are one of the most well-established types of cathode materials which have developed from the dawn of the lithium ion battery technology.

Lithium cobalt oxide ($\ce{LiCoO2}$) is the archetype falling into this category.  It has been known to exhibit high volumetric energy density, but often said expensive due to the cost of Cobalts.

In terms of lithium diffusion pathways inside the lattice, 2-dimensional planes where lithium ions can be mobile are laid between alternating slabs of transition metal oxide ($\ce{MO2}$).

Nickel and Maganese are frequently used as complementary transition metals with the same crystal structure - and it is called NMC (nickel-manganese-cobalt) layered cathode.  In such structure, addition of Ni aims to substantiate high energy density due to its multi-electron redox capability.  Contrarily, Mn mostly stays in 4+ charge state and contributes to the structural stability of the whole lattice.  The role of Co is often attributed to enhancing electronic conductivity and cation mixing suppression.

Layered oxides become unstable in its highly delitiated state.  It is due to the oxygen release from the lattice, accompanied by the phase transformation of $\ce{MO2}$ into spinel or rock-salt structure which holds less oxygen atoms per unit.

Cation mixing is often called out as one of the the most significant degradation mechanisms.  It happens when the 2D lithium diffusion pathways between $\ce{MO2}$ slabs, which lithium ions are supposed to occupy, are intruded by transition metal ions.  This issue is most severe with Nickel, as $\ce{Ni^2+}$ has the size and oxidation number most similar to $\ce{Li^2+}$.

## Spinel

This type of materials take the chemical formula of $\ce{LiM2O4}$, where M is transition metal.  These materials have three-dimensional lithium diffusion pathways in their lattice, contributing to their robust rate capability.

Spinel cathodes are relatively safer than layered cathodes due to the stronger M-O bonding which suppress oxygen release.  Also, the absence of cobalt makes them cost-effective choice.

But $\ce{Mn^3+}$ dispropotionation, the phenomenon where unstable $\ce{Mn^3+}$ converts into $\ce{Mn^4+}$ and soluble $\ce{Mn^2+}$, can degrade the cathode crystal structure leading to capacity fade.  Also, the operational voltage of LMO is limited around 3.0 to 4.2 V due to its low structural stability at high voltage.  The volumetric energy density is lower than layered cathodes as well.

Blending transition metal portion with Nickel can improve the stability at high voltage, but cation mixing can kick in again as it is for the layered cathodes.

## Olivine

This types of materials include $\ce{LiFePO_4}$ and $\ce{LiMn_xFe_{1-x}O4}$.  Compared to layered oxide cathode, LFP is far safer due to their characteristic P-O bonding in $PO_4^{3+}$ framework. So LFP is much harder to be pushed into thermal runaway, and even if triggered, it is far less violent.

Olivine type material has one-dimensional lithium diffusion channel.  This is a setback for attaining high rate capability, but often mitigated by synthesizing nanosized particulates and/or carbonaceous material coating.

LFP has lower operational voltage than layered cathode and therefore has lower energy density.  Adding Mn can increase the operational voltage, but Jahn-Teller distortion and Mn disproportionation can be triggered.  Adding Mn also complicates the synthetic process to ensure even Mn/Fe composition.

One of the most important property of olivine type cathodes is they involve phase transformation during lithium intercalation/deintercalation.  This yields voltage plateau(s) in their charging/discharging profiles, complicating SOC estimation.

