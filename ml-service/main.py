from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import joblib
import pandas as pd
import os

app = FastAPI()

model = None
if os.path.exists("model.joblib"):
    model = joblib.load("model.joblib")

class CommitMetadata(BaseModel):
    files_changed: int
    lines_added: int
    lines_deleted: int

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/predict")
def predict_risk(data: CommitMetadata):
    if not model:
        # Fallback if model not trained
        return {"risk_score": 0.5, "risk_level": "Medium", "error": "Model not loaded"}
        
    df = pd.DataFrame([{
        'files_changed': data.files_changed,
        'lines_added': data.lines_added,
        'lines_deleted': data.lines_deleted
    }])
    
    # Get probability of class 1 (buggy)
    prob = model.predict_proba(df)[0][1]
    
    level = "Low"
    if prob > 0.7:
        level = "High"
    elif prob > 0.4:
        level = "Medium"
        
    return {
        "risk_score": float(prob),
        "risk_level": level
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
