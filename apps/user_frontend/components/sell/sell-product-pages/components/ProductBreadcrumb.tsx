import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

export function ProductBreadcrumb({ items }: Props) {
  return (
    <nav className="text-xs text-gray-500 mb-4">
      {items.map((item, index) => (
        <span key={item.label}>
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
          {index !== items.length - 1 && <span className="mx-1.5">&gt;</span>}
        </span>
      ))}
    </nav>
  );
}
