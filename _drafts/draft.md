---
created_at: 2024-04-29 21:18:45 +09:00
last_modified_at: 2024-05-30 21:49:14 +09:00
---
# 🗽

## What I have achieved

My journey in battery industry dates back to my Ph.D. course.  Back then I joined a lab in Seoul National University's Materials Science & Engineering department.  Professor Byungwoo Park was leading the lab and our lab's main focus was on energy materials - solar cells and batteries.

Actually, the main topic I was committed to was solar cells.  I have collaborated through my Ph.D. course with Professor Moonsub Shim and Dr. Joseph Flanagan from the UIUC.  The collaboration was a total package to me and along the way I learned a whole lot of things of handling international collaboration project.

Technically my field of research was to tailor the pore structure inside photoelectrode.  In brief, photoelectrode is simply a thin film made from $\ce{TiO2}$ nanoparticles.  Sutably porous structure is desired inside the photoelectrode, because it determines the amount of light absorber materials it can accomodate inside.  Dr. Flanagan's field of work was the synthesis of novel type of light absorber materials, which had relatively larger, rod-shaped one which was less accommodated in photoelectrodes with conventional pore structure.

I challenged this topic by endowing the photoelectrode a hierachically ordered pore structure.  Addition of sacirificial microbeads in the process of photoelectrode fabrication enabled me to have binomial pore structure, where large and small pores are mingled together.  Compared to conventional pore structure where small pores dominated, new pore structure could uptake more rod-type light harvesters, thereby boosting the overall power conversion efficiency (PCE).  In developing hierachical pore structure I developed pore percolation simulation using self-invented Monte-Carlo simulation code with FORTRAN.

Fortunately to me, I also had chances to be engaged in our lab's battery research.  Most of battery works I worked for was on developing olivine-type cathode materials, analyzing the electrochemical properties and microscopic morphologies with microscopy techniques.

Ph.D. Course:  Heterojunction nanorod solar cells and lithium ion batteries.  SEM, TEM and XRD characterization of synthesized materials.

Samsung Electronics - Battery Group:  I worked with battery vendors such as Samsung SDI, ATL, LISHEN to deliver battery product with required properties on time.

After working as battery engineer, I moved on to Advanced Battery Lab. and started working on machine-learning based state-of-health algorithm for mobile devices.  A problem was that the pace of our battery cell development is too fast so our team should repeatedly fine-tune the model when newly developed cell came out.

I introduced simple Arrhenius-type calibration for apparent battery resistance, and it worked to improve the accuracy of model.  Furthermore, our codebase was in its infant stage and battery data generated from variously set cycler settings existed fragmented here and there.  I elaborated to gather and cleaned up them altogether to build large internal battery cycling database.

I also found that Samsung's internal system is yet matured for future maintenance, as there was no unified format to curate battery cycling data from different equipments or operaters.  Unification could have been done by instituting basic rules applying for all operator/equipment but it could not let already produced data follow the new disciplines.  So I built for myself from scratch a Python module which is geared towards curating battery cycler data into single unified format and attached GUI supports.  GUI support substantially reduced processing time and communication loss inside our team.

Next mission was handling safety issue.  I worked on devising an recurrent neural network based model to determine whether a cell is abused in a way or not.  For this I have carried out different types of abuse test, gathered the results and did cleanup for them to be used as training dataset.

## Technical Perspectives 

- Accuracy of SOH model?
- Accuracy of RUL model?

arxiv.org/pdf/1412.6572 (이안 굿펠로우)


## Dent Prediction Model

I also developed an abuse-test failure prediction model based on 
## General Questions

### What attracted you to the position

When I searched for the details what you and your colleague are working on, I was impressed that your team is practically producing series of tangible cells designed and delivered based on data-driven approach.  Working in Samsung Electronics I have contacted several companies allegedly delivering outputs based on data-driven designs and machine learning, only little had tangible results.  It impressed me and convinced me that one works for the position could deliver their knowledge in data-driven approach, machine learning and battery industry as actual tangible product.

### Let me know your daily routine in current company

Currently I am working to improve and maintain the state-of-health estimation algorithm equipped on Samsung Mobile devices.  My role is not limited to SW implementation side.  It covers validation in cell and device level so I do extra works like designing DOEs which can possibly induce malfunction for existing algorithm and improve it.

