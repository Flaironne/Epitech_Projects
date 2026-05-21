from sklearn.linear_model import LogisticRegression
import pickle

model = LogisticRegression(
    penalty='l2',
    dual=False,
    tol=1e-3,
    C=0.5,
    fit_intercept=True,
    intercept_scaling=1,
    class_weight='balanced',
    random_state=None,
    solver='saga',
    max_iter=500,
    multi_class='auto',
    verbose=1,
    warm_start=True,
    n_jobs=None,
    l1_ratio=None
)

model_name = 'model224v2.pkl'

with open(model_name, 'wb') as f:
    pickle.dump(model, f)
