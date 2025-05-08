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
    console.log('Mudando para a branch PROD...');
    await runCommand('git checkout PROD');

    console.log('Fazendo merge da branch HML para PROD...');
    await runCommand('git merge HML');

    console.log('Enviando alterações para o repositório remoto...');
    await runCommand('git push origin PROD');

    console.log('Processo concluído com sucesso!');
  } catch (error) {
    console.error('O processo falhou. Verifique os erros acima.');
  }
})();