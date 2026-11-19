type VisualPlaceholderProps = {
  className?: string;
  label?: string;
  index?: string;
};

export function VisualPlaceholder({ className = "", label = "", index }: VisualPlaceholderProps) {
  return (
    <div className={`visual-placeholder ${className}`.trim()} aria-hidden="true">
      <span className="visual-grid" />
      {index ? <b>{index}</b> : null}
      {label ? <small>{label}</small> : null}
    </div>
  );
}

