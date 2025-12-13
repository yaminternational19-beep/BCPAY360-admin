/* =========================================
   REALISTIC EMPLOYEE DUMMY DATA GENERATOR
   ========================================= */

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
   Department → Role Mapping (IMPORTANT)
----------------------------------------- */
const departmentRoles = {
  HR: ["HR Manager", "HR Executive"],
  Finance: ["Accountant", "Finance Executive"],
  IT: ["Developer", "Team Lead"],
  Sales: ["Sales Executive", "Sales Manager"],
  Operations: ["Operations Executive"],
  Marketing: ["Marketing Executive"],
  Support: ["Support Engineer"]
};

const departments = Object.keys(departmentRoles);

/* -----------------------------------------
   Helpers
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
  const year = randInt(2017, 2024);
  const month = pad(randInt(1, 12), 2);
  const day = pad(randInt(1, 28), 2);
  return `${year}-${month}-${day}`;
}

function generateSalary(department, role) {
  const baseSalary = {
    HR: 30000,
    Finance: 35000,
    IT: 50000,
    Sales: 30000,
    Operations: 28000,
    Marketing: 32000,
    Support: 25000,
  };

  let multiplier = 1;

  if (role.includes("Manager") || role.includes("Lead")) multiplier = 1.8;
  if (role.includes("Developer")) multiplier = 2.2;

  return Math.round(
    baseSalary[department] * multiplier + randInt(0, 15000)
  );
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
    const role = pick(departmentRoles[department]);

    employees.push({
      id: `EMP${pad(i)}`,               // ✅ EMP001, EMP002
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      phone: randomPhone(),
      department,
      role,
      joiningDate: randomJoiningDate(),
      salary: generateSalary(department, role), // number only
      pan: generatePAN(name),
      active: Math.random() > 0.05,     // ~95% active
    });
  }

  return employees;
}
