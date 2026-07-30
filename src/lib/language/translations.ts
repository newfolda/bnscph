export type Language = "en" | "tgl"

type ComparisonItem = {
  traditional: string
  preferred: string
}

type FaqItem = {
  question: string
  answer: string
}

export type Translation = {
  header: {
    home: string
    howItWorks: string
    transactions: string
    whyChooseUs: string
    faq: string
    callOrText: string
  }
  hero: {
    ariaLabel: string
    prefix: string
    rotatingWords: string[]
    wordSuffix: string
    lineTwo: string
    lineThree: string
    supportingPrefix: string
    typewriterWords: string[]
    cta: string
  }
  process: {
    pill: string
    title: string
    supporting: string
    steps: Array<{ title: string; description: string }>
  }
  transactions: {
    pill: string
    title: string
    description: string
    recentlyPurchased: string
    purchasedOn: string
    sellerFrom: string
    dateLocale: string
  }
  sellerTrust: {
    pill: string
    title: string
    items: Array<{ value: string; title: string; description: string }>
  }
  benefits: {
    pill: string
    titleLineOne: string
    titleLineTwo: string
    description: string
    cta: string
    ctaSupporting: string
    privateSale: string
    preferredHeading: string
    professionalBuyer: string
    comparisonItems: ComparisonItem[]
  }
  faq: {
    pill: string
    title: string
    description: string
    supporting: string
    items: FaqItem[]
  }
  legal: {
    valuationNotice: string
    termsConfirmationBefore: string
    termsConfirmationAfter: string
    privacyNoticeBefore: string
    privacyNoticeLink: string
    marketingConsent: string
    photoWarning: string
  }
  footer: {
    description: string
    quickLinks: string
    contactUs: string
    businessHours: string
    home: string
    howItWorks: string
    latestTransactions: string
    whyChooseUs: string
    frequentlyAskedQuestions: string
    callOrText: string
    emailUs: string
    ourLocation: string
    mondaySaturday: string
    copyright: string
  }
}

