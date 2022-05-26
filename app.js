const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

const { TranslationServiceClient } = require('@google-cloud/translate');
const { text } = require('express');
const translationClient = new TranslationServiceClient();

const projectId = 'sjov-oversaetter-1531150037182';
const location = 'global';

app.get('/', async (req, res) => {
  var text = 'Towards a shared Scandinavian language';
  if (req.query.q) text = req.query.q;
  res.render('home', {
    title: 'Skandinavisk',
    text: text,
    da: await translateText(text, 'en', 'da'),
    no: await translateText(text, 'en', 'no'),
    sv: await translateText(text, 'en', 'sv'),
  });
});

async function translateText(text, source, target) {
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain',
    sourceLanguageCode: source,
    targetLanguageCode: target,
  };

  const [response] = await translationClient.translateText(request);
  return response.translations[0].translatedText;
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
