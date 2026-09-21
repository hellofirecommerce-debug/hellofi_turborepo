export interface ResaleFactor {
  title: string;
  description: string;
}

export interface TrustPoint {
  title: string;
  body: string;
}

export interface SellSEOContentItem {
  heading: string;
  introParagraphs: string[];
  resaleFactorsHeading?: string;
  resaleFactorsSubtext?: string;
  resaleFactors?: ResaleFactor[];
  cityAvailability?: {
    heading: string;
    body: string;
  };
  trustSection?: {
    heading: string;
    intro: string;
    points: TrustPoint[];
  };
  aboutHelloFi?: string;
}
