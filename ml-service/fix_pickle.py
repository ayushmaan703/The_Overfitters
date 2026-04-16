# fix_pickle.py  — run this once from your project root
import pickle
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.feature_engineer import FeatureEngineer

# Monkey-patch __main__ so pickle can resolve the old reference
import __main__
__main__.FeatureEngineer = FeatureEngineer

# Load the broken pkl (now resolves because __main__.FeatureEngineer exists)
with open("model/tuned_pipeline.pkl", "rb") as f:
    pipeline = pickle.load(f)

# Re-save it — now bakes in utils.feature_engineer.FeatureEngineer
with open("model/tuned_pipeline.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("Done!")

# Verify
with open("model/tuned_pipeline.pkl", "rb") as f:
    data = f.read()

print("Has __main__:", b"__main__" in data)            # should be False
print("Has utils:", b"utils.feature_engineer" in data) # should be True