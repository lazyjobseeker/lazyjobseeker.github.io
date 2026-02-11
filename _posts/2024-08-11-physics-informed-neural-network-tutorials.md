---
title: 물리정보신경망(PINN) - 기본 원리 및 PyTorch 예제
category: machine-learning
tags:
  - machine-learning
  - pytorch
created_at: 2024-08-04 07:19:54 -05:00
last_modified_at: 2026-02-11 14:33:00 -05:00
excerpt: 신경망 학습 과정에서 편미분방정식 형태로 주어지는 물리적 규제조건의 충족 여부를 손실함수 평가에 적용하여 학습 품질을 개선하는 물리정보신경망(PINN) 방법의 기본 원리를 PyTorch 예제 코드와 함께 설명합니다.
---

물리기반 인공신경망 혹은 물리정보신경망(Physics-Informed Neural Network; PINN)은 최근 학계와 산업계 모두에서 큰 관심을 받고 있는 머신러닝의 세부 분야입니다.  이미 온라인에서 다양한 예제들을 쉽게 접할 수 있고, 적용하고자 하는 분야에 적합한 물리 규제식을 PyTorch, Tensorflow에서 제공하는 자동미분 관련 함수들을 이용해 학습과정을 규제하는 손실함수에 반영하는 형태로 활용할 수 있습니다.  예제를 통해 사용 방법을 살펴 보도록 하겠습니다.

## 사전 작업

우선 튜토리얼에 사용할 기본 신경망 및 `Dataset` 클래스를 구성합니다.

### 신경망 설계

별도로 재정의하지 않는 한 아래의 단순 순전파 모형을 사용하겠습니다.  100개 노드를 가진 하나의 은닉층이 있고 입력 및 출력 노드의 개수는 각각 인스턴스 생성 시점에 `indim` 및 `outdim` 변수를 변경하여 조절합니다.

```python
import torch

class Net(torch.nn.Module):

    def __init__(self, indim=1, outdim=1):
        super().__init__()
        self.actf = torch.tanh
        self.lin1 = torch.nn.Linear(indim, 100)
        self.lin2 = torch.nn.Linear(100, outdim)

    def forward(self, x):
        x = self.lin1(x)
        x = self.lin2(self.actf(x))
        return x.squeeze()
```

### `Dataset` 클래스

다음으로는 학습 과정에서 데이터를 다루기 위해 사용할 커스텀 데이터셋 클래스를 작성합니다.  `torch.utils.data`의 `Dataset` 클래스를 상속하는 파생 클래스로 작성하며, `__len__` 및 `__getitem__` 메서드를 구현해 주어야 합니다.

```python
from torch.utils.data import Dataset

class MyDataset(Dataset):

    def __init__(self, in_tensor, out_tensor):
        self.inp = in_tensor
        self.out = out_tensor

    def __len__(self):
        return len(self.inp)

    def __getitem__(self, idx):
        return self.inp[idx], self.out[idx]
```

## 예제 - 열방정식 (Heat Equation)

### 문제 구성

아래와 같은 간단한 편미분방정식을 생각합니다.

$$\frac{1}{2}\frac{\partial u}{\partial t} = \frac{\partial ^2 u}{\partial x^2}, \quad u(x, 0)=\sin(\pi x) \tag{1} $$

아래와 (2)와 같은 식을 생각하면, 이것이 위 편미분방정식의 가능한 해 중 하나가 된다는 것을 알 수 있습니다.

$$ u(x,t) = e^{-2\pi^2 t}\sin(\pi x) \tag{2} $$

이제 식 (2)에 따라 학습을 위한 데이터셋을 구성하고, PINN 컨셉에 따른 손실함수 구성 유무가 모델 성능에 미치는 영향을 확인해 봅시다.

### 학습 데이터 생성

먼저 학습 데이터를 생성합니다.  $(x,t) \in \lbrack-5,5\rbrack \times \lbrack0, 0.2\rbrack$ 영역으로제한하여 생성하였습니다.

```python
import numpy as np
import matplotlib.pyplot as plt

def u(x, t):
    return np.exp(-2*np.pi*np.pi*t)*np.sin(np.pi*x)

pts = 200
ts = np.linspace(0.2, 0, pts)
xs = np.linspace(-5, 5, pts)

X, T = np.meshgrid(xs, ts)
U = u(X, T)

plt.imshow(U)
plt.colorbar()
```

