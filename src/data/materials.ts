export interface MaterialItem {
  type: 'facilitator' | 'handout' | 'reference' | 'print';
  label: string;
  icon: string;
  filename: string;
}

export interface WaypointMaterials {
  waypointNumber: number;
  items: MaterialItem[];
}

const MATERIAL_LABELS: Record<MaterialItem['type'], { label: string; icon: string }> = {
  facilitator: { label: 'Facilitator Guide', icon: 'school' },
  handout: { label: 'Student Handout', icon: 'description' },
  reference: { label: 'Quick Reference Card', icon: 'badge' },
  print: { label: 'Print Study', icon: 'print' },
};

function mat(type: MaterialItem['type'], filename: string): MaterialItem {
  return { type, ...MATERIAL_LABELS[type], filename };
}

export const MATERIALS_BY_WAYPOINT: WaypointMaterials[] = [
  {
    waypointNumber: 1,
    items: [
      mat('facilitator', 'wp01-facilitator-guide.pdf'),
      mat('handout', 'wp01-student-handout.pdf'),
      mat('reference', 'wp01-quick-reference.pdf'),
      mat('print', 'wp01-print-study.pdf'),
    ],
  },
  {
    waypointNumber: 2,
    items: [
      mat('facilitator', 'wp02-facilitator-guide.pdf'),
      mat('handout', 'wp02-student-handout.pdf'),
      mat('reference', 'wp02-quick-reference.pdf'),
      mat('print', 'wp02-print-study.pdf'),
    ],
  },
  {
    waypointNumber: 3,
    items: [
      mat('facilitator', 'wp03-facilitator-guide.pdf'),
      mat('handout', 'wp03-student-handout.pdf'),
      mat('reference', 'wp03-quick-reference.pdf'),
      mat('print', 'wp03-print-study.pdf'),
    ],
  },
  {
    waypointNumber: 4,
    items: [
      mat('facilitator', 'wp04-facilitator-guide.pdf'),
      mat('handout', 'wp04-student-handout.pdf'),
      mat('reference', 'wp04-quick-reference.pdf'),
      mat('print', 'wp04-print-study.pdf'),
    ],
  },
  {
    waypointNumber: 5,
    items: [
      mat('facilitator', 'wp05-facilitator-guide.pdf'),
      mat('handout', 'wp05-student-handout.pdf'),
      mat('reference', 'wp05-quick-reference.pdf'),
      mat('print', 'wp05-print-study.pdf'),
    ],
  },
  {
    waypointNumber: 6,
    items: [
      mat('facilitator', 'wp06-facilitator-guide.pdf'),
      mat('handout', 'wp06-student-handout.pdf'),
      mat('reference', 'wp06-quick-reference.pdf'),
      mat('print', 'wp06-print-study.pdf'),
    ],
  },
  {
    waypointNumber: 7,
    items: [
      mat('facilitator', 'wp07-facilitator-guide.pdf'),
      mat('handout', 'wp07-student-handout.pdf'),
      mat('reference', 'wp07-quick-reference.pdf'),
      mat('print', 'wp07-print-study.pdf'),
    ],
  },
];

export function getMaterials(waypointNumber: number): MaterialItem[] {
  const entry = MATERIALS_BY_WAYPOINT.find((m) => m.waypointNumber === waypointNumber);
  return entry?.items ?? [];
}

export function getMaterialUrl(filename: string): string {
  return `/materials/${filename}`;
}
