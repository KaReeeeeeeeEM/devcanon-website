import {
  SiGithub,
  SiNextdotjs,
  SiNpm,
  SiReact,
  SiShadcnui,
  SiTailwindcss,
  SiTauri,
  SiVercel,
} from "@icons-pack/react-simple-icons";
import { Reveal } from "@/components/reveal";

function DevcanonIcon({ title }: { title?: string }) { return <svg viewBox="0 0 24 24" role="img" aria-label={title}><path fill="currentColor" d="M3 4h6.2C14.7 4 18 7 18 12s-3.3 8-8.8 8H3V4Zm4 4v8h2.1c3.1 0 4.9-1.4 4.9-4s-1.8-4-4.9-4H7Z"/><path fill="currentColor" d="m18.2 8 3.8 4-3.8 4-1.5-1.4 2.4-2.6-2.4-2.6L18.2 8Z"/></svg>; }

const technologies = [
  { name: "Devcanon", href: "https://github.com/KaReeeeeeeeEM/devcanon", icon: DevcanonIcon },
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
  return <Reveal><section className="technology-strip" aria-labelledby="technology-heading">
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
  </section></Reveal>;
}
