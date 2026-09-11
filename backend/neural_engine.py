"""
Deep Multi-Layer Perceptron Neural Engine
Built with NumPy vectorized operations, reproducing the architecture
displayed on the holographic interface:
Input -> Dense(64, LeakyReLU) -> Dropout(0.2) -> Dense(32, LeakyReLU) -> Softmax & Regression
"""

import json
import numpy as np

class NeuralEngine:
    def __init__(self, in_features=20, hidden_dim1=64, hidden_dim2=32, out_classes=6):
        self.in_features = in_features
        self.hidden_dim1 = hidden_dim1
        self.hidden_dim2 = hidden_dim2
        self.out_classes = out_classes

        # Initialize Weights (He/Kaiming Normal for LeakyReLU)
        self.W1 = np.random.randn(in_features, hidden_dim1) * np.sqrt(2.0 / in_features)
        self.b1 = np.zeros((1, hidden_dim1))

        self.W2 = np.random.randn(hidden_dim1, hidden_dim2) * np.sqrt(2.0 / hidden_dim1)
        self.b2 = np.zeros((1, hidden_dim2))

        # Classification Head (Softmax)
        self.W3 = np.random.randn(hidden_dim2, out_classes) * np.sqrt(2.0 / hidden_dim2)
        self.b3 = np.zeros((1, out_classes))

        # Suitability Score Regression Head (predicts continuous 0-100 score)
        self.W_reg = np.random.randn(hidden_dim2, 1) * np.sqrt(2.0 / hidden_dim2)
        self.b_reg = np.zeros((1, 1))

        # Adam Optimizer Momentums
        self.m_W1 = np.zeros_like(self.W1); self.v_W1 = np.zeros_like(self.W1)
        self.m_b1 = np.zeros_like(self.b1); self.v_b1 = np.zeros_like(self.b1)
        self.m_W2 = np.zeros_like(self.W2); self.v_W2 = np.zeros_like(self.W2)
        self.m_b2 = np.zeros_like(self.b2); self.v_b2 = np.zeros_like(self.b2)
        self.m_W3 = np.zeros_like(self.W3); self.v_W3 = np.zeros_like(self.W3)
        self.m_b3 = np.zeros_like(self.b3); self.v_b3 = np.zeros_like(self.b3)
        self.t = 0

    @staticmethod
    def leaky_relu(x, alpha=0.01):
        return np.where(x > 0, x, x * alpha)

    @staticmethod
    def leaky_relu_derivative(x, alpha=0.01):
        dx = np.ones_like(x)
        dx[x <= 0] = alpha
        return dx

    @staticmethod
    def softmax(x):
        exp_shifted = np.exp(x - np.max(x, axis=-1, keepdims=True))
        return exp_shifted / np.sum(exp_shifted, axis=-1, keepdims=True)

    def forward(self, X, training=False, dropout_rate=0.2):
        """Forward pass through the neural network."""
        # Layer 1
        self.Z1 = np.dot(X, self.W1) + self.b1
        self.A1 = self.leaky_relu(self.Z1)

        # Inverted Dropout
        if training and dropout_rate > 0:
            self.mask1 = (np.random.rand(*self.A1.shape) >= dropout_rate) / (1.0 - dropout_rate)
            self.A1_drop = self.A1 * self.mask1
        else:
            self.A1_drop = self.A1

        # Layer 2
        self.Z2 = np.dot(self.A1_drop, self.W2) + self.b2
        self.A2 = self.leaky_relu(self.Z2)

        # Output Heads
        self.Z3 = np.dot(self.A2, self.W3) + self.b3
        self.probs = self.softmax(self.Z3)

        # Continuous Regression Output
        self.pred_score = np.dot(self.A2, self.W_reg) + self.b_reg

        return self.probs, self.pred_score

    def compute_loss(self, probs, y_true_one_hot):
        """Categorical Cross-Entropy Loss with epsilon smoothing."""
        eps = 1e-9
        clipped_probs = np.clip(probs, eps, 1.0 - eps)
        return -np.mean(np.sum(y_true_one_hot * np.log(clipped_probs), axis=-1))

    def backward_and_step(self, X, y_true_one_hot, lr=0.005, beta1=0.9, beta2=0.999, eps=1e-8):
        """Computes analytical gradients and applies Adam optimization step."""
        batch_size = X.shape[0]
        self.t += 1

        # Softmax cross-entropy gradient: dZ3 = probs - y_true
        dZ3 = (self.probs - y_true_one_hot) / batch_size
        dW3 = np.dot(self.A2.T, dZ3)
        db3 = np.sum(dZ3, axis=0, keepdims=True)

        # Backprop through Layer 2
        dA2 = np.dot(dZ3, self.W3.T)
        dZ2 = dA2 * self.leaky_relu_derivative(self.Z2)
        dW2 = np.dot(self.A1_drop.T, dZ2)
        db2 = np.sum(dZ2, axis=0, keepdims=True)

        # Backprop through Dropout & Layer 1
        dA1 = np.dot(dZ2, self.W2.T)
        if hasattr(self, 'mask1'):
            dA1 = dA1 * self.mask1
        dZ1 = dA1 * self.leaky_relu_derivative(self.Z1)
        dW1 = np.dot(X.T, dZ1)
        db1 = np.sum(dZ1, axis=0, keepdims=True)

        # Adam Optimizer updates
        for param, grad, m, v in [
            (self.W1, dW1, self.m_W1, self.v_W1),
            (self.b1, db1, self.m_b1, self.v_b1),
            (self.W2, dW2, self.m_W2, self.v_W2),
            (self.b2, db2, self.m_b2, self.v_b2),
            (self.W3, dW3, self.m_W3, self.v_W3),
            (self.b3, db3, self.m_b3, self.v_b3),
        ]:
            m[:] = beta1 * m + (1 - beta1) * grad
            v[:] = beta2 * v + (1 - beta2) * (grad ** 2)
            m_hat = m / (1.0 - beta1 ** self.t)
            v_hat = v / (1.0 - beta2 ** self.t)
            param -= lr * m_hat / (np.sqrt(v_hat) + eps)

    def save_weights(self, filepath):
        """Serializes neural weights to a JSON file."""
        weights = {
            "W1": self.W1.tolist(), "b1": self.b1.tolist(),
            "W2": self.W2.tolist(), "b2": self.b2.tolist(),
            "W3": self.W3.tolist(), "b3": self.b3.tolist(),
            "W_reg": self.W_reg.tolist(), "b_reg": self.b_reg.tolist(),
            "meta": {
                "in_features": self.in_features,
                "hidden_dim1": self.hidden_dim1,
                "hidden_dim2": self.hidden_dim2,
                "out_classes": self.out_classes
            }
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(weights, f)

    def load_weights(self, filepath):
        """Loads serialized weights from disk."""
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.W1 = np.array(data["W1"])
        self.b1 = np.array(data["b1"])
        self.W2 = np.array(data["W2"])
        self.b2 = np.array(data["b2"])
        self.W3 = np.array(data["W3"])
        self.b3 = np.array(data["b3"])
        self.W_reg = np.array(data["W_reg"])
        self.b_reg = np.array(data["b_reg"])
