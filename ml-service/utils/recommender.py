import pandas as pd
import shap


REQUIRED_FIELDS = [
    "person_age", "person_income", "person_emp_exp", "credit_score",
    "loan_amnt", "loan_int_rate", "loan_term",
    "loan_intent", "person_home_ownership", "cb_person_default_on_file",
]


def derive_loan_grade(credit_score: float) -> str:
    if   credit_score >= 750: return "A"
    elif credit_score >= 700: return "B"
    elif credit_score >= 650: return "C"
    elif credit_score >= 600: return "D"
    elif credit_score >= 550: return "E"
    else:                     return "F"


def normalize_input(input_data: dict) -> dict:
    data = input_data.copy()

    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        raise ValueError(f"Missing required fields: {missing}")

    if "person_emp_length" in data and "person_emp_exp" not in data:
        data["person_emp_exp"] = data["person_emp_length"]

    val = str(data["cb_person_default_on_file"]).strip().upper()
    data["previous_loan_defaults_on_file"] = 1 if val == "Y" else 0

    data["loan_percent_income"] = round(
        data["loan_amnt"] / (data["person_income"] + 1), 4
    )

    data["loan_grade"] = derive_loan_grade(data["credit_score"])
    data["cb_person_cred_hist_length"] = max(1, int(data["person_age"]) - 18)

    data.setdefault("person_gender",    "Male")
    data.setdefault("person_education", "Bachelor")

    return data


def explain_risk(input_df: pd.DataFrame, model) -> list[tuple[str, float]]:
    """Returns top 5 SHAP factors as list of (feature_name, shap_value)."""
    fe_step       = model.named_steps["feature_engineering"]
    preprocessor  = model.named_steps["preprocessor"]
    xgb_model     = model.named_steps["model"]

    fe_transformed  = fe_step.transform(input_df)
    transformed     = preprocessor.transform(fe_transformed)

    explainer   = shap.TreeExplainer(xgb_model)
    shap_values = explainer.shap_values(transformed)

    if isinstance(shap_values, list):
        vals = shap_values[1][0]
    else:
        vals = shap_values[0]

    feature_names = preprocessor.get_feature_names_out()
    explanation   = [(name, float(val)) for name, val in zip(feature_names, vals)]
    explanation   = sorted(explanation, key=lambda x: abs(x[1]), reverse=True)
    return explanation[:5]


def generate_recommendations(input_data: dict, model, target_risk: float = 0.35) -> dict:
    raw_data   = input_data.copy()          # ← keep original BEFORE normalization
    normalized = normalize_input(raw_data)
    input_df   = pd.DataFrame([normalized])
    base_risk  = float(model.predict_proba(input_df)[0][1])
    recommendations = []

    if base_risk <= target_risk:
        return {"message": "Loan is already safe", "risk": base_risk}

    # Option A: reduce loan amount
    for pct in [0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30]:
        new_data = raw_data.copy()                        # ← copy from raw, not normalized
        new_data["loan_amnt"] = int(raw_data["loan_amnt"] * pct)
        new_norm = normalize_input(new_data)              # ← fresh normalization
        new_risk = float(model.predict_proba(pd.DataFrame([new_norm]))[0][1])

        if new_risk <= target_risk:
            recommendations.append({
                "type":     "Reduce Loan Amount",
                "new_loan": new_norm["loan_amnt"],
                "pct_kept": pct,
                "risk":     new_risk,
                "impact":   round(base_risk - new_risk, 4),
            })
            break

    # Option B: extend loan tenure
    current_term = raw_data.get("loan_term", 0)           # ← read from raw
    for tenure_months in [36, 48, 60, 84, 120]:
        if tenure_months <= current_term:
            continue
        new_data = raw_data.copy()                        # ← copy from raw
        new_data["loan_term"] = tenure_months
        new_norm = normalize_input(new_data)              # ← fresh normalization
        new_risk = float(model.predict_proba(pd.DataFrame([new_norm]))[0][1])

        if new_risk <= target_risk:
            recommendations.append({
                "type":       "Extend Tenure",
                "new_tenure": tenure_months,
                "risk":       new_risk,
                "impact":     round(base_risk - new_risk, 4),
            })
            break

    recommendations.sort(key=lambda x: (-x["impact"], x["risk"]))
    return {"base_risk": base_risk, "recommendations": recommendations}


def get_advice_data(input_data: dict, model) -> dict:
    data_norm  = normalize_input(input_data)
    input_df   = pd.DataFrame([data_norm])

    risk        = float(model.predict_proba(input_df)[0][1])
    explanation = explain_risk(input_df, model)
    recs        = generate_recommendations(input_data, model)

    # Fallback when generate_recommendations returns nothing actionable
    if not recs.get("message") and not recs.get("recommendations"):
        recs = {
            "base_risk": risk,
            "recommendations": [],
            "message": "No simple fix found — consider reducing loan significantly or improving credit score."
        }

    return {
        "risk_score": risk,
        "category": (
            "Low Risk"    if risk < 0.3 else
            "Medium Risk" if risk < 0.7 else
            "High Risk"
        ),
        "loan_grade": data_norm["loan_grade"],
        "top_risk_factors": [
            {
                "feature":    feat,
                "shap_value": val,
                "direction":  "increases risk" if val > 0 else "decreases risk",
            }
            for feat, val in explanation
        ],
        "recommendations": recs,
    }