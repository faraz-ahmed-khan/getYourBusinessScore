/** Active assessment intake — question answer shapes (Zoho scoring is server-side). */

export type YesNo = 'yes' | 'no';

export interface IntakeAnswers {
  hasEIN: YesNo;
  hasBusinessBankAccount: YesNo;
  hasBookKeeping: 'yes' | 'outsourced' | 'no';
  hasFinancialStatements: 'yes' | 'partial' | 'no';
  hasDefinedOffers: 'yes' | 'in-progress' | 'no';
  hasPricingDefined: 'yes' | 'tiered' | 'no';
  hasWrittenDescriptions: 'yes' | 'partial' | 'no';
  hasCustomers: YesNo;
  hasRepeatCustomers: 'yes' | 'unknown' | 'no';
  hasPartners: 'yes' | 'informal' | 'no';
}
