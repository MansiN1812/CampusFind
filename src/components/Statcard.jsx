function StatCard({
  icon,
  title,
  value,
  description,
  className = ""
}) {
  return (
    <div className={`stat-card ${className}`}>

      <div className="stat-top">
        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-menu">•••</span>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-title">
        {title}
      </div>

      <div className="stat-description">
        {description}
      </div>

    </div>
  );
}

export default StatCard;