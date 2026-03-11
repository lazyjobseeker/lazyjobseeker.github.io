---
title: Kalman Filter - Interactive Example
category: programming
tags:
  - algorithm
created_at: 2026-03-09 03:07:08 -05:00
last_modified_at: 2026-03-11 12:26:18 -05:00
excerpt: Kalman filter - interactive example
published: true
---
## Quick Intro - Mouse Cursor Tracker

**Kalman filter** is an algorithm which estimates unknown state variable(s) from the state transition model and possibly inaccurate sensor measurements.

Before walking into detailed formulation, let's try below interactive app - mouse pointer (or touch trace if you are browing this page mobile) tracker powered by a simple implementation of Kalman filter.

{% include apps/kalman-filter-position-tracker.html %}

## Kalman Filter

### Prediction from Model

First of all, we expect we can **predict** a variable (or a set of variables) in any step $k$ from its previous step $k-1$.

$$ x_{k \mid k-1} = Fx_{k-1} \tag{1}$$

$F$ is called **state-transition model**. Note that above equation is *a priori* prediction - this prediction was made solely from the model $F$ you have.

## State Estimate Covariance

There is one another key element in implementing Kalman filter - the **covariance matrices**. These are matrices stating the uncertainties involved with **state estimates** (state estimate covariance; $P$), process noise (process noise covariance; $Q$), and measurement noise (measurement noise covariance; $R$).  

During the prediction step of Kalman filter, state estimate covariance matrice $P$ for the next step $k$ is predicted as well:

$$P_{k \mid k-1} = {F_k}P_{k-1 \mid k-1}{F_k}^T + Q_k \tag{2}$$

Note that we have a priori knowledge of transition model and process covariance at step $k$ -  we assume we know the transition model at step $k$ ($F_k$) and the extent of inaccuracy involved with the model's capability of predicting the next step ($Q_k$).

### Observation from Sensors

Technically, equations 1 is already self-sufficient to build a state tracker - if the transition model is the only one we can use, we can just replace $x_{k\mid k-1}$ by $x_k$ and move on to estimate the $k+1$th step. This will catastrophically fail in the long run due to the accumulation of process noises but anyway it will give you some series of state estimates.

But we may have some good **sensors** so we can use to measure the states. State measurement at step $k$ is usually denoted as $z_k$.

$$z_k = H_kx_k + v_k \tag{3}$$

As we had state transition model for model update, for observations we have observation model $H$. $H$ determines how the true states $x$ we want to track are related to $z_k$ we can observe or measure.

$v_k$ is the observation noise. It is associated with the observation noise covariance matrix $Q$ and assumed to follow $\mathcal{N}(0, R_k)$

### Innovation

With all the elements outlined, first we compute the innovation $S_k$

$$y_k = z_k - H_k x_{k\mid k-1} \tag{4}$$

See how equation 4 is different from equation 3. It used $x_{k \mid k-1}$, the state estimate we obtaind using our transition model and previous state only. So what we do here is to see:

> What is the difference between what we actually measured ($z_k$) and the expeted measurement based on the state we predicted ($x_{k \mid k-1}$)?

Recall that we aim to accurately estimate the unknown state variables $x_k$. We can access this true nature with two different methods - model prediction and measurement. Formulation of innovation outlined above tries to capture how much descrepancy we have between these two. As we cannot directly calculate the residual ($x_k - x_{k \mid k-1}$), our measurement ($z_k$) play part in and help us conduct this process.

Covarance matrix for innovation ($S_k$) can be derived from equation 4:

$$S_k = \text{cov}(y_k) = E \left[ y_k y_k^T\right] = H_k P_{k \mid k-1} H_k^T + R_k \tag{5}$$

### Kalman Gain

Now we're nearing the last step. Using the covariance matrix of innovation $S_k$, we compute the optimal Kalman Gain $K_k$.

$$K_k = P_{k \mid k-1}{H_k^T}S_k^{-1} \tag{6}$$

Using this, we finally update our state estimate and all other entities having $k \mid k-1$ subscript.

## Update

We now update our **a priori** estimate $x_{k \mid k-1}$ into **a posteriori state estimate** $x_{k \mid k}$ and covariance matrix $P_{k \mid k-1}$:

$$x_{k \mid k} = x_{k \mid k-1} + K_k y_k \tag{7}$$


$$P_{k \mid k} = \left( I - K_k H_k \right) P_{k \mid k-1} \tag{8}$$

## Statements to Further Drill

- Kalman filter is effectively a low-pass filter.
- If noise covariance $R$ increases, Kalman gain $K$ reduces. It makes the posterior state estimate depends more on the model-driven estimate than sensor measurement. Increasing $P$ works the opposite way.
- Relying solely on the model leads to drift issue.  Relying solely on the sensor measurement leads to accuracy issue. Kalman filter is a Bayesian estimator correcting model prediction with sensor measurements.
- If there is no observability for a state, Kalman filter cannot find that state correctly.
- In practical implementation, often the Joseph form $P = (I-KH)P(I-KH)^T + KRK^T$ is used.