On the other hands I work to develop battery safety prediction model and life cycle prediction model, both of which are also based on machine learning approaches.  For safety prediction model I have been developing finite element analysis model combined with machine learning.  In Samsung Electronics we have a safety test protocol called dent test and my task is to provide a framework which can predict the result of that test - the result is either the cell explodes or not at the end -.  In simplified words, I can extact some spatial strain map from dent test environment and input the map to a trained model.  The model then outputs the probability if some combination of material properties would lead to a cell can endure the test or not.

And I have also worked to develop life prediction model for lithium ion cells.  Basically I have used approach modified from that of Prof. William Cheuh and colleagues.  As an academic paper, in their report they could use cycling data from 126 different cells.  But in Samsung Electronics we could not take such an approach.  Because Samsung Develops so many different types of batteries and we can only test fixed amount of batteries before launching a smartphone model.  So rather than having a vast array of cycling data obtained from battery cells of single kind, 

### Tell me about yourself / Walk me through your resume

I received my Ph.D. in Materials Science and Engineering.  Main topic of my thesis was about tailoring the pore structure of nanoporous electrode for novel photovoltaics, but I engaged in battery research in our lab and co-authored publications on olivine-type cathode materials and lithium-air batteries.  Most of my contribution was for electrochemical and structural characterization of materials.

After graduation I joined Battery Group in Samsung Electronics, South Korea, where I have been working by now.  Right after joining I first experienced the whole process of battery industry, working with major battery providers such as Samsung Electronics in Korea, ATL in China.  I engaged in a few different battery development project which had distinct set of requirements to be met.

So after this early stage I think I got to get the full grasp of how battery industry works and moved on to develop ML-based solutions.  There were three main topics.  With teammates I have developed state-of-health estimation algorithm and it is currently being deployed to every single commercial mobile devices, except for wearble devices yet.

### How have you worked with other teams in your previous roles?

There are roughly three different categories of teams I have been working with.

First team is Samsung Research in India-Bangalore, I worked with most of time in developing core algorithms and resolving technical issues we got from the field regarding our deployed algorithm.

Second team is battery manufacturers.  Communication with them has also been always important because we need to attain battery cycling data to fine-tune our algorithm and the timeline for smartphone model has to be met.  So I have contacted them frequently, suggest better way of data acquisition to smooth the whole process.  

The last team is factory line engineers, who acutally assemble and test all the functions before shipping.  As we have implemented some factory test routine to validate our algorithm in manufacture line, we were on call to reply and handle any issue raised from the line.

### Why do you want to leave your job?

I learned a lot from Samsung Electronics, from the basic picture of the whole industry to machine-learning based approaches.  But I have always felt like contribute to bigger cause.

### Tell me about a time you found a problem and solved it at work

I have thought that as a large company Samsung Electronics would have been full of quality data and so it would be a haven for a researcher working on data-driven modeling and machine learning models.  But I only found that there was little infrastructure I can resort to.  Data was unorganized and fragmented.  Every smartphone models had separate group of engineers individually working on acquiring battery test and cycling data.  As data was not important for them once their smartphone model was launched, after launching a model data were abandoned and started to hibernate in nowhere.

So I first started to develop internal codebase which can cleanup and curate all the data obtained from different cycler setup.  I further added some GUI feature to the codebase for other engineers to readily use.  After that I found it became far productive working on ML tasks.  Currently the codebase I have built is in use for all the engineers committed to deploy state-of-health estimation model.

### What is your greatest achievement?

The state-of-health estimation solution saved a whole lot of cost for my company.  Actually, our solution worked at framework level rather than being embedded to battery pack as embedded algorithm.  Introducing embedded algorithm required extra cost for battery pack production so replacing it with our solution contributed to large save of production cost.

And I also conducted closed-loop-optimization to search for optimal charging profile, using the life prediction model I developed.  The approach was able to find optimal charging protocol 20x faster than conventional approach, and demonstrated about 11% of increased life at EOL with marginal increase in charging time.

### Where do you see yourself in 5 years time?

Currently I am working as battery engineer and I am satisfied with that.  But I believe that integration of photovoltaics with battery ESS system also would be a big thing at some time.  I hope I will be fully exercising my expertise covering energy harvesting and storage and developing kind of fully self-regenerating ESS.

### Strengths and Weaknesses


### Describe your leadership style

I believe that I should help others willingly to make them feel good working with me.  So I think I always search for the way I can help or improve others' work. 

### Do you have any questions for us?

#### Chemix Inc.

- I am curious about the business model.  It looks like your team leveraged ML approach and developed different


## References

