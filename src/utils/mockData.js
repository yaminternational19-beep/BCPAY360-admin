/* =========================================
   ENTERPRISE EMPLOYEE MASTER GENERATOR
   SINGLE SOURCE OF TRUTH
========================================= */

/* -----------------------------------------
   NAMES
----------------------------------------- */
const firstNames = [
  "Aarav","Vivaan","Aditya","Arjun","Vihaan","Ishaan",
  "Saanvi","Ananya","Priya","Kavya","Rohan","Neha",
  "Ritika","Karan","Sneha"
];

const lastNames = [
  "Reddy","Sharma","Patel","Singh","Kumar","Iyer",
  "Nair","Mehta","Gupta","Joshi","Kaur","Verma",
  "Chopra","Desai","Bhat"
];

/* -----------------------------------------
   DEPARTMENTS & ROLES
----------------------------------------- */
const departments = ["HR","IT","Finance","Sales","Marketing","Operations"];

const departmentRoles = {
  HR: ["HR General","HR IT","HR Finance","HR Sales","HR Operations"],
  IT: ["Junior Developer","Developer","Senior Developer","Tech Lead","Engineering Manager"],
  Finance: ["Finance Executive","Accountant","Senior Accountant","Finance Manager","Finance Controller"],
  Sales: ["Sales Executive","Senior Sales Executive","Sales Manager","Regional Sales Manager","Sales Head"],
  Marketing: ["Marketing Executive","Content Strategist","Digital Marketing Specialist","Marketing Manager","Marketing Head"],
  Operations: ["Operations Executive","Senior Operations Executive","Operations Manager","Operations Lead","Operations Head"]
};

/* -----------------------------------------
   HELPERS
----------------------------------------- */
const rand = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const pad = n => String(n).padStart(3,"0");

/* Alphabet avatar (no static images) */
const avatar = name =>
  `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(name)}&backgroundColor=2563eb&textColor=ffffff`;

const phone = () =>
  pick(["98","99","97","96","95"]) +
  Array.from({length:8},()=>rand(0,9)).join("");

const pan = name =>
  name.replace(/[^A-Za-z]/g,"")
      .toUpperCase()
      .slice(0,3)
      .padEnd(3,"X") +
  String.fromCharCode(65+rand(0,25)) +
  String.fromCharCode(65+rand(0,25)) +
  rand(1000,9999) +
  String.fromCharCode(65+rand(0,25));

const aadhaar = () =>
  `${rand(1000,9999)} ${rand(1000,9999)} ${rand(1000,9999)}`;

const date = (y1,y2)=>
  `${rand(y1,y2)}-${String(rand(1,12)).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`;

const salary = (d,r)=>{
  const base={
    HR:35000, IT:55000, Finance:45000,
    Sales:40000, Marketing:38000, Operations:36000
  };
  let m=1;
  if(/Senior/.test(r)) m=1.4;
  if(/Lead|Manager/.test(r)) m=1.8;
  if(/Head|Controller/.test(r)) m=2.3;
  return Math.round(base[d]*m + rand(0,15000));
};

const report = (title, freq="On Demand") => ({
  title,
  format: "PDF",
  frequency: freq,
  status: "Available"
});

/* =========================================
   MAIN EXPORT
========================================= */
export function makeEmployees(count=1000) {
  const list = [];

  for(let i=1;i<=count;i++){
    const f = pick(firstNames);
    const l = pick(lastNames);
    const name = `${f} ${l}`;
    const dept = pick(departments);
    const role = pick(departmentRoles[dept]);
    const gender = Math.random() > 0.5 ? "Male" : "Female";

    list.push({
      id: `EMP${pad(i)}`,
      name,
      avatar: avatar(name),        // ✅ Alphabet avatar
      email: `${f.toLowerCase()}.${l.toLowerCase()}${i}@company.com`,
      phone: phone(),
      pan: pan(name),
      aadhaar: aadhaar(),
      department: dept,
      role,
      joiningDate: date(2016,2024),
      salary: salary(dept,role),
      active: Math.random() > 0.05,

      biodata: {
        gender,
        dob: date(1978,2001),
        bloodGroup: pick(["A+","B+","O+","AB+"]),
        maritalStatus: pick(["Single","Married"]),
        address: "Hyderabad, Telangana",
        qualification: pick(["B.Tech","MBA","MCA","B.Com"])
      },

      reports: {
        personnel: [
          report("Bio Data"),
          report("Application Form"),
          report("Appointment Letter (English)"),
          report("Appointment Letter (Hindi)"),
          report("Confirmation Letter"),
          report("Form 16")
        ],
        attendance: [
          report("Attendance Register","Monthly"),
          report("Late Coming Report"),
          report("Absent Report"),
          report("Over Time Report"),
          report("Muster Roll Form 12/26")
        ],
        leave: [
          report("Leave Balance"),
          report("Form 14"),
          report("Form B")
        ],
        salary: [
          report("Salary Register","Monthly"),
          report("Salary Summary"),
          report("OT Sheet"),
          report("F & F Summary")
        ],
        pf: [
          report("PF Statement"),
          report("Form 3A"),
          report("Form 6A"),
          report("Form 19 & 10C")
        ],
        esi: [
          report("ESI Monthly Statement"),
          report("Form 5")
        ],
        factoryAct: [
          report("Form 21"),
          report("Form 22")
        ]
      }
    });
  }

  return list;
}
