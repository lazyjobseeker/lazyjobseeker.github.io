---
title: 파이밤(PyBaMM)으로 배터리 모델링하기 (1)
category: lithium-ion-battery
tags:
  - battery
  - modelling
created_at: 2024-05-03 14:36:07 +09:00
last_modified_at: 2024-05-06 09:05:05 +09:00
excerpt: 배터리 모델링 오픈소스 PyBaMM 소개 및 사용 방법 정리
---

## PyBaMM

`PyBaMM`은 **Python** 기반의 오픈소스 배터리 모델링 및 시뮬레이션 패키지입니다.  [**공식 홈 페이지**](https://pybamm.org/)를 통해 매뉴얼 및 예제들을 다양하게 제공하고 있고, API 문서화가 잘 이루어져 있으며 지속적으로 업데이트가 이루어지고 있고 사용자 토론 및 개발자 답변도 활발한 편입니다.  **Comsol Multiphysics**등의 전문 소프트웨어를 유료 라이센싱하여 배터리 모델링을 사용할 수 없는 경우 충분한 대안이 될 수 있을 것으로 기대됩니다.

`pip`를 이용해 즉시 설치할 수 있습니다.

```
pip install pybamm
```

## 내장 모델을 이용한 시뮬레이션

### 정전류 방전 및 충전

가장 간단하게는 패키지에 내장된 사전 구성 모델을 이용해 시뮬레이션을 수행할 수 있습니다.  아래의 코드는 도일-풀러-뉴먼(Doyle-Fuller-Newman; DFN) 모델을 이용한 배터리의 방전 시뮬레이션을 위한 코드입니다.  Chen(2020)[^1] 논문에서 공개된 파라미터 세트를 이용하여 시뮬레이션을 수행합니다. 

[^1]: [C.-H. Chen *et al.*, "Development of Experimental Techniques for Parametrization of Multi-Scale Lithium-Ion Battery Models", *J. Electrochem. Soc.*, **167**, 080534 (2020).](https://dx.doi.org/10.1149/1945-7111/ab9050)

```python
# Import package
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

위의 코드는 0초 - 3600초 (1시간) 동안 5A의 방전 전류로 정전류 방전 시뮬레이션을 수행합니다.  실행이 완료되면 아래와 같은 `matplotlib` 그래프 패널 형태로 결과를 확인할 수 있습니다.

{% include img-gdrive alt="PyBaMM simulation result" id="1vHuNtEIGm2H3-3tnzZ_B9ISfZ87qClCs" %}

방전 전류를 별도로 설정하지 않았는데 5A 방전 전류가 자동으로 적용되어 있는 것은 Chen(2020)의 기본 파라미터 세트에 해당 내용이 포함되어 있기때문입니다.  `parameter_values`는 PyBaMM 내장 클래스인 `ParameterValues` 객체로 배터리 모델에 사용되는 파라미터 명칭 및 값 정보들을 가지고 있습니다.  `search` 메서드를 제공하여, 문자열을 인자로 넘기면 해당 문자열이 이름에 포함되어 있는 파라미터들과 그값들을 찾아 줍니다.

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

"Current" 라는 문자열을 검색했을 때 `Current function [A]`라는 아이템이 있는 것을 확인할 수 있는데, 별도의 시험 시나리오를 지정해 주지 않으면 이 값을 이용하여 정전류 방전을 수행하게 됩니다.  방전 전류를 (+)로 기준잡기 때문에 충전 시나리오를 테스트하려면 음수 값을 넣어 주어야 합니다.

또한 `initial_soc` 파라미터를 별도로 지정하지 않으면 파라미터 세트에 있는 리튬이온 농도를 그대로 사용하는데, `Chen2020` 파라미터 세트는 만충전에 까운 상태를 기준으로 세팅되어 있습니다.

충전 상태를 시뮬레이션하려면, 예를 들어 아래와 같이 할 수 있습니다.

```python
import pybamm

model = pybamm.lithium_ion.DFN()
parameter_values = pybamm.ParameterValues("Chen2020")
parameter_values['Current function [A]'] = -5
sim = pybamm.Simulation(model, parameter_values=parameter_values)
sim.solve([0,3600], initial_soc=0)
sim.plot()
```

위 코드를 실행하면, 아래와 같이 됩니다.

{% include img-gdrive alt="5A 충전 시뮬레이션" id="1wiUgt-0ai0ZsOz9PvlynDyHBzAhotOk8" %}

### 커스텀 충방전 시퀀스 작성하기

충방전 시퀀스를 작성하여 사용할 수도 있는데, 거의 자연어로 명령하는 것에 가까운 포맷으로 `Experiment` 객체를 작성해줍니다.  아래는 0.05C로 2.75V까지 방전 후 1시간 동안 휴지한 뒤 MSCCCV (Multi-Step CC-CV) 프로파일을 적용하는 예시입니다.

```python
experiment = pybamm.Experiment(
    [
        (
            "Discharge at C/20 for 40 hours or until 2.75V",
            "Rest for 1 hour",
            "Charge at 3A until 3.7 V",
            "Charge at 2A until 3.9 V",
            "Charge at 1A until 4.2 V",
            "Hold at 4.2V until 0.02C",
            "Rest for 1 hour",
        ),
    ]
)
```

`Experiment` 객체를 사용하기 위해서는 `Simulation` 객체를 만들 때 `experiment` 인자로 넘겨 주면 됩니다.

```python
import pybamm

model = pybamm.lithium_ion.DFN()
parameter_values = pybamm.ParameterValues("Chen2020")
parameter_values['Current function [A]'] = -5
sim = pybamm.Simulation(model,
					    parameter_values=parameter_values,
					    experiment=experiment)
sim.solve(initial_soc=0)
sim.plot()
```

`solve`를 호출할 때 시뮬레이션 시간을 명시했던 `[0, 3600]`를 빼 주었습니다.  `experiment` 객체의 내용에 어떤 충전/방전을 어느 시간 및 종지 조건에 따라 진행할지 모두 명시되어 있기 때문에 시뮬레이션 시간의 별도 명시가 불필요합니다.

{% include img-gdrive alt="커스텀 MSCCCV 충전 시뮬레이션" id="10S6rRFknVNArj2JdHmlA2jBpEowrLcrr" %}

### 사이클 시험 시뮬레이션하기

여러 사이클을 반복 수행하는 `사이클 모사` 역시 가능합니다.  SEI층 형성에 따른 용량 감소를 모사해 보도록 하겠습니다.

앞서와 동일하게 Chen(2020)의 파라미터 세트를 이용하도록 하겠습니다.  DFN 모델에서 `SEI` 옵션을 제공하여 SEI 형성 메커니즘을 지정해 줄 수 있습니다.

```python
import pybamm
import numpy as np
import matplotlib.pyplot as plt

model = pybamm.lithium_ion.DFN(
    {"SEI": "solvent-diffusion limited"}
)
parameter_values = pybamm.ParameterValues("Chen2020")
```

사이클 진행은 두 가지 종류의 서로 다른 프로파일을 사용하도록 하겠습니다.  우선 `probe_experiment`는 만충전 전압 4.2V에 충전 종지전류 0.01C로 충전 후 0.5A로 2.5V까지 방전하여 정격 방전용량을 확인합니다.

```python
probe_experiment = pybamm.Experiment(
    [
        (
            "Charge at 1 A until 4.2V",
            "Hold at 4.2V until 0.01C",
            "Rest for 4 hours",
            "Discharge at 0.5A until 2.5V",
        )
    ]
)
```

다음으로 `cycle_experiment`는 고속으로 충방전을 진행하여 배터리 열화를 가속하는 프로파일입니다.

```python
cycle_experiment = pybamm.Experiment(
    [
        (
            "Charge at 1.5A until 4.2V",
            "Discharge at 5A until 2.5V",
        )
    ]
)
```

`Simulation` 객체에서 `solve` 메서드를 호출하면 시뮬레이션 결과를 포함하는 결과물이 `Solution` 객체로 반환됩니다.  `solve` 과정에서 수행된 각 `Experiment`는 내부에 루프를 포함하지 않는 한 1회의 사이클로 취급됩니다.  다만 내부에 루프가 포함되어 있다면 루프 횟수만큼 개별 사이클을 진행하는 것으로 계산됩니다.  예를 들어 설명해 보겠습니다.

아래와 같이 짜여진 `Experiment` 객체의 경우, 충전-방전을 2회 수행하여 직관적으로는 2번의 다른 사이클을 진행한 것처럼 생각할 수 있지만 `PyBaMM`에서는 1사이클로 취급합니다.

```python
pybamm.Experiment(
    [
        (
            "Charge at 1.5A until 4.2V",
            "Discharge at 5A until 2.5V",
            "Charge at 1.5A until 4.2V",
            "Discharge at 5A until 2.5V",
        )
    ]
)
```

아래의 정의는 위의 정의와 동일하지만 2번의 루프를 수행하도록 되어 있어, 충전-방전을 한 사이클로 2사이클의 시뮬레이션을 수행한 것처럼 처리됩니다.

```python
pybamm.Experiment(
    [
        (
            "Charge at 1.5A until 4.2V",
            "Discharge at 5A until 2.5V",
        )
    ] * 2
)
```

`solve`를 수행할 때 `starting_solution` 인자에 이전 `solve` 결과로 얻은 `Solution` 객체를 넘겨 주면 초기 상태에서 시뮬레이션을 시작하는 대신 기존 시뮬레이션 결과로 얻어진 내부 변수들을 유지한 상태로 다음 시뮬레이션을 계속 수행할 수 있습니다.  이 경우 갱신되는 `Solution` 객체에는 이전 단계들에서의 시뮬레이션 수행 결과들이 모두 누적되어 저장됩니다.

`Solution` 객체를 전달받았을 때 방전 용량을 계산하는 함수를 작성해 주겠습니다.  `Solution` 객체는 이전 사이클들의 시뮬레이션 수행 결과를 포함하는 `cycles` 리스트를 가지고 있습니다.  이 리스트의 원소들은 역시 모두 `Solution` 객체이며, 지금까지 수행된 시뮬레이션 결과들을 각 사이클 별로 가지고 있습니다.

어떤 `Solution` 객체는 수행된 `Experiment`를 구성하는 각 지시문에 대한 결과를 `steps` 리스트에 나누어 저장하고 있습니다.  따라서 `probe_experiment`의 경우 4개 스텝으로 이루어져 있으며 방전 구간은 네 번째 원소이므로 `steps[3]`, `cycle_experiment`의 경우 2개 스텝으로 이루어져 있으며 방전 구간은 두 번째 원소이므로 `steps[1]`과 같이 접근할 수 있습니다.

방전 구간에 대한 용량(총 방전용량)을 구하는 함수를 따라서 다음과 같이 작성하도록 하겠습니다.

```python
def get_probe_dchg_cap(solution: pybamm.Solution):
    dchgcaps = solution.cycles[-1].steps[3]["Discharge capacity [A.h]"].entries
    return dchgcaps[-1] - dchgcaps[0]

def get_cycle_dchg_cap(solution: pybamm.Solution):
    dchgcaps = solution.cycles[-1].steps[1]["Discharge capacity [A.h]"].entries
    return dchgcaps[-1] - dchgcaps[0]
```

이제 사이클 테스트를 수행하고 사이클에 따른 방전용량 그래프를 그려 보도록 하겠습니다.  `cycle_experiment`는 한 번에 연속으로 50회 수행하고, 사이사이에 `probe_experiment`를 수행하여 정격 용량을 중간중간 확인하는 일반적인 사이클 테스트 방식입니다.

```python
N = 10
M = 100

probe_sols = []
probe_cycs = []
probe_caps = []

cycle_sols = []
cycle_cycs = []
cycle_caps = []

curr_cycle = 1
print(f'Cycle - {curr_cycle}')
sim = pybamm.Simulation(model,
                        parameter_values = parameter_values,
                        experiment = probe_experiment)
probe_sol = sim.solve()
probe_sols.append(probe_sol)
probe_caps.append(get_probe_dchg_cap(probe_sol))
probe_cycs.append(curr_cycle)
start_sol = probe_sol
curr_cycle += 1

for i in range(N):
    for j in range(M):
        sim = pybamm.Simulation(model,
                                parameter_values = parameter_values,
                                experiment = cycle_experiment)
        cycle_sol = sim.solve(starting_solution = start_sol)
        cycle_sols.append(cycle_sol)
        cycle_caps.append(get_cycle_dchg_cap(cycle_sol))
        cycle_cycs.append(curr_cycle)
        print(f'Cycle - {curr_cycle}')
        curr_cycle += 1
        start_sol = cycle_sol

    sim = pybamm.Simulation(model,
                            parameter_values = parameter_values,
                            experiment = probe_experiment)
    probe_sol = sim.solve(starting_solution = start_sol)
    probe_sols.append(probe_sol)
    probe_caps.append(get_probe_dchg_cap(probe_sol))
    probe_cycs.append(curr_cycle)
    start_sol = probe_sol
    curr_cycle += 1

plt.scatter(cycle_cycs, cycle_caps)
plt.scatter(probe_cycs, probe_caps)
plt.show()
```

{% include img-gdrive alt="1000-사이클-테스트" id="1p2y28UNy3l92yo43sG4Rd-Vvg8fqRBxF" %}

### 커스텀 파라미터 사용하기

상수형 파라미터를 변경하는 것은 간단합니다.  그냥 숫자만 바꾸어 주면 됩니다.

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
         - 0.8090 * sto
         + 4.4875
         - 0.0428 * np.tanh(18.5138 * (sto - 0.5542))
         - 17.7326 * np.tanh(15.7890 * (sto - 0.3117))
         + 17.5842 * np.tanh(15.9308 * (sto - 0.3120))
    )

    return u_eq
```
{: file='Chen2020.py'}

새로운 함수를 정의하여 이러한 함수 파라미터들 역시 변경해줄 수 있습니다.  배터리 4대소재의 변경에 따라 자유롭게 함수 파라미터를 변경하고 시뮬레이션을 수행할 수 있습니다.

아래의 예시는 NCM 양극의 OCP를 Li(2021)[^2]의 작업을 참고하여 변경해 본 것입니다.

[^2]: [J. Li, M. Zhao, C. Dai, Z. Wang, and M. Pecht, "A Mathematical Method for Open-Circuit Potential Curve Aquisition for Lithium-Ion Batteries", *J. Electroanal. Chem.*, **895**, 115488 (2021).](https://dx.doi.org/10.1016/j.jelechem.2021.115488)

```python
import numpy as np

def ncm_ocp_Li2021(sto):

    u_eq = (
        4.065
        - 0.2076 * np.tanh((sto - 0.4)/0.06264)
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

```python
model = pybamm.lithium_ion.DFN()
parameter_values = pybamm.ParameterValues("Chen2020")
parameter_values['Positive electrode OCP [V]'] = ncm_ocp_Li2021

sim = pybamm.Simulation(model, parameter_values=parameter_values)
sim.solve([0, 3600])
sim.plot()
```

{% include img-gdrive alt="커스텀 OCP 함수 적용하기" id="1PsJYMeFhUa2sp01m-qBw5Y71zw8Kkemd" %}