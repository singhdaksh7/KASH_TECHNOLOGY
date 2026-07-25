export interface CaseStudyFeature {
  title: string;
  description: string;
}

export interface ArchitectureNode {
  label: string;
  description?: string;
}

export interface EngineeringDecision {
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  description: string;
  problem: string[];
  solution: string[];
  features: CaseStudyFeature[];
  architecture: ArchitectureNode[];
  security: string[];
  technologies: string[];
  decisions: EngineeringDecision[];
}
