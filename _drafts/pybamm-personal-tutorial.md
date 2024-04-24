---
title: 파이밤(PyBaMM)으로 배터리 모델링하기
category: machine-learning
tags:
  - machine-learning
  - bayesian
created_at: 2024-04-19 20:13:37 +09:00
last_modified_at: 2024-04-24 23:01:49 +09:00
excerpt: How to calibrate confidence intervals from bayesian deep regressors to cohere with observations.
---

## PyBaMM

`PyBaMM`은 **Python** 기반의 오픈소스 배터리 모델링 및 시뮬레이션 패키지입니다.  [공식 홈 페이지](https://pybamm.org/)를 통해 매뉴얼 및 예제들을 다양하게 제공하고 있고, API 문서화가 잘 이루어져 있으며 지속적으로 업데이트가 이루어지고 있고 사용자 토론 및 개발자 답변도 활발한 편입니다.  **Comsol Multiphysics**등의 전문 소프트웨어를 유료 라이센싱하여 배터리 모델링을 사용할 수 없는 경우 충분한 대안이 될 수 있을 것으로 기대됩니다.

`pip`를 이용해 즉시 설치할 수 있습니다.

```
pip install pybamm
```

## 내장 모델을 이용한 시뮬레이션

### 기본 시뮬레이션

가장 간단하게는 개발자들이 사전에 구성해 둔 모델들을 이용하여 배터리 시뮬레이션을 수행해볼 수 있습니다.  아래의 코드는 도일-풀러-뉴먼(Doyle-Fuller-Newman; DFN) 모델을 이용한 배터리의 방전 시뮬레이션을 위한 코드입니다.  Chen(2020)[^1] 논문에서 공개된 파라미터 세트를 이용하여 시뮬레이션을 수행합니다. 

[^1]: [C.-H. Chen *et al.*, "Development of Experimental Techniques for Parametrization of Multi-Scale Lithium-Ion Battery Models", *J. Electrochem. Soc.*, **167**, 080534 (2020).](https://dx.doi.org/10.1149/1945-7111/ab9050)

```python
import pybamm

# Load built-in DFN model
model = pybamm.lithium_ion.DFN()

# Load built-in DFN parameter set from Chen(2020)
parameter_values = pybamm.ParameterValues("Chen2020")

# Execute simulation with specified parameter set
sim = pybamm.Simulation(model, parameter_values=parameter_values)
sim.solve([0, 3600])
sim.plot()
```

시뮬레이션 실행이 완료되면 아래와 같은 `matplotlib` 그래프 패널 형태로 결과를 확인할 수 있습니다.

{% include img-gdrive alt="PyBaMM simulation result" id="1vHuNtEIGm2H3-3tnzZ_B9ISfZ87qClCs" %}

`sim.solve([0, 3600])` 메서드를 실행할 때 전달하는 `[0, 3600]`은 시뮬레이션을 수행할 시간 구간이며 초 단위로 주어집니다.  이외에는 아무 조건도 지정해 주지 않았는데, 코드 실행 결과 약 4V 정도까지 충전된 배터리를 3600초 동안 5A의 전류로 방전 실험을 진행한 그래프를 얻었습니다.

이런 결과를 얻은 이유는 `parameter_values`에 지정되어 있는 기본 파라미터 정보들을 사용하였기 때문입니다.

위 코드에서 사용된 `parameter_values`는 `PyBaMM`의 내장 클래스인 `ParameterValues` 객체입니다.  배터리 모델에 사용되는 파라미터의 명칭 및 값 정보들을 가지고 있습니다.  `search` 메서드를 지원하는데, 문자열을 인자로 넘기면 해당 문자열이 이름에 포함되어 있는 파라미터들을 찾아 줍니다.

```python
parameter_values.search("Current")

>>> Current function [A]    5.0
Negative current collector conductivity [S.m-1] 58411000.0
Negative current collector density [kg.m-3]     8960.0
Negative current collector specific heat capacity [J.kg-1.K-1]  385.0
Negative current collector thermal conductivity [W.m-1.K-1]     401.0
Negative current collector thickness [m]        1.2e-05
Negative electrode exchange-current density [A.m-2]     <function graphite_LGM50_electrolyte_exchange_current_density_Chen2020 at 0x000001D064F6E7A0>
Positive current collector conductivity [S.m-1] 36914000.0
Positive current collector density [kg.m-3]     2700.0
Positive current collector specific heat capacity [J.kg-1.K-1]  897.0
Positive current collector thermal conductivity [W.m-1.K-1]     237.0
Positive current collector thickness [m]        1.6e-05
Positive electrode exchange-current density [A.m-2]     <function nmc_LGM50_electrolyte_exchange_current_density_Chen2020 at 0x000001D064F6E3B0>
SEI reaction exchange current density [A.m-2]   1.5e-0
```



### 상수 파라미터 변경하기

상수형 파라미터를 변경하는 것은 간단합니다.  그냥 숫자만 바꾸어 주면 됩니다.

### 함수 파라미터 변경하기

함수 형태로 주어지는 파라미터들도 있습니다.  예를 들어, 양극소재의 개회로전압을 나타내는 `Positive electrode OCP [V]`는 Chen(2020)에서 분석된 배터리 양극(NCM 811)의 물성을 반영하는 함수입니다.

```python
def nmc_LGM50_ocp_Chen2020(sto):
    """
    LG M50 NMC open-circuit potential as a function of stochiometry, fit taken
    from [1].

    References
    ----------
    .. [1] Chang-Hui Chen, Ferran Brosa Planella, Kieran O’Regan, Dominika Gastol, W.
    Dhammika Widanage, and Emma Kendrick. "Development of Experimental Techniques for
    Parameterization of Multi-scale Lithium-ion Battery Models." Journal of the
    Electrochemical Society 167 (2020): 080534.

    Parameters
    ----------
    sto: :class:`pybamm.Symbol`
        Electrode stochiometry

    Returns
    -------
    :class:`pybamm.Symbol`
        Open-circuit potential
    """

    u_eq = (
        -0.8090 * sto
        + 4.4875
        - 0.0428 * np.tanh(18.5138 * (sto - 0.5542))
        - 17.7326 * np.tanh(15.7890 * (sto - 0.3117))
        + 17.5842 * np.tanh(15.9308 * (sto - 0.3120))
    )

    return u_eq
```
{: file='Chen2020.py'}

새로운 함수를 정의하여 이러한 함수 파라미터들 역시 변경해줄 수 있습니다.  배터리 4대소재의 변경에 따라 자유롭게 함수 파라미터를 변경하고 시뮬레이션을 수행할 수 있습니다.

아래의 예시는 LFP 양극의 OCP를 Li(2021)[^2]의 작업을 참고하여 변경해 본 것입니다.

[^2]: [J. Li, M. Zhao, C. Dai, Z. Wang, and M. Pecht, "A Mathematical Method for Open-Circuit Potential Curve Aquisition for Lithium-Ion Batteries", *J. Electroanal. Chem.*, **895**, 115488 (2021).](https://dx.doi.org/10.1016/j.jelechem.2021.115488)

```python
import numpy as np

def ncm_ocp_Li2021(sto):

    u_eq = (
        4.065
        - 0.2076 * np.tanh((sto - 0.4)/0.06264))
        - 0.06572 * np.tanh((sto - 0.572)/0.04231)
        - 0.01478 * np.tanh((sto - 0.745)/0.09524)
        + 0.002814 * np.tanh((sto - 0.4445)/0.01732)
        + 0.006405 * np.tanh((sto - 0.58)/0.02347)
        - 0.0728 * np.tanh((sto - 0.96)/0.06714)
        - 0.341 * np.exp(223.8 * (sto - 0.999))
        + 0.004366 * np.tanh((sto - 0.803)/0.02835)
        - 0.005707 * np.tanh((sto - 0.972)/0.01034)
        + 0.01604 * np.exp(-((sto - 0.9927)/0.003936)**2)
        + 0.001 * (-2.529 * np.tanh((sto - 0.7)/0.08168) - 0.55)
    )

    return u_eq
```

이제 이 함수를 이용하여 `Positive electrode OCP [V]` 파라미터를 업데이트하고 시뮬레이션을 수행할 수 있습니다.

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