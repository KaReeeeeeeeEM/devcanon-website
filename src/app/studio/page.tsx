"use client";

import { Check, Copy, Download, FileCode2, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const options={projectType:["web","api","mobile","library","fullstack"],strictness:["balanced","strict"],design:["product","editorial","marketing","minimal"],density:["comfortable","compact"],accent:["cyan","blue","violet","emerald","amber","rose"],testing:["standard","high"],security:["standard","high"],docs:["three-column","article","api-reference"]} as const;
type Preset=Record<keyof typeof options,string>;
const initial:Preset={projectType:"web",strictness:"balanced",design:"product",density:"comfortable",accent:"cyan",testing:"standard",security:"high",docs:"three-column"};
const labels:Record<keyof Preset,string>={projectType:"Project type",strictness:"Engineering rigor",design:"Visual direction",density:"Interface density",accent:"Accent color",testing:"Test coverage",security:"Security posture",docs:"Documentation layout"};
const descriptions:Record<keyof Preset,string>={projectType:"Sets the architecture and delivery emphasis.",strictness:"Controls how strongly conventions are enforced.",design:"Shapes hierarchy, composition, and surface style.",density:"Controls spacing and information concentration.",accent:"Defines the single semantic brand accent.",testing:"Sets minimum verification depth for changes.",security:"Raises threat-model and review expectations.",docs:"Selects the default technical reading experience."};
const accentColors:Record<string,string>={cyan:"#22d3ee",blue:"#60a5fa",violet:"#a78bfa",emerald:"#34d399",amber:"#fbbf24",rose:"#fb7185"};
function codeFor(preset:Preset){const bytes=new TextEncoder().encode(JSON.stringify(preset));let value="";bytes.forEach(byte=>value+=String.fromCharCode(byte));return `dc1_${btoa(value).replaceAll("+","-").replaceAll("/","_").replaceAll("=","")}`;}
function expectedOutcomes(preset:Preset){return [
  `${preset.projectType === "fullstack" ? "Frontend and backend" : preset.projectType} architecture guidance becomes the primary implementation context.`,
  `${preset.strictness === "strict" ? "Every exception requires explicit justification" : "Practical exceptions remain possible when documented"}.`,
  `Interfaces use a ${preset.design} direction, ${preset.density} density, and ${preset.accent} semantic accent.`,
  `${preset.testing === "high" ? "High-risk paths require integration and end-to-end coverage" : "Testing depth follows the risk of each change"}.`,
  `${preset.security === "high" ? "Threat modelling and secure defaults receive elevated review" : "Baseline secure engineering rules remain mandatory"}.`,
  `Documentation defaults to the ${preset.docs.replaceAll("-"," ")} layout.`,
];}

export default function StudioPage(){
  const[preset,setPreset]=useState(initial);const[copied,setCopied]=useState("");
  const code=useMemo(()=>codeFor(preset),[preset]);const command=`npx devcanon init --preset ${code}`;const outcomes=expectedOutcomes(preset);
  async function copy(value:string,label:string){await navigator.clipboard.writeText(value);setCopied(label);setTimeout(()=>setCopied(""),1500)}
  function download(){const blob=new Blob([JSON.stringify({version:1,code,preset},null,2)],{type:"application/json"});const anchor=document.createElement("a");anchor.href=URL.createObjectURL(blob);anchor.download="devcanon-preset.json";anchor.click();URL.revokeObjectURL(anchor.href)}
  return <main className="min-w-0 overflow-hidden">
    <section className="page-hero pb-10"><div className="eyebrow"><SlidersHorizontal className="size-3.5"/>Preset builder</div><h1 className="section-title mt-6 max-w-4xl">Design your engineering operating system.</h1><p className="section-copy mt-5 max-w-2xl">Make deliberate choices, preview exactly what they mean, and leave with one private installation code.</p></section>
    <section className="studio-shell">
      <div className="min-w-0"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">Configure your standards</h2><p className="mt-1 text-sm text-muted-foreground">Every choice updates the expectation preview instantly.</p></div><Button variant="outline" size="icon" onClick={()=>setPreset(initial)} aria-label="Reset preset"><RotateCcw/></Button></div>
        <div className="studio-options">{Object.entries(options).map(([key,values])=>{const typedKey=key as keyof Preset;return <Card className="gap-0 py-0" key={key}><CardHeader className="gap-1 px-4 pb-3 pt-4"><CardTitle className="text-sm">{labels[typedKey]}</CardTitle><p className="text-xs leading-5 text-muted-foreground">{descriptions[typedKey]}</p></CardHeader><CardContent className="px-4 pb-4"><Select value={preset[typedKey]} onValueChange={value=>setPreset(current=>({...current,[typedKey]:value}))}><SelectTrigger className="w-full"><SelectValue/></SelectTrigger><SelectContent>{values.map(value=><SelectItem key={value} value={value} className="capitalize">{value.replaceAll("-"," ")}</SelectItem>)}</SelectContent></Select></CardContent></Card>})}</div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[.06] p-4 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500"/><p>Security, accessibility, privacy, and data-integrity rules remain mandatory in every preset.</p></div>
      </div>
      <aside className="preset-panel" style={{"--preset-accent":accentColors[preset.accent]} as React.CSSProperties}>
        <div className="flex items-center justify-between gap-3"><div><p className="section-kicker">Your preset</p><h2 className="mt-2 text-2xl font-semibold">What to expect</h2></div><div className="preset-orb"><Sparkles/></div></div>
        <Tabs defaultValue="outcomes" className="mt-6"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="outcomes">Outcome</TabsTrigger><TabsTrigger value="choices">Choices</TabsTrigger><TabsTrigger value="install">Install</TabsTrigger></TabsList>
          <TabsContent value="outcomes" className="mt-5"><div className="space-y-3">{outcomes.map((outcome,index)=><div className="expectation-row" key={outcome}><span>{index+1}</span><p>{outcome}</p></div>)}</div></TabsContent>
          <TabsContent value="choices" className="mt-5"><div className="grid grid-cols-2 gap-2">{Object.entries(preset).map(([key,value])=><div className="preset-chip" key={key}><span>{labels[key as keyof Preset]}</span><strong>{value.replaceAll("-"," ")}</strong></div>)}</div></TabsContent>
          <TabsContent value="install" className="mt-5"><p className="output-label">Preset code</p><div className="output-code">{code}</div><Button variant="outline" className="mt-3 w-full" onClick={()=>copy(code,"code")}>{copied==="code"?<Check/>:<Copy/>}{copied==="code"?"Copied":"Copy preset code"}</Button><p className="output-label mt-6">Install command</p><div className="output-code command-output">$ {command}</div><Button className="mt-3 w-full" onClick={()=>copy(command,"command")}>{copied==="command"?<Check/>:<Copy/>}{copied==="command"?"Copied":"Copy install command"}</Button><Button variant="outline" className="mt-3 w-full" onClick={download}><Download/>Download JSON</Button></TabsContent>
        </Tabs>
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5"><FileCode2 className="size-5 text-[var(--preset-accent)]"/><p className="text-xs leading-5 text-muted-foreground">Devcanon will create a readable <code className="text-foreground">.ai/preset.md</code> and machine-readable <code className="text-foreground">.ai/preset.json</code>.</p></div>
      </aside>
    </section>
  </main>;
}
