export interface GeneralRequestOptions {
  headers?: HeadersInit;
  body?: BodyInit;
}

export interface Selection {
  id: number;
  startIndex: number;
  length: number;
  text: string;
}

export interface NewSelection extends Selection {
  selectionId: number;
}

export interface OverlappingProps {
  startIndex: number;
  length: number;
  allSelections: Selection[];
}
