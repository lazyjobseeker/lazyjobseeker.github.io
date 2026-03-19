---
title: "Lithium-Ion Battery Anodes: Materials, Properties, and Degradation Behavior"
category: electrochemistry
tags:
  - battery
created_at: 2026-03-18 10:37:48 -05:00
last_modified_at: 2026-03-19 11:52:14 -05:00
excerpt: A comprehensive guide to lithium-ion battery anode materials, covering major chemistries with their properties and degradation mechanisms.
published: true
---
In lithium-ion batteries, anode materials serve as the lithium host during charging.  It is often confusing to understand towards which side of the cell the lithium ions flow, but can be understood intuitively once we think of the configuration cathode or anode materials would energetically prefer.  As charging is the process of storing energy in the cell, lithium ions should behave in the way building up structural instability in the active materials.  So it triggers lithium ions diffuse out of the cathode materials - as they are synthesized to have lithium ions inside their lattice already and pulling them out of the lattice makes the material unstable and therefore energized.  On the contrary, anode materials are prepared to be stable when they contain lithium as little as possible.  For example, lithium ion should diffuse into the layers of graphite anode by building up mechanical strength and disturbing charge balance.

This post provides a comprehensive summary of various anode materials, their properties, and degradation mechanisms.  The contents will be updated regularly.

## Graphite

Graphite is the most widely used anode material in lithium ion batteries.  It takes advantage of its superior stability, cycle life, and cost-effectiveness.  Structurally, graphite consists of layered graphene sheets.  Lithium ions can intercalate in between these alternating layers during charging, where the reaction is:

$$\ce{C6 + xLi^+ + e^- <-> Li_xC6}$$

Theoretical capacity of graphite is 372 mAh/g and it operates with a voltage down to around 0.1V vs. $\ce{Li/Li^+}$.  The major challenges of graphite include the risk of lithium plating which exacerbates under fast charging or low-temperature condition.

Formation of solid-electrolyte interphase (SEI) layer also contributes to the loss of lithium inventory and capacity fading.  Lithium plating can occur when the anode potentil drops below 0 vs. Li, which is the condition often met during high-rate charging and/or at low-temperatures.  Particle cracking is generally minor issue compared to Si anodes, whose lithium storage mechanism is alloying than intercalation reaction.

## Silicon Anodes

As an alloying-type anode material, silicon anodes promise an unmatched high theoretical capacity.  The alloying reaction is:

$$\ce{Si + xLi + $x$e^- <-> Li_xSi}$$

But this advantage of high theoretical capacity is accompanied by huge volume expansion amounting to around 300%.  This induces mechanical stress building up, resulting cracking and pulverization of particles, as the cycling continues and volume expansion and contraction repeat.

Despite these difficulties, silicon is often combined with graphite or engineered as nanoparticles or coated structures to mitigate volume expansion and improve cycle life, but standalone silicon anodes are still limited in commercial applications due to their poor long-term stability.

## Silicon-Graphite Composite

Silicon-graphite composites aim to combine the high capacity of silicon with the stability of graphite. In these anodes, silicon nanoparticles are embedded in a graphite matrix, which buffers volume changes and maintains electrical connectivity. The composite shows intermediate capacity, higher than pure graphite but lower than pure silicon, while significantly improving cycle life compared to silicon alone. Nevertheless, the silicon component still contributes to mechanical degradation and repeated SEI formation, so the electrode must be carefully engineered with optimized particle size, binder, and coating strategies.

## Lithium Titanate (LTO)

Lithium titanate($\ce{Li4Ti5O12}$) is a zero-strain anode with a spinel structure.  It is associated with virtually no volue change during lithiation:

$$\ce{Li4Ti5O12 + 3Li + 3e- <-> Li7Ti5O12}$$

LTO operates at a relatively high voltage and has a moderate capacity.  Due to its volume expansion free feature, it excels in cycling durability.  Fast charging capability and neglibile risk of lithium plating makes it an ideal anode for high-power and long-life applications.  Its primary limitations include lower energy density due to high operating voltage and material costs.

### Lithium Metal

Lithium metal anodes offer the highest theoretical capacity (3860 mAh/g) and the lowest operating potential (~0 V vs Li/Li⁺), making them extremely attractive for next-generation high-energy batteries.  Lithium metal stores lithium through deposition/stripping rather than intercalation.  However, it suffers from severe safety and performance challenges.

Uneven lithium deposition leads to dendrite formation, which can penetrate the separator and cause short circuits.  Plating and stripping also produce “dead lithium,” reducing coulombic efficiency and accelerating capacity loss.  Moreover, the SEI layer is highly unstable and continuously reforms during cycling.
