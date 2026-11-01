/**
 * Verified Government of India Schemes Dataset.
 * Sourced directly from official portals:
 * - https://www.myscheme.gov.in
 * - https://www.india.gov.in
 * - Respective Ministry Web Portals (.gov.in)
 */

export const VERIFIED_SCHEMES = [
  {
    id: 'pm-kisan-01',
    code: 'PM-KISAN',
    titleEn: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    summaryEn:
      'Central sector scheme providing income support of ₹6,000 per year to all landholding farmer families across India.',
    summaryHi:
      'सभी भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की आय सहायता प्रदान करने वाली केंद्रीय क्षेत्र योजना।',
    detailsEn:
      'Under PM-KISAN, financial assistance of ₹6,000 per annum is provided to all landholding farmer families across the country, subject to certain exclusion criteria. The amount is transferred directly into the bank accounts of the beneficiaries in three four-monthly installments of ₹2,000 each.',
    detailsHi:
      'पीएम-किसान के तहत, देश भर के सभी भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की वित्तीय सहायता तीन समान 4-माह की किस्तों (₹2,000 प्रत्येक) में सीधे बैंक खाते में प्रदान की जाती है।',
    benefitsEn: '₹6,000 per year in three direct cash installments of ₹2,000 each.',
    benefitsHi: 'प्रति वर्ष ₹6,000 की वित्तीय सहायता, ₹2,000 की तीन सीधी बैंक किस्तों में।',
    category: 'Agriculture',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://pmkisan.gov.in',
    applicationUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
    verifiedAt: new Date('2026-01-15T00:00:00.000Z'),
    criteria: [
      {
        field: 'occupation',
        operator: 'eq',
        value: 'FARMER',
        labelEn: 'Must be a practicing farmer / cultivator',
        labelHi: 'व्यवसाय किसान होना चाहिए',
        isMandatory: true,
      },
      {
        field: 'age',
        operator: 'gte',
        value: 18,
        labelEn: 'Applicant must be at least 18 years old',
        labelHi: 'आवेदक की आयु कम से कम 18 वर्ष होनी चाहिए',
        isMandatory: true,
      },
    ],
  },
  {
    id: 'pm-jay-02',
    code: 'PM-JAY',
    titleEn: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    titleHi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)',
    summaryEn:
      'World largest health insurance scheme offering cashless coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    summaryHi:
      'प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा कवर प्रदान करने वाली विश्व की सबसे बड़ी स्वास्थ्य सुरक्षा योजना।',
    detailsEn:
      'AB-PMJAY provides a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries). There is no restriction on family size, age, or gender.',
    detailsHi:
      'आयुष्मान भारत योजना के तहत माध्यमिक और तृतीयक स्तर के अस्पताल में भर्ती होने पर प्रति वर्ष ₹5 लाख तक का कैशलेस इलाज पूरी तरह निःशुल्क प्रदान किया जाता है।',
    benefitsEn: 'Cashless healthcare cover up to ₹5,00,000 per family per year at empaneled hospitals.',
    benefitsHi: 'सूचीबद्ध सरकारी व निजी अस्पतालों में प्रति परिवार ₹5,00,000 प्रति वर्ष तक निःशुल्क उपचार।',
    category: 'Healthcare',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://pmjay.gov.in',
    applicationUrl: 'https://beneficiary.nha.gov.in',
    verifiedAt: new Date('2026-02-01T00:00:00.000Z'),
    criteria: [
      {
        field: 'annual_income',
        operator: 'lte',
        value: 250000,
        labelEn: 'Annual household income should generally not exceed ₹2,50,000',
        labelHi: 'वार्षिक पारिवारिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए',
        isMandatory: true,
      },
    ],
  },
  {
    id: 'pmmvy-03',
    code: 'PMMVY',
    titleEn: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    titleHi: 'प्रधानमंत्री मातृ वंदना योजना (पीएमएमवीवाई)',
    summaryEn:
      'Maternity benefit program providing cash incentive of ₹5,000 for pregnant women and lactating mothers for the first living child.',
    summaryHi:
      'गर्भवती महिलाओं और स्तनपान कराने वाली माताओं को पहले जीवित बच्चे के लिए ₹5,000 का मातृत्व लाभ।',
    detailsEn:
      'PMMVY provides cash incentives for pregnant women to compensate for wage loss during pregnancy and childbirth and ensure adequate nutrition.',
    detailsHi:
      'गर्भावस्था के दौरान मजदूरी के नुकसान की भरपाई और पोषण सुधार के लिए महिलाओं को प्रत्यक्ष वित्तीय प्रोत्साहन दिया जाता है।',
    benefitsEn: '₹5,000 direct bank transfer in two installments for pregnant women.',
    benefitsHi: 'गर्भवती महिलाओं को ₹5,000 की वित्तीय सहायता बैंक खाते में सीधी भेजी जाती है।',
    category: 'Women & Child',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://pmmvy.wcd.gov.in',
    applicationUrl: 'https://pmmvy.wcd.gov.in/Citizen',
    verifiedAt: new Date('2026-01-20T00:00:00.000Z'),
    criteria: [
      {
        field: 'gender',
        operator: 'eq',
        value: 'FEMALE',
        labelEn: 'Must be a female applicant (pregnant or lactating mother)',
        labelHi: 'आवेदक महिला होनी चाहिए',
        isMandatory: true,
      },
      {
        field: 'age',
        operator: 'gte',
        value: 19,
        labelEn: 'Mother must be 19 years of age or older',
        labelHi: 'माता की आयु कम से कम 19 वर्ष होनी चाहिए',
        isMandatory: true,
      },
    ],
  },
  {
    id: 'pmsvanidhi-04',
    code: 'PM-SVANIDHI',
    titleEn: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    titleHi: 'पीएम स्ट्रीट वेंडर्स आत्मनिर्भर निधि (पीएम स्वनिधि)',
    summaryEn:
      'Micro-credit scheme providing collateral-free working capital loan starting at ₹10,000 with 7% interest subsidy for street vendors.',
    summaryHi:
      'रेहड़ी-पटरी और ठेला व्यवसायियों के लिए ₹10,000 से शुरू होने वाला संपार्श्विक-मुक्त (बिना गारंटी) ऋण और 7% ब्याज अनुदान।',
    detailsEn:
      'Facilitates collateral-free working capital loans of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and ₹50,000 (3rd tranche) with incentives on digital transactions.',
    detailsHi:
      'शहरी और अर्ध-शहरी वेंडरों को ₹10,000, ₹20,000 और ₹50,000 तक का कार्यशील पूंजी ऋण आसान किश्तों में दिया जाता है।',
    benefitsEn: 'Collateral-free loan of ₹10,000 to ₹50,000 with 7% interest subsidy.',
    benefitsHi: 'बिना गारंटी ₹10,000 से ₹50,000 तक का ऋण और समय पर भुगतान पर 7% ब्याज सब्सिडी।',
    category: 'Social Security',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://pmsvanidhi.mohua.gov.in',
    applicationUrl: 'https://pmsvanidhi.mohua.gov.in/Home/VendorRegistration',
    verifiedAt: new Date('2026-02-10T00:00:00.000Z'),
    criteria: [
      {
        field: 'age',
        operator: 'gte',
        value: 18,
        labelEn: 'Age must be 18 years or above',
        labelHi: 'आयु 18 वर्ष या उससे अधिक होनी चाहिए',
        isMandatory: true,
      },
      {
        field: 'occupation',
        operator: 'in',
        value: ['VENDOR', 'STREET_VENDOR', 'DAILY_WAGE_WORKER'],
        labelEn: 'Must be an active street vendor or hawker',
        labelHi: 'व्यवसाय रेहड़ी-पटरी या फेरीवाला होना चाहिए',
        isMandatory: true,
      },
    ],
  },
  {
    id: 'ssy-05',
    code: 'SSY',
    titleEn: 'Sukanya Samriddhi Yojana (SSY)',
    titleHi: 'सुकन्या समृद्धि योजना (एसएसवाई)',
    summaryEn:
      'Government-backed savings scheme for parents of girl children with high sovereign interest rate (8.2%) and tax deduction under Sec 80C.',
    summaryHi:
      'बालिकाओं के उज्ज्वल भविष्य और उच्च शिक्षा के लिए आकर्षक ब्याज दर (8.2%) वाली डाकघर बचत योजना।',
    detailsEn:
      'Account can be opened by natural or legal guardian in the name of a girl child from her birth till she turns 10 years old. Triple tax exemption (EEE).',
    detailsHi:
      'बालिका के जन्म से लेकर 10 वर्ष की आयु तक खाता खोला जा सकता है। इसमें 80C के तहत पूर्ण कर छूट मिलती है।',
    benefitsEn: 'Attractive 8.2% annual interest compounded yearly, full EEE tax exemption.',
    benefitsHi: '8.2% की उच्च ब्याज दर और परिपक्वता पर कर-मुक्त राशि।',
    category: 'Women & Child',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://www.indiapost.gov.in',
    applicationUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx',
    verifiedAt: new Date('2026-01-05T00:00:00.000Z'),
    criteria: [
      {
        field: 'gender',
        operator: 'eq',
        value: 'FEMALE',
        labelEn: 'Scheme is specifically for girl children',
        labelHi: 'योजना केवल बालिकाओं के लिए है',
        isMandatory: true,
      },
      {
        field: 'age',
        operator: 'lte',
        value: 10,
        labelEn: 'Girl child age must be 10 years or younger at account opening',
        labelHi: 'बालिका की आयु 10 वर्ष या उससे कम होनी चाहिए',
        isMandatory: true,
      },
    ],
  },
  {
    id: 'nmmss-06',
    code: 'NMMSS',
    titleEn: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    titleHi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना (एनएमएमएसएस)',
    summaryEn:
      'Merit scholarship of ₹12,000 per annum for meritorious students from economically weaker sections to prevent school dropouts.',
    summaryHi:
      'आर्थिक रूप से कमजोर वर्ग के मेधावी छात्र-छात्राओं को कक्षा 9 से 12 तक ₹12,000 प्रति वर्ष की छात्रवृत्ति।',
    detailsEn:
      'Provides 1 lakh fresh scholarships every year to selected students of class IX and its continuation in classes X to XII in government/aided schools.',
    detailsHi:
      'सरकारी एवं सहायता प्राप्त विद्यालयों में कक्षा 9 से 12वीं तक अध्ययन जारी रखने के लिए प्रति वर्ष ₹12,000 प्रदान किए जाते हैं।',
    benefitsEn: '₹12,000 per year directly to bank account of student.',
    benefitsHi: 'कक्षा 9 से 12 तक प्रति वर्ष ₹12,000 की छात्रवृत्ति सीधे बैंक खाते में।',
    category: 'Education',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://scholarships.gov.in',
    applicationUrl: 'https://scholarships.gov.in',
    verifiedAt: new Date('2026-01-10T00:00:00.000Z'),
    criteria: [
      {
        field: 'is_student',
        operator: 'eq',
        value: true,
        labelEn: 'Must be an enrolled student',
        labelHi: 'आवेदक अध्ययनरत छात्र/छात्रा होना चाहिए',
        isMandatory: true,
      },
      {
        field: 'annual_income',
        operator: 'lte',
        value: 350000,
        labelEn: "Parental annual income must not exceed ₹3,50,000",
        labelHi: 'अभिभावक की कुल वार्षिक आय ₹3,50,000 से अधिक नहीं होनी चाहिए',
        isMandatory: true,
      },
    ],
  },
  {
    id: 'apy-07',
    code: 'APY',
    titleEn: 'Atal Pension Yojana (APY)',
    titleHi: 'अटल पेंशन योजना (एपीवाई)',
    summaryEn:
      'Guaranteed pension scheme for unorganized sector workers offering ₹1,000 to ₹5,000 monthly pension from age 60.',
    summaryHi:
      'असंगठित क्षेत्र के कामगारों के लिए 60 वर्ष की आयु से ₹1,000 से ₹5,000 की मासिक गारंटीकृत पेंशन।',
    detailsEn:
      'APY is open to all bank account holders between 18 and 40 years of age. Subscribers receive a guaranteed minimum monthly pension of Rs. 1,000, 2,000, 3,000, 4,000, or 5,000 after attaining 60 years.',
    detailsHi:
      '18 से 40 वर्ष के भारतीय नागरिक इस योजना में शामिल हो सकते हैं। 60 वर्ष के बाद न्यूनतम ₹1,000 से ₹5,000 प्रतिमाह की आजीवन पेंशन सुनिश्चित होती है।',
    benefitsEn: 'Guaranteed lifetime monthly pension of ₹1,000 to ₹5,000 after age 60.',
    benefitsHi: '60 वर्ष की आयु पूर्ण होने के पश्चात ₹1,000 से ₹5,000 की गारंटीशुदा मासिक पेंशन।',
    category: 'Social Security',
    level: 'CENTRAL',
    state: null,
    status: 'PUBLISHED',
    sourceUrl: 'https://www.npscra.nsdl.co.in',
    applicationUrl: 'https://enps.nsdl.com/eNPS/ApySubRegistration.html',
    verifiedAt: new Date('2026-01-25T00:00:00.000Z'),
    criteria: [
      {
        field: 'age',
        operator: 'gte',
        value: 18,
        labelEn: 'Minimum age is 18 years',
        labelHi: 'न्यूनतम आयु 18 वर्ष होनी चाहिए',
        isMandatory: true,
      },
      {
        field: 'age',
        operator: 'lte',
        value: 40,
        labelEn: 'Maximum age for joining is 40 years',
        labelHi: 'जुड़ने की अधिकतम आयु 40 वर्ष होनी चाहिए',
        isMandatory: true,
      },
    ],
  },
];
