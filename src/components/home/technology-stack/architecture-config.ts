/**
 * 3D Architecture Visual Configuration & Animation Topology
 *
 * Each stage defines:
 * - Image paths (WebP + high-res PNG fallback)
 * - Native aspect ratio and SVG viewBox (1672 x 941)
 * - Precise SVG connection paths mapped to the 3D cables/buses
 * - Source and destination node anchor coordinates (x, y)
 * - Packet sequences, pulse timings, and localized glow nodes
 */

export interface ArchitectureNode {
  id: string;
  name: string;
  cx: number;
  cy: number;
  r?: number;
  color?: string; // Hex or gradient key
  glowColor?: string;
  labelPosition?: "top" | "bottom" | "left" | "right";
}

export interface ConnectionPath {
  id: string;
  path: string; // SVG path data (d)
  sourceId: string;
  targetId: string;
  color?: string;
  glowColor?: string;
  reverse?: boolean;
}

export interface PacketSequence {
  id: string;
  pathId: string;
  duration: number; // seconds
  delay: number; // seconds
  size?: number; // radius px
  color?: string;
  coreColor?: string;
  tailLength?: number;
}

export interface ArchitectureStageConfig {
  stageId: string;
  title: string;
  imageWebp: string;
  imagePng: string;
  width: number;
  height: number;
  nodes: ArchitectureNode[];
  paths: ConnectionPath[];
  packets: PacketSequence[];
  ambientGlowNodes: string[]; // Node IDs that pulse subtly
}

/**
 * 5 ARCHITECTURE STAGES (ViewBox: 0 0 1672 941)
 */
