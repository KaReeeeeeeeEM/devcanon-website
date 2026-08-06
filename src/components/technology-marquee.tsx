import { SiGithub, SiNextdotjs, SiNpm, SiReact, SiShadcnui, SiTailwindcss, SiTauri, SiVercel } from "@icons-pack/react-simple-icons";

const technologies = [
  { name: "Next.js", href: "https://nextjs.org", icon: SiNextdotjs },
  { name: "React", href: "https://react.dev", icon: SiReact },
  { name: "Vercel", href: "https://vercel.com", icon: SiVercel },
  { name: "Tailwind CSS", href: "https://tailwindcss.com", icon: SiTailwindcss },
  { name: "shadcn/ui", href: "https://ui.shadcn.com", icon: SiShadcnui },
  { name: "Tauri", href: "https://tauri.app", icon: SiTauri },
  { name: "npm", href: "https://npmjs.com", icon: SiNpm },
  { name: "GitHub", href: "https://github.com", icon: SiGithub },
];

export function TechnologyMarquee() {
  const items = [...technologies, ...technologies];
  return <section className="technology-strip" aria-labelledby="technology-heading">
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <p id="technology-heading" className="technology-label">Built with tools from</p>
    </div>
    <div className="technology-viewport">
      <div className="technology-track">
        {items.map(({ name, href, icon: Icon }, index) => <a href={href} target="_blank" rel="noreferrer" className="technology-logo" key={`${name}-${index}`} aria-hidden={index >= technologies.length} tabIndex={index >= technologies.length ? -1 : undefined}>
          <Icon title={name} /><span>{name}</span>
        </a>)}
      </div>
    </div>
  </section>;
}
