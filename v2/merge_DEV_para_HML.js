// Para executar este script, use o seguinte comando no terminal:
// node merge_DEV_para_HML.js

import { exec } from 'child_process';

// Função para executar comandos no terminal
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o comando: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

(async () => {
  try {
    console.log('Buscando as últimas alterações das branches remotas...');
    await runCommand('git fetch');

    console.log('Criando uma branch local temporária para o merge...');
    await runCommand('git checkout -b temp-merge origin/HML');

    console.log('Fazendo merge da branch remota DEV para HML...');
    await runCommand('git merge origin/DEV');

    console.log('Enviando alterações para a branch remota HML...');
    await runCommand('git push origin temp-merge:HML');

    console.log('Removendo a branch local temporária...');
    await runCommand('git checkout main'); // Voltar para uma branch segura
    await runCommand('git branch -D temp-merge');

    console.log('Processo concluído com sucesso!');
  } catch (error) {
    console.error('O processo falhou. Verifique os erros acima.');
  }
})();