/* =========================================
   FINAL ENTERPRISE EMPLOYEE DATA GENERATOR
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
   DEPARTMENTS (EXACTLY 6)
----------------------------------------- */
const departments = [
  "HR",
  "IT",
  "Finance",
  "Sales",
  "Marketing",
  "Operations"
];

/* -----------------------------------------
   DESIGNATIONS (EXACTLY 5 EACH)
----------------------------------------- */
const departmentRoles = {
  HR: [
    "HR General",
    "HR IT",
    "HR Finance",
    "HR Sales",
    "HR Operations"
  ],

  IT: [
    "Junior Developer",
    "Developer",
    "Senior Developer",
    "Tech Lead",
    "Engineering Manager"
  ],

  Finance: [
    "Finance Executive",
    "Accountant",
    "Senior Accountant",
    "Finance Manager",
    "Finance Controller"
  ],

  Sales: [
    "Sales Executive",
    "Senior Sales Executive",
    "Sales Manager",
    "Regional Sales Manager",
    "Sales Head"
  ],

  Marketing: [
    "Marketing Executive",
    "Content Strategist",
    "Digital Marketing Specialist",
    "Marketing Manager",
    "Marketing Head"
  ],

  Operations: [
    "Operations Executive",
    "Senior Operations Executive",
    "Operations Manager",
    "Operations Lead",
    "Operations Head"
  ]
};

/* -----------------------------------------
   HELPERS
----------------------------------------- */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pad(num, size = 3) {
  return String(num).padStart(size, "0");
}

function randomPhone() {
  const prefixes = ["98", "99", "97", "96", "95"];
  return (
    pick(prefixes) +
    Array.from({ length: 8 }, () => randInt(0, 9)).join("")
  );
}

function generatePAN(name) {
  const letters = name
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, "X");

  const randomLetters = Array.from(
    { length: 2 },
    () => String.fromCharCode(65 + randInt(0, 25))
  ).join("");

  const digits = Array.from({ length: 4 }, () => randInt(0, 9)).join("");
  const last = String.fromCharCode(65 + randInt(0, 25));

  return `${letters}${randomLetters}${digits}${last}`;
}

function randomJoiningDate() {
  const year = randInt(2016, 2024);
  const month = pad(randInt(1, 12), 2);
  const day = pad(randInt(1, 28), 2);
  return `${year}-${month}-${day}`;
}

/* -----------------------------------------
   SALARY (DESIGNATION-BASED)
----------------------------------------- */
function generateSalary(department, role) {
  const base = {
    HR: 35000,
    IT: 55000,
    Finance: 45000,
    Sales: 40000,
    Marketing: 38000,
    Operations: 36000
  };

  let multiplier = 1;

  if (/Junior|Executive/.test(role)) multiplier = 1.0;
  if (/Senior/.test(role)) multiplier = 1.4;
  if (/Lead|Manager/.test(role)) multiplier = 1.8;
  if (/Head|Controller/.test(role)) multiplier = 2.3;

  return Math.round(
    base[department] * multiplier + randInt(0, 15000)
  );
}

/* -----------------------------------------
   ROLE DISTRIBUTION (GUARANTEED DIVERSITY)
----------------------------------------- */
function pickRole(department) {
  const roles = departmentRoles[department];
  const r = Math.random();

  if (r < 0.30) return roles[0]; // Junior / Exec
  if (r < 0.55) return roles[1];
  if (r < 0.75) return roles[2];
  if (r < 0.92) return roles[3];
  return roles[4];               // Head (rare)
}

/* =========================================
   MAIN EXPORT
========================================= */
export function makeEmployees(count = 1000) {
  const employees = [];

  for (let i = 1; i <= count; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const name = `${firstName} ${lastName}`;

    const department = pick(departments);
    const role = pickRole(department);

    employees.push({
      id: `EMP${pad(i)}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      phone: randomPhone(),
      department,
      role,
      joiningDate: randomJoiningDate(),
      salary: generateSalary(department, role),
      pan: generatePAN(name),
      active: Math.random() > 0.05
    });
  }

  return employees;
}
