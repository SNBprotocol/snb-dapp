interface Props {
  title: string;
  value: string | number;
  sub?: string;
}

export default function StatCard({ title, value, sub }: Props) {
  return (
    <div className="card">
      <div className="label">{title}</div>
      <div className="value">{value}</div>
      {sub && <div className="label">{sub}</div>}
    </div>
  );
}



