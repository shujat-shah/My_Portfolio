// ==========================================================================
// SHUJAT PORTFOLIO - MANAGER LOGIC (CRUD & SYNC)
// ==========================================================================

let portfolioData = null;
let dbConfig = null;

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  loadData();
  setupEventListeners();
});

// 1. Tab Navigation Routing with Hash Trigger
function setupTabs() {
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  const panels = document.querySelectorAll(".admin-panel-view");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      document.getElementById(targetId).classList.add("active");
      
      // Sync hash with active tab
      window.location.hash = targetId;
    });
  });

  // Auto-activate tab based on URL Hash (e.g. #panel-experiences)
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash) {
    const targetTab = document.querySelector(`.admin-tab-btn[data-target="${initialHash}"]`);
    if (targetTab) {
      setTimeout(() => {
        targetTab.click();
      }, 50);
    }
  }
}

// 2. Data Loading Engine
async function loadData() {
  try {
    // Load Firebase sync configurations
    const localDbConfig = localStorage.getItem("portfolio_db_config");
    if (localDbConfig) {
      dbConfig = JSON.parse(localDbConfig);
      document.getElementById("fb-url").value = dbConfig.url || "";
      document.getElementById("fb-key").value = dbConfig.key || "";
      document.getElementById("fb-domain").value = dbConfig.domain || "";
      updateDbStatus(true, "Firebase Connection configured");
    }

    // Load portfolio data from Firebase, LocalStorage, or JSON file
    if (dbConfig && dbConfig.url) {
      updateDbStatus(true, "Syncing with cloud database...");
      const fbData = await fetchCloudData(dbConfig.url);
      if (fbData) {
        portfolioData = fbData;
        updateDbStatus(true, "Cloud Sync Active");
      }
    }

    if (!portfolioData) {
      const localDataStr = localStorage.getItem("portfolio_data");
      if (localDataStr) {
        portfolioData = JSON.parse(localDataStr);
      } else {
        const response = await fetch("./portfolio_data.json");
        if (!response.ok) throw new Error("Failed to load standard json");
        portfolioData = await response.json();
      }
    }

    // Hydrate form sections
    hydrateProfileForm();
    renderExperiencesList();
    renderProjectsList();
    renderCertificationsList();
  } catch (error) {
    console.error("Error loading administration details:", error);
    alert("Error initializing portfolio manager. Check developer console.");
  }
}

