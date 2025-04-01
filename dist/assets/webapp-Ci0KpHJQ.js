import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */import{aR as l,aT as k,aM as g,aP as u,aO as f,aU as p,aV as w,aY as E,aN as y}from"./firebase-DoOtmkWH.js";const m=16,c=e=>document.getElementById(e).classList.remove("d-none"),d=e=>document.getElementById(e).classList.add("d-none"),v=e=>{for(let o=e.length-1;o>0;o--){const t=Math.floor(Math.random()*(o+1));[e[o],e[t]]=[e[t],e[o]]}return e},x=()=>{const e=document.createElement("div");return e.className="col-6 col-md-4 col-lg-3 mb-3",e.innerHTML=`
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-muted">Empty Slot</h5>
        <p class="card-text flex-grow-1 text-muted">No item available</p>
      </div>
    </div>
  `,e},a=(e,o="success")=>{const t=document.createElement("div");t.className=`alert alert-${o} alert-dismissible fade show fixed-top mx-auto mt-3`,t.style.maxWidth="300px",t.style.zIndex="1050",t.innerHTML=`
    ${e}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `,document.body.appendChild(t),setTimeout(()=>t.remove(),3e3)},I=async(e,o)=>{const t=l.currentUser;if(!t){a("Please log in to bookmark items.","warning"),setTimeout(()=>window.location.assign("/dashboard.html"),1500);return}try{const r=f(u,"users",t.uid),i=await p(r);i.exists()?(i.data().bookmarks||[]).includes(e)?a(`"${o}" is already bookmarked.`,"info"):(await w(r,{bookmarks:E(e)}),a(`"${o}" added to bookmarks!`)):(await y(r,{bookmarks:[e]}),a(`"${o}" added to bookmarks!`))}catch(r){console.error("Error bookmarking item:",r),a("Error adding bookmark.","danger")}},h=async()=>{try{const e=document.getElementById("items-container");e.innerHTML="";const t=(await k(g(u,"items"))).docs.map(n=>({id:n.id,...n.data()}));if(t.length===0){d("items-container"),c("no-items");return}const i=v([...t]).slice(0,m);for(;i.length<m;)i.push(null);i.forEach(n=>{const s=document.createElement("div");s.className="col-6 col-md-4 col-lg-3 mb-3",n?(s.innerHTML=`
          <div class="card h-100 clickable-card" data-item-id="${n.id}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${n.name||"Unnamed Item"}</h5>
              <p class="card-text flex-grow-1">${n.description||"No description"}</p>
              <button class="btn btn-sm btn-outline-warning bookmark-btn mt-auto">Bookmark</button>
            </div>
          </div>
        `,s.querySelector(".clickable-card").addEventListener("click",b=>{if(!b.target.classList.contains("bookmark-btn")){if(!l.currentUser){a("Please log in to read more.","warning"),setTimeout(()=>window.location.assign("/dashboard.html"),1500);return}window.location.href=`/readmore.html?itemId=${n.id}`}}),s.querySelector(".bookmark-btn").addEventListener("click",()=>I(n.id,n.name))):s.appendChild(x().firstElementChild),e.appendChild(s)}),c("items-container"),d("no-items")}catch(e){console.error("Error fetching random items:",e),document.getElementById("items-container").innerHTML=`
      <div class="col-12 text-danger text-center">Error loading items: ${e.message}</div>
    `}},L=()=>{l.onAuthStateChanged(e=>{e?(d("loading"),c("content"),h()):(a("Please log in to access this page.","warning"),setTimeout(()=>window.location.assign("/dashboard.html"),1500))})},T=()=>{document.getElementById("back-to-dashboard").addEventListener("click",()=>{window.location.assign("/dashboard.html")}),document.getElementById("new-random-items").addEventListener("click",h)},$=()=>{L(),T()};$();
