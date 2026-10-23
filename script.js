const ADMIN_PASSWORD = "B4k9Xp2T";
const defaultCategories = ["تکنولوژی", "علمی", "آموزشی"];
let categories = JSON.parse(localStorage.getItem("categories")) || [...defaultCategories];

const defaultArticles = [
  { id: 1, title: "آینده هوش مصنوعی در سال 2025", category: "تکنولوژی", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80&auto=format&fit=crop", excerpt: "هوش مصنوعی چگونه زندگی روزمره و کسب‌وکارها را متحول خواهد کرد؟", content: "هوش مصنوعی در سال‌های اخیر پیشرفت چشمگیری داشته است. از مدل‌های زبانی بزرگ تا بینایی ماشین و اتوماسیون هوشمند، سرعت تغییر خیره‌کننده است.\n\nدر این مقاله به سه محور کلیدی می‌پردازیم: اول بهره‌وری شخصی و سازمانی، دوم چالش‌های اخلاق و حریم خصوصی، و سوم مهارت‌هایی که برای همگام ماندن با این موج نیاز داریم.\n\nنکته مهم این است که هوش مصنوعی جایگزین تخصص انسانی نیست؛ بلکه ابزاری برای تقویت تصمیم‌گیری و خلاقیت است.", date: "2026/10/22" },
  { id: 2, title: "رازهای کهکشان راه شیری", category: "علمی", image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=900&q=80&auto=format&fit=crop", excerpt: "سفری کوتاه به اعماق کهکشان خانگی ما و آنچه هنوز نمی‌دانیم.", content: "کهکشان راه شیری خانه‌ی صدها میلیارد ستاره، سحابی‌ها و سیاه‌چاله‌ی کلان‌جرم مرکزی است.\n\nاخترشناسان با تلسکوپ‌های جدید، ساختار بازوهای مارپیچی و هاله‌ی ماده تاریک را دقیق‌تر ترسیم کرده‌اند. با این حال پرسش‌های بزرگی باقی مانده: ماده تاریک چیست و چگونه کهکشان‌ها شکل می‌گیرند؟\n\nدر این مطلب مروری تصویری بر مهم‌ترین کشفیات اخیر خواهیم داشت.", date: "2026/10/22" },
  { id: 3, title: "چطور پایتون را در 30 روز یاد بگیریم؟", category: "آموزشی", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900&q=80&auto=format&fit=crop", excerpt: "نقشه‌ی راه فشرده و عملی برای شروع برنامه‌نویسی با پایتون.", content: "پایتون به دلیل سادگی و اکوسیستم غنی، بهترین نقطه‌ی شروع برای بسیاری از علاقه‌مندان برنامه‌نویسی است.\n\nبرنامه‌ی 30 روزه پیشنهادی:\nهفته 1: مبانی سینتکس، متغیرها و کنترل جریان\nهفته 2: توابع، ماژول‌ها و کار با فایل\nهفته 3: شی‌گرایی و کار با API\nهفته 4: یک پروژه کوچک واقعی مثل تحلیل داده یا ربات تلگرام\n\nهر روز فقط 60 تا 90 دقیقه تمرین متمرکز کافی است؛ استمرار مهم‌تر از سرعت است.", date: "2026/10/22" },
];

let articles = (() => {
  try { return JSON.parse(localStorage.getItem("articles")) || [...defaultArticles]; }
  catch { return [...defaultArticles]; }
})();

let currentCategory = "همه";

/* ---------- utils ---------- */
function saveToStorage() { localStorage.setItem("articles", JSON.stringify(articles)); }
function saveCategories() { localStorage.setItem("categories", JSON.stringify(categories)); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function showToast(message, type = "info") {
  const c = document.getElementById("toastContainer");
  const el = document.createElement("div");
  const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-xmark" : "fa-circle-info";
  const color = type === "success" ? "#16a34a" : type === "error" ? "#e11d48" : "var(--primary)";
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icon}" style="color:${color}"></i><div style="flex:1"><div style="font-weight:900;font-size:13px">${escapeHtml(message)}</div></div><button onclick="this.closest('.toast').remove()" style="background:transparent;border:none;cursor:pointer;color:var(--muted)"><i class="fa-solid fa-xmark"></i></button>`;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(-6px)"; setTimeout(() => el.remove(), 260); }, 3600);
}

/* ---------- theme ---------- */
window.toggleDarkMode = function () {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", String(isDark));
  const btn = document.getElementById("darkBtn");
  if (btn) btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
};

/* ---------- categories ---------- */
function renderCategories() {
  const container = document.getElementById("categoriesContainer");
  const select = document.getElementById("category");
  const footerCats = document.getElementById("footerCats");

  let html = `<button class="cat-btn ${currentCategory === 'همه' ? 'active' : ''}" onclick="filterCategory('همه')">همه</button>`;
  categories.forEach(cat => {
    html += `<button class="cat-btn ${currentCategory === cat ? 'active' : ''}" onclick="filterCategory('${escapeHtml(cat)}')">${escapeHtml(cat)}</button>`;
  });
  if (container) container.innerHTML = html;

  if (select) {
    select.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
    if (categories.length === 0) select.innerHTML = `<option value="" disabled selected>ابتدا دسته بسازید</option>`;
  }

  const adminList = document.getElementById("categoryListAdmin");
  if (adminList) {
    adminList.innerHTML = categories.map(c => `
      <span class="cat-admin-item">${escapeHtml(c)} <button onclick="deleteCategory('${escapeHtml(c)}')" title="حذف دسته" aria-label="حذف ${escapeHtml(c)}"><i class="fa-solid fa-xmark"></i></button></span>
    `).join("") || "<span class='muted small'>هنوز دسته‌ای ثبت نشده است.</span>";
  }

  if (footerCats) {
    footerCats.innerHTML = categories.map(c => `<li><a onclick="filterCategory('${escapeHtml(c)}'); showHome(); document.getElementById('articlesAnchor').scrollIntoView({behavior:'smooth'})">${escapeHtml(c)}</a></li>`).join("") || `<li class="muted small">دسته‌ای وجود ندارد</li>`;
  }

  const heroStats = document.getElementById("heroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <span><i class="fa-regular fa-file-lines"></i> ${articles.length} مقاله</span>
      <span><i class="fa-solid fa-layer-group"></i> ${categories.length} دسته‌بندی</span>
      <span><i class="fa-solid fa-wand-magic-sparkles"></i> به‌روزرسانی مداوم</span>
    `;
  }
}

window.filterCategory = function (cat) {
  currentCategory = cat;
  renderCategories();
  renderArticles();
};

window.addCategory = function () {
  const input = document.getElementById("newCategoryInput");
  const val = input.value.trim();
  if (!val) return showToast("نام دسته را وارد کنید", "error");
  if (categories.includes(val)) return showToast("این دسته قبلاً وجود دارد", "error");
  categories.push(val);
  saveCategories();
  input.value = "";
  renderCategories();
  renderArticles();
  showToast("دسته اضافه شد", "success");
};

window.deleteCategory = function (cat) {
  if (!confirm(`دسته "${cat}" حذف شود؟ مقالات این دسته باقی می‌مانند.`)) return;
  categories = categories.filter(c => c !== cat);
  if (currentCategory === cat) currentCategory = "همه";
  saveCategories();
  renderCategories();
  renderArticles();
  showToast("دسته حذف شد", "success");
};

/* ---------- articles ---------- */
function filteredArticles() {
  const searchVal = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  return articles.filter(a =>
    (currentCategory === "همه" || a.category === currentCategory) &&
    (!searchVal || a.title.toLowerCase().includes(searchVal) || a.excerpt.toLowerCase().includes(searchVal))
  );
}

function renderArticles() {
  const grid = document.getElementById("articlesGrid");
  const badge = document.getElementById("articlesCountBadge");
  const empty = document.getElementById("emptyState");
  if (!grid) return;

  const list = filteredArticles();
  if (badge) badge.textContent = `${list.length} مقاله`;

  if (list.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.classList.remove("hidden");
    return;
  }
  if (empty) empty.classList.add("hidden");

  grid.innerHTML = list.map(a => `
    <article class="card article-card" onclick="openArticle(${a.id})" role="button" tabindex="0" aria-label="${escapeHtml(a.title)}" onkeydown="if(event.key==='Enter') openArticle(${a.id})">
      <div class="article-media">
        <img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80&auto=format&fit=crop'">
        <div class="media-grad"></div>
      </div>
      <div class="article-body">
        <div class="article-top">
          <span class="tag">${escapeHtml(a.category)}</span>
          <span class="muted small" style="display:inline-flex;align-items:center;gap:6px"><i class="fa-regular fa-calendar"></i> ${escapeHtml(a.date)}</span>
        </div>
        <h3 class="article-title">${escapeHtml(a.title)}</h3>
        <p class="article-excerpt">${escapeHtml(a.excerpt)}</p>
        <div class="article-foot">
          <span class="foot-left"><span class="dot"></span> ${escapeHtml(a.excerpt.slice(0, 18))}…</span>
          <span class="read-more">ادامه <i class="fa-solid fa-arrow-left"></i></span>
        </div>
      </div>
    </article>
  `).join("");
}

window.searchArticles = function () { renderArticles(); };
window.clearFilters = function () {
  currentCategory = "همه";
  const inp = document.getElementById("searchInput");
  if (inp) inp.value = "";
  renderCategories();
  renderArticles();
};

window.openArticle = function (id) {
  const a = articles.find(x => x.id === id);
  if (!a) return;
  document.getElementById("home-section")?.classList.add("hidden");
  document.getElementById("admin-section")?.classList.add("hidden");
  document.getElementById("single-section")?.classList.remove("hidden");
  document.getElementById("singleArticle").innerHTML = `
    <div class="single-hero">
      <img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80&auto=format&fit=crop'">
      <div class="single-hero-meta">
        <span class="tag">${escapeHtml(a.category)}</span>
        <span class="date-pill"><i class="fa-regular fa-calendar"></i> ${escapeHtml(a.date)}</span>
      </div>
    </div>
    <div class="single-content">
      <h1>${escapeHtml(a.title)}</h1>
      <div class="single-excerpt">${escapeHtml(a.excerpt)}</div>
      <div class="prose">${escapeHtml(a.content)}</div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: "smooth" });
  setActiveNav(null);
};

