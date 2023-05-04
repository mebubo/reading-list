import sys
from transformers import GPT2Tokenizer

text = sys.stdin.read()
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokens = tokenizer.tokenize(text)
print(len(tokens))