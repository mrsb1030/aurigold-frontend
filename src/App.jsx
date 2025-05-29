import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [amountG, setAmountG] = useState('');
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetch('https://aurigold-coin.fly.dev/price')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({ error: 'Failed to load data' }));
  }, []);

  if (!data) return <div className="text-center p-10">Loading...</div>;
  if (data.error) return <div className="text-center p-10 text-red-500">{data.error}</div>;

  const { augc, gold, eth_usd, btc_usd, market_cap_usd } = data;

  const generateQuote = () => {
    const g = parseFloat(amountG);
    if (isNaN(g) || g <= 0) return setQuote(null);

    const totalUsd = gold.usd_per_gram * g;
    const totalEth = totalUsd / eth_usd;
    const totalBtc = totalUsd / btc_usd;
    const augcAmount = g;

    setQuote({
      grams: g,
      usd: totalUsd,
      eth: totalEth,
      btc: totalBtc,
      augc: augcAmount
    });
  };

  return (
    <div className="p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Aurigold Live Price</h1>

      <div className="mb-6">
        <p>Gold Price: <strong>${gold.usd_per_gram.toFixed(2)} /g</strong></p>
        <p>AUGC Price (USD): <strong>${augc.price_usd.toFixed(6)}</strong></p>
        <p>AUGC in ETH: <strong>{augc.price_eth.toFixed(8)}</strong></p>
        <p>AUGC in BTC: <strong>{augc.price_btc.toFixed(10)}</strong></p>
        <p className="mt-2 text-sm text-gray-500">
          Market Cap: ${market_cap_usd.toLocaleString()}
        </p>
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter grams of gold"
          value={amountG}
          onChange={e => setAmountG(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={generateQuote}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Get Quote
        </button>
      </div>

      {quote && (
        <div className="bg-gray-100 p-4 rounded text-left">
          <p><strong>{quote.grams}g Gold</strong></p>
          <p>→ {quote.augc.toFixed(6)} AUGC</p>
          <p>→ ${quote.usd.toFixed(2)}</p>
          <p>→ {quote.eth.toFixed(6)} ETH</p>
          <p>→ {quote.btc.toFixed(8)} BTC</p>
        </div>
      )}
    </div>
  );
}

export default App;
