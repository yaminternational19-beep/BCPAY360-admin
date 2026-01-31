import "../../../styles/Attendance.css";

const statusClassMap = {
  P: "status-present",
  A: "status-absent",
  U: "status-unmarked",
  H: "status-holiday",
  "-": "status-unmarked"
};

const statusLabelMap = {
  P: "Present",
  A: "Absent",
  U: "Unmarked",
  H: "Holiday",
  "-": "N/A"
};

const MonthlyAttendanceTable = ({
  data = [],
  loading,
  selectedIds = [],
  onSelectOne,
  onSelectAll
}) => {
  if (loading) {
    return <div className="attendance-table">Loading...</div>;
  }

  if (!data.length) {
    return <div className="attendance-table">No data available</div>;
  }

  const days = Object.keys(data[0].days || {});
  const isAllSelected = data.length > 0 && data.every(emp => selectedIds.includes(emp.employee_id));

  return (
    <div className="attendance-table monthly">
      <table>
        <thead>
          <tr>
            {onSelectAll && (
              <th className="checkbox-cell" style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked ? data.map(d => d.employee_id) : [])}
                />
              </th>
            )}
            <th>#</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Shift</th>

            {/* DAY HEADERS */}
            {days.map(day => {
              const paddedDay = String(day).padStart(2, "0");
              const fullDate = data[0].dates?.[day]; // optional future-proof

              return (
                <th
                  key={day}
                  className="day-col"
                  title={fullDate || `Day ${paddedDay}`}
                >
                  {paddedDay}
                </th>
              );
            })}

            {/* TOTAL HEADERS */}
            <th title="Total Present Days">Present</th>
            <th title="Total Absent Days">Absent</th>
            <th title="Total Unmarked Days">Unmarked</th>
            <th title="Total Holidays">Holidays</th>
          </tr>
        </thead>

        <tbody>
          {data.map((emp, index) => {
            const isSelected = selectedIds.includes(emp.employee_id);
            return (
              <tr key={emp.employee_id || index} className={isSelected ? 'row-selected' : ''}>
                {onSelectOne && (
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectOne(emp.employee_id)}
                    />
                  </td>
                )}
                <td>{index + 1}</td>

                <td>
                  <div className="emp-name">{emp.name}</div>
                  <div className="emp-code">{emp.employee_code}</div>
                </td>

                <td>{emp.department}</td>
                <td>{emp.shift}</td>

                {/* DAY CELLS */}
                {days.map(day => {
                  const value = emp.days[day];
                  return (
                    <td
                      key={day}
                      className={`day-cell ${statusClassMap[value] || ""}`}
                      title={statusLabelMap[value] || "Unknown"}
                    >
                      {value}
                    </td>
                  );
                })}

                {/* TOTALS */}
                <td className="total-present" title="Total Present Days">
                  {emp.totals.present}
                </td>
                <td className="total-absent" title="Total Absent Days">
                  {emp.totals.absent}
                </td>
                <td className="total-unmarked" title="Total Unmarked Days">
                  {emp.totals.unmarked}
                </td>
                <td className="total-holiday" title="Total Holidays">
                  {emp.totals.holiday}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyAttendanceTable;
