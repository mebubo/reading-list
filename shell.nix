let

    pkgs = import <nixpkgs> {};

    py = pkgs.python3.withPackages (p: with p; [
        transformers
        ipywidgets
    ]);

in

    pkgs.mkShell {
        buildInputs = with pkgs; [
            py
            jupyter
            wl-clipboard
        ];
    }
