---
created_at: 2024-04-29 21:18:45 +09:00
last_modified_at: 2024-05-09 00:31:31 +09:00
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

## Dent Prediction Model

I also developed an abuse-test failure prediction model based on 
## General Questions

- What attracted you to the position.
- Let me know your daily routine in current company.
- Tell me about yourself (walk me through your resume)
	- I have worked for 5 years and currently working as Battery Engineer in Samsung Mobile.  Before joining in to industry I got my Ph.D. degree in Seoul National university.  My main thesis concerned with the utilization of novel type of light harversters for solar cells and I delved into the internal structure of porous electrode used to uptake as many light harvesting nanorods as possible.
	- During this period my research topic also covered characterization and analysis of battery materials.  I engaged in our lab's endeavor to develop high-performance olivine-type cathode materials, carrying out morphological and electrochemical characterizations.
	- After graduation I joined Battery Group of Samsung Electronics, Korea.  Before setting about modeling and ML algorithm development works, in the first year I experienced battery cell development process and engaged with battery vendor companies, Samsung SDI in Korea and
- How have you worked with other teams in your previous roles?
- Tell me about a time you found a problem and solved it at work.
- Why do you want to work at this company?
- Why do you want to leave your job?
- What is your greatest achievement?
- Where do you see yourself in 5 years time?
- Strength?
- Weaknesses?
- Describe your leadership style.

## 내가 하고 싶은 질문


## 참고자료

- https://neversayneverr.tistory.com/52
- https://neversayneverr.tistory.com/108
- https://www.themuse.com/advice/behavioral-interview-questions-answers-examples
- 



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