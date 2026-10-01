"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, BrainCircuit, BriefcaseBusiness, Code2, ExternalLink, Github, GraduationCap, Mail, Menu, Sparkles, Terminal, X, Linkedin, MapPin, Trophy, UsersRound } from "lucide-react";
import { useState } from "react";

const nav = ["Home", "About", "Projects", "Experience", "Skills", "Achievements", "Contact"];
const tags = ["C++", "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Gemini API", "AI integration", "Natural-language interfaces", "Git", "GitHub", "VS Code", "Vercel"];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.55, ease: "easeOut" }}>{children}</motion.div>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  return <main>
    <header className="nav-wrap">
      <nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#home">Iwalani <i>Rosita</i></a>
        <div className="nav-links">{nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</div>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        <AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{nav.map((item) => <a onClick={() => setOpen(false)} key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</motion.div>}</AnimatePresence>
      </nav>
    </header>

    <section id="home" className="hero section container">
      <div className="hero-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45 }}><span /> Student developer · SRM University-AP</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .06 }}>Hi, I&apos;m <em>Iwalani</em> Rosita.</motion.h1>
        <motion.p className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .22 }}>CSE (AI &amp; ML) Student <b>•</b> Developer <b>•</b> Builder</motion.p>
        <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>I&apos;m an Integrated M.Tech CSE (AI &amp; ML) student, passionate about building practical technology solutions and exploring the possibilities of AI and full-stack development.</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .38 }}><a className="button primary" href="#projects">View my projects <ArrowDownRight /></a><a className="button ghost" href="#contact">Let&apos;s connect <ArrowUpRight /></a></motion.div>
        <motion.div className="social-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .46 }}><a href="https://github.com/iwan-adler" target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href="https://www.linkedin.com/in/iwalanirosita264826" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a><a href="mailto:rosiwa648@gmail.com" aria-label="Email"><Mail /></a></motion.div>
      </div>
      <motion.div className="hero-art" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .65, delay: .14 }} aria-label="A decorative developer workspace illustration">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="terminal-card"><div className="terminal-head"><span /><span /><span /><p>iwalani@build:~</p></div><div className="terminal-code"><p><b>const</b> curiosity = <i>true</i>;</p><p><b>const</b> ideas = [<span>&quot;AI&quot;</span>, <span>&quot;web&quot;</span>];</p><p><b>function</b> <strong>build</strong>() {'{'}</p><p className="indent">return ideas.map(makeReal);</p><p>{'}'}</p><p className="cursor">_</p></div></div>
        <div className="float-chip chip-one"><BrainCircuit /> AI × people</div><div className="float-chip chip-two"><Code2 /> learn by doing</div>
      </motion.div>
    </section>

    <section id="about" className="section about-band"><div className="container about-grid"><Reveal><p className="eyebrow"><span /> About me</p><h2>A little about <em>me.</em></h2><p className="body-copy">I&apos;m currently studying Computer Science &amp; Engineering with a focus on AI &amp; ML. I enjoy developing my programming skills by turning ideas into projects, showing up for hackathons, and getting involved in university life.</p><p className="body-copy">I&apos;m especially drawn to the space where thoughtful design meets useful technology—whether that&apos;s a natural-language interface or a well-crafted web experience.</p></Reveal><Reveal className="education-card"><GraduationCap /><p className="card-label">Education</p><h3>Integrated M.Tech</h3><p>Computer Science &amp; Engineering <br />(AI &amp; ML)</p><div><MapPin /> SRM University-AP</div></Reveal></div></section>

    <section id="projects" className="section container"><Reveal className="section-intro"><p className="eyebrow"><span /> Selected work</p><h2>Things I&apos;ve <em>built.</em></h2><p>Projects that reflect how I learn: with curiosity, collaboration, and a bias for making ideas real.</p></Reveal><div className="projects-grid"><Reveal className="project-card featured"><div className="project-visual orbit-visual"><div className="orbit-ring ring-a" /><div className="orbit-ring ring-b" /><div className="orbit-core">SRM<br /><small>orbit</small></div><div className="visual-note"><Sparkles /> Contextual campus OS</div></div><div className="project-content"><span className="project-number">01 / FEATURED</span><h3>SRM Orbit <em>— Contextual Campus OS</em></h3><p>An AI-powered campus interaction layer built during Google Solution Hunt 2026 to help students access campus information and services through natural-language interaction.</p><ul className="feature-list"><li>AI-powered natural language interaction &amp; intent detection</li><li>Wayfinding, academics, transport &amp; student services</li><li>Health, emergency &amp; accessibility support</li></ul><div className="tag-row">{["Next.js", "React", "TypeScript", "Tailwind CSS", "Gemini API", "Vercel"].map(t => <span key={t}>{t}</span>)}</div><div className="project-links"><a className="text-link" href="https://google-solution-hunt-2026-qm9up1z9e-rosiwa648-6115.vercel.app/" target="_blank" rel="noreferrer">Live demo <ExternalLink /></a><a className="text-link" href="https://github.com/iwan-adler/google-solution-hunt-2026" target="_blank" rel="noreferrer">GitHub <Github /></a></div></div></Reveal><Reveal className="project-card small-project"><div className="project-visual system-visual"><div className="folder"><span /><span /><span /></div><div className="code-lines"><i /><i /><i /><i /></div></div><div className="project-content"><span className="project-number">02 / FIRST REPOSITORY</span><h3>Student Management System</h3><p>My first GitHub project, built as a practical exercise to understand project structure, programming concepts, and the process of building and publishing a project on GitHub.</p><div className="tag-row">{["Python", "Tkinter", "SQLite"].map(t => <span key={t}>{t}</span>)}</div><div className="project-links"><a className="text-link" href="https://github.com/iwan-adler/Student_management_system" target="_blank" rel="noreferrer">GitHub <Github /></a></div></div></Reveal></div></section>

    <section id="experience" className="section experience-band"><div className="container"><Reveal className="section-intro"><p className="eyebrow"><span /> In the community</p><h2>Experience &amp; <em>leadership.</em></h2></Reveal><div className="timeline"><Reveal className="timeline-item"><div className="time-icon"><BriefcaseBusiness /></div><div><p className="card-label">E-Cell, SRM University-AP</p><h3>Events &amp; Operations Member</h3><p>Contributing to entrepreneurship-focused events and activities through coordination, operations, logistics, and on-ground execution.</p></div></Reveal><Reveal className="timeline-item"><div className="time-icon"><UsersRound /></div><div><p className="card-label">Google Solution Hunt 2026</p><h3>Team Leader · SRM Orbit</h3><p>Led a three-member team with Aislinn Shaikh and Damini Roy to design and develop an AI-powered contextual campus assistant—from problem solving and product development through AI integration, full-stack development, and deployment.</p></div></Reveal></div></div></section>

    <section id="skills" className="section container"><Reveal className="skills-heading"><p className="eyebrow"><span /> Tools &amp; focus</p><h2>Learning the craft, <em>one build at a time.</em></h2></Reveal><Reveal className="skills-cloud">{tags.map((tag, index) => <span className={index < 8 ? "skill core" : "skill"} key={tag}>{tag}</span>)}</Reveal></section>

    <section id="achievements" className="section achievement-band"><div className="container"><Reveal className="section-intro"><p className="eyebrow"><span /> Beyond code</p><h2>Always growing <em>outside the editor.</em></h2></Reveal><div className="achievement-grid"><Reveal className="achievement-card"><Trophy /><h3>Team Leader</h3><p>SRM Orbit — Contextual Campus OS</p></Reveal><Reveal className="achievement-card"><BriefcaseBusiness /><h3>Events &amp; Operations</h3><p>Member, SRM University-AP</p></Reveal><Reveal className="achievement-card"><GraduationCap /><h3>NCC A Certificate</h3><p>Alongside Spell Bee and sports certifications.</p></Reveal></div></div></section>

    <section id="contact" className="section container"><Reveal className="contact-card"><p className="eyebrow light"><span /> Get in touch</p><h2>Let&apos;s build <em>something.</em></h2><p>I&apos;m always interested in learning, building, collaborating, and exploring new ideas.</p><div className="contact-actions"><a className="button white" href="mailto:rosiwa648@gmail.com"><Mail /> Email me</a><a href="https://www.linkedin.com/in/iwalanirosita264826" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a><a href="https://github.com/iwan-adler" target="_blank" rel="noreferrer"><Github /> GitHub</a></div></Reveal></section>
    <footer className="container"><p>© 2026 Iwalani Rosita</p><p>Built with Next.js &amp; curiosity.</p><div><a href="https://github.com/iwan-adler" aria-label="GitHub"><Github /></a><a href="https://www.linkedin.com/in/iwalanirosita264826" aria-label="LinkedIn"><Linkedin /></a><a href="mailto:rosiwa648@gmail.com" aria-label="Email"><Mail /></a></div></footer>
  </main>;
}