{% include img-gdrive alt="학습 데이터셋" id="1-nq-kMS9bjJuF7rEXcADagfCP9UuYhdk" %}

이미지화해 보면 $t = 0$에서 사인파형이 나타나며, 시간이 지남에 따라 감쇠하는 형태가 잘 나타나고 있습니다.

### 일반 모델 학습 및 결과

먼저 PINN 컨셉을 적용하지 않은 일반 모델을 학습하고 결과를 확인해 보겠습니다.  앞서 정의한 `MyDataset` 클래스를 학습용  데이터들에 연동하고 `DataLoader` 인스턴스를 하나 만들어 여기에 적재해 줍니다.

```python
from torch.utils.data import DataLoader

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

train_in = torch.tensor([[x, t] for x, t in zip(X.flatten(), T.flatten())], dtype=torch.float32, requires_grad=True)
train_out = torch.tensor(u(X.flatten(), T.flatten()), dtype=torch.float32)

train_in.to(DEVICE)
train_out.to(DEVICE)

train_dataset = MyDataset(train_in, train_out)
train_dataloader = DataLoader(train_dataset, batch_size=256, shuffle=True)
```

이제 학습을 진행할 수 있습니다.  옵티마이저로는 `Adam`을 사용하였고, 손실함수는 `MSELoss`를 적용하였습니다.

```python
from torch.optim import Adam

model = Net(indim=2, outdim=1).to(DEVICE)
epochs = 1000
optimizer = Adam(model.parameters(), lr=0.1)

loss_fcn = torch.nn.MSELoss()

for epoch in range(0, epochs):
    for batch_in, batch_out in train_dataloader:
        batch_in.requires_grad_()
        batch_in.to(DEVICE)
        batch_out.to(DEVICE)
        model.train()
        def closure():
            optimizer.zero_grad()
            loss = loss_fcn(model(batch_in), batch_out)
            loss.backward()
            return loss
        optimizer.step(closure)
    model.eval()
    epoch_loss = loss_fcn(model(train_in), train_out)
    print(f'Epoch: {epoch+1} | Loss: {round(float(epoch_loss), 4)}')
```

결과를 확인해 보겠습니다.

```python
def u_model(xs, ts):
    pts = torch.tensor(np.array([[x, t] for x, t in zip(xs, ts)]), dtype=torch.float32)
    return model(pts)

pts = 50
ts = torch.linspace(0.2, 0, pts)
xs = torch.linspace(-5, 5, pts)
X, T = torch.meshgrid(xs, ts)
X = X.T
T = T.T

img = []
for x, t in zip(X, T):
    img.append(u_model(x, t).detach().numpy().tolist())

plt.imshow(img)
plt.colorbar()
```

{% include img-gdrive alt="학습 결과" id="1-wTl1te-nAaLkAgUnW00SNT7ik9K257S" %}

학습 데이터셋과 비교하면, 전반적으로 나쁘지 않지만 $t$가 증가한 지점에서 요동치는 듯한 물결 무늬가 존재합니다.

### PINN 적용 모델 학습 및 결과

#### 물리규제식 기반 손실함수 구성

이제 PINN의 개념을 도입하는 경우 학습 결과가 어떻게 달라지는지 확인해 보겠습니다.  이를 위해 커스텀 손실함수 `phys_loss`를 아래와 같이 작성해 주겠습니다.

```python
from torch.autograd import grad

def phys_loss(inp, out):
    dudt = grad(out, inp, grad_outputs=torch.ones_like(out), create_graph=True, allow_unused=True)[0][:,1]
    dudx = grad(out, inp, grad_outputs=torch.ones_like(out), create_graph=True, allow_unused=True)[0][:,0]
    d2udx2 = grad(dudx, inp, grad_outputs=torch.ones_like(dudx), create_graph=True, allow_unused=True)[0][:,0]
    return torch.nn.MSELoss()(d2udx2, 0.5*dudt)
```

