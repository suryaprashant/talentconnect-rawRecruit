// ─────────────────────────────────────────────────────────────────────────────
// COMPANY ALIAS MAP
// Each key is the canonical normalized ID.
// Each value is an array of all known variations (all lowercase).
// Covers: Indian IT/consulting giants, global tech, startups, PSUs, banks, MNCs
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_ALIAS_MAP = {

  // ── Indian IT Giants ───────────────────────────────────────────────────────

  "tcs": [
    "tcs",
    "tata consultancy services",
    "tata consultancy services limited",
    "tata consultancy services ltd",
    "tcs india",
  ],

  "infosys": [
    "infosys",
    "infosys limited",
    "infosys ltd",
    "infosys technologies",
    "infosys technologies limited",
    "infy",
    "infosys india",
  ],

  "wipro": [
    "wipro",
    "wipro limited",
    "wipro ltd",
    "wipro technologies",
    "wipro technologies limited",
    "wipro it",
    "wipro india",
  ],

  "hcl": [
    "hcl",
    "hcl technologies",
    "hcl technologies limited",
    "hcl technologies ltd",
    "hcl tech",
    "hcltech",
    "hcl infosystems",
    "hcl india",
  ],

  "tech_mahindra": [
    "tech mahindra",
    "tech mahindra limited",
    "tech mahindra ltd",
    "techmahindra",
    "mahindra satyam", // old name after merger
    "satyam computer services", // original old name
    "satyam computers",
  ],

  "cognizant": [
    "cognizant",
    "cognizant technology solutions",
    "cognizant technology solutions india",
    "cts",
    "ctsh",
    "cognizant india",
  ],

  "mphasis": [
    "mphasis",
    "mphasis limited",
    "mphasis ltd",
    "mphasis an hp company",
  ],

  "hexaware": [
    "hexaware",
    "hexaware technologies",
    "hexaware technologies limited",
    "hexaware technologies ltd",
  ],

  "niit_technologies": [
    "niit technologies",
    "niit tech",
    "coforge", // rebranded
    "coforge limited",
  ],

  "l_and_t_technology": [
    "l&t technology services",
    "l and t technology services",
    "ltts",
    "larsen and toubro technology services",
    "l&t tech",
  ],

  "mindtree": [
    "mindtree",
    "mindtree limited",
    "mindtree ltd",
    "ltimindtree", // post merger
    "lti mindtree",
    "larsen & toubro infotech mindtree",
  ],

  "lti": [
    "lti",
    "larsen and toubro infotech",
    "larsen & toubro infotech",
    "l&t infotech",
    "ltimindtree", // post merger
    "lti mindtree",
  ],

  "persistent_systems": [
    "persistent",
    "persistent systems",
    "persistent systems limited",
    "persistent systems ltd",
  ],

  "minda_industries": [
    "minda",
    "minda industries",
    "minda industries limited",
  ],

  "kpit_technologies": [
    "kpit",
    "kpit technologies",
    "kpit technologies limited",
  ],

  "mastek": [
    "mastek",
    "mastek limited",
    "mastek ltd",
  ],

  "zensar": [
    "zensar",
    "zensar technologies",
    "zensar technologies limited",
  ],

  "cyient": [
    "cyient",
    "cyient limited",
    "infotech enterprises", // old name
  ],

  "sonata_software": [
    "sonata software",
    "sonata software limited",
  ],

  "oracle_financial_services": [
    "oracle financial services",
    "ofss",
    "oracle financial services software",
    "i-flex solutions", // old name
  ],

  // ── Global Tech (FAANG/MAANG + others) ────────────────────────────────────

  "google": [
    "google",
    "google india",
    "google llc",
    "google inc",
    "alphabet",
    "alphabet inc",
    "google india pvt ltd",
    "google india private limited",
  ],

  "microsoft": [
    "microsoft",
    "microsoft india",
    "microsoft corporation",
    "microsoft india pvt ltd",
    "microsoft india private limited",
    "msft",
    "microsoft r&d",
    "microsoft idc",
  ],

  "amazon": [
    "amazon",
    "amazon india",
    "amazon.com",
    "amazon web services",
    "aws",
    "amazon development centre india",
    "amazon india pvt ltd",
    "amazon seller services",
  ],

  "aws": [
    "aws",
    "amazon web services",
    "amazon web services india",
    "amazon web services pvt ltd",
    "amazon",
  ],

  "meta": [
    "meta",
    "meta platforms",
    "meta platforms inc",
    "facebook",
    "facebook india",
    "facebook inc",
    "instagram", // owned by meta
    "whatsapp", // owned by meta
    "meta india",
  ],

  "apple": [
    "apple",
    "apple inc",
    "apple india",
    "apple india pvt ltd",
    "apple india private limited",
  ],

  "netflix": [
    "netflix",
    "netflix inc",
    "netflix india",
  ],

  "nvidia": [
    "nvidia",
    "nvidia corporation",
    "nvidia india",
    "nvidia graphics",
  ],

  "intel": [
    "intel",
    "intel corporation",
    "intel india",
    "intel technology india",
    "intel technology india pvt ltd",
  ],

  "amd": [
    "amd",
    "advanced micro devices",
    "advanced micro devices india",
    "amd india",
  ],

  "qualcomm": [
    "qualcomm",
    "qualcomm india",
    "qualcomm india pvt ltd",
    "qualcomm technologies",
  ],

  "samsung": [
    "samsung",
    "samsung india",
    "samsung electronics",
    "samsung electronics india",
    "samsung r&d institute india",
    "sri bangalore",
    "sri noida",
  ],

  "ibm": [
    "ibm",
    "ibm india",
    "international business machines",
    "ibm india pvt ltd",
    "ibm india private limited",
    "ibm global services",
    "ibm isl",
  ],

  "oracle": [
    "oracle",
    "oracle india",
    "oracle corporation",
    "oracle india pvt ltd",
    "oracle india private limited",
  ],

  "sap": [
    "sap",
    "sap india",
    "sap labs",
    "sap labs india",
    "sap se",
    "sap india pvt ltd",
  ],

  "salesforce": [
    "salesforce",
    "salesforce india",
    "salesforce.com",
    "salesforce india pvt ltd",
  ],

  "adobe": [
    "adobe",
    "adobe india",
    "adobe systems",
    "adobe systems india",
    "adobe india pvt ltd",
    "adobe systems india pvt ltd",
  ],

  "vmware": [
    "vmware",
    "vmware india",
    "vmware software india",
    "broadcom vmware", // post acquisition
  ],

  "cisco": [
    "cisco",
    "cisco systems",
    "cisco india",
    "cisco systems india",
    "cisco systems india pvt ltd",
  ],

  "dell": [
    "dell",
    "dell india",
    "dell technologies",
    "dell technologies india",
    "dell international services india",
  ],

  "hp": [
    "hp",
    "hewlett packard",
    "hp india",
    "hewlett packard india",
    "hewlett packard enterprise",
    "hpe",
    "hpe india",
  ],

  "linkedin": [
    "linkedin",
    "linkedin india",
    "linkedin corporation",
    "linkedin india pvt ltd",
  ],

  "twitter": [
    "twitter",
    "twitter india",
    "x corp",
    "x",
    "twitter inc",
  ],

  "uber": [
    "uber",
    "uber india",
    "uber technologies",
    "uber india systems",
    "uber india systems pvt ltd",
  ],

  "airbnb": [
    "airbnb",
    "airbnb india",
    "airbnb inc",
  ],

  "spotify": [
    "spotify",
    "spotify india",
    "spotify ab",
  ],

  "stripe": [
    "stripe",
    "stripe india",
    "stripe inc",
  ],

  "atlassian": [
    "atlassian",
    "atlassian india",
    "atlassian network services",
  ],

  "zoom": [
    "zoom",
    "zoom india",
    "zoom video communications",
    "zoom video communications india",
  ],

  "slack": [
    "slack",
    "slack india",
    "slack technologies",
  ],

  "servicenow": [
    "servicenow",
    "servicenow india",
    "service now",
  ],

  "workday": [
    "workday",
    "workday india",
    "workday inc",
  ],

  // ── Global Consulting / Big 4 ─────────────────────────────────────────────

  "accenture": [
    "accenture",
    "accenture india",
    "accenture solutions",
    "accenture solutions pvt ltd",
    "accenture solutions private limited",
    "accenture technology",
  ],

  "deloitte": [
    "deloitte",
    "deloitte india",
    "deloitte usi",
    "deloitte consulting",
    "deloitte touche tohmatsu",
    "deloitte india consulting",
    "deloitte shared services india",
    "deloitte haskins & sells",
  ],

  "pwc": [
    "pwc",
    "pricewaterhousecoopers",
    "price waterhouse coopers",
    "pwc india",
    "pricewaterhousecoopers india",
    "price waterhouse",
    "pw&c",
  ],

  "ey": [
    "ey",
    "ernst & young",
    "ernst and young",
    "ey india",
    "ernst & young india",
    "ey global delivery services",
    "ey gds",
  ],

  "kpmg": [
    "kpmg",
    "kpmg india",
    "kpmg global services",
    "kpmg assurance and consulting services",
  ],

  "mckinsey": [
    "mckinsey",
    "mckinsey & company",
    "mckinsey and company",
    "mckinsey india",
    "mckinsey & company india",
  ],

  "bcg": [
    "bcg",
    "boston consulting group",
    "the boston consulting group",
    "bcg india",
    "boston consulting group india",
  ],

  "bain": [
    "bain",
    "bain & company",
    "bain and company",
    "bain india",
    "bain & company india",
  ],

  "roland_berger": [
    "roland berger",
    "roland berger india",
    "roland berger strategy consultants",
  ],

  "at_kearney": [
    "a.t. kearney",
    "at kearney",
    "kearney",
    "kearney india",
  ],

  "capgemini": [
    "capgemini",
    "capgemini india",
    "capgemini technology services india",
    "capgemini technology services",
    "sogeti", // capgemini subsidiary
  ],

  "atos": [
    "atos",
    "atos india",
    "atos syntel",
    "syntel",
    "syntel india",
  ],

  "dxc_technology": [
    "dxc",
    "dxc technology",
    "dxc technology india",
    "hewlett packard enterprise services", // predecessor
    "csc", // predecessor
    "computer sciences corporation",
  ],

  "ntt_data": [
    "ntt data",
    "ntt data india",
    "ntt data services",
  ],

  "fujitsu": [
    "fujitsu",
    "fujitsu india",
    "fujitsu consulting india",
  ],

  // ── Indian Startups / New-age Tech ────────────────────────────────────────

  "flipkart": [
    "flipkart",
    "flipkart india",
    "flipkart internet",
    "flipkart internet pvt ltd",
    "flipkart internet private limited",
    "walmart india", // parent
  ],

  "swiggy": [
    "swiggy",
    "swiggy india",
    "bundl technologies",
    "bundl technologies pvt ltd",
    "bundl technologies private limited",
  ],

  "zomato": [
    "zomato",
    "zomato india",
    "zomato limited",
    "zomato ltd",
    "zomato media",
    "zomato media pvt ltd",
  ],

  "ola": [
    "ola",
    "ola cabs",
    "ani technologies",
    "ani technologies pvt ltd",
    "ani technologies private limited",
    "ola electric", // separate entity but commonly called ola
  ],

  "paytm": [
    "paytm",
    "paytm india",
    "one97 communications",
    "one97 communications limited",
    "one97 communications ltd",
    "paytm payments bank",
  ],

  "phonepe": [
    "phonepe",
    "phone pe",
    "phonepe private limited",
    "phonepe pvt ltd",
  ],

  "razorpay": [
    "razorpay",
    "razorpay software",
    "razorpay software pvt ltd",
    "razorpay software private limited",
  ],

  "zepto": [
    "zepto",
    "karana earth",
    "zepto india",
  ],

  "blinkit": [
    "blinkit",
    "grofers", // old name
    "grofers india",
    "blinkit india",
  ],

  "nykaa": [
    "nykaa",
    "fss beauty",
    "nykaa fashion",
    "fsn e-commerce ventures",
    "fsn ecommerce ventures",
  ],

  "meesho": [
    "meesho",
    "fashnear technologies",
    "fashnear technologies pvt ltd",
    "meesho india",
  ],

  "cred": [
    "cred",
    "cred india",
    "dreamplug technologies",
    "dreamplug technologies pvt ltd",
  ],

  "groww": [
    "groww",
    "nextbillion technology",
    "nextbillion technology pvt ltd",
    "groww india",
  ],

  "zerodha": [
    "zerodha",
    "zerodha broking",
    "zerodha broking limited",
    "zerodha india",
  ],

  "upstox": [
    "upstox",
    "rksv securities",
    "rksv securities india",
    "upstox india",
  ],

  "angel_broking": [
    "angel broking",
    "angel one",
    "angel broking limited",
    "angel one limited",
  ],

  "policybazaar": [
    "policybazaar",
    "policybazaar india",
    "pb fintech",
    "pb fintech limited",
    "paisabazaar", // sister company
  ],

  "lenskart": [
    "lenskart",
    "lenskart solutions",
    "lenskart solutions pvt ltd",
  ],

  "dream11": [
    "dream11",
    "dream sports",
    "dream sports india",
    "dream sports pvt ltd",
  ],

  "mpl": [
    "mpl",
    "mobile premier league",
    "galactus funware technology",
    "mpl india",
  ],

  "byju": [
    "byju's",
    "byjus",
    "byju",
    "think and learn",
    "think and learn pvt ltd",
    "think and learn private limited",
    "byju's india",
  ],

  "unacademy": [
    "unacademy",
    "sorting hat technologies",
    "sorting hat technologies pvt ltd",
    "unacademy india",
  ],

  "vedantu": [
    "vedantu",
    "vedantu innovations",
    "vedantu innovations pvt ltd",
  ],

  "freshworks": [
    "freshworks",
    "freshworks india",
    "freshdesk", // old name
    "freshworks inc",
    "freshworks technologies",
  ],

  "zoho": [
    "zoho",
    "zoho corporation",
    "zoho india",
    "zoho corp",
    "adventnet", // old name
    "zoho corporation pvt ltd",
  ],

  "browserstack": [
    "browserstack",
    "browserstack india",
    "browserstack inc",
  ],

  "postman": [
    "postman",
    "postman india",
    "postman inc",
  ],

  "hasura": [
    "hasura",
    "hasura india",
    "hasura inc",
  ],

  "chargebee": [
    "chargebee",
    "chargebee india",
    "chargebee inc",
  ],

  "cleartax": [
    "cleartax",
    "clear",
    "defmacro software",
    "defmacro software pvt ltd",
    "cleartax india",
  ],

  "slice": [
    "slice",
    "slice india",
    "quadrillion finance",
    "quadrillion finance pvt ltd",
  ],

  "springworks": [
    "springworks",
    "freshworks spinoff",
    "springworks india",
  ],

  "darwinbox": [
    "darwinbox",
    "darwinbox digital solutions",
    "darwinbox digital solutions pvt ltd",
  ],

  "leadsquared": [
    "leadsquared",
    "leadsquared india",
    "marico ventures", // investor but commonly confused
  ],

  "moengage": [
    "moengage",
    "moengage india",
    "moengage inc",
  ],

  "eka_software": [
    "eka software",
    "eka",
    "eka software solutions",
  ],

  // ── Indian Banks & Financial Services ────────────────────────────────────

  "hdfc_bank": [
    "hdfc bank",
    "hdfc bank limited",
    "hdfc bank ltd",
    "hdfc",
  ],

  "icici_bank": [
    "icici bank",
    "icici bank limited",
    "icici bank ltd",
    "icici",
  ],

  "sbi": [
    "sbi",
    "state bank of india",
    "state bank of india limited",
  ],

  "axis_bank": [
    "axis bank",
    "axis bank limited",
    "axis bank ltd",
    "utm bank", // old name
  ],

  "kotak_mahindra": [
    "kotak",
    "kotak mahindra bank",
    "kotak mahindra bank limited",
    "kotak bank",
  ],

  "yes_bank": [
    "yes bank",
    "yes bank limited",
    "yes bank ltd",
  ],

  "idfc_bank": [
    "idfc bank",
    "idfc first bank",
    "idfc first bank limited",
  ],

  "rbl_bank": [
    "rbl bank",
    "ratnakar bank",
    "rbl bank limited",
  ],

  "bajaj_finserv": [
    "bajaj finserv",
    "bajaj finance",
    "bajaj finance limited",
    "bajaj finserv limited",
  ],

  // ── Indian PSUs / Government Companies ───────────────────────────────────

  "isro": [
    "isro",
    "indian space research organisation",
    "indian space research organization",
    "isro bangalore",
  ],

  "drdo": [
    "drdo",
    "defence research and development organisation",
    "defense research and development organization",
    "drdo india",
  ],

  "bel": [
    "bel",
    "bharat electronics limited",
    "bharat electronics ltd",
    "bel india",
  ],

  "bhel": [
    "bhel",
    "bharat heavy electricals limited",
    "bharat heavy electricals ltd",
  ],

  "ongc": [
    "ongc",
    "oil and natural gas corporation",
    "oil & natural gas corporation",
    "ongc india",
  ],

  "ntpc": [
    "ntpc",
    "national thermal power corporation",
    "ntpc limited",
    "ntpc ltd",
  ],

  "iocl": [
    "iocl",
    "indian oil corporation",
    "indian oil corporation limited",
    "indian oil",
    "ioc",
  ],

  "bpcl": [
    "bpcl",
    "bharat petroleum corporation limited",
    "bharat petroleum",
    "bharat petroleum corporation",
  ],

  "hpcl": [
    "hpcl",
    "hindustan petroleum corporation limited",
    "hindustan petroleum",
  ],

  "gail": [
    "gail",
    "gail india",
    "gas authority of india limited",
    "gail india limited",
  ],

  "sail": [
    "sail",
    "steel authority of india",
    "steel authority of india limited",
  ],

  "nalco": [
    "nalco",
    "national aluminium company",
    "national aluminium company limited",
  ],

  "hal": [
    "hal",
    "hindustan aeronautics limited",
    "hindustan aeronautics ltd",
    "hal bangalore",
  ],

  "nic": [
    "nic",
    "national informatics centre",
    "national informatics center",
    "nic india",
  ],

  "cdac": [
    "cdac",
    "c-dac",
    "centre for development of advanced computing",
    "center for development of advanced computing",
    "cdac india",
  ],

  // ── E-commerce / Retail ──────────────────────────────────────────────────

  "myntra": [
    "myntra",
    "myntra designs",
    "myntra designs pvt ltd",
    "myntra designs private limited",
    "myntra jabong",
  ],

  "snapdeal": [
    "snapdeal",
    "jasper infotech",
    "jasper infotech pvt ltd",
    "snapdeal india",
  ],

  "shopify": [
    "shopify",
    "shopify india",
    "shopify inc",
  ],

  // ── Media / Entertainment / Gaming ───────────────────────────────────────

  "hotstar": [
    "hotstar",
    "disney+ hotstar",
    "star india",
    "novi digital entertainment",
    "novi digital entertainment pvt ltd",
  ],

  "sony": [
    "sony",
    "sony india",
    "sony pictures networks india",
    "sony entertainment",
    "sony liv",
  ],

  "zee": [
    "zee",
    "zee entertainment",
    "zee entertainment enterprises",
    "zee entertainment enterprises limited",
  ],

  "times_internet": [
    "times internet",
    "times internet limited",
    "times of india",
    "the times of india",
    "bennett coleman",
    "bennett coleman & co",
  ],

  "inmobi": [
    "inmobi",
    "inmobi india",
    "inmobi pte",
  ],

  "zynga": [
    "zynga",
    "zynga india",
    "zynga game network india",
  ],

  // ── Semiconductors / Hardware ─────────────────────────────────────────────

  "texas_instruments": [
    "texas instruments",
    "texas instruments india",
    "ti india",
    "texas instruments india pvt ltd",
  ],

  "arm": [
    "arm",
    "arm holdings",
    "arm india",
    "arm embedded technologies",
    "arm embedded technologies pvt ltd",
  ],

  "mediatek": [
    "mediatek",
    "mediatek india",
    "mediatek india technology",
  ],

  "broadcom": [
    "broadcom",
    "broadcom india",
    "broadcom corporation",
    "broadcom india pvt ltd",
  ],

  "micron": [
    "micron",
    "micron technology",
    "micron india",
    "micron semiconductor india",
  ],

  // ── Telecom ───────────────────────────────────────────────────────────────

  "jio": [
    "jio",
    "reliance jio",
    "reliance jio infocomm",
    "reliance jio infocomm limited",
    "jio platforms",
    "jio india",
  ],

  "airtel": [
    "airtel",
    "bharti airtel",
    "bharti airtel limited",
    "airtel india",
    "bharti airtel india",
  ],

  "vodafone": [
    "vodafone",
    "vodafone india",
    "vodafone idea",
    "vi",
    "idea cellular",
    "vodafone idea limited",
  ],

  "bsnl": [
    "bsnl",
    "bharat sanchar nigam limited",
    "bharat sanchar nigam ltd",
    "bsnl india",
  ],

  "ericsson": [
    "ericsson",
    "ericsson india",
    "ericsson india global services",
    "ericsson india pvt ltd",
  ],

  "nokia": [
    "nokia",
    "nokia india",
    "nokia solutions and networks",
    "nsn india",
  ],

  // ── Automobile / Manufacturing ─────────────────────────────────────────────

  "tata_motors": [
    "tata motors",
    "tata motors limited",
    "tata motors ltd",
  ],

  "mahindra": [
    "mahindra",
    "mahindra & mahindra",
    "mahindra and mahindra",
    "m&m",
    "mahindra & mahindra limited",
    "mahindra group",
  ],

  "maruti_suzuki": [
    "maruti suzuki",
    "maruti",
    "maruti suzuki india",
    "maruti suzuki india limited",
    "msil",
  ],

  "hero_motocorp": [
    "hero motocorp",
    "hero honda", // old name
    "hero motocorp limited",
    "hero moto corp",
  ],

  "bajaj_auto": [
    "bajaj auto",
    "bajaj auto limited",
    "bajaj auto ltd",
  ],

  "bosch": [
    "bosch",
    "bosch india",
    "robert bosch",
    "robert bosch india",
    "bosch limited",
    "bosch global software technologies",
    "rbei",
  ],

  // ── Other Global MNCs with large India presence ───────────────────────────

  "jpmorgan": [
    "jpmorgan",
    "jp morgan",
    "j.p. morgan",
    "jpmc",
    "jp morgan chase",
    "jpmorgan chase",
    "jp morgan india",
    "jpmorgan chase india",
    "jpmorgan services india",
  ],

  "goldman_sachs": [
    "goldman sachs",
    "goldman sachs india",
    "goldman sachs services india",
    "goldman sachs services pvt ltd",
    "gs india",
  ],

  "morgan_stanley": [
    "morgan stanley",
    "morgan stanley india",
    "morgan stanley advantage services",
    "morgan stanley india company",
  ],

  "citibank": [
    "citibank",
    "citi",
    "citigroup",
    "citibank india",
    "citi india",
    "citicorp services india",
  ],

  "barclays": [
    "barclays",
    "barclays india",
    "barclays bank",
    "barclays technology centre india",
    "btci",
  ],

  "deutsche_bank": [
    "deutsche bank",
    "deutsche bank india",
    "deutsche bank ag",
    "db india",
  ],

  "hsbc": [
    "hsbc",
    "hsbc india",
    "hongkong and shanghai banking corporation",
    "hsbc global technology india",
    "hsbc software development india",
  ],

  "standard_chartered": [
    "standard chartered",
    "standard chartered bank",
    "standard chartered india",
    "stanchart",
  ],

  "american_express": [
    "american express",
    "amex",
    "american express india",
    "american express banking corp india",
  ],

  "visa": [
    "visa",
    "visa india",
    "visa inc",
    "visa worldwide india",
  ],

  "mastercard": [
    "mastercard",
    "mastercard india",
    "mastercard technology india",
    "mastercard india pvt ltd",
  ],

  "paypal": [
    "paypal",
    "paypal india",
    "paypal holdings",
    "paypal india pvt ltd",
  ],

  "walmart": [
    "walmart",
    "walmart india",
    "walmart global tech",
    "walmart labs",
    "walmart labs india",
  ],

  "target": [
    "target",
    "target india",
    "target corporation india",
    "target india pvt ltd",
  ],

  "ge": [
    "ge",
    "general electric",
    "ge india",
    "ge india technology centre",
    "ge healthcare",
    "ge healthcare india",
  ],

  "siemens": [
    "siemens",
    "siemens india",
    "siemens limited",
    "siemens technology and services",
  ],

  "honeywell": [
    "honeywell",
    "honeywell india",
    "honeywell automation india",
    "honeywell technology solutions",
  ],

  "3m": [
    "3m",
    "3m india",
    "minnesota mining and manufacturing",
    "3m india limited",
  ],

  "abbott": [
    "abbott",
    "abbott india",
    "abbott laboratories",
    "abbott india limited",
  ],

  "johnson_and_johnson": [
    "johnson & johnson",
    "johnson and johnson",
    "j&j",
    "j&j india",
    "johnson & johnson india",
  ],

};