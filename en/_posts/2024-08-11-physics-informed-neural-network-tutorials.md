---
title: Physics Informed Neural Network (PINN) - A Practical Tutorial with an Example
category: machine-learning
tags:
  - machine-learning
  - pytorch
created_at: 2024-08-05 08:19:54 +09:00
last_modified_at: 2026-02-11 14:33:00 -05:00
excerpt: A practical introduction to Physics-Informed Neural Network (PINN), covering the brief theory and an example implementation with visualization and tips written in PyTorch.
---

**Physics-Informed Neural Network(PINN)** has been recently gathering a lot of attention in both of academia and industry. There are a myriad of tutorials available, so you could start developing your own version of Python codes to solve various machine-learning problems if you can find underlying physical equations given in the form of (a set of) differential equations.

## Pre-Requisites

First of all, we need to define basic neural network and custom `Dataset` class to be used.

### Network Design

Unless redefined hereafter, we will use a simple feed-forward network as follows.  There is one hidden layer with 100 nodes, and the number of input/output can be controlled using `indim` and `outdim` arguments.

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

### `Dataset` Class

Second of all, we need our custom `Dataset` class.

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

## Example - Heat Equation

### Problem Description

Suppose we have a simple partial differential equation as follows.

$$\frac{1}{2}\frac{\partial u}{\partial t} = \frac{\partial ^2 u}{\partial x^2}, \quad u(x, 0)=\sin(\pi x) \tag{1} $$

If we look into another equation (2), you can see this is one of the possible solutions of (1).

$$ u(x,t) = e^{-2\pi^2 t}\sin(\pi x) \tag{2} $$

Now we will use (2) to create training dataset, build custom loss function according to the concept of PINN, train our model with or without PINN concept.

### Training Data Generation

Let's create our training data first.  The sampling domain was set to be $(x,t) \in \lbrack-5,5\rbrack \times \lbrack0, 0.2\rbrack$.

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

{% include img-gdrive alt="Training Dataset" id="1-nq-kMS9bjJuF7rEXcADagfCP9UuYhdk" %}

When you check how it looks like, you can see clear sinusoidal wavefront at $t=0$, which attenuates as time lapses.

### Training Model without PINN

Let's train vanilla model where we do not apply the loss function engineering based on the PINN concept.  Use `MyDataset` and `DataLoader` to load our data up and train the model.

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

Now we can train our basic model.  `Adam` was used as optimizer and loss was calculated using `MSELoss`.

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

Let's check the result.

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

{% include img-gdrive alt="Training Result" id="1-wTl1te-nAaLkAgUnW00SNT7ik9K257S" %}

Compared to the training dataset, the result is not that bad but you can clearly see some wiggly features in upper area of the image.

### Training Model with PINN

Now let's check how using the concept of PINN can improve the things.

#### Add Physics Terms to Loss Function 

First of all, we write down new custom loss term `phys_loss` as follows.

```python
from torch.autograd import grad

def phys_loss(inp, out):
    dudt = grad(out, inp, grad_outputs=torch.ones_like(out), create_graph=True, allow_unused=True)[0][:,1]
    dudx = grad(out, inp, grad_outputs=torch.ones_like(out), create_graph=True, allow_unused=True)[0][:,0]
    d2udx2 = grad(dudx, inp, grad_outputs=torch.ones_like(dudx), create_graph=True, allow_unused=True)[0][:,0]
    return torch.nn.MSELoss()(d2udx2, 0.5*dudt)
```

Regarding the arguments, `inp` is input tensor and `out` is output tensor.  In this tutorial `inp` should be the spatiotempral data or spatial coordinate - time coordinate pair $(x, t)$.  `out` should be the scalar value calulated with our model $u$, therefore $u(x, t)$.

Furthermore, you need to add more training data at $t=0$, to evaluate loss at the boundary and make the model meet our boundary condition prescribed by Eq (1).

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

#### Training PINN Model

Now we can train our model again and check the result.

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

Let's visualize the result.

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

How the result now is different from vanilla model?  It can be seen that the wiggly feature from vanilla model is gone by adding physical regulations (PDE loss and boundary condition loss).  We can see here how adding physics-inspired regulation into loss function improves the performance of trained model.

{% include img-gdrive alt="Training Result of PINN model" id="100qPCf9g8cN3FzZ8bTc7cur0nHKYCF4l" %}

Although we have used `Adam` optimizer only, `LBFGS` optimizer can be used in combination to improve the convergence.  In such case, we can use pre-training sequence with `Adam` optimizer and then transit to `LBFGS`.

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

You can see above that above code was written to show total loss with individual contribution from each loss terms (data loss, physics loss, boundary loss).  We can further try doing the same thing when we train vanilla model and see what happens.

```python
>>> Epoch: 1 | Loss: 0.0334 | 0.0167 | 0.4827
    Epoch: 2 | Loss: 0.0354 | 0.0213 | 0.4835
    Epoch: 3 | Loss: 0.0382 | 0.0263 | 0.4816
    ...
    Epoch: 998 | Loss: 0.2132 | 8785.3867 | 0.1779
    Epoch: 999 | Loss: 0.0083 | 360.5806 | 0.0733 
    Epoch: 1000 | Loss: 0.0055 | 220.879 | 0.0764
```

