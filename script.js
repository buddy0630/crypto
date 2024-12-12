async function fetchMarketData() {
    const hotCoinsElement = document.getElementById('hot-coins');
    const topGainersElement = document.getElementById('top-gainers');
    const topLosersElement = document.getElementById('top-losers');
    const coinsTableBody = document.getElementById('coins-table').getElementsByTagName('tbody')[0];
    const timerElement = document.getElementById('update-timer');

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const data = await response.json();

        // Helper function to create coin HTML
        function createCoinHTML(coin, isGainer = false, isLoser = false) {
            const price = coin.current_price;
            const change = coin.price_change_percentage_24h;
            const changeClass = change >= 0 ? 'positive' : 'negative';

            return `
                <div class="coin">
                    <img src="${coin.image}" alt="${coin.name} logo">
                    <div class="coin-details">
                        <h3>${coin.name}</h3>
                        <p class="coin-price">Price: $${price.toFixed(2)}</p>
                        <p class="coin-change ${changeClass}">24h Change: ${change.toFixed(2)}%</p>
                    </div>
                </div>
            `;
        }

        // Update Hot Coins Section
        hotCoinsElement.innerHTML = data.slice(0, 3).map(coin => createCoinHTML(coin)).join('');

        // Update Top Gainers Section
        const topGainers = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);
        topGainersElement.innerHTML = topGainers.map(coin => createCoinHTML(coin)).join('');

        // Update Top Losers Section
        const topLosers = [...data].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);
        topLosersElement.innerHTML = topLosers.map(coin => createCoinHTML(coin)).join('');

        // Update Coin Table
        coinsTableBody.innerHTML = data.map(coin => {
            const price = coin.current_price;
            const change = coin.price_change_percentage_24h;
            const volume = coin.total_volume;
            const marketCap = coin.market_cap;
            const changeClass = change >= 0 ? 'positive' : 'negative';

            return `
                <tr>
                    <td>
                        <img src="${coin.image}" alt="${coin.name} logo">
                        ${coin.name}
                    </td>
                    <td>$${price.toFixed(2)}</td>
                    <td class="${changeClass}">${change.toFixed(2)}%</td>
                    <td>$${volume.toLocaleString()}</td>
                    <td>$${marketCap.toLocaleString()}</td>
                </tr>
            `;
        }).join('');

        // Update Timer
        const now = new Date();
        timerElement.textContent = `Last updated: ${now.toLocaleTimeString()}`;

    } catch (error) {
        console.error('Error fetching market data:', error);
        
        // Error handling for each section
        [hotCoinsElement, topGainersElement, topLosersElement].forEach(element => {
            element.innerHTML = '<p>Error loading data. Please try again later.</p>';
        });
        
        coinsTableBody.innerHTML = '<tr><td colspan="5">Error loading data. Please check your connection.</td></tr>';
    }
}

// Fetch data on page load
fetchMarketData();

// Refresh data every minute
setInterval(fetchMarketData, 60000);