import CompanyCard from "../components/CompanyCard";
import "../styles/CompanyCards.css";

export default function CompanyCards({ companies }) {
  if (!companies.length) {
    return (
      <div className="company-empty">
        <h3>No companies yet</h3>
        <p>Create a company to get started</p>
      </div>
    );
  }

  return (
    <div className="company-grid">
      {companies.map(c => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}
