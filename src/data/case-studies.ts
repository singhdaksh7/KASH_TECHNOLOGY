import { CaseStudy } from "@/types/case-study";

export const CASE_STUDIES: Record<string, CaseStudy> = {
  exora: {
    slug: "exora",
    title: "Exora Cryptocurrency Exchange",
    category: "Fintech Engineering",
    description: "A secure cryptocurrency exchange platform designed around financial integrity, user security and operational control.",
    problem: [
      "Secure user access and authentication",
      "Reliable financial records and ledger integrity",
      "Controlled deposit and withdrawal workflows",
      "Administrative oversight and monitoring",
      "Consistent transaction processing",
      "Clear separation between user and operational permissions"
    ],
    solution: [
      "Secure authentication architecture with robust session handling",
      "Role-based access control for administrative and user boundaries",
      "Double-entry ledger system for accurate financial tracking",
      "Maker-checker approvals for sensitive operational actions",
      "Idempotent financial operations to prevent duplicate processing",
      "API-driven frontend and backend separation"
    ],
    features: [
      { title: "Account Security", description: "Multi-layered authentication and secure session management." },
      { title: "Market Experience", description: "Real-time portfolio and market data visualization." },
      { title: "Financial Ledger", description: "Immutable double-entry accounting system." },
      { title: "Maker-Checker", description: "Dual-approval workflows for critical administrative actions." },
      { title: "Transaction History", description: "Comprehensive audit trails for all user and admin actions." },
      { title: "Operational Controls", description: "Dedicated portals for platform monitoring and oversight." }
    ],
    architecture: [
      { label: "User Interface", description: "Next.js frontend with isolated user/admin roles." },
      { label: "API Layer", description: "Secure REST endpoints with strict validation." },
      { label: "Authentication & RBAC", description: "Token-based access control." },
      { label: "Trading & Wallet Services", description: "Core business logic and matching." },
      { label: "Double-Entry Ledger", description: "Financial state management." },
      { label: "PostgreSQL", description: "Primary relational database." },
      { label: "Background Processing", description: "Asynchronous task workers." },
      { label: "Cloud Infrastructure", description: "Scalable AWS deployment." }
    ],
    security: [
      "Password security with strong hashing algorithms",
      "Token rotation and secure cookie management",
      "Role-based permissions enforcing least privilege",
      "Idempotency keys for all financial state changes",
      "Ledger integrity checks and balances",
      "Approval controls for sensitive data modifications",
      "Strict environment configuration management",
      "Automated production safety checks"
    ],
    technologies: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Docker", "AWS", "REST APIs"],
    decisions: [
      { title: "Double-Entry Ledger", description: "Implemented a double-entry ledger instead of simple balance mutation to ensure absolute financial integrity." },
      { title: "Maker-Checker Approval", description: "Required dual authorization for sensitive operations to prevent single-point compromises." },
      { title: "Idempotent Requests", description: "Enforced idempotency on all financial endpoints to safely handle network retries." },
      { title: "Separated Permissions", description: "Strictly isolated user and administrative permission boundaries at the API level." }
    ]
  },
  schoolsync: {
    slug: "schoolsync",
    title: "SchoolSync Multi-Tenant School ERP",
    category: "SaaS and ERP Engineering",
    description: "A digital operating system for schools, connecting administrators, teachers, parents and students through one secure platform.",
    problem: [
      "Fragmented student records across disparate systems",
      "Manual and error-prone attendance tracking",
      "Complex fee tracking and collection processes",
      "Communication gaps between school and home",
      "Inefficient homework and evaluation workflows",
      "Separate operational needs for administrators, teachers and parents",
      "Strict requirement for data isolation between different schools"
    ],
    solution: [
      "Multi-tenant platform design with strict data isolation",
      "Dedicated, role-aware experiences for admins, teachers, and parents",
      "Streamlined attendance and timetable workflows",
      "Integrated fee and payment tracking workflows",
      "Centralized homework and academic evaluation tracking",
      "Real-time parent visibility into student progress",
      "Mobile-ready APIs for cross-platform accessibility"
    ],
    features: [
      { title: "Multi-Tenant Administration", description: "Securely isolated data environments for each registered school." },
      { title: "Student Management", description: "Centralized profiles with academic and personal records." },
      { title: "Teacher Workflows", description: "Dedicated tools for class management and grading." },
      { title: "Parent Portal", description: "Real-time insights into attendance, fees, and performance." },
      { title: "Attendance Tracking", description: "Fast, accurate daily attendance logging." },
      { title: "Fee Management", description: "Integrated fee scheduling and payment tracking." }
    ],
    architecture: [
      { label: "Admin / Teacher / Parent Interfaces", description: "Role-specific frontend dashboards." },
      { label: "Tenant-Aware API Layer", description: "Routing logic ensuring school data separation." },
      { label: "Authentication & Permissions", description: "Identity verification and role resolution." },
      { label: "School Operations", description: "Core administration and scheduling logic." },
      { label: "Academic & Fee Modules", description: "Grading and financial tracking systems." },
      { label: "PostgreSQL & Prisma", description: "Relational data persistence." },
      { label: "Cache & Background Jobs", description: "Redis caching and async notifications." },
      { label: "AWS Infrastructure", description: "High-availability cloud hosting." }
    ],
    security: [
      "Tenant data isolation at the database query level",
      "Strict role-based access for staff and faculty",
      "Guardian authentication linked to specific student profiles",
      "School-level authorization checks on all API requests",
      "Payment status integrity and transaction verification",
      "Controlled access to sensitive student information",
      "Secure cloud credentials management",
      "Environment validation on startup"
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Razorpay", "Redis", "AWS", "REST APIs"],
    decisions: [
      { title: "Tenant-Aware Data Access", description: "Enforced tenant ID checks at every protected boundary to prevent data leakage." },
      { title: "Separate Role Experiences", description: "Built distinct dashboards for admins, teachers, and parents rather than one overcrowded interface." },
      { title: "Mobile-Ready API Design", description: "Structured APIs to efficiently serve both the web dashboard and future mobile clients." },
      { title: "Centralized Guardian Relationships", description: "Modeled complex student-guardian relationships to accurately manage data access." }
    ]
  },
  "crypto-launchpad": {
    slug: "crypto-launchpad",
    title: "BSC Token and Presale Launchpad",
    category: "Blockchain Engineering",
    description: "A secure token creation and presale infrastructure built for Binance Smart Chain.",
    problem: [
      "Complexity of deploying secure smart contracts",
      "Difficult presale parameter configuration",
      "Enforcing fair contribution limits",
      "Managing creator access controls securely",
      "Handling refunds safely if goals are not met",
      "Navigating wallet connections and network requirements",
      "Mitigating the risk of incorrect contract parameters"
    ],
    solution: [
      "Automated BEP-20 token deployment workflow",
      "Standardized USDT-based presale mechanics",
      "Configurable contribution limits and anti-whale controls",
      "Emergency refund logic built into the contract layer",
      "Strict creator access gating",
      "Network-aware interfaces preventing wrong-chain interactions",
      "Comprehensive smart-contract testing and review"
    ],
    features: [
      { title: "Token Creation", description: "No-code generation of standard BEP-20 tokens." },
      { title: "Presale Configuration", description: "Customizable soft/hard caps and pricing." },
      { title: "USDT Contributions", description: "Stablecoin-denominated fundraising." },
      { title: "Anti-Whale Controls", description: "Configurable minimum and maximum contribution limits." },
      { title: "Emergency Refunds", description: "Automated refund mechanisms if soft caps fail." },
      { title: "Public Presale Page", description: "Consumer-facing interfaces for token sales." }
    ],
    architecture: [
      { label: "Creator Interface", description: "Frontend configuration and deployment dashboard." },
      { label: "Access & Validation Layer", description: "Preflight checks for parameters and permissions." },
      { label: "Wallet & Network Context", description: "Web3 provider integration and network validation." },
      { label: "Launchpad Service", description: "Transaction preparation and state monitoring." },
      { label: "Smart Contracts", description: "On-chain execution of token and presale logic." },
      { label: "BSC Network", description: "Binance Smart Chain mainnet/testnet." },
      { label: "Events & Indexed Data", description: "On-chain event listening for UI updates." }
    ],
    security: [
      "Access gating for contract administration",
      "Strict parameter validation before deployment",
      "Presale allocation and supply mathematics checks",
      "On-chain contribution limit enforcement",
      "Trustless emergency refund mechanisms",
      "Safe token handling to prevent locking",
      "Network validation to ensure BSC connectivity",
      "Extensive automated contract testing",
      "Production configuration guards"
    ],
    technologies: ["Solidity", "Next.js", "TypeScript", "Ethers.js", "Binance Smart Chain", "USDT", "Vitest", "Smart-contract testing tools"],
    decisions: [
      { title: "USDT-Only Presales", description: "Restricted presales to USDT to provide predictable payment denomination and reduce volatility risk." },
      { title: "Explicit Contribution Limits", description: "Enforced strict allocation validation to prevent single wallets from dominating a presale." },
      { title: "Contract-Level Refunds", description: "Implemented emergency refund handling entirely within the smart contract to remove trust assumptions." },
      { title: "Frontend Preflight Checks", description: "Added extensive validation on the frontend before allowing users to sign blockchain transactions." }
    ]
  }
};
