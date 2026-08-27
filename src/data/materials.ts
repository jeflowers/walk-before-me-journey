export interface MaterialItem {
  type: 'facilitator' | 'handout' | 'reference' | 'print';
  label: string;
  icon: string;
  filename: string;
}

const STUDY_MATERIALS: MaterialItem[] = [
  { type: 'facilitator', label: 'Facilitator Guide', icon: 'school', filename: 'WBMJ_Psalm26_Facilitator_Guide.pdf' },
  { type: 'handout', label: 'Student Handout', icon: 'description', filename: 'WBMJ_Psalm26_Student_Handout.pdf' },
  { type: 'reference', label: 'Quick Reference Card', icon: 'badge', filename: 'WBMJ_Psalm26_Quick_Reference.pdf' },
  { type: 'print', label: 'Print Study', icon: 'print', filename: 'WBMJ_Psalm26_Print_Study.pdf' },
];

export function getMaterials(_waypointNumber: number): MaterialItem[] {
  return STUDY_MATERIALS;
}

export function getMaterialUrl(filename: string): string {
  return `/materials/${filename}`;
}