위 `phys_loss` 함수의 인자에서 `inp`는 입력 텐서, `out`은 출력 텐서입니다.  이 예제에서 `inp`는 공간좌표 및 시간좌표의 순서쌍 $(x,t)$ 또는 이러한 순서쌍으로 구성된 텐서 배치가 될 것이며, `out`은 이들로부터 계산된 스칼라 $u(x, t)$가 됩니다.

또한 경계조건 $(t=0)$ 만족 여부를 지속적으로 손실함수에 포함하기 위해, 경계조건에 대한 학습 데이터를 추가로 생성합니다.

```python
bdry_pts = 200
xs_bdry = np.linspace(-5, 5, bdry_pts)
ts_bdry = np.asarray([0 for x in xs_bdry])
us_bdry = u(xs_bdry, ts_bdry)

train_in_bd = torch.tensor([[x, t] for x, t in zip(xs_bdry, ts_bdry)], dtype=torch.float32, requires_grad=True)
train_out_bd = torch.tensor(us_bdry, dtype=torch.float32)
  
train_in_bd.to(DEVICE)
train_out_bd.to(DEVICE)
```

#### 모델 학습 및 결과 확인

이제 모델을 다시 학습하고 결과를 확인해 보겠습니다.

```python
model_pinn = Net(indim=2, outdim=1).to(DEVICE)

epochs = 1000
optimizer_pinn = Adam(model_pinn.parameters(), lr=0.1)
loss_fcn = torch.nn.MSELoss()

for epoch in range(0, epochs):
    for batch_in, batch_out in train_dataloader:
        batch_in = Variable(batch_in, requires_grad=True)
        batch_in.to(DEVICE)
        batch_out.to(DEVICE)
        model_pinn.train()
        def closure():
            optimizer_pinn.zero_grad()
            loss = loss_fcn(model_pinn(batch_in), batch_out)
            loss += phys_loss(batch_in, model_pinn(batch_in))
            loss += loss_fcn(model_pinn(train_in_bd), train_out_bd)
            loss.backward()
            return loss
        optimizer_pinn.step(closure)
    model_pinn.eval()
    base_loss = loss_fcn(model_pinn(train_in), train_out)
    phys_loss = phys_loss(train_in, model_pinn(train_in))
    bdry_loss = loss_fcn(model_pinn(train_in_bd), train_out_bd)
    epoch_loss = base + phys + bdry

    print(f'Epoch: {epoch+1} | Loss: {round(float(epoch_loss), 4)} = {round(float(base_loss), 4)} + {round(float(phys_loss), 4)} + {round(float(bdry_loss), 4)}')

>>> Epoch: 1 | Loss: 0.5396 = 0.0657 + 0.0006 + 0.4733 
    Epoch: 2 | Loss: 0.5446 = 0.0723 + 0.0007 + 0.4715
    Epoch: 3 | Loss: 0.5351 = 0.0673 + 0.001 + 0.4668
    ...
    Epoch: 998 | Loss: 0.2434 = 0.016 + 0.1509 + 0.0764
    Epoch: 999 | Loss: 0.2662 = 0.0317 + 0.1361 + 0.0983
    Epoch: 1000 | Loss: 0.242 = 0.0217 + 0.1327 + 0.0876
```

아래와 같이 결과를 시각화해 줍니다.

```python
def u_model_pinn(xs, ts):
    pts = torch.tensor(np.array([[x, t] for x, t in zip(xs, ts)]), dtype=torch.float32)
    return model_pinn(pts)

pts = 200
ts = torch.linspace(0.2, 0, pts)
xs = torch.linspace(-5, 5, pts)

X, T = torch.meshgrid(xs, ts)
X = X.T
T = T.T

img = []
for x, t in zip(X, T):
    img.append(u_model_pinn(x, t).detach().numpy().tolist())

plt.imshow(img)
plt.colorbar()
```

결과가 기존 바닐라 모델과 어떻게 달라지는지 살펴봅시다.  이미지 상단에 존재하던, 물리적으로 정합하지 않은 물결무늬 형태가 사라진 것을 알 수 있습니다.  이러한 결과를 통해, 물리현상을 규제하는 편미분방정식의 충족 수준을 손실함수에 포함하는 PINN의 접근이 학습 결과를 개선하는 방식을 확인할 수 있습니다.

{% include img-gdrive alt="PINN 적용 시 학습 결과" id="100qPCf9g8cN3FzZ8bTc7cur0nHKYCF4l" %}

