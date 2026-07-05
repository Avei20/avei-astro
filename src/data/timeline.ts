export type EntryKind = 'work' | 'community' | 'education' | 'project' | 'volunteer';

export interface Milestone {
  date: { year: number; month?: number; day?: number };
  text: string;
  tags?: string[];
  links?: { label: string; url: string }[];
}

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  shortName: string;
  kind: EntryKind;
  start: { year: number; month?: number };
  end: { year: number; month?: number } | 'present';
  location?: string;
  summary?: string;
  milestones: Milestone[];
  parentId?: string;
}

// Canonical "now" for the Gantt. Hardcoded — system date in this environment is
// 2026-07. The component uses this to convert `end: 'present'` to a real Date
// and to anchor the top of the inverted y-axis.
export const PRESENT = { year: 2026, month: 7 };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonthYear(d: { year: number; month?: number } | 'present'): string {
  if (d === 'present') return 'Present';
  if (d.month == null) return `${d.year}`;
  return `${MONTHS[d.month - 1]} ${d.year}`;
}

export function formatRange(
  start: { year: number; month?: number },
  end: { year: number; month?: number } | 'present',
): string {
  return `${formatMonthYear(start)} — ${formatMonthYear(end)}`;
}

export const timeline: TimelineEntry[] = [
  // ---------- 1. Bina Nusantara University (Education) ----------
  {
    id: 'binus',
    title: 'Bina Nusantara University',
    subtitle: 'Undergraduate in Computer Science · GPA 3.55 / 4.00',
    shortName: 'Binus',
    kind: 'education',
    start: { year: 2019, month: 8 },
    end: { year: 2023, month: 10 },
    location: 'Jakarta, Indonesia',
    summary: 'Undergraduate studies in Computer Science, graduating with honors.',
    milestones: [
      { date: { year: 2019, month: 8 }, text: 'Begin study Computer Science @Bina Nusantara University' },
      { date: { year: 2023, month: 10 }, text: 'End of study in Computer Science @Bina Nusantara with GPA 3.55/4.00' }
    ]
  },

  // ---------- 2. Bangkit Academy (Education) ----------
  {
    id: 'bangkit-2022',
    title: 'Bangkit Academy led by Tokopedia, Gojek & Traveloka',
    subtitle: 'Cohort Student · Machine Learning Path',
    shortName: 'Bangkit',
    kind: 'education',
    start: { year: 2022, month: 2 },
    end: { year: 2022, month: 8 },
    location: 'Online',
    summary: 'Distinguished graduate from a cohort of 3,100 participants in the ML track.',
    parentId: 'binus',
    milestones: [
      { date: { year: 2022, month: 2 }, text: 'Begin Study on Bangkit Academy led by Tokopedia, Gojek & Traveloka in ML Path' },
      { date: { year: 2022, month: 4 }, text: 'Led Capstone Team to develop Project Anya to solve Stunting Problem in Indonesia.', tags: ['Project Anya'], links: [{ label: 'Project Anya', url: 'https://github.com/project-anya' }] },
      { date: { year: 2022, month: 6 }, text: 'Capstone Team got Top 53 Capstone Project amongst 463 Teams.', tags: ['Project Anya'], links: [{ label: 'Project Anya', url: 'https://github.com/project-anya' }] },
      { date: { year: 2022, month: 7 }, text: 'Passed TensorFlow Developer Certification Exam.', tags: ['TensorFlow'] },
      { date: { year: 2022, month: 8 }, text: 'End of the Bangkit Academy led by Tokopedia, Gojek & Traveloka with Distinct Graduate among the top 10% from 3100 participants' }
    ]
  },

  // ---------- 3. Bank Indonesia Institute (Work) ----------
  {
    id: 'bi-institute',
    title: 'Bank Indonesia Institute',
    subtitle: 'Data Scientist Intern',
    shortName: 'Bank Indonesia',
    kind: 'work',
    start: { year: 2022, month: 8 },
    end: { year: 2022, month: 12 },
    location: 'Jakarta, Indonesia',
    summary: 'Developed research data pipelines and Power Platform implementations.',
    parentId: 'binus',
    milestones: [
      { date: { year: 2022, month: 8 }, text: 'Begin Internship at Bank Indonesia Institute.' },
      { date: { year: 2022, month: 9 }, text: 'Design and developed data pipelines for research data collection from 46 KPw Nationwide and 5 KPw Overseas', tags: ['Pipelines'] },
      { date: { year: 2022, month: 10 }, text: 'Migrated and Process 900 research data entries using NLP and Data normalization', tags: ['NLP'] },
      { date: { year: 2022, month: 11 }, text: 'Design and PoC for realtime pipeline on top of Microsoft Power Platform', tags: ['Power Platform'] },
      { date: { year: 2022, month: 12 }, text: 'End of Internship @Bank Indonesia Institute. Awarded the "Most Dedicated Learner" (Peserta Paling Pembelajar) title.' }
    ]
  },

  // ---------- 4. Google Cloud ACE Courses (Education) ----------
  {
    id: 'google-cloud-ace',
    title: 'Google Cloud ACE Courses',
    subtitle: 'Certification Learning Path',
    shortName: 'GCP ACE',
    kind: 'education',
    start: { year: 2022, month: 10 },
    end: { year: 2022, month: 12 },
    location: 'Online',
    summary: 'Underwent the GCP Associate Cloud Engineer (ACE) learning path and passed the certification exam.',
    parentId: 'binus',
    milestones: [
      { date: { year: 2022, month: 10 }, text: 'Begin of Google Cloud ACE Courses' },
      { date: { year: 2022, month: 11 }, text: 'Completed the courses in 7 Weeks out of the allotted 10 Weeks' },
      { date: { year: 2022, month: 12 }, text: 'End of Google Cloud ACE Courses and passed Google Cloud ACE Exam', tags: ['GCP ACE'] }
    ]
  },

  // ---------- 5. StunThink Project (Project) ----------
  {
    id: 'stunthink-thesis',
    title: 'StunThink Thesis Project',
    subtitle: 'Thesis Project · Lead Developer',
    shortName: 'StunThink',
    kind: 'project',
    start: { year: 2023, month: 2 },
    end: { year: 2023, month: 9 },
    location: 'Jakarta, Indonesia',
    summary: 'A computer vision mobile system for child nutrition, supersetting Project Anya.',
    parentId: 'binus',
    milestones: [
      { date: { year: 2023, month: 2 }, text: 'Start doing StunThink Project for Final Thesis which is a Superset of Project Anya', links: [{ label: 'StunThink', url: 'https://github.com/StuntedProject' }] },
      { date: { year: 2023, month: 4 }, text: 'Migrate the Infrastructure into Low Cost Architecture on top of Google Cloud Platform', tags: ['GCP'] },
      { date: { year: 2023, month: 6 }, text: 'Publish StunThink in Play Store', tags: ['Play Store'] },
      { date: { year: 2023, month: 9 }, text: 'Passed the Thesis Exam and end of the StunThink Project.' }
    ]
  },

  // ---------- 6. DroidJam Indonesia 2023 (Volunteer) ----------
  {
    id: 'droidjam-2023',
    title: 'DroidJam Indonesia 2023',
    subtitle: 'Volunteer Registration Team',
    shortName: 'DroidJam',
    kind: 'volunteer',
    start: { year: 2023, month: 10 },
    end: { year: 2023, month: 10 },
    location: 'Jakarta, Indonesia',
    summary: 'Assisted in operations and registration desk for DroidJam Indonesia 2023.',
    milestones: [
      { date: { year: 2023, month: 10 }, text: 'Volunteering as Registration Team in DroidJam Indonesia 2023' }
    ]
  },

  // ---------- 7. GoTo DevCamp 2023 (Education) ----------
  {
    id: 'goto-devcamp-2023',
    title: 'GoTo DevCamp 2023',
    subtitle: 'Camp Scholar · Backend Path',
    shortName: 'GoTo DevCamp',
    kind: 'education',
    start: { year: 2023, month: 12 },
    end: { year: 2023, month: 12 },
    location: 'Jakarta, Indonesia',
    summary: 'Highly selective Go programming camp followed by a 24-hour hackathon.',
    milestones: [
      { date: { year: 2023, month: 12, day: 4 }, text: 'Begin journey on GoTo DevCamp 2023' },
      { date: { year: 2023, month: 12, day: 6 }, text: 'Learning about Golang, Clean Architecture, MQ with NSQ, Caching with Redis, Monitoring and Observability with Grafana, Loki, and Jaeger, Automation Test using Java and GoTo internal framework.', tags: ['Go', 'Redis', 'Jaeger'] },
      { date: { year: 2023, month: 12, day: 9 }, text: 'Led team to win Honorable Mention in 24h Hackathon and got titled personally as "The Best and Clean Code" from AVP Engineering of Tokopedia, Gian Giovani, at the end of the DevCamp Journey.' }
    ]
  },

  // ---------- 8. AWS User Group Jakarta (Community) ----------
  {
    id: 'awsug-jakarta',
    title: 'AWS User Group Jakarta',
    subtitle: 'AWS User Group Jakarta Leader',
    shortName: 'AWS UG',
    kind: 'community',
    start: { year: 2023, month: 12 },
    end: { year: 2026, month: 6 },
    location: 'Jakarta, Indonesia',
    summary: 'Led the AWS user community monthly meetups, workshops, and large community day ticketing systems.',
    milestones: [
      { date: { year: 2023, month: 12, day: 10 }, text: 'Volunteering @AWS Community Days Jakarta 2023 at DKATALIS Office.' },
      { date: { year: 2024, month: 11 }, text: 'Volunteering @AWS Community Days Indonesia 2024' },
      { date: { year: 2025, month: 3 }, text: 'Organize comeback AWS UG Jakarta Buka Puasa Bersama Workshop' },
      { date: { year: 2025, month: 6 }, text: 'Organize AWS User Group Monthly Meetup' },
      { date: { year: 2025, month: 8 }, text: 'Organize Future Community Builder Learning Program Kickoff' },
      { date: { year: 2025, month: 9 }, text: 'Promoted as AWS User Group Jakarta Leader' },
      { date: { year: 2025, month: 10 }, text: 'Organize AWS Community Days Indonesia 2025' },
      { date: { year: 2025, month: 10 }, text: 'GulTix Project used as Ticketing System on AWS Community Days 2025', tags: ['GulTix'], links: [{ label: 'GulTix Org', url: 'https://github.com/gultix' }, { label: 'AWS UG Image', url: 'https://github.com/awsugid/gultix' }] },
      { date: { year: 2025, month: 12 }, text: 'Organize Collaboration event with TiDB' },
      { date: { year: 2025, month: 12 }, text: 'Start Developing awscommunity.id and jakarta.awscommunity.id', links: [{ label: 'jakarta.awscommunity.id', url: 'https://github.com/awsugid/jakarta' }] },
      { date: { year: 2026, month: 1 }, text: 'Organize re:Invent re:Cap 2025' },
      { date: { year: 2026, month: 3 }, text: 'Organize and Speak on Kiro Night and Buka Puasa Bersama' },
      { date: { year: 2026, month: 5 }, text: 'Organize Collaboration event with Agora x Couchbase.' },
      { date: { year: 2026, month: 6 }, text: 'Organize and Speaking about Openclaw in Openclaw Meetup.', tags: ['Openclaw'] }
    ]
  },

  // ---------- 9. Avei Graph (Project) ----------
  {
    id: 'avei-graph',
    title: 'Avei Graph',
    subtitle: 'Side Project · Knowledge Graph',
    shortName: 'Avei Graph',
    kind: 'project',
    start: { year: 2024, month: 1 },
    end: { year: 2024, month: 1 },
    location: 'Solo, Indonesia',
    summary: 'A project linking LLMs with Neo4j to visualize knowledge graphs.',
    milestones: [
      { date: { year: 2024, month: 1 }, text: 'Creating Avei Graph, Integrating LLM with Neo4j to build a knowledge graph and visualize the graph with Sigma.js on Nuxt.js. Using Nest.js as Backend connect with a microservice with Avei Gemini using gRPC.', tags: ['Neo4j', 'gRPC', 'Sigma.js'], links: [{ label: 'Avei Graph', url: 'https://github.com/Avei20/avei-nuxt' }] }
    ]
  },

  // ---------- 10. Bangunindo Teknusa Jaya (Work) ----------
  {
    id: 'bangunindo',
    title: 'Bangunindo Teknusa Jaya',
    subtitle: 'Software Engineer — Backend',
    shortName: 'Bangunindo',
    kind: 'work',
    start: { year: 2024, month: 2 },
    end: { year: 2026, month: 2 },
    location: 'Jakarta / Remote',
    summary: 'Managed high-scale backend migration, routing optimization, ETL cli tools, and OpenTelemetry instrumentation.',
    milestones: [
      { date: { year: 2024, month: 2 }, text: 'Entering Bangunindo Teknusa Jaya as Backend Developer' },
      { date: { year: 2024, month: 5 }, text: 'Migrating PHP services into Golang using net/http, chi as routing and sqlx reducing infra cost by 400%', tags: ['Go', 'Chi', 'sqlx'] },
      { date: { year: 2024, month: 6 }, text: 'Implement caching system for Historical Data and the Latest Value using Redis to reduce latency by 96% on second hit.', tags: ['Redis'] },
      { date: { year: 2024, month: 9 }, text: 'Extract, Transform, and Load (ETL) CLI output from 1500 routers in 4G infrastructure nationwide using Go and Python.', tags: ['Go', 'Python'] },
      { date: { year: 2025, month: 10 }, text: 'Migrating Kafka to Redpanda in GKE', tags: ['Redpanda', 'GKE'] },
      { date: { year: 2026, month: 1 }, text: 'Migrated Monitoring and Observability from Sentry into OpenTelemetry stack (Grafana Tempo, Loki, Prometheus). The migrated project is used as standard for Monitoring and Observability all across Bangunindo.', tags: ['OpenTelemetry'] },
      { date: { year: 2026, month: 2 }, text: 'End of Bangunindo Journey' }
    ]
  },

  // ---------- 11. Product Team @ Bliv.id (Work) ----------
  {
    id: 'bliv-product',
    title: 'Product Team @ Bliv.id',
    subtitle: 'Backend & AI Engineer',
    shortName: 'Bliv.id',
    kind: 'work',
    start: { year: 2025, month: 4 },
    end: { year: 2025, month: 10 },
    location: 'Jakarta, Indonesia',
    summary: 'Developed LLM fallback orchestration, integrated OpenLit instrumentation, and Apache NiFi automated pipelines.',
    parentId: 'bangunindo',
    milestones: [
      { date: { year: 2025, month: 4 }, text: 'Entering Product team @Bliv.id' },
      { date: { year: 2025, month: 8 }, text: 'Creating dynamic LLM fallback on every model. Also using OpenLit to instrument LLM Request to make a better Observability and Prompting Tuning.', tags: ['OpenLit', 'LLMs'] },
      { date: { year: 2025, month: 9 }, text: 'Make an AI generated Data Pipeline on top Apache NiFi with Gemini.', tags: ['Apache NiFi', 'Gemini'] },
      { date: { year: 2025, month: 10 }, text: 'End of Product Team Journey' }
    ]
  },

  // ---------- 12. GDG Cloud Jakarta (Community) ----------
  {
    id: 'gdg-cloud-jakarta',
    title: 'GDG Cloud Jakarta',
    subtitle: 'Co-Organizer / Volunteer',
    shortName: 'GDG Cloud',
    kind: 'community',
    start: { year: 2024, month: 4 },
    end: { year: 2025, month: 8 },
    location: 'Jakarta, Indonesia',
    summary: 'Spearheaded event registration, ticketing operations, and spoke at cloud extended meetups.',
    milestones: [
      { date: { year: 2024, month: 4 }, text: 'Start Volunteering in GDG Cloud Jakarta as FoH at Build with AI Jakarta 2024' },
      { date: { year: 2024, month: 7 }, text: 'Volunteering as Registration Team at Google I/O Extended Cloud Jakarta 2024' },
      { date: { year: 2024, month: 8 }, text: 'PIC Registration at #JuaraGCP Season 10 Kick-off Session @Google Office' },
      { date: { year: 2024, month: 11 }, text: 'PIC Registration at DevFest Cloud Jakarta 2024' },
      { date: { year: 2025, month: 2 }, text: 'PIC Registration at #JuaraGCP Season 11 Kick-off Session @Google Office' },
      { date: { year: 2025, month: 5 }, text: 'PIC Registration at Build with AI Cloud Jakarta 2025' },
      { date: { year: 2025, month: 7 }, text: 'Speaking Task Management Agent with ADK and MCP with Firebase Studio at Google Cloud Next Extended 2025', tags: ['Firebase', 'ADK', 'MCP'], links: [{ label: 'ADK Calendar', url: 'https://github.com/Avei20/adk-calendar' }] },
      { date: { year: 2025, month: 8 }, text: 'End of Volunteering in GDG Cloud Jakarta' }
    ]
  },

  // ---------- 13. GDG Bogor (Community) ----------
  {
    id: 'gdg-bogor',
    title: 'GDG Bogor',
    subtitle: 'Co-Organizer / Volunteer',
    shortName: 'GDG Bogor',
    kind: 'community',
    start: { year: 2024, month: 4 },
    end: { year: 2026, month: 4 },
    location: 'Bogor, Indonesia',
    summary: 'Coordinated participant registration workflows and speaker presentations on low-cost GCP deployments.',
    milestones: [
      { date: { year: 2024, month: 4 }, text: 'Start Volunteering in GDG Bogor as Registration Team at IWD Bogor 2024' },
      { date: { year: 2024, month: 7 }, text: 'PIC Registration at Google I/O Extended Bogor 2024' },
      { date: { year: 2024, month: 9 }, text: 'Speaking about Low Cost Deployment in Google Cloud at Road to DevFest Bogor 2024', tags: ['GCP'] },
      { date: { year: 2024, month: 11 }, text: 'PIC Registration Team at Road to DevFest Bogor 2024' },
      { date: { year: 2025, month: 5 }, text: 'PIC Registration Team at Google Cloud Roadshow x Build with AI Bogor 2025' },
      { date: { year: 2025, month: 7 }, text: 'PIC Registration Team at Google I/O Extended Bogor 2025' },
      { date: { year: 2025, month: 12 }, text: 'PIC Registration Team at DevFest Bogor 2025' },
      { date: { year: 2025, month: 12 }, text: 'Gultix start used in GDG Bogor', tags: ['GulTix'], links: [{ label: 'GDG Bogor Image', url: 'https://github.com/gdgbogor/gultix' }] },
      { date: { year: 2026, month: 4 }, text: 'PIC Registration Team at Build with AI Bogor 2026' }
    ]
  },

  // ---------- 14. GulTix (Project) ----------
  {
    id: 'gultix',
    title: 'GulTix Ticketing System',
    subtitle: 'Side Project · Creator',
    shortName: 'GulTix',
    kind: 'project',
    start: { year: 2024, month: 9 },
    end: { year: 2026, month: 3 },
    location: 'Solo / Jakarta',
    summary: 'A wrapped Pretix open-source ticketing solution with integrated Midtrans payment gateway, adopted by GDG Bogor and AWS UG Indonesia.',
    milestones: [
      { date: { year: 2024, month: 9 }, text: 'Begin the Project to level up GDG Cloud Jakarta Ticketing System which are still manually using Google Form. Planned to integrate directly to Bevy and use LLM to help validate participant.' },
      { date: { year: 2025, month: 6 }, text: 'Project dropped. Inspired by Bliv.id and start looking opensource ticketing system and wrap it.' },
      { date: { year: 2025, month: 8 }, text: 'Gultix now is Pretix wrapped with Midtrans Payment Gateway integrated. All of the Pretix features already fulfill the early requirement.', tags: ['Pretix', 'Midtrans'], links: [{ label: 'GulTix Org', url: 'https://github.com/gultix' }] },
      { date: { year: 2025, month: 10 }, text: 'Gultix First time on Production at AWS Community Days Indonesia 2025' },
      { date: { year: 2025, month: 12 }, text: 'Gultix is used in GDG Bogor replacing GOERS as main ticketing system.' },
      { date: { year: 2026, month: 3 }, text: 'Release Docker image version and how to deploy it in AWS UG ID repository and GDG Bogor repository', tags: ['Docker'], links: [{ label: 'AWS UG Image', url: 'https://github.com/awsugid/gultix' }, { label: 'GDG Bogor Image', url: 'https://github.com/gdgbogor/gultix' }] }
    ]
  },

  // ---------- 15. Foodie (Project) ----------
  {
    id: 'foodie',
    title: 'Foodie',
    subtitle: 'Side Project · Creator',
    shortName: 'Foodie',
    kind: 'project',
    start: { year: 2025, month: 5 },
    end: { year: 2025, month: 5 },
    location: 'Hackathon Project',
    summary: 'Hackathon recommendation engine leveraging Google ADK and Firebase MCP.',
    milestones: [
      { date: { year: 2025, month: 5 }, text: 'Creating Foodie in Alibaba Cloud x GoTo hackathon 2025. Leveraging ADK and MCP server to order a food and optimize the discount code as possible.', tags: ['Alibaba Cloud', 'ADK', 'MCP'], links: [{ label: 'Foodie', url: 'https://github.com/YMLWL' }] }
    ]
  },

  // ---------- 16. Tridorian (Work) ----------
  {
    id: 'tridorian',
    title: 'Tridorian',
    subtitle: 'Software Engineer L2 — Backend',
    shortName: 'Tridorian',
    kind: 'work',
    start: { year: 2026, month: 2 },
    end: 'present',
    location: 'Jakarta, Indonesia (hybrid)',
    summary: 'Backend engineering role on hybrid architecture.',
    milestones: [
      { date: { year: 2026, month: 2 }, text: 'Begin of tridorian Journey as Software Engineer L2' }
    ]
  }
];

// Sort by start.year, then start.month ascending.
timeline.sort((a, b) => {
  const ay = a.start.year;
  const by = b.start.year;
  if (ay !== by) return ay - by;
  return (a.start.month ?? 1) - (b.start.month ?? 1);
});
