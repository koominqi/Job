const skill = (id: string, name: string, category: string, sdgs: number[], keywords: string[]) => ({ id, name, category, sdgs, keywords });
export const skills = [
  skill("python", "Python", "Technical", [4, 9], ["python"]),
  skill("sql", "SQL", "Technical", [8, 9], ["sql", "database"]),
  skill("data-analysis", "Data analysis", "Technical", [8, 9], ["analytics", "data analysis", "data analyst"]),
  skill("ai-literacy", "AI literacy", "AI & digital", [4, 8], ["artificial intelligence", "generative ai", "llm", " ai "]),
  skill("machine-learning", "Machine learning", "AI & digital", [9], ["machine learning", "deep learning", "pytorch"]),
  skill("communication", "Communication", "Human skills", [4, 8, 17], ["communication", "communicate", "collaboration"]),
  skill("critical-thinking", "Critical thinking", "Human skills", [4, 8], ["problem solving", "problem-solving", "analytical"]),
  skill("project-management", "Project management", "Business", [8, 9], ["project management", "project manager", "agile"]),
  skill("cybersecurity", "Cybersecurity", "Technical", [9, 16], ["security", "cyber", "vulnerability"]),
  skill("cloud", "Cloud computing", "Technical", [9], ["aws", "azure", "cloud"]),
  skill("sustainability", "Sustainability", "Green skills", [7, 12, 13], ["sustainability", "climate", "renewable", " esg "]),
  skill("spreadsheets", "Spreadsheets", "Business", [4, 8], ["excel", "spreadsheet", "google sheets"]),
  skill("ux-design", "UX design", "Design", [9, 10], ["ux", "user experience", "figma", "user research"]),
  skill("automation", "Workflow automation", "AI & digital", [8, 9], ["automation", "automate", "workflow"]),
];

const role = (id: string, title: string, description: string, sector: string, required: string[], sdgs: number[], occupation: string, outlook: "rising" | "declining", impact: string) =>
  ({ id, title, description, sector, skills: required, sdgs, sourceUrl: `https://www.onetonline.org/link/summary/${occupation}`, outlook, impact });
export const roles = [
  role("data-analyst", "Data Analyst", "Turn complex information into evidence that helps teams make better decisions.", "Data & AI", ["data-analysis", "sql", "spreadsheets", "communication", "critical-thinking", "python"], [4, 8, 9], "15-2051.01", "rising", "Use evidence to improve productivity and access to services. Your projects, not your job title alone, determine the actual contribution."),
  role("ml-engineer", "Machine Learning Engineer", "Build and evaluate machine learning systems with human oversight.", "Data & AI", ["python", "machine-learning", "ai-literacy", "cloud", "critical-thinking"], [8, 9], "15-2051.00", "rising", "Develop reliable innovation and augment human work; evaluate bias, safety and environmental costs."),
  role("cybersecurity-analyst", "Cybersecurity Analyst", "Protect systems, investigate threats and help people work safely online.", "Technology", ["cybersecurity", "cloud", "python", "critical-thinking", "communication"], [9, 16], "15-1212.00", "rising", "Protect resilient infrastructure and strengthen trust in digital institutions."),
  role("sustainability-specialist", "Sustainability Specialist", "Measure environmental performance and help organisations reduce their impact.", "Sustainability", ["sustainability", "data-analysis", "spreadsheets", "communication", "project-management"], [7, 12, 13], "13-1199.05", "rising", "Track emissions, reduce resource waste and develop evidence-based climate action."),
  role("ux-designer", "UX Designer", "Research human needs and design inclusive digital products.", "Design", ["ux-design", "communication", "critical-thinking", "ai-literacy"], [9, 10], "15-1255.00", "rising", "Design accessible services that reduce barriers for underserved communities."),
  role("project-manager", "Project Management Specialist", "Coordinate people, resources and change to deliver meaningful projects.", "Business", ["project-management", "communication", "critical-thinking", "spreadsheets", "automation"], [8, 9, 17], "13-1082.00", "rising", "Support decent work through responsible delivery, inclusive collaboration and innovation."),
  role("data-entry", "Data Entry Keyer", "Maintain accurate records; routine tasks may be exposed to automation.", "Business", ["spreadsheets", "communication"], [4, 8], "43-9021.00", "declining", "Strengthen data quality and transition toward analytical work as routine tasks change."),
];

