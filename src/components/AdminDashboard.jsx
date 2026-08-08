import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Award, Activity, Trash2, Edit2, ShieldAlert, Check, X, 
  ChevronRight, Database, LogOut, Search, Clock
} from "lucide-react";
import { 
  collection, onSnapshot, doc, updateDoc, deleteDoc 
} from "firebase/firestore";
import { db } from "../firebase";

const ADMIN_TOKEN = "GSC_ADMIN_SECRET_2026";
const ADMIN_PASSWORD = "GSC_ADMIN_2026";

export const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [participants, setParticipants] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
    currentClueIndex: 0,
    accumulatedTime: 0
  });
  
  const prevParticipantsRef = useRef({});

  // Auth check
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("INVALID ACCESS KEY");
      setPasswordInput("");
    }
  };

  // Real-time Firestore Listener
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = onSnapshot(collection(db, "participants"), (snapshot) => {
      const list = [];
      const currentPrev = prevParticipantsRef.current;
      const newPrev = {};
      const newLogs = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ id: doc.id, ...data });
        newPrev[doc.id] = { ...data };

        // Generate live activity logs by comparing with previous state
        if (Object.keys(currentPrev).length > 0) {
          const oldData = currentPrev[doc.id];
          if (!oldData) {
            newLogs.push({
              time: new Date().toLocaleTimeString(),
              message: `NEW REGISTER: ${data.rollNo} (${data.name}) joined the hunt in ${data.department}.`,
              type: "register"
            });
          } else {
            if (data.currentClueIndex > oldData.currentClueIndex) {
              newLogs.push({
                time: new Date().toLocaleTimeString(),
                message: `SOLVED: ${data.rollNo} (${data.name}) solved Node ${oldData.currentClueIndex + 1} and advanced to Clue ${data.currentClueIndex + 1}.`,
                type: "solve"
              });
            }
            if (data.endTime && !oldData.endTime) {
              newLogs.push({
                time: new Date().toLocaleTimeString(),
                message: `FINISHED! 🎉 ${data.rollNo} (${data.name}) completed the hunt!`,
                type: "finish"
              });
            }
          }
        }
      });

      // Update refs and lists
      prevParticipantsRef.current = newPrev;
      setParticipants(list);

      if (newLogs.length > 0) {
        setLogs(prev => [...newLogs, ...prev].slice(0, 100)); // Cap logs at 100
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Leaderboard sorting: Clue Index DESC, then Accumulated Time ASC
  const sortedParticipants = [...participants].sort((a, b) => {
    if (b.currentClueIndex !== a.currentClueIndex) {
      return b.currentClueIndex - a.currentClueIndex;
    }
    return (a.accumulatedTime || 0) - (b.accumulatedTime || 0);
  });

  // Filtered list based on search term
  const filteredParticipants = sortedParticipants.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit action
  const openEditModal = (p) => {
    setEditingParticipant(p);
    setEditForm({
      name: p.name || "",
      email: p.email || "",
      department: p.department || "",
      currentClueIndex: p.currentClueIndex || 0,
      accumulatedTime: Math.round((p.accumulatedTime || 0) / 1000) // convert to seconds for display
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingParticipant) return;

    try {
      const docRef = doc(db, "participants", editingParticipant.rollNo);
      await updateDoc(docRef, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        department: editForm.department,
        currentClueIndex: parseInt(editForm.currentClueIndex),
        accumulatedTime: editForm.accumulatedTime * 1000, // convert back to ms
        adminToken: ADMIN_TOKEN
      });
      setEditingParticipant(null);
    } catch (err) {
      alert("Failed to update participant: " + err.message);
    }
  };

  // Delete action (using the Secure Token Transition Pattern)
  const handleDeleteParticipant = async (rollNo) => {
    if (!confirm(`Are you absolutely sure you want to delete participant ${rollNo}? This action is permanent.`)) {
      return;
    }

    try {
      const docRef = doc(db, "participants", rollNo);
      // Step 1: Flag the document for deletion
      await updateDoc(docRef, {
        pendingDelete: true,
        adminToken: ADMIN_TOKEN
      });
      // Step 2: Perform the actual delete
      await deleteDoc(docRef);
    } catch (err) {
      alert("Failed to delete participant: " + err.message);
    }
  };

  // Helper stats
  const totalRegistered = participants.length;
  const totalCompleted = participants.filter(p => p.currentClueIndex >= 10).length;
  const totalActive = totalRegistered - totalCompleted;

  const deptCounts = participants.reduce((acc, p) => {
    acc[p.department] = (acc[p.department] || 0) + 1;
    return acc;
  }, {});

  const formatTimeDisplay = (ms) => {
    if (!ms) return "00:00";
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60).toString().padStart(2, "0");
    const s = (totalSecs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // AUTH SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "radial-gradient(circle, #0e111a 0%, #05060b 100%)",
        color: "var(--text-primary)",
        padding: "2rem"
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "2.5rem 2rem",
            border: "1px solid var(--border-subtle)",
            textAlign: "center"
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Database size={44} className="glow-text" style={{ color: "var(--accent-color)" }} />
          </div>
          <h2 className="orbitron glow-text" style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
            ADMIN PORTAL
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            ENTER SECURE DECRYPTION KEY
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password"
              placeholder="ENTER PASSCODE"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: passwordError ? "1px solid var(--error-color)" : "1px solid var(--border-subtle)",
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "1rem",
                outline: "none",
                textAlign: "center",
                fontFamily: "monospace"
              }}
            />
            {passwordError && (
              <p style={{ color: "var(--error-color)", fontSize: "0.8rem", margin: 0 }}>
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              className="glow-button"
              style={{
                padding: "0.8rem",
                background: "var(--accent-color)",
                border: "none",
                borderRadius: "6px",
                color: "var(--bg-color)",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              ACCESS DASHBOARD <ChevronRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // MAIN DASHBOARD SCREEN
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-color)",
      color: "var(--text-primary)",
      padding: "2rem 1.5rem"
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        borderBottom: "1px solid var(--border-subtle)",
        paddingBottom: "1rem"
      }}>
        <div>
          <h1 className="orbitron glow-text" style={{ fontSize: "1.8rem", margin: 0 }}>
            COMMAND CENTER // ADMIN
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0, fontFamily: "monospace" }}>
            GOOGLE STUDENTS CLUB @ MEPCO
          </p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "transparent",
            border: "1px solid var(--error-color)",
            color: "var(--error-color)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease"
          }}
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </header>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2.5rem"
      }}>
        <div className="glass-panel" style={{ padding: "1.5rem", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.8rem", background: "rgba(0, 229, 255, 0.1)", borderRadius: "8px", color: "var(--accent-color)" }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>TOTAL REGISTERED</h3>
            <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>{totalRegistered}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.8rem", background: "rgba(0, 229, 255, 0.1)", borderRadius: "8px", color: "#39ff14" }}>
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>COMPLETED HUNT</h3>
            <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: "#39ff14" }}>{totalCompleted}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "0.8rem", background: "rgba(0, 229, 255, 0.1)", borderRadius: "8px", color: "#ff9900" }}>
            <Activity size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>ACTIVE SOLVERS</h3>
            <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: "#ff9900" }}>{totalActive}</p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
        {["leaderboard", "department stats", "live logs"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.8rem 1.5rem",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid var(--accent-color)" : "2px solid transparent",
              color: activeTab === tab ? "var(--accent-color)" : "var(--text-secondary)",
              fontWeight: "bold",
              cursor: "pointer",
              textTransform: "uppercase",
              fontSize: "0.9rem",
              transition: "all 0.3s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--border-subtle)" }}>
        {activeTab === "leaderboard" && (
          <div>
            {/* Search Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--input-bg)", padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", marginBottom: "1.5rem", maxWidth: "400px" }}>
              <Search size={18} style={{ color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Search by Name, Roll No, Dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: "transparent", border: "none", color: "var(--text-primary)", outline: "none", width: "100%", fontSize: "0.95rem" }}
              />
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left" }}>
                    <th style={{ padding: "1rem", color: "var(--accent-color)" }}>RANK</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>ROLL NO</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>NAME</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>DEPT</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>CLUE</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>TIME SPENT</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>EMAIL</th>
                    <th style={{ padding: "1rem", color: "var(--text-secondary)", textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((p, idx) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <td style={{ padding: "1rem", fontWeight: "bold" }}>
                          {idx + 1 === 1 ? "🥇 1st" : idx + 1 === 2 ? "🥈 2nd" : idx + 1 === 3 ? "🥉 3rd" : `#${idx + 1}`}
                        </td>
                        <td style={{ padding: "1rem", fontFamily: "monospace" }}>{p.rollNo}</td>
                        <td style={{ padding: "1rem" }}>{p.name}</td>
                        <td style={{ padding: "1rem" }}>{p.department}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            padding: "0.2rem 0.5rem",
                            background: p.currentClueIndex >= 10 ? "rgba(57, 255, 20, 0.1)" : "rgba(0, 229, 255, 0.1)",
                            color: p.currentClueIndex >= 10 ? "#39ff14" : "var(--accent-color)",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            fontWeight: "bold"
                          }}>
                            {p.currentClueIndex >= 10 ? "FINISHED" : `NODE ${p.currentClueIndex + 1}`}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontFamily: "monospace" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Clock size={14} /> {formatTimeDisplay(p.accumulatedTime)}
                          </div>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>{p.email}</td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button
                            onClick={() => openEditModal(p)}
                            style={{ background: "transparent", border: "none", color: "var(--accent-color)", marginRight: "1rem", cursor: "pointer" }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteParticipant(p.rollNo)}
                            style={{ background: "transparent", border: "none", color: "var(--error-color)", cursor: "pointer" }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                        NO PARTICIPANTS FOUND.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "department stats" && (
          <div style={{ maxWidth: "600px" }}>
            <h3 className="orbitron" style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--accent-color)" }}>DEPARTMENT-WISE PARTICIPATION</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL", "BME", "BTECH"].map(dept => {
                const count = deptCounts[dept] || 0;
                const percentage = totalRegistered > 0 ? (count / totalRegistered) * 100 : 0;
                return (
                  <div key={dept}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", fontSize: "0.95rem" }}>
                      <span style={{ fontWeight: "bold" }}>{dept}</span>
                      <span style={{ color: "var(--text-secondary)" }}>{count} Students ({Math.round(percentage)}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ height: "100%", background: "var(--accent-color)", boxShadow: "0 0 8px var(--accent-color)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "live logs" && (
          <div>
            <h3 className="orbitron" style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--accent-color)" }}>LIVE EVENT LOG</h3>
            <div style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              padding: "1.5rem",
              maxHeight: "400px",
              overflowY: "auto",
              fontFamily: "monospace",
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem"
            }}>
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <div key={idx} style={{ 
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    color: log.type === "finish" ? "#39ff14" : log.type === "solve" ? "var(--text-primary)" : "var(--text-secondary)",
                    display: "flex",
                    gap: "1rem"
                  }}>
                    <span style={{ color: "var(--accent-color)" }}>[{log.time}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>
                  WAITING FOR LIVE ACTIONS... (EVENTS DISPLAY HERE REAL-TIME)
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingParticipant && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{
                maxWidth: "450px",
                width: "100%",
                padding: "2rem",
                border: "1px solid var(--accent-color)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 className="orbitron" style={{ margin: 0, color: "var(--accent-color)" }}>EDIT PARTICIPANT</h3>
                <button
                  onClick={() => setEditingParticipant(null)}
                  style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>NAME</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.7rem", background: "var(--input-bg)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "#fff", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>EMAIL</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.7rem", background: "var(--input-bg)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "#fff", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>DEPARTMENT</label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                    required
                    style={{ width: "100%", padding: "0.7rem", background: "var(--input-bg)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "#fff", outline: "none" }}
                  >
                    {["CSE", "IT", "AIDS", "ECE", "EEE", "MECH", "CIVIL", "BME", "BTECH"].map(dept => (
                      <option key={dept} value={dept} style={{ background: "#111" }}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>CLUE INDEX (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={editForm.currentClueIndex}
                      onChange={(e) => setEditForm(prev => ({ ...prev, currentClueIndex: parseInt(e.target.value) || 0 }))}
                      required
                      style={{ width: "100%", padding: "0.7rem", background: "var(--input-bg)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "#fff", outline: "none" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>TIME (SECONDS)</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.accumulatedTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, accumulatedTime: parseInt(e.target.value) || 0 }))}
                      required
                      style={{ width: "100%", padding: "0.7rem", background: "var(--input-bg)", border: "1px solid var(--border-subtle)", borderRadius: "6px", color: "#fff", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setEditingParticipant(null)}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      background: "transparent",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      background: "var(--accent-color)",
                      border: "none",
                      color: "var(--bg-color)",
                      fontWeight: "bold",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
