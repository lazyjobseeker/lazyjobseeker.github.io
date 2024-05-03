---
title: 파이밤(PyBaMM)으로 배터리 모델링하기
category: machine-learning
tags:
  - machine-learning
  - bayesian
created_at: 2024-04-19 20:13:37 +09:00
last_modified_at: 2024-05-03 13:41:59 +09:00
excerpt: 배터리 모델링 오픈소스 PyBaMM 소개 및 사용 방법 정리
---

## 파라미터 변경 예제

### 브루그먼 상수

브루그먼 상수는 다공성 구조를 지닌 매질의 수송 특성을 다룰 때 중요하게 다루어지는 상수입니다.

```python
import pybamm
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt

num_graphs = 11
cmap = mpl.colormaps["viridis"]
colors = cmap(np.linspace(0, 1, num_graphs))

model = pybamm.lithium_ion.DFN()
parameter_values = pybamm.ParameterValues("Chen2020")

for idx, bruggeman in enumerate(np.linspace(0, 2.4, num_graphs)):
	parameter_values['Negative electrode Bruggeman coefficient (electrolyte)'] = bruggeman
	sim = pybamm.Simulation(model, parameter_values=parameter_values)
	sim.solve([0, 3600])
	solution = sim.solution
	Q = solution['Discharge capacity [A.h]'].entries
	V = solution['Voltage [V]'].entries
	plt.plot(Q, V, color=colors[idx], label=f"{np.round(bruggeman,2)}")

plt.show()
```

## 사이클 특성 시뮬레이션 예제[^3]

[^3]: [S.E.J. O'Kane *et al.*, "Lithium-Ion Battery Degradation: How to Model It", *Phys. Chem. Chem. Phys.* **24**, 7909 (2022)](https://dx.doi.org/10.1039/d2cp00417h)

```python
import pybamm
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

pybamm.set_logging_level("NOTICE")
paramter_values = pybamm.ParameterValues("OKane2022")
# pick parameters
parameter_values.update({"Ambient temperature [K]": 268.15})
parameter_values.update({"Upper voltage cut-off [V]": 4.21})
# parameter_values.update({"Lithium plating kinetic rate constant [m.s-1]": 1e-9})
parameter_values.update({"Lithium plating transfer coefficient": 0.5})
parameter_values.update({"Dead lithium decay constant [s-1]": 1e-4})
# Calculate stoichiometries at 100% SOC
options = {
	"lithium plating": "irreversible"
}
model = pybamm.lithium_ion.DFN(options)

N_cycles = 10

s = pybamm.step.string
experiment = pybamm.Experiment(
	[
		(
			s("Discharge at C/20 until 2.5V", period="10 minutes"),
			s("Rest for 1 hour", period="3 minutes"),
			s("Charge at 0.5C until 4.2V"),
			s("Hold at 4.2V until C/50")
		),
	] * N_cycles,
)

sim = pybamm.Simulation(model, experiment=experiment, parameter_values=parameter_values)
sol = sim.solve()

Q = solution['Discharge Capacity [A.h]'].entries
V = solution['Voltage [V]'].entries

plt.plot(Q, V)
plt.show()
```
