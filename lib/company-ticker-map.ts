// Common company name to ticker symbol mappings
export const companyTickerMap: Record<string, string> = {
  // Tech Companies
  'apple': 'NASDAQ:AAPL',
  'microsoft': 'NASDAQ:MSFT',
  'google': 'NASDAQ:GOOGL',
  'alphabet': 'NASDAQ:GOOGL',
  'meta': 'NASDAQ:META',
  'facebook': 'NASDAQ:META',
  'tesla': 'NASDAQ:TSLA',
  'nvidia': 'NASDAQ:NVDA',
  'netflix': 'NASDAQ:NFLX',
  'adobe': 'NASDAQ:ADBE',
  'salesforce': 'NYSE:CRM',
  'oracle': 'NYSE:ORCL',
  'intel': 'NASDAQ:INTC',
  'amd': 'NASDAQ:AMD',
  'ibm': 'NYSE:IBM',
  'cisco': 'NASDAQ:CSCO',
  'uber': 'NYSE:UBER',
  'airbnb': 'NASDAQ:ABNB',
  'spotify': 'NYSE:SPOT',
  'paypal': 'NASDAQ:PYPL',
  'square': 'NYSE:SQ',
  'block': 'NYSE:SQ',
  'twitter': 'NYSE:X',
  'x': 'NYSE:X',
  'snap': 'NYSE:SNAP',
  'snapchat': 'NYSE:SNAP',
  'zoom': 'NASDAQ:ZM',
  'shopify': 'NYSE:SHOP',
  'roblox': 'NYSE:RBLX',
  'palantir': 'NYSE:PLTR',
  'coinbase': 'NASDAQ:COIN',
  'robinhood': 'NASDAQ:HOOD',
  'doordash': 'NASDAQ:DASH',
  'pinterest': 'NYSE:PINS',
  'crowdstrike': 'NASDAQ:CRWD',
  'datadog': 'NASDAQ:DDOG',
  'snowflake': 'NYSE:SNOW',
  'mongodb': 'NASDAQ:MDB',
  'docusign': 'NASDAQ:DOCU',
  'twilio': 'NYSE:TWLO',
  'okta': 'NASDAQ:OKTA',
  'dropbox': 'NASDAQ:DBX',
  
  // Finance
  'jpmorgan': 'NYSE:JPM',
  'jp morgan': 'NYSE:JPM',
  'chase': 'NYSE:JPM',
  'bank of america': 'NYSE:BAC',
  'bofa': 'NYSE:BAC',
  'wells fargo': 'NYSE:WFC',
  'goldman sachs': 'NYSE:GS',
  'goldman': 'NYSE:GS',
  'morgan stanley': 'NYSE:MS',
  'citi': 'NYSE:C',
  'citigroup': 'NYSE:C',
  'citibank': 'NYSE:C',
  'american express': 'NYSE:AXP',
  'amex': 'NYSE:AXP',
  'visa': 'NYSE:V',
  'mastercard': 'NYSE:MA',
  'berkshire': 'NYSE:BRK.A',
  'berkshire hathaway': 'NYSE:BRK.A',
  'blackrock': 'NYSE:BLK',
  'schwab': 'NYSE:SCHW',
  'charles schwab': 'NYSE:SCHW',
  'fidelity': 'FNF',
  
  // Retail
  'walmart': 'NYSE:WMT',
  'amazon': 'NASDAQ:AMZN',
  'home depot': 'NYSE:HD',
  'costco': 'NASDAQ:COST',
  'target': 'NYSE:TGT',
  'lowes': 'NYSE:LOW',
  'cvs': 'NYSE:CVS',
  'walgreens': 'NASDAQ:WBA',
  'kroger': 'NYSE:KR',
  'best buy': 'NYSE:BBY',
  'macys': 'NYSE:M',
  'nordstrom': 'NYSE:JWN',
  'gap': 'NYSE:GPS',
  'nike': 'NYSE:NKE',
  'adidas': 'XETR:ADS',
  'lululemon': 'NASDAQ:LULU',
  'starbucks': 'NASDAQ:SBUX',
  'mcdonalds': 'NYSE:MCD',
  'chipotle': 'NYSE:CMG',
  'dominos': 'NYSE:DPZ',
  
  // Healthcare
  'johnson & johnson': 'NYSE:JNJ',
  'j&j': 'NYSE:JNJ',
  'pfizer': 'NYSE:PFE',
  'moderna': 'NASDAQ:MRNA',
  'unitedhealth': 'NYSE:UNH',
  'cvs health': 'NYSE:CVS',
  'abbvie': 'NYSE:ABBV',
  'merck': 'NYSE:MRK',
  'eli lilly': 'NYSE:LLY',
  'bristol myers': 'NYSE:BMY',
  'bristol-myers': 'NYSE:BMY',
  'abbott': 'NYSE:ABT',
  'medtronic': 'NYSE:MDT',
  'thermo fisher': 'NYSE:TMO',
  
  // Auto
  'ford': 'NYSE:F',
  'general motors': 'NYSE:GM',
  'gm': 'NYSE:GM',
  'toyota': 'NYSE:TM',
  'honda': 'NYSE:HMC',
  'volkswagen': 'XETR:VOW3',
  'stellantis': 'NYSE:STLA',
  'rivian': 'NASDAQ:RIVN',
  'lucid': 'NASDAQ:LCID',
  'nio': 'NYSE:NIO',
  'byd': 'HKEX:1211',
  
  // Energy
  'exxon': 'NYSE:XOM',
  'exxonmobil': 'NYSE:XOM',
  'chevron': 'NYSE:CVX',
  'conocophillips': 'NYSE:COP',
  'marathon': 'NYSE:MPC',
  'valero': 'NYSE:VLO',
  'occidental': 'NYSE:OXY',
  'shell': 'NYSE:SHEL',
  'bp': 'NYSE:BP',
  'total': 'NYSE:TTE',
  'totalenergies': 'NYSE:TTE',
  
  // Airlines
  'delta': 'NYSE:DAL',
  'united': 'NASDAQ:UAL',
  'american airlines': 'NASDAQ:AAL',
  'southwest': 'NYSE:LUV',
  'jetblue': 'NASDAQ:JBLU',
  'alaska': 'NYSE:ALK',
  'spirit': 'NYSE:SAVE',
  
  // Entertainment
  'disney': 'NYSE:DIS',
  'walt disney': 'NYSE:DIS',
  'warner bros': 'NASDAQ:WBD',
  'paramount': 'NASDAQ:PARA',
  'comcast': 'NASDAQ:CMCSA',
  'roku': 'NASDAQ:ROKU',
  'amc': 'NYSE:AMC',
  
  // Crypto-related
  'microstrategy': 'NASDAQ:MSTR',
  'marathon digital': 'NASDAQ:MARA',
  'riot': 'NASDAQ:RIOT',
  'riot platforms': 'NASDAQ:RIOT',
  'hut 8': 'NASDAQ:HUT',
  'cleanspark': 'NASDAQ:CLSK',
  
  // Other Major Companies
  'coca cola': 'NYSE:KO',
  'coca-cola': 'NYSE:KO',
  'coke': 'NYSE:KO',
  'pepsi': 'NASDAQ:PEP',
  'pepsico': 'NASDAQ:PEP',
  'procter & gamble': 'NYSE:PG',
  'p&g': 'NYSE:PG',
  '3m': 'NYSE:MMM',
  'boeing': 'NYSE:BA',
  'lockheed': 'NYSE:LMT',
  'lockheed martin': 'NYSE:LMT',
  'raytheon': 'NYSE:RTX',
  'northrop': 'NYSE:NOC',
  'northrop grumman': 'NYSE:NOC',
  'general electric': 'NYSE:GE',
  'ge': 'NYSE:GE',
  'caterpillar': 'NYSE:CAT',
  'deere': 'NYSE:DE',
  'john deere': 'NYSE:DE',
  'ups': 'NYSE:UPS',
  'fedex': 'NYSE:FDX',
  'verizon': 'NYSE:VZ',
  'at&t': 'NYSE:T',
  'att': 'NYSE:T',
  't-mobile': 'NASDAQ:TMUS',
  'tmobile': 'NASDAQ:TMUS',

  // Major Indices
  'sp500': 'INDEX:SPX',
  's&p500': 'INDEX:SPX',
  's&p 500': 'INDEX:SPX',
  's&p': 'INDEX:SPX',
  'sandp': 'INDEX:SPX',
  'us500': 'INDEX:SPX',
  'spx': 'INDEX:SPX',
  'spy': 'NYSEARCA:SPY',
  'dow jones': 'INDEX:DJI',
  'dow': 'INDEX:DJI',
  'djia': 'INDEX:DJI',
  'us30': 'INDEX:DJI',
  'nasdaq': 'INDEX:IXIC',
  'nasdaq 100': 'INDEX:NDX',
  'ndx': 'INDEX:NDX',
  'qqq': 'NASDAQ:QQQ',
  'russell 2000': 'INDEX:RUT',
  'russell': 'INDEX:RUT',
  'rut': 'INDEX:RUT',
  'vix': 'INDEX:VIX',
  'dax': 'XETR:DAX',
  'ftse': 'LSE:FTSE',
  'cac': 'EPA:CAC',
  'nikkei': 'INDEX:N225',
  'n225': 'INDEX:N225',
  'hang seng': 'INDEX:HSI',
  'hsi': 'INDEX:HSI',

  // Top 20 Cryptocurrencies (by market cap, 2024)
  'bitcoin': 'CRYPTO:BTCUSD',
  'btc': 'CRYPTO:BTCUSD',
  'ethereum': 'CRYPTO:ETHUSD',
  'eth': 'CRYPTO:ETHUSD',
  'tether': 'CRYPTO:USDTUSD',
  'usdt': 'CRYPTO:USDTUSD',
  'binance coin': 'CRYPTO:BNBUSD',
  'bnb': 'CRYPTO:BNBUSD',
  'solana': 'CRYPTO:SOLUSD',
  'sol': 'CRYPTO:SOLUSD',
  'ripple': 'CRYPTO:XRPUSD',
  'xrp': 'CRYPTO:XRPUSD',
  'usd coin': 'CRYPTO:USDCUSD',
  'usdc': 'CRYPTO:USDCUSD',
  'staked ether': 'CRYPTO:STETHUSD',
  'steth': 'CRYPTO:STETHUSD',
  'dogecoin': 'CRYPTO:DOGEUSD',
  'doge': 'CRYPTO:DOGEUSD',
  'cardano': 'CRYPTO:ADAUSD',
  'ada': 'CRYPTO:ADAUSD',
  'tron': 'CRYPTO:TRXUSD',
  'trx': 'CRYPTO:TRXUSD',
  'toncoin': 'CRYPTO:TONUSD',
  'ton': 'CRYPTO:TONUSD',
  'avalanche': 'CRYPTO:AVAXUSD',
  'avax': 'CRYPTO:AVAXUSD',
  'shiba inu': 'CRYPTO:SHIBUSD',
  'shib': 'CRYPTO:SHIBUSD',
  'polkadot': 'CRYPTO:DOTUSD',
  'dot': 'CRYPTO:DOTUSD',
  'wrapped bitcoin': 'CRYPTO:WBTCUSD',
  'wbtc': 'CRYPTO:WBTCUSD',
  'bitcoin cash': 'CRYPTO:BCHUSD',
  'bch': 'CRYPTO:BCHUSD',
  'chainlink': 'CRYPTO:LINKUSD',
  'link': 'CRYPTO:LINKUSD',
  'matic': 'CRYPTO:MATICUSD',
  'polygon': 'CRYPTO:MATICUSD',
  'litecoin': 'CRYPTO:LTCUSD',
  'ltc': 'CRYPTO:LTCUSD',
  'internet computer': 'CRYPTO:ICPUSD',
  'icp': 'CRYPTO:ICPUSD',
  'uniswap': 'CRYPTO:UNIUSD',
  'uni': 'CRYPTO:UNIUSD',
  'leo': 'CRYPTO:LEOUSD',
  'dai': 'CRYPTO:DAIUSD',
  'ethereum classic': 'CRYPTO:ETCUSD',
  'etc': 'CRYPTO:ETCUSD',
  'aptos': 'CRYPTO:APTUSD',
  'apt': 'CRYPTO:APTUSD',
  'filecoin': 'CRYPTO:FILUSD',
  'fil': 'CRYPTO:FILUSD',
  'stellar': 'CRYPTO:XLMUSD',
  'xlm': 'CRYPTO:XLMUSD',
  'vechain': 'CRYPTO:VETUSD',
  'vet': 'CRYPTO:VETUSD',
  'aave': 'CRYPTO:AAVEUSD',
  'sushi': 'CRYPTO:SUSHIUSD',
  'compound': 'CRYPTO:COMPUSD',
  'yearn finance': 'CRYPTO:YFIUSD',
  'yfi': 'CRYPTO:YFIUSD',
  'curve': 'CRYPTO:CRVUSD',
  'crv': 'CRYPTO:CRVUSD',
  'holo': 'CRYPTO:HOTUSD',
  'hot': 'CRYPTO:HOTUSD',
  'thorchain': 'CRYPTO:RUNEUSD',
  'rune': 'CRYPTO:RUNEUSD',
  'dash': 'CRYPTO:DASHUSD',
  'zcash': 'CRYPTO:ZECUSD',
  'qtum': 'CRYPTO:QTUMUSD',
  'omisego': 'CRYPTO:OMGUSD',
  '0x': 'CRYPTO:ZRXUSD',
  'basic attention token': 'CRYPTO:BATUSD',
  'bat': 'CRYPTO:BATUSD',
  'decentraland': 'CRYPTO:MANAUSD',
  'sand': 'CRYPTO:SANDUSD',
  'the sandbox': 'CRYPTO:SANDUSD',
  'axie infinity': 'CRYPTO:AXSUSD',
  'axs': 'CRYPTO:AXSUSD',
  'chiliz': 'CRYPTO:CHZUSD',
  'flow': 'CRYPTO:FLOWUSD',
  'gala': 'CRYPTO:GALAUSD',
  'immutable x': 'CRYPTO:IMXUSD',
  'imx': 'CRYPTO:IMXUSD',
  'metis': 'CRYPTO:METISUSD',
  'near': 'CRYPTO:NEARUSD',
  'ocean protocol': 'CRYPTO:OCEANUSD',
  'ocean': 'CRYPTO:OCEANUSD',
  'render token': 'CRYPTO:RNDRUSD',
  'rndr': 'CRYPTO:RNDRUSD',
  'sora': 'CRYPTO:XORUSD',
  'synth s&p 500': 'CRYPTO:SPYUSD',
  'synth dow jones': 'CRYPTO:DJIUSD',
  'synth nasdaq': 'CRYPTO:IXICUSD',
  'synth russell 2000': 'CRYPTO:RUTUSD',
  'synth vix': 'CRYPTO:VIXUSD',
  'synth dax': 'CRYPTO:DAXUSD',
  'synth ftse': 'CRYPTO:FTSEUSD',
  'synth cac': 'CRYPTO:CACUSD',
  'synth nikkei': 'CRYPTO:N225USD',
  'synth hang seng': 'CRYPTO:HSIUSD',
  'synth bitcoin': 'CRYPTO:BTCUSD',
  'synth ethereum': 'CRYPTO:ETHUSD',
  'synth tether': 'CRYPTO:USDTUSD',
  'synth binance coin': 'CRYPTO:BNBUSD',
  'synth solana': 'CRYPTO:SOLUSD',
  'synth ripple': 'CRYPTO:XRPUSD',
  'synth usd coin': 'CRYPTO:USDCUSD',
  'synth staked ether': 'CRYPTO:STETHUSD',
  'synth dogecoin': 'CRYPTO:DOGEUSD',
  'synth cardano': 'CRYPTO:ADAUSD',
  'synth tron': 'CRYPTO:TRXUSD',
  'synth toncoin': 'CRYPTO:TONUSD',
  'synth avalanche': 'CRYPTO:AVAXUSD',
  'synth shiba inu': 'CRYPTO:SHIBUSD',
  'synth polkadot': 'CRYPTO:DOTUSD',
  'synth wrapped bitcoin': 'CRYPTO:WBTCUSD',
  'synth bitcoin cash': 'CRYPTO:BCHUSD',
  'synth chainlink': 'CRYPTO:LINKUSD',
  'synth matic': 'CRYPTO:MATICUSD',
  'synth litecoin': 'CRYPTO:LTCUSD',
  'synth internet computer': 'CRYPTO:ICPUSD',
  'synth uniswap': 'CRYPTO:UNIUSD',
  'synth leo': 'CRYPTO:LEOUSD',
  'synth dai': 'CRYPTO:DAIUSD',
  'synth ethereum classic': 'CRYPTO:ETCUSD',
  'synth aptos': 'CRYPTO:APTUSD',
  'synth filecoin': 'CRYPTO:FILUSD',
  'synth stellar': 'CRYPTO:XLMUSD',
  'synth vechain': 'CRYPTO:VETUSD',
  'synth aave': 'CRYPTO:AAVEUSD',
  'synth sushi': 'CRYPTO:SUSHIUSD',
  'synth compound': 'CRYPTO:COMPUSD',
  'synth yearn finance': 'CRYPTO:YFIUSD',
  'synth curve': 'CRYPTO:CRVUSD',
  'synth holo': 'CRYPTO:HOTUSD',
  'synth thorchain': 'CRYPTO:RUNEUSD',
  'synth dash': 'CRYPTO:DASHUSD',
  'synth zcash': 'CRYPTO:ZECUSD',
  'synth qtum': 'CRYPTO:QTUMUSD',
  'synth omisego': 'CRYPTO:OMGUSD',
  'synth 0x': 'CRYPTO:ZRXUSD',
  'synth basic attention token': 'CRYPTO:BATUSD',
  'synth decentraland': 'CRYPTO:MANAUSD',
  'synth sand': 'CRYPTO:SANDUSD',
  'synth the sandbox': 'CRYPTO:SANDUSD',
  'synth axie infinity': 'CRYPTO:AXSUSD',
  'synth chiliz': 'CRYPTO:CHZUSD',
  'synth flow': 'CRYPTO:FLOWUSD',
  'synth gala': 'CRYPTO:GALAUSD',
  'synth immutable x': 'CRYPTO:IMXUSD',
  'synth metis': 'CRYPTO:METISUSD',
  'synth near': 'CRYPTO:NEARUSD',
  'synth ocean protocol': 'CRYPTO:OCEANUSD',
  'synth ocean': 'CRYPTO:OCEANUSD',
  'synth render token': 'CRYPTO:RNDRUSD',
  'synth rndr': 'CRYPTO:RNDRUSD',
  'synth sora': 'CRYPTO:XORUSD'
}

