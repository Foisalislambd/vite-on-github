type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
};

export function SectionHeader({ id, eyebrow, title, lead }: Props) {
  return (
    <header className="section-header" id={id}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </header>
  );
}
