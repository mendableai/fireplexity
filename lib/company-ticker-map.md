# company-ticker-map.ts

Este módulo contiene un mapa de nombres comunes de empresas, índices bursátiles y criptomonedas a sus respectivos símbolos de ticker, así como una función para detectar el ticker relevante en una consulta de texto.

## Uso óptimo

### 1. Detección de ticker en texto libre

Utiliza la función:

```typescript
import { detectCompanyTicker } from './company-ticker-map'

const ticker = detectCompanyTicker('¿Cómo va apple en la bolsa?')
// ticker === 'NASDAQ:AAPL'
```

- Devuelve el ticker en formato estándar (`NASDAQ:AAPL`, `CRYPTO:BTCUSD`, `INDEX:SPX`) o `null` si no detecta ninguno.

### 2. Búsqueda directa en el mapa

Puedes buscar directamente por nombre común, alias o símbolo:

```typescript
import { companyTickerMap } from './company-ticker-map'

companyTickerMap['apple']    // 'NASDAQ:AAPL'
companyTickerMap['btc']      // 'CRYPTO:BTCUSD'
companyTickerMap['sp500']    // 'INDEX:SPX'
```

### 3. Consultas optimizadas

- Normaliza el texto a minúsculas y elimina tildes/acentos si es necesario.
- Busca primero por ticker directo (ej: `$AAPL`, `NASDAQ:AAPL`, `BTCUSD`).
- Si no hay coincidencia directa, busca por nombre común usando el mapa.
- Usa la función `detectCompanyTicker` para manejar patrones y alias automáticamente.

### 4. Ejemplos de consultas válidas

| Consulta                                 | Resultado esperado         |
|-------------------------------------------|---------------------------|
| ¿Cómo va apple en la bolsa?               | NASDAQ:AAPL               |
| Precio de BTC hoy                         | CRYPTO:BTCUSD             |
| sp500 chart                               | INDEX:SPX                 |
| Dame el gráfico de ethereum               | CRYPTO:ETHUSD             |
| Qué tal el dow jones?                     | INDEX:DJI                 |
| AAPL stock                                | NASDAQ:AAPL               |
| $TSLA                                     | NASDAQ:TSLA               |

### 5. Ampliar soporte

Para ampliar el soporte, agrega nuevos alias o tickers al objeto `companyTickerMap` en el archivo TypeScript.

> **Nota:** El sistema es sensible a nombres y alias definidos en el mapa. Para mejores resultados, mantén actualizado el mapa con los nombres y símbolos más usados.

---
