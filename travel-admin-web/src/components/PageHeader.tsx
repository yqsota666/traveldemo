interface PageHeaderProps {
  title: string;
  extra?: React.ReactNode;
}

export default function PageHeader({ title, extra }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="page-header-title">{title}</h1>
      {extra ? <div className="page-header-extra">{extra}</div> : null}
    </div>
  );
}
