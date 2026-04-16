import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin


class FeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()

        if 'previous_loan_defaults_on_file' in X.columns:
            X['previous_loan_defaults_on_file'] = (
                X['previous_loan_defaults_on_file']
                .astype(str)
                .str.strip()
                .str.upper()
                .map({'Y': 1, 'N': 0})
                .fillna(0)
                .astype(float)
            )

        numeric_cols = [
            'person_income', 'loan_amnt', 'loan_int_rate',
            'loan_percent_income', 'credit_score', 'person_emp_exp'
        ]
        for col in numeric_cols:
            if col in X.columns:
                X[col] = pd.to_numeric(X[col], errors='coerce')

        X['loan_to_income_ratio'] = X['loan_amnt'] / (X['person_income'] + 1)
        X['monthly_income'] = X['person_income'] / 12
        X['estimated_emi'] = (X['loan_amnt'] * X['loan_int_rate']) / 12
        X['dti_estimated'] = X['estimated_emi'] / (X['monthly_income'] + 1)

        income_norm = X['person_income'] / X['person_income'].max()
        exp_norm = X['person_emp_exp'] / X['person_emp_exp'].max()

        X['income_stability_score'] = (0.7 * income_norm + 0.3 * exp_norm)
        X['income_stability_score'] -= 0.2 * X['previous_loan_defaults_on_file']

        X['credit_utilization_proxy'] = X['loan_amnt'] / (X['credit_score'] * 100 + 1)

        X['risk_index'] = (
            X['loan_percent_income'] * 0.5 +
            (700 - X['credit_score']) * 0.3 +
            X['previous_loan_defaults_on_file'] * 0.2
        )

        return X