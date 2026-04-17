from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import os
import pandas as pd

from utils.feature_engineer import FeatureEngineer  # required for pickle
from utils.recommender import (
    normalize_input,
    generate_recommendations,
    get_advice_data,
)

app = FastAPI()

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model", "tuned_pipeline.pkl")

model = pickle.load(open(model_path, "rb"))


# ── Input schema ──────────────────────────────────────────────────────────────

class LoanInput(BaseModel):
    person_age: float
    person_gender: str = "Male"
    person_education: str = "Bachelor"
    person_income: float
    person_emp_exp: float
    person_home_ownership: str
    loan_amnt: float
    loan_intent: str
    loan_int_rate: float
    loan_term: int
    credit_score: float
    cb_person_default_on_file: str        # "Y" or "N"


# ── /predict ──────────────────────────────────────────────────────────────────

@app.post("/predict")
def predict(data: LoanInput):
    try:
        normalized = normalize_input(data.model_dump())
        input_df   = pd.DataFrame([normalized])
        prediction = float(model.predict_proba(input_df)[0][1])

        return {
            "risk_score": prediction,
            "category": (
                "Low Risk"    if prediction < 0.3 else
                "Medium Risk" if prediction < 0.7 else
                "High Risk"
            ),
            "loan_grade": normalized["loan_grade"],
        }

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /recommend ────────────────────────────────────────────────────────────────

@app.post("/recommend")
def recommend(data: LoanInput):
    try:
        return generate_recommendations(data.model_dump(), model)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /advice  (risk + SHAP + recommendations in one call) ─────────────────────

@app.post("/advice")
def advice(data: LoanInput):
    try:
        return get_advice_data(data.model_dump(), model)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))