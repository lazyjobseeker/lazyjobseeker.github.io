---
layout: posts
title: PAPERS-DIGEST
category: practice
published: false
last_modified_at: 2022-01-17 20:00:00 +0900
---


Yan Li, Xiang Liu, Li Wang, Xuning Feng, Dongsheng Ren, Yu Wu, Guiliang Xu, Languang Lu, Junxian Hou, Weifeng Zhang, Yongling Wang, Wenqian Xu, Yang Ren, Zaifa Wang, Jianyu Huang, Xiangfeng Meng, Xuebing Han, Hewu Wang, Xiangming He, Zonghai Chen, Khalil Amine, and Minggao Ouyang, Thermal Runaway Mechanism of Lithium-Ion Battery with LiNi<sub>0.8</sub>Mn<sub>0.1</sub>Co<sub>0.1</sub>O<sub>2</sub> Cathode Materials, <i><u>Nano Energy</u></i> 85, 105878 (2021).

Li <i>et al.</i>, argued that the main cause of thermal runaway failure is the reaction between cathode material and flammable electrolyte.  Their investigation utilizing synchrotron X-ray diffraction and TEM characterization revealed that oxygen species are harnessed to initiate severe exothermic reaction.

It is worth noting that 1℃s<sup>-1</sup> of temperature increasing rate during accelerating rate calorimeter (ARC) is referred to as 'critical temperature' after which the temperature increase becomes exponential.

The authors disassembled 4.2V charged pouch cell and tested specific set of components in differential scanning calorimeter experiment.  In this experiment the reaction between cathode and electrolyte resulted in sharp peak, the timing of occurrence of which well matched with the bursting exothermic reaction resulted from control thermal runaway experiment where all of the battery ingredients were tested in DSC.  From this temporal coincidence the authors concluded that the combination of cathode and electrolyte must be the triggering couple for thermal runaway failure.

This implies that current approach based on machine-learning, which presumes that the energy density itself would simply affect the number of failure cases in safety test such as dent test, may not be viable if a breakthrough in safety function for LIB cells becomes available.  But as the authors utilized some absorbents for oxygen species and such additive should be added to electrolyte or so, and such additives are more or less likely to deteriorate the performance of LiBs, it is somewhat early to prejudge that ML-based safety prediction algorithms are not likely to be useful solution.

The authors utilized an additive Tris(pentafluorophenyl)borane (TPFPB) as anion receptor.