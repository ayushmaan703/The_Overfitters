from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os

from utils.feature_engineer import FeatureEngineer  # required for pickle to deserialize

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model", "tuned_pipeline.pkl")

model = pickle.load(open(model_path, "rb"))


class LoanInput(BaseModel):
    person_age: float
    person_gender: str
    person_education: str
    person_income: float
    person_emp_exp: float
    person_home_ownership: str
    loan_amnt: float
    loan_intent: str
    loan_int_rate: float
    loan_percent_income: float
    cb_person_cred_hist_length: float
    credit_score: float
    previous_loan_defaults_on_file: str


@app.post("/predict")
def predict(data: LoanInput):
    try:
        import pandas as pd

        input_df = pd.DataFrame([data.model_dump()])

        prediction = model.predict_proba(input_df)[0][1]

        return {
            "risk_score": float(prediction),
            "category": (
                "Low Risk" if prediction < 0.3 else
                "Medium Risk" if prediction < 0.7 else
                "High Risk"
            )
        }

    except Exception as e:
        return {"error": str(e)}