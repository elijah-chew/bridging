import fs from "node:fs";
import path from "node:path";

const YEARS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

function series(valuesNewestFirst) {
  const cop = {};
  YEARS.forEach((y, i) => {
    const v = valuesNewestFirst[YEARS.length - 1 - i];
    if (v == null || v === "–" || v === "-" || v === "") return;
    cop[y] = Number(v);
  });
  return cop;
}

function jc(institution, stream, values, code) {
  return {
    kind: "jc",
    institution,
    course: stream,
    stream,
    code: code || "",
    aggregate: stream === "IB" ? "IB" : stream.includes("MI") || institution.includes("Millennia") ? "L1R4" : "L1R5",
    cop: series(values),
  };
}

// Arts then Science columns are 2026 → 2014 (Indigo tables).
const JC = [
  jc("Raffles Institution", "Arts", [5, 5, 5, 5, 5, 5, 5, 6, 5, 4, 4, 4, 4]),
  jc("Hwa Chong Institution", "Arts", [5, 5, 5, 5, 5, 5, 5, 6, 5, 4, 4, 4, 4]),
  jc("Nanyang Junior College", "Arts", [7, 7, 6, 6, 6, 6, 7, 7, 8, 7, 7, 7, 8]),
  jc("Eunoia Junior College", "Arts", [6, 6, 7, 8, 8, 8, 8, 10, 11, 9, null, null, null]),
  jc("Temasek Junior College", "Arts", [7, 8, 8, 9, 9, 9, 10, 11, 11, 9, 9, 8, 8]),
  jc("Dunman High School", "Arts", [8, 8, 8, 9, 9, 9, 9, 10, null, null, null, null, null]),
  jc("Victoria Junior College", "Arts", [8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 6, 6, 6]),
  jc("National Junior College", "Arts", [8, 8, 8, 8, 8, 8, 8, 8, 9, 7, 5, 6, 7]),
  jc("Anglo-Chinese Junior College", "Arts", [9, 9, 9, 9, 9, 9, 9, 9, 10, 8, 7, 7, 7]),
  jc("River Valley High School", "Arts", [9, 9, 9, 9, 9, 9, 9, 10, null, null, null, null, null]),
  jc("St. Andrew's Junior College", "Arts", [10, 10, 10, 10, 11, 11, 11, 11, 12, 10, 9, 9, 10]),
  jc("Anderson Serangoon Junior College", "Arts", [10, 11, 11, 11, 11, 11, 11, 12, null, null, null, null, null]),
  jc("Catholic Junior College", "Arts", [12, 13, 13, 14, 13, 13, 13, 13, 14, 10, 10, 10, 10]),
  jc("Tampines Meridian Junior College", "Arts", [12, 13, 13, 13, 13, 13, 13, 13, null, null, null, null, null]),
  jc("Jurong Pioneer Junior College", "Arts", [14, 15, 15, 17, 16, 16, 16, 16, null, null, null, null, null]),
  jc("Yishun Innova Junior College", "Arts", [19, null, 20, 20, 19, 19, 20, 20, null, null, null, null, null]),
  jc("Millennia Institute", "Arts / L1R4", [20, 19, null, 20, 20, 19, 19, 19, 18, 20, 20, 20, 20]),
  jc("Raffles Institution", "Science", [3, 3, 4, 4, 4, 4, 4, 5, 5, 4, 3, 3, 3]),
  jc("Hwa Chong Institution", "Science", [3, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 3, 3]),
  jc("Nanyang Junior College", "Science", [5, 5, 5, 5, 5, 6, 6, 6, 7, 6, 6, 7, 7]),
  jc("Eunoia Junior College", "Science", [5, 6, 6, 6, 6, 7, 7, 9, 10, 9, null, null, null]),
  jc("National Junior College", "Science", [6, 7, 7, 7, 7, 7, 7, 7, 8, 6, 5, 5, 5]),
  jc("Victoria Junior College", "Science", [6, 6, 6, 7, 7, 7, 7, 6, 6, 5, 5, 5, 5]),
  jc("Dunman High School", "Science", [6, 7, 7, 8, 8, 8, 8, 9, null, null, null, null, null]),
  jc("Temasek Junior College", "Science", [7, 7, 7, 8, 8, 9, 9, 9, 10, 9, 9, 8, 7]),
  jc("Anglo-Chinese Junior College", "Science", [7, 8, 8, 8, 8, 8, 8, 8, 9, 7, 7, 6, 6]),
  jc("River Valley High School", "Science", [8, 8, 8, 8, 8, 8, 8, 9, null, null, null, null, null]),
  jc("St. Andrew's Junior College", "Science", [8, 9, 9, 9, 9, 10, 10, 10, 11, 9, 9, 9, 9]),
  jc("Anderson Serangoon Junior College", "Science", [9, 10, 10, 10, 10, 11, 11, 11, null, null, null, null, null]),
  jc("Catholic Junior College", "Science", [11, 12, 12, 13, 13, 13, 13, 14, 15, 11, 10, 10, 10]),
  jc("Tampines Meridian Junior College", "Science", [12, 12, 12, 13, 13, 13, 13, 14, null, null, null, null, null]),
  jc("Jurong Pioneer Junior College", "Science", [14, 14, 14, 14, 14, 15, 15, 15, null, null, null, null, null]),
  jc("Yishun Innova Junior College", "Science", [18, 20, 20, 19, 19, 20, 20, 19, null, null, null, null, null]),
  jc("Millennia Institute", "Science / L1R4", [20, 17, null, 17, 18, 18, 20, 20, 17, 20, 17, 18, 18]),
  jc("Anglo-Chinese School (Independent)", "IB", [5, null, null, null, null, null, null, null, null, null, 5, null, null], "IB"),
  jc("St. Joseph's Institution", "IB", [6, null, null, null, null, null, null, null, null, null, 6, null, null], "IB"),
];