위에서는 `Adam` 옵티마이저만을 사용했지만, `LBFGS` 옵티마이저를 함께 사용하여 수렴성을 개선하는 방법이 사용될 수 있습니다.  이 경우 `Adam` 옵티마이저를 이용한 사전 학습 에폭을 가진 뒤, 최종적으로 `LBFGS` 옵티마이저를 이용하게 됩니다.

```python
from torch.optim import Adam, LBFGS

model_pinn_v2 = Net(indim=2, outdim=1).to(DEVICE)
epochs_adam = 100
epochs_lbfgs = 30
optimizer_pinn_adam = Adam(model_pinn_v2.parameters(), lr=0.1)
optimizer_pinn_lbfgs = LBFGS(model_pinn_v2.parameters(), lr=0.01)

loss_fcn = torch.nn.MSELoss()

for epoch in range(0, epochs_adam + epochs_lbfgs):
    current_optimizer = optimizer_pinn_adam if epoch <= epochs_adam else optimizer_pinn_lbfgs
    for batch_in, batch_out in train_dataloader:
        batch_in = Variable(batch_in, requires_grad=True)
        batch_in.to(DEVICE)
        batch_out.to(DEVICE)
        model_pinn_v2.train()
        def closure():
            current_optimizer.zero_grad()
            loss = loss_fcn(model_pinn_v2(batch_in), batch_out)
            loss += phys_loss(batch_in, model_pinn_v2(batch_in))
            loss += loss_fcn(model_pinn_v2(train_in_bd), train_out_bd)
            loss.backward()
            return loss
        current_optimizer.step(closure)
    model_pinn_v2.eval()
    base = loss_fcn(model_pinn_v2(train_in), train_out)
    phys = phys_loss(train_in, model_pinn_v2(train_in))
    bdry = loss_fcn(model_pinn_v2(train_in_bd), train_out_bd)
    epoch_loss = base + phys + bdry
    print(f'Epoch: {epoch+1} | Loss: {round(float(epoch_loss), 4)} = {round(float(base), 4)} + {round(float(phys), 4)} + {round(float(bdry), 4)

>>> Epoch: 1 | Loss: 0.5404 = 0.0646 + 0.0003 + 0.4756 
    Epoch: 2 | Loss: 0.5517 = 0.0704 + 0.0009 + 0.4804
    Epoch: 3 | Loss: 0.537 = 0.0652 + 0.0021 + 0.4697
    ...
    Epoch: 128 | Loss: 0.0796 = 0.0055 + 0.0507 + 0.0233
    Epoch: 129 | Loss: 0.0803 = 0.0055 + 0.0515 + 0.0233
    Epoch: 130 | Loss: 0.078 = 0.0054 + 0.049 + 0.0236
```

PINN을 적용한 위 코드는 전체 손실과 각 부분 손실을 모두 나타내도록 작성되었습니다.  같은 방식을 바닐라 모델 학습 코드에 적용하여 어떤 일이 발생하고 있는지 확인해 볼 수도 있습니다:

```python
>>> Epoch: 1 | Loss: 0.0334 | 0.0167 | 0.4827
    Epoch: 2 | Loss: 0.0354 | 0.0213 | 0.4835
    Epoch: 3 | Loss: 0.0382 | 0.0263 | 0.4816
    ...
    Epoch: 998 | Loss: 0.2132 | 8785.3867 | 0.1779
    Epoch: 999 | Loss: 0.0083 | 360.5806 | 0.0733 
    Epoch: 1000 | Loss: 0.0055 | 220.879 | 0.0764
```

이 경우, PDE 규제 충족 여부를 나타내는 손실 부분은 에폭 증가에 따라 수렴하지 않고 진동 발산하는 것을 확인할 수 있습니다.

## 부록: PyTorch의 자동미분 함수 사용법

PyTorch를 PINN에 적용하기 위해서는 `torch.autograd`, `torch.func` 등의 자동미분 관련 모듈들을 적절히 사용할 수 있어야 합니다.  몇 가지 유의사항을 정리합니다.

### 스칼라 출력 모델에 사용 시

