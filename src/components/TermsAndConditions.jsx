import Logo from "../assets/buddha avenue.png";
import WaterMark from "../assets/buddha avenue.png";

const TERMS = [
  "CONFIRMATION OF BANQUET HALL/VENUE IS SUBJECT TO ITS AVAILABILITY ON THE DATE OF RECEIPT OF ADVANCE AMOUNT. TILL SUCH TIME, YOUR BOOKING WOULD BE TREATED AS TENTATIVE AND WOULD LIABLE TO BE CANCELLED WITHOUT PRIOR NOTICE, BASED ON OUR HOTEL POLICY OF \"FIRST COME FIRST SERVE\" AGAINST THE CONFIRMED BOOKING.",
  "50% ADVANCE ON CONFIRMATION AND THE REST AMOUNT SHOULD BE SETTLED FIFTEEN DAYS BEFORE THE FUNCTION DATE.",
  "DAY EVENT SESSION: 10:00 HOURS TILL 15:00 HOURS. EVENING EVENT SESSION: 19:30 HOURS TILL 23:30 HOURS.",
  "ADVANCE PAYMENT CANNOT BE REFUNDABLE.",
  "FULL PAYMENT OF THE PACKAGE SHOULD BE DONE AT LEAST 15 DAYS (FIFTEEN DAYS) BEFORE THE FUNCTION DATE. HOTEL RESERVES THE RIGHT TO CANCEL THE BOOKING IF PAYMENT IS NOT DONE ON TIME, THIS WILL AVOID LAST MINUTE NOC ISSUES.",
  "CHEQUE WILL BE ACCEPTED 20 DAYS PRIOR TO THE EVENT. NO PDC WILL BE ENTERTAINED.",
  "MENU & OTHER EVENT DETAILS TO BE DECIDED MINIMUM 10 DAYS PRIOR TO THE EVENT. AFTER THE DUE DATE, CHEF CHOICE MENU WILL BE APPLICABLE.",
  "HOTEL RESERVES THE RIGHT TO REVISE THE RATES FOR ANY REDUCTION IN THE NUMBER OF PEOPLE.",
  "RATES QUOTED WILL BE APPLICABLE FOR THE SPECIFIC FUNCTION ONLY AND SUBJECT TO CONFIRMATION FROM YOUR END WITHIN 5 DAYS FROM THE DATE OF THE QUOTATION, AFTER WHICH THEY WILL LAPSE.",
  "THE CHARGES WOULD BE MADE AS PER THE GUARANTEED NUMBER OF PERSONS. ALL APPLICABLE GST AS EXTRA.",
  "FULL MENU ITEMS CANNOT BE SERVED ON THE TABLE FOR ANY VIP OR SPECIAL GUEST.",
  "D.J / SOUND / MUSIC / ORCHESTRA / BAR TIMINGS TILL 22:30 HRS ONLY.",
  "NO CSD, DUTY FREE LIQUORS ARE ALLOWED. ONLY U.P SALES LIQUOR IS ALLOWED.",
  "NO LEFTOVER FOOD WILL BE PACKED EVEN IF PLATES CONSUMED ARE LESS THAN THE GUARANTEED NUMBER OF PEOPLE.",
  "STARTER WILL BE SERVED ONLY (90 MINUTES) FROM THE BEGINNING OF THE EVENT.",
  "IN CASE THE BAR TEAM IS APPOINTED WITH OUTSIDE STAFF THEN, ITEMS LIKE SODA, SOFT DRINKS, JUICES, AND ICE-CUBES ETC. WILL NOT BE PART OF OUR PACKAGE.",
  "EXTRA USAGE OF THE VENUE BEYOND THE SPECIFIED TIME WOULD BE CHARGED EXTRA ON AN HOURLY BASIS AND IT WOULD BE RS. 15,000/- PER HOUR.",
  "THE HOTEL DOES NOT PERMIT DECORATORS FROM OUTSIDE OTHER THAN THE ONES ON THE HOTEL'S EMPANELMENT.",
  "ANY OTHER CHARGES SUCH AS GATE PASS WILL BE GUEST LIABILITY.",
  "THE HALL SHOULD BE VACATED ON OR BEFORE THE END TIME MENTIONED IN THIS CONTRACT. IN CASE OF EXTENSION OF TIME, APPLICABLE CHARGES WILL BE LEVIED ON AN HOURLY BASIS SUBJECT TO ITS AVAILABILITY.",
  "KINDLY NOTE THAT THE HOTEL DOES NOT ALLOW FIRE CRACKERS, DHOL GHODI, BAND WITHIN OR AROUND THE VICINITY OF THE PREMISES.",
  "ELECTRICITY CONSUMPTION SHOULD BE UP TO 03 KW ONLY. ABOVE WILL BE CHARGED @ INR 1000 + GST PER KWH ACCORDINGLY.",
  "PETS, ARMS & AMMUNITION IS STRICTLY PROHIBITED INSIDE THE PREMISES.",
  "WE WILL NOT PROVIDE QUARTER PLATES FOR ANY MAIN COURSE FOOD ITEMS.",
  "FOOD SHALL BE PREPARED ONLY FOR 110% OF THE NUMBER OF GUESTS GUARANTEED. SHOULD THE NUMBER OF PERSONS EXCEED 110% OF THE GUARANTEED NUMBER, THE HOTEL WOULD BE UNABLE TO ENSURE CONSISTENCY IN THE QUALITY OF FOOD & SERVICES.",
  "ANY ADDITION BEYOND THE EXPECTED NUMBER OF GUESTS WOULD ATTRACT AN ADDITIONAL CHARGE (SURCHARGE) OF 20% OF THE RATE APPLICABLE. ONLY AGAINST ADVANCE PAYMENT FOOD CAN BE SERVED TO EXTRA GUESTS.",
  "IPRS OR PPL LICENSE WILL BE APPLICABLE ON (LIVE PERFORMANCES, D.J, SANGEET, DANCE, ETC). WITHOUT LICENSE, EVENT WILL NOT BE ENTERTAINED IN THE PREMISES. ALL LIABILITIES RELATED TO THE LICENSES ARE TO BE BORNE BY THE GUEST. THE HOTEL WILL NOT BE RESPONSIBLE FOR ANY LAPSES.",
];

