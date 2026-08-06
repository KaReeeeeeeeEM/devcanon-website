import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Download, HardDriveDownload } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desktopPlatformKeys, desktopPlatforms, type DesktopPlatform } from "@/lib/desktop-platforms";

type ReleaseAsset={id:number;name:string;browser_download_url:string;size:number;download_count:number};
type Release={id:number;tag_name:string;name:string|null;published_at:string;html_url:string;body:string|null;assets:ReleaseAsset[]};

export const revalidate=3600;
export function generateStaticParams(){return desktopPlatformKeys.map(platform=>({platform}))}
export async function generateMetadata({params}:{params:Promise<{platform:string}>}):Promise<Metadata>{const{platform}=await params;if(!(platform in desktopPlatforms))return{};const item=desktopPlatforms[platform as DesktopPlatform];return{title:`Devcanon Studio for ${item.name}`,description:`Download Devcanon Studio installers and previous releases for ${item.name}.`}}
function size(bytes:number){if(bytes<1024*1024)return`${Math.ceil(bytes/1024)} KB`;return`${(bytes/1024/1024).toFixed(1)} MB`}
async function releasesFor(platform:DesktopPlatform){try{const response=await fetch("https://api.github.com/repos/KaReeeeeeeeEM/devcanon-website/releases?per_page=30",{headers:{Accept:"application/vnd.github+json"},next:{revalidate:3600}});if(!response.ok)return[];const releases=await response.json() as Release[];return releases.map(release=>({...release,assets:release.assets.filter(asset=>desktopPlatforms[platform].pattern.test(asset.name))})).filter(release=>release.assets.length)}catch{return[]}}

export default async function PlatformDownloads({params}:{params:Promise<{platform:string}>}){const value=(await params).platform;if(!(value in desktopPlatforms))notFound();const platform=value as DesktopPlatform,item=desktopPlatforms[platform],Icon=item.icon,releases=await releasesFor(platform);return <main className="platform-download-page">
  <section className="platform-download-hero"><Link className="back-link" href="/download"><ArrowLeft/> All download options</Link><div className="platform-title-icon"><Icon/></div><p className="section-kicker">Devcanon Studio</p><h1>Download for {item.name}</h1><p>{item.description} Choose the newest installer or return to an earlier release whenever your environment requires it.</p><div className="format-list">{item.formats.map(format=><span key={format}>{format}</span>)}</div></section>
  <section className="release-browser"><div className="release-browser-heading"><div><p className="section-kicker">Release archive</p><h2>Available {item.name} builds</h2></div><a href="https://github.com/KaReeeeeeeeEM/devcanon-website/releases" target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight/></a></div>
    {releases.length?<div className="release-list">{releases.map((release,index)=><article className="desktop-release" key={release.id}><div className="release-version"><span>{index===0?"Latest":"Release"}</span><h3>{release.name||release.tag_name}</h3><time dateTime={release.published_at}>{new Intl.DateTimeFormat("en",{dateStyle:"medium"}).format(new Date(release.published_at))}</time></div><div className="release-assets">{release.assets.map(asset=><a href={asset.browser_download_url} key={asset.id}><span className="asset-icon"><HardDriveDownload/></span><span className="asset-name"><strong>{asset.name}</strong><small>{size(asset.size)} · {asset.download_count.toLocaleString()} downloads</small></span><Download/></a>)}</div></article>)}</div>:<div className="empty-releases"><HardDriveDownload/><h3>The first {item.name} build is being prepared.</h3><p>Published installers will appear here automatically from GitHub Releases.</p><a className="button-primary" href="https://github.com/KaReeeeeeeeEM/devcanon-website/releases" target="_blank" rel="noreferrer">Watch GitHub Releases <ArrowUpRight/></a></div>}
  </section>
</main>}