export const translations: Record<Language, Translation> = {
  en: {
    header: {
      home: "Home",
      howItWorks: "How It Works",
      transactions: "Transactions",
      whyChooseUs: "Why Choose Us",
      faq: "FAQ",
      callOrText: "Call or Text Us",
    },
    hero: {
      ariaLabel: "The Smartest Way to Sell Your Car in the Philippines.",
      prefix: "The",
      rotatingWords: ["Smartest", "Easiest", "Fastest", "Simplest"],
      wordSuffix: "Way",
      lineTwo: "to Sell Your Car",
      lineThree: "in the Philippines.",
      supportingPrefix: "Maximum value. Zero",
      typewriterWords: ["hassle.", "headache.", "time wasted."],
      cta: "See My Car's Value",
    },
    process: {
      pill: "Process",
      title: "How It Works?",
      supporting: "3 SIMPLE STEPS.",
      steps: [
        { title: "Tell Us About Your Car", description: "Send your car’s details and a few recent photos. We’ll review them and provide an initial offer." },
        { title: "We Inspect It at Your Doorstep", description: "If you’re happy with the initial offer, choose a convenient time. Our team will inspect the car at your location." },
        { title: "Get Paid the Same Day", description: "Once the inspection is complete, we’ll proceed with the sale. Receive payment by cash or bank transfer." },
      ],
    },
    transactions: {
      pill: "Latest Transactions",
      title: "Cars Recently Purchased by Buy and Sell Cars Philippines",
      description: "Helping car owners across the Philippines sell their vehicles with ease.",
      recentlyPurchased: "Recently Purchased",
      purchasedOn: "Purchased on",
      sellerFrom: "Seller from",
      dateLocale: "en-US",
    },
    sellerTrust: {
      pill: "OUR TRACK RECORD",
      title: "Trusted by Car Sellers Across the Philippines",
      items: [
        { value: "5+ Years", title: "Car-Buying Experience", description: "Providing a seamless car-buying service for Filipino since 2021." },
        { value: "1,000+", title: "Cars Purchased", description: "Completed transactions with vehicle owners across the Philippines." },
        { value: "2010 &", title: "Newer Models Accepted", description: "Vehicles from 2010 onward are considered, subject to inspection." },
        { value: "100%", title: "Safe & Hassle-Free", description: "A secure and straightforward process from valuation to payment." },
      ],
    },
    benefits: {
      pill: "WHY CHOOSE US",
      titleLineOne: "Sell Your Car.",
      titleLineTwo: "Not Your Time.",
      description: "From valuation to payment, we handle every step so you can sell with confidence.",
      cta: "Get My Free Car Valuation",
      ctaSupporting: "No obligation. Free vehicle evaluation.",
      privateSale: "Private Sale",
      preferredHeading: "BUY AND SELL CARS PHILIPPINES",
      professionalBuyer: "Professional Car Buyer",
      comparisonItems: [
        { traditional: "Respond to endless inquiries", preferred: "Deal with one professional buyer" },
        { traditional: "Negotiate back and forth", preferred: "Receive a clear, fair offer" },
        { traditional: "Meet unfamiliar buyers", preferred: "Doorstep pickup at your location" },
        { traditional: "Manage paperwork and follow-ups", preferred: "No paperwork stress" },
        { traditional: "Wait weeks or even months to complete the sale", preferred: "Complete the sale in as soon as one day" },
      ],
    },
    faq: {
      pill: "FAQ",
      title: "Frequently Asked Questions",
      description: "Answers to the most common questions about selling your car with Buy and Sell Cars Philippines.",
      supporting: "Still have questions? We're here to help every step of the way.",
      items: [
        { question: "How do I sell my car to Buy and Sell Cars Philippines?", answer: "Send us your vehicle details, including its make, model, year, mileage, condition, and recent photos. We’ll review the information and provide an initial valuation. If you’re interested in proceeding, we’ll arrange a free inspection at your preferred location. Once the final offer is accepted and the documents are verified, we’ll complete the sale and arrange payment." },
        { question: "What vehicles do you buy?", answer: "We buy most makes and models from year 2010 onward, including sedans, hatchbacks, crossovers, SUVs, vans, pickups, sports cars, and luxury vehicles. Acceptance remains subject to the vehicle’s condition, ownership documents, and our final evaluation." },
        { question: "How is my car’s value determined?", answer: "We consider its make, model, year, variant, mileage, overall condition, service history, ownership documents, and current market demand. The valuation is based on the information provided and is confirmed after the physical inspection." },
        { question: "Is the initial valuation the final offer?", answer: "Not always. The initial valuation is based on the details and photos you provide. The final offer is confirmed after we inspect the vehicle and verify its condition and documents. If we identify anything that was not included in the original information, we’ll explain how it affects the offer." },
        { question: "Do I need to bring my car to your office?", answer: "No. Our team can inspect the vehicle at your home, workplace, or another agreed location. The location must be safe, accessible, and suitable for a proper vehicle inspection." },
        { question: "What documents do I need?", answer: "You’ll typically need the Original Certificate of Registration (CR), latest Official Receipt (OR), a valid government-issued ID of the registered owner, a Deed of Sale or other proof of ownership if applicable, and any available service and maintenance records. Additional documents may be requested depending on the vehicle’s ownership or registration status." },
        { question: "Can I sell a car that is not registered in my name?", answer: "Possibly, but you must provide documents showing the legal transfer of ownership and your authority to sell the vehicle. We’ll review the documents before proceeding. Additional verification may be required." },
        { question: "How will I receive payment?", answer: "Payment can be made in cash or through bank transfer, depending on the transaction and the agreed payment method. Payment is released only after the sale is completed and all required documents have been verified and signed." },
        { question: "Which areas do you serve?", answer: "We accommodate vehicle sellers across the Philippines, subject to team availability and location. Send us your location so we can confirm whether an inspection can be arranged in your area." },
      ],
    },
    legal: {
      valuationNotice: "This request is for an initial vehicle valuation only. It is not a purchase contract or guaranteed offer. Any purchase remains subject to inspection, verification of vehicle condition, ownership and documents, financing or encumbrances, final agreement, and completion of the required transaction documents.",
      termsConfirmationBefore: "I confirm that I am at least 18 years old, that I own the vehicle or am authorized to act for its owner, that the submitted information is accurate, and that I agree to the",
      termsConfirmationAfter: ".",
      privacyNoticeBefore: "We will use your information to assess your vehicle, contact you, arrange an inspection, prevent fraud, and complete the transaction where applicable. Read our",
      privacyNoticeLink: "Privacy Notice",
      marketingConsent: "I would like to receive occasional promotions and vehicle-related updates.",
      photoWarning: "Upload vehicle photos only. Do not upload government IDs, OR/CR documents, banking information, signatures, or other sensitive documents at this stage.",
    },
    footer: {
      description: "We make selling your car simple, convenient, and secure with fair offers, doorstep inspection, and same-day payment.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      businessHours: "Business Hours",
      home: "Home",
      howItWorks: "How It Works",
      latestTransactions: "Latest Transactions",
      whyChooseUs: "Why Choose Us",
      frequentlyAskedQuestions: "Frequently Asked Questions",
      callOrText: "Call or Text Us",
      emailUs: "Email Us",
      ourLocation: "Our Location",
      mondaySaturday: "Monday – Saturday",
      copyright: "© 2026 Buy and Sell Cars Philippines. All rights reserved.",
    },
  },
  tgl: {
    header: {
      home: "Home",
      howItWorks: "Paano Ito Gumagana",
      transactions: "Mga Transaksyon",
      whyChooseUs: "Bakit Kami",
      faq: "Mga Madalas Itanong",
      callOrText: "Tawagan o I-text Kami",
    },
    hero: {
      ariaLabel: "Ang pinakamadaling paraan para ibenta ang iyong sasakyan sa Pilipinas.",
      prefix: "Ang",
      rotatingWords: ["Pinakamadaling", "Pinakamabilis", "Pinakasimple", "Pinakamatalino"],
      wordSuffix: "Paraan",
      lineTwo: "para Ibenta ang Iyong Sasakyan",
      lineThree: "sa Pilipinas.",
      supportingPrefix: "Pinakamataas na halaga. Walang",
      typewriterWords: ["abala.", "sakit ng ulo.", "nasayang na oras."],
      cta: "Alamin ang Halaga ng Aking Sasakyan",
    },
    process: {
      pill: "Proseso",
      title: "Paano Ito Gumagana?",
      supporting: "3 MADADALING HAKBANG.",
      steps: [
        { title: "Ibahagi ang Detalye ng Iyong Sasakyan", description: "Ilagay ang modelo, taon, mileage, at ilang bagong larawan ng iyong sasakyan para makatanggap ng paunang alok." },
        { title: "Susuriin Namin Ito sa Iyong Lugar", description: "Kung sang-ayon ka sa paunang alok, pumili ng angkop na oras para sa inspeksyon. Pupunta ang aming team sa iyong lokasyon." },
        { title: "Matanggap ang Bayad sa Araw Ring Iyon", description: "Kapag maayos na ang lahat, tapusin ang bentahan at tanggapin ang bayad sa cash o bank transfer." },
      ],
    },
    transactions: {
      pill: "Mga Huling Transaksyon",
      title: "Mga Sasakyang Kamakailang Binili ng Buy and Sell Cars Philippines",
      description: "Tumutulong sa mga may-ari ng sasakyan sa buong Pilipinas na makapagbenta nang madali.",
      recentlyPurchased: "Kamakailang Nabili",
      purchasedOn: "Binili noong",
      sellerFrom: "Nagbebenta mula sa",
      dateLocale: "fil-PH",
    },
    sellerTrust: {
      pill: "AMING TRACK RECORD",
      title: "Pinagkakatiwalaan ng mga Car Seller sa Buong Pilipinas",
      items: [
        { value: "5+ Taon", title: "Karanasan sa Pagbili ng Sasakyan", description: "Nagbibigay ng seamless na car-buying service para sa mga Filipino owner mula 2021." },
        { value: "1,000+", title: "Sasakyang Nabili", description: "Mga transaksyong nakumpleto kasama ang mga vehicle owner sa buong Pilipinas." },
        { value: "2010 &", title: "Mas Bagong Modelo ang Tinatanggap", description: "Isinasaalang-alang ang mga sasakyan mula model year 2010 pataas, subject sa inspection." },
        { value: "100%", title: "Ligtas at Hassle-Free", description: "Ligtas at diretsong proseso mula valuation hanggang payment." },
      ],
    },
    benefits: {
      pill: "BAKIT KAMI",
      titleLineOne: "Ibenta ang Iyong Sasakyan.",
      titleLineTwo: "Hindi ang Iyong Oras.",
      description: "Mula sa pagpapahalaga hanggang sa bayad, kami ang bahala sa bawat hakbang para makapagbenta ka nang may kumpiyansa.",
      cta: "Kunin ang Libreng Pagtataya ng Aking Sasakyan",
      ctaSupporting: "Walang obligasyon. Libreng pagtatasa ng sasakyan.",
      privateSale: "Pribadong Bentahan",
      preferredHeading: "BUY AND SELL CARS PHILIPPINES",
      professionalBuyer: "Propesyonal na Mamimili ng Sasakyan",
      comparisonItems: [
        { traditional: "Maghanap at magsuri ng mga posibleng mamimili", preferred: "Direkta kaming pagbentahan" },
        { traditional: "Makipagtawaran nang paulit-ulit", preferred: "Tumanggap ng malinaw at patas na alok" },
        { traditional: "Mag-ayos ng maraming pagtingin sa sasakyan", preferred: "Magpa-iskedyul ng isang inspeksyon sa iyong lugar" },
        { traditional: "Asikasuhin ang mga papeles at follow-up", preferred: "Makakuha ng propesyonal na tulong sa papeles" },
        { traditional: "Maghintay nang ilang linggo o buwan para makumpleto ang bentahan", preferred: "Tapusin ang bentahan sa loob lamang ng isang araw" },
      ],
    },
    faq: {
      pill: "MGA MADALAS ITANONG",
      title: "Mga Madalas Itanong",
      description: "Mga sagot sa karaniwang tanong tungkol sa pagbebenta ng iyong sasakyan sa Buy and Sell Cars Philippines.",
      supporting: "May iba ka pang tanong? Nandito kami para tumulong sa bawat hakbang.",
      items: [
        { question: "Paano ko maibebenta ang aking sasakyan sa Buy and Sell Cars Philippines?", answer: "Ipadala sa amin ang detalye ng iyong sasakyan, kabilang ang make, model, taon, mileage, kondisyon, at mga bagong larawan. Susuriin namin ang impormasyon at magbibigay ng paunang pagtataya. Kung nais mong magpatuloy, mag-aayos kami ng libreng inspeksyon sa lugar na gusto mo. Kapag tinanggap ang huling alok at napatunayan ang mga dokumento, tatapusin namin ang bentahan at aayusin ang bayad." },
        { question: "Anong mga sasakyan ang binibili ninyo?", answer: "Bumibili kami ng karamihan ng make at model mula taong 2010 pataas, kabilang ang sedan, hatchback, crossover, SUV, van, pickup, sports car, at luxury vehicle. Nakabatay pa rin ang pagtanggap sa kondisyon ng sasakyan, mga dokumento ng pagmamay-ari, at aming huling pagsusuri." },
        { question: "Paano tinutukoy ang halaga ng aking sasakyan?", answer: "Isinasaalang-alang namin ang make, model, taon, variant, mileage, pangkalahatang kondisyon, service history, mga dokumento ng pagmamay-ari, at kasalukuyang demand sa merkado. Nakabatay ang pagtataya sa impormasyong ibinigay at kinukumpirma matapos ang pisikal na inspeksyon." },
        { question: "Huling alok na ba ang paunang pagtataya?", answer: "Hindi palagi. Nakabatay ang paunang pagtataya sa mga detalye at larawang ibinibigay mo. Kinukumpirma ang huling alok matapos naming siyasatin ang sasakyan at beripikahin ang kondisyon at mga dokumento nito. Kung may makita kaming hindi kasama sa orihinal na impormasyon, ipaliliwanag namin kung paano nito naaapektuhan ang alok." },
        { question: "Kailangan ko bang dalhin ang sasakyan sa inyong opisina?", answer: "Hindi. Maaaring siyasatin ng aming team ang sasakyan sa iyong bahay, trabaho, o ibang napagkasunduang lugar. Kailangang ligtas, madaling puntahan, at angkop ang lugar para sa wastong inspeksyon ng sasakyan." },
        { question: "Anong mga dokumento ang kailangan ko?", answer: "Karaniwan ay kailangan ang Original Certificate of Registration (CR), pinakabagong Official Receipt (OR), valid government-issued ID ng rehistradong may-ari, Deed of Sale o ibang patunay ng pagmamay-ari kung naaangkop, at anumang available na service at maintenance records. Maaaring humingi ng dagdag na dokumento depende sa pagmamay-ari o rehistrasyon ng sasakyan." },
        { question: "Maaari ba akong magbenta ng sasakyang hindi nakarehistro sa aking pangalan?", answer: "Posible, ngunit kailangan mong magbigay ng mga dokumentong nagpapatunay ng legal na paglipat ng pagmamay-ari at ng iyong awtoridad na ibenta ang sasakyan. Susuriin namin ang mga dokumento bago magpatuloy. Maaaring kailanganin ang karagdagang beripikasyon." },
        { question: "Paano ko matatanggap ang bayad?", answer: "Maaaring bayaran sa cash o bank transfer, depende sa transaksyon at napagkasunduang paraan ng pagbabayad. Ibibigay lamang ang bayad matapos makumpleto ang bentahan at maberipika at malagdaan ang lahat ng kinakailangang dokumento." },
        { question: "Aling mga lugar ang inyong nasasakupan?", answer: "Tumatanggap kami ng mga nagbebenta ng sasakyan sa buong Pilipinas, depende sa availability ng aming team at sa lokasyon. Ipadala ang iyong lokasyon para makumpirma namin kung maaaring mag-ayos ng inspeksyon sa inyong lugar." },
      ],
    },
    legal: {
      valuationNotice: "Ang request na ito ay para lamang sa paunang pagtataya ng sasakyan. Hindi ito kontrata ng pagbili o garantisadong alok. Ang anumang pagbili ay sasailalim sa inspeksyon, beripikasyon ng kondisyon, pagmamay-ari at mga dokumento ng sasakyan, financing o encumbrances, huling kasunduan, at pagkumpleto ng mga kinakailangang dokumento sa transaksyon.",
      termsConfirmationBefore: "Kinukumpirma ko na ako ay hindi bababa sa 18 taong gulang, na ako ang may-ari ng sasakyan o may pahintulot ng may-ari nito, na tama ang impormasyong isinumite, at sumasang-ayon ako sa",
      termsConfirmationAfter: ".",
      privacyNoticeBefore: "Gagamitin namin ang iyong impormasyon upang tasahin ang iyong sasakyan, makipag-ugnayan sa iyo, mag-ayos ng inspeksyon, maiwasan ang panlilinlang, at kumpletuhin ang transaksyon kung naaangkop. Basahin ang aming",
      privacyNoticeLink: "Abiso sa Privacy",
      marketingConsent: "Nais kong makatanggap ng paminsan-minsang promosyon at mga update tungkol sa sasakyan.",
      photoWarning: "Mga larawan lamang ng sasakyan ang i-upload. Huwag mag-upload ng government ID, OR/CR documents, impormasyon sa bangko, lagda, o iba pang sensitibong dokumento sa yugtong ito.",
    },
    footer: {
      description: "Ginagawa naming simple, maginhawa, at ligtas ang pagbebenta ng iyong sasakyan sa pamamagitan ng patas na alok, inspeksyon sa iyong lugar, at bayad sa araw ring iyon.",
      quickLinks: "Mabilis na Mga Link",
      contactUs: "Makipag-ugnayan",
      businessHours: "Oras ng Operasyon",
      home: "Home",
      howItWorks: "Paano Ito Gumagana",
      latestTransactions: "Mga Huling Transaksyon",
      whyChooseUs: "Bakit Kami",
      frequentlyAskedQuestions: "Mga Madalas Itanong",
      callOrText: "Tawagan o I-text Kami",
      emailUs: "Mag-email sa Amin",
      ourLocation: "Aming Lokasyon",
      mondaySaturday: "Lunes – Sabado",
      copyright: "© 2026 Buy and Sell Cars Philippines. All rights reserved.",
    },
  },
}
