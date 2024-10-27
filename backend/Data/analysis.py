import pandas as pd
import numpy as np

df = pd.read_csv("prisoners_dilemma_scores_1.csv")

df.columns = ["player1", "player2"]

print(df.sum())