여러분의 모델 $u$가 $N$차원 텐서 $X = \lbrace x_i \rbrace_{i\le N}$를 입력으로 받아 스칼라 $y \in \reals$를 주는 함수라고 합시다.  즉 $u(X) = y$ 이고, 실제 코드에서 $u$는 여러분이 구성한 모델 클래스 (이 포스트의 예제를 기준으로는 `Net`)의 인스턴스로 구현됩니다.  우리가 하고 싶은 작업은 $u$로부터 각 편미분 요소 ${\partial y}/{\partial x_i}$를 구하고 이들을 결합하여 손실함수에 반영하는 것입니다.

위와 같이 모델의 출력이 스칼라(크기 1인 텐서)인 경우, `torch.autograd` 모듈의 `grad`함수를 사용할 수 있습니다.  표기를 단순화하기 위해 앞선 코드들에서 사용한 표기 중 `grad(out, inp, grad_outputs=torch.ones_like(out), create_graph=True, allow_unused=True)`는 `grad(out, inp)`로 축약하겠습니다.  또한 `inp`와 `out`은 각각  $X$와 $y$에 대응하는 것으로 생각할 수 있습니다.

그러면 아래가 성립합니다.

- `grad(out, inp)[0]` = $\nabla u$
- `grad(out, inp)[0][k-1]` = $\partial u / \partial x_k$
	- 이 값을 `f_xk`라고 합시다.
- `grad(f_xk, inp)[0][l-1]` = $\partial ^2 u / \partial x_k\partial x_l$

즉, 입/출력 텐서를 이용해 `grad`를 취한 다음 첫 번째 원소를 가져오면 Gradient를 얻을 수 있고, 다시 여기에서 `k-1`번째 원소를 가져오는 것으로 $x_k$에 대한 편미분을 얻을 수 있습니다.  고차 편미분을 원하는 경우에는 `out` 부분을 이전 차수 편미분에서 얻은 결과로 바꾸어 주면 됩니다.  단, 원래 표현에서 `grad_outputs` 인자 부분에도 `out`이 들어가 있으니 이 부분도 같이 바꿔 주어야 합니다.

### 벡터 출력을 갖는 모델에 사용 시 (1)

이제는 스칼라 출력이 아닌, 벡터 출력을 갖는 모델을 생각해 보겠습니다.  코드 예제를 통해 살펴보기 위해, 입력과 출력 크기가 모두 3인 `model_vec` 인스턴스를 만들어 줍니다.

```python
torch.manual_seed(42)
model_vec = Net(indim=3, outdim=3).to(DEVICE)
```

그리고 크기 3인 텐서 `x`를 만들어 줍니다.

```python
x = torch.rand(3)
x.requires_grad_()
print(x)

>>> tensor([0.0806, 0.6256, 0.0947], requires_grad=True)
```

`model_vec`은 출력 크기가 3인 모델입니다.  따라서 `model_vec`을 $u$, `x`를 $X = (x_1, x_2, x_3)$라 하면 아래와 같이 쓸 수 있습니다.

$$u(X) = (u_1(X), u_2(X), u_3(X)) \tag{3}$$

그리고 이에 대한 미분을 생각하면, 자연스럽게, $X$에서 $u$의 자코비언 $\text{J}$를 얻는 것을 기대하게 될 것입니다.

$$\text{J} = \begin{Bmatrix}  
\partial u_1 / \partial x_1 &
\partial u_1 / \partial x_2 &
\partial u_1 / \partial x_3 \\ 
\partial u_2 / \partial x_1 &
\partial u_2 / \partial x_2 &
\partial u_2 / \partial x_3 \\
\partial u_3 / \partial x_1 &
\partial u_3 / \partial x_2 &
\partial u_3 / \partial x_3 \\
             \end{Bmatrix} \tag{4}$$

즉, "`grad`를 `model_vec`에 적용하면 3x3 텐서가 나오지 않을까?" 라고 속 편하게 기대할 수 있습니다.  하지만 아쉽게도, 결과를 확인해 보면 그렇지 않고, 크기 3인 텐서를 얻게 됩니다.

```python
grad = torch.autograd.grad(model_vec(x), x, grad_outputs=torch.ones_like(model_vec(x)), create_graph=True, allow_unused=True)[0]
print(grad)

>>> tensor([ 0.1809, 0.2170, -0.1783], grad_fn=<ViewBackward0>)
```

