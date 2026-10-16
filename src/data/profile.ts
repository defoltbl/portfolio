// Everything on the site that is not a project: contact, skills, experience, education, publications.
// Typed, so a missing field is a build error, not an empty line on the page.

export interface Link {
  label: string;
  href: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Entry {
  title: string;
  org: string;
  when: string;
  body?: string;
  note?: string;
  url?: string;
}

export const person = {
  name: "Andrii Maksymenko",
  role: "Junior Software Developer",
  headline: "Junior Software Developer – backend & cloud, with a research background in AI/ML.",
  lede: "MSc Computer Science (Honours) · published at two international conferences.",
  location: "Prague / Mladá Boleslav, Czech Republic",
  email: "andrii.maksymenko.d@gmail.com",
  cv: "/AndriiMaksymenko_CV_EN.pdf",
  site: "https://andrii-maksymenko.com",
};

export const mailto =
  `mailto:${person.email}?subject=Junior%20Software%20Developer%20role&body=Hi%20Andrii%2C`;

export const profiles: Link[] = [
  { label: "GitHub", href: "https://github.com/defoltbl" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/andrii-maksymenko-83628932a/" },
];

export const sections: [id: string, label: string][] = [
  ["about", "About"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["publications", "Publications"],
  ["contact", "Contact"],
];

export const skills: SkillGroup[] = [
  { group: "Backend & Cloud", items: ["Kotlin", "Ktor", "FastAPI", "REST APIs", "JWT", "BCrypt", "Docker", "Docker Compose", "Azure", "PostgreSQL", "GitHub Actions"] },
  { group: "Languages", items: ["Python", "Kotlin", "SQL"] },
  { group: "AI / Machine Learning", items: ["PyTorch", "OpenAI Gym", "PPO", "DQN", "A2C", "Behavioral Cloning", "CNNs", "RAG", "LLMs", "Ollama", "Embeddings"] },
  { group: "Frontend", items: ["React", "JavaScript", "HTML/CSS", "Vite"] },
  { group: "Mobile / Android", items: ["Android SDK", "Firebase", "MVVM"] },
  { group: "Databases & Tools", items: ["PostgreSQL", "pgvector", "PL/pgSQL", "Git", "Linux"] },
];

export const experience: Entry[] = [
  { title: "Machine Learning Research Intern (Pre-Diploma Practice)", org: "TOV NVO “Diskret”", when: "Sep 2025 – Apr 2026 · Remote", body: "Applied research and implementation for the MSc thesis project (hybrid RL/IL game AI): literature review, model implementation and experimental evaluation." },
  { title: "Software Engineering Intern (Production Practice)", org: "PP NVP “Kare”", when: "Sep 2023 – Mar 2024 · Remote", body: "Practical training at an electronics R&D company; completed an individual technical assignment analyzing and extending an indie game project – architecture, design patterns and framework selection." },
  { title: "Research Intern, Computer Vision (Production Practice)", org: "NGO “Educational Fund KIPSOLID”", when: "Apr 2023 – Aug 2023 · Remote", body: "Researched assistive computer-vision technologies for visually impaired users – object detection and text recognition – as part of an applied research assignment." },
];

export const education: Entry[] = [
  { title: "MSc, Computer Science – with Honours", org: "Odesa Polytechnic National University", when: "2024 – 2026", body: "Thesis: hybrid RL/IL agents for NPC behaviour in video games. Recognized as equivalent to a Czech Master's degree in Informatika (ČVUT Prague, 2026)." },
  { title: "BSc, Computer Science", org: "Odesa Polytechnic National University", when: "2020 – 2024", body: "Recognized as equivalent to a Czech Bachelor's degree in Informatika (ČVUT Prague, 2026)." },
  { title: "Certificate – Creating Mobile Apps with Android", org: "Anhalt University of Applied Sciences / DAAD", when: "2023", body: "92/100 (Excellent) · 120h / 4 ECTS · Credential ID CMAA/2023S29." },
];

export const publications: Entry[] = [
  { title: "Hybrid Training of an Intelligent Agent for Efficient Maze Navigation in Ms. Pac-Man", org: "Modern Inventions, Technologies and Ideas (19th Int. Scientific-Practical Conference), Sofia, Bulgaria", when: "May 2026", note: "Sole author · proceedings pp. 54–56", url: "https://eu-conf.com/wp-content/uploads/2026/03/MODERN-INVENTIONS-TECHNOLOGIES-AND-IDEAS-PROBLEMS-THEORIES-AND-CHALLENGES.pdf" },
  { title: "Modeling Intelligent Behavior of Characters in Video Games to Improve Level-Completion Speed", org: "Modern Information Technologies 2025 (15th Int. Scientific Conference), Odesa", when: "May 2025", note: "Co-authored with O. Halchonkov", url: "https://drive.google.com/file/d/1zi1TabIH7iso1-SW__9ntZ_LG0glE4Wa/view" },
];
