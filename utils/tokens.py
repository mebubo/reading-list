import sys
import tiktoken

text = sys.stdin.read()
encoder = tiktoken.encoding_for_model("gpt-4")

tokens = encoder.encode(text)
print(len(tokens))