// Market-related keywords that indicate user wants stock/market information
const marketKeywords = [
  'stock', 'share', 'price', 'market', 'trading', 'trade', 'invest',
  'ticker', 'chart', 'technical analysis', 'market cap', 'valuation',
  'earnings', 'revenue', 'profit', 'loss', 'p/e', 'dividend',
  'performance', 'quote', '$', 'nasdaq', 'nyse', 'doing', 'up', 'down'
]

// Function to detect company ticker from text - STRICT VERSION
export function detectCompanyTicker(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  // First check if the query is actually about market/stock information
  const isMarketQuery = marketKeywords.some(keyword => lowerText.includes(keyword))
  
  // Also check for common patterns like "how is X doing"
  const marketPatterns = [
    /how\s+is\s+\w+\s+doing/i,
    /what('s|\s+is)\s+\w+\s+stock/i,
    /\$[A-Z]+/  // Stock symbols with $
  ]
  
  const hasMarketPattern = marketPatterns.some(pattern => pattern.test(text))
  
  // If not a market query, return null
  if (!isMarketQuery && !hasMarketPattern) {
    return null
  }
  
  // Check for direct ticker mentions (e.g., $AAPL, AAPL stock, NASDAQ:AAPL)
  const tickerPatterns = [
    /\$([A-Z]{1,5})\b/,           // $AAPL
    /\b([A-Z]{1,5})\s+(?:stock|share|price|chart)/i,  // AAPL stock/share/price/chart
    /\b(NYSE|NASDAQ|AMEX):([A-Z.]{1,5})\b/i           // NASDAQ:AAPL
  ]
  
  for (const pattern of tickerPatterns) {
    const match = text.match(pattern)
    if (match) {
      // For the third pattern, ticker is in match[2]
      if (pattern === tickerPatterns[2]) {
        return match[2].toUpperCase()
      }
      // Otherwise, ticker is in match[1]
      return match[1].toUpperCase()
    }
  }
  
  // Check for explicit company name + market keyword combinations
  // Sort entries by length (longer names first) to avoid partial matches
  const sortedEntries = Object.entries(companyTickerMap).sort((a, b) => b[0].length - a[0].length)
  
  for (const [company, ticker] of sortedEntries) {
    // Escape special regex characters in company name
    const escapedCompany = company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    // Check if the query mentions this company with market context
    // More flexible pattern: company name anywhere in text with market keywords
    const companyRegex = new RegExp(`\\b${escapedCompany}\\b`, 'i')
    
    if (companyRegex.test(lowerText)) {
      return ticker
    }
  }
  
  return null
}

// Export explícito para asegurar que detectCompanyTicker esté disponible
export { detectCompanyTicker }