const POLY_2026 = [
  ["NP", "Ngee Ann Polytechnic", "Accountancy", "N51", "ELR2B2-B", 11],
  ["NP", "Ngee Ann Polytechnic", "Aerospace Engineering", "N65", "ELR2B2-C", 13],
  ["NP", "Ngee Ann Polytechnic", "Applied AI & Analytics", "N81", "ELR2B2-C", 11],
  ["NP", "Ngee Ann Polytechnic", "Arts Business Management", "N91", "ELR2B2-B", 13],
  ["NP", "Ngee Ann Polytechnic", "Banking & Finance", "N53", "ELR2B2-B", 9],
  ["NP", "Ngee Ann Polytechnic", "Biomedical Engineering", "N60", "ELR2B2-C", 10],
  ["NP", "Ngee Ann Polytechnic", "Biomedical Science", "N59", "ELR2B2-C", 7],
  ["NP", "Ngee Ann Polytechnic", "Business Studies", "N45", "ELR2B2-B", 10],
  ["NP", "Ngee Ann Polytechnic", "Chemical & Biomolecular Engineering", "N56", "ELR2B2-C", 11],
  ["NP", "Ngee Ann Polytechnic", "Chinese Media & Communication", "N88", "ELR2B2-A", 14],
  ["NP", "Ngee Ann Polytechnic", "Chinese Studies", "N70", "ELR2B2-A", 14],
  ["NP", "Ngee Ann Polytechnic", "Common Business Programme", "N97", "ELR2B2-B", 11],
  ["NP", "Ngee Ann Polytechnic", "Common Engineering Programme", "N71", "ELR2B2-C", 19],
  ["NP", "Ngee Ann Polytechnic", "Common ICT Programme", "N98", "ELR2B2-C", 15],
  ["NP", "Ngee Ann Polytechnic", "Common Media Programme", "N14", "ELR2B2-A", 13],
  ["NP", "Ngee Ann Polytechnic", "Common Science Programme", "N15", "ELR2B2-C", 9],
  ["NP", "Ngee Ann Polytechnic", "Computing With Law", "N16", "ELR2B2-C", 14],
  ["NP", "Ngee Ann Polytechnic", "Cybersecurity & Digital Forensics", "N94", "ELR2B2-C", 12],
  ["NP", "Ngee Ann Polytechnic", "Design", "N12", "ELR2B2-D", 13],
  ["NP", "Ngee Ann Polytechnic", "Early Childhood Development & Education", "N96", "ELR2B2-A", 19],
  ["NP", "Ngee Ann Polytechnic", "Electrical Engineering", "N43", "ELR2B2-C", 20],
  ["NP", "Ngee Ann Polytechnic", "Electronic & Computer Engineering", "N44", "ELR2B2-C", 20],
  ["NP", "Ngee Ann Polytechnic", "Engineering Science", "N93", "ELR2B2-C", 10],
  ["NP", "Ngee Ann Polytechnic", "Environmental Science & Sustainability", "N74", "ELR2B2-C", 13],
  ["NP", "Ngee Ann Polytechnic", "Film, Sound & Video", "N82", "ELR2B2-A", 13],
  ["NP", "Ngee Ann Polytechnic", "Hotel & Leisure Facilities Management", "N40", "ELR2B2-C", 15],
  ["NP", "Ngee Ann Polytechnic", "Information Technology", "N54", "ELR2B2-C", 18],
  ["NP", "Ngee Ann Polytechnic", "International Trade & Business", "N85", "ELR2B2-B", 11],
  ["NP", "Ngee Ann Polytechnic", "Landscape Design & Horticulture", "N57", "ELR2B2-D", 16],
  ["NP", "Ngee Ann Polytechnic", "Mass Communication", "N67", "ELR2B2-A", 11],
  ["NP", "Ngee Ann Polytechnic", "Mechanical Engineering", "N41", "ELR2B2-C", 20],
  ["NP", "Ngee Ann Polytechnic", "Mechatronics & Robotics", "N50", "ELR2B2-C", 20],
  ["NP", "Ngee Ann Polytechnic", "Nursing", "N69", "ELR2B2-C", 28],
  ["NP", "Ngee Ann Polytechnic", "Offshore & Sustainable Engineering", "N42", "ELR2B2-C", 22],
  ["NP", "Ngee Ann Polytechnic", "Optometry", "N83", "ELR2B2-C", 12],
  ["NP", "Ngee Ann Polytechnic", "Pharmaceutical Science", "N73", "ELR2B2-C", 9],
  ["NP", "Ngee Ann Polytechnic", "Psychology & Community Development", "N11", "ELR2B2-A", 10],
  ["NP", "Ngee Ann Polytechnic", "Real Estate Business", "N48", "ELR2B2-B", 13],
  ["NP", "Ngee Ann Polytechnic", "Stage & Live Events", "N13", "ELR2B2-A", 14],
  ["NP", "Ngee Ann Polytechnic", "Tamil Studies With Early Education", "N95", "ELR2B2-A", 19],
  ["NP", "Ngee Ann Polytechnic", "Tourism & Resort Management", "N72", "ELR2B2-B", 12],
  ["NYP", "Nanyang Polytechnic", "Accountancy & Finance", "C98", "ELR2B2-B", 11],
  ["NYP", "Nanyang Polytechnic", "Advanced & Digital Manufacturing", "C62", "ELR2B2-C", 26],
  ["NYP", "Nanyang Polytechnic", "Aerospace Engineering", "C26", "ELR2B2-C", 14],
  ["NYP", "Nanyang Polytechnic", "AI & Data Engineering", "C31", "ELR2B2-C", 12],
  ["NYP", "Nanyang Polytechnic", "AI Robotics", "C87", "ELR2B2-C", 26],
  ["NYP", "Nanyang Polytechnic", "Animation, Games & Visual Effects", "C29", "ELR2B2-D", 12],
  ["NYP", "Nanyang Polytechnic", "Applied AI & Analytics", "C43", "ELR2B2-C", 10],
  ["NYP", "Nanyang Polytechnic", "Applied Chemistry", "C45", "ELR2B2-C", 10],
  ["NYP", "Nanyang Polytechnic", "Architecture", "C38", "ELR2B2-C", 15],
  ["NYP", "Nanyang Polytechnic", "Banking & Finance", "C96", "ELR2B2-B", 11],
  ["NYP", "Nanyang Polytechnic", "Biomedical Engineering", "C71", "ELR2B2-C", 12],
  ["NYP", "Nanyang Polytechnic", "Biomedical Science With Analytics", "C25", "ELR2B2-C", 8],
  ["NYP", "Nanyang Polytechnic", "Business & Financial Technology", "C35", "ELR2B2-C", 14],
  ["NYP", "Nanyang Polytechnic", "Business Management", "C94", "ELR2B2-B", 14],
  ["NYP", "Nanyang Polytechnic", "Cloud Engineering", "C75", "ELR2B2-C", 21],
  ["NYP", "Nanyang Polytechnic", "Common Business & Technology Programme", "C24", "ELR2B2-C", 16],
  ["NYP", "Nanyang Polytechnic", "Common Business Programme", "C34", "ELR2B2-B", 14],
  ["NYP", "Nanyang Polytechnic", "Common Design & Media Programme", "C28", "ELR2B2-D", 16],
  ["NYP", "Nanyang Polytechnic", "Common Engineering Programme", "C42", "ELR2B2-C", 23],
  ["NYP", "Nanyang Polytechnic", "Common ICT Programme", "C36", "ELR2B2-C", 18],
  ["NYP", "Nanyang Polytechnic", "Common Science Programme", "C27", "ELR2B2-C", 11],
  ["NYP", "Nanyang Polytechnic", "Communication & Motion Design", "C30", "ELR2B2-D", 19],
  ["NYP", "Nanyang Polytechnic", "Computing", "C85", "ELR2B2-C", 26],
  ["NYP", "Nanyang Polytechnic", "Cybersecurity & Digital Forensics", "C54", "ELR2B2-C", 11],
  ["NYP", "Nanyang Polytechnic", "Electronic & Computer Engineering", "C89", "ELR2B2-C", 25],
  ["NYP", "Nanyang Polytechnic", "Experience Design", "C32", "ELR2B2-D", 18],
  ["NYP", "Nanyang Polytechnic", "Food & Beverage Business", "C46", "ELR2B2-B", 15],
  ["NYP", "Nanyang Polytechnic", "Food Science & Nutrition", "C69", "ELR2B2-C", 12],
  ["NYP", "Nanyang Polytechnic", "Game Development & Technology", "C70", "ELR2B2-C", 15],
  ["NYP", "Nanyang Polytechnic", "Hospitality & Tourism Management", "C67", "ELR2B2-B", 15],
  ["NYP", "Nanyang Polytechnic", "Media & Communication Management", "C93", "ELR2B2-B", 13],
  ["NYP", "Nanyang Polytechnic", "Nursing", "C97", "ELR2B2-C", 28],
  ["NYP", "Nanyang Polytechnic", "Oral Health Therapy", "C72", "ELR2B2-C", 9],
  ["NYP", "Nanyang Polytechnic", "Pharmaceutical Science", "C65", "ELR2B2-C", 10],
  ["NYP", "Nanyang Polytechnic", "Social Work", "C47", "ELR2B2-A", 12],
  ["NYP", "Nanyang Polytechnic", "Sport & Wellness Management", "C81", "ELR2B2-B", 13],
  ["NYP", "Nanyang Polytechnic", "Sustainability in Engineering With Business", "C41", "ELR2B2-C", 23],
  ["RP", "Republic Polytechnic", "Aerospace Engineering", "R40", "ELR2B2-C", 24],
  ["RP", "Republic Polytechnic", "Applied AI & Analytics", "R13", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Applied Chemistry", "R17", "ELR2B2-C", 14],
  ["RP", "Republic Polytechnic", "Arts & Entertainment Production Management", "R25", "ELR2B2-A", 21],
  ["RP", "Republic Polytechnic", "Aviation Management", "R39", "ELR2B2-C", 17],
  ["RP", "Republic Polytechnic", "Biological Sciences", "R16", "ELR2B2-C", 17],
  ["RP", "Republic Polytechnic", "Biomedical Science", "R14", "ELR2B2-C", 10],
  ["RP", "Republic Polytechnic", "Business", "R60", "ELR2B2-B", 16],
  ["RP", "Republic Polytechnic", "Business Process & Engineering Management", "R11", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Common Arts, Media & Design Programme", "R65", "ELR2B2-A", 21],
  ["RP", "Republic Polytechnic", "Common Business Programme", "R57", "ELR2B2-B", 20],
  ["RP", "Republic Polytechnic", "Common Engineering Programme", "R42", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Common ICT Programme", "R58", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Common Science Programme", "R59", "ELR2B2-C", 17],
  ["RP", "Republic Polytechnic", "Common Sports & Health Programme", "R63", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Consumer Insights & Psychology", "R48", "ELR2B2-B", 18],
  ["RP", "Republic Polytechnic", "Cybersecurity & Digital Forensics", "R55", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Design", "R67", "ELR2B2-D", 21],
  ["RP", "Republic Polytechnic", "Digital Content Creation", "R19", "ELR2B2-A", 21],
  ["RP", "Republic Polytechnic", "Electrical & Electronic Engineering", "R50", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Engineering", "R56", "ELR2B2-C", 25],
  ["RP", "Republic Polytechnic", "Enterprise Cloud Computing & Management", "R12", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Environmental & Marine Science", "R62", "ELR2B2-C", 10],
  ["RP", "Republic Polytechnic", "Events & Project Management", "R28", "ELR2B2-B", 23],
  ["RP", "Republic Polytechnic", "Financial Technology", "R18", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Hospitality & Tourism Management", "R66", "ELR2B2-B", 22],
  ["RP", "Republic Polytechnic", "Hotel & Leisure Management", "R37", "ELR2B2-B", 24],
  ["RP", "Republic Polytechnic", "Human Resource Management With Psychology", "R52", "ELR2B2-B", 16],
  ["RP", "Republic Polytechnic", "Information Technology", "R47", "ELR2B2-C", 24],
  ["RP", "Republic Polytechnic", "Integrated Community Care", "R45", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Mass Communication", "R32", "ELR2B2-A", 17],
  ["RP", "Republic Polytechnic", "Mobility & Robotic Systems", "R54", "ELR2B2-C", 22],
  ["RP", "Republic Polytechnic", "Outdoor Education", "R33", "ELR2B2-A", 18],
  ["RP", "Republic Polytechnic", "Pharmaceutical Science", "R22", "ELR2B2-C", 17],
  ["RP", "Republic Polytechnic", "Restaurant & Culinary Management", "R46", "ELR2B2-B", 22],
  ["RP", "Republic Polytechnic", "Sonic Arts", "R24", "ELR2B2-D", 22],
  ["RP", "Republic Polytechnic", "Sport & Exercise Science", "R26", "ELR2B2-C", 14],
  ["RP", "Republic Polytechnic", "Sport Coaching", "R49", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Sports & Health", "R43", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Supply Chain Management", "R21", "ELR2B2-C", 26],
  ["RP", "Republic Polytechnic", "Sustainable Built Environment", "R61", "ELR2B2-C", 26],
  ["SP", "Singapore Polytechnic", "Accountancy", "S75", "ELR2B2-B", 12],
  ["SP", "Singapore Polytechnic", "Aeronautical Engineering", "S88", "ELR2B2-C", 13],
  ["SP", "Singapore Polytechnic", "Aerospace Electronics", "S90", "ELR2B2-C", 13],
  ["SP", "Singapore Polytechnic", "Applied AI & Analytics", "S30", "ELR2B2-C", 8],
  ["SP", "Singapore Polytechnic", "Applied Chemistry", "S64", "ELR2B2-C", 9],
  ["SP", "Singapore Polytechnic", "Architecture", "S66", "ELR2B2-D", 15],
  ["SP", "Singapore Polytechnic", "Banking & Finance", "S76", "ELR2B2-B", 11],
  ["SP", "Singapore Polytechnic", "Biomedical Science", "S98", "ELR2B2-C", 7],
  ["SP", "Singapore Polytechnic", "Business Administration", "S71", "ELR2B2-B", 12],
  ["SP", "Singapore Polytechnic", "Chemical & Biological Engineering", "S70", "ELR2B2-C", 12],
  ["SP", "Singapore Polytechnic", "Civil Engineering", "S68", "ELR2B2-C", 21],
  ["SP", "Singapore Polytechnic", "Common Business Programme", "S31", "ELR2B2-B", 12],
  ["SP", "Singapore Polytechnic", "Common Engineering Programme", "S40", "ELR2B2-C", 19],
  ["SP", "Singapore Polytechnic", "Common ICT Programme", "S32", "ELR2B2-C", 17],
  ["SP", "Singapore Polytechnic", "Common Science Programme", "S28", "ELR2B2-C", 9],
  ["SP", "Singapore Polytechnic", "Computer Engineering", "S53", "ELR2B2-C", 20],
  ["SP", "Singapore Polytechnic", "Computer Science", "S69", "ELR2B2-C", 15],
  ["SP", "Singapore Polytechnic", "Cybersecurity & Digital Forensics", "S54", "ELR2B2-C", 11],
  ["SP", "Singapore Polytechnic", "Electrical & Electronic Engineering", "S99", "ELR2B2-C", 15],
  ["SP", "Singapore Polytechnic", "Engineering With Business", "S42", "ELR2B2-C", 12],
  ["SP", "Singapore Polytechnic", "Facilities Management", "S95", "ELR2B2-D", 18],
  ["SP", "Singapore Polytechnic", "Food Science & Technology", "S47", "ELR2B2-C", 12],
  ["SP", "Singapore Polytechnic", "Human Resource Management With Psychology", "S48", "ELR2B2-B", 12],
  ["SP", "Singapore Polytechnic", "Integrated Events & Project Management", "S50", "ELR2B2-D", 15],
  ["SP", "Singapore Polytechnic", "Interior Design", "S89", "ELR2B2-D", 15],
  ["SP", "Singapore Polytechnic", "Landscape Architecture", "S94", "ELR2B2-D", 15],
  ["SP", "Singapore Polytechnic", "Marine Engineering", "S63", "ELR2B2-C", 22],
  ["SP", "Singapore Polytechnic", "Maritime Business", "S74", "ELR2B2-C", 15],
  ["SP", "Singapore Polytechnic", "Mechanical Engineering", "S91", "ELR2B2-C", 15],
  ["SP", "Singapore Polytechnic", "Mechatronics & Robotics", "S73", "ELR2B2-C", 13],
  ["SP", "Singapore Polytechnic", "Media, Arts & Design", "S29", "ELR2B2-A", 13],
  ["SP", "Singapore Polytechnic", "Optometry", "S67", "ELR2B2-C", 11],
  ["SP", "Singapore Polytechnic", "Perfumery & Cosmetic Science", "S38", "ELR2B2-C", 11],
  ["TP", "Temasek Polytechnic", "Accountancy & Finance", "T02", "ELR2B2-B", 11],
  ["TP", "Temasek Polytechnic", "Aerospace Electronics", "T50", "ELR2B2-C", 12],
  ["TP", "Temasek Polytechnic", "Aerospace Engineering", "T51", "ELR2B2-C", 10],
  ["TP", "Temasek Polytechnic", "Applied Artificial Intelligence", "T69", "ELR2B2-C", 14],
  ["TP", "Temasek Polytechnic", "Architectural Technology & Building Services", "T29", "ELR2B2-C", 16],
  ["TP", "Temasek Polytechnic", "Aviation Management", "T04", "ELR2B2-C", 11],
  ["TP", "Temasek Polytechnic", "Big Data & Analytics", "T60", "ELR2B2-C", 14],
  ["TP", "Temasek Polytechnic", "Biomedical Engineering", "T38", "ELR2B2-C", 12],
  ["TP", "Temasek Polytechnic", "Business", "T10", "ELR2B2-B", 12],
  ["TP", "Temasek Polytechnic", "Business Process & Systems Engineering", "T43", "ELR2B2-C", 15],
  ["TP", "Temasek Polytechnic", "Chemical Engineering", "T33", "ELR2B2-C", 13],
  ["TP", "Temasek Polytechnic", "Common Business Programme", "T01", "ELR2B2-B", 12],
  ["TP", "Temasek Polytechnic", "Common Design Programme", "T71", "ELR2B2-D", 15],
  ["TP", "Temasek Polytechnic", "Common Engineering Programme", "T56", "ELR2B2-C", 19],
  ["TP", "Temasek Polytechnic", "Common ICT Programme", "T63", "ELR2B2-C", 20],
  ["TP", "Temasek Polytechnic", "Common Science Programme", "T70", "ELR2B2-C", 11],
  ["TP", "Temasek Polytechnic", "Communication Design", "T59", "ELR2B2-D", 16],
  ["TP", "Temasek Polytechnic", "Communications & Media Management", "T40", "ELR2B2-A", 12],
  ["TP", "Temasek Polytechnic", "Computer Engineering", "T13", "ELR2B2-C", 19],
  ["TP", "Temasek Polytechnic", "Culinary Arts & Management", "T18", "ELR2B2-B", 15],
  ["TP", "Temasek Polytechnic", "Cybersecurity & Digital Forensics", "T62", "ELR2B2-C", 14],
  ["TP", "Temasek Polytechnic", "Digital Film & Television", "T23", "ELR2B2-D", 14],
  ["TP", "Temasek Polytechnic", "Early Childhood Development & Education", "T68", "ELR2B2-A", 16],
  ["TP", "Temasek Polytechnic", "Electrical & Electronic Engineering", "T72", "ELR2B2-C", 22],
  ["TP", "Temasek Polytechnic", "Fashion Management & Design", "T20", "ELR2B2-D", 15],
  ["TP", "Temasek Polytechnic", "Food, Nutrition & Culinary Science", "T26", "ELR2B2-C", 12],
  ["TP", "Temasek Polytechnic", "Hospitality & Tourism Management", "T08", "ELR2B2-B", 14],
  ["TP", "Temasek Polytechnic", "Immersive Media & Game Development", "T58", "ELR2B2-C", 15],
  ["TP", "Temasek Polytechnic", "Information Technology", "T30", "ELR2B2-C", 18],
  ["TP", "Temasek Polytechnic", "Integrated Facility Management", "T28", "ELR2B2-C", 16],
  ["TP", "Temasek Polytechnic", "Interior Architecture & Design", "T22", "ELR2B2-D", 12],
  ["TP", "Temasek Polytechnic", "International Trade & Logistics", "T07", "ELR2B2-B", 14],
  ["TP", "Temasek Polytechnic", "Law & Management", "T09", "ELR2B2-A", 10],
  ["TP", "Temasek Polytechnic", "Marketing", "T67", "ELR2B2-B", 13],
  ["TP", "Temasek Polytechnic", "Mechatronics", "T66", "ELR2B2-C", 12],
  ["TP", "Temasek Polytechnic", "Medical Biotechnology", "T64", "ELR2B2-C", 8],
  ["TP", "Temasek Polytechnic", "Pharmaceutical Science", "T25", "ELR2B2-C", 10],
  ["TP", "Temasek Polytechnic", "Product Experience & Design", "T35", "ELR2B2-D", 15],
  ["TP", "Temasek Polytechnic", "Psychology Studies", "T48", "ELR2B2-A", 9],
  ["TP", "Temasek Polytechnic", "Social Sciences in Gerontology", "T53", "ELR2B2-A", 14],
  ["TP", "Temasek Polytechnic", "Veterinary Technology", "T45", "ELR2B2-C", 9],
];

const ITE = [
  ["ITE College Central", "Higher Nitec in Accounting", "HF3AC", "ELR1B3", 8],
  ["ITE College Central", "Higher Nitec in IT Systems & Networks", "HF3IS", "ELR1B3", 8],
  ["ITE College East", "Higher Nitec in IT Systems & Networks", "HF3IS", "ELR1B3", 17],
  ["ITE College West", "Higher Nitec in IT Systems & Networks", "HF3IS", "ELR1B3", 15],
  ["ITE College Central", "Higher Nitec in Cyber & Network Security", "HF3CN", "ELR1B3", 12],
  ["ITE College East", "Higher Nitec in Cyber & Network Security", "HF3CN", "ELR1B3", 16],
  ["ITE College Central", "Higher Nitec in Business Administration", "HF3BA", "ELR1B3", 11],
  ["ITE College East", "Higher Nitec in Business Administration", "HF3BA", "ELR1B3", 15],
  ["ITE College West", "Higher Nitec in Business Administration", "HF3BA", "ELR1B3", 14],
  ["ITE College Central", "Higher Nitec in Event Management", "HF3EM", "ELB4", 12],
  ["ITE College East", "Higher Nitec in Nursing", "HF3NS", "ELR1B3", 18],
  ["ITE College East", "Higher Nitec in Electronics Engineering", "HF3EE", "ELR1B3", 19],
  ["ITE College West", "Higher Nitec in Electronics Engineering", "HF3EE", "ELR1B3", 18],
  ["ITE College Central", "Higher Nitec in Mechanical Engineering", "HF3ME", "ELR1B3", 20],
  ["ITE College West", "Higher Nitec in Mechanical Engineering", "HF3ME", "ELR1B3", 19],
  ["ITE College Central", "Higher Nitec in AI Applications", "HF3AI", "ELR1B3", 10],
  ["ITE College East", "Higher Nitec in Applied Food Science", "HF3FS", "ELR1B3", 16],
  ["ITE College West", "Higher Nitec in Automotive Engineering", "HF3AE", "ELR1B3", 18],
  ["ITE College Central", "Higher Nitec in Visual Effects", "HF3VE", "ELB4", 14],
  ["ITE College East", "Higher Nitec in Logistics & Supply Chain Management", "HF3LS", "ELR1B3", 17],
];

function lastOfRange(text) {
  if (!text) return null;
  const m = String(text).match(/(\d+)\s*$/);
  return m ? Number(m[1]) : Number.parseInt(text, 10);
}

async function fetchDatastore(id) {
  const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${id}&limit=800`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${id} ${res.status}`);
  const json = await res.json();
  return json.result.records || [];
}

function upsertPoly(map, code, institution, course, aggregate, year, cop) {
  const key = `${code}|${institution}`;
  if (!map.has(key)) {
    map.set(key, {
      kind: "poly",
      institution,
      course,
      code,
      aggregate,
      cop: {},
    });
  }
  const row = map.get(key);
  if (course) row.course = course;
  if (aggregate) row.aggregate = aggregate;
  if (cop != null && !Number.isNaN(cop)) row.cop[year] = cop;
}

async function main() {
  const poly = new Map();
  for (const [, inst, course, code, agg, cop] of POLY_2026) {
    upsertPoly(poly, code, inst, course, agg, 2026, cop);
  }

  try {
    const nyp = await fetchDatastore("d_eb7bb85a49e021e63f9cb7b54497a400");
    for (const rec of nyp) {
      const year = Number(rec.academic_year);
      const cop = lastOfRange(rec.gceo_cut_off_point);
      const name = String(rec.course_name || "")
        .replace(/^DIPLOMA IN /i, "")
        .replace(/\w\S*/g, (w) => w[0] + w.slice(1).toLowerCase());
      upsertPoly(poly, rec.jae_course_code, "Nanyang Polytechnic", name, "ELR2B2", year, cop);
    }
  } catch (err) {
    console.warn("NYP fetch failed", err.message);
  }

  const npSets = [
    ["d_571e2ace874fe32b20393e50a4749faf", 2025],
    ["d_98b23f1a35559e6b7be1974dcf30d0bd", 2024],
    ["d_becb4f7b9e9e5ba95cf7382f1ec63feb", 2023],
    ["d_e0d9c03e6f4b530fac0bcd459e91cc8f", 2022],
  ];
  for (const [id] of npSets) {
    try {
      const rows = await fetchDatastore(id);
      for (const rec of rows) {
        const year = Number(rec.year);
        const cop = lastOfRange(rec.elr2b2);
        upsertPoly(
          poly,
          rec.course_code,
          "Ngee Ann Polytechnic",
          String(rec.course_name || "").replace(/^Diploma in /i, ""),
          rec.elr2b2_type || "ELR2B2",
          year,
          cop
        );
      }
    } catch (err) {
      console.warn("NP fetch failed", id, err.message);
    }
  }

  const ite = ITE.map(([institution, course, code, aggregate, cop]) => ({
    kind: "ite",
    institution,
    course,
    code,
    aggregate,
    cop: { 2026: cop },
  }));

  const order = { jc: 0, poly: 1, ite: 2 };
  const courses = [...JC, ...poly.values(), ...ite].sort((a, b) => {
    const k = (order[a.kind] ?? 9) - (order[b.kind] ?? 9);
    if (k) return k;
    const i = a.institution.localeCompare(b.institution);
    if (i) return i;
    return a.course.localeCompare(b.course);
  });

  const out = {
    updated: new Date().toISOString().slice(0, 10),
    years: YEARS,
    sources: [
      "MOE Joint Admissions Exercise published net aggregates",
      "Nanyang Polytechnic GCE O-Level aggregate cut-off points 2014-2026 (data.gov.sg)",
      "Ngee Ann Polytechnic planned intake and cut-off points 2022-2025 (data.gov.sg)",
    ],
    courses,
  };
  const dest = path.join("static", "data", "higher-ed-cutoffs.json");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(out));
  console.log(`Wrote ${courses.length} courses to ${dest}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
