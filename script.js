const API_URL='https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec';
const btn=document.getElementById('launchBtn');
const menu=document.getElementById('menu');
btn.onclick=()=>menu.classList.toggle('open');
window.onclick=e=>{if(!document.getElementById('launcher').contains(e.target))menu.classList.remove('open');}
async function load(){
 if(API_URL.startsWith('PASTE_')) return;
 const data=await fetch(API_URL).then(r=>r.json());
 const groups={};
 data.forEach(x=>{(groups[x.category]??=[]).push(x);});
 Object.keys(groups).sort().forEach(cat=>{
   const c=document.createElement('div');c.className='category';c.textContent=cat+' ▶';
   const s=document.createElement('div');s.className='submenu';
   groups[cat].sort((a,b)=>a.label.localeCompare(b.label)).forEach(i=>{
      const a=document.createElement('a');a.href=i.url;a.target='_blank';a.textContent=i.label;s.appendChild(a);
   });
   c.appendChild(s);menu.appendChild(c);
 });
}
load();