// Firebase Cloud REST Fetcher
async function fetchCloudData(url) {
  try {
    const cleanUrl = url.endsWith("/") ? url : url + "/";
    const response = await fetch(`${cleanUrl}portfolio.json`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("Could not retrieve cloud database:", err);
    updateDbStatus(false, "Cloud Database Offline / CORS blocked");
    return null;
  }
}

// Firebase Cloud REST Writer
async function syncToCloud() {
  if (!dbConfig || !dbConfig.url || !portfolioData) return;
  try {
    const cleanUrl = dbConfig.url.endsWith("/") ? dbConfig.url : dbConfig.url + "/";
    updateDbStatus(true, "Writing changes to cloud...");
    const response = await fetch(`${cleanUrl}portfolio.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(portfolioData)
    });
    if (response.ok) {
      updateDbStatus(true, "Cloud Sync Active & Saved");
    } else {
      throw new Error("Failed PUT write");
    }
  } catch (err) {
    console.error("Cloud synchronization error:", err);
    updateDbStatus(false, "Write failed. Verify DB security rules.");
  }
}

function updateDbStatus(isConnected, message) {
  const dot = document.getElementById("db-status-dot");
  const text = document.getElementById("db-status-text");
  const clearBtn = document.getElementById("btn-clear-db");
  
  if (isConnected) {
    dot.className = "status-indicator";
    clearBtn.style.display = "inline-block";
  } else {
    dot.className = "status-indicator offline";
  }
  text.innerText = message;
}

// 3. Form Hydrations & Form Save Events
function hydrateProfileForm() {
  if (!portfolioData) return;
  const p = portfolioData.personal;
  document.getElementById("prof-name").value = p.name || "";
  document.getElementById("prof-title").value = p.title || "";
  document.getElementById("prof-email").value = p.email || "";
  document.getElementById("prof-phone").value = p.phone || "";
  document.getElementById("prof-github").value = p.github || "";
  document.getElementById("prof-linkedin").value = p.linkedin || "";
  document.getElementById("prof-summary").value = p.summary || "";
}

function setupEventListeners() {
  // Save Profile Form
  document.getElementById("form-profile").addEventListener("submit", (e) => {
    e.preventDefault();
    portfolioData.personal.name = document.getElementById("prof-name").value;
    portfolioData.personal.title = document.getElementById("prof-title").value;
    portfolioData.personal.email = document.getElementById("prof-email").value;
    portfolioData.personal.phone = document.getElementById("prof-phone").value;
    portfolioData.personal.github = document.getElementById("prof-github").value;
    portfolioData.personal.linkedin = document.getElementById("prof-linkedin").value;
    portfolioData.personal.summary = document.getElementById("prof-summary").value;
    
    saveState();
    alert("Profile configurations saved locally!");
  });

  // Save/Add Experience Form
  document.getElementById("form-experience").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("exp-id").value;
    const role = document.getElementById("exp-role").value;
    const company = document.getElementById("exp-company").value;
    const duration = document.getElementById("exp-duration").value;
    const location = document.getElementById("exp-location").value;
    const description = document.getElementById("exp-desc").value;
    
    const checkboxes = document.querySelectorAll('input[name="exp-fields"]:checked');
    const fields = Array.from(checkboxes).map(cb => cb.value);
    
    if (fields.length === 0) {
      alert("Please select at least one field tag for this experience.");
      return;
    }
    
    if (id) {
      // Edit mode
      const idx = portfolioData.experiences.findIndex(x => x.id === id);
      if (idx !== -1) {
        portfolioData.experiences[idx] = { id, role, company, duration, location, description, fields };
      }
    } else {
      // Add mode
      const newId = "exp-" + Date.now();
      portfolioData.experiences.push({ id: newId, role, company, duration, location, description, fields });
    }
    
    saveState();
    resetExperienceForm();
    renderExperiencesList();
    alert("Experience saved successfully!");
  });

  document.getElementById("btn-exp-cancel").addEventListener("click", resetExperienceForm);

  // Save/Add Project Form
  document.getElementById("form-project").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("proj-id").value;
    const title = document.getElementById("proj-title").value;
    const duration = document.getElementById("proj-duration").value;
    const description = document.getElementById("proj-desc").value;
    
    const techInput = document.getElementById("proj-tech").value;
    const technologies = techInput.split(",").map(t => t.trim()).filter(t => t !== "");
    
    const checkboxes = document.querySelectorAll('input[name="proj-fields"]:checked');
    const fields = Array.from(checkboxes).map(cb => cb.value);
    
    if (fields.length === 0) {
      alert("Please select at least one field tag for this project.");
      return;
    }
    
    if (id) {
      const idx = portfolioData.projects.findIndex(x => x.id === id);
      if (idx !== -1) {
        portfolioData.projects[idx] = { id, title, duration, description, technologies, fields };
      }
    } else {
      const newId = "proj-" + Date.now();
      portfolioData.projects.push({ id: newId, title, duration, description, technologies, fields });
    }
    
    saveState();
    resetProjectForm();
    renderProjectsList();
    alert("Project saved successfully!");
  });

  document.getElementById("btn-proj-cancel").addEventListener("click", resetProjectForm);

  // Save/Add Certification Form
  document.getElementById("form-certification").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("cert-id").value;
    const title = document.getElementById("cert-title").value;
    const provider = document.getElementById("cert-provider").value;
    const date = document.getElementById("cert-date").value;
    const description = document.getElementById("cert-desc").value;
    
    const checkboxes = document.querySelectorAll('input[name="cert-fields"]:checked');
    const fields = Array.from(checkboxes).map(cb => cb.value);
    
    if (fields.length === 0) {
      alert("Please select at least one field tag for this certification.");
      return;
    }
    
    if (id) {
      const idx = portfolioData.certifications.findIndex(x => x.id === id);
      if (idx !== -1) {
        portfolioData.certifications[idx] = { id, title, provider, date, description, fields };
      }
    } else {
      const newId = "cert-" + Date.now();
      portfolioData.certifications.push({ id: newId, title, provider, date, description, fields });
    }
    
    saveState();
    resetCertificationForm();
    renderCertificationsList();
    alert("Certification saved successfully!");
  });

  document.getElementById("btn-cert-cancel").addEventListener("click", resetCertificationForm);

  // Database Connection Sync Form Submit
  document.getElementById("form-firebase-sync").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = document.getElementById("fb-url").value.trim();
    const key = document.getElementById("fb-key").value.trim();
    const domain = document.getElementById("fb-domain").value.trim();
    
    if (url === "") {
      localStorage.removeItem("portfolio_db_config");
      dbConfig = null;
      updateDbStatus(false, "Disconnected");
      alert("Database config removed.");
      return;
    }
    
    dbConfig = { url, key, domain };
    localStorage.setItem("portfolio_db_config", JSON.stringify(dbConfig));
    updateDbStatus(true, "Firebase configuration saved. Connecting...");
    
    syncToCloud();
  });
  
  document.getElementById("btn-clear-db").addEventListener("click", () => {
    document.getElementById("fb-url").value = "";
    document.getElementById("fb-key").value = "";
    document.getElementById("fb-domain").value = "";
    localStorage.removeItem("portfolio_db_config");
    dbConfig = null;
    updateDbStatus(false, "Not Connected (Using local storage mode)");
    document.getElementById("btn-clear-db").style.display = "none";
    alert("Database disconnected.");
  });

  // Export JSON Config File download trigger
  document.getElementById("btn-export-json").addEventListener("click", exportJsonData);

  // Reset local state to default config file
  document.getElementById("btn-reset-data").addEventListener("click", async () => {
    if (confirm("WARNING: This will discard all your changes and reset the portfolio back to the original resume details! Proceed?")) {
      localStorage.removeItem("portfolio_data");
      portfolioData = null;
      await loadData();
      alert("Successfully restored defaults!");
      window.location.reload();
    }
  });
}

// 4. Save and Update Global State
function saveState() {
  if (!portfolioData) return;
  // Save locally
  localStorage.setItem("portfolio_data", JSON.stringify(portfolioData));
  
  // Sync to database if available
  if (dbConfig && dbConfig.url) {
    syncToCloud();
  }
}

// 5. CRUD Render Builders

// Experiences List
function renderExperiencesList() {
  const container = document.getElementById("list-experiences");
  container.innerHTML = "";
  
  if (portfolioData.experiences.length === 0) {
    container.innerHTML = `<p class="text-muted">No experiences added yet.</p>`;
    return;
  }
  
  portfolioData.experiences.forEach(exp => {
    const item = document.createElement("div");
    item.className = "crud-item";
    item.innerHTML = `
      <div class="crud-item-info">
        <div class="crud-item-title">${exp.role} — <span style="color:var(--accent); font-weight:600">${exp.company}</span></div>
        <div class="crud-item-subtitle">${exp.duration} • Tagged: ${exp.fields.join(", ")}</div>
      </div>
      <div class="crud-item-actions">
        <button class="glass-button btn-small" onclick="editExperience('${exp.id}')">✏️ Edit</button>
        <button class="glass-button btn-small btn-danger" onclick="deleteExperience('${exp.id}')">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function resetExperienceForm() {
  document.getElementById("exp-id").value = "";
  document.getElementById("exp-role").value = "";
  document.getElementById("exp-company").value = "";
  document.getElementById("exp-duration").value = "";
  document.getElementById("exp-location").value = "";
  document.getElementById("exp-desc").value = "";
  
  const checkboxes = document.querySelectorAll('input[name="exp-fields"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  document.getElementById("exp-form-title").innerText = "➕ Add New Experience";
  document.getElementById("btn-exp-submit").innerText = "➕ Add Experience";
  document.getElementById("btn-exp-cancel").style.display = "none";
}

window.editExperience = function(id) {
  const exp = portfolioData.experiences.find(x => x.id === id);
  if (!exp) return;
  
  document.getElementById("exp-id").value = exp.id;
  document.getElementById("exp-role").value = exp.role;
  document.getElementById("exp-company").value = exp.company;
  document.getElementById("exp-duration").value = exp.duration;
  document.getElementById("exp-location").value = exp.location || "";
  document.getElementById("exp-desc").value = exp.description;
  
  const checkboxes = document.querySelectorAll('input[name="exp-fields"]');
  checkboxes.forEach(cb => {
    cb.checked = exp.fields.includes(cb.value);
  });
  
  document.getElementById("exp-form-title").innerText = "✏️ Edit Experience";
  document.getElementById("btn-exp-submit").innerText = "💾 Update Experience";
  document.getElementById("btn-exp-cancel").style.display = "inline-block";
  
  document.getElementById("form-experience").scrollIntoView({ behavior: 'smooth' });
};

window.deleteExperience = function(id) {
  if (confirm("Are you sure you want to delete this experience?")) {
    portfolioData.experiences = portfolioData.experiences.filter(x => x.id !== id);
    saveState();
    renderExperiencesList();
  }
};

// Projects List
function renderProjectsList() {
  const container = document.getElementById("list-projects");
  container.innerHTML = "";
  
  if (portfolioData.projects.length === 0) {
    container.innerHTML = `<p class="text-muted">No projects added yet.</p>`;
    return;
  }
  
  portfolioData.projects.forEach(proj => {
    const item = document.createElement("div");
    item.className = "crud-item";
    item.innerHTML = `
      <div class="crud-item-info">
        <div class="crud-item-title">${proj.title}</div>
        <div class="crud-item-subtitle">${proj.duration} • Tech: ${proj.technologies.join(", ")} • Tagged: ${proj.fields.join(", ")}</div>
      </div>
      <div class="crud-item-actions">
        <button class="glass-button btn-small" onclick="editProject('${proj.id}')">✏️ Edit</button>
        <button class="glass-button btn-small btn-danger" onclick="deleteProject('${proj.id}')">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function resetProjectForm() {
  document.getElementById("proj-id").value = "";
  document.getElementById("proj-title").value = "";
  document.getElementById("proj-duration").value = "";
  document.getElementById("proj-tech").value = "";
  document.getElementById("proj-desc").value = "";
  
  const checkboxes = document.querySelectorAll('input[name="proj-fields"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  document.getElementById("proj-form-title").innerText = "➕ Add New Project";
  document.getElementById("btn-proj-submit").innerText = "➕ Add Project";
  document.getElementById("btn-proj-cancel").style.display = "none";
}

window.editProject = function(id) {
  const proj = portfolioData.projects.find(x => x.id === id);
  if (!proj) return;
  
  document.getElementById("proj-id").value = proj.id;
  document.getElementById("proj-title").value = proj.title;
  document.getElementById("proj-duration").value = proj.duration;
  document.getElementById("proj-tech").value = proj.technologies.join(", ");
  document.getElementById("proj-desc").value = proj.description;
  
  const checkboxes = document.querySelectorAll('input[name="proj-fields"]');
  checkboxes.forEach(cb => {
    cb.checked = proj.fields.includes(cb.value);
  });
  
  document.getElementById("proj-form-title").innerText = "✏️ Edit Project";
  document.getElementById("btn-proj-submit").innerText = "💾 Update Project";
  document.getElementById("btn-proj-cancel").style.display = "inline-block";
  
  document.getElementById("form-project").scrollIntoView({ behavior: 'smooth' });
};

window.deleteProject = function(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    portfolioData.projects = portfolioData.projects.filter(x => x.id !== id);
    saveState();
    renderProjectsList();
  }
};

// Certifications List
function renderCertificationsList() {
  const container = document.getElementById("list-certs");
  container.innerHTML = "";
  
  if (portfolioData.certifications.length === 0) {
    container.innerHTML = `<p class="text-muted">No certifications added yet.</p>`;
    return;
  }
  
  portfolioData.certifications.forEach(cert => {
    const item = document.createElement("div");
    item.className = "crud-item";
    item.innerHTML = `
      <div class="crud-item-info">
        <div class="crud-item-title">${cert.title}</div>
        <div class="crud-item-subtitle">${cert.provider} — ${cert.date} • Tagged: ${cert.fields.join(", ")}</div>
      </div>
      <div class="crud-item-actions">
        <button class="glass-button btn-small" onclick="editCertification('${cert.id}')">✏️ Edit</button>
        <button class="glass-button btn-small btn-danger" onclick="deleteCertification('${cert.id}')">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function resetCertificationForm() {
  document.getElementById("cert-id").value = "";
  document.getElementById("cert-title").value = "";
  document.getElementById("cert-provider").value = "";
  document.getElementById("cert-date").value = "";
  document.getElementById("cert-desc").value = "";
  
  const checkboxes = document.querySelectorAll('input[name="cert-fields"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  document.getElementById("cert-form-title").innerText = "➕ Add New Certification";
  document.getElementById("btn-cert-submit").innerText = "➕ Add Certification";
  document.getElementById("btn-cert-cancel").style.display = "none";
}

window.editCertification = function(id) {
  const cert = portfolioData.certifications.find(x => x.id === id);
  if (!cert) return;
  
  document.getElementById("cert-id").value = cert.id;
  document.getElementById("cert-title").value = cert.title;
  document.getElementById("cert-provider").value = cert.provider;
  document.getElementById("cert-date").value = cert.date;
  document.getElementById("cert-desc").value = cert.description;
  
  const checkboxes = document.querySelectorAll('input[name="cert-fields"]');
  checkboxes.forEach(cb => {
    cb.checked = cert.fields.includes(cb.value);
  });
  
  document.getElementById("cert-form-title").innerText = "✏️ Edit Certification";
  document.getElementById("btn-cert-submit").innerText = "💾 Update Certification";
  document.getElementById("btn-cert-cancel").style.display = "inline-block";
  
  document.getElementById("form-certification").scrollIntoView({ behavior: 'smooth' });
};

window.deleteCertification = function(id) {
  if (confirm("Are you sure you want to delete this certification?")) {
    portfolioData.certifications = portfolioData.certifications.filter(x => x.id !== id);
    saveState();
    renderCertificationsList();
  }
};

// 6. JSON File Downloader Export
function exportJsonData() {
  if (!portfolioData) return;
  
  const dataStr = JSON.stringify(portfolioData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.download = "portfolio_data.json";
  document.body.appendChild(tempLink);
  tempLink.click();
  
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
}
