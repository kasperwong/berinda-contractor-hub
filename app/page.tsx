"use client";

import { useMemo, useState } from "react";
import { chuanLuckProjects } from "./chuan-luck-projects";

type Project = {
  id: string;
  name: string;
  scope: string;
  client: string;
  location: string;
  value: number;
  period: string;
  status: "Completed" | "Ongoing";
  progress?: string;
  sourcePage?: number;
};

type Contractor = {
  id: string;
  initials: string;
  name: string;
  trade: string;
  contactName: string;
  mobile: string;
  officePhone: string;
  email: string;
  grade: string;
  location: string;
  score: number;
  status: "Approved" | "Conditional" | "Review due";
  expiry: string;
  updated: string;
  preqDoneBy: string;
  preqDate: string;
  approvalDate: string;
  projects: Project[];
};

const initialContractors: Contractor[] = [
  {
    id: "chuan-luck",
    initials: "CL",
    name: "Chuan Luck Piling Sdn Bhd",
    trade: "Piling & foundation",
    grade: "G7",
    location: "Johor",
    score: 82,
    status: "Approved",
    expiry: "30 Jun 2027",
    updated: "2 days ago",
    preqDoneBy: "Johor Land Berhad",
    contactName: "Mr Lim Wei Jian",
    mobile: "012-778 4231",
    officePhone: "07-558 2188",
    email: "tender@chuanluck.com.my",
    preqDate: "12 Mar 2026",
    approvalDate: "18 Mar 2026",
    projects: chuanLuckProjects,
  },
  {
    id: "ajc",
    initials: "AJ",
    name: "AJC Ventures Sdn Bhd",
    trade: "Building works",
    grade: "G5",
    location: "Johor",
    score: 74,
    status: "Approved",
    expiry: "18 Mar 2027",
    updated: "5 days ago",
    preqDoneBy: "Berinda Group",
    contactName: "Mr Adrian Chin",
    mobile: "016-712 9088",
    officePhone: "07-521 6833",
    email: "admin@ajcventures.com.my",
    preqDate: "10 Mar 2026",
    approvalDate: "18 Mar 2026",
    projects: [
      {
        id: "ajc-1",
        name: "Commercial shop-office development",
        scope: "Main building, architectural and external works",
        client: "Private developer",
        location: "Kulai, Johor",
        value: 8700000,
        period: "Jun 2023 – Aug 2024",
        status: "Completed",
      },
      {
        id: "ajc-2",
        name: "Factory extension and upgrading",
        scope: "Structural, architectural and M&E coordination works",
        client: "Manufacturing client",
        location: "Pasir Gudang, Johor",
        value: 4900000,
        period: "Oct 2024 – Sep 2025",
        status: "Completed",
      },
    ],
  },
  {
    id: "gdb",
    initials: "GG",
    name: "GDB Geotechnics Sdn Bhd",
    trade: "Piling & foundation",
    grade: "G7",
    location: "Kuala Lumpur",
    score: 78,
    status: "Conditional",
    expiry: "12 Dec 2026",
    updated: "1 week ago",
    preqDoneBy: "Bukit Indah City Sdn Bhd",
    contactName: "Ms Grace Tan",
    mobile: "017-663 1192",
    officePhone: "03-7845 2260",
    email: "preq@gdbgeo.com.my",
    preqDate: "05 Feb 2026",
    approvalDate: "12 Feb 2026",
    projects: [
      {
        id: "gdb-1",
        name: "Data centre campus phase 1",
        scope: "Large-diameter bored piles, testing and instrumentation",
        client: "Regional data centre operator",
        location: "Sedenak, Johor",
        value: 21400000,
        period: "Apr 2024 – Jan 2025",
        status: "Completed",
      },
      {
        id: "gdb-2",
        name: "High-rise residential towers",
        scope: "Foundation piling and basement earth-retaining works",
        client: "Listed property developer",
        location: "Kuala Lumpur",
        value: 18200000,
        period: "Feb 2025 – Dec 2026",
        status: "Ongoing",
      },
    ],
  },
  {
    id: "pintaras",
    initials: "PJ",
    name: "Pintaras Jaya Berhad",
    trade: "Piling & foundation",
    grade: "G7",
    location: "Selangor",
    score: 69,
    status: "Review due",
    expiry: "28 Sep 2026",
    updated: "3 weeks ago",
    preqDoneBy: "Johor Land Berhad",
    contactName: "Mr Daniel Lee",
    mobile: "012-720 1974",
    officePhone: "03-7955 8100",
    email: "tender@pintaras.com.my",
    preqDate: "07 Jan 2026",
    approvalDate: "11 Feb 2026",
    projects: [
      {
        id: "pj-1",
        name: "Transit-oriented mixed development",
        scope: "Bored piles, diaphragm wall and foundation testing",
        client: "Urban property developer",
        location: "Petaling Jaya, Selangor",
        value: 32500000,
        period: "Jul 2022 – Oct 2024",
        status: "Completed",
      },
      {
        id: "pj-2",
        name: "Southern industrial park expansion",
        scope: "Driven piles for factories and supporting infrastructure",
        client: "Industrial park operator",
        location: "Tebrau, Johor",
        value: 11900000,
        period: "Jan 2025 – Aug 2026",
        status: "Ongoing",
      },
    ],
  },
];

const contractorDetails: Record<
  string,
  {
    registrationNumber: string;
    incorporated: string;
    address: string;
    email: string;
    phone: string;
    employees: string;
    averageRevenue: number;
    averageNetProfit: number;
    equity: number;
    liabilities: number;
  }
> = {
  "chuan-luck": {
    registrationNumber: "200101018847 (554604-W)",
    incorporated: "18 July 2001",
    address: "No. 8, Jalan Ekoperniagaan 2, Taman Ekoperniagaan, Johor Bahru, Johor",
    email: "admin@chuanluck.com.my",
    phone: "+607 556 2188",
    employees: "86",
    averageRevenue: 42800000,
    averageNetProfit: 3900000,
    equity: 18700000,
    liabilities: 14200000,
  },
  ajc: {
    registrationNumber: "201201023456 (1007948-X)",
    incorporated: "6 July 2012",
    address: "Taman Perindustrian Mount Austin, Johor Bahru, Johor",
    email: "admin@ajcventures.com.my",
    phone: "+607 351 8820",
    employees: "42",
    averageRevenue: 18100000,
    averageNetProfit: 1450000,
    equity: 7200000,
    liabilities: 6100000,
  },
  gdb: {
    registrationNumber: "201401006512 (1082590-P)",
    incorporated: "24 February 2014",
    address: "Jalan Tun Razak, Kuala Lumpur",
    email: "tender@gdbgeotechnics.com.my",
    phone: "+603 2162 7718",
    employees: "124",
    averageRevenue: 75600000,
    averageNetProfit: 6100000,
    equity: 32100000,
    liabilities: 24600000,
  },
  pintaras: {
    registrationNumber: "198901005732 (182038-D)",
    incorporated: "23 May 1989",
    address: "Petaling Jaya, Selangor",
    email: "enquiry@pintaras.com.my",
    phone: "+603 7955 1188",
    employees: "215",
    averageRevenue: 132000000,
    averageNetProfit: 8700000,
    equity: 68400000,
    liabilities: 51200000,
  },
};

