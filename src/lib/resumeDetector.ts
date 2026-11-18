/**
 * Deterministic Resume Skill & Target Role Detector
 * Inspired by SakshiGaikwad05/startup-finder (MIT License)
 * 
 * Accurately extracts canonical skills, likely target roles, location preferences,
 * and stated years of experience from resume text.
 */

export const SKILL_DICTIONARY: Record<string, RegExp> = {
  Python: /\bpython\b/i,
  JavaScript: /\bjavascript\b|\bjs\b|\bes6\b/i,
  TypeScript: /\btypescript\b|\bts\b/i,
  SQL: /\bsql\b/i,
  Java: /\bjava\b(?!\s*script)/i,
  Go: /\bgolang\b|\bgo\b(?=\s*(developer|engineer|lang|programming))/i,
  "C++": /c\+\+/i,
  "C#": /c#|\.net\b/i,
  Rust: /\brust\b/i,
  Kotlin: /\bkotlin\b/i,
  Swift: /\bswift\b|\bios\b/i,
  Ruby: /\bruby\b|\brails\b/i,
  PHP: /\bphp\b|\blaravel\b/i,
  React: /\breact(\.?js)?\b(?!\s*native)/i,
  "React Native": /react\s*native/i,
  "Next.js": /\bnext\.?js\b/i,
  "Node.js": /\bnode(\.?js)?\b/i,
  "Express.js": /\bexpress(\.?js)?\b/i,
  FastAPI: /\bfastapi\b/i,
  Django: /\bdjango\b/i,
  Flask: /\bflask\b/i,
  Spring: /\bspring( boot)?\b/i,
  Angular: /\bangular\b/i,
  Vue: /\bvue(\.?js)?\b/i,
  "Tailwind CSS": /\btailwind\b/i,
  Redux: /\bredux\b/i,
  Flutter: /\bflutter\b/i,
  "HTML/CSS": /\bhtml5?\b|\bcss3?\b/i,
  MongoDB: /\bmongo(db)?\b|\bmongoose\b/i,
  PostgreSQL: /\bpostgres(ql)?\b/i,
  MySQL: /\bmysql\b/i,
  SQLite: /\bsqlite\b/i,
  Redis: /\bredis\b/i,
  AWS: /\baws\b|amazon web services/i,
  GCP: /\bgcp\b|google cloud/i,
  Azure: /\bazure\b/i,
  Docker: /\bdocker\b/i,
  Kubernetes: /\bkubernetes\b|\bk8s\b/i,
  Terraform: /\bterraform\b/i,
  Linux: /\blinux\b/i,
  "CI/CD": /\bci\/cd\b|continuous integration/i,
  Git: /\bgit\b|\bgithub\b/i,
  Postman: /\bpostman\b/i,
  "REST APIs": /\brest(ful)?\b|\brest api/i,
  GraphQL: /\bgraphql\b/i,
  Microservices: /\bmicroservices?\b/i,
  "LLM / GenAI": /\bllms?\b|large language model|\bgen\s?ai\b|generative ai|\bgroq\b|\bnim\b/i,
  "AI Agents": /\bagentic\b|\bai agents?\b|tool[- ]calling/i,
  LangChain: /\blangchain\b/i,
  LangGraph: /\blanggraph\b/i,
  RAG: /\brag\b|retrieval[- ]augmented/i,
  "Prompt Engineering": /prompt engineering/i,
  "Machine Learning": /machine learning|\bml\b/i,
  "Deep Learning": /deep learning|neural network/i,
  PyTorch: /\bpytorch\b/i,
  TensorFlow: /\btensorflow\b/i,
  NLP: /\bnlp\b|natural language processing/i,
  "Computer Vision": /computer vision|\bopencv\b/i,
  Pandas: /\bpandas\b/i,
  NumPy: /\bnumpy\b/i,
  Playwright: /\bplaywright\b/i,
  Selenium: /\bselenium\b/i,
  Cypress: /\bcypress\b/i,
  Jest: /\bjest\b/i,
  Pytest: /\bpytest\b/i,
  "Distributed Systems": /distributed systems?|raft|consensus|sharding|high-availability/i,
  ClickHouse: /\bclickhouse\b/i,
  Kafka: /\bkafka\b/i,
  RabbitMQ: /\brabbitmq\b/i,
  WebSockets: /\bwebsockets?\b/i,
};