- https://neversayneverr.tistory.com/52
- https://neversayneverr.tistory.com/108
- https://www.themuse.com/advice/behavioral-interview-questions-answers-examples
- 

As a battery R&D engineer working for mobile device manufacturer, I have deep understanding of how to work with multidisciplinary teams.

- On R&D side I have worked with Samsung Research India-Bangalore (SRI-B) team and aligned their expertise with Samsung HQ requirements in deploying battery SOH algorithms.

- On product validation side I have been closely engaged with Samsung's product reliability validation team, being in close contact around the clock to acquire battery test data (life cycle /  safety) and fine-tune SOH model based on the data.

- Finally, as the developed SOH model is being deployed to commercial device, I also have consulted line engineers to troubleshoot any issues raised regarding test protocols.


# DeepONet
---

DeepONet: Learning Nonlinear Operators for Identifying Differential Equations based on the Universal Approximation Theorem of Operators

arxiv.org/pdf/1910.03193

- Powerful result less recognized: neural network with a single hidden layer can approximate accurately any nonlinear continuous operator.

## Outline

- Universal approximation theorem
- 

## Structure of DeepONet

- Two sub-networks
	- Branch net: encode input function at a fixed number of sensors.
	- Trunk net: encode locations for the output functions.


# Technical Meeting
---

## Battery State of Health

- 

## Cycle Life Prediction



## Charging Profile Optimization


## Safety Test Simulation

An impact of what this modeling outputs is that it provides measureable indices we can resort to when we do safety-oriented battery development.  Basically, if we have a given combination of design parameters, like the thickness of metal foil substrates and active materials, we can get probability output how a cell made out of the design will respond to any given exerted force during dent test.  Using this model we could tabulate $F_{50}$ values which is a baseline force.  We can tell a cell with large $F_{50}$ is more tolerant with failure during dent test.  And for batteries with same $F_{50}$ we can order their robustness based on $\alpha$ value.  We can say lower $\alpha$ cells are more robust, because they do not have lagging tail of failure probability which implies there are tracing odds of failure even with low exerted force.

# 잡다한 것들
---
## 잘 되던 `pip`가 갑자기 안 될 때

`pip --upgrade` 이후에 발생한 현상이다.  python -m ensurepip`를 해 주면 된다.

## 커밋 히스토리 삭제

https://stackoverflow.com/questions/13716658/how-to-delete-all-commit-history-in-github

커밋이 쌓이면서 저장소 크기가 점점 커지기 때문에 적당한 시점에 이전 커밋 히스토리를 모두 제거해 줄 필요가 있다.  이 블로그는 공부용 블로그라 아무렇게나 만들고 푸시하는 커밋이 많아 쓸모없는 이력이 빨리 쌓인다.

```shell
git checkout --orphan latest_branch
git add -A
git commit -am "commit message"
git branch -D main //내 경우에는 master였다
git branch -m main //현재 브랜치 이름 변경
git push -f origin main // 오류 무시하고 원격 저장소에 푸시
```

# Lithium Ion Batteries: Literature Digest
---

[^1]: [Hard Carbon Anodes for Next-Generation Li-Ion Batteries: Review and Perspective](https://dx.doi.org/10.1002/aenm.202101650)

난흑연화성 탄소는 특정한 구조를 지칭하는 것이 아닌 특정한 범주를 묶어 지칭하는 것.

SEI 형성에 리튬을 많이 소모하기 때문에 초기 충방전에서 용량 로스가 심하다.

Generalized Carbonization Process
pyrolysis -> carbonization -> Graphitization

turbostratic 난층

평판층이 무질서하게 배열하여 아주 좁은 기공을 형성

열경화성 플라스틱으로 구분되는 것들은 열분해시 하드카본이 되고 열가소성 플라스틱으로 구분되는 것들은 열분해시 소프트카본이 된다

hard carbon -> low coulombic efficiency, large initial irreversible capacity, voltage hysteresis

The excellent structural stability of petroleum coke can be attributed to the amorphous carbon regions, which act as covalent joints to pin the graphtic layers together.

##

# GoatCounter
---

# 알골리아 서치 엔진 세팅
---

알골리아에 가입하고, `index`를 만든다.  Minimal Mistakes 기준으로는 config.yml 세팅만 해 주면 된다.

# Chirpy 스타일의 클립보드 복사기 만들기
---
- 거의 다 왔다
- JQuery 기본 사용법
- 부트스트랩

# 말해보카
---

# US
---
## SSN

입국 후 14일 후 신청 가능하며, 주소 확인을 한다 (거주지 서류가 필요).

# 자기 자신에 대한 타입 힌팅


## 파이썬 __future__ 모듈로 클래스 안에서 자기 자신 타입힌팅 하기

아래와 같이 아이스크림 클래스를 만들고, serve 메서드로 자기 자신(즉, 아이스크림 인스턴스)을 리턴하도록 했습니다.  
```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self):
    print("Have your icecream!")
    return self
