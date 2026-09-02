---
title:
  ko: "논문 리뷰 - 발견학습에 의한 배터리 수명 예측"
  en: "Paper Review - Discovery Learning for Battery Cycle Life Prediction"
tags:
  - study
created_at: 2026-09-01 11:26:22 -07:00
last_modified_at: 2026-09-02 01:19:15 -07:00
---

<!-- lang:ko -->
**Discovery Learning Predicts Battery Cycle Life from Minimal Experiments**

DOI: 10.1038/s41586-025-09951-7

Learner - Interpreter - Oracle

**Learner**는 가우시안 회귀모형이다.  Learner의 목표는 충전속도나 온도 같은 운용환경 파라미터들을 입력으로 받아서 SOH가 90%가 되는 사이클 횟수를 추정하는 것이다.

가우시안 회귀는 현재 학습 상태에서 출력에 대한 불확실성이 최대인 입력벡터를 찍어서 출력을 확인해보는 과정을 여러 번 반복하며 배우는 방식이다.  논의를 단순하게 하기 위해서 입력이 온도와 음극 리튬 확산계수 두 개 원소밖에 없는 벡터라고 해 보자.  Learner가 이 셋업에서 뭔가를 배우려면, "음극 리튬 확산계수가 x인 배터리를 상온에서 운용하면 몇 사이클에서 SOH가 90% 아래로 내려가나요?" 라는 질문에 대답해 줄 존재가 있어야 한다.  이 존재가 Oracle이다.

**Oracle**은 세계에 대한 지식이다.  제로샷 모델로, 배터리 전기화학 모델에서 쓰는 파라미터들을 입력으로 받아서, SOH가 90%가 되는 사이클을 정확히 출력하는 것을 목표로 한다.  배터리 열화는 전기화학 파라미터뿐만 아니라 운용환경의 영향 또한 받기 때문에, dual-predictor 구조를 도입하여 운용환경의 영향과 전기화학 파라미터의 영향을 구분하고자 하였다고 한다.  Supporting Information에 따르면 전기화학 파라미터의 영향을 설명하는 베이스 모델은 ElasticNet을 사용했다고 하는데, 이것은 2019년 Severson 등이 Nature Energy에 제출한 것과 같은 방식이다.  운용환경 영향을 설명하는 메타모델은 서포트 벡터 머신을 사용했다고 한다.

이제 **Interpreter**만 남았다.  이 부분은 왜 필요한지 아직 더 읽어봐야 하는데, 아무리 봐도 그냥 풀 DFN으로 충방전데이터를 피팅해서 전기화학 파라미터 뽑는게 귀찮고 힘드니까 ML 모듈 하나 더 만들어서 맡긴거다.

Learner - Interpreter - Oracle 구조를 다시 생각해 보자.  학습은 이런 식으로 진행된다.

Learner는 처음에는 멍청하기 때문에 입력벡터 도메인에서 아무거나 찍는다 (쿼리한다).  아마 Learner가 날리는 쿼리라는 건 그냥 "활물질 A를 가지고 설계 B에 따라 만든 셀을 환경 C에서 사이클링해보자" 수준일 것이다.  즉, 트리플렛 (A, B, C)를 고르는 것이다.  어쨌든 이걸 가지고 실험을 해서 50사이클 RPT는 돌려야 한다.

이제 RPT 데이터는 Interpreter로 넘어가는데, 이것은 DFN 파라미터를 얻기 위한 것이다.  Pybamm을 사용하면 전기화학 파라미터를 가지고 배터리 전압 프로파일을 얻을 수 있지만, 원하는 것은 반대 과정(실험 데이터를 가지고 전기화학 파라미터를 얻기)이기 때문에, `sbi`라는 패키지를 사용했다.  이 부분은 더 공부해야 한다.  최종적으로는, interpreter가 재구성한 인풋 파라미터 세트가 Oracle에 넘어가, 원하는 답(90%가 되는 사이클 수)을 얻게 된다.
<!-- /lang:ko -->

<!-- lang:en -->
**Discovery Learning Predicts Battery Cycle Life from Minimal Experiments**

DOI: 10.1038/s41586-025-09951-7

The **Learner** is a Gaussian process regression model. Its goal is to take operating-condition parameters, such as charging rate and temperature, as inputs and estimate the number of cycles it takes for the SOH to reach 90%.

Gaussian process regression learns by repeatedly selecting an input vector for which the current model has the greatest uncertainty about the output, querying its output, and updating itself with the result. To simplify the discussion, suppose the input is a vector with only two elements: temperature and the lithium diffusion coefficient in the negative electrode. For the Learner to learn anything in this setup, there needs to be some entity that can answer a question like:

> “If a battery with a negative-electrode lithium diffusion coefficient of xx is cycled at room temperature, after how many cycles will its SOH fall below 90%?”

That entity is the **Oracle**.

The **Oracle** represents knowledge about the world. It is a zero-shot model whose goal is to take parameters used in an electrochemical battery model as inputs and accurately predict the number of cycles until the SOH reaches 90%. Because battery degradation depends not only on electrochemical parameters but also on operating conditions, the authors introduce a dual-predictor architecture to separate the effects of operating conditions from those of electrochemical parameters. According to the Supporting Information, the base model that captures the effects of electrochemical parameters uses Elastic Net, the same type of approach used by Severson et al. in their 2019 _Nature Energy_ paper. The meta-model that accounts for the effects of operating conditions uses a support vector machine.

The **Interpreter** is left yet unexplained. I still need to read further to fully understand why this component is necessary, but so far it looks like the authors essentially introduced another ML module because fitting charge–discharge data directly with a full DFN model to extract electrochemical parameters would be cumbersome and computationally demanding.

Now let us reconsider the Learner–Interpreter–Oracle architecture. The learning process works roughly as follows.

At the beginning, the Learner is clueless, so it picks some point in the input-vector domain - that is, it makes a **query**. Presumably, a query from the Learner is something along the lines of:

> “Let’s take active material A, build a cell according to design B, and cycle it under operating condition C.”

In other words, it chooses a triplet (A,B,C). We then need to actually run the experiment and, in any case, perform RPTs through 50 cycles.

The RPT data are then passed to the **Interpreter**, whose purpose is to obtain the DFN parameters. With PyBaMM, we can take a set of electrochemical parameters and generate a battery voltage profile. What we want here, however, is the inverse process: given experimental data, infer the electrochemical parameters that could have produced them. The authors use a package called `sbi` for this purpose. This is a part I still need to study in more detail.

Finally, the input parameter set reconstructed by the Interpreter is passed to the Oracle, which provides the answer we actually want: the number of cycles until the SOH reaches 90%.
<!-- /lang:en -->