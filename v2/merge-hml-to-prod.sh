#!/bin/bash

# Este script faz o merge da branch HML para a branch PRODUCAO

# Saia imediatamente se um comando falhar
set -e

# Verifica se está em um repositório Git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Este script deve ser executado dentro de um repositório Git."
  exit 1
fi

# Verifica se há alterações não salvas na branch atual
echo "Verificando alterações não salvas..."
if ! git diff-index --quiet HEAD --; then
  echo "Há alterações não salvas. Por favor, faça commit ou stash antes de continuar."
  exit 1
fi

# Certifique-se de que as branches HML e PRODUCAO existem
git fetch origin
if ! git show-ref --verify --quiet refs/heads/HML; then
  echo "A branch HML não existe."
  exit 1
fi
if ! git show-ref --verify --quiet refs/heads/PRODUCAO; then
  echo "A branch PRODUCAO não existe."
  exit 1
fi

# Troca para a branch PRODUCAO
echo "Mudando para a branch PRODUCAO..."
git checkout PRODUCAO

# Atualiza a branch PRODUCAO local com rebase para integrar alterações divergentes
echo "Atualizando a branch PRODUCAO local com rebase..."
git pull --rebase origin PRODUCAO

# Faz o merge da branch HML para a branch PRODUCAO
echo "Fazendo merge da branch HML para a branch PRODUCAO..."
git merge HML --no-ff

# Push para o repositório remoto
echo "Enviando alterações para o repositório remoto..."
git push origin PRODUCAO

echo "Merge concluído com sucesso!"