As expected, physics loss term diverges as the training progresses.  Note that the boundary loss converges anyway, which is because the dataset we sampled already included some samples from boundary.

## Appendix: Autodifferentiation in PyTorch for PINN Application

To utilize PyTorch in implementing PINN, you need to be familiar to how to use modules such as `torch.autograd` and `torch.func`.  Here I would like to provide some rule-of-thumbs you can refer as a basic guideline.

### Model with Scalar-Valued Output

Suppose your model $u$ accepts an $N$-dimensional tensor $X = \lbrace x_i \rbrace_{i\le N}$ and outputs a scalar $y \in \reals$ (so $u(X) = y$).  In this case, in the actual code $u$ is materialized as an instance of your custom neural network model (`Net` in the case of this tutorial).  Let me say we have `model` as our instance representing $u$.  Now what we want to do is calculating partial derivatives ${\partial u}/{\partial x_i}$ and combining them to define our custom loss function.

If your model $u$ outputs scalar (tensor of size 1), you can use `grad` function from `torch.autograd` module.  Let's examine what happens in actual code.  For simplicity, let me simplify `grad(out, inp, grad_outputs=torch.ones_like(out), create_graph=True, allow_unused=True)` into `grad(out, inp)`.  In this expression you can say `inp` and `out` correspond to $X$ and $y$ respectively.

With above expressions, below lines hold:

- `grad(model(inp), inp)[0]` = $\nabla u$
- `grad(model(inp), inp)[0][k-1]` = $\partial u / \partial x_k$
	- Let me refer this to be `f_xk`.
- `grad(f_xk, inp)[0][l-1]` = $\partial ^2 u / \partial x_k\partial x_l$

In brief, you can use `grad(out, inp)` and take the first element to get the gradient of $u$ at a data point $X$.  If you take $k-1$th element of `grad(out, inp)`, you have a partial derivative of $u$ with respect to $x_k$.  If you want to calculate higher-order derivative, you can substitute `out` with proper partial derivative whose order is lower by 1 than what you want.

### Model with Vector-Valued Output (1)

Now we move on to more complex case, where our model $u$ outputs a tensor having more than 1 element - our model is vector-valued.  To test with codes, let's create new neural network instance `model_vec` where the input and output size are both 3.

```python
torch.manual_seed(42)
model_vec = Net(indim=3, outdim=3).to(DEVICE)
```

And let's create a tensor `x` with size of 3.

```python
x = torch.rand(3)
x.requires_grad_()
print(x)

>>> tensor([0.0806, 0.6256, 0.0947], requires_grad=True)
```

With above expressions, we can say like this,

$$u(X) = (u_1(X), u_2(X), u_3(X)) \tag{3}$$

where `model_vec`=$u$ and `x`=$X$.

And when we think of the derivative of $u$ at $X$, coming up with the Jacobian $\text{J}$ is natural.

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

So we think like, "Would we get a 3 by 3 tensor if `grad` acts over `model_vec`?".  Unfortunately, this is not the case here and we get a tensor whose size is 3.

```python
grad = torch.autograd.grad(model_vec(x), x, grad_outputs=torch.ones_like(model_vec(x)), create_graph=True, allow_unused=True)[0]
print(grad)

>>> tensor([ 0.1809, 0.2170, -0.1783], grad_fn=<ViewBackward0>)
```

How can we deal with this?  In the case as such, where our model is vector-valued, we need to use `jacrev` of `torch.func` module rather than simple `grad`.

```python
from torch.func import jacrev
jac = jacrev(model_vec)(x)
print(jac)

>>> tensor([[-0.0622, 0.0219, 0.1662],
            [ 0.1229, 0.3468, -0.2792],
            [ 0.1202, -0.1517, -0.0654]])

```

See what happened.  We could get the Jacobian.  When we look into the results in detail, the very first element of `grad` output was 0.1809.  This is same with the sum of the very first column vector of Jacobian we got using `jacrev` (-0.0622+0.1229+0.1212).

```python
print(grad[0])
print(jac.T[0].sum())

>>> tensor(0.1809, grad_fn=<SelectBackward0>)   
    tensor(0.1809, grad_fn=<SumBackward0>)
```

This observation confirms that the Jacobian $\text{J}$ in Eq. (4) is same with the transpose of `jac`, or`jac.T`.

### Model with Vector-Valued Output (2)

With above approach we could get any partial derivatives of models whose output is scalar- and vector-valued.  But in vector-valued output model case, above code gets into trouble in handling batched input.

```python
torch.manual_seed(42)
z = torch.rand(2, 3)
z.requires_grad_()
print(z)

>>> tensor([[0.8823, 0.9150, 0.3829],
            [0.9593, 0.3904, 0.6009]], requires_grad=True)
```

Above code generates new tensor `z`.  Differently from `x`, the sahpe of `z` is \[2, 3\], meaning it is a batched tensor where the batch size is 2.  As we expect for each element of batch its Jacobian will be calculated, we expect new tensor whose size is \[2, 3, 3\] will result when we use `jacrev` over `model_vec` and input `z`.

However, when tested, resulting tensor has the shape of \[2, 3, 2, 3\], with unwanted zero-vectors as row vectors.

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

To solve such a problem, batched-input processing, we can use `vmap` function from `torch.func` module.

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