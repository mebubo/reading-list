let

    pkgs = import <nixpkgs> {};

    py = pkgs.python3.withPackages (p: with p; [
        tiktoken
        ipywidgets
    ]);

    prompt-generate = pkgs.writeShellScriptBin "prompt-generate" ''
        ${py}/bin/python3 utils/project_summary.py
    '';

    tokens-count = pkgs.writeShellScriptBin "tokens-count" ''
        ${py}/bin/python3 utils/tokens.py
    '';

    prompt-copy = pkgs.writeShellScriptBin "prompt-copy" ''
        ${prompt-generate}/bin/prompt-generate | ${pkgs.wl-clipboard}/bin/wl-copy
    '';

    prompt-tokens-count = pkgs.writeShellScriptBin "prompt-tokens-count" ''
        ${prompt-generate}/bin/prompt-generate | ${tokens-count}/bin/tokens-count
    '';
in

    pkgs.mkShell {
        buildInputs = with pkgs; [
            py
            jupyter

            prompt-generate
            tokens-count
            prompt-copy
            prompt-tokens-count
        ];
    }
