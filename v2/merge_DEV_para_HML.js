// Para executar este script, use o seguinte comando no terminal:
// node merge_HML_para_PROD.js

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
    console.log('Mudando para a branch HML...');
    await runCommand('git checkout HML');

    console.log('Fazendo merge da branch DEV para HML...');
    await runCommand('git merge DEV');

    console.log('Enviando alterações para o repositório remoto...');
    await runCommand('git push origin HML');

    console.log('Processo concluído com sucesso!');
  } catch (error) {
    console.error('O processo falhou. Verifique os erros acima.');
  }
})();