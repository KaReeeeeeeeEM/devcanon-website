import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest{return{id:"devcanon-v3",name:"Devcanon Studio",short_name:"Devcanon",description:"Create and manage AI engineering standards.",start_url:"/studio",display:"standalone",background_color:"#07101b",theme_color:"#07101b",icons:[{src:"/icon.svg?v=3",sizes:"any",type:"image/svg+xml",purpose:"any"}]};}
