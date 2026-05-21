from sklearn.linear_model import LogisticRegression
import pickle

model = LogisticRegression(
    penalty='l2',
    C=0.1,
    solver='saga',
    max_iter=100,
    class_weight='balanced',
    tol=1e-4,
    warm_start=True,
    verbose=1,
    fit_intercept=True,
    random_state=42,
    n_jobs=-1
)

model_name = 'model224v2.pkl'

with open(model_name, 'wb') as f:
    pickle.dump(model, f)