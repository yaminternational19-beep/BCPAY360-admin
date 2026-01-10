import { useEffect, useState } from "react";

const buildRange = (fromYear, fromMonth, toYear, toMonth) => {
  const fromDate = `${fromYear}-${String(fromMonth).padStart(2, "0")}-01`;
  const lastDay = new Date(toYear, toMonth, 0).getDate();
  const toDate = `${toYear}-${String(toMonth).padStart(2, "0")}-${lastDay}`;
  return { fromDate, toDate };
};

export default function MonthlyAttendanceForm({ value, onChange }) {
  const now = new Date();

  const [fromYear, setFromYear] = useState(now.getFullYear());
  const [fromMonth, setFromMonth] = useState(now.getMonth() + 1);
  const [toYear, setToYear] = useState(now.getFullYear());
  const [toMonth, setToMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    const range = buildRange(fromYear, fromMonth, toYear, toMonth);
    onChange({
      fromYear,
      fromMonth,
      toYear,
      toMonth,
      ...range
    });
  }, [fromYear, fromMonth, toYear, toMonth]);

  const years = [];
  for (let y = now.getFullYear() - 3; y <= now.getFullYear() + 1; y++) {
    years.push(y);
  }
  const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];


  return (
    <div className="monthly-range-form">
      <span>From</span>

      <select value={fromMonth} onChange={e => setFromMonth(+e.target.value)}>
  {MONTHS.map((m, i) => (
    <option key={m} value={i + 1}>
      {m}
    </option>
  ))}
</select>


      <select value={fromYear} onChange={e => setFromYear(+e.target.value)}>
        {years.map(y => <option key={y}>{y}</option>)}
      </select>

      <span>To</span>

      <select value={toMonth} onChange={e => setToMonth(+e.target.value)}>
        {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
            {m}
            </option>
        ))}
        </select>


      <select value={toYear} onChange={e => setToYear(+e.target.value)}>
        {years.map(y => <option key={y}>{y}</option>)}
      </select>
    </div>
  );
}