```

이 때, `IceCream.serve`의 리턴 타입이 `IceCream`인 것이 분명하기 때문에, 아래와 같이 타입 힌팅을 적용하고 싶은데, 잘 되지 않습니다.
```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

이 경우, **Python 3.7** 이상을 사용하고 있다면, `__future__`의 `annotations` 모듈을 임포트하면 잘 동작합니다.
```python
from __future__ import annotations

class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

### References

1. [stackoverflow-33533148](https://stackoverflow.com/questions/33533148/how-do-i-type-hint-a-method-with-the-type-of-the-enclosing-class)

## 2. Use Self Type-Hinting using `__future__`

Consider an `IceCream` custom class as example.  `serve` method is prepared, which returns itself (an instance of `IceCream').

```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self):
    print("Have your icecream!")
    return self
```

It is obvious that `type(IceCream().serve()` return `IceCream`.  So I want to provide type hinting to manifest this.  But it does not work well with error.

```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

If you are struggling with similar issue and working with **Python 3.7** or higher, you can import `annotations` module from `__future__` to solve this.

```python
from __future__ import annotations

class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

### References
1. [stackoverflow-33533148](https://stackoverflow.com/questions/33533148/how-do-i-type-hint-a-method-with-the-type-of-the-enclosing-class)

# PINN
---

- (Paper) Meshless Physics-Informed Deep Learning Method for Three-Dimensional Solid Mechanics
	- Moreover, when explicit FEM is used for quasi-static simulations,care must be taken so that the inertia effects are insignificant.
	- Deep Collocation Method: Collocation method simply means the way to pick up many different points from simulation domain and feeding it as inputs of neural networks.
	- $\mathcal{L} = MSE_G + \lambda_u MSE_u + \lambda_t MSE_t + \lambda_i MSE_i$
	- The DNN model maps the coordinates $X$ of the sampled points to the displacement field 
- (Paper) Deep Learning in Sheet Metal Bending with a Novel Theory-Guided Deep Neural Network
- (Paper) Identification of Material Parameters from Full-Field Displacement Data Using Physics-Informed Neural Networks
- (Paper) Teaching Solid Mechanics to Artificial Intelligence - A Fast Solver for Heterogeneous Materials
	- DAMASK: Dusseldorf Advanced Material Simulation Kit
- (Paper) Feed-Forward Neural Networks for Failure Mechanics Problems
- (Paper) Physics Informed Neural Network for Dynamic Stress Prediction
- (Paper) MFLP-PINN: A Physics-Informed Neural Network for Multiaxial Fatigue Life Prediction
- FEAnalyst - PrePoMax Tutorial 30 - Nonlinear buckling of cylindrical shell
- Andreas Baer Engineering - Structural Simulation | Tensile testing | PrePoMax


# DIGEST
---

- Heating test condition is 130 Deg. limit test is being done.
- Winding, Injection, PIEF, Degas
	- PIEF: Polarization-Induced Electric Field
- 0.5C 600 cycle -> Thickness change within 8% desired
- Current density can be set low to ensure better life expectancy
- J Power Sources XG Yang (Li plating and cycle life)
- Q5 Battery Post-Mortem
	- Electrolyte: EC/PC/DEC
	- 16 J/R layers
	- 3.3 mAcm2
	- S/A overhang Top 1.5 other 0.9
	- A/C overhang Top 0.73 other 0.35
	- NP ratio 1.05
- S Atalay et al J Power Sources 2020 Lithium Plating
- 한계외력 실험하고 발화외력의 평균과 표준편차로 리스크함수 도출
	- 발화외력은 정규분포, 리스크펑션은 적분
- 


# PrePoMax
---

## FEAnalyst Tutorial

- Tutorial 43
- Tutorial 42
	- Don't we need to make compound two parts of a gear together?
	- Second order mesh
- Tutorial 41
- Tutorial 40
- Tutorial 39
	- Auxetic -> Negative poisson's ratio
- Tutorial 38
- Tutorial 37
- 

