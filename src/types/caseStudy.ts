export interface TestCase {
  id: string;
  name: string;
  category: 'Normal' | 'Boundary' | 'Edge Case' | 'Invalid Input';
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  explanation: string;
}

export interface FlowchartNode {
  id: string;
  type: 'terminal' | 'input' | 'process' | 'decision' | 'output';
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
  direction?: 'down' | 'right' | 'left' | 'up';
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  svgCode?: string;
}

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  shortDomain: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeComplexity: string;
  spaceComplexity: string;
  
  // 10 Mandatory Deliverables
  deliverables: {
    // 1. Problem Statement
    problemStatement: {
      background: string;
      coreChallenge: string;
      stakeholders: string[];
      functionalScope: string[];
    };

    // 2. Objectives
    objectives: {
      primary: string[];
      secondary: string[];
      metricsOfSuccess: string[];
    };

    // 3. Assumptions
    assumptions: {
      dataAssumptions: string[];
      operationalAssumptions: string[];
      boundaryLimits: string[];
      errorHandlingPolicy: string[];
    };

    // 4. Algorithm
    algorithm: {
      steps: Array<{
        stepNumber: number;
        title: string;
        description: string;
        substeps?: string[];
      }>;
    };

    // 5. Flowchart
    flowchart: FlowchartData;

    // 6. Pseudocode
    pseudocode: string;

    // 7. Python Source Code
    pythonCode: string;

    // 8. Test Cases
    testCases: TestCase[];

    // 9. Output Screenshots
    outputScreenshot: {
      terminalCommand: string;
      rawConsoleOutput: string;
      executionTimeMs: number;
      exitCode: number;
      renderedTimestamp: string;
    };

    // 10. Conclusion
    conclusion: {
      summary: string;
      timeComplexityAnalysis: string;
      spaceComplexityAnalysis: string;
      keyLearnings: string[];
      realWorldApplications: string[];
      limitationsAndFutureScope: string[];
    };
  };
}
