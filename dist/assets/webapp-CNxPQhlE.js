import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */import{aO as l,aT as g,aS as k,aM as u,aL as f,aN as p,aV as w,aY as E,aP as y}from"./firebase-CCtn4aoY.js";const m=16,i=e=>document.getElementById(e).classList.remove("d-none"),d=e=>document.getElementById(e).classList.add("d-none"),v=e=>{for(let o=e.length-1;o>0;o--){const t=Math.floor(Math.random()*(o+1));[e[o],e[t]]=[e[t],e[o]]}return e},x=()=>{const e=document.createElement("div");return e.className="col-6 col-md-4 col-lg-3 mb-3",e.innerHTML=`
        <div class="card h-100">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-muted">Empty Slot</h5>
                <p class="card-text flex-grow-1 text-muted">No item available</p>
            </div>
        </div>
    `,e},a=(e,o="success")=>{const t=document.createElement("div");t.className=`alert alert-${o} alert-dismissible fade show fixed-top mx-auto mt-3`,t.style.maxWidth="300px",t.style.zIndex="1050",t.innerHTML=`
        ${e}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `,document.body.appendChild(t),setTimeout(()=>t.remove(),3e3)},I=async(e,o)=>{const t=l.currentUser;if(!t){a("Please log in to bookmark items.","warning"),setTimeout(()=>window.location.assign("/dashboard.html"),1500);return}try{const r=f(u,"users",t.uid),c=await p(r);c.exists()?(c.data().bookmarks||[]).includes(e)?a(`"${o}" is already bookmarked.`,"info"):(await w(r,{bookmarks:E(e)}),a(`"${o}" added to bookmarks!`)):(await y(r,{bookmarks:[e]}),a(`"${o}" added to bookmarks!`))}catch(r){console.error("Error bookmarking item:",r),a("Error adding bookmark.","danger")}},h=async()=>{try{const e=document.getElementById("items-container");e.innerHTML="";const t=(await g(k(u,"items"))).docs.map(s=>({id:s.id,...s.data()}));if(t.length===0){d("items-container"),i("no-items");return}const c=v([...t]).slice(0,m);for(;c.length<m;)c.push(null);c.forEach(s=>{const n=document.createElement("div");n.className="col-6 col-md-4 col-lg-3 mb-3",s?(n.innerHTML=`
                    <div class="card h-100 clickable-card" data-item-id="${s.id}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${s.name||"Unnamed Item"}</h5>
                            <p class="card-text"><strong>Post User:</strong> ${s.userName||"None"}</p>
                            <p class="card-text flex-grow-1">${s.description||"No description"}</p>
                            <button class="btn btn-sm btn-outline-warning bookmark-btn mt-auto">Bookmark</button>
                        </div>
                    </div>
                `,n.querySelector(".clickable-card").addEventListener("click",b=>{if(!b.target.classList.contains("bookmark-btn")){if(!l.currentUser){a("Please log in to read more.","warning"),setTimeout(()=>window.location.assign("/dashboard.html"),1500);return}window.location.href=`/readmore.html?itemId=${s.id}`}}),n.querySelector(".bookmark-btn").addEventListener("click",()=>I(s.id,s.name))):n.appendChild(x().firstElementChild),e.appendChild(n)}),i("items-container"),d("no-items")}catch(e){console.error("Error fetching random items:",e),document.getElementById("items-container").innerHTML=`
            <div class="col-12 text-danger text-center">Error loading items: ${e.message}</div>
        `}},L=()=>{l.onAuthStateChanged(e=>{e?(d("loading"),i("content"),h()):(a("Please log in to access this page.","warning"),setTimeout(()=>window.location.assign("/dashboard.html"),1500))})},$=()=>{document.getElementById("back-to-dashboard").addEventListener("click",()=>{window.location.assign("/dashboard.html")}),document.getElementById("new-random-items").addEventListener("click",h)},T=()=>{L(),$()};T();
