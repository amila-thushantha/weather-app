export default function ScoreBar({ value }) {
  return (
    <div className="score">
      <div className="bar" aria-label={`Comfort score ${value}`}>
        <div className="fill" style={{ width: `${value}%` }} />
      </div>
      <span className="scoreNum">{value}</span>
    </div>
  );
}