window.showHome = function () {
  document.getElementById("single-section")?.classList.add("hidden");
  document.getElementById("admin-section")?.classList.add("hidden");
  document.getElementById("home-section")?.classList.remove("hidden");
  setActiveNav("home");
  renderArticles();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.showAdminLogin = function () {
  document.getElementById("home-section")?.classList.add("hidden");
  document.getElementById("single-section")?.classList.add("hidden");
  document.getElementById("admin-section")?.classList.remove("hidden");
  renderCategories();
  renderAdminList();
  setActiveNav(null);
  const dash = document.getElementById("dashboard");
  const box = document.getElementById("loginBox");
  // keep last state: if already logged, show dashboard
  if (dash && !dash.classList.contains("hidden")) {
    // already logged
  } else {
    box?.classList.remove("hidden");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function setActiveNav(which) {
  const el = document.getElementById("navHome");
  if (!el) return;
  if (which === "home") el.classList.add("active");
  else el.classList.remove("active");
}

window.login = function () {
  const val = document.getElementById("adminPass")?.value || "";
  const err = document.getElementById("loginError");
  if (val === ADMIN_PASSWORD) {
    document.getElementById("loginBox")?.classList.add("hidden");
    document.getElementById("dashboard")?.classList.remove("hidden");
    if (err) err.textContent = "";
    renderAdminList();
    showToast("ورود موفق", "success");
  } else {
    if (err) err.textContent = "رمز عبور اشتباه است.";
    showToast("رمز عبور اشتباه است", "error");
  }
};

window.logout = function () {
  document.getElementById("dashboard")?.classList.add("hidden");
  document.getElementById("loginBox")?.classList.remove("hidden");
  const p = document.getElementById("adminPass");
  if (p) p.value = "";
  showHome();
  showToast("از پنل خارج شدید", "info");
};

/* ---------- admin CRUD ---------- */
window.saveArticle = function (e) {
  e.preventDefault();
  const idVal = document.getElementById("editId")?.value || "";
  const title = document.getElementById("title")?.value.trim() || "";
  const category = document.getElementById("category")?.value || "";
  const image = document.getElementById("image")?.value.trim() || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80&auto=format&fit=crop";
  const excerpt = document.getElementById("excerpt")?.value.trim() || "";
  const content = document.getElementById("content")?.value.trim() || "";

  if (!title || !excerpt || !content) return showToast("فیلدهای ستاره‌دار را پر کنید", "error");
  if (!category) return showToast("دسته‌بندی را انتخاب کنید", "error");

  // basic url check if provided
  if (document.getElementById("image")?.value.trim()) {
    try { new URL(image); } catch { return showToast("لینک تصویر معتبر نیست", "error"); }
  }

  const newArticle = {
    id: idVal ? Number(idVal) : Date.now(),
    title, category, image, excerpt, content,
    date: new Date().toLocaleDateString("fa-IR")
  };

  if (idVal) {
    const idx = articles.findIndex(a => String(a.id) === String(idVal));
    if (idx >= 0) articles[idx] = newArticle;
  } else {
    articles.unshift(newArticle);
  }
  saveToStorage();
  e.target.reset();
  const editIdEl = document.getElementById("editId");
  if (editIdEl) editIdEl.value = "";
  const ft = document.getElementById("formTitle");
  if (ft) ft.textContent = "افزودن مقاله جدید";
  const sb = document.getElementById("submitBtn");
  if (sb) sb.textContent = "انتشار مقاله";
  document.getElementById("cancelEdit")?.classList.add("hidden");
  renderArticles(); renderAdminList(); renderCategories();
  showToast("مقاله ذخیره شد", "success");
};

function renderAdminList() {
  const countEl = document.getElementById("count");
  const listEl = document.getElementById("adminList");
  const sub = document.getElementById("dashboardSub");
  if (countEl) countEl.textContent = `${articles.length} مقاله`;
  if (sub) sub.textContent = `${articles.length} مقاله • ${categories.length} دسته‌بندی`;
  if (!listEl) return;
  if (articles.length === 0) {
    listEl.innerHTML = `<p class="muted small" style="padding:12px 0">هنوز مقاله‌ای ثبت نشده است.</p>`;
    return;
  }
  listEl.innerHTML = articles.map(a => `
    <div class="admin-item">
      <div style="min-width:0">
        <strong>${escapeHtml(a.title)}</strong>
        <div><small>${escapeHtml(a.category)} • ${escapeHtml(a.date)}</small></div>
      </div>
      <div class="admin-actions">
        <button class="icon-mini edit" onclick="editArticle(${a.id})" title="ویرایش" aria-label="ویرایش"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-mini delete" onclick="deleteArticle(${a.id})" title="حذف" aria-label="حذف"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join("");
}

window.editArticle = function (id) {
  const a = articles.find(x => String(x.id) === String(id));
  if (!a) return;
  document.getElementById("editId").value = String(a.id);
  document.getElementById("title").value = a.title;
  document.getElementById("category").value = a.category;
  document.getElementById("image").value = a.image;
  document.getElementById("excerpt").value = a.excerpt;
  document.getElementById("content").value = a.content;
  document.getElementById("formTitle").textContent = "ویرایش مقاله";
  document.getElementById("submitBtn").textContent = "ذخیره تغییرات";
  document.getElementById("cancelEdit")?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.cancelArticleEdit = function () {
  document.getElementById("articleForm")?.reset();
  const e = document.getElementById("editId");
  if (e) e.value = "";
  document.getElementById("formTitle").textContent = "افزودن مقاله جدید";
  document.getElementById("submitBtn").textContent = "انتشار مقاله";
  document.getElementById("cancelEdit")?.classList.add("hidden");
};

window.deleteArticle = function (id) {
  if (!confirm("این مقاله حذف شود؟")) return;
  articles = articles.filter(a => String(a.id) !== String(id));
  saveToStorage();
  renderArticles(); renderAdminList(); renderCategories();
  showToast("مقاله حذف شد", "success");
};

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    const b = document.getElementById("darkBtn");
    if (b) b.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  renderCategories();
  renderArticles();
  renderAdminList();
  setActiveNav("home");
  // keyboard: logo enter
  const logo = document.querySelector(".logo");
  if (logo) logo.addEventListener("keydown", (e) => { if (e.key === "Enter") showHome(); });
});
