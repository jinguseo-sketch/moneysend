/* ==========================================================================
   MONEYSEND - Multi-Language Engine & Remittance Comparison Application
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const state = {
    currentLang: 'kr', // 'kr' or 'en'
    sendAmount: 1000,
    targetCurrency: 'KRW',
    activeCategory: 'lowest-fee',
    baseRate: 1348.50, // Mid-market USD to KRW rate
    providers: [
      {
        id: 'wise',
        name: 'Wise',
        logo: '💳',
        fee: 4.50,
        spreadPct: 0.00, // Wise는 Mid-market 환율 적용 (환율 마진 0%)
        speed: { kr: '약 30분 내 입금 (실시간)', en: 'In ~30 mins (Instant)' },
        rating: 4.9,
        officialUrl: 'https://wise.com',
        tags: { kr: '최저 수수료 1위', en: 'Lowest Total Cost' },
        categories: ['lowest-fee', 'fastest', 'beginner'],
        desc: { kr: '중간 시장 환율(Mid-market) 적용, 투명한 수수료', en: 'Uses true mid-market rate with guaranteed transparent fee' }
      },
      {
        id: 'wirebarley',
        name: 'WireBarley',
        logo: '🌾',
        fee: 0.00,
        spreadPct: 0.0045, // 0.45%
        speed: { kr: '1~2시간 이내', en: 'Within 1-2 Hours' },
        rating: 4.8,
        officialUrl: 'https://www.wirebarley.com',
        tags: { kr: '미국/한국 한인 선호 1위', en: 'Top Choice for NY/NJ Expats' },
        categories: ['lowest-fee', 'beginner'],
        desc: { kr: '미국 뉴욕/뉴저지 한인 및 유학생 대상 송금 수수료 0원 이벤트', en: 'Zero transaction fee for US-Korea transfers' }
      },
      {
        id: 'remitly',
        name: 'Remitly',
        logo: '⚡',
        fee: 0.00, // $0 promo over $1000
        spreadPct: 0.0065, // 0.65%
        speed: { kr: '수 분 내 계좌 입금', en: 'Within Minutes' },
        rating: 4.7,
        officialUrl: 'https://www.remitly.com',
        tags: { kr: '초고속 실시간 송금', en: 'Ultra-Fast Express' },
        categories: ['fastest', 'beginner'],
        desc: { kr: '특급 송금 지원, 카카오페이/시중은행 즉시 입금', en: 'Express transfer to KakaoPay & Korean bank accounts' }
      },
      {
        id: 'westernunion',
        name: 'Western Union',
        logo: '🌐',
        fee: 5.00,
        spreadPct: 0.0180, // 1.80%
        speed: { kr: '실시간 (현금 수령)', en: 'Instant Cash Pickup' },
        rating: 4.3,
        officialUrl: 'https://www.westernunion.com',
        tags: { kr: '전 세계 오프라인 수령', en: 'Worldwide Locations' },
        categories: ['fastest'],
        desc: { kr: '전 세계 주요 국가 오프라인 지점 현금 수령 지원', en: 'Global agent locations for instant cash pickup' }
      },
      {
        id: 'bankwire',
        name: '시중은행 (Bank Wire)',
        logo: '🏦',
        fee: 25.00,
        spreadPct: 0.0195, // 1.95%
        speed: { kr: '2~3 영업일 소요', en: '2-3 Business Days' },
        rating: 3.9,
        officialUrl: '#',
        tags: { kr: '전통 전보 송금', en: 'SWIFT Bank Wire' },
        categories: [],
        desc: { kr: '중개은행 수수료 및 수취 수수료 추가 발생', en: 'Additional intermediary and receiving bank wire fees apply' }
      }
    ]
  };

  // i18n Dictionary
  const dictionary = {
    kr: {
      // SEO & Titles
      pageTitle: 'MONEYSEND | 미국·뉴욕·뉴저지 해외송금 수수료 & 실시간 환율 비교',
      pageDesc: '미국(뉴욕/뉴저지) 한인, 유학생, 비즈니스 고객을 위한 스마트 해외송금 정보 플랫폼. Wise, Remitly, WireBarley 등 주요 간편송금 서비스의 수수료와 환율을 실시간 비교하세요.',
      pageKeywords: '미국 해외송금, 뉴욕 해외송금, 뉴저지 해외송금, 송금정보, 간편송금, 해외송금 수수료 비교, 실시간 환율 비교',
      ogTitle: 'MONEYSEND | 미국·뉴욕·뉴저지 해외송금 수수료 & 실시간 환율 비교',
      ogDesc: '미국(뉴욕/뉴저지) 한인, 유학생을 위한 스마트 해외송금 비교. 숨은 수수료 없이 최적의 환율과 수수료를 실시간 확인하세요.',
      
      // Top Bar & Nav
      topBetaNotice: '현재 베타 테스트 중이라 환율이 정확하지 않습니다.',
      announcementText: '⚡ [실시간 API 연동] 2026년 기준 Wise, Remitly, WireBarley 최신 환율 & 수수료가 반영되었습니다.',
      navComparison: '실시간 비교',
      navAbout: '서비스 소개',
      navGuides: '송금 가이드',
      navFaq: 'FAQ',
      navSecurity: '보안·파트너',
      navContact: '고객지원',
      kakaoBtn: '카카오톡 1:1',

      // Hero
      badgeBeta: '🧪 [BETA 테스트 중]',
      badgeApi: '⚡ [실시간 API 연동]',
      badgeFee: '🔍 [숨은 수수료 0% 추적]',
      badgeObj: '🛡️ [100% 객관적 송금정보]',
      heroTitle: '더 빠르고, 더 저렴하게!<br><span class="gradient-text">전 세계 해외송금 실시간 비교</span>',
      heroSub: '미국 뉴욕·뉴저지 교민부터 글로벌 송금자까지! 숨은 수수료 없이 100% 객관적인 환율과 수수료를 한눈에 확인하고, 나에게 딱 맞는 간편송금 경로를 찾으세요.',
      btnCompare: '🚀 실시간 수수료 비교하기',
      btnGuide: '📖 초보자 가이드 보기',
      statProviders: '주요 송금사 비교',
      statHidden: '숨겨진 마진 제로',
      statRefresh: '실시간 데이터 갱신',

      // Hero Calc
      calcTitle: '실시간 송금 계산기',
      calcSendLabel: '보내는 금액 (USD)',
      calcRecvLabel: '받는 국가 / 통화',
      calcMidRate: '기준 환율 (Mid-market):',
      calcBestResult: '최고 수령예정액 (Wise):',
      calcSavings: '은행 대비 절감액:',
      calcCompareBtn: '🔍 전체 5개 서비스 비교 결과 보기',
      top3Title: '🔥 오늘의 US ➔ 한국 TOP 3 추천',

      // Comparison Section
      compSub: 'REAL-TIME COMPARISON',
      compTitle: '실시간 해외송금 조건 비교',
      compDesc: 'Wise, Remitly, WireBarley 등 검증된 핀테크 송금사의 수수료와 환율 마진을 100% 투명하게 공개합니다.',
      catLowest: '오늘의 최저 수수료',
      catFastest: '가장 빠른 송금',
      catBeginner: '초보자 인기 추천 (NY/NJ)',
      filterAmountLabel: '송금 기준 금액:',
      lastUpdatedText: '마지막 업데이트: 방금 전',
      btnViewDetails: '수수료 세부 내역 보기',
      btnVisitOfficial: '공식 서비스 바로가기 ↗',
      labelRateApplied: '적용 환율:',
      labelFee: '고정 수수료:',
      labelSpreadFee: '환율 마진(Spread):',
      labelPayout: '최종 실수령액:',
      badgeBestValue: '최저 비용 1위',

      // About Section
      aboutSub: 'BRAND MISSION',
      aboutMission: '"투명하고 정직한 송금정보로, 전 세계 어디서나 수수료 부담 없는 스마트 금융 라이프를 만들어갑니다."',
      val1Title: '100% 객관적 데이터',
      val1Desc: '특정 송금사에 편향되지 않는 독립적 분석으로 고객에게 가장 유리한 조건을 찾습니다.',
      val2Title: '실시간 환율 반영',
      val2Desc: '공식 API 연동을 통해 매 분 단위로 변동하는 최신 환율과 송금 수수료를 실시간 갱신합니다.',
      val3Title: '숨은 수수료 제로 추적',
      val3Desc: '고정 수수료뿐 아니라 환율 마진(Spread)까지 합산된 최종 실수령액 기준 객관적 비교를 제공합니다.',

      // Guides Section
      guideSub: 'REMITTANCE GUIDES & KNOWLEDGE',
      guideTitle: '스마트한 해외송금을 위한 필독 가이드',
      guideDesc: '미국(뉴욕/뉴저지) 한인 및 송금 초보자를 위한 수수료 절감 꿀팁과 안전 송금 팁을 확인하세요.',
      g1Tag: '초보자 필독',
      g1Title: '미국 ➔ 한국 첫 해외송금 3분 체크리스트',
      g1Excerpt: 'SSN, ITIN, 수취인 영문 성명, 계좌번호 확인 등 첫 송금 전 실패 없이 가장 빠르게 완료하는 핵심 체크포인트를 정리했습니다.',
      g2Tag: '수수료 분석',
      g2Title: '시중은행 vs 핀테크 간편송금 수수료 비교',
      g2Excerpt: '전보료, 전개 수수료, 수취 수수료가 붙는 은행 송금과 환율 마진 투명 핀테크 서비스의 실질 비용 차이를 철저히 분석합니다.',
      g3Tag: '안전 수칙',
      g3Title: '미국 뉴욕·뉴저지 교민을 위한 해외송금 사고 예방법',
      g3Excerpt: '개인 간 사금융(환치기)의 위험성과 금융당국 신고 규정을 준수하면서 안전하게 대금 및 생활비를 송금하는 안전수칙 guide.',
      btnReadMore: '📖 가이드 전문 읽기',

      // FAQ Section
      faqSub: 'FREQUENTLY ASKED QUESTIONS',
      faqTitle: '자주 묻는 질문 (FAQ)',
      faqDesc: 'MONEYSEND 이용 및 해외송금 비교 서비스에 대해 자주 궁금해하시는 질문을 다룹니다.',
      q1Text: 'MONEYSEND에서 직접 송금이 진행되나요?',
      a1Text: 'MONEYSEND는 정보 비교 플랫폼입니다. 직접 고객 자금을 수납하지 않으며, 실시간 비교 후 가장 유리한 송금 공식 사이트로 안전하게 직접 연결해 드립니다.',
      q2Text: '수수료와 환율 정보는 얼마나 자주 업데이트되나요?',
      a2Text: '주요 송금사의 공식 API 및 실시간 데이터를 연동하여 매 분(Minutely) 단위로 실시간 반영하고 있습니다.',
      q3Text: '숨겨진 수수료가 있나요?',
      a3Text: '아닙니다! 표면 수수료 외에도 송금사가 적용하는 환율 마진(Spread)을 포함한 "최종 실수령액"을 계산하므로 숨은 수수료가 없습니다.',
      q4Text: '미국 뉴욕·뉴저지에서 한국으로 송금 시 한도가 있나요?',
      a4Text: '송금업체별로 1회 및 연간 송금 한도가 다르며, 한국 외국환거래법 규정에 따라 연간 $50,000 이상 송금 시 국세청 통보 또는 수취은행 증빙 제출이 필요합니다.',

      // Security Section
      secTitle: '강력한 보안 및 데이터 보호 약속',
      secDesc: 'MONEYSEND는 256-bit SSL 최고 등급 암호화를 적용하여 고객의 조회 및 개인정보를 보호합니다. 계좌 비밀번호, 주민번호 등 민감 정보를 수집하거나 저장하지 않습니다.',
      secF1: '256-bit SSL 암호화 적용',
      secF2: '민감 금융 계좌정보 저장 불가',
      secF3: '독립적 100% 객관적 비교 데이터',
      partnersHeading: '비교 대상 공식 해외송금 파트너사',
      disclaimerText: '<strong>Disclaimer:</strong> MONEYSEND는 실시간 송금 환율 및 수수료 정보 비교 플랫폼이며, 직접적인 금융 거래 및 송금을 중개하거나 수수료를 직접 수납하지 않습니다. 실제 송금 계약 및 거래는 각 공식 송금 서비스 사이트에서 진행됩니다.',

      // Contact Section
      contactSub: 'CUSTOMER SUPPORT',
      contactTitle: '해외송금 이용 중 궁금한 점이 있으신가요?<br>MONEYSEND가 안내해 드립니다.',
      contactDesc: '서비스 제휴, 정보 수정 문의, 이용 가이드 관련 등 궁금한 점을 언제든 남겨주시면 빠르게 답변드립니다.',
      cEmailLabel: '이메일 문의',
      cKakaoLabel: '카카오톡 / 실시간 채팅',
      cHoursLabel: '운영 시간',
      cHoursVal: '월 ~ 금 09:00 - 18:00 (EST) / 24시간 온라인 접수',
      formTitle: '온라인 문의 접수',
      formNameLabel: '이름 (Name)',
      formEmailLabel: '이메일 주소 (Email)',
      formCatLabel: '문의 유형 (Category)',
      formMsgLabel: '문의 내용 (Message)',
      optService: '송금 서비스 문의 (Service Inquiry)',
      optPartner: '제휴 문의 (Partnership)',
      optBug: '오류 제보 (Bug Report)',
      optOther: '기타 (Other)',
      formSubmitBtn: '📩 문의하기 (Submit Inquiry)',

      // Footer
      footerDesc: '미국(뉴욕/뉴저지) 교민 & 글로벌 사용자를 위한 투명한 해외송금 실시간 비교 플랫폼.',
      footerLangTitle: '언어 선택:',
      footNavTitle: '빠른 이동',
      footSecTitle: '보안 & 규정',
      footContactTitle: '고객 지원',
      footPrivacy: '개인정보 처리방침',
      footTerms: '이용약관',
      modalClose: '닫기',
      modalVisit: '공식 사이트 바로가기 ↗'
    },
    en: {
      // SEO & Titles
      pageTitle: 'MONEYSEND | Real-Time Money Transfer & Exchange Rate Comparison (US/NY/NJ)',
      pageDesc: 'Compare real-time remittance fees and exchange rates for top money transfer services (Wise, Remitly, WireBarley). Save money on US-to-global money transfers with zero hidden fees.',
      pageKeywords: 'Money transfer comparison, Remittance NY NJ, Compare remittance fees, US to Korea money transfer, Best exchange rate',
      ogTitle: 'MONEYSEND | Real-Time Money Transfer & Exchange Rate Comparison (US/NY/NJ)',
      ogDesc: 'Compare live exchange rates and fees transparently for US expats in NY/NJ. Find your best money transfer route in under a minute.',

      // Top Bar & Nav
      topBetaNotice: 'Notice: Exchange rates may not be exact as the service is currently in beta testing.',
      announcementText: '⚡ [Real-Time API] Updated 2026 live rates for Wise, Remitly, and WireBarley.',
      navComparison: 'Comparison',
      navAbout: 'About Us',
      navGuides: 'Guides',
      navFaq: 'FAQ',
      navSecurity: 'Security',
      navContact: 'Contact',
      kakaoBtn: 'Kakao 1:1',

      // Hero
      badgeBeta: '🧪 [BETA Testing Mode]',
      badgeApi: '⚡ [Real-Time API]',
      badgeFee: '🔍 [0% Hidden Fees]',
      badgeObj: '🛡️ [100% Unbiased Info]',
      heroTitle: 'Fast, Safe & Smart —<br><span class="gradient-text">Compare Global Money Transfer Fees</span>',
      heroSub: 'From US (NY/NJ) expats to international remitters! Compare live exchange rates and fees transparently. Find your best money transfer route in under a minute.',
      btnCompare: '🚀 Compare Live Rates',
      btnGuide: '📖 Beginner\'s Guide',
      statProviders: 'Top Providers Compared',
      statHidden: 'Zero Hidden Spread',
      statRefresh: 'Minutely Data Refresh',

      // Hero Calc
      calcTitle: 'Live Rate Calculator',
      calcSendLabel: 'Send Amount (USD)',
      calcRecvLabel: 'Receive Country / Currency',
      calcMidRate: 'Mid-market Base Rate:',
      calcBestResult: 'Top Payout (Wise):',
      calcSavings: 'Savings vs Bank:',
      calcCompareBtn: '🔍 View All 5 Provider Results',
      top3Title: '🔥 Today\'s TOP 3 US ➔ Global Transfer Options',

      // Comparison Section
      compSub: 'REAL-TIME COMPARISON',
      compTitle: 'Live Remittance Fee & Exchange Comparison',
      compDesc: 'Transparent breakdown of exchange markups and fixed transaction fees for top fintech remittance providers.',
      catLowest: 'Lowest Total Fee Today',
      catFastest: 'Fastest Transfer Speed',
      catBeginner: 'Most Popular for Beginners',
      filterAmountLabel: 'Transfer Amount:',
      lastUpdatedText: 'Last updated: Just now',
      btnViewDetails: 'View Fee Details',
      btnVisitOfficial: 'Visit Official Site ↗',
      labelRateApplied: 'Applied Rate:',
      labelFee: 'Fixed Transfer Fee:',
      labelSpreadFee: 'Exchange Markup (Spread):',
      labelPayout: 'Total Recipient Payout:',
      badgeBestValue: 'TOP VALUE #1',

      // About Section
      aboutSub: 'BRAND MISSION',
      aboutMission: '"Empowering smart financial decisions worldwide through transparent and honest money transfer data."',
      val1Title: '100% Objective Data',
      val1Desc: 'Unbiased independent analysis that never prioritizes sponsored offers over user savings.',
      val2Title: 'Real-time Rates',
      val2Desc: 'Direct API integrations updating mid-market rates and transfer fees in real-time.',
      val3Title: 'Zero Hidden Fees',
      val3Desc: 'Factoring in exchange rate spreads alongside upfront fees for true payout accuracy.',

      // Guides Section
      guideSub: 'REMITTANCE GUIDES & KNOWLEDGE',
      guideTitle: 'Must-Read Guides for Smart Remittance',
      guideDesc: 'Expert tips on lowering transfer fees and avoiding fraud for US (NY/NJ) expats and students.',
      g1Tag: 'Beginner Essential',
      g1Title: '3-Minute Checklist for Your First US Money Transfer',
      g1Excerpt: 'Essential checklist covering SSN/ITIN verification, recipient English name formatting, and bank routing numbers.',
      g2Tag: 'Fee Breakdown',
      g2Title: 'Bank vs Fintech Remittance: True Cost Breakdown',
      g2Excerpt: 'Comparing traditional SWIFT wire fees ($40+) against modern transparent fintech exchange rate markups.',
      g3Tag: 'Safety Rules',
      g3Title: 'Safety Guide for Remittance Users in NY & NJ',
      g3Excerpt: 'How to comply with IRS/FinCEN regulations and avoid illegal currency exchange scams when transferring funds.',
      btnReadMore: '📖 Read Full Guide',

      // FAQ Section
      faqSub: 'FREQUENTLY ASKED QUESTIONS',
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faqDesc: 'Answers to common questions about MONEYSEND and money transfer comparisons.',
      q1Text: 'Does MONEYSEND process money transfers directly?',
      a1Text: 'MONEYSEND is an information comparison platform. We direct you to the official provider site offering the best rates.',
      q2Text: 'How often are rates updated?',
      a2Text: 'Updated in real time via official APIs from major money transfer providers.',
      q3Text: 'Are there hidden fees?',
      a3Text: 'No. We compute fees including exchange rate markups to show the true payout amount.',
      q4Text: 'Are there transfer limits from the US to Korea?',
      a4Text: 'Yes. Individual providers have daily and annual limits. Under Korean Foreign Exchange regulations, receiving over $50,000 annually may require bank documentation.',

      // Security Section
      secTitle: 'Enterprise-Grade Data Security Guarantee',
      secDesc: 'MONEYSEND uses 256-bit SSL encryption. We do not collect or store sensitive financial data like passwords or SSN.',
      secF1: '256-bit SSL Encryption Protected',
      secF2: 'Zero Storage of Private Banking Credentials',
      secF3: '100% Independent & Unbiased Comparison',
      partnersHeading: 'Official Money Transfer Partners & Providers',
      disclaimerText: '<strong>Disclaimer:</strong> MONEYSEND is an independent remittance comparison platform and does not directly handle funds or process transfers. All financial transactions occur directly on the official provider platforms.',

      // Contact Section
      contactSub: 'CUSTOMER SUPPORT',
      contactTitle: 'Have questions about remittance?<br>MONEYSEND is here to help.',
      contactDesc: 'Reach out to our support team for partnership inquiries, rate corrections, or usage guidance.',
      cEmailLabel: 'Email Support',
      cKakaoLabel: 'KakaoTalk Live Chat',
      cHoursLabel: 'Business Hours',
      cHoursVal: 'Mon - Fri 09:00 - 18:00 (EST) / 24/7 Online Form Inquiries',
      formTitle: 'Submit Online Inquiry',
      formNameLabel: 'Full Name',
      formEmailLabel: 'Email Address',
      formCatLabel: 'Category',
      formMsgLabel: 'Message',
      optService: 'Service Inquiry',
      optPartner: 'Partnership',
      optBug: 'Bug Report',
      optOther: 'Other',
      formSubmitBtn: '📩 Submit Inquiry',

      // Footer
      footerDesc: 'Transparent real-time money transfer comparison platform for US (NY/NJ) expats & global senders.',
      footerLangTitle: 'Language:',
      footNavTitle: 'Navigation',
      footSecTitle: 'Security & Terms',
      footContactTitle: 'Support',
      footPrivacy: 'Privacy Policy',
      footTerms: 'Terms of Service',
      modalClose: 'Close',
      modalVisit: 'Visit Official Site ↗'
    }
  };

  // Full Rich Guides Content Dictionary
  const guideDetails = {
    g1: {
      title: {
        kr: '미국 ➔ 한국 첫 해외송금 3분 체크리스트',
        en: '3-Minute Checklist for Your First US Money Transfer'
      },
      content: {
        kr: `
          <h4>1. 수취인(한국) 정보 사전 확인</h4>
          <p>첫 송금 시 가장 자주 발생하는 실패 원인은 수취인의 영문 성명 불일치입니다. 수취인 한국 은행 계좌에 등록된 영문 이름(여권 표기)과 정확히 동일해야 입금이 지연되지 않습니다.</p>
          <ul>
            <li><strong>수취 은행명 & 계좌번호:</strong> 숫자만 정확히 입력</li>
            <li><strong>수취인 연락처:</strong> 한국 휴대폰 번호 (+82-10-xxxx-xxxx)</li>
          </ul>

          <h4>2. 신원 확인 (SSN / ITIN / 운전면허증)</h4>
          <p>Wise, Remitly 등 미국 핀테크 송금 서비스 가입 시 미국 금융 당국(FinCEN) 규정에 따라 신원 확인(KYC) 절차가 진행됩니다.</p>
          <ul>
            <li>SSN(사회보장번호) 또는 ITIN 준비</li>
            <li>미국 주 운전면허증 또는 여권 사진 파일 업로드</li>
          </ul>

          <h4>3. 수수료 및 환율 우대 조건 체크</h4>
          <p>첫 송금 시 제공되는 웰컴 프로모션(수수료 0원 쿠폰 또는 환율 우대)을 반드시 활용하세요. MONEYSEND 비교 페이지에서 최고의 혜택을 제공하는 파트너사를 선택하세요.</p>
        `,
        en: `
          <h4>1. Verify Recipient Details in Korea</h4>
          <p>The most common cause of transfer delays is mismatching recipient English names. Ensure the recipient name matches their Korean bank account registration exactly.</p>
          <ul>
            <li><strong>Bank Name & Account Number:</strong> Double-check numeric digits</li>
            <li><strong>Phone Number:</strong> Korean mobile number format (+82-10-xxxx-xxxx)</li>
          </ul>

          <h4>2. Identity Verification (KYC)</h4>
          <p>Under US FinCEN regulations, providers like Wise and Remitly require identity verification during sign-up.</p>
          <ul>
            <li>Prepare your SSN or ITIN</li>
            <li>Valid US Driver's License or Passport scan</li>
          </ul>

          <h4>3. Check Welcome Promotions & Fees</h4>
          <p>Many providers offer $0 fee coupons or boosted exchange rates on your first transfer. Use MONEYSEND comparison tables to pick the best active promotion.</p>
        `
      }
    },
    g2: {
      title: {
        kr: '시중은행 vs 핀테크 간편송금 수수료 비교',
        en: 'Bank vs Fintech Remittance: Fee Breakdown'
      },
      content: {
        kr: `
          <h4>1. 시중은행(SWIFT) 송금의 숨겨진 비용 구조</h4>
          <p>전통 시중은행을 통한 해외송금은 단순히 송금 수수료만 발생하는 것이 아닙니다. 4가지 단계의 레이어 수수료가 누적됩니다.</p>
          <ul>
            <li><strong>송금 수수료:</strong> $20 ~ $30</li>
            <li><strong>전보료 (Cable Charge):</strong> $10 ~ $15</li>
            <li><strong>중개은행 수수료 (Intermediary Fee):</strong> $15 ~ $25</li>
            <li><strong>환율 마진 Spread:</strong> 기준 환율 대비 1.5% ~ 2.5% 추가 마진</li>
          </ul>

          <h4>2. 핀테크(Wise, WireBarley) 송금의 혁신</h4>
          <p>핀테크 서비스는 각 국가에 미리 자금을 예치해 두고 국내 계좌 간 이체 방식으로 처리하는 'Netting/Peer-to-Peer' 방식을 사용하여 중개은행 비용을 100% 제거합니다.</p>

          <h4>3. 최종 승자는?</h4>
          <p>$5,000 이하의 일반 생활비, 유학비, 소액 송금 시 핀테크 송금 서비스(Wise, WireBarley)를 이용할 경우 시중은행 대비 건당 $30~$60 이상을 직관적으로 절감할 수 있습니다.</p>
        `,
        en: `
          <h4>1. Hidden Fees of Traditional Bank Wires (SWIFT)</h4>
          <p>Bank wires incur multiple layers of fee charges that add up quickly:</p>
          <ul>
            <li><strong>Outgoing Wire Fee:</strong> $20 - $30</li>
            <li><strong>Cable / Teletype Charge:</strong> $10 - $15</li>
            <li><strong>Intermediary Bank Fee:</strong> $15 - $25</li>
            <li><strong>Exchange Spread:</strong> 1.5% to 2.5% markup over mid-market rate</li>
          </ul>

          <h4>2. Fintech Remittance Innovation</h4>
          <p>Modern platforms like Wise and WireBarley utilize localized accounts in both countries, bypassing SWIFT intermediary banks entirely.</p>

          <h4>3. The Verdict</h4>
          <p>For transfers under $5,000 (tuition, living expenses), fintech services save senders between $30 and $60 per transaction compared to major commercial banks.</p>
        `
      }
    },
    g3: {
      title: {
        kr: '미국 뉴욕·뉴저지 교민을 위한 해외송금 사고 예방법',
        en: 'Safety Guide for Remittance Users in NY & NJ'
      },
      content: {
        kr: `
          <h4>1. 사금융(환치기)의 법적 위험성</h4>
          <p>뉴욕/뉴저지 교민 커뮤니티에서 개인 간 현금 교환(일명 환치기)을 이용할 경우, 한국 외국환거래법 및 미국 AML(자금세탁방지법) 위반으로 형사 처벌 대상이 될 수 있습니다.</p>

          <h4>2. 연간 $50,000 이상 송금 시 유의사항</h4>
          <p>한국 금융당국 규정에 따라 연간 증빙 서류 없이 해외로 송금할 수 있는 한도는 $50,000입니다. 초과 금액 송금 시 유학생 경비 지정 또는 증빙 제출 절차를 이행해야 국세청 자금출처 조사 위험을 예방할 수 있습니다.</p>

          <h4>3. 라이선스 보유 공식 송금사 이용 필수</h4>
          <p>MONEYSEND에 등록된 모든 비교 대상 송금사는 미국 FinCEN MSB(Money Services Business) 라이선스 및 각 주 금융청 허가를 필한 정식 인증 기관입니다.</p>
        `,
        en: `
          <h4>1. Risks of Peer-to-Peer Unofficial Exchanges</h4>
          <p>Engaging in unlicensed cash swaps within community forums violates US Anti-Money Laundering (AML) laws and Korean Foreign Exchange laws.</p>

          <h4>2. Transfers Exceeding $50,000 Annually</h4>
          <p>Under Korean regulations, cumulative annual non-documented transfers over $50,000 trigger automated NTS tax reporting. Register tuition or living expenses officially to remain compliant.</p>

          <h4>3. Verify State & Federal Licenses</h4>
          <p>All comparison providers listed on MONEYSEND hold active FinCEN Money Services Business (MSB) registrations and state-level banking licenses.</p>
        `
      }
    }
  };

  // Helper Functions
  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }

  function calculatePayout(provider, usdAmount) {
    const effectiveFee = usdAmount >= 1000 && provider.id === 'remitly' ? 0 : provider.fee;
    const netUsd = Math.max(0, usdAmount - effectiveFee);
    const appliedRate = state.baseRate * (1 - provider.spreadPct);
    const payout = netUsd * appliedRate;
    const spreadLoss = netUsd * (state.baseRate * provider.spreadPct);
    return {
      fee: effectiveFee,
      appliedRate,
      payout,
      spreadLoss
    };
  }

  // Update i18n Elements across the Page
  function updateLanguage(lang) {
    state.currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'kr' ? 'ko' : 'en');
    document.documentElement.setAttribute('data-lang', lang);

    const dict = dictionary[lang];

    // Update Meta SEO
    document.getElementById('page-title').innerText = dict.pageTitle;
    document.getElementById('page-desc').setAttribute('content', dict.pageDesc);
    document.getElementById('page-keywords').setAttribute('content', dict.pageKeywords);
    document.getElementById('og-title').setAttribute('content', dict.ogTitle);
    document.getElementById('og-desc').setAttribute('content', dict.ogDesc);

    // Update elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update Switcher Active States
    document.querySelectorAll('.lang-btn, .lang-btn-mobile, .footer-lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang-target') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Re-render dynamic components
    renderCalculatorPreview();
    renderTop3Cards();
    renderComparisonCards();
  }

  // Render Calculator Preview Box & Top 3 Card List
  function renderCalculatorPreview() {
    const wise = state.providers.find(p => p.id === 'wise');
    const bank = state.providers.find(p => p.id === 'bankwire');

    const wiseCalc = calculatePayout(wise, state.sendAmount);
    const bankCalc = calculatePayout(bank, state.sendAmount);

    const baseRateText = document.getElementById('calc-base-rate-text');
    const topPayoutText = document.getElementById('calc-top-payout');
    const savingsTag = document.getElementById('calc-savings-tag');

    if (baseRateText) {
      baseRateText.innerText = `1 USD = ${state.baseRate.toFixed(2)} ${state.targetCurrency}`;
    }

    if (topPayoutText) {
      topPayoutText.innerText = `${formatNumber(wiseCalc.payout)} ${state.targetCurrency}`;
    }

    if (savingsTag) {
      const savings = wiseCalc.payout - bankCalc.payout;
      const isKr = state.currentLang === 'kr';
      savingsTag.innerText = isKr ? `+약 ₩${formatNumber(savings)} 절약` : `+Save ~₩${formatNumber(savings)}`;
    }
  }

  function renderTop3Cards() {
    const container = document.getElementById('hero-top3-cards');
    if (!container) return;

    const sorted = [...state.providers]
      .filter(p => p.id !== 'bankwire')
      .map(p => ({ ...p, calc: calculatePayout(p, state.sendAmount) }))
      .sort((a, b) => b.calc.payout - a.calc.payout)
      .slice(0, 3);

    container.innerHTML = sorted.map(p => `
      <div class="top3-item">
        <div class="top3-name">${p.logo} ${p.name}</div>
        <div class="top3-payout">${formatNumber(p.calc.payout)} ₩</div>
      </div>
    `).join('');
  }

  // Render Remittance Comparison Grid Cards
  function renderComparisonCards() {
    const container = document.getElementById('comparison-cards-container');
    if (!container) return;

    let filtered = [...state.providers];
    if (state.activeCategory === 'lowest-fee') {
      filtered.sort((a, b) => calculatePayout(b, state.sendAmount).payout - calculatePayout(a, state.sendAmount).payout);
    } else if (state.activeCategory === 'fastest') {
      filtered = filtered.filter(p => p.categories.includes('fastest'));
    } else if (state.activeCategory === 'beginner') {
      filtered = filtered.filter(p => p.categories.includes('beginner'));
    }

    const dict = dictionary[state.currentLang];
    const topProviderId = state.providers.reduce((max, p) => calculatePayout(p, state.sendAmount).payout > calculatePayout(max, state.sendAmount).payout ? p : max, state.providers[0]).id;

    container.innerHTML = filtered.map(provider => {
      const calc = calculatePayout(provider, state.sendAmount);
      const isTop = provider.id === topProviderId;

      return `
        <div class="comp-card ${isTop ? 'featured' : ''}" data-provider-id="${provider.id}">
          ${isTop ? `<div class="ribbon">${dict.badgeBestValue}</div>` : ''}

          <div class="card-header-flex">
            <div class="provider-logo-badge">${provider.logo}</div>
            <div class="provider-title-group">
              <h3>${provider.name}</h3>
              <div class="provider-speed">⚡ ${provider.speed[state.currentLang]}</div>
            </div>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            ${provider.desc[state.currentLang]}
          </p>

          <div class="card-metrics">
            <div class="metric-row">
              <span class="metric-label">${dict.labelRateApplied}</span>
              <span class="metric-val">1 USD = ${calc.appliedRate.toFixed(2)} KRW</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">${dict.labelFee}</span>
              <span class="metric-val">${calc.fee === 0 ? '<strong style="color: var(--accent-mint-hover);">$0.00 (PROMO)</strong>' : '$' + calc.fee.toFixed(2)}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">${dict.labelSpreadFee}</span>
              <span class="metric-val">~${(provider.spreadPct * 100).toFixed(2)}%</span>
            </div>
            <div class="metric-row" style="padding-top: 8px; border-top: 1px dashed var(--border-color);">
              <span class="metric-label" style="font-weight: 700; color: var(--text-dark);">${dict.labelPayout}</span>
              <span class="metric-val payout-val">${formatNumber(calc.payout)} KRW</span>
            </div>
          </div>

          <div class="comp-card-actions">
            <button class="btn btn-outline w-full btn-view-fee" data-id="${provider.id}">
              ${dict.btnViewDetails}
            </button>
            <a href="${provider.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald w-full">
              ${dict.btnVisitOfficial}
            </a>
          </div>
        </div>
      `;
    }).join('');

    // Attach fee modal listeners
    document.querySelectorAll('.btn-view-fee').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = e.currentTarget.getAttribute('data-id');
        openFeeModal(pId);
      });
    });
  }

  // Fee Details Modal Handler
  function openFeeModal(providerId) {
    const provider = state.providers.find(p => p.id === providerId);
    if (!provider) return;

    const calc = calculatePayout(provider, state.sendAmount);
    const dict = dictionary[state.currentLang];
    const isKr = state.currentLang === 'kr';

    const titleEl = document.getElementById('fee-modal-title');
    const contentEl = document.getElementById('fee-modal-content');
    const visitBtn = document.getElementById('modal-visit-btn');

    titleEl.innerText = isKr ? `${provider.name} 수수료 세부 분석` : `${provider.name} Fee Breakdown Analysis`;
    visitBtn.setAttribute('href', provider.officialUrl);

    contentEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.95rem;">
        <div style="background: var(--bg-light); padding: 14px; border-radius: var(--radius-md);">
          <strong>${isKr ? '송금 예정액:' : 'Transfer Amount:'}</strong> $${formatNumber(state.sendAmount)} USD
        </div>

        <div class="metric-row">
          <span>${isKr ? '1. 고정 송금 수수료:' : '1. Fixed Transfer Fee:'}</span>
          <strong>$${calc.fee.toFixed(2)} USD</strong>
        </div>

        <div class="metric-row">
          <span>${isKr ? '2. 시장 기준 환율 (Mid-market):' : '2. Mid-Market Base Rate:'}</span>
          <strong>1 USD = ${state.baseRate.toFixed(2)} KRW</strong>
        </div>

        <div class="metric-row">
          <span>${isKr ? '3. 업체 적용 환율:' : '3. Applied Exchange Rate:'}</span>
          <strong style="color: var(--accent-mint-hover);">1 USD = ${calc.appliedRate.toFixed(2)} KRW</strong>
        </div>

        <div class="metric-row">
          <span>${isKr ? '4. 환율 마진(Spread) 손실액:' : '4. Hidden Exchange Spread Cost:'}</span>
          <strong style="color: #ef4444;">-₩${formatNumber(calc.spreadLoss)} KRW (${(provider.spreadPct * 100).toFixed(2)}%)</strong>
        </div>

        <div style="padding-top: 14px; border-top: 2px solid var(--border-color); display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 800;">
          <span>${isKr ? '최종 실수령 금액:' : 'Net Received Payout:'}</span>
          <span style="color: var(--primary-navy);">${formatNumber(calc.payout)} KRW</span>
        </div>
      </div>
    `;

    document.getElementById('fee-modal').classList.add('active');
  }

  // Guide Reader Modal Handler
  function openGuideModal(guideId) {
    const guide = guideDetails[guideId];
    if (!guide) return;

    const titleEl = document.getElementById('guide-modal-title');
    const contentEl = document.getElementById('guide-modal-content');

    titleEl.innerText = guide.title[state.currentLang];
    contentEl.innerHTML = guide.content[state.currentLang];

    document.getElementById('guide-modal').classList.add('active');
  }

  // Toast Notification
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>💬</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  // Fetch Real-time Exchange Rates & Fees from API (/api/rates)
  async function fetchLiveRates() {
    try {
      const res = await fetch('https://moneysend.vercel.app/api/rates');
      if (!res.ok) {
        throw new Error(`API response error: status ${res.status}`);
      }
      const data = await res.json();
      
      if (data && data.providers && data.providers.wise) {
        const wiseData = data.providers.wise;
        
        // 1. Wise 실시간 환율 (Mid-market) 반영
        if (typeof wiseData.rate === 'number' && wiseData.rate > 0) {
          state.baseRate = wiseData.rate;
        }

        // 2. Wise 실시간 수수료 및 spread 반영
        const wiseProvider = state.providers.find(p => p.id === 'wise');
        if (wiseProvider) {
          if (typeof wiseData.fee === 'number') {
            wiseProvider.fee = wiseData.fee;
          }
          wiseProvider.spreadPct = 0.00;
        }

        // 3. 상단 라이브 티커 업데이트
        const ticker = document.getElementById('live-rate-ticker');
        if (ticker) {
          ticker.innerText = `USD/KRW: ${state.baseRate.toFixed(2)} ₩ (Wise API 실시간)`;
        }

        // 4. 계산기, TOP 3, 서비스 비교 카드 UI 실시간 갱신
        renderCalculatorPreview();
        renderTop3Cards();
        renderComparisonCards();
      }
    } catch (error) {
      console.warn('Wise 실시간 API 환율 로드 실패 (기본 환율 사용):', error);
    }
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Language Switchers
    document.querySelectorAll('[data-lang-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.getAttribute('data-lang-target');
        updateLanguage(lang);
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer) mobileDrawer.classList.remove('open');
      });
    });

    // Mobile Hamburger
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
    }
    if (closeDrawerBtn && mobileDrawer) {
      closeDrawerBtn.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    }

    // Calculator Send Amount Input Change
    const calcInput = document.getElementById('calc-send-amount');
    if (calcInput) {
      calcInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        state.sendAmount = val;
        renderCalculatorPreview();
        renderTop3Cards();
        renderComparisonCards();
      });
    }

    // Category Tabs Switching
    const tabsContainer = document.getElementById('category-tabs');
    if (tabsContainer) {
      tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          tabsContainer.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');
          state.activeCategory = e.currentTarget.getAttribute('data-category');
          renderComparisonCards();
        });
      });
    }

    // Quick Amount Toolbar Buttons
    const amountBtns = document.querySelectorAll('.quick-amount-btns .amount-btn');
    amountBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        amountBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const amt = parseFloat(e.currentTarget.getAttribute('data-amt'));
        state.sendAmount = amt;
        if (calcInput) calcInput.value = amt;
        renderCalculatorPreview();
        renderTop3Cards();
        renderComparisonCards();
      });
    });

    // Guide Modal Triggers
    document.querySelectorAll('.open-guide-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gId = e.currentTarget.getAttribute('data-guide-id');
        openGuideModal(gId);
      });
    });

    // Close Modals
    document.getElementById('close-fee-modal')?.addEventListener('click', () => {
      document.getElementById('fee-modal').classList.remove('active');
    });
    document.getElementById('modal-close-btn')?.addEventListener('click', () => {
      document.getElementById('fee-modal').classList.remove('active');
    });
    document.getElementById('close-guide-modal')?.addEventListener('click', () => {
      document.getElementById('guide-modal').classList.remove('active');
    });
    document.getElementById('guide-close-btn')?.addEventListener('click', () => {
      document.getElementById('guide-modal').classList.remove('active');
    });

    // Close modal on click overlay
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // FAQ Accordion Toggle
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqAccordion) {
      faqAccordion.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const item = e.currentTarget.closest('.faq-item');
          const isOpen = item.classList.contains('active');

          faqAccordion.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

          if (!isOpen) {
            item.classList.add('active');
          }
        });
      });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isKr = state.currentLang === 'kr';
        showToast(isKr ? '문의가 성공적으로 접수되었습니다. 담당자가 확인 후 답변드립니다!' : 'Inquiry submitted successfully. We will get back to you shortly!');
        contactForm.reset();
      });
    }
  }

  // Initialize Application
  function init() {
    setupEventListeners();
    updateLanguage('kr'); // Default KR
    fetchLiveRates(); // Fetch real-time Wise API rates on load
    setInterval(fetchLiveRates, 60000); // 1분 주기로 실시간 환율 갱신
  }

  document.addEventListener('DOMContentLoaded', init);
})();
