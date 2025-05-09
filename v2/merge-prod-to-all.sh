#!/bin/bash
# para executar o script, use o comando: ./merge-prod-to-all.sh
# Este script faz o merge da branch PRODUCAO para todas as demais branches

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

# Certifique-se de que a branch PRODUCAO existe
git fetch origin
if ! git show-ref --verify --quiet refs/heads/PRODUCAO; then
  echo "A branch PRODUCAO não existe."
  exit 1
fi

# Obtém todas as branches locais e remotas
echo "Listando todas as branches..."
branches=$(git branch -r | grep -v "origin/PRODUCAO" | grep -v "HEAD" | sed 's/origin\///')

# Itera sobre cada branch e realiza o merge
echo "Iniciando o merge da branch PRODUCAO para todas as branches..."
for branch in $branches; do
  echo "\n---\nTrocando para a branch $branch..."
  git checkout $branch

  echo "Atualizando a branch $branch com rebase..."
  git pull --rebase origin $branch

  echo "Fazendo merge da branch PRODUCAO para $branch..."
  git merge PRODUCAO --no-ff

  echo "Enviando alterações para o repositório remoto..."
  git push origin $branch

done

# Volta para a branch PRODUCAO
echo "\n---\nVoltando para a branch PRODUCAO..."
git checkout PRODUCAO

echo "Merge concluído com sucesso para todas as branches!"
