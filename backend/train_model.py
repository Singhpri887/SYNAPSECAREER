"""
Model Training Pipeline: AI-Powered Job & Recruitment Optimizer
Trains the Multi-Layer Perceptron neural network with Adam optimizer,
logs epoch telemetry, and exports model weights.
"""

import os
import json
import time
import numpy as np
from dataset_generator import SKILL_KEYS, JOB_ARCHETYPES, generate_dataset
from neural_engine import NeuralEngine

def prepare_tensors(dataset):
    """Converts student profile dictionaries into normalized feature tensors."""
    num_samples = len(dataset)
    num_features = len(SKILL_KEYS)
    num_classes = len(JOB_ARCHETYPES)

    X = np.zeros((num_samples, num_features), dtype=np.float32)
    y_one_hot = np.zeros((num_samples, num_classes), dtype=np.float32)
    y_labels = np.zeros(num_samples, dtype=np.int32)
    suitabilities = np.zeros((num_samples, num_classes), dtype=np.float32)

    for i, rec in enumerate(dataset):
        # 0.0 - 1.0 normalization
        for j, key in enumerate(SKILL_KEYS):
            X[i, j] = rec["skills"].get(key, 0) / 100.0

        best_idx = rec["best_job_idx"]
        y_labels[i] = best_idx
        y_one_hot[i, best_idx] = 1.0
        suitabilities[i] = np.array(rec["suitabilities"]) / 100.0

    return X, y_one_hot, y_labels, suitabilities

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def train():
    os.makedirs(DATA_DIR, exist_ok=True)
    dataset_file = os.path.join(DATA_DIR, "student_dataset.json")

    if not os.path.exists(dataset_file):
        print("Dataset not found. Generating fresh dataset...")
        data = generate_dataset(1500)
        with open(dataset_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    else:
        with open(dataset_file, "r", encoding="utf-8") as f:
            data = json.load(f)

    print(f"Loading {len(data)} student candidate records...")
    X, y_one_hot, y_labels, _ = prepare_tensors(data)

    # Train / Test split (80% / 20%)
    indices = np.arange(len(X))
    np.random.seed(1337)
    np.random.shuffle(indices)

    split = int(0.8 * len(X))
    train_idx, test_idx = indices[:split], indices[split:]

    X_train, y_train = X[train_idx], y_one_hot[train_idx]
    X_test, y_test_labels = X[test_idx], y_labels[test_idx]

    print(f"Dataset partitioned: {len(X_train)} training | {len(X_test)} validation samples")

    # Instantiate Neural Engine
    model = NeuralEngine(
        in_features=len(SKILL_KEYS),
        hidden_dim1=64,
        hidden_dim2=32,
        out_classes=len(JOB_ARCHETYPES)
    )

    epochs = 30
    batch_size = 32
    num_batches = int(np.ceil(len(X_train) / batch_size))
    history = []

    print("\n" + "=" * 70)
    print("🚀 INITIALIZING DEEP NEURAL RECRUITMENT MATCHING TRAINING")
    print("=" * 70)

    start_time = time.time()

    for epoch in range(1, epochs + 1):
        # Shuffle batches
        perm = np.random.permutation(len(X_train))
        X_shuffled = X_train[perm]
        y_shuffled = y_train[perm]

        epoch_loss = 0.0

        for b in range(num_batches):
            start_b = b * batch_size
            end_b = min(start_b + batch_size, len(X_train))
            xb = X_shuffled[start_b:end_b]
            yb = y_shuffled[start_b:end_b]

            probs, _ = model.forward(xb, training=True, dropout_rate=0.15)
            loss = model.compute_loss(probs, yb)
            epoch_loss += loss * len(xb)

            model.backward_and_step(xb, yb, lr=0.003)

        train_loss = epoch_loss / len(X_train)

        # Validation evaluation
        val_probs, _ = model.forward(X_test, training=False)
        val_preds = np.argmax(val_probs, axis=1)
        val_acc = np.mean(val_preds == y_test_labels) * 100.0

        # Top-2 accuracy
        top2_preds = np.argsort(val_probs, axis=1)[:, -2:]
        val_top2_acc = np.mean([y_test_labels[i] in top2_preds[i] for i in range(len(y_test_labels))]) * 100.0

        history.append({
            "epoch": epoch,
            "loss": round(float(train_loss), 4),
            "val_accuracy": round(float(val_acc), 2),
            "val_top2_accuracy": round(float(val_top2_acc), 2)
        })

        if epoch % 5 == 0 or epoch == 1 or epoch == epochs:
            print(f"[EPOCH {epoch:02d}/{epochs:02d}] Loss: {train_loss:.4f} | Val Accuracy: {val_acc:.2f}% | Top-2 Match: {val_top2_acc:.2f}%")

    total_duration = time.time() - start_time
    print("=" * 70)
    print(f"✨ Training completed in {total_duration:.2f}s! Final Accuracy: {val_acc:.2f}%")

    # Save model weights & training history
    weights_path = os.path.join(DATA_DIR, "model_weights.json")
    model.save_weights(weights_path)
    print(f"Model weights saved to {weights_path}")

    history_path = os.path.join(DATA_DIR, "training_history.json")
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

if __name__ == "__main__":
    train()
