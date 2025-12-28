import CompanyCard from "../components/CompanyCard";
import "../styles/CompanyCards.css";

export default function CompanyCards({ companies }) {
  if (!companies.length) {
    return <p>No companies found.</p>;
  }

  return (
    <div className="company-grid">
      {companies.map(c => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}

