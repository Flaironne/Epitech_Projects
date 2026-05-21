from sklearn.linear_model import LogisticRegression
import pickle

model = LogisticRegression(
    penalty='l2',
    C=0.5,
    solver='saga',
    max_iter=1000,
    class_weight='balanced',
    tol=1e-3,
    warm_start=True,
    verbose=1
)

model_name = 'model224v2.pkl'

with open(model_name, 'wb') as f:
    pickle.dump(model, f)