export const ARCHITECTURE_CONFIGS: Record<number, ArchitectureStageConfig> = {
  // =========================================================================
  // STAGE 01: Engineering without limitations.
  // Composition: Left browser/website -> Center app servers -> Right database -> Top cloud
  // =========================================================================
  0: {
    stageId: "engineering",
    title: "Engineering without limitations.",
    imageWebp: "/images/technology-stack/01-software-engineering.webp",
    imagePng: "/images/technology-stack/01-software-engineering.png",
    width: 1672,
    height: 941,
    nodes: [
      { id: "web-client", name: "Client Browser / Web", cx: 420, cy: 520, r: 16, color: "#FF5A00" },
      { id: "mobile-client", name: "Mobile App (iOS/Android)", cx: 330, cy: 620, r: 14, color: "#FF8A3D" },
      { id: "app-server", name: "Application Runtime (Next.js / Node)", cx: 836, cy: 460, r: 24, color: "#3B82F6" },
      { id: "database", name: "Relational Persistence (PostgreSQL)", cx: 1250, cy: 540, r: 22, color: "#10B981" },
      { id: "cloud-edge", name: "Cloud Edge & Global CDN", cx: 836, cy: 210, r: 20, color: "#8B5CF6" },
    ],
    paths: [
      // Web Client -> App Server (Isometric bus)
      { id: "p1-web-server", path: "M 420 520 Q 620 500 836 460", sourceId: "web-client", targetId: "app-server" },
      // Mobile Client -> App Server
      { id: "p1-mobile-server", path: "M 330 620 Q 580 570 836 460", sourceId: "mobile-client", targetId: "app-server" },
      // App Server -> Database
      { id: "p1-server-db", path: "M 836 460 Q 1040 480 1250 540", sourceId: "app-server", targetId: "database" },
      // Database Return -> App Server
      { id: "p1-db-server", path: "M 1250 540 Q 1040 440 836 460", sourceId: "database", targetId: "app-server", reverse: true },
      // App Server -> Cloud Edge
      { id: "p1-server-cloud", path: "M 836 460 L 836 210", sourceId: "app-server", targetId: "cloud-edge" },
    ],
    packets: [
      { id: "pack-1", pathId: "p1-web-server", duration: 1.8, delay: 0.2, color: "#FF5A00", coreColor: "#FFF" },
      { id: "pack-2", pathId: "p1-server-db", duration: 1.5, delay: 1.2, color: "#3B82F6", coreColor: "#FFF" },
      { id: "pack-3", pathId: "p1-db-server", duration: 1.5, delay: 2.2, color: "#10B981", coreColor: "#FFF" },
      { id: "pack-4", pathId: "p1-server-cloud", duration: 1.4, delay: 3.0, color: "#8B5CF6", coreColor: "#FFF" },
      { id: "pack-5", pathId: "p1-mobile-server", duration: 2.0, delay: 1.6, color: "#FF8A3D", coreColor: "#FFF" },
    ],
    ambientGlowNodes: ["app-server", "database", "cloud-edge"],
  },

  // =========================================================================
  // STAGE 02: Connected systems. Seamless operations.
  // Composition: Central integration hub with peripheral CRM, ERP, Web, Mobile, Analytics nodes
  // =========================================================================
  1: {
    stageId: "connected",
    title: "Connected systems. Seamless operations.",
    imageWebp: "/images/technology-stack/02-connected-systems.webp",
    imagePng: "/images/technology-stack/02-connected-systems.png",
    width: 1672,
    height: 941,
    nodes: [
      { id: "mesh-hub", name: "KASH Central Integration Hub", cx: 836, cy: 470, r: 30, color: "#FF5A00" },
      { id: "node-web", name: "High-Speed Website", cx: 480, cy: 300, r: 16, color: "#FF8A3D" },
      { id: "node-crm", name: "Customer CRM", cx: 1190, cy: 300, r: 18, color: "#3B82F6" },
      { id: "node-erp", name: "Operations ERP", cx: 440, cy: 660, r: 18, color: "#F59E0B" },
      { id: "node-mobile", name: "Mobile Applications", cx: 1230, cy: 660, r: 16, color: "#10B981" },
      { id: "node-analytics", name: "Unified Analytics Core", cx: 836, cy: 740, r: 18, color: "#EC4899" },
    ],
    paths: [
      { id: "p2-hub-web", path: "M 480 300 Q 640 370 836 470", sourceId: "node-web", targetId: "mesh-hub" },
      { id: "p2-hub-crm", path: "M 836 470 Q 1020 370 1190 300", sourceId: "mesh-hub", targetId: "node-crm" },
      { id: "p2-hub-erp", path: "M 440 660 Q 620 580 836 470", sourceId: "node-erp", targetId: "mesh-hub" },
      { id: "p2-hub-mobile", path: "M 836 470 Q 1050 580 1230 660", sourceId: "mesh-hub", targetId: "node-mobile" },
      { id: "p2-hub-analytics", path: "M 836 470 L 836 740", sourceId: "mesh-hub", targetId: "node-analytics" },
    ],
    packets: [
      { id: "pack-c1", pathId: "p2-hub-web", duration: 1.6, delay: 0.1, color: "#FF8A3D", coreColor: "#FFF" },
      { id: "pack-c2", pathId: "p2-hub-crm", duration: 1.8, delay: 0.9, color: "#3B82F6", coreColor: "#FFF" },
      { id: "pack-c3", pathId: "p2-hub-erp", duration: 1.7, delay: 1.4, color: "#F59E0B", coreColor: "#FFF" },
      { id: "pack-c4", pathId: "p2-hub-mobile", duration: 1.9, delay: 2.1, color: "#10B981", coreColor: "#FFF" },
      { id: "pack-c5", pathId: "p2-hub-analytics", duration: 1.5, delay: 2.7, color: "#EC4899", coreColor: "#FFF" },
    ],
    ambientGlowNodes: ["mesh-hub", "node-crm", "node-erp"],
  },

  // =========================================================================
  // STAGE 03: Built around your business.
  // Composition: Visual workflow canvas, conditional decision branches, automated gears
  // =========================================================================
  2: {
    stageId: "workflow",
    title: "Built around your business.",
    imageWebp: "/images/technology-stack/03-custom-workflows.webp",
    imagePng: "/images/technology-stack/03-custom-workflows.png",
    width: 1672,
    height: 941,
    nodes: [
      { id: "trigger-in", name: "Inbound Business Event", cx: 410, cy: 380, r: 16, color: "#10B981" },
      { id: "rules-engine", name: "Deterministic Rules Engine", cx: 720, cy: 450, r: 24, color: "#FF5A00" },
      { id: "decision-branch-1", name: "Enterprise Dispatch", cx: 1040, cy: 350, r: 18, color: "#3B82F6" },
      { id: "decision-branch-2", name: "Operations Approval", cx: 1040, cy: 560, r: 18, color: "#F59E0B" },
      { id: "action-complete", name: "Action Finalization", cx: 1320, cy: 450, r: 20, color: "#8B5CF6" },
    ],
    paths: [
      { id: "p3-in-rules", path: "M 410 380 Q 560 400 720 450", sourceId: "trigger-in", targetId: "rules-engine" },
      { id: "p3-rules-b1", path: "M 720 450 Q 880 390 1040 350", sourceId: "rules-engine", targetId: "decision-branch-1" },
      { id: "p3-rules-b2", path: "M 720 450 Q 880 520 1040 560", sourceId: "rules-engine", targetId: "decision-branch-2" },
      { id: "p3-b1-complete", path: "M 1040 350 Q 1190 390 1320 450", sourceId: "decision-branch-1", targetId: "action-complete" },
      { id: "p3-b2-complete", path: "M 1040 560 Q 1190 510 1320 450", sourceId: "decision-branch-2", targetId: "action-complete" },
    ],
    packets: [
      { id: "pack-w1", pathId: "p3-in-rules", duration: 1.5, delay: 0.2, color: "#10B981", coreColor: "#FFF" },
      { id: "pack-w2", pathId: "p3-rules-b1", duration: 1.4, delay: 1.1, color: "#FF5A00", coreColor: "#FFF" },
      { id: "pack-w3", pathId: "p3-rules-b2", duration: 1.4, delay: 1.3, color: "#F59E0B", coreColor: "#FFF" },
      { id: "pack-w4", pathId: "p3-b1-complete", duration: 1.5, delay: 2.2, color: "#3B82F6", coreColor: "#FFF" },
      { id: "pack-w5", pathId: "p3-b2-complete", duration: 1.5, delay: 2.4, color: "#8B5CF6", coreColor: "#FFF" },
    ],
    ambientGlowNodes: ["rules-engine", "action-complete"],
  },

  // =========================================================================
  // STAGE 04: Intelligent workflows. Adaptive AI.
  // Composition: Central glowing neural AI core, data intake rays, insight channels
  // =========================================================================
  3: {
    stageId: "ai",
    title: "Intelligent workflows. Adaptive AI.",
    imageWebp: "/images/technology-stack/04-adaptive-ai.webp",
    imagePng: "/images/technology-stack/04-adaptive-ai.png",
    width: 1672,
    height: 941,
    nodes: [
      { id: "ai-core", name: "KASH Adaptive Intelligence Core", cx: 836, cy: 450, r: 36, color: "#FF5A00" },
      { id: "ai-inflow-left", name: "Structured ERP / CRM Vectors", cx: 380, cy: 450, r: 18, color: "#3B82F6" },
      { id: "ai-inflow-top", name: "Unstructured Document Ingestion", cx: 836, cy: 190, r: 18, color: "#10B981" },
      { id: "ai-outflow-dash", name: "Real-Time Executive Intelligence", cx: 1280, cy: 370, r: 20, color: "#FF8A3D" },
      { id: "ai-outflow-action", name: "Autonomous Action Triggers", cx: 1260, cy: 590, r: 20, color: "#8B5CF6" },
    ],
    paths: [
      { id: "p4-left-core", path: "M 380 450 L 836 450", sourceId: "ai-inflow-left", targetId: "ai-core" },
      { id: "p4-top-core", path: "M 836 190 L 836 450", sourceId: "ai-inflow-top", targetId: "ai-core" },
      { id: "p4-core-dash", path: "M 836 450 Q 1060 390 1280 370", sourceId: "ai-core", targetId: "ai-outflow-dash" },
      { id: "p4-core-action", path: "M 836 450 Q 1060 540 1260 590", sourceId: "ai-core", targetId: "ai-outflow-action" },
    ],
    packets: [
      { id: "pack-ai-1", pathId: "p4-left-core", duration: 1.4, delay: 0.1, color: "#3B82F6", coreColor: "#FFF" },
      { id: "pack-ai-2", pathId: "p4-top-core", duration: 1.5, delay: 0.7, color: "#10B981", coreColor: "#FFF" },
      { id: "pack-ai-3", pathId: "p4-core-dash", duration: 1.6, delay: 1.8, color: "#FF5A00", coreColor: "#FFF" },
      { id: "pack-ai-4", pathId: "p4-core-action", duration: 1.7, delay: 2.2, color: "#8B5CF6", coreColor: "#FFF" },
    ],
    ambientGlowNodes: ["ai-core"],
  },

  // =========================================================================
  // STAGE 05: Secure infrastructure. Built to scale.
  // Composition: Ingress edge -> Load balancer -> Multi-container pods -> Encrypted DB -> Cold backups
  // =========================================================================
  4: {
    stageId: "infra",
    title: "Secure infrastructure. Built to scale.",
    imageWebp: "/images/technology-stack/05-secure-infrastructure.webp",
    imagePng: "/images/technology-stack/05-secure-infrastructure.png",
    width: 1672,
    height: 941,
    nodes: [
      { id: "sec-ingress", name: "TLS 1.3 Edge Shield & DDoS Filter", cx: 430, cy: 340, r: 20, color: "#3B82F6" },
      { id: "load-balancer", name: "Container Load Balancer", cx: 720, cy: 450, r: 22, color: "#FF5A00" },
      { id: "app-containers", name: "Isolated Application Pods", cx: 1040, cy: 400, r: 24, color: "#10B981" },
      { id: "secure-db", name: "Encrypted Storage (AES-256)", cx: 1040, cy: 620, r: 20, color: "#F59E0B" },
      { id: "backup-vault", name: "Automated Offsite Snapshots", cx: 1350, cy: 510, r: 22, color: "#8B5CF6" },
    ],
    paths: [
      { id: "p5-in-lb", path: "M 430 340 Q 570 380 720 450", sourceId: "sec-ingress", targetId: "load-balancer" },
      { id: "p5-lb-pods", path: "M 720 450 Q 880 410 1040 400", sourceId: "load-balancer", targetId: "app-containers" },
      { id: "p5-pods-db", path: "M 1040 400 L 1040 620", sourceId: "app-containers", targetId: "secure-db" },
      { id: "p5-db-vault", path: "M 1040 620 Q 1200 580 1350 510", sourceId: "secure-db", targetId: "backup-vault" },
    ],
    packets: [
      { id: "pack-s1", pathId: "p5-in-lb", duration: 1.5, delay: 0.1, color: "#3B82F6", coreColor: "#FFF" },
      { id: "pack-s2", pathId: "p5-lb-pods", duration: 1.6, delay: 1.0, color: "#FF5A00", coreColor: "#FFF" },
      { id: "pack-s3", pathId: "p5-pods-db", duration: 1.4, delay: 1.9, color: "#10B981", coreColor: "#FFF" },
      { id: "pack-s4", pathId: "p5-db-vault", duration: 1.8, delay: 2.7, color: "#8B5CF6", coreColor: "#FFF" },
    ],
    ambientGlowNodes: ["sec-ingress", "load-balancer", "backup-vault"],
  },
};
