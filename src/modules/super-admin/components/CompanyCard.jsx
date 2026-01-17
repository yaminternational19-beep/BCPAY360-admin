import { useNavigate } from "react-router-dom";
import "../styles/CompanyCard.css";

export default function CompanyCard({ company }) {
  const navigate = useNavigate();

  return (
    <div className="company-card">
      <h3>{company.name}</h3>
      <p>{company.email}</p>

      <span className={company.is_active ? "active" : "inactive"}>
        {company.is_active ? "Active" : "Inactive"}
      </span>

      <button onClick={() => navigate(`/super-admin/company/${company.id}`)}>
        View Details
      </button>
    </div>
  );
}
