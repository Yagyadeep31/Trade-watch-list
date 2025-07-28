const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }); // Port for your WebSocket server

let rowIdCounter = 0;
let gridData = [];

// Generate some initial data
for (let i = 0; i < 10; i++) {
    gridData.push(createNewRowData());
}

wss.on('connection', ws => {
    console.log('Client connected');

    // Send initial data to the connected client
    ws.send(JSON.stringify(gridData));

    // Start sending updates at a regular interval
    const interval = setInterval(() => {
        // Simulate data updates
        const randomIndex = Math.floor(Math.random() * gridData.length);
        const randomRow = gridData[randomIndex];
        randomRow.price = Math.floor(Math.random() * 100000) + 50000;
        randomRow.quantity = Math.floor(Math.random() * 100) + 1;

        // Send updated data
        ws.send(JSON.stringify([randomRow])); // Send an array with the updated row
    }, 1000); // Send updates every second

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

console.log('WebSocket server started on ws://localhost:8080');

function createNewRowData() {
    rowIdCounter++;
    const symbol = ['Toyota', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan'];
    const trendz = ['arrow_upward', 'arrow_downward', 'arrow_upward', 'arrow_downward', 'arrow_downward', 'arrow_downward'];
    const randomsymbol = symbol[Math.floor(Math.random() * makes.length)];
    const randomTrendz = trendz[Math.floor(Math.random() * models.length)];
    function getRandomDate(start, end) {
        const fromTime = start.getTime(); // Get milliseconds from start date
        const toTime = end.getTime();   // Get milliseconds from end date
        return new Date(fromTime + Math.random() * (toTime - fromTime)); // Calculate random point within the range and create new Date
      }
      
      const startDate = new Date(2020, 0, 1); // January 1, 2020
      const endDate = new Date(); // Current date and time
      const randomDate = getRandomDate(startDate, endDate);

    return {
        id: rowIdCounter,
        symbol: randomsymbol,
        trendz: randomTrendz,
        price: Math.floor(Math.random() * 100000) + 50000,
        quantity: Math.floor(Math.random() * 100) + 1,
        timestamp: randomDate 
    };
}