const sdgNames = ["No Poverty", "Zero Hunger", "Good Health and Well-being", "Quality Education", "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy", "Decent Work and Economic Growth", "Industry, Innovation and Infrastructure", "Reduced Inequalities", "Sustainable Cities and Communities", "Responsible Consumption and Production", "Climate Action", "Life Below Water", "Life on Land", "Peace, Justice and Strong Institutions", "Partnerships for the Goals"];
const sdgColors = ["#e5243b", "#dda63a", "#4c9f38", "#c5192d", "#ff3a21", "#26bde2", "#fcc30b", "#a21942", "#fd6925", "#dd1367", "#fd9d24", "#bf8b2e", "#3f7e44", "#0a97d9", "#56c02b", "#00689d", "#19486a"];
export const catalog = {
  skills, roles,
  sdgs: sdgNames.map((title, index) => ({ id: index + 1, title, color: sdgColors[index]!, url: `https://sdgs.un.org/goals/goal${index + 1}` })),
  methodology: "Transparent rules, not a language model. Role requirements and SDG links are editorial mappings informed by O*NET and UN goals, not certified assessments. Rising/declining labels are planning assumptions, not measured growth. Current public job-posting keyword counts supply the demand component. No demographic attributes are used. For synthetic profiles only; humans make career decisions.",
};

type Resource = { title: string; provider: string; url: string; hours: number; outcome: string };
export const resources: Record<string, Resource> = {
  python: { title: "Learn Python", provider: "Kaggle Learn", url: "https://www.kaggle.com/learn/python", hours: 12, outcome: "Write a small Python script to process a sample dataset." },
  sql: { title: "Intro to SQL", provider: "Kaggle Learn", url: "https://www.kaggle.com/learn/intro-to-sql", hours: 10, outcome: "Answer five business questions using SQL queries." },
  "data-analysis": { title: "Pandas", provider: "Kaggle Learn", url: "https://www.kaggle.com/learn/pandas", hours: 12, outcome: "Clean and analyse an open dataset and explain your findings." },
  "ai-literacy": { title: "Introduction to AI", provider: "Elements of AI", url: "https://www.elementsofai.com/", hours: 20, outcome: "Explain AI capabilities, limitations and ethical risks using a workplace example." },
  "machine-learning": { title: "Intro to Machine Learning", provider: "Kaggle Learn", url: "https://www.kaggle.com/learn/intro-to-machine-learning", hours: 18, outcome: "Train and evaluate a simple model on synthetic data." },
  communication: { title: "Communication skills", provider: "OpenLearn", url: "https://www.open.edu/openlearn/money-business/communication-skills/content-section-0", hours: 8, outcome: "Present an evidence-based recommendation to a non-technical audience." },
  "critical-thinking": { title: "Critical thinking", provider: "OpenLearn", url: "https://www.open.edu/openlearn/education-development/critical-thinking/content-section-0", hours: 8, outcome: "Compare two career scenarios and document the assumptions and evidence." },
  "project-management": { title: "Getting started with project management", provider: "OpenLearn", url: "https://www.open.edu/openlearn/money-business/getting-started-project-management/content-section-0", hours: 12, outcome: "Create a project brief, risk register and delivery schedule." },
  cybersecurity: { title: "Introduction to Cybersecurity", provider: "Cisco Networking Academy", url: "https://www.netacad.com/courses/introduction-to-cybersecurity", hours: 16, outcome: "Create a basic threat model and security checklist." },
  cloud: { title: "Describe cloud concepts", provider: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/", hours: 10, outcome: "Explain cloud services and sketch a secure deployment." },
  sustainability: { title: "Introduction to Sustainable Development", provider: "UN SDG Academy", url: "https://sdgacademy.org/course/", hours: 18, outcome: "Select a relevant introductory course and create an SDG-linked improvement proposal." },
  spreadsheets: { title: "Google Sheets training", provider: "Google Workspace Learning Center", url: "https://support.google.com/a/users/answer/9282959", hours: 8, outcome: "Build a spreadsheet with formulas, data validation and a summary." },
  "ux-design": { title: "Get started with Figma", provider: "Figma Learn", url: "https://help.figma.com/hc/en-us/categories/360002051613-Get-started", hours: 16, outcome: "Prototype an accessible career-support interface and seek feedback." },
  automation: { title: "Get started with Power Automate", provider: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/paths/get-started-flows/", hours: 10, outcome: "Automate a routine task using sample data with a human review step." },
};