export const ROLE_OPTIONS: { role: string; re: RegExp }[] = [
  { role: "Software Engineer", re: /software (engineer|developer|development)|\bsde\b|\bswe\b/i },
  { role: "Full Stack Developer", re: /full[\s-]?stack|\bmern\b|\bmean\b/i },
  { role: "Backend Developer", re: /back[\s-]?end|server[\s-]side|rest(ful)? api/i },
  { role: "Frontend Developer", re: /front[\s-]?end|\bui (engineer|developer)|react(\.js)? developer/i },
  { role: "AI Engineer", re: /\bai engineer|\bllm|generative ai|gen\s?ai|langchain|langgraph|agentic|ai agents?/i },
  { role: "ML Engineer", re: /machine learning|\bml engineer|deep learning|pytorch|tensorflow|scikit/i },
  { role: "Data Scientist", re: /data scien/i },
  { role: "Data Engineer", re: /data engineer|spark|kafka|etl pipeline|data warehouse/i },
  { role: "DevOps Engineer", re: /devops|\bsre\b|site reliability|kubernetes|terraform/i },
  { role: "Mobile Developer", re: /android|\bios\b|flutter|react native|kotlin|swift(ui)?\b/i },
  { role: "Distributed Systems Engineer", re: /distributed systems|concurrency|raft|high throughput/i },
];

export const CITY_OPTIONS: [string, RegExp][] = [
  ["Bangalore", /\bbengaluru\b|\bbangalore\b|\bhsr\b|\bindiranagar\b|\bkoramangala\b/i],
  ["Pune", /\bpune\b|\bhinjewadi\b|\bbaner\b|\bkalyani nagar\b/i],
  ["Mumbai", /\bmumbai\b|\bnavi mumbai\b|\bthane\b/i],
  ["Hyderabad", /\bhyderabad\b|\bcyberabad\b|\bgachibowli\b/i],
  ["Delhi NCR", /\bdelhi\b|\bgurugram\b|\bgurgaon\b|\bnoida\b/i],
  ["San Francisco / US", /\bsan francisco\b|\bsf\b|\bbay area\b|\busa\b|\bcalifornia\b/i],
];

export interface ResumeParseResult {
  detectedSkills: string[];
  detectedRoles: string[];
  detectedLocations: string[];
  detectedYearsOfExperience: number | null;
  detectedName: string | null;
  detectedEmail: string | null;
  charsRead: number;
}

export function parseResumeText(raw: string): ResumeParseResult {
  const text = raw.replace(/\s+/g, " ");

  // 1. Detect Skills
  const detectedSkills = Object.entries(SKILL_DICTIONARY)
    .filter(([name, re]) => {
      if (name === "Go") return /\bgolang\b|\bgo (developer|programming|language)\b/i.test(text);
      if (name === "TypeScript") return /\btypescript\b/i.test(text);
      if (name === "JavaScript") return /\bjavascript\b|\bes6\b|\bnode\.?js\b/i.test(text);
      if (name === "Swift") return /\bswift\b/i.test(text);
      if (name === "Machine Learning") return /machine learning/i.test(text);
      return re.test(text);
    })
    .map(([name]) => name);

  // 2. Detect Roles
  const detectedRoles = ROLE_OPTIONS.filter((r) => r.re.test(text)).map((r) => r.role);
  const has = (s: string) => detectedSkills.includes(s);
  if (!detectedRoles.includes("Full Stack Developer") && has("React") && (has("Node.js") || has("Express.js") || has("FastAPI"))) {
    detectedRoles.push("Full Stack Developer");
  }
  if (!detectedRoles.includes("AI Engineer") && (has("LLM / GenAI") || has("LangChain") || has("AI Agents"))) {
    detectedRoles.push("AI Engineer");
  }
  if (!detectedRoles.length && detectedSkills.length) {
    detectedRoles.push("Software Engineer");
  }

  // 3. Detect Locations
  const detectedLocations = CITY_OPTIONS.filter(([, re]) => re.test(text)).map(([c]) => c);
  if (/\bremote\b/i.test(text)) {
    detectedLocations.push("Remote");
  }

  // 4. Detect Years of Experience
  const yrs = text.match(/(\d{1,2}(?:\.\d)?)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:professional\s+|industry\s+|work\s+)?experience/i);
  const detectedYearsOfExperience = yrs ? Math.min(40, parseFloat(yrs[1])) : null;

  // 5. Detect Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedEmail = emailMatch ? emailMatch[0] : null;

  // 6. Detect Name (First prominent capitalized words at beginning)
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  let detectedName: string | null = null;
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 40 && !firstLine.includes('@') && !firstLine.includes('http')) {
      detectedName = firstLine.replace(/[^a-zA-Z\s]/g, '').trim();
    }
  }

  return {
    detectedSkills: [...new Set(detectedSkills)],
    detectedRoles: [...new Set(detectedRoles)],
    detectedLocations: [...new Set(detectedLocations)],
    detectedYearsOfExperience,
    detectedName,
    detectedEmail,
    charsRead: raw.length,
  };
}
