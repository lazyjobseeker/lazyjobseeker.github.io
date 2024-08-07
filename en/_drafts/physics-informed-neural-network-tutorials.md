---
title: Physics Informed Neural Network (PINN) - PyTorch Tutorial
category: machine-learning
tags:
  - machine-learning
  - pytorch
created_at: 2024-08-05 20:19:54 UTC+09:00
last_modified_at: 2024-08-07 21:28:35 UTC+09:00
excerpt: Concepts of physics-informed neural network (PINN) and tutorial codes written and explained in python
---

**Physics-Informed Neural Network(PINN)** has been recently gathering a lot of attention in both of academia and industry.  There are a myriad of tutorials available, so you could start developing your own version of Python codes to solve various machine-learning problems if you can find underlying physical equations given in the form of (a set of) differential equations.

## Pre-requisites

Let's first make some code snippets for the network to be used and a `Dataset` object.

### Network Design

Unless re-declared, I will use simple feed-forward neural network having one hidden layer with 30 nodes throughout this post.

```python
import torch

class Net(torch.nn.Module):

    def __init__(self, indim=1, outdim=1):
        super().__init__()
        self.actf = torch.tanh
        self.lin1 = torch.nn.Linear(indim, 30)
        self.lin2 = torch.nn.Linear(30, outdim)

    def forward(self, x):
        x = self.lin1(x)
        x = self.lin2(self.actf(x))
        return x.squeeze()
```

### `Dataset` Class

Also we need to define customized version of `Dataset` class.

```python
from torch.utils.data import Dataset, DataLoader

class MyDataset(Dataset):

    def __init__(self, in_tensor, out_tensor):
        self.inp = in_tensor
        self.out = out_tensor

    def __len__(self):
        return len(self.inp)

    def __getitem__(self, idx):
        return self.inp[idx], self.out[idx]
```

## Example 1 - Heat Equation

### Problem Description

Let's consider below partial differential equation (1)

$$\frac{1}{2}\frac{\partial u}{\partial t} = \frac{\partial ^2 u}{\partial x^2} \tag{1} $$

You can easily find that below equation (2) is one of the possible solutions of (1).

$$ u(x,t) = e^{-2\pi^2 t}\sin(\pi x) \tag{2} $$

I will 1) generate dataset to train our model directly using the analytical solution (2) and compare the performance of NN with or without loss function engineering adopting PINN concept.

### Training Data Generation

First of all, we need to generate training dataset.

```python
import numpy as np
import matplotlib.pyplot as plt

def u(x, t):
    return np.exp(-2*np.pi*np.pi*t)*np.sin(np.pi*x)

pts = 500
ts = np.linspace(0.2, 0, pts)
xs = np.linspace(-5, 5, pts)

X, T = np.meshgrid(xs, ts)
U = u(X, T)

plt.imshow(U)
plt.colorbar()
```

{% include img-gdrive alt="Training Dataset" id="1-nq-kMS9bjJuF7rEXcADagfCP9UuYhdk" %}

You can see the sinusoidal fluctuation at $t=0$ at the bottom of the plot, which gradually diminuates as time lapses.

### Training Model without PINN

So far, so good.  Now I train a model without loss function engineering with PINN concept.

First of all, I build `MyDataset` and `Dataloader` instances using the data I generated above.

```python
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

train_in = torch.tensor([[x, t] for x, t in zip(X.flatten(), T.flatten())], dtype=torch.float32, requires_grad=True)
train_out = torch.tensor(u(X.flatten(), T.flatten()), dtype=torch.float32)

train_in.to(DEVICE)
train_out.to(DEVICE)

train_dataset = MyDataset(train_in, train_out)
train_dataloader = DataLoader(train_dataset, batch_size=256, shuffle=True)
```

Now I can train my model.

```python
from torch.optim import Adam
from torch.optim.lr_scheduler import LambdaLR
from torch.autograd import Variable

model = Net(indim=2, outdim=1).to(DEVICE)
epochs = 30
optimizer = Adam(model.parameters(), lr=0.1)
scheduler = LambdaLR(optimizer=optimizer,
                     lr_lambda=lambda epoch: 0.995**epoch,
                     last_epoch=-1)

loss_fcn = torch.nn.MSELoss()

for epoch in range(0, epochs):
    for batch_in, batch_out in train_dataloader:
        batch_in = Variable(batch_in, requires_grad=True)
        batch_in.to(DEVICE)
        batch_out.to(DEVICE)
        model.train()
        def closure():
            optimizer.zero_grad()
            loss = loss_fcn(model(batch_in), batch_out)
            loss.backward()
            return loss
        optimizer.step(closure)
    scheduler.step()
    model.eval()
    epoch_loss = loss_fcn(model(train_in), train_out)
    print(f'Epoch: {epoch+1} | Loss: {round(float(epoch_loss), 4)}')
```

Let's see the result.

```python
def u_model(xs, ts):
    pts = torch.tensor(np.array([[x, t] for x, t in zip(xs, ts)]), dtype=torch.float32)
    return model(pts)

pts = 500
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

### 