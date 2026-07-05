// ==========================================================================
// SHUJAT PORTFOLIO - CLIENT APPLICATION LOGIC
// ==========================================================================

// Global state
let portfolioData = null;
let currentTab = "portal";

// SVG Watermark Templates for each field
const watermarks = {
  portal: `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M10,0 L10,100 M20,0 L20,100 M30,0 L30,100 M40,0 L40,100 M50,0 L50,100 M60,0 L60,100 M70,0 L70,100 M80,0 L80,100 M90,0 L90,100" stroke="currentColor" stroke-width="0.05" stroke-dasharray="2 2" fill="none" />
      <path d="M0,10 L100,10 M0,20 L100,20 M0,30 L100,30 M0,40 L100,40 M0,50 L100,50 M0,60 L100,60 M0,70 L100,70 M0,80 L100,80 M0,90 L100,90" stroke="currentColor" stroke-width="0.05" stroke-dasharray="2 2" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="0.1" fill="none" stroke-dasharray="5 5" />
    </svg>
  `,
  software: `
    <svg viewBox="0 0 800 800">
      <!-- Software / Code Brackets Watermark -->
      <g stroke="currentColor" stroke-width="2" fill="none" opacity="0.75">
        <rect x="150" y="150" width="500" height="500" rx="15" stroke-width="3" />
        <line x1="150" y1="230" x2="650" y2="230" stroke-width="2" />
        <circle cx="190" cy="190" r="8" fill="currentColor" />
        <circle cx="225" cy="190" r="8" fill="currentColor" />
        <circle cx="260" cy="190" r="8" fill="currentColor" />
        <path d="M220,320 L270,370 L220,420" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
        <line x1="290" y1="420" x2="380" y2="420" stroke-width="5" stroke-linecap="round" />
        <path d="M480,310 C450,310 450,340 450,370 C450,400 450,430 480,430" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
        <path d="M520,310 C550,310 550,340 550,370 C550,400 550,430 520,430" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
        <line x1="220" y1="500" x2="580" y2="500" stroke-dasharray="10 5" />
        <line x1="220" y1="560" x2="450" y2="560" stroke-dasharray="5 5" />
      </g>
    </svg>
  `,
  hardware: `
    <svg viewBox="0 0 800 800">
      <!-- Circuit Board / Hardware Watermark -->
      <rect x="250" y="250" width="300" height="300" rx="20" fill="none" stroke="currentColor" stroke-width="4" />
      <rect x="290" y="290" width="220" height="220" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="10 5" />
      <g fill="currentColor">
        <rect x="280" y="220" width="15" height="30" />
        <rect x="320" y="220" width="15" height="30" />
        <rect x="360" y="220" width="15" height="30" />
        <rect x="400" y="220" width="15" height="30" />
        <rect x="440" y="220" width="15" height="30" />
        <rect x="480" y="220" width="15" height="30" />
        <rect x="280" y="550" width="15" height="30" />
        <rect x="320" y="550" width="15" height="30" />
        <rect x="360" y="550" width="15" height="30" />
        <rect x="400" y="550" width="15" height="30" />
        <rect x="440" y="550" width="15" height="30" />
        <rect x="480" y="550" width="15" height="30" />
        <rect x="220" y="280" width="30" height="15" />
        <rect x="220" y="320" width="30" height="15" />
        <rect x="220" y="360" width="30" height="15" />
        <rect x="220" y="400" width="30" height="15" />
        <rect x="220" y="440" width="30" height="15" />
        <rect x="220" y="480" width="30" height="15" />
        <rect x="550" y="280" width="30" height="15" />
        <rect x="550" y="320" width="30" height="15" />
        <rect x="550" y="360" width="30" height="15" />
        <rect x="550" y="400" width="30" height="15" />
        <rect x="550" y="440" width="30" height="15" />
        <rect x="550" y="480" width="30" height="15" />
      </g>
      <g stroke="currentColor" stroke-width="3" fill="none" opacity="0.7">
        <path d="M400,220 L400,100 L150,100 L150,150" />
        <path d="M480,220 L480,140 L650,140" stroke-dasharray="5 5" />
        <path d="M220,360 L100,360 L100,600 L150,650" />
        <path d="M550,440 L680,440 L720,480 L720,620" />
        <path d="M400,580 L400,700 L500,700" />
      </g>
      <g fill="currentColor">
        <circle cx="150" cy="150" r="10" />
        <circle cx="650" cy="140" r="8" />
        <circle cx="150" cy="650" r="10" />
        <circle cx="720" cy="620" r="12" />
        <circle cx="500" cy="700" r="9" />
      </g>
    </svg>
  `,
  "ai-ml": `
    <svg viewBox="0 0 800 800">
      <g stroke="currentColor" stroke-width="1.5" opacity="0.6">
        <line x1="150" y1="400" x2="350" y2="200" />
        <line x1="150" y1="400" x2="350" y2="400" />
        <line x1="150" y1="400" x2="350" y2="600" />
        <line x1="350" y1="200" x2="550" y2="200" />
        <line x1="350" y1="200" x2="550" y2="350" />
        <line x1="350" y1="400" x2="550" y2="350" />
        <line x1="350" y1="400" x2="550" y2="450" />
        <line x1="350" y1="600" x2="550" y2="450" />
        <line x1="350" y1="600" x2="550" y2="600" />
        <line x1="550" y1="200" x2="700" y2="400" />
        <line x1="550" y1="350" x2="700" y2="400" />
        <line x1="550" y1="450" x2="700" y2="400" />
        <line x1="550" y1="600" x2="700" y2="400" />
      </g>
      <g fill="currentColor">
        <circle cx="150" cy="400" r="14" />
        <circle cx="350" cy="200" r="14" />
        <circle cx="350" cy="400" r="14" />
        <circle cx="350" cy="600" r="14" />
        <circle cx="550" cy="200" r="14" />
        <circle cx="550" cy="350" r="14" />
        <circle cx="550" cy="450" r="14" />
        <circle cx="550" cy="600" r="14" />
        <circle cx="700" cy="400" r="18" fill="var(--accent-secondary)" />
      </g>
      <circle cx="350" cy="400" r="280" stroke="currentColor" stroke-width="1" stroke-dasharray="5 15" fill="none" />
    </svg>
  `,
  cybersecurity: `
    <svg viewBox="0 0 800 800">
      <g stroke="currentColor" stroke-width="4" fill="none" opacity="0.8">
        <path d="M400,100 C550,100 650,120 650,120 C650,120 650,450 400,680 C150,450 150,120 150,120 C150,120 250,100 400,100 Z" />
        <rect x="310" y="360" width="180" height="130" rx="10" stroke-width="3" />
        <path d="M350,360 L350,290 C350,250 380,220 400,220 C420,220 450,250 450,290 L450,360" stroke-width="3" />
      </g>
      <circle cx="400" cy="415" r="10" fill="currentColor" />
      <path d="M400,425 L400,460" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <line x1="100" y1="250" x2="700" y2="250" stroke="currentColor" stroke-width="0.5" opacity="0.3" stroke-dasharray="10 10" />
      <line x1="100" y1="520" x2="700" y2="520" stroke="currentColor" stroke-width="0.5" opacity="0.3" stroke-dasharray="10 10" />
      <text x="200" y="200" fill="currentColor" font-family="monospace" font-size="20" opacity="0.4">1001010</text>
      <text x="550" y="200" fill="currentColor" font-family="monospace" font-size="20" opacity="0.4">1101</text>
      <text x="180" y="580" fill="currentColor" font-family="monospace" font-size="20" opacity="0.4">0010</text>
      <text x="540" y="580" fill="currentColor" font-family="monospace" font-size="20" opacity="0.4">0110101</text>
    </svg>
  `
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Setup Overlay for Mobile Drawer
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);
  
  // DOM Elements
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  
  // Mobile Hamburger Toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  
  overlay.addEventListener("click", () => {
    hamburger.classList.remove("active");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Navigation Tab Click handlers
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tabId = item.getAttribute("data-tab");
      switchTab(tabId);
      
      // Close mobile sidebar if open
      hamburger.classList.remove("active");
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  // Load Data
  loadPortfolioData();
});

