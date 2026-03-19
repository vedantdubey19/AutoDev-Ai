import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    files_changed = np.random.negative_binomial(1, 0.1, n_samples)
    lines_added = np.random.exponential(100, n_samples).astype(int)
    lines_deleted = np.random.exponential(50, n_samples).astype(int)
    
    # Heuristics for bug introducing commits
    risk_score = (files_changed * 0.4) + (lines_added * 0.01) + (lines_deleted * 0.005)
    noise = np.random.normal(0, 1, n_samples)
    
    # Binary label: 1 if risk > some threshold, else 0
    is_buggy = (risk_score + noise > 3.0).astype(int)
    
    df = pd.DataFrame({
        'files_changed': files_changed,
        'lines_added': lines_added,
        'lines_deleted': lines_deleted,
        'is_buggy': is_buggy
    })
    return df

def train_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(2000)
    
    X = df[['files_changed', 'lines_added', 'lines_deleted']]
    y = df['is_buggy']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    accuracy = clf.score(X_test, y_test)
    print(f"Model trained. Validation Accuracy: {accuracy:.2f}")
    
    joblib.dump(clf, 'model.joblib')
    print("Saved model to 'model.joblib'")

if __name__ == '__main__':
    train_model()
