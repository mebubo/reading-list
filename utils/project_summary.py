import os

def dir_summary(directory_path):
    filenames = [filename for filename in os.listdir(directory_path) if os.path.isfile(filename)]
    prompt_first = [file_contents("PROMPT.md")] + [file_summary(f) for f in filenames
        if f != "PROMPT.md" and f != "shell.nix" and not f.endswith(".css") and not f.endswith(".html")]
    return "\n".join(prompt_first)

def file_contents(filename):
    with open(filename, 'r') as file:
        return file.read()

def file_summary(filename):
        s = f"""
{filename}:
```
{file_contents(filename)}
```
"""
        return(s)

directory_path = "."
print(dir_summary(directory_path))