// Load the resume and configurations
async function loadPortfolioData() {
  try {
    const localDataStr = localStorage.getItem("portfolio_data");
    if (localDataStr) {
      portfolioData = JSON.parse(localDataStr);
      console.log("Loaded data from localStorage");
    } else {
      const response = await fetch("./portfolio_data.json");
      if (!response.ok) throw new Error("Failed to load JSON file");
      portfolioData = await response.json();
      console.log("Loaded data from portfolio_data.json");
    }
    
    hydrateGlobalInfo();
    
    // Check hash on load
    const hash = window.location.hash.replace("#", "");
    if (hash && portfolioData.fields[hash]) {
      switchTab(hash);
    } else {
      switchTab("portal");
    }
  } catch (error) {
    console.error("Error setting up data:", error);
    document.getElementById("portal-summary").innerText = "Error loading portfolio details. Please check console.";
  }
}

// Populate constant elements (name, footer, contact links)
function hydrateGlobalInfo() {
  if (!portfolioData) return;
  
  document.getElementById("user-name").innerText = portfolioData.personal.name;
  document.getElementById("user-title").innerText = portfolioData.personal.title;
  document.getElementById("portal-summary").innerText = portfolioData.personal.summary;
  
  // Set contact hrefs
  document.getElementById("contact-email").href = `mailto:${portfolioData.personal.email}`;
  document.getElementById("contact-phone").href = `tel:${portfolioData.personal.phone}`;
  document.getElementById("contact-github").href = portfolioData.personal.github;
  document.getElementById("contact-linkedin").href = portfolioData.personal.linkedin;

  // Render "Other Work Experience" (Markhor BPO) on main front page
  const otherExpContainer = document.getElementById("portal-other-experience");
  otherExpContainer.innerHTML = "";
  const otherExps = portfolioData.experiences.filter(exp => exp.fields.includes("other"));
  
  if (otherExps.length > 0) {
    otherExps.forEach(exp => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-header">
          <div>
            <h4 class="timeline-role">${exp.role}</h4>
            <span class="timeline-company">${exp.company}</span>
          </div>
          <span class="timeline-duration">${exp.duration}</span>
        </div>
        <p class="timeline-desc">${exp.description}</p>
      `;
      otherExpContainer.appendChild(item);
    });
  } else {
    otherExpContainer.innerHTML = `<p class="text-muted">No other experience listed.</p>`;
  }

  // Render Global Education timeline on main front page
  const eduContainer = document.getElementById("portal-education");
  eduContainer.innerHTML = "";
  portfolioData.education.forEach(edu => {
    const item = document.createElement("div");
    item.className = "education-item";
    item.innerHTML = `
      <h4 class="edu-degree">${edu.degree}</h4>
      <span class="edu-inst">${edu.institution}</span>
      <div class="edu-grade">${edu.duration} • ${edu.grade}</div>
      <p class="edu-desc">${edu.description}</p>
    `;
    eduContainer.appendChild(item);
  });
}

// Switch tabs and trigger animations & styles
function switchTab(tabId) {
  if (!portfolioData) return;
  currentTab = tabId;
  
  // 1. Update HTML data attribute for CSS variable bindings
  document.documentElement.setAttribute("data-theme", tabId);
  
  // 2. Set URL Hash
  if (tabId === "portal") {
    window.history.replaceState(null, null, " ");
  } else {
    window.location.hash = tabId;
  }
  
  // 3. Update sidebar active state
  document.querySelectorAll(".nav-menu .nav-item").forEach(btn => {
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  // 4. Update Header Area & Edit Actions Buttons
  const fieldConfig = portfolioData.fields[tabId];
  document.getElementById("active-field-badge").innerText = tabId === "portal" ? "System Portal" : fieldConfig.name;
  document.getElementById("active-field-title").innerText = tabId === "portal" ? "Overview Dashboard" : fieldConfig.name;
  document.getElementById("active-field-tagline").innerText = fieldConfig.tagline;

  // Update dynamic Edit Button in the Header
  const actionContainer = document.getElementById("header-action-container");
  if (tabId === "portal") {
    actionContainer.innerHTML = `<button onclick="editCurrentView()" class="glass-button edit-action-btn">✏️ Edit Profile Info</button>`;
  } else {
    actionContainer.innerHTML = `<button onclick="editCurrentView()" class="glass-button edit-action-btn">✏️ Edit Page Details</button>`;
  }

  // 5. Update Watermark SVG
  const watermarkContainer = document.getElementById("watermark-svg-container");
  watermarkContainer.innerHTML = watermarks[tabId] || "";
  
  // 6. Manage Page Views (Portal vs Specific Field)
  const portalView = document.getElementById("view-portal");
  const fieldView = document.getElementById("view-field");
  
  const activeView = tabId === "portal" ? fieldView : portalView;
  const targetView = tabId === "portal" ? portalView : fieldView;
  
  activeView.classList.remove("active");
  
  setTimeout(() => {
    activeView.style.display = "none";
    targetView.style.display = "block";
    
    if (tabId !== "portal") {
      renderFieldDetails(tabId);
    }
    
    setTimeout(() => {
      targetView.classList.add("active");
    }, 50);
  }, 150);
}

// Filter and render skills, experiences, projects for chosen field
function renderFieldDetails(fieldId) {
  if (!portfolioData) return;
  
  // Setup focus summary
  const summaryDesc = document.getElementById("field-summary-description");
  summaryDesc.innerText = portfolioData.fields[fieldId].tagline + " Driven by a focus on engineering quality, problem solving, and hands-on laboratory experience.";
  
  // Configure edit links specifically for this field
  document.getElementById("btn-edit-focus").href = `admin.html#panel-profile`;
  document.getElementById("btn-edit-exp").href = `admin.html#panel-experiences`;
  document.getElementById("btn-edit-proj").href = `admin.html#panel-projects`;
  document.getElementById("btn-edit-cert").href = `admin.html#panel-certs`;

  // 1. Experiences Timeline
  const timeline = document.getElementById("field-experience-timeline");
  timeline.innerHTML = "";
  
  // Filter experiences tagged under the current field (like 'software', 'hardware', 'ai-ml', or 'cybersecurity')
  const filteredExps = portfolioData.experiences.filter(exp => exp.fields.includes(fieldId));
  
  if (filteredExps.length > 0) {
    filteredExps.forEach(exp => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-header">
          <div>
            <h4 class="timeline-role">${exp.role}</h4>
            <span class="timeline-company">${exp.company}</span>
          </div>
          <span class="timeline-duration">${exp.duration}</span>
        </div>
        <p class="timeline-desc">${exp.description}</p>
      `;
      timeline.appendChild(item);
    });
  } else {
    timeline.innerHTML = `<p class="text-muted">No specific corporate work experience added for this area yet.</p>`;
  }
  
  // 2. Projects Grid
  const projectsGrid = document.getElementById("field-projects-grid");
  projectsGrid.innerHTML = "";
  
  const filteredProj = portfolioData.projects.filter(proj => proj.fields.includes(fieldId));
  
  if (filteredProj.length > 0) {
    filteredProj.forEach(proj => {
      const techTags = proj.technologies.map(t => `<span class="project-tag">${t}</span>`).join("");
      const item = document.createElement("div");
      item.className = "project-card";
      item.innerHTML = `
        <h4>${proj.title}</h4>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">${techTags}</div>
      `;
      projectsGrid.appendChild(item);
    });
  } else {
    projectsGrid.innerHTML = `<p class="text-muted">No projects listed under this field.</p>`;
  }
  
  // 3. Skills Tags
  const skillsContainer = document.getElementById("field-skills-tags");
  skillsContainer.innerHTML = "";
  
  const fieldSkills = portfolioData.skills[fieldId] || [];
  if (fieldSkills.length > 0) {
    fieldSkills.forEach(skill => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.innerText = skill;
      skillsContainer.appendChild(tag);
    });
  } else {
    skillsContainer.innerHTML = `<p class="text-muted">No skills mapped.</p>`;
  }

  // 4. Certifications List
  const certContainer = document.getElementById("field-certifications-list");
  certContainer.innerHTML = "";
  
  const filteredCerts = portfolioData.certifications.filter(cert => cert.fields.includes(fieldId));
  
  if (filteredCerts.length > 0) {
    filteredCerts.forEach(cert => {
      const item = document.createElement("div");
      item.className = "cert-item";
      item.innerHTML = `
        <h4 class="cert-title">${cert.title}</h4>
        <div class="cert-provider">${cert.provider} — ${cert.date}</div>
        <p class="cert-desc">${cert.description}</p>
      `;
      certContainer.appendChild(item);
    });
  } else {
    certContainer.innerHTML = `<p class="text-muted">No certifications registered in this category.</p>`;
  }

  // 5. Education details
  const eduContainer = document.getElementById("field-education-details");
  eduContainer.innerHTML = "";
  
  const filteredEdu = portfolioData.education.filter(edu => edu.fields.includes(fieldId));
  if (filteredEdu.length > 0) {
    filteredEdu.forEach(edu => {
      const item = document.createElement("div");
      item.className = "education-item";
      item.innerHTML = `
        <h4 class="edu-degree">${edu.degree}</h4>
        <span class="edu-inst">${edu.institution}</span>
        <div class="edu-grade">${edu.duration} • ${edu.grade}</div>
        <p class="edu-desc">${edu.description}</p>
      `;
      eduContainer.appendChild(item);
    });
  } else {
    eduContainer.innerHTML = `<p class="text-muted">Education details are core-scoped.</p>`;
  }
}

// Redirect helper for page specific updates
function editCurrentView() {
  if (currentTab === "portal") {
    window.location.href = "admin.html#panel-profile";
  } else {
    // Lead to experiences panel where they can see the options
    window.location.href = "admin.html#panel-experiences";
  }
}

// Global hooks
window.switchTab = switchTab;
window.editCurrentView = editCurrentView;
