export default async function handler(req, res) {
    // CORS 에러 방지 (내 사이트에서 호출 허용)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        // Wise 공식 API 호출 (USD 1000불 기준)
        const wiseRes = await fetch('https://api.wise.com/v3/comparisons?sourceCurrency=USD&targetCurrency=KRW&sendAmount=1000');
        const wiseData = await wiseRes.json();

        // Wise 데이터 추출
        const wiseProvider = wiseData.providers?.find(p => p.alias === 'wise');
        const wiseRate = wiseProvider ? wiseProvider.quotes[0].rate : 1340.0;
        const wiseFee = wiseProvider ? wiseProvider.quotes[0].fee : 4.50;

        // 프론트엔드로 보낼 깔끔한 데이터 생성
        const ratesData = {
            updatedAt: new Date().toISOString(),
            baseCurrency: 'USD',
            targetCurrency: 'KRW',
            providers: {
                wise: {
                    rate: wiseRate,
                    fee: wiseFee
                }
                // 추후 여기에 와이어바를리, 레밋틀리 등 추가 예정
            }
        };

        return res.status(200).json(ratesData);
    } catch (error) {
        console.error('환율 조회 실패:', error);
        return res.status(500).json({ error: '환율 정보를 불러오는 중 오류가 발생했습니다.' });
    }
}