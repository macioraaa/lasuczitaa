const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Wczytaj licznik wiadomości z pliku, jeśli istnieje, lub ustaw go na 0
const countFile = path.join(__dirname, 'count.json');
let messageCount = 0;

if (fs.existsSync(countFile)) {
  const data = fs.readFileSync(countFile, 'utf-8');
  const parsedData = JSON.parse(data);
  messageCount = parsedData.count || 0;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const CHANNEL_ID = 1332808818169610291

client.once('ready', () => {
  console.log('Bot is ready!');
  const channel = client.channels.cache.get(CHANNEL_ID);

  // Funkcja do zmiany nazwy kanału
  function updateChannelName() {
    const newName = `legitcheck-${messageCount}`;
    channel.setName(newName)
      .then(() => console.log(`Nazwa kanału została zmieniona na: ${newName}`))
      .catch(err => console.error('Błąd podczas zmiany nazwy kanału:', err));
  }

  // Zmiana nazwy kanału na podstawie liczby wiadomości
  updateChannelName();
  
  // Obsługuje nowo wysłane wiadomości
  client.on('messageCreate', message => {
    if (message.channel.id === CHANNEL_ID) {
      messageCount++;

      // Po każdej zmianie liczby wiadomości zapisujemy do pliku
      fs.writeFileSync(countFile, JSON.stringify({ count: messageCount }), 'utf-8');

      // Zmiana nazwy kanału po każdej wiadomości
      updateChannelName();
    }
  });
});
