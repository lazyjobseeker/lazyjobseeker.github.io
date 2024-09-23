function sigmoid(k, x) {
    return 1 / (1 + Math.exp(-k*x));
  }
function step(k, a, b, x) {
  return sigmoid(k, x-a)*sigmoid(k, b-x);
  }
function gibbs(k, x) {
  return 0.5*x*x*sigmoid(1000, x)*sigmoid(1000, k-x) + Math.max(k*(x-k)+0.5*k*k, 0)*sigmoid(1000, (x-k));
  }
function parabola(x) {
  return x*x;
  }