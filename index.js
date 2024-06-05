require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const OpenAI = require('openai');

// Configure a API KEY da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Substitua 'SUA_API_KEY_AQUI' pela sua chave da API da OpenAI
});

// Função para ler o arquivo .txt
function readFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Função para interagir com a API da OpenAI
async function getOpenAIResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use um modelo atualizado
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(
        'Erro ao chamar a API da OpenAI:',
        error.status,
        error.message,
        error.code,
        error.type
      );
    } else {
      console.error('Erro:', error);
    }
    return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
  }
}

// Função para iniciar o chat
async function startChat(filePath) {
  const fileContent = await readFileContent(filePath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    'Chat iniciado. Faça suas perguntas com base no contexto do arquivo.'
  );

  rl.on('line', async (input) => {
    const prompt = `${fileContent}\n\nPergunta: ${input}\nResposta:`;
    const response = await getOpenAIResponse(prompt);
    console.log(response);
    console.log('\nFaça outra pergunta ou pressione Ctrl+C para sair.');
  });
}

// Caminho para o arquivo .txt
const filePath = 'data/data.txt'; // Substitua 'caminho/do/seu/arquivo.txt' pelo caminho do seu arquivo .txt

startChat(filePath);
