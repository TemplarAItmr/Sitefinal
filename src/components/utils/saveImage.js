const fs = require('fs');
const https = require('https');
const path = require('path');

// Função para baixar e salvar a imagem
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}

// URL da sua imagem do logo
const imageUrl = 'https://raw.githubusercontent.com/seu-usuario/seu-repo/main/logo.png';
const publicDir = path.join(process.cwd(), 'public');
const filepath = path.join(publicDir, 'logo.png');

// Criar diretório public se não existir
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Baixar e salvar a imagem
downloadImage(imageUrl, filepath)
  .then(console.log)
  .catch(console.error);