const fs = require('fs');
const openai = require('openai');

// Configure a chave da API da OpenAI
const OPENAI_API_KEY = '';
const openaiClient = new openai.OpenAIApi(OPENAI_API_KEY);

// Função para ler o arquivo .txt
function lerArquivo(caminho) {
  return new Promise((resolve, reject) => {
    fs.readFile(caminho, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Função para enviar uma pergunta à API da OpenAI
async function perguntarAI(pergunta, contexto) {
  try {
    const resposta = await openaiClient.completion.create({
      engine: 'davinci',
      prompt: contexto + '\nQ: ' + pergunta + '\nA:',
      max_tokens: 50,
    });
    return resposta.choices[0].text.trim();
  } catch (error) {
    console.error('Erro ao perguntar à API da OpenAI:', error);
    return 'Desculpe, ocorreu um erro ao processar sua pergunta.';
  }
}

// Função principal
async function main() {
  try {
    // Ler o arquivo .txt
    const contexto = await lerArquivo('data/data.txt');

    // Loop de chat
    while (true) {
      // Ler uma pergunta do usuário
      const pergunta = 'Qual é a sua pergunta? ';
      const respostaUsuario = await perguntarAI(pergunta, contexto);
      console.log('Usuário:', pergunta);

      // Responder à pergunta do usuário
      console.log('Bot:', respostaUsuario);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Iniciar o chat
main();