이처럼 출력값이 스칼라가 아닌 함수에 대해 미분을 수행하고자 하는 경우, `grad` 대신 자코비언을 구할 수 있게 해 주는 `torch.func` 모듈의 `jacrev`와 같은 함수를 사용해야 합니다.

```python
from torch.func import jacrev
jac = jacrev(model_vec)(x)
print(jac)

>>> tensor([[-0.0622, 0.0219, 0.1662],
            [ 0.1229, 0.3468, -0.2792],
            [ 0.1202, -0.1517, -0.0654]])

```

실제로 위와 같이 자코비언을 얻을 수 있습니다.  더 자세히 살펴보면, `grad`를 이용해 얻었던 텐서의 첫 번째 원소 값이 0.1809인데, 이 값은 `jacrev`를 이용해 얻은 3x3 텐서의 첫 열벡터의 원소 합이 되는 것을 알 수 있습니다 (-0.0622+0.1229+0.1212).

```python
print(grad[0])
print(jac.T[0].sum())

>>> tensor(0.1809, grad_fn=<SelectBackward0>)   
    tensor(0.1809, grad_fn=<SumBackward0>)
```

즉 이로부터, 식 (4)의 $\text{J}$는 `jac`의 전치텐서 `jac.T`와 같음을 생각할 수 있습니다.
 
### 벡터 출력을 갖는 모델에 사용 시 (2)

위와 같은 방식으로 벡터출력을 갖는 모델 $u$의 미분 즉 자코비언을 구할 수 있었습니다.  하지만 위의 코드에서, 입력 텐서를 배치 형태로 바꾸어 주면 문제가 발생합니다.

```python
torch.manual_seed(42)
z = torch.rand(2, 3)
z.requires_grad_()
print(z)

>>> tensor([[0.8823, 0.9150, 0.3829],
            [0.9593, 0.3904, 0.6009]], requires_grad=True)
```

텐서 `z`는 크기 3인 텐서 두 개로 구성된 크기 2의 배치입니다.  따라서, `z`에 대해 `u`의 자코비언을 계산하는 경우 자연스럽게 기대하는 결과는 3x3 텐서들로 구성된 크기 2의 새로운 텐서 배치를 얻는 것입니다.  즉, \[2, 3, 3\] 크기의 새로운 텐서를 얻을 것으로 기대합니다.

하지만 실제로 테스트를 수행해 보면, \[2, 3, 2, 3\] 크기의 텐서가 얻어지고, 영벡터가 중간중간 끼어들어가 있는 것을 알 수 있습니다.

```python
jac = jacrev(model_vec)(z)
print(jac)

>>> tensor([[[[ 0.0026, 0.0146, 0.2084],
              [ 0.0000, 0.0000, 0.0000]],
             [[ 0.1259, 0.3053, -0.2887],
              [ 0.0000, 0.0000, 0.0000]],
             [[ 0.0721, -0.1514, -0.1038],
              [ 0.0000, 0.0000, 0.0000]]],
            [[[ 0.0000, 0.0000, 0.0000],
              [ 0.0207, -0.0149, 0.2170]],
             [[ 0.0000, 0.0000, 0.0000],
              [ 0.1575, 0.3220, -0.2883]],
             [[ 0.0000, 0.0000, 0.0000],
              [ 0.0639, -0.1551, -0.1053]]]], grad_fn=<ViewBackward0>)
```

이러한 문제를 해결하기 위해서는 `torc.func`의 `vmap`함수를 함께 사용합니다.  출력 텐서가 의도한 대로 \[2, 3, 3\]의 크기를 갖는 것을 알 수 있습니다.

```python
from torch.func import jacrev, vmap

jac_vmap = vmap(jacrev(model_vec))(z)
print(jac_vmap)

>>> tensor([[[ 0.0026, 0.0146, 0.2084],
             [ 0.1259, 0.3053, -0.2887],
             [ 0.0721, -0.1514, -0.1038]],
            [[ 0.0207, -0.0149, 0.2170],
             [ 0.1575, 0.3220, -0.2883],
             [ 0.0639, -0.1551, -0.1053]]], grad_fn=<ViewBackward0>)
```