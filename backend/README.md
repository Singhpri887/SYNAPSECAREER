# SynapseCareer: AI & Machine Learning Recruitment Backend

A production-grade Python Deep Learning backend for student-job matching and career recommendation, reproducing the neural architecture depicted in the holographic AI interface.

---

## Architecture Overview

### 1. Neural Network Architecture (`backend/neural_engine.py`)
- **Input Dimension**: 20 normalized skill dimensions (`[0.0, 1.0]`)
- **Layer 1 (Dense)**: 64 hidden units, He/Kaiming normal initialization, LeakyReLU ($\alpha = 0.01$) activation
- **Regularization**: Inverted Dropout ($p = 0.15 - 0.20$)
- **Layer 2 (Dense)**: 32 hidden units, LeakyReLU activation
- **Classification Head**: 6-class Softmax cross-entropy for job archetype classification
- **Regression Head**: Linear projection for continuous suitability score ($0 - 100\%$)
- **Optimizer**: Adam ($\beta_1 = 0.9, \beta_2 = 0.999, \epsilon = 10^{-8}, \text{lr} = 0.003$)

### 2. Synthetic Dataset Generator (`backend/dataset_generator.py`)
- Generates 1,200 labeled student profiles with gaussian skill distributions across 20 technical skills.
- Evaluates non-linear synergy bonuses and computes ground-truth career affinities.
- Output: `backend/data/student_dataset.json`.

### 3. Model Training Pipeline (`backend/train_model.py`)
- 80/20 train/validation split.
- Mini-batch gradient descent across 30 epochs.
- Reached **99.58% validation accuracy** and exported model weights to `backend/data/model_weights.json`.

---

## REST API Endpoints (`backend/api_server.py`)

The server runs on `http://127.0.0.1:5000`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Status and neural network architecture specifications |
| `GET` | `/api/jobs` | Complete list of career archetypes and target skills |
| `GET` | `/api/candidates` | Sample candidate dataset from training repository |
| `GET` | `/api/metrics` | Epoch-by-epoch loss, validation accuracy, and top-2 accuracy |
| `POST` | `/api/match` | Real-time neural inference on student skills (computes match % & gap analysis) |
| `POST` | `/api/train` | Triggers a fresh re-training run on the server |

---

## Quickstart Commands

```bash
# 1. Generate fresh dataset
python backend/dataset_generator.py

# 2. Train the neural network
python backend/train_model.py

# 3. Start the API server
python backend/api_server.py
```
