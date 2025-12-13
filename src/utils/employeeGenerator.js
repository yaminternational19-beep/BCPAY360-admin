const firstNames = ["Aarav","Vivaan","Aditya","Arjun","Vihaan","Ishaan","Saanvi","Ananya","Priya","Kavya","Rohan","Neha","Ritika","Karan","Sneha"];
const lastNames = ["Reddy","Sharma","Patel","Singh","Kumar","Iyer","Nair","Mehta","Gupta","Joshi","Kaur","Verma","Chopra","Desai","Bhat"];
const departments = ["HR","Finance","IT","Sales","Operations","Marketing","Support"];
const roles = ["Admin","HR Manager","Employee","Team Lead","Accountant","Developer","Support"];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function pad(n){ return n < 10 ? `0${n}` : `${n}`; }

function randomPhone(){
  const prefixes = ["98","99","97","96","95","94"];
  return pick(prefixes) + Array.from({length:8}, ()=> Math.floor(Math.random()*10)).join('');
}

function generatePAN(name){
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
    list.push({
      id: i,
      name,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      phone: randomPhone(),
      department: pick(departments),
      role: pick(roles),
      joiningDate: `${randInt(2016,2024)}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`,
      salary: randInt(2,25) * 10000,
      pan: generatePAN(name),
      active: true,
    });
  }
  return list;
}
