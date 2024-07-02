---
title: Battery Modeling with PyBaMM (1)
category: lithium-ion-battery
tags:
  - battery
  - modelling
created_at: 2024-05-03 14:37:54 +09:00
last_modified_at: 2024-05-06 09:06:28 +09:00
excerpt: How to use open-source battery modeling package PyBaMM
---

## PyBaMM

`PyBaMM` is an open-source library dedicated to battery modeling and simulation.   [**Official Web Site**](https://pybamm.org/) abounds with step-by-step guides, tutorials, and thorough API documentations.  Update and discussion are also active.  If you are in search of alternative battery modeling software other than licensing established softwares such as Comsol Multiphysics, Ansys Fluent or so, `PyBaMM` could be an alternative to some extent.

You can install `PyBaMM` directly using `pip`

```
pip install pybamm
```

## Simulation with Built-In Model

### Constant Current Discharge / Charge

Simplest form of example simulation can be done using built-in preset models.  Below code conducts discharge simulation with Doyle-Fuller-Newman(DFN) model, based on the cell parameters referred from  Chen(2020)[^1].

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

This code carries out 3600 sec (1 hr) duration of discharge test.  Discharge current is 5A constant-current.  After conduction, a `matplotlib` plot pops up summaryzing simulation results in an interactive plot.

{% include img-gdrive alt="PyBaMM simulation result" id="1vHuNtEIGm2H3-3tnzZ_B9ISfZ87qClCs" %}

You can see that discharge current is set 5A while you gave no input about it.  This setting is included in `parameter_values`.  `parameter-values` here is an object of `ParamterValues`, which contains whole parameter names and values inside it.  `search` method is supported for this class for user to search and enumerate the list of parameters including specific string in parameter name.

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

Passing a string "Current" to `search` method outputs above result, among which you can see `Current function [A]` item.  If no specific experimental scenario is set, this value is used for simulation.  As the convention in `PyBaMM` is assigning positive sign for discharge current, you have to set negative value for this item to carry out charging simulation.

For example, set like this to do charging test.  Note that I passed `initial_soc` value 0 in calling `solve` method.  Meaningful result will not output without this because basic parameters of Chen2020 supposes almost full-charged state of battery as initial state.

```python
import pybamm

model = pybamm.lithium_ion.DFN()
parameter_values = pybamm.ParameterValues("Chen2020")
parameter_values['Current Function[A]'] = -5
sim = pybamm.simulation(model, parameter_values=parameter_values)
sim.solve([0,3600], initial_soc=0)
sim.plot()
```

You can get charging simulation result by running above code.

{% include img-gdrive alt="5A Charging Simulation" id="1wiUgt-0ai0ZsOz9PvlynDyHBzAhotOk8" %}

### Writing Down Custom Experiment

Rather than setting constant current value, you can also design more complex charging/discharging profiles geared towards your own purpose of test.  For this, you need to create `Experiment` object and fill the experimental details.  A cool point in writing down the sequence in `PyBaMM` is that it is closer to *writing down* what you want than filling in tables as it does when you handle battery cyclers. 

Below I wrote an example.  First part is to discharge a battery down to 2.75V and CC current was set C/20 C-rate.  20 hrs is do to discharge 1C amount of charge but I intendedly set discharging time to 40 hrs as I wanted the discharge test not to terminate before it reached 2.75V.  Charging profile is kind of 3-step MSCCCV (multi-step CC-CV).

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

to use custom-written `Experiment` object, pass it as `experiment` argument in creating `Simulation` object.

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

Note that `[0, 3600]` argument used in `solve` method call is removed.  As `experiment` object contains full detail of our wanted test, we do not need to manifest simulation time anymore.

{% include img-gdrive alt="Custom charging simulation" id="10S6rRFknVNArj2JdHmlA2jBpEowrLcrr" %}

### Cycle Life Test

**Life cycle simulation** also is possible.  Let's try simulating capacity fade arising from SEI layer formation, using Chen(2020) parameters as same.  As default DFN model of `PyBaMM` does not activate SEI formation submodel, you need to manifest that submodel when calling DFN model.

```python
import pybamm
import numpy as np
import matplotlib.pyplot as plt

model = pybamm.lithium_ion.DFN(
    {"SEI": "solvent-diffusion limited"}
)
parameter_values = pybamm.ParameterValues("Chen2020")
```

For cycle life test, I will define two different types of charging/discharging profile.  `probe_experiment` pattern first charges a cell with 1A CC current and terminates when the cell reaches 4.2V and charging current diminishes to reach 0.01C.  Discharging down to 2.5V with 0.5A discharging current follows.  I would say this pattern is to check **Rated Capacity** of a cell or standadized capacity metric.

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

On the other hands, `cycle_experiment` test defines a profile with faster charge and discharge sessions.  This profile is used multiple times between regular performance check done by `probe_experiment`, and designed to accelerate battery degradation.

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

When you call `solve` method with a `Simulation` object, `Solution` object is returned and it contains the result states and output data from the simulation.  And each `Experiment` is, unless it contains loop inside its definition, considered to yield result for single cycle.

For example, below experiment is, once simulated, considered as 1 cycle even though its description looks like containing two separate cycles. 

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

However, if your experiment contains internal loop, each loop contribute to separate cycle.

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

You can also preserve the last state of your simulation and pass it as initial condition for next simulation.  To do this you pass `starting_solution` additional argument in using `solve`.  `starting_solution` parameter can accept `Solution` object which outputs from other `solve` calls.  If you use `starting_solution` option, result of old simulation is not lost but new simulation result is added as outputs for additional cycle(s).

Now move on to handle raw values from solution outputs.  If you conducted multiple cycles of simulation, your `Solution` object returned from `solve` call contains simulation results for all those multiple cycles and they are all stored in `cycles` list attribute of final `Solution` object.  Elements of `cycles` attribute are `Solution` objects also, but containing outputs from single cycle for each.

Let's see another example before move on.  Below setting of simulation defines 10-cycle running test.

```python
sim = pybamm.Simulation(model,
                        parameter_values = parameter_values,
                        experiment = pybamm.Experiment(
                            [
                                (
                                 "Charge at 1.5A until 4.2V",
                                 "Discharge at 5A until 2.5V",
                                )
                            ] * 10
                        )

solution = sim.solve()

cyc_10_sol = solution.cycles[-1] # This returns Solution object of the 10th cycle.
```

For a `Solution` object storing outputs from single cycle experiment, you can access to another list attribute `step` to access to individual **step data**.  For example, in above code experiment was 10-cycle long and each cycle comprised of 2 steps.  If I access to the first element of `steps` of `cyc_10_sol`, as follows,

```python
cyc_10_sol.steps[0]
```

I am accessing to outputs but confining my scope to the first step ("Charge at 1.5A until 4.2V").

After accessing to step-level output you can use some preset key names to read any raw data given `PyBaMM` simulation result offers.  Below is defining functions to calculate discharge capacity for the last cycle simulation when a `Solution` with all previous simulation results packed up is passed as argument.

```python
def get_probe_dchg_cap(solution: pybamm.Solution):
    dchgcaps = solution.cycles[-1].steps[3]["Discharge capacity [A.h]"].entries
    return dchgcaps[-1] - dchgcaps[0]

def get_cycle_dchg_cap(solution: pybamm.Solution):
    dchgcaps = solution.cycles[-1].steps[1]["Discharge capacity [A.h]"].entries
    return dchgcaps[-1] - dchgcaps[0]
```

Now I write down long cycle test and draw cycle retention graph.  After standardized rated capacity check with `probe_experiment`, 50 iterations of `cycle_experiment`s follows, and these sequence repeats to reach total 511 cycles.

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

{% include img-gdrive alt="1000-cycle-test" id="1p2y28UNy3l92yo43sG4Rd-Vvg8fqRBxF" %}

### Using Customized Parameters

You can also tune the model parameters at will.  Maybe you have different material set for your battery modeling and want to use different values.

For constant parameters it is easy enough.  As we've done above to change `Current function [A]`, you can directly access to the variable by the parameter name as key and modify the parameter value. 

If you want to use function-type parameters, you need to define your own function and pass it as parameter value.  For example, default parameter from Chen(2020) is what the authors fitted for cathode material (NCM 811).

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

When you see the raw code as above, you can find that this is just a custom function defined with aid of `numpy`.  You can freely define your own and replace existing parameter function.

Below I found some different fitted function applicable for NCM cathode material, based on work of Li(2021)[^2]

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

I can use this function to run my NCM battery model.  But for sure we need to be careful because adjusting a battery model does not limits to modifying cathode OCP only but all other related properties should be appropriately modified.


```python
model = pybamm.lithium_ion.DFN()
parameter_values = pybamm.ParameterValues("Chen2020")
parameter_values['Positive electrode OCP [V]'] = ncm_ocp_Li2021

sim = pybamm.Simulation(model, parameter_values=parameter_values)
sim.solve([0, 3600])
sim.plot()
```

{% include img-gdrive alt="커스텀 OCP 함수 적용하기" id="1PsJYMeFhUa2sp01m-qBw5Y71zw8Kkemd" %}