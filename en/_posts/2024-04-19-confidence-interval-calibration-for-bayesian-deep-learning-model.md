---
title: Confidence Interval Calibration for Bayesian Regressor
category: machine-learning
tags:
  - machine-learning
  - bayesian
created_at: 2024-04-19 20:13:37 +09:00
last_modified_at: 2024-04-21 21:19:44 +09:00
excerpt: How to calibrate confidence intervals from bayesian deep regressors to cohere with observations.
---

## Bayesian Deep-Learning Regressor

**Bayesian Deep-Learning Regression Model** is a deep learning model trained to give output as **distribution** rather than single fixed scalar.  If we suppose that output variable converges to normal distribution, this should mean that for a given input vector $x$ a model $H$ will give output $y$ as distribution for which we can assign its mean ($m_x$) and standard deviation ($\sigma _x$).

In such settings, it is natural to consider a **confidence interval (CI)** for such distribution, which leads to our topic today or the concept of a **calibrated forecaster**.

## Calibrated Forecaster

Kulshov, Fenner, and Ermon[^1] mentioned the concept of **calibrated forecaster** in their publication in 2018.  According to their formulation, a forecaster $H$ - in this post we can think $H$ is a bayesian deep regressior - which satisfies below condition is called **calibrated**.

[^1]: [V. Kuleshove, N. Fenner, and S. Ermon, *Accurate Uncertainties for Deep Learning Using Calibrated Regression*, arXiv](arxiv.org/pdf/1807.00263.pdf)

For dataset $\mathcal{S}=\lbrace{(x_t, y_t)}\rbrace _{t=1}^T$,

$$\frac{\sum _{t=1}^{T}\Bbb{I}\lbrace y_t\le F_t^{-1}(p)\rbrace}{T}\rightarrow p\quad\forall p \in \lbrack0,1\rbrack\tag{1}$$

In above equation, $F_t^{-1}$ is a function that if a nonnegative value $p\le1$ is passed, returns value $y$ for which the integral of disribution function $H(x_t)\sim N(m_{x_t}, \sigma_{x_t})$ on $\lbrack -\infty, y\rbrack$ yields $p$.

On the other hand, $F_t(y)$ stands for the cumulative distribution function (CDF) for forecasted distribution $H(x_t)\sim N(m_{x_t}, \sigma_{x_t})$.  As the notation $F_t(y)$ is a bit obscure to manifes that the CDF comes from forecaster $H$, it can be written as $\lbrack H(x_t)\rbrack(y)$ to clarify that point.

Even though our everyday concept of confidence interval is not found from above condition (intergral of forecasted distribution function $H(x_t)$ on domain $\lbrack m_x-y, m_x+y\rbrack$  needs to be considered), it is evident that any discussion starting from **Equation 1** can be extended readily to our everyday notion of confidence interval.  So discussion of Kuleshov et al., proceeds based on **Equation 1** as above.

## Farmer's Expectation

To elaborate the meaning of **Equation 1** let's consider an example.  We are farmers proficient with data science and machine learning.  We have a bayesian deep regressor $H$ forecasting given year's yield based on an input vector comprised of some variables such as amount of railfall and sunlight.

{% include img-gdrive alt="Bayesian Deep-Learning Regression Forecaster (1)" id="1GOjJS8CqVWmw42bCms61iIvFhjvjirtF" %}

We would be pretty happy if $H$ give us expected distribution of yield $N(m_x, \sigma_x)$ and we find actual yield of the year turns out to be $m_x$ always, but in general this should not be the case.  But as our model output is probability distribution rather than fixed scholar, we can try to draw confidence interval for some probability $p$, 0.9 for example.

With $p$=0.9 confidence interval, we can naturally expect like this: if we carry out sufficiently many predictions and check how actuall outputs fall within or out of predicted distribution, maybe 90% of observations would lie within our $p$=0.9 CI.

**Definition of Confidence Interval**<br>In this discussion the confidence interval is $\lbrack -\infty, F_t^{-1}(p)\rbrack$ rather than an finite interval whose center is $m_x$.
{: .notice--warning}

Certainly, there must be cases where actual yield $y$ fall out of predicted confidence interval.  However, if we carry out 100 different forecasts with $H$, we can wish 90 out of 100 actual yield values lie within our CI.  This is a basic and intuitive expectation we have for **calibrated forecaster**.

## Why Recalibration is Needed