const TermsAndConditions = () => {
  return (
    <div
      className="print:break-before-page relative overflow-hidden"
      style={{ backgroundImage: `url(${WaterMark})`, backgroundSize: '30%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-white/60 pointer-events-none"></div>
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-[#f7f5ef] px-8 py-4 print:bg-white print:px-2 print:py-2 print:border-b print:border-gray-300">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Buddha Avenue" className="w-12 h-12 object-contain print:w-10 print:h-10" />
          <div>
            <h2 className="font-bold text-gray-800 print:text-sm">Buddha Avenue Banquet</h2>
            <p className="text-xs text-gray-500 print:text-xs">Terms & Conditions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 print:px-4 print:py-4">
        <h3 className="text-lg font-bold text-[#c3ad6b] mb-4 border-b-2 border-[#c3ad6b]/30 pb-2 print:text-sm print:mb-3">
          TERMS & CONDITIONS OF BOOKING
        </h3>

        <ol className="space-y-3 print:space-y-1.5 text-sm text-gray-900 print:text-xs print:text-black">
          {TERMS.map((term, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-bold text-[#c3ad6b] flex-shrink-0 print:text-black">{i + 1}.</span>
              <span>{term}</span>
            </li>
          ))}
        </ol>

        {/* Signature Section */}
        <div className="mt-8 print:mt-6 grid grid-cols-2 gap-8 print:gap-4">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12 print:mt-8">
              <p className="text-sm font-semibold text-gray-700 print:text-xs">Guest Signature</p>
              <p className="text-xs text-gray-500 print:text-xs">Name: ___________________</p>
              <p className="text-xs text-gray-500 print:text-xs">Date: ____________________</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 pt-2 mt-12 print:mt-8">
              <p className="text-sm font-semibold text-gray-700 print:text-xs">Authorized Signatory</p>
              <p className="text-xs text-gray-500 print:text-xs">Buddha Avenue Banquet</p>
              <p className="text-xs text-gray-500 print:text-xs">Date: ____________________</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
