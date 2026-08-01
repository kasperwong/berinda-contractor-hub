"use client";

import { useMemo, useState } from "react";

type Project = {
  id: string;
  name: string;
  scope: string;
  client: string;
  location: string;
  value: number;
  period: string;
  status: "Completed" | "Ongoing";
};

type Contractor = {
  id: string;
  initials: string;
  name: string;
  trade: string;
  grade: string;
  location: string;
  score: number;
  status: "Approved" | "Conditional" | "Review due";
  expiry: string;
  updated: string;
  projects: Project[];
};

const contractors: Contractor[] = [
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
    projects: [
      {
        id: "cl-1",
        name: "Proposed industrial development, Senai",
        scope: "Bored piling and pile-cap foundation works",
        client: "AME Construction Sdn Bhd",
        location: "Senai, Johor",
        value: 12800000,
        period: "Jan 2023 – Nov 2023",
        status: "Completed",
      },
      {
        id: "cl-2",
        name: "Residential development at Taman Molek",
        scope: "Supply and installation of reinforced concrete piles",
        client: "Austin Heights Sdn Bhd",
        location: "Johor Bahru, Johor",
        value: 7650000,
        period: "Mar 2024 – Feb 2025",
        status: "Completed",
      },
      {
        id: "cl-3",
        name: "Warehouse and logistics hub",
        scope: "Driven piling, testing and associated foundation works",
        client: "Tiong Nam Logistics",
        location: "Kempas, Johor",
        value: 9400000,
        period: "Sep 2025 – Jul 2026",
        status: "Ongoing",
      },
      {
        id: "cl-4",
        name: "Mixed commercial development",
        scope: "Jack-in piling and static load testing",
        client: "Mah Sing Group Berhad",
        location: "Iskandar Puteri, Johor",
        value: 6200000,
        period: "May 2022 – Feb 2023",
        status: "Completed",
      },
    ],
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

const money = (value: number) =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function Home() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [activeContractor, setActiveContractor] = useState(contractors[0]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([
    contractors[0].id,
  ]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    contractors[0].projects[0].id,
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return contractors.filter((contractor) => {
      const matchesSearch =
        !term ||
        contractor.name.toLowerCase().includes(term) ||
        contractor.trade.toLowerCase().includes(term) ||
        contractor.location.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "All status" || contractor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [query, statusFilter]);

  const chosenProjectRecords = contractors.flatMap((contractor) =>
    contractor.projects
      .filter((project) => selectedProjects.includes(project.id))
      .map((project) => ({ ...project, contractor: contractor.name })),
  );

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
          <button className="nav-item"><span>⌂</span>Overview</button>
          <button className="nav-item active"><span>▦</span>Contractors <b>128</b></button>
          <button className="nav-item"><span>◫</span>Pre-Q reviews <b className="amber">9</b></button>
          <button className="nav-item"><span>▤</span>Nominations</button>
          <button className="nav-item"><span>⇧</span>Imports</button>
          <button className="nav-item"><span>◉</span>Reports</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-note">
            <span>♢</span>
            <div><strong>Private group workspace</strong><small>Company access controls active</small></div>
          </div>
          <button className="nav-item"><span>⚙</span>Settings</button>
          <div className="user-card">
            <div className="avatar">KW</div>
            <div><strong>Kasper Wong</strong><span>Berinda Group</span></div>
            <button aria-label="Open user menu">•••</button>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">GROUP CONTRACTOR INTELLIGENCE</p>
            <h1>Contractor directory</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">♧<i>3</i></button>
            <button className="secondary-button" onClick={() => setShowUpload(true)}>⇧ Upload documents</button>
            <button className="primary-button">＋ Add contractor</button>
          </div>
        </header>

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
            <select aria-label="Filter by trade"><option>All trades</option><option>Piling & foundation</option><option>Building works</option></select>
            <select aria-label="Filter by location"><option>All locations</option><option>Johor</option><option>Selangor</option><option>Kuala Lumpur</option></select>
          </div>

          <div className="data-layout">
            <div className="table-wrap">
              <table>
                <thead><tr><th><span className="fake-check" /></th><th>Contractor</th><th>Pre-Q status</th><th>Score</th><th>Grade</th><th>Relevant projects</th><th>Updated</th><th /></tr></thead>
                <tbody>
                  {filtered.map((contractor) => {
                    const isSelected = selectedContractors.includes(contractor.id);
                    const isActive = activeContractor.id === contractor.id;
                    return (
                      <tr key={contractor.id} className={isActive ? "active-row" : ""} onClick={() => setActiveContractor(contractor)}>
                        <td><button aria-label={`${isSelected ? "Deselect" : "Select"} ${contractor.name}`} className={`row-check ${isSelected ? "checked" : ""}`} onClick={(event) => { event.stopPropagation(); toggleContractor(contractor); }}>{isSelected ? "✓" : ""}</button></td>
                        <td><div className="contractor-cell"><span>{contractor.initials}</span><div><strong>{contractor.name}</strong><small>{contractor.trade} · {contractor.location}</small></div></div></td>
                        <td><span className={`status ${contractor.status.toLowerCase().replace(" ", "-")}`}><i />{contractor.status}</span><small className="expiry">Until {contractor.expiry}</small></td>
                        <td><div className="score"><strong>{contractor.score}</strong><span><i style={{ width: `${contractor.score}%` }} /></span></div></td>
                        <td><span className="grade">CIDB {contractor.grade}</span></td>
                        <td><button className="project-link" onClick={(event) => { event.stopPropagation(); setActiveContractor(contractor); }}>{contractor.projects.length} projects →</button></td>
                        <td><small className="updated">{contractor.updated}</small></td>
                        <td><button className="more" aria-label={`More actions for ${contractor.name}`}>•••</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state"><strong>No contractors found</strong><span>Try changing your filters.</span></div>}
              <footer className="table-footer"><span>Showing {filtered.length} of 128 contractors</span><div><button disabled>‹</button><button className="page-active">1</button><button>2</button><button>3</button><button>…</button><button>13</button><button>›</button></div></footer>
            </div>

            <aside className="project-panel">
              <div className="panel-head">
                <div><span className="panel-logo">{activeContractor.initials}</span><div><small>RELEVANT PROJECTS</small><h3>{activeContractor.name}</h3></div></div>
                <button aria-label="Close project panel">×</button>
              </div>
              <div className="panel-meta"><span>{activeContractor.trade}</span><span>CIDB {activeContractor.grade}</span><span>{activeContractor.projects.length} records</span></div>
              <div className="panel-instruction"><span>✓</span><p><strong>Select the most relevant experience</strong>Chosen projects will appear in the nomination summary.</p></div>
              <div className="projects-list">
                {activeContractor.projects.map((project) => {
                  const selected = selectedProjects.includes(project.id);
                  return (
                    <article key={project.id} className={selected ? "selected-project" : ""}>
                      <button className={`project-check ${selected ? "checked" : ""}`} onClick={() => toggleProject(project.id)} aria-label={`${selected ? "Remove" : "Select"} ${project.name}`}>{selected ? "✓" : ""}</button>
                      <div className="project-content">
                        <div className="project-title"><strong>{project.name}</strong><span className={project.status === "Completed" ? "completed" : "ongoing"}>{project.status}</span></div>
                        <p>{project.scope}</p>
                        <dl><div><dt>CLIENT</dt><dd>{project.client}</dd></div><div><dt>LOCATION</dt><dd>{project.location}</dd></div><div><dt>CONTRACT VALUE</dt><dd>{money(project.value)}</dd></div><div><dt>PERIOD</dt><dd>{project.period}</dd></div></dl>
                      </div>
                    </article>
                  );
                })}
              </div>
              <button className="view-profile">View full contractor profile →</button>
            </aside>
          </div>
        </section>
      </main>

      <div className="selection-bar">
        <div><span className="selection-icon">▤</span><p><strong>{selectedContractors.length} contractor{selectedContractors.length === 1 ? "" : "s"} selected</strong><small>{selectedProjects.length} relevant project{selectedProjects.length === 1 ? "" : "s"} included</small></p></div>
        <button className="clear-button" onClick={() => { setSelectedContractors([]); setSelectedProjects([]); }}>Clear selection</button>
        <button className="primary-button" disabled={!selectedContractors.length} onClick={() => setShowSummary(true)}>Generate nomination summary <span>→</span></button>
      </div>

      {showUpload && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowUpload(false)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="upload-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUpload(false)} aria-label="Close">×</button>
            <span className="modal-symbol">⇧</span><p className="eyebrow">AI-ASSISTED IMPORT</p><h2 id="upload-title">Upload contractor documents</h2>
            <p>Project lists will be extracted into structured records and held for your review before publishing.</p>
            <label className="dropzone"><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => setUploadedFile(event.target.files?.[0]?.name ?? "")} /><strong>{uploadedFile || "Drop a PDF, Word or Excel file here"}</strong><span>{uploadedFile ? "Ready for extraction review" : "or click to browse · Maximum 50 MB"}</span></label>
            <div className="privacy-strip"><span>♢</span><p><strong>Private processing</strong>In production, files remain in your group SharePoint and only approved users can open them.</p></div>
            <div className="modal-actions"><button className="secondary-button" onClick={() => setShowUpload(false)}>Cancel</button><button className="primary-button" disabled={!uploadedFile}>Start extraction</button></div>
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
            <div className="modal-actions"><button className="secondary-button" onClick={() => setShowSummary(false)}>Back to selection</button><button className="primary-button">Export Word summary</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