Not all bayesian deep regressor is calibrated forecaster as itself.  If actual distribution of dependant variable $y$ does not follow normal distribution, as a simplest example, our bayesian deep regressor for such variable cannot directly be a calibrated forecaster.  We still can draw cute CI band, but no intuitive expectations is met and actual yield $y$ would look like randomly fall out of our band with significant offsets sometimes or more often.

Kuleshov, Fenner and Ermon suggests to construct an axuilary model $R$ to make this **Farmer's expectation** (this is what I named and sorry if it is confusing.  Authors' did not coin this term) hold for such **uncalibrated forecaster**.

If our dataset is $\mathcal{S}=\lbrace{(x_t, y_y)}\rbrace _{t=1}^T$, at step $t$ forecaster $H$ will provide forecast $H(x_t)~N(m_x,\sigma_x)$.

As this model is not calibrated yet, this forecast can betray farmer's expectation.  So, if we are to draw CI for $p$, we first map this $p$ to another nonnegative value $p'\le1$ using $R$.  For sure $p'\le1$ must be a value which can satisfy we farmers.

And it is argued that finding such $p'$ is possible for every $p\le1$

$$\^{P}(p)= \lvert\lbrace y_t\vert\lbrack H(x_t)\rbrack\le p, t=1,...,T\rbrace\rvert/T \tag{2}$$

Above equation can be explained as follows: $R$ maps probability $p$ to new value $\^{P}(p)$.  To get $\^{P}(p)$, we count the number of elements $(x,y)$ in our dataset $\mathcal(S)$, whose confidence interval of confidence level $p$ obatined from forecast $H(x)$ successfully includes $y$ and divide it with dataset size $T$.

## Training Auxiliary Model

To train auxiliary model $R$ which recalibrates our $H$ not fulfilling farmer's expectation, we use new dataset $\mathcal{D}$ derived from original dataset $\mathcal{S}$.

$$\mathcal{D}=\lbrace\lparen\lbrack H(x_t)\rbrack(y_t),\^{P}(\lbrack H(x_t)\rbrack(y_t))\rparen\rbrace _{t=1}^T \tag{2}$$

$\lbrack H(x_t)\rbrack(y_t)$ is cumulative probability obtained by integrating $H(x_t)$ on interval $\lbrack -\infty, y_t\rbrack$.

It is trivial that $R$ is monotonically increasing function from the definition of $\^{P}$, and so $R$ could be modeled on $\mathcal{D}$ via methods like **isotonic regression**.  After training, we can show composition function $R\circ \lbrack(H(x_t)\rbrack(y_t)$ satisfies **Equation 1**.

We can use bayesian models from `gpytorch` and GPR implemented in `pytorch` or so[^2],[^3].  Isotonic regression is available from `scikit-learn`'s `sklearn.isotonic` module[^4].

## Example Cases

In which cases we need to recalibrate our CIs using recalibration model $R$?  Blow image plots data from $\mathcal{D}$ on coordinate, $\lbrack H(x_t)\rbrack(y_t)$ as $x$-axis and $\^{P}(\lbrack(H(x_t)\rbrack(y_t))$ as $y$ axis.

{% include img-gdrive alt="Bayesian Deep-Learning Regression Forecaster (2)" id="1bL5gPWz-5cmnHfQuzWvXr2sIvC__QJYM" %}

Now, let's say for some model an dataset actual $y$ values had trend falling short of distribution mean $m_x$ of each step's forecast.  Then true CDF constructed from actual data will look like steeply increase when confidence level $p$ is low and plateaued at higher confidence level.  Such forecaster could be thought to be **overestimating** in outputing predictions.  **Underestimating** case can also be considered similarly.  If CDF constructed from forecaster's forecast is same with that constructed from actual data, identity function will form on $\mathcal{D}$ or **calibrated forecaster**.

Conclusion is like this.  Even in case our forecaster is not calibrated, we can recalibrate it using auxiliary model $R$.  If we replace CDF on $x$-axis from the one obtained from $\lbrack(H(x_t)\rbrack(y_t)$ to the other obtained from $R\circ\lbrack(H(x_t)\rbrack(y_t)$, straight line (calibrated forecaster) will form or at least our forcaster will get closer to caibrated one.

[^2]: https://richardcsuwandi.medium.com/gaussian-process-regression-using-gpytorch-2c174286f9cc
[^3]: https://bayesian-neural-network-pytorch.readthedocs.io/en/latest/
[^4]: https://scikit-learn.org/stable/modules/generated/sklearn.isotonic.IsotonicRegression.html