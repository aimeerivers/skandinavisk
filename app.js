const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));

const { TranslationServiceClient } = require('@google-cloud/translate');
const { text } = require('express');
const translationClient = new TranslationServiceClient();

const projectId = 'sjov-oversaetter-1531150037182';
const location = 'global';

app.get('/', async (req, res) => {
  var text = '';
  var da, no, sv = '';

  var direction = 1;
  if (req.query.d && req.query.d == 'Skandinavisk understanding') direction = 2;

  if (req.query.q) text = req.query.q;
  if(text !== '') {
    if(direction == 1) {
      da = await translateText(text, 'en-GB', 'da-DK');
      no = await translateText(text, 'en-GB', 'nb-NO');
      sv = await translateText(text, 'en-GB', 'sv-SE');
    } else {
      da = await translateText(text, 'da-DK', 'en-GB');
      no = await translateText(text, 'nb-NO', 'en-GB');
      sv = await translateText(text, 'sv-SE', 'en-GB');
    }
  }

  res.render('home', {
    title: 'Skandinavisk',
    text: text,
    da: da,
    no: no,
    sv: sv,
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
