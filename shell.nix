{ pkgs ? import <nixpkgs> { overlays = [ (final: prev: { nodejs = prev.nodejs_20; }) ]; } }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs
    nest-cli
    nodePackages.npm
    nodePackages.typescript-language-server
    nodePackages.eslint
    nodePackages.vscode-langservers-extracted
    nodePackages.typescript
    nodePackages.ts-node
  ];
}
