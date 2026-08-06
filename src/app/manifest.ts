import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest{return{name:"Devcanon Studio",short_name:"Devcanon",description:"Create and manage AI engineering standards.",start_url:"/studio",display:"standalone",background_color:"#07101b",theme_color:"#07101b",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}]};}
