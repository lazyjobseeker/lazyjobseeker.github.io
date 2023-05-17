---
layout: posts
title: Week 04, 2022
category: Diary
tag: Battery
published: false
last_modified_at: 2022-01-23 20:59:00 +2044
---

Yan Li, Xiang Liu, Li Wang, Xuning Feng, Dongsheng Ren, Yu Wu, Guiliang Xu, Languang Lu, Junxian Hou, Weifeng Zhang, Yongling Wang, Wenqian Xu, Yang Ren, Zaifa Wang, Jianyu Huang, Xiangfeng Meng, Xuebing Han, Hewu Wang, Xiangming He, Zonghai Chen, Khalil Amine, and Minggao Ouyang
Thermal Runaway Mechanism of Lithium-Ion Battery with LiNi<sub>0.8</sub>Mn<sub>0.1</sub>Co<sub>0.1</sub>O<sub>2</sub> Cathode Materials
<i><u>Nano Energy</u></i> 85, 105878 (2021).

Li <i>et al.</i>, argued that the main cause of thermal runaway failure is the reaction between cathode material and flammable electrolyte.  Their investigation utilizing synchrotron X-ray diffraction and TEM characterization revealed that oxygen species are harnessed to initiate severe exothermic reaction.

It is worth noting that 1℃s<sup>-1</sup> of temperature increasing rate during accelerating rate calorimeter (ARC) is referred to as 'critical temperature' after which the temperature increase becomes exponential.

The authors disassembled 4.2V charged pouch cell and tested specific set of components in differential scanning calorimeter experiment.  In this experiment the reaction between cathode and electrolyte resulted in sharp peak, the timing of occurrence of which well matched with the bursting exothermic reaction resulted from control thermal runaway experiment where all of the battery ingredients were tested in DSC.  From this temporal coincidence the authors concluded that the combination of cathode and electrolyte must be the triggering couple for thermal runaway failure.

This implies that current approach based on machine-learning, which presumes that the energy density itself would simply affect the number of failure cases in safety test such as dent test, may not be viable if a breakthrough in safety function for LIB cells becomes available.  But as the authors utilized some absorbents for oxygen species and such additive should be added to electrolyte or so, and such additives are more or less likely to deteriorate the performance of LiBs, it is somewhat early to prejudge that ML-based safety prediction algorithms are not likely to be useful solution.

The authors utilized an additive Tris(pentafluorophenyl)borane (TPFPB) as anion receptor.  TPFPB works to absorb oxygen species to delay the onset timing of significant exothermal reaction.  Further research is needed to check whether in literature there are other reports related to the function of TPFPB anion receptor working as thermal runaway inhibitor.

***

Kai Liu, Yayuan Liu, Dingchang Lin, Allen Pei, and Yi Cui
Materials for Lithium-Ion Battery Safety
<i><u>Science Advances</u></i> 4, eaas9820 (2018).

Liu <i>et al.</i> brief the stages of progress in thermal runway event and summarize the material-based approach to properly manage the thermal runaway-triggering events, classifying them based on the three categories (stages) of thermal runaway events.  According to the authors the thermal runaway is first triggered by overheating, which can be initiated by the formation of connection between cathode and anode electrode which is unexpectedly occurs by separator penetration, external short circuit or so.  Unwantedly released and accumulated in the battery cells, the heats cause SEI layers to decompose by exothermic reaction, which in turn accumulate more heats and self-accelerate the auto-heating inside the cell.  Heat accumulation further drives anode-electrolyte reaction releasing more flammable gases, eventually leading to separater meltdown and causing cathode-anode short circuit.  The final stage of such catastrophe is the decomposition of cathode material, which is fatal as it is due to the exothermic nature of decomposition reaction but further deteriorates the situation by releasing oxygen gas.  Finally the combustion reaction starts, causing fire or explosion accident.

With the perspective on thermal runaway accident described above, the reported approaches to alleviate thermal-runaway triggering events are reviwed:

First of all, the battery cell/pack should not be allowed to reach the onset stage of overheating.  The authors state that lithium dendrite formation is likely to triggering event of this onset, and brief some existing approaches: reducing nonuniformity of SEI to lower uneven local current distribution, additive control, protective layer coating or so.

Secondly, multi-functional electrolytes and/or separators can be adopted to deal with active material decomposition and separator meltdown problem.  `shear-thickneing` electrolytes are reported to be effective in withstand against crusing impact energy.  Separators functionalized by inserting thin metallic layer inside can provide voltage sensing function and capture abnormal voltage drop caused by the dendrites touching it
