"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function CopyCommand({ command, prominent = false }: { command: string; prominent?: boolean }) { const [copied, setCopied] = useState(false); async function copy() { await navigator.clipboard.writeText(command); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } return <Button type="button" variant="ghost" onClick={copy} className={prominent ? "command-button" : "copy-command"} aria-label={`Copy command: ${command}`}><span className="text-cyan-400">$</span><code>{command}</code>{copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4 text-slate-500" />}</Button>; }
