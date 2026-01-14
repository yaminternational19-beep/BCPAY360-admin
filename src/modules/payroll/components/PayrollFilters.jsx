import "./payroll.css";

const EmployeePreviewTable = ({ employees = [] }) => {
  return (
    <table className="employee-preview">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Paid Days</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e, i) => (
          <tr key={i}>
            <td>{e.code || "EMP001"}</td>
            <td>{e.name || "John Doe"}</td>
            <td>{e.paidDays || 26}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeePreviewTable;
 