const money = (value: number) =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function Home() {
  const [contractorRows, setContractorRows] = useState(initialContractors);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [tradeFilter, setTradeFilter] = useState("All trades");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [activeContractor, setActiveContractor] = useState(initialContractors[0]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([
    initialContractors[0].id,
  ]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    initialContractors[0].projects[0].id,
  ]);
  const [activeSection, setActiveSection] = useState<"overview" | "contractors" | "preq" | "nominations" | "imports" | "reports" | "settings">("contractors");
  const [showProjectPanel, setShowProjectPanel] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [editingPreqOwner, setEditingPreqOwner] = useState<Contractor | null>(null);
  const [showReportRequest, setShowReportRequest] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState("");
  const [profileTab, setProfileTab] = useState<"overview" | "preq" | "projects" | "documents" | "activity">("overview");
  const [uploadedFile, setUploadedFile] = useState("");
  const [projectQuery, setProjectQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return contractorRows.filter((contractor) => {
      const matchesSearch =
        !term ||
        contractor.name.toLowerCase().includes(term) ||
        contractor.trade.toLowerCase().includes(term) ||
        contractor.location.toLowerCase().includes(term) ||
        contractor.contactName.toLowerCase().includes(term) ||
        contractor.email.toLowerCase().includes(term) ||
        contractor.mobile.includes(term) ||
        contractor.officePhone.includes(term);
      const matchesStatus =
        statusFilter === "All status" || contractor.status === statusFilter;
      const matchesTrade = tradeFilter === "All trades" || contractor.trade === tradeFilter;
      const matchesLocation = locationFilter === "All locations" || contractor.location === locationFilter;
      return matchesSearch && matchesStatus && matchesTrade && matchesLocation;
    });
  }, [contractorRows, locationFilter, query, statusFilter, tradeFilter]);

  const chosenProjectRecords = contractorRows.flatMap((contractor) =>
    contractor.projects
      .filter((project) => selectedProjects.includes(project.id))
      .map((project) => ({ ...project, contractor: contractor.name })),
  );

  const activeDetails = contractorDetails[activeContractor.id] ?? {
    registrationNumber: "Pending verification",
    incorporated: "Pending verification",
    address: activeContractor.location,
    email: "Pending verification",
    phone: "Pending verification",
    employees: "—",
    averageRevenue: 0,
    averageNetProfit: 0,
    equity: 0,
    liabilities: 0,
  };
  const completedProjects = activeContractor.projects.filter((project) => project.status === "Completed");
  const ongoingProjects = activeContractor.projects.filter((project) => project.status === "Ongoing");
  const projectSearchTerm = projectQuery.toLowerCase().trim();
  const projectMatchesSearch = (project: Project) => !projectSearchTerm || [project.name, project.scope, project.client, project.location, project.period, project.status, project.progress ?? "", String(project.value)].join(" ").toLowerCase().includes(projectSearchTerm);
  const filteredCompletedProjects = completedProjects.filter(projectMatchesSearch);
  const filteredOngoingProjects = ongoingProjects.filter(projectMatchesSearch);

  const sectionTitles = {
    overview: "Overview",
    contractors: "Contractor directory",
    preq: "Pre-Q reviews",
    nominations: "Nominations",
    imports: "Document imports",
    reports: "Reports",
    settings: "Settings",
  } as const;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function downloadFile(fileName: string, content: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
    notify(`${fileName} downloaded.`);
  }

  function exportContractorCsv() {
    const rows = contractorRows.map((contractor) => [contractor.name, contractor.trade, contractor.grade, contractor.location, contractor.score, contractor.status, contractor.projects.length]);
    const csv = [["Contractor", "Trade", "CIDB Grade", "Location", "Pre-Q Score", "Status", "Projects"], ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    downloadFile("berinda-contractor-directory.csv", csv, "text/csv;charset=utf-8");
  }

  function exportNominationWord() {
    const projectRows = chosenProjectRecords.map((project) => `<tr><td>${project.contractor}</td><td>${project.name}</td><td>${project.scope}</td><td>${project.client}</td><td>${project.location}</td><td>${money(project.value)}</td></tr>`).join("");
    const html = `<html><body><h1>Contractor Nomination Summary</h1><p>Prepared from the Berinda Contractor Hub demonstration.</p><table border="1" cellspacing="0" cellpadding="6"><tr><th>Contractor</th><th>Project</th><th>Scope</th><th>Client</th><th>Location</th><th>Value</th></tr>${projectRows}</table></body></html>`;
    downloadFile("contractor-nomination-summary.doc", html, "application/msword");
  }

  function handleAddContractor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) return;
    const contractor: Contractor = {
      id: `demo-${Date.now()}`,
      initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      name,
      trade: String(form.get("trade")),
      contactName: String(form.get("contactName")),
      mobile: String(form.get("mobile")),
      officePhone: String(form.get("officePhone")),
      email: String(form.get("email")),
      grade: String(form.get("grade")),
      location: String(form.get("location")),
      score: Number(form.get("score")),
      status: Number(form.get("score")) >= 65 ? "Approved" : "Review due",
      expiry: "Not assessed",
      updated: "Just now",
      preqDoneBy: "Not assigned",
      preqDate: String(form.get("preqDate")),
      approvalDate: String(form.get("approvalDate")) || "Pending",
      projects: [],
    };
    setContractorRows((current) => [contractor, ...current]);
    setActiveContractor(contractor);
    setShowAddContractor(false);
    setShowProjectPanel(true);
    setProfileTab("overview");
    setShowProfile(true);
    notify(`${name} profile created. You can now import its completed and ongoing project list.`);
  }

  function handleAddProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const project: Project = {
      id: `project-${Date.now()}`,
      name: String(form.get("name")),
      scope: String(form.get("scope")),
      client: String(form.get("client")),
      location: String(form.get("location")),
      value: Number(form.get("value")),
      period: String(form.get("period")),
      status: String(form.get("status")) as Project["status"],
    };
    const updatedContractor = { ...activeContractor, projects: [project, ...activeContractor.projects], updated: "Just now" };
    setActiveContractor(updatedContractor);
    setContractorRows((current) => current.map((contractor) => contractor.id === activeContractor.id ? updatedContractor : contractor));
    setShowAddProject(false);
    notify("Project added to this demonstration session.");
  }

  function handleAssessment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const score = ["organisation", "technical", "financial", "experience", "quality"].reduce((total, field) => total + Number(form.get(field)), 0);
    const preqDoneBy = String(form.get("preqDoneBy") ?? activeContractor.preqDoneBy);
    const updatedContractor: Contractor = { ...activeContractor, score, preqDoneBy, status: score >= 65 ? "Approved" : "Conditional", expiry: "31 Jul 2027", updated: "Just now" };
    setActiveContractor(updatedContractor);
    setContractorRows((current) => current.map((contractor) => contractor.id === activeContractor.id ? updatedContractor : contractor));
    setShowAssessmentForm(false);
    notify(`Pre-Q assessment by ${preqDoneBy} saved with a score of ${score}/100.`);
  }

  function handlePreqOwnerUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingPreqOwner) return;
    const form = new FormData(event.currentTarget);
    const preqDoneBy = String(form.get("preqDoneBy") ?? editingPreqOwner.preqDoneBy);
    const updatedContractor = { ...editingPreqOwner, preqDoneBy, updated: "Just now" };
    setContractorRows((current) => current.map((contractor) => contractor.id === editingPreqOwner.id ? updatedContractor : contractor));
    if (activeContractor.id === editingPreqOwner.id) setActiveContractor(updatedContractor);
    setEditingPreqOwner(null);
    notify(`Pre-Q company updated to ${preqDoneBy}.`);
  }

  function handleEditProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updatedContractor = { ...activeContractor, name: String(form.get("name")), trade: String(form.get("trade")), contactName: String(form.get("contactName")), mobile: String(form.get("mobile")), officePhone: String(form.get("officePhone")), email: String(form.get("email")), grade: String(form.get("grade")), location: String(form.get("location")), updated: "Just now" };
    setActiveContractor(updatedContractor);
    setContractorRows((current) => current.map((contractor) => contractor.id === activeContractor.id ? updatedContractor : contractor));
    setShowEditProfile(false);
    notify("Contractor profile updated for this demonstration session.");
  }

  function toggleContractor(contractor: Contractor) {
    setActiveContractor(contractor);
    setSelectedContractors((current) =>
      current.includes(contractor.id)
        ? current.filter((id) => id !== contractor.id)
        : [...current, contractor.id],
    );
  }

  function toggleProject(id: string) {
    setSelectedProjects((current) =>
      current.includes(id)
        ? current.filter((projectId) => projectId !== id)
        : [...current, id],
    );
  }

  function renderProjectCard(project: Project) {
    const selected = selectedProjects.includes(project.id);
    return (
      <article key={project.id} className={selected ? "selected-project" : ""}>
        <button className={`project-check ${selected ? "checked" : ""}`} onClick={() => toggleProject(project.id)} aria-label={`${selected ? "Remove" : "Select"} ${project.name}`}>{selected ? "✓" : ""}</button>
        <div className="project-content">
          <div className="project-title"><strong>{project.name}</strong><span className={project.status === "Completed" ? "completed" : "ongoing"}>{project.status}</span></div>
          <p>{project.scope}</p>
          <dl><div><dt>CLIENT</dt><dd>{project.client}</dd></div><div><dt>LOCATION</dt><dd>{project.location}</dd></div><div><dt>CONTRACT VALUE</dt><dd>{money(project.value)}</dd></div><div><dt>PERIOD</dt><dd>{project.period}</dd></div>{project.progress && <div><dt>PROGRESS</dt><dd>{project.progress}</dd></div>}{project.sourcePage && <div><dt>SOURCE</dt><dd>Submitted list · page {project.sourcePage}</dd></div>}</dl>
        </div>
      </article>
    );
  }

  function renderProfileProjectRows(projects: Project[]) {
    return projects.map((project) => (
      <div className="profile-project-row" key={project.id}>
        <span><strong>{project.name}</strong><small>{project.scope}</small></span>
        <span>{project.client}<small>{project.location}</small></span>
        <span><strong>{money(project.value)}</strong></span>
        <span>{project.period}</span>
        <span><b className={project.status === "Completed" ? "completed" : "ongoing"}>{project.status}</b>{project.progress && <small>{project.progress} complete</small>}</span>
      </div>
    ));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BERINDA</strong>
            <span>Contractor Hub</span>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <button className={`nav-item ${activeSection === "overview" ? "active" : ""}`} onClick={() => setActiveSection("overview")}><span>⌂</span>Overview</button>
          <button className={`nav-item ${activeSection === "contractors" ? "active" : ""}`} onClick={() => setActiveSection("contractors")}><span>▦</span>Contractors <b>{contractorRows.length}</b></button>
          <button className={`nav-item ${activeSection === "preq" ? "active" : ""}`} onClick={() => setActiveSection("preq")}><span>◫</span>Pre-Q reviews <b className="amber">9</b></button>
          <button className={`nav-item ${activeSection === "nominations" ? "active" : ""}`} onClick={() => setActiveSection("nominations")}><span>▤</span>Nominations</button>
          <button className={`nav-item ${activeSection === "imports" ? "active" : ""}`} onClick={() => setActiveSection("imports")}><span>⇧</span>Imports</button>
          <button className={`nav-item ${activeSection === "reports" ? "active" : ""}`} onClick={() => setActiveSection("reports")}><span>◉</span>Reports</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-note">
            <span>♢</span>
            <div><strong>Private group workspace</strong><small>Company access controls active</small></div>
          </div>
          <button className={`nav-item ${activeSection === "settings" ? "active" : ""}`} onClick={() => setActiveSection("settings")}><span>⚙</span>Settings</button>
          <div className="user-card">
            <div className="avatar">KW</div>
            <div><strong>Kasper Wong</strong><span>Berinda Group</span></div>
            <button aria-label="Open user menu" onClick={() => notify("Signed in as Kasper Wong · Berinda Group administrator.")}>•••</button>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">GROUP CONTRACTOR INTELLIGENCE</p>
            <h1>{sectionTitles[activeSection]}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications" onClick={() => setNotificationsOpen((current) => !current)}>♧<i>3</i></button>
            <button className="secondary-button" onClick={() => setShowUpload(true)}>⇧ Upload documents</button>
            <button className="primary-button" onClick={() => setShowAddContractor(true)}>＋ Add contractor</button>
          </div>
          {notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><button onClick={() => { setActiveSection("preq"); setNotificationsOpen(false); }}>9 Pre-Q reviews require attention</button><button onClick={() => { setActiveSection("contractors"); setStatusFilter("Review due"); setNotificationsOpen(false); }}>3 contractor records expire soon</button><button onClick={() => { setActiveSection("imports"); setNotificationsOpen(false); }}>1 document extraction is ready</button></div>}
        </header>

        {activeSection === "contractors" ? <>

        <section className="metrics" aria-label="Contractor statistics">
          <article><span className="metric-icon teal">✓</span><div><small>Approved contractors</small><strong>96</strong><em>75% of directory</em></div></article>
          <article><span className="metric-icon blue">◫</span><div><small>Under review</small><strong>14</strong><em>5 awaiting documents</em></div></article>
          <article><span className="metric-icon amber-bg">!</span><div><small>Expiring in 90 days</small><strong>9</strong><em>Action required</em></div></article>
          <article><span className="metric-icon purple">▥</span><div><small>Project records</small><strong>1,842</strong><em>Across all companies</em></div></article>
        </section>

        <section className="workspace-card">
          <div className="workspace-heading">
            <div>
              <h2>Find qualified contractors</h2>
              <p>Compare group-approved contractors and select verified projects for nomination.</p>
            </div>
            <span className="demo-badge">FRAME • SAMPLE DATA</span>
          </div>

          <div className="filters">
            <label className="search-box">
              <span>⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, trade or location..." />
              <kbd>⌘ K</kbd>
            </label>
            <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All status</option><option>Approved</option><option>Conditional</option><option>Review due</option>
            </select>
            <select aria-label="Filter by trade" value={tradeFilter} onChange={(event) => setTradeFilter(event.target.value)}><option>All trades</option><option>Piling & foundation</option><option>Building works</option></select>
            <select aria-label="Filter by location" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}><option>All locations</option><option>Johor</option><option>Selangor</option><option>Kuala Lumpur</option></select>
          </div>

          <div className={`data-layout ${showProjectPanel ? "" : "panel-hidden"}`}>
            <div className="table-wrap">
              <table>
                <thead><tr><th><span className="fake-check" /></th><th>Contractor / Trade</th><th>Contact person</th><th>Phone / Email</th><th>Pre-Q status</th><th>Pre-Q date</th><th>Score</th><th>Approval date</th><th>Grade</th><th>Completed projects</th><th>Ongoing projects</th><th>Pre-Q done by</th><th>Updated</th><th /></tr></thead>
                <tbody>
                  {filtered.map((contractor) => {
                    const isSelected = selectedContractors.includes(contractor.id);
                    const isActive = activeContractor.id === contractor.id;
                    return (
                      <tr key={contractor.id} className={isActive ? "active-row" : ""} onClick={() => setActiveContractor(contractor)}>
                        <td><button aria-label={`${isSelected ? "Deselect" : "Select"} ${contractor.name}`} className={`row-check ${isSelected ? "checked" : ""}`} onClick={(event) => { event.stopPropagation(); toggleContractor(contractor); }}>{isSelected ? "✓" : ""}</button></td>
                        <td><div className="contractor-cell"><span>{contractor.initials}</span><div><strong>{contractor.name}</strong><small>{contractor.trade} · {contractor.location}</small></div></div></td>
                        <td><div className="directory-detail"><strong>{contractor.contactName}</strong><small>{contractor.mobile}</small></div></td>
                        <td><div className="directory-detail"><strong>{contractor.officePhone}</strong><small>{contractor.email}</small></div></td>
                        <td><span className={`status ${contractor.status.toLowerCase().replace(" ", "-")}`}><i />{contractor.status}</span><small className="expiry">Until {contractor.expiry}</small></td>
                        <td><span className="directory-date">{contractor.preqDate}</span></td>
                        <td><div className="score"><strong>{contractor.score}</strong><span><i style={{ width: `${contractor.score}%` }} /></span></div></td>
                        <td><span className="directory-date">{contractor.approvalDate}</span></td>
                        <td><span className="grade">CIDB {contractor.grade}</span></td>
                        <td><button className="project-link project-count" onClick={(event) => { event.stopPropagation(); setActiveContractor(contractor); setShowProjectPanel(true); }}>{contractor.projects.filter((project) => project.status === "Completed").length} completed →</button></td>
                        <td><button className="project-link project-count ongoing" onClick={(event) => { event.stopPropagation(); setActiveContractor(contractor); setShowProjectPanel(true); }}>{contractor.projects.filter((project) => project.status === "Ongoing").length} ongoing →</button></td>
                        <td><button className="preq-owner-button" onClick={(event) => { event.stopPropagation(); setEditingPreqOwner(contractor); }}><strong>{contractor.preqDoneBy}</strong><span>Edit company</span></button></td>
                        <td><small className="updated">{contractor.updated}</small></td>
                        <td><div className="directory-actions"><button onClick={(event) => { event.stopPropagation(); setActiveContractor(contractor); setShowProjectPanel(true); }}>Open projects</button><button onClick={(event) => { event.stopPropagation(); setActiveContractor(contractor); setShowReportRequest(true); }}>Request report</button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state"><strong>No contractors found</strong><span>Try changing your filters.</span></div>}
              <footer className="table-footer"><span>Showing {filtered.length} of {contractorRows.length} demonstration contractors · Page {currentPage}</span><div><button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>‹</button>{[1, 2, 3].map((page) => <button key={page} className={currentPage === page ? "page-active" : ""} onClick={() => { setCurrentPage(page); notify(`Demonstration page ${page} selected.`); }}>{page}</button>)}<button onClick={() => notify("Additional pages will load from Firebase after connection.")}>…</button><button onClick={() => { setCurrentPage(13); notify("Demonstration page 13 selected."); }} className={currentPage === 13 ? "page-active" : ""}>13</button><button disabled={currentPage === 13} onClick={() => setCurrentPage((page) => Math.min(13, page + 1))}>›</button></div></footer>
            </div>

            {showProjectPanel && <aside className="project-panel">
              <div className="panel-head">
                <div><span className="panel-logo">{activeContractor.initials}</span><div><small>RELEVANT PROJECTS</small><h3>{activeContractor.name}</h3></div></div>
                <button aria-label="Close project panel" onClick={() => setShowProjectPanel(false)}>×</button>
              </div>
              <div className="panel-meta"><span>{activeContractor.trade}</span><span>CIDB {activeContractor.grade}</span><span>{activeContractor.projects.length} records</span></div>
              <div className="panel-instruction"><span>✓</span><p><strong>Select the most relevant experience</strong>Chosen projects will appear in the nomination summary.</p></div>
              <label className="project-search"><span>⌕</span><input value={projectQuery} onChange={(event) => setProjectQuery(event.target.value)} placeholder="Search scope, client, location, year or value..." aria-label="Search contractor projects" />{projectQuery && <button type="button" onClick={() => setProjectQuery("")}>Clear</button>}</label>
              <div className="projects-list">
                <section className="project-group completed-group">
                  <div className="project-group-heading"><span>✓</span><h4>Completed projects</h4><b>{completedProjects.length}</b></div>
                  <div className="project-group-items">{filteredCompletedProjects.length ? filteredCompletedProjects.map(renderProjectCard) : <p className="no-projects">No completed projects match this search.</p>}</div>
                </section>
                <section className="project-group ongoing-group">
                  <div className="project-group-heading"><span>↻</span><h4>Ongoing projects</h4><b>{ongoingProjects.length}</b></div>
                  <div className="project-group-items">{filteredOngoingProjects.length ? filteredOngoingProjects.map(renderProjectCard) : <p className="no-projects">No ongoing projects match this search.</p>}</div>
                </section>
              </div>
              <div className="panel-actions"><button className="view-profile" onClick={() => { setProfileTab("overview"); setShowProfile(true); }}>View contractor profile →</button><button className="request-report-button" onClick={() => setShowReportRequest(true)}>Request full detail report</button></div>
            </aside>}
          </div>
        </section>
        </> : (
          <section className="module-screen">
            {activeSection === "overview" && <>
              <div className="module-hero"><div><p className="eyebrow">GROUP WORKSPACE</p><h2>Good afternoon, Kasper</h2><p>Here is the latest contractor and Pre-Q activity across the group.</p></div><button className="primary-button" onClick={() => setActiveSection("contractors")}>Open contractor directory →</button></div>
              <div className="module-stat-grid"><article><small>APPROVED CONTRACTORS</small><strong>{contractorRows.filter((item) => item.status === "Approved").length}</strong><span>Demonstration records</span></article><article><small>REVIEWS REQUIRING ACTION</small><strong>9</strong><span>3 expire within 90 days</span></article><article><small>ACTIVE NOMINATIONS</small><strong>4</strong><span>2 awaiting reviewer decision</span></article><article><small>DOCUMENT IMPORTS</small><strong>12</strong><span>1 requires field review</span></article></div>
              <div className="module-grid"><section><div className="module-heading"><h3>Recent group activity</h3><button onClick={() => setActiveSection("reports")}>View reports</button></div><div className="simple-list">{["Chuan Luck Pre-Q assessment approved", "AJC Ventures project list imported", "Piling contractor nomination created", "CIDB certificate expiry reminder issued"].map((item, index) => <article key={item}><span>{index + 1}</span><strong>{item}</strong><small>{index + 1} day{index ? "s" : ""} ago</small></article>)}</div></section><section><div className="module-heading"><h3>Quick actions</h3></div><div className="quick-actions"><button onClick={() => setShowAddContractor(true)}>＋ Add contractor</button><button onClick={() => setShowUpload(true)}>⇧ Import project list</button><button onClick={() => setActiveSection("preq")}>◫ Review Pre-Q</button><button onClick={() => setShowSummary(true)}>▤ Prepare nomination</button></div></section></div>
            </>}

            {activeSection === "preq" && <>
              <div className="module-hero"><div><p className="eyebrow">REVIEW QUEUE</p><h2>Pre-qualification reviews</h2><p>Open an assessment, check its scoring and record a demonstration decision.</p></div><button className="primary-button" onClick={() => { setActiveContractor(contractorRows[0]); setShowAssessmentForm(true); }}>Start assessment</button></div>
              <div className="workflow-table"><div className="workflow-row header"><span>Contractor</span><span>Trade</span><span>Submitted</span><span>Status</span><span>Action</span></div>{contractorRows.slice(0, 4).map((contractor, index) => <div className="workflow-row" key={contractor.id}><span><strong>{contractor.name}</strong><small>CIDB {contractor.grade}</small></span><span>{contractor.trade}</span><span>{index + 12} Jul 2026</span><span><b className={index === 0 ? "attention" : "neutral"}>{index === 0 ? "Ready for review" : "Documents pending"}</b></span><span><button className="secondary-button" onClick={() => { setActiveContractor(contractor); setShowAssessmentForm(true); }}>Review</button></span></div>)}</div>
            </>}

            {activeSection === "nominations" && <>
              <div className="module-hero"><div><p className="eyebrow">PROCUREMENT WORKFLOW</p><h2>Contractor nominations</h2><p>Prepare, review and export contractor comparison summaries.</p></div><button className="primary-button" onClick={() => setShowSummary(true)}>＋ New nomination</button></div>
              <div className="workflow-table"><div className="workflow-row nomination header"><span>Nomination</span><span>Trade</span><span>Shortlist</span><span>Status</span><span>Action</span></div>{[["Piling works – Project A", "Piling & foundation", "3 contractors", "Draft"], ["Main building works – Phase 2", "Building works", "4 contractors", "Under review"], ["Factory extension", "Building works", "2 contractors", "Approved"]].map(([title, trade, count, status]) => <div className="workflow-row nomination" key={title}><span><strong>{title}</strong><small>Updated this month</small></span><span>{trade}</span><span>{count}</span><span><b className="neutral">{status}</b></span><span><button className="secondary-button" onClick={() => setShowSummary(true)}>Open</button></span></div>)}</div>
            </>}

            {activeSection === "imports" && <>
              <div className="module-hero"><div><p className="eyebrow">AI-ASSISTED EXTRACTION</p><h2>Document imports</h2><p>Upload project lists and inspect extraction status before records are published.</p></div><button className="primary-button" onClick={() => setShowUpload(true)}>⇧ Upload document</button></div>
              <div className="workflow-table"><div className="workflow-row import header"><span>File</span><span>Contractor</span><span>Rows found</span><span>Status</span><span>Action</span></div>{[["Completed and ongoing.pdf", "Chuan Luck Piling", "96", "Review ready"], ["AJC Pre-Q Form.pdf", "AJC Ventures", "—", "Completed"], ["Project list.xlsx", "GDB Geotechnics", "24", "Processing"]].map(([file, contractor, rows, status]) => <div className="workflow-row import" key={file}><span><strong>{file}</strong><small>PDF / Excel import</small></span><span>{contractor}</span><span>{rows}</span><span><b className={status === "Review ready" ? "attention" : "neutral"}>{status}</b></span><span><button className="secondary-button" onClick={() => notify(status === "Review ready" ? "Extraction review opened in demonstration mode." : `Import status: ${status}.`)}>{status === "Review ready" ? "Review" : "Details"}</button></span></div>)}</div>
            </>}

            {activeSection === "reports" && <>
              <div className="module-hero"><div><p className="eyebrow">MANAGEMENT REPORTING</p><h2>Reports and exports</h2><p>Download current demonstration data or review status distribution.</p></div><button className="primary-button" onClick={exportContractorCsv}>Download contractor CSV</button></div>
              <div className="report-grid"><article><h3>Pre-Q status distribution</h3><div className="report-bars">{[["Approved", 75], ["Conditional", 14], ["Review due", 11]].map(([label, value]) => <div key={String(label)}><span>{label}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div>)}</div></article><article><h3>Available reports</h3><div className="report-actions"><button onClick={exportContractorCsv}>Contractor directory <span>CSV ↓</span></button><button onClick={() => downloadFile("preq-expiry-report.csv", "Contractor,Expiry,Status\nChuan Luck,30 Jun 2027,Approved\nAJC Ventures,18 Mar 2027,Approved", "text/csv")}>Pre-Q expiry report <span>CSV ↓</span></button><button onClick={exportNominationWord}>Nomination summary <span>Word ↓</span></button></div></article></div>
            </>}

            {activeSection === "settings" && <>
              <div className="module-hero"><div><p className="eyebrow">PROTOTYPE SETTINGS</p><h2>Companies and access roles</h2><p>Review the planned role structure before company login and Firebase are connected.</p></div><button className="primary-button" onClick={() => notify("Demonstration settings saved for this session.")}>Save preferences</button></div>
              <div className="settings-grid"><section><div className="module-heading"><h3>Pilot companies</h3></div><label>Group name<input defaultValue="Berinda Group" /></label><label>First pilot company<input defaultValue="Johor Land Berhad" /></label><label>Second pilot company<input placeholder="Enter subsidiary name" /></label></section><section><div className="module-heading"><h3>Access roles</h3></div>{[["Group administrator", "All companies and settings"], ["Company administrator", "Own company submissions"], ["Pre-Q reviewer", "Assessments and decisions"], ["Project user", "Search and nominations"], ["Viewer", "Approved records only"]].map(([role, access]) => <div className="role-row" key={role}><strong>{role}</strong><span>{access}</span><button onClick={() => notify(`${role} permissions displayed.`)}>View</button></div>)}</section></div>
            </>}
          </section>
        )}
      </main>

      {(activeSection === "contractors" || activeSection === "nominations") && <div className="selection-bar">
        <div><span className="selection-icon">▤</span><p><strong>{selectedContractors.length} contractor{selectedContractors.length === 1 ? "" : "s"} selected</strong><small>{selectedProjects.length} relevant project{selectedProjects.length === 1 ? "" : "s"} included</small></p></div>
        <button className="clear-button" onClick={() => { setSelectedContractors([]); setSelectedProjects([]); }}>Clear selection</button>
        <button className="primary-button" disabled={!selectedContractors.length} onClick={() => setShowSummary(true)}>Generate nomination summary <span>→</span></button>
      </div>}

      {showProfile && (
        <div className="profile-backdrop" role="presentation" onMouseDown={() => setShowProfile(false)}>
          <section className="profile-screen" role="dialog" aria-modal="true" aria-labelledby="profile-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="profile-header">
              <div className="profile-identity">
                <span className="profile-logo">{activeContractor.initials}</span>
                <div>
                  <p className="eyebrow">CONTRACTOR PROFILE</p>
                  <h2 id="profile-title">{activeContractor.name}</h2>
                  <p>{activeContractor.trade} · {activeContractor.location} · CIDB {activeContractor.grade}</p>
                </div>
              </div>
              <div className="profile-header-actions">
                <span className={`profile-status ${activeContractor.status.toLowerCase().replace(" ", "-")}`}>● {activeContractor.status}</span>
                <button className="secondary-button" onClick={() => setShowEditProfile(true)}>Edit profile</button>
                <button className="profile-close" onClick={() => setShowProfile(false)} aria-label="Close contractor profile">×</button>
              </div>
            </header>

            <div className="profile-summary-strip">
              <div><small>PRE-Q SCORE</small><strong>{activeContractor.score}<span>/100</span></strong></div>
              <div><small>VALID UNTIL</small><strong>{activeContractor.expiry}</strong></div>
              <div><small>CIDB GRADE</small><strong>{activeContractor.grade}</strong></div>
              <div><small>VERIFIED PROJECTS</small><strong>{activeContractor.projects.length}</strong></div>
              <div><small>COMBINED PROJECT VALUE</small><strong>{money(activeContractor.projects.reduce((total, project) => total + project.value, 0))}</strong></div>
              <div><small>PRE-Q DONE BY</small><strong className="preq-summary-owner">{activeContractor.preqDoneBy}</strong></div>
            </div>

            <nav className="profile-tabs" aria-label="Contractor profile sections">
              {([
                ["overview", "Overview"],
                ["preq", "Pre-Q assessment"],
                ["projects", `Projects (${activeContractor.projects.length})`],
                ["documents", "Documents (5)"],
                ["activity", "Activity"],
              ] as const).map(([tab, label]) => (
                <button key={tab} className={profileTab === tab ? "active" : ""} onClick={() => setProfileTab(tab)}>{label}</button>
              ))}
            </nav>

            <div className="profile-body">
              {profileTab === "overview" && (
                <div className="profile-overview-grid">
                  <section className="profile-card company-card">
                    <div className="card-heading"><div><p className="eyebrow">COMPANY INFORMATION</p><h3>Registration and contact</h3></div><span>Verified</span></div>
                    <dl className="detail-grid">
                      <div><dt>Legal company name</dt><dd>{activeContractor.name}</dd></div>
                      <div><dt>SSM registration</dt><dd>{activeDetails.registrationNumber}</dd></div>
                      <div><dt>Date incorporated</dt><dd>{activeDetails.incorporated}</dd></div>
                      <div><dt>Number of employees</dt><dd>{activeDetails.employees}</dd></div>
                      <div className="wide"><dt>Registered address</dt><dd>{activeDetails.address}</dd></div>
                      <div><dt>Contact person</dt><dd>{activeContractor.contactName}</dd></div>
                      <div><dt>Mobile number</dt><dd>{activeContractor.mobile}</dd></div>
                      <div><dt>Office number</dt><dd>{activeContractor.officePhone}</dd></div>
                      <div><dt>Email address</dt><dd>{activeContractor.email}</dd></div>
                    </dl>
                  </section>

                  <section className="profile-card preq-card">
                    <div className="card-heading"><div><p className="eyebrow">LATEST ASSESSMENT</p><h3>Pre-qualification result</h3></div><span className="score-pill">{activeContractor.score}%</span></div>
                    <div className="score-ring" style={{ "--score": `${activeContractor.score * 3.6}deg` } as React.CSSProperties}><div><strong>{activeContractor.score}</strong><span>out of 100</span></div></div>
                    <div className="preq-mini"><div><span>Required passing score</span><strong>65%</strong></div><div><span>Review decision</span><strong className="positive">{activeContractor.status}</strong></div><div><span>Assessment date</span><strong>{activeContractor.preqDate}</strong></div><div><span>Approval date</span><strong>{activeContractor.approvalDate}</strong></div></div>
                    <button className="secondary-button full-width" onClick={() => setProfileTab("preq")}>View scoring breakdown</button>
                  </section>

                  <section className="profile-card financial-card">
                    <div className="card-heading"><div><p className="eyebrow">FINANCIAL CAPACITY</p><h3>Three-year average</h3></div><span>Reviewed</span></div>
                    <div className="financial-grid"><div><small>REVENUE</small><strong>{money(activeDetails.averageRevenue)}</strong></div><div><small>NET PROFIT</small><strong>{money(activeDetails.averageNetProfit)}</strong></div><div><small>EQUITY</small><strong>{money(activeDetails.equity)}</strong></div><div><small>LIABILITIES</small><strong>{money(activeDetails.liabilities)}</strong></div></div>
                    <div className="review-note"><span>✓</span><p><strong>Satisfactory financial position</strong>Reviewed against the latest submitted audited accounts.</p></div>
                  </section>

                  <section className="profile-card experience-card">
                    <div className="card-heading"><div><p className="eyebrow">PROJECT EXPERIENCE</p><h3>Recent relevant work</h3></div><div className="card-heading-actions"><button onClick={() => setShowUpload(true)}>Import list</button><button onClick={() => setProfileTab("projects")}>View all →</button></div></div>
                    <div className="experience-list">{activeContractor.projects.slice(0, 3).map((project) => <article key={project.id}><span className={project.status === "Completed" ? "complete-dot" : "ongoing-dot"} /><div><strong>{project.name}</strong><p>{project.client} · {project.location}</p></div><div><strong>{money(project.value)}</strong><p>{project.period}</p></div></article>)}</div>
                  </section>
                </div>
              )}

              {profileTab === "preq" && (
                <div className="profile-single-column">
                  <section className="profile-card assessment-card">
                    <div className="assessment-title"><div><p className="eyebrow">PRE-Q ASSESSMENT · VERSION 2026.1</p><h3>Detailed scoring breakdown</h3><p>Proposed contract value: RM1 million–RM20 million · Passing score: 65%</p></div><div><strong>{activeContractor.score}</strong><span>TOTAL SCORE</span></div></div>
                    <div className="assessment-rows">
                      {[["Organisation", 15], ["Technical capability", 25], ["Financial capability", 20], ["Work experience", 25], ["Quality and workload", 15]].map(([name, maximum]) => { const achieved = Math.round(Number(maximum) * activeContractor.score / 100); return <div key={String(name)}><div><strong>{name}</strong><span>{achieved} / {maximum}</span></div><div className="assessment-track"><i style={{ width: `${(achieved / Number(maximum)) * 100}%` }} /></div></div>; })}
                    </div>
                    <div className="assessment-decision"><span>✓</span><div><strong>Recommended for {activeContractor.status.toLowerCase()} listing</strong><p>Assessment exceeds the required passing score. Supporting financial and project documents were reviewed.</p></div><button className="secondary-button" onClick={() => setShowAssessmentForm(true)}>Open assessment form</button></div>
                  </section>
                </div>
              )}

              {profileTab === "projects" && (
                <div className="profile-single-column">
                  <section className="profile-card profile-projects-card">
                    <div className="card-heading"><div><p className="eyebrow">VERIFIED EXPERIENCE</p><h3>Relevant project portfolio</h3></div><div className="card-heading-actions"><button className="secondary-button" onClick={() => setShowUpload(true)}>⇧ Import project list</button><button className="primary-button" onClick={() => setShowAddProject(true)}>＋ Add project</button></div></div>
                    <div className="profile-project-search-row"><label className="project-search profile-search"><span>⌕</span><input value={projectQuery} onChange={(event) => setProjectQuery(event.target.value)} placeholder="Search all project details: scope, client, location, year, value..." aria-label="Search project portfolio" />{projectQuery && <button type="button" onClick={() => setProjectQuery("")}>Clear</button>}</label><small>{filteredCompletedProjects.length + filteredOngoingProjects.length} of {activeContractor.projects.length} projects shown</small></div>
                    <div className="profile-project-groups">
                      <section className="profile-project-group">
                        <div className="profile-project-group-heading"><div><span className="completed-mark">✓</span><div><h4>Completed projects</h4><p>Finished work available as proven experience</p></div></div><b>{completedProjects.length}</b></div>
                        <div className="profile-project-table"><div className="profile-project-row header"><span>Project and full scope</span><span>Client / location</span><span>Value</span><span>Period</span><span>Status</span></div>{filteredCompletedProjects.length ? renderProfileProjectRows(filteredCompletedProjects) : <div className="profile-project-empty">No completed projects match this search.</div>}</div>
                      </section>
                      <section className="profile-project-group">
                        <div className="profile-project-group-heading"><div><span className="ongoing-mark">↻</span><div><h4>Ongoing projects</h4><p>Current commitments and active workload</p></div></div><b>{ongoingProjects.length}</b></div>
                        <div className="profile-project-table"><div className="profile-project-row header"><span>Project and full scope</span><span>Client / location</span><span>Value</span><span>Period</span><span>Status</span></div>{filteredOngoingProjects.length ? renderProfileProjectRows(filteredOngoingProjects) : <div className="profile-project-empty">No ongoing projects match this search.</div>}</div>
                      </section>
                    </div>
                  </section>
                </div>
              )}

              {profileTab === "documents" && (
                <div className="profile-single-column">
                  <section className="profile-card documents-card">
                    <div className="card-heading"><div><p className="eyebrow">SHAREPOINT REFERENCES</p><h3>Contractor documents</h3></div><button className="primary-button" onClick={() => { setShowProfile(false); setShowUpload(true); }}>⇧ Upload document</button></div>
                    <div className="document-list">{[["Pre-Qualification Form 2026.pdf", "Pre-Q form", "18 Mar 2026", "Verified"], ["CIDB Registration Certificate.pdf", "Registration", "30 Jun 2027", "Current"], ["Completed and Ongoing Projects.pdf", "Project list", "12 Mar 2026", "Verified"], ["Audited Financial Statements 2025.pdf", "Financial", "31 Dec 2025", "Restricted"], ["Quality and Safety Policy.pdf", "Quality", "6 Mar 2026", "Current"]].map(([file, type, date, status]) => <article key={file}><span className="file-icon">PDF</span><div><strong>{file}</strong><p>{type} · Updated {date}</p></div><b className={status === "Restricted" ? "restricted" : "current"}>{status}</b><button className="secondary-button" onClick={() => notify(status === "Restricted" ? `Access request submitted for ${file}.` : `${file} is ready to open after SharePoint is connected.`)}>Request / Open</button></article>)}</div>
                    <div className="sharepoint-note"><span>♢</span><p><strong>Documents remain protected in SharePoint</strong>Opening or downloading a restricted file requires SharePoint permission, even when its reference appears here.</p></div>
                  </section>
                </div>
              )}

              {profileTab === "activity" && (
                <div className="profile-single-column">
                  <section className="profile-card activity-card">
                    <div className="card-heading"><div><p className="eyebrow">AUDIT HISTORY</p><h3>Recent activity</h3></div><button className="secondary-button" onClick={() => downloadFile("contractor-activity-history.csv", "Action,Actor,Date\nPre-Q assessment approved,Group Pre-Q Reviewer,18 Mar 2026\nProject experience verified,Contract Executive,16 Mar 2026\nProject list uploaded,Berinda Group,12 Mar 2026", "text/csv")}>Export history</button></div>
                    <div className="activity-list">{[["Pre-Q assessment approved", "Sarah Lim · Group Pre-Q Reviewer", "18 Mar 2026, 4:32 PM"], ["Project experience verified", "Ahmad Faiz · Contract Executive", "16 Mar 2026, 11:20 AM"], ["Project list document uploaded", "Kasper Wong · Berinda Group", "12 Mar 2026, 9:08 AM"], ["Financial review completed", "Finance Review Team", "10 Mar 2026, 2:45 PM"], ["Contractor profile created", "Johor Land Berhad", "2 Mar 2026, 10:15 AM"]].map(([action, actor, time], index) => <article key={action}><span>{index === 0 ? "✓" : "•"}</span><div><strong>{action}</strong><p>{actor}</p></div><time>{time}</time></article>)}</div>
                  </section>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {showAddContractor && (
        <div className="modal-backdrop nested-modal" role="presentation" onMouseDown={() => setShowAddContractor(false)}>
          <form className="modal form-modal" onSubmit={handleAddContractor} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowAddContractor(false)} aria-label="Close">×</button>
            <p className="eyebrow">BASIC CONTRACTOR INFORMATION</p><h2>Create contractor profile</h2><p>After creating the profile, import its project list and review the completed and ongoing projects.</p>
            <div className="form-grid"><label className="wide">Company name<input name="name" required placeholder="Legal company name" /></label><label>Trade<input name="trade" required placeholder="e.g. Landscape" /></label><label>Contact name<input name="contactName" required placeholder="Mr / Ms and name" /></label><label>Mobile / handphone number<input name="mobile" type="tel" required /></label><label>Office number<input name="officePhone" type="tel" required /></label><label className="wide">Email address<input name="email" type="email" required placeholder="company@example.com" /></label><label>Pre-Q date<input name="preqDate" type="date" required /></label><label>Pre-Q score<input name="score" type="number" min="0" max="100" defaultValue="0" required /></label><label>Approval date<input name="approvalDate" type="date" /></label><label>CIDB grade<select name="grade" defaultValue="G7"><option>G7</option><option>G6</option><option>G5</option><option>G4</option><option>Not provided</option></select></label><label>Location<select name="location" defaultValue="Johor"><option>Johor</option><option>Selangor</option><option>Kuala Lumpur</option><option>Other</option></select></label></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAddContractor(false)}>Cancel</button><button className="primary-button" type="submit">Create profile</button></div>
          </form>
        </div>
      )}

      {showEditProfile && (
        <div className="modal-backdrop nested-modal" role="presentation" onMouseDown={() => setShowEditProfile(false)}>
          <form className="modal form-modal" onSubmit={handleEditProfile} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowEditProfile(false)} aria-label="Close">×</button>
            <p className="eyebrow">EDIT CONTRACTOR</p><h2>Profile information</h2>
            <div className="form-grid"><label className="wide">Company name<input name="name" required defaultValue={activeContractor.name} /></label><label>Trade<input name="trade" required defaultValue={activeContractor.trade} /></label><label>Contact name<input name="contactName" required defaultValue={activeContractor.contactName} /></label><label>Mobile number<input name="mobile" required defaultValue={activeContractor.mobile} /></label><label>Office number<input name="officePhone" required defaultValue={activeContractor.officePhone} /></label><label className="wide">Email address<input name="email" type="email" required defaultValue={activeContractor.email} /></label><label>CIDB grade<input name="grade" required defaultValue={activeContractor.grade} /></label><label>Location<input name="location" required defaultValue={activeContractor.location} /></label></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowEditProfile(false)}>Cancel</button><button className="primary-button" type="submit">Save changes</button></div>
          </form>
        </div>
      )}

      {showAddProject && (
        <div className="modal-backdrop nested-modal" role="presentation" onMouseDown={() => setShowAddProject(false)}>
          <form className="modal form-modal project-form-modal" onSubmit={handleAddProject} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowAddProject(false)} aria-label="Close">×</button>
            <p className="eyebrow">RELEVANT EXPERIENCE</p><h2>Add project</h2><p>Add a demonstration project for {activeContractor.name}.</p>
            <div className="form-grid"><label className="wide">Project name<input name="name" required /></label><label className="wide">Scope<textarea name="scope" required rows={3} /></label><label>Client<input name="client" required /></label><label>Location<input name="location" required /></label><label>Contract value (RM)<input name="value" type="number" min="0" required /></label><label>Period<input name="period" placeholder="Jan 2025 – Jul 2026" required /></label><label>Status<select name="status"><option>Completed</option><option>Ongoing</option></select></label></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAddProject(false)}>Cancel</button><button className="primary-button" type="submit">Add project</button></div>
          </form>
        </div>
      )}

      {showAssessmentForm && (
        <div className="modal-backdrop nested-modal" role="presentation" onMouseDown={() => setShowAssessmentForm(false)}>
          <form className="modal form-modal assessment-form-modal" onSubmit={handleAssessment} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowAssessmentForm(false)} aria-label="Close">×</button>
            <p className="eyebrow">PRE-Q SCORING</p><h2>{activeContractor.name}</h2><p>Enter each category score. The maximum total is 100 and the demonstration passing score is 65.</p>
            <label className="assessment-company">Pre-Q done by company<select name="preqDoneBy" defaultValue={activeContractor.preqDoneBy}><option>Berinda Group</option><option>Johor Land Berhad</option><option>Bukit Indah City Sdn Bhd</option><option>Not assigned</option></select><span>Any authorised company in the group may update this assessment record.</span></label>
            <div className="score-form-grid"><label>Organisation <span>Maximum 15</span><input name="organisation" type="number" min="0" max="15" defaultValue="13" required /></label><label>Technical capability <span>Maximum 25</span><input name="technical" type="number" min="0" max="25" defaultValue="21" required /></label><label>Financial capability <span>Maximum 20</span><input name="financial" type="number" min="0" max="20" defaultValue="16" required /></label><label>Work experience <span>Maximum 25</span><input name="experience" type="number" min="0" max="25" defaultValue="22" required /></label><label>Quality and workload <span>Maximum 15</span><input name="quality" type="number" min="0" max="15" defaultValue="10" required /></label></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAssessmentForm(false)}>Cancel</button><button className="primary-button" type="submit">Calculate and save</button></div>
          </form>
        </div>
      )}

      {editingPreqOwner && (
        <div className="modal-backdrop nested-modal" role="presentation" onMouseDown={() => setEditingPreqOwner(null)}>
          <form className="modal form-modal preq-owner-modal" onSubmit={handlePreqOwnerUpdate} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setEditingPreqOwner(null)} aria-label="Close">×</button>
            <p className="eyebrow">SHARED GROUP RECORD</p>
            <h2>Update Pre-Q company</h2>
            <p>Select the group company responsible for the latest Pre-Q assessment of <strong>{editingPreqOwner.name}</strong>.</p>
            <label className="assessment-company">Pre-Q done by company<select name="preqDoneBy" defaultValue={editingPreqOwner.preqDoneBy}><option>Berinda Group</option><option>Johor Land Berhad</option><option>Bukit Indah City Sdn Bhd</option><option>Not assigned</option></select><span>In the final Firebase version, the system will also record the user, date and previous value in the audit history.</span></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditingPreqOwner(null)}>Cancel</button><button className="primary-button" type="submit">Save company</button></div>
          </form>
        </div>
      )}

      {showReportRequest && (
        <div className="modal-backdrop nested-modal" role="presentation" onMouseDown={() => setShowReportRequest(false)}>
          <form className="modal form-modal report-request-modal" onSubmit={(event) => { event.preventDefault(); setShowReportRequest(false); notify(`Full detail report request submitted for ${activeContractor.name}.`); }} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setShowReportRequest(false)} aria-label="Close">×</button>
            <p className="eyebrow">CONTROLLED ACCESS</p><h2>Request full detail report</h2>
            <p>The basic contractor information and project list remain visible to group users. Restricted documents and the full report require approval.</p>
            <div className="request-contractor-card"><span>{activeContractor.initials}</span><div><strong>{activeContractor.name}</strong><small>{activeContractor.trade} · Pre-Q score {activeContractor.score}</small></div></div>
            <div className="form-grid"><label className="wide">Reason for request<select name="reason" required><option>Contractor nomination</option><option>Pre-Q review</option><option>Project tender evaluation</option><option>Audit / compliance review</option></select></label><label className="wide">Additional note<textarea name="note" rows={3} placeholder="Project name or purpose of access" /></label></div>
            <div className="privacy-strip"><span>◇</span><p><strong>Approval-controlled</strong>The request will be sent to the contractor record owner. Opening or downloading restricted files will be logged.</p></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowReportRequest(false)}>Cancel</button><button className="primary-button" type="submit">Submit request</button></div>
          </form>
        </div>
      )}

      {showUpload && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowUpload(false)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="upload-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUpload(false)} aria-label="Close">×</button>
            <span className="modal-symbol">⇧</span><p className="eyebrow">AI-ASSISTED IMPORT</p><h2 id="upload-title">Import project list</h2>
            <p>Upload the project list for <strong>{activeContractor.name}</strong>. The system will separate completed and ongoing projects, then hold the extracted information for review before publishing.</p>
            <label className="dropzone"><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => setUploadedFile(event.target.files?.[0]?.name ?? "")} /><strong>{uploadedFile || "Drop a PDF, Word or Excel file here"}</strong><span>{uploadedFile ? "Ready for extraction review" : "or click to browse · Maximum 50 MB"}</span></label>
            <div className="privacy-strip"><span>♢</span><p><strong>Private processing</strong>In production, files remain in your group SharePoint and only approved users can open them.</p></div>
            <div className="modal-actions"><button className="secondary-button" onClick={() => setShowUpload(false)}>Cancel</button><button className="primary-button" disabled={!uploadedFile} onClick={() => { notify(`${uploadedFile} queued for demonstration extraction.`); setUploadedFile(""); setShowUpload(false); setActiveSection("imports"); }}>Start extraction</button></div>
          </section>
        </div>
      )}

      {showSummary && (
        <div className="modal-backdrop summary-backdrop" role="presentation" onMouseDown={() => setShowSummary(false)}>
          <section className="modal summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSummary(false)} aria-label="Close">×</button>
            <div className="summary-brand"><div className="brand-mark">B</div><span>CONTRACTOR NOMINATION</span></div>
            <p className="eyebrow">DRAFT SUMMARY</p><h2 id="summary-title">Piling contractor comparison</h2><p>Prepared from the group contractor directory · 01 Aug 2026</p>
            <div className="summary-stats"><div><small>SHORTLISTED</small><strong>{selectedContractors.length}</strong></div><div><small>PROJECT REFERENCES</small><strong>{selectedProjects.length}</strong></div><div><small>REVIEW STATUS</small><strong>Draft</strong></div></div>
            <h3>Selected relevant experience</h3>
            <div className="summary-projects">
              {chosenProjectRecords.map((project) => <article key={project.id}><div><strong>{project.contractor}</strong><span>{project.name}</span></div><div><strong>{money(project.value)}</strong><span>{project.location}</span></div></article>)}
              {!chosenProjectRecords.length && <p>No project references selected yet.</p>}
            </div>
            <div className="modal-actions"><button className="secondary-button" onClick={() => setShowSummary(false)}>Back to selection</button><button className="primary-button" onClick={exportNominationWord}>Export Word summary</button></div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}
