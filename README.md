# Guess The Gibberish

## Getting Started
### Prerequisites
Ensure that you have the following installed
* npm
* redis-server

### Installation
1. Clone the repo
```
git clone https://github.com/ryanmt95/gibberish.git
cd gibberish
```
2. Install NPM packages
```
cd gibberish_server
npm install
cd ../gibberish_client
npm install
```
3. Add a `.env` file in the `gibberish_server` folder and insert this line
```
MONGODB_URL="mongodb+srv://gibberish:Escalade242@gibberish.nmufr.mongodb.net/Gibberish?retryWrites=true&w=majority"
```
4. Run your redis-server, server and client
```
redis-server    // Run the redis-server
node app.js     // In gibberish_server folder
npm start       // In gibberish_client folder
```
