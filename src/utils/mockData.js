// generates realistic dummy employees (1000 by default)
const firstNames = ["Aarav","Vivaan","Aditya","Arjun","Vihaan","Ishaan","Saanvi","Ananya","Priya","Kavya","Rohan","Neha","Ritika","Karan","Sneha"];
const lastNames = ["Reddy","Sharma","Patel","Singh","Kumar","Iyer","Nair","Mehta","Gupta","Joshi","Kaur","Verma","Chopra","Desai","Bhat"];
const departments = ["HR","Finance","IT","Sales","Operations","Marketing","Support"];
const roles = ["Admin","HR Manager","Employee","Team Lead","Accountant","Developer","Support"];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function pad(n){ return n < 10 ? `0${n}` : `${n}` }

function randomPhone(){
  // Indian-like mobile numbers
  const prefixes = ["98","99","97","96","95","94"];
  return pick(prefixes) + Array.from({length:8}, ()=> Math.floor(Math.random()*10)).join('');
}

function randomDate(startYear=2015, endYear=2025){
  const y = randInt(startYear, endYear);
  const m = randInt(1,12);
  const d = randInt(1, m===2 ? 28 : 30);
  return `${y}-${pad(m)}-${pad(d)}`;
}

function generatePAN(name){
  // simplified fake PAN pattern: 5 letters + 4 digits + 1 letter
  const letters = name.replace(/[^A-Za-z]/g,'').toUpperCase().slice(0,3).padEnd(3,'X');
  const randomLetters = Array.from({length:2}, ()=> String.fromCharCode(65+randInt(0,25))).join('');
  const digits = Array.from({length:4}, ()=> randInt(0,9)).join('');
  const last = String.fromCharCode(65+randInt(0,25));
  return `${letters}${randomLetters}${digits}${last}`;
}

export function makeEmployees(count = 1000){
  const list = [];
  for(let i=1;i<=count;i++){
    const fn = pick(firstNames);
    const ln = pick(lastNames);
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
    const phone = randomPhone();
    const dept = pick(departments);
    const role = pick(roles);
    const joiningDate = randomDate(2016, 2024);
    const salary = (randInt(2,25) * 10000); // between 20k and 2.5L
    const pan = generatePAN(name);
    list.push({
      id: i,
      name,
      email,
      phone,
      department: dept,
      role,
      joiningDate,
      salary,
      pan,
      active: true,
      docs: { aadhaar: null, pan: null, resume: null }
    });
  }
  return list;
}
