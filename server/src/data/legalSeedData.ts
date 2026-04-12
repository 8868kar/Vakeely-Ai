import { ILegalAct } from '../types/index.js';

const legalSeedData: Partial<ILegalAct>[] = [
  // ─── CRIMINAL ────────────────────────────────────────────────────────────
  {
    title: 'Indian Penal Code',
    shortTitle: 'IPC',
    category: 'Criminal',
    year: 1800,
    description: 'The Indian Penal Code is the official criminal code of India covering all substantive aspects of criminal law including offenses against the state, person, and property.',
    keywords: ['crime', 'punishment', 'offense', 'criminal', 'penal', 'ipc', 'cognizable', 'non-cognizable'],
    sections: [
      { number: '302', title: 'Punishment for Murder', description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.', keywords: ['murder', 'killing', 'death', 'homicide', '302 ipc'], penalty: 'Death or life imprisonment + fine' },
      { number: '304', title: 'Culpable Homicide Not Amounting to Murder', description: 'Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment up to 10 years, and fine.', keywords: ['culpable homicide', 'killing', 'manslaughter'], penalty: 'Life imprisonment or up to 10 years + fine' },
      { number: '304A', title: 'Death by Negligence', description: 'Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide — road accidents, medical negligence fall here.', keywords: ['negligence', 'death by negligence', 'rash driving', 'medical negligence', 'road accident', 'accident'], penalty: 'Imprisonment up to 2 years or fine or both' },
      { number: '323', title: 'Punishment for Voluntarily Causing Hurt', description: 'Whoever voluntarily causes hurt shall be punished with imprisonment up to one year, or with fine up to Rs 1000, or with both.', keywords: ['hurt', 'assault', 'beating', 'grievous hurt', 'physical violence'], penalty: 'Imprisonment up to 1 year or fine up to Rs 1000' },
      { number: '354', title: 'Assault or Criminal Force to Woman with Intent to Outrage Modesty', description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely to outrage her modesty.', keywords: ['assault', 'woman', 'modesty', 'harassment', 'molestation', 'sexual harassment'], penalty: 'Imprisonment 1 to 5 years + fine' },
      { number: '354A', title: 'Sexual Harassment', description: 'A man committing physical contact and advances involving unwelcome and explicit sexual overtures, demand for sexual favours.', keywords: ['sexual harassment', 'workplace harassment', 'unwelcome advances', 'molestation'], penalty: 'Imprisonment up to 3 years or fine or both' },
      { number: '376', title: 'Punishment for Rape', description: 'Whoever commits rape shall be punished with rigorous imprisonment for a term not less than ten years, which may extend to life imprisonment, and shall also be liable to fine.', keywords: ['rape', 'sexual assault', 'sexual offense', 'pocso'], penalty: 'Rigorous imprisonment not less than 10 years, may extend to life + fine' },
      { number: '379', title: 'Punishment for Theft', description: 'Whoever commits theft shall be punished with imprisonment which may extend to three years, or with fine, or with both.', keywords: ['theft', 'stealing', 'stolen property', 'shoplifting', 'pickpocket'], penalty: 'Imprisonment up to 3 years or fine or both' },
      { number: '392', title: 'Punishment for Robbery', description: 'Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine.', keywords: ['robbery', 'loot', 'dacoity', 'chain snatching', 'mugging'], penalty: 'Rigorous imprisonment up to 10 years + fine' },
      { number: '406', title: 'Punishment for Criminal Breach of Trust', description: 'Whoever commits criminal breach of trust shall be punished with imprisonment which may extend to three years, or with fine, or with both.', keywords: ['breach of trust', 'misappropriation', 'embezzlement', 'criminal breach'], penalty: 'Imprisonment up to 3 years or fine or both' },
      { number: '420', title: 'Cheating and Dishonestly Inducing Delivery of Property', description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security.', keywords: ['cheating', 'fraud', 'dishonest', 'scam', 'deception', 'con', 'ponzi', 'online fraud'], penalty: 'Imprisonment up to 7 years + fine' },
      { number: '498A', title: 'Cruelty by Husband or His Relatives', description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty — physical, mental, or economic abuse including dowry demands.', keywords: ['cruelty', 'husband', 'dowry', 'domestic violence', 'matrimonial cruelty', '498a'], penalty: 'Imprisonment up to 3 years + fine' },
      { number: '499', title: 'Defamation', description: 'Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm the reputation of such person.', keywords: ['defamation', 'slander', 'libel', 'reputation', 'false accusation'], penalty: 'Imprisonment up to 2 years or fine or both' },
      { number: '506', title: 'Criminal Intimidation', description: 'Whoever commits the offense of criminal intimidation shall be punished with imprisonment which may extend to two years, or with fine, or with both.', keywords: ['threat', 'intimidation', 'threatening', 'extortion threat', 'blackmail'], penalty: 'Imprisonment up to 2 years or fine or both' },
      { number: '509', title: 'Word, Gesture or Act Intended to Insult Modesty of a Woman', description: 'Whoever, intending to insult the modesty of any woman, utters any word, makes any sound or gesture, exhibits any object.', keywords: ['eve teasing', 'woman insult', 'obscene gesture', 'verbal abuse woman'], penalty: 'Imprisonment up to 3 years + fine' }
    ]
  },
  {
    title: 'Code of Criminal Procedure',
    shortTitle: 'CrPC',
    category: 'Criminal',
    year: 1973,
    description: 'The Code of Criminal Procedure provides the machinery for investigation of crime, apprehension of suspected criminals, collection of evidence, determining the guilt or innocence of the accused, and the determination of punishment of the guilty.',
    keywords: ['procedure', 'criminal procedure', 'trial', 'arrest', 'bail', 'investigation', 'crpc', 'fir', 'chargesheet', 'remand'],
    sections: [
      { number: '41', title: 'When Police May Arrest Without Warrant', description: 'Any police officer may arrest without warrant any person who has been concerned in any cognizable offense.', keywords: ['arrest', 'police', 'no warrant', 'cognizable offense'], penalty: '' },
      { number: '41A', title: 'Notice of Appearance Before Police Officer', description: 'Police officer shall issue a notice to the accused if the offense is non-cognizable before arresting — Supreme Court mandated in Arnesh Kumar case.', keywords: ['notice', 'appearance', 'non bailable', 'arnesh kumar', 'arrest guidelines'], penalty: '' },
      { number: '154', title: 'First Information Report (FIR)', description: 'Every information relating to the commission of a cognizable offense given orally or in writing to an officer in charge of a police station shall be recorded and read over to the informant.', keywords: ['fir', 'complaint', 'police report', 'cognizable complaint', 'how to file fir'], penalty: '' },
      { number: '156(3)', title: 'Power to Direct Police Investigation', description: 'A Magistrate empowered under Section 190 may order an investigation to be conducted by a police officer — critical when police refuse to file FIR.', keywords: ['magistrate', 'police investigation', 'fir refused', 'section 156(3)', 'private complaint'], penalty: '' },
      { number: '167', title: 'Procedure When Investigation Cannot Be Completed in 24 Hours', description: 'Provisions regarding remand and judicial custody — police custody max 15 days, judicial custody until chargesheet is filed. Default bail (DNFG) if chargesheet not filed in 60/90 days.', keywords: ['remand', 'custody', 'investigation', 'detention', 'judicial custody', 'police custody', 'default bail'], penalty: '' },
      { number: '173', title: 'Filing of Chargesheet', description: 'Every investigation shall be completed without unnecessary delay and the police officer shall forward a report (chargesheet) to a Magistrate.', keywords: ['chargesheet', 'police report', '173 crpc', 'investigation complete'], penalty: '' },
      { number: '200', title: 'Private Complaint Before Magistrate', description: 'A Magistrate taking cognizance of an offense on complaint shall examine upon oath the complainant and the witnesses present.', keywords: ['private complaint', 'magistrate complaint', 'police refuses fir'], penalty: '' },
      { number: '437', title: 'Bail in Non-Bailable Offenses', description: 'When any person accused of or suspected of the commission of a non-bailable offense is arrested or detained without warrant, a court other than the High Court or Court of Session may grant bail with conditions.', keywords: ['bail', 'non-bailable', 'release', 'surety', 'bail application'], penalty: '' },
      { number: '438', title: 'Anticipatory Bail', description: 'Direction for grant of bail to person apprehending arrest. The High Court or Sessions Court may grant anticipatory bail with conditions.', keywords: ['anticipatory bail', 'pre-arrest bail', 'apprehension of arrest', 'section 438'], penalty: '' },
      { number: '482', title: 'Inherent Powers of High Court', description: 'Nothing in this Code shall be deemed to limit or affect the inherent power of the High Court to make such orders as may be necessary to give effect to any order under this Code, or to prevent abuse of the process of any Court.', keywords: ['high court power', 'inherent power', 'quash fir', 'quashing', '482 crpc'], penalty: '' }
    ]
  },

  // ─── CIVIL ────────────────────────────────────────────────────────────────
  {
    title: 'Code of Civil Procedure',
    shortTitle: 'CPC',
    category: 'Civil',
    year: 1908,
    description: 'The Code of Civil Procedure is the primary legislation governing the procedure for the courts of civil judicature in India — how to file suits, get injunctions, execute decrees, and appeal.',
    keywords: ['civil procedure', 'civil suit', 'decree', 'appeal', 'injunction', 'cpc', 'plaint', 'summons', 'court fee'],
    sections: [
      { number: 'Section 9', title: 'Courts to Try All Civil Suits', description: 'The Courts shall have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred.', keywords: ['jurisdiction', 'civil suit', 'court', 'civil jurisdiction'], penalty: '' },
      { number: 'Order 7', title: 'Plaint — Statement of Claim', description: 'Rules regarding the filing of plaint (statement of claim) in civil suits, including what particulars must be stated.', keywords: ['plaint', 'claim', 'filing', 'civil suit filing', 'particulars of claim'], penalty: '' },
      { number: 'Order 39', title: 'Temporary Injunctions and Interlocutory Orders', description: 'Court may grant temporary injunction to restrain acts of the defendant where property is in danger or the plaintiff would suffer irreparable injury.', keywords: ['injunction', 'stay', 'restraint', 'temporary order', 'status quo'], penalty: '' },
      { number: 'Section 96', title: 'Appeal from Original Decree', description: 'Save where otherwise expressly provided, an appeal shall lie from every decree passed by any Court exercising original jurisdiction to the Court authorized to hear appeals from the decisions of such Court.', keywords: ['appeal', 'decree', 'high court appeal', 'civil appeal'], penalty: '' },
      { number: 'Order 21', title: 'Execution of Decrees', description: 'Procedure for executing and enforcing decrees passed by civil courts — attachment of property, arrest of judgment debtor.', keywords: ['execution', 'decree execution', 'recovery', 'attachment', 'judgment enforcement'], penalty: '' }
    ]
  },
  {
    title: 'Indian Contract Act',
    shortTitle: 'ICA',
    category: 'Civil',
    year: 1872,
    description: 'The Indian Contract Act governs the formation, performance, and enforcement of contracts in India. It defines what constitutes a valid contract, grounds for voiding contracts, and rights upon breach.',
    keywords: ['contract', 'agreement', 'breach', 'consideration', 'offer', 'acceptance', 'void', 'voidable', 'contract law'],
    sections: [
      { number: '2(h)', title: 'Definition of Contract', description: 'An agreement enforceable by law is a contract. Every promise and every set of promises, forming the consideration for each other, is an agreement.', keywords: ['contract definition', 'agreement', 'enforceable'], penalty: '' },
      { number: '10', title: 'What Agreements Are Contracts', description: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration, with a lawful object, and are not hereby expressly declared to be void.', keywords: ['valid contract', 'free consent', 'competence', 'lawful object'], penalty: '' },
      { number: '19', title: 'Voidability of Agreement Without Free Consent', description: 'When consent to an agreement is caused by coercion, undue influence, fraud, or misrepresentation, the agreement is a contract voidable at the option of the party whose consent was so caused.', keywords: ['voidable contract', 'coercion', 'fraud', 'misrepresentation', 'undue influence'], penalty: '' },
      { number: '73', title: 'Compensation for Loss or Damage Caused by Breach of Contract', description: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken it, compensation for any loss or damage caused to him.', keywords: ['breach of contract', 'compensation', 'damages', 'loss recovery', 'contract breach'], penalty: 'Compensation for actual loss or damage' },
      { number: '74', title: 'Compensation for Breach of Contract Where Penalty Stipulated', description: 'When a contract has been broken, if a sum is named in the contract as the amount to be paid in case of such breach, or if the contract contains any other stipulation by way of penalty, the party complaining of the breach is entitled, whether or not actual damage has been proved.', keywords: ['penalty clause', 'liquidated damages', 'breach penalty'], penalty: 'Reasonable compensation, not exceeding the penalty amount' },
      { number: '124', title: 'Contract of Indemnity', description: 'A contract by which one party promises to save the other from loss caused to him by the conduct of the promisor himself, or by the conduct of any other person, is called a contract of indemnity.', keywords: ['indemnity', 'guarantee', 'surety', 'loss save', 'indemnity clause'], penalty: '' }
    ]
  },

  // ─── PROPERTY ────────────────────────────────────────────────────────────
  {
    title: 'Transfer of Property Act',
    shortTitle: 'TPA',
    category: 'Property',
    year: 1882,
    description: 'The Transfer of Property Act governs the transfer of property (moveable and immoveable) by act of parties in India — sale, mortgage, lease, gift, exchange.',
    keywords: ['property', 'property transfer', 'sale', 'mortgage', 'lease', 'gift', 'tpa', 'immoveable property', 'landlord tenant'],
    sections: [
      { number: '54', title: 'Sale Defined', description: 'Sale is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised. In case of tangible immoveable property of value Rs 100 or more, the sale must be by registered instrument.', keywords: ['sale deed', 'property sale', 'ownership transfer', 'purchase', 'sale agreement'], penalty: '' },
      { number: '58', title: 'Mortgage Defined', description: 'A mortgage is the transfer of an interest in specific immoveable property for the purpose of securing the payment of money advanced or to be advanced by way of loan.', keywords: ['mortgage', 'home loan', 'property security', 'bank loan property', 'mortgage debt'], penalty: '' },
      { number: '105', title: 'Lease Defined', description: 'A lease of immoveable property is a transfer of a right to enjoy such property for a certain time, express or implied, or in perpetuity, in consideration of a price paid or promised, or of money, a share of crops, service or any other thing of value.', keywords: ['lease', 'rent', 'tenant', 'landlord', 'tenancy', 'rental agreement', 'security deposit', 'eviction'], penalty: '' },
      { number: '108', title: 'Rights and Liabilities of Lessor and Lessee', description: 'Rights and duties of landlord and tenant — landlord must deliver property, tenant must pay rent, maintain property, and vacate on expiry.', keywords: ['landlord rights', 'tenant rights', 'rent dispute', 'security deposit return', 'eviction notice', 'tenancy rights'], penalty: '' },
      { number: '122', title: 'Gift Defined', description: 'Gift is the transfer of certain existing moveable or immoveable property made voluntarily and without consideration by one person, called the donor, to another, called the donee, and accepted by or on behalf of the donee.', keywords: ['gift deed', 'donation', 'voluntary transfer', 'property gift', 'gift without consideration'], penalty: '' }
    ]
  },
  {
    title: 'Registration Act',
    shortTitle: 'Reg. Act',
    category: 'Property',
    year: 1908,
    description: 'The Registration Act makes it compulsory to register certain documents (sale deeds, mortgages) to prevent fraud and ensure public record of property ownership.',
    keywords: ['registration', 'property registration', 'sale deed registration', 'sub-registrar', 'stamp duty', 'document registration'],
    sections: [
      { number: '17', title: 'Documents of Which Registration is Compulsory', description: 'Instruments of sale, mortgage, lease exceeding one year of immoveable property of value Rs 100 or more must be compulsorily registered.', keywords: ['compulsory registration', 'sale deed', 'must register', 'mandatory registration'], penalty: 'Unregistered document cannot be used as evidence of transfer' },
      { number: '49', title: 'Effect of Non-Registration', description: 'No document required to be registered under this Act shall affect any immoveable property comprised therein unless it has been registered.', keywords: ['unregistered document', 'effect of non-registration', 'property rights'], penalty: 'Document has no legal effect for immoveable property' }
    ]
  },

  // ─── FAMILY ───────────────────────────────────────────────────────────────
  {
    title: 'Hindu Marriage Act',
    shortTitle: 'HMA',
    category: 'Family',
    year: 1955,
    description: 'The Hindu Marriage Act codifies and amends the law relating to marriage among Hindus, including conditions for valid marriage, marriages voidable, grounds for divorce, maintenance, and custody.',
    keywords: ['marriage', 'divorce', 'hindu', 'matrimonial', 'custody', 'maintenance', 'alimony', 'separation', 'family court'],
    sections: [
      { number: '5', title: 'Conditions for a Hindu Marriage', description: 'A marriage may be solemnized between two Hindus if: neither party has a living spouse, neither is unsound mind, the bridegroom is 21 and bride is 18 years of age.', keywords: ['marriage conditions', 'valid marriage', 'hindu marriage', 'child marriage', 'bigamy'], penalty: '' },
      { number: '11', title: 'Void Marriages', description: 'Any marriage solemnized in contravention of conditions of bigamy or prohibited degree shall be null and void.', keywords: ['void marriage', 'bigamy', 'illegal marriage', 'null and void'], penalty: '' },
      { number: '13', title: 'Divorce', description: 'Any marriage may be dissolved by a decree of divorce on grounds including cruelty, adultery, desertion for 2 years, unsound mind, conversion to another religion, renunciation, and not heard of being alive for 7 years.', keywords: ['divorce', 'dissolution of marriage', 'separation', 'grounds for divorce', 'mutual consent divorce', 'cruelty divorce'], penalty: '' },
      { number: '13B', title: 'Divorce by Mutual Consent', description: 'Both parties to a marriage together present a petition for divorce by mutual consent after living separately for one year. The decree can be passed after 6 months (cooling off period).', keywords: ['mutual consent divorce', 'divorce by consent', 'joint petition', 'amicable divorce'], penalty: '' },
      { number: '24', title: 'Maintenance Pendente Lite and Expenses of Proceedings', description: 'Provision for maintenance and expenses of proceedings during divorce — either spouse can claim interim maintenance during the pendency of the divorce case.', keywords: ['maintenance', 'alimony', 'interim maintenance', 'pendente lite', 'maintenance during divorce'], penalty: '' },
      { number: '25', title: 'Permanent Alimony and Maintenance', description: 'The court may order permanent alimony payable by either spouse having regard to the income, property, and conduct of both parties.', keywords: ['permanent alimony', 'maintenance order', 'post-divorce maintenance', 'monthly maintenance'], penalty: '' },
      { number: '26', title: 'Custody of Children', description: 'Court may pass interim and final orders for custody, maintenance, and education of minor children during divorce proceedings.', keywords: ['custody', 'child custody', 'minor child', 'guardianship', 'visitation rights', 'parental rights'], penalty: '' }
    ]
  },
  {
    title: 'Protection of Women from Domestic Violence Act',
    shortTitle: 'DV Act',
    category: 'Family',
    year: 2005,
    description: 'Provides for more effective protection of the rights of women guaranteed under the Constitution who are victims of domestic violence including physical, sexual, verbal, emotional, and economic abuse.',
    keywords: ['domestic violence', 'protection order', 'women safety', 'abuse', 'pwdva', 'dv act', 'beaten by husband', 'wife abuse'],
    sections: [
      { number: '3', title: 'Definition of Domestic Violence', description: 'Domestic violence includes any act of physical, sexual, verbal and emotional, and economic abuse — also includes threats of such acts, harassment for dowry.', keywords: ['domestic violence definition', 'physical abuse', 'emotional abuse', 'economic abuse', 'dowry harassment'], penalty: '' },
      { number: '12', title: 'Application to Magistrate', description: 'An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs.', keywords: ['complaint', 'application magistrate', 'protection officer', 'how to file dv case'], penalty: '' },
      { number: '18', title: 'Protection Orders', description: 'The Magistrate may, after giving the aggrieved person and the respondent an opportunity to be heard, pass a protection order in favour of the aggrieved person prohibiting acts of domestic violence.', keywords: ['protection order', 'restraining order', 'safety order', 'order to stop violence'], penalty: 'Violation is cognizable, non-bailable offense' },
      { number: '19', title: 'Residence Orders', description: 'The Magistrate may pass a residence order restraining the respondent from dispossessing or throwing out the aggrieved person from the shared household.', keywords: ['residence order', 'shared household', 'eviction prevention', 'right to stay in marital home'], penalty: '' },
      { number: '20', title: 'Monetary Relief', description: 'The Magistrate may direct the respondent to pay monetary relief to meet the expenses incurred and losses suffered by the aggrieved person and any child including loss of earnings, medical expenses.', keywords: ['monetary relief', 'compensation', 'maintenance', 'medical expenses', 'domestic violence compensation'], penalty: '' },
      { number: '22', title: 'Compensation Orders', description: 'In addition to other reliefs, the Magistrate may on an application also pass orders directing the respondent to pay compensation and damages for injuries including mental torture.', keywords: ['compensation', 'damages', 'mental torture compensation', 'pain and suffering'], penalty: '' }
    ]
  },
  {
    title: 'Hindu Succession Act',
    shortTitle: 'HSA',
    category: 'Family',
    year: 1956,
    description: 'The Hindu Succession Act amends and codifies the law relating to intestate succession among Hindus — who inherits property when someone dies without a will.',
    keywords: ['succession', 'inheritance', 'will', 'property inheritance', 'ancestral property', 'legal heir', 'intestate', 'coparcener'],
    sections: [
      { number: '6', title: 'Devolution of Interest in Coparcenary Property', description: 'After the 2005 amendment, daughters have equal coparcenary rights in ancestral property as sons — daughters are now coparceners by birth.', keywords: ['daughter rights property', 'equal inheritance', 'coparcenary', 'ancestral property daughter', '2005 amendment'], penalty: '' },
      { number: '8', title: 'General Rules of Succession — Males', description: 'Class I heirs (wife, children, mother) have first preference; Class II heirs and then agnates/cognates follow.', keywords: ['legal heir', 'class 1 heir', 'succession order', 'who inherits'], penalty: '' },
      { number: '15', title: 'General Rules of Succession — Females', description: 'Property of a Hindu female dying intestate devolves first on sons, daughters, husband, then heirs of husband, then father, then mother.', keywords: ['female inheritance', 'wife property', 'woman inheritance'], penalty: '' }
    ]
  },

  // ─── CONSUMER ─────────────────────────────────────────────────────────────
  {
    title: 'Consumer Protection Act',
    shortTitle: 'CPA',
    category: 'Consumer',
    year: 2019,
    description: 'The Consumer Protection Act 2019 provides for protection of the interests of consumers and establishment of consumer courts at district, state, and national levels. Covers product liability and e-commerce.',
    keywords: ['consumer', 'consumer complaint', 'deficiency in service', 'product liability', 'unfair trade practice', 'consumer forum', 'consumer court'],
    sections: [
      { number: '2(7)', title: 'Definition of Consumer', description: 'A person who buys any goods or avails any service for consideration — not for commercial purpose.', keywords: ['consumer definition', 'buyer', 'purchaser', 'who is consumer'], penalty: '' },
      { number: '2(11)', title: 'Deficiency in Service', description: 'Any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance required to be maintained by a service provider.', keywords: ['deficiency in service', 'poor service', 'service complaint', 'bank deficiency', 'insurance deficiency'], penalty: '' },
      { number: '35', title: 'Complaint before District Consumer Commission', description: 'Any consumer may file a complaint before the District Commission for disputes up to Rs 1 crore. The complaint must be filed within 2 years of the cause of action.', keywords: ['consumer complaint', 'district forum', 'how to file consumer complaint', 'consumer case filing'], penalty: '' },
      { number: '38', title: 'Procedure on Admission', description: 'District Commission may direct removal of defect, replacement of goods or withdrawal of service, return of price paid, payment of compensation, cessation of unfair trade practice.', keywords: ['consumer relief', 'refund order', 'replacement order', 'compensation consumer', 'consumer remedy'], penalty: '' },
      { number: '84', title: 'Product Liability of Manufacturer', description: 'Every product manufacturer or service provider shall be liable in a product liability action for any harm caused to a consumer due to a defective product.', keywords: ['product liability', 'defective product', 'manufacturer liability', 'product harm', 'defective goods'], penalty: 'Compensation varies' },
      { number: '88', title: 'Penalty for False or Misleading Advertisement', description: 'Any manufacturer or service provider and endorser of a misleading advertisement shall be liable to penalty.', keywords: ['misleading advertisement', 'false advertisement', 'fake claims', 'advertising fraud'], penalty: 'Penalty up to Rs 10 lakhs; repeat: up to Rs 50 lakhs' }
    ]
  },

  // ─── CORPORATE ────────────────────────────────────────────────────────────
  {
    title: 'Companies Act',
    shortTitle: 'CA',
    category: 'Corporate',
    year: 2013,
    description: 'The Companies Act 2013 regulates incorporation, management, responsibilities of companies, directors, annual filings, audits, mergers, winding up, and corporate governance in India.',
    keywords: ['company', 'corporate', 'director', 'shareholder', 'incorporation', 'compliance', 'board', 'mca', 'roc', 'annual return'],
    sections: [
      { number: '7', title: 'Incorporation of Company', description: 'Application for incorporation with memorandum and articles of association. Minimum capital, directors, and registered office address required.', keywords: ['incorporation', 'company registration', 'startup', 'form spice+', 'mca registration'], penalty: '' },
      { number: '149', title: 'Company to Have Board of Directors', description: 'Every company shall have a Board of Directors — minimum 2 directors for private company, 3 for public company, and at least 1 resident director.', keywords: ['director', 'board of directors', 'appointment', 'minimum directors'], penalty: '' },
      { number: '166', title: 'Duties of Directors', description: 'A director shall act in accordance with the articles, in good faith for the company benefit, not act for improper purposes, avoid conflicts of interest.', keywords: ['director duties', 'fiduciary duty', 'director responsibility', 'director conflicts of interest'], penalty: '' },
      { number: '188', title: 'Related Party Transactions', description: 'No company shall enter into related party transactions without consent of the Board and in certain cases, shareholder approval.', keywords: ['related party transaction', 'rpt', 'conflict of interest', 'director dealings'], penalty: '' },
      { number: '248', title: 'Power of Registrar to Remove Name of Company', description: 'The Registrar may strike off a defunct company from the register.', keywords: ['strike off', 'company closure', 'winding up', 'defunct company', 'dissolve company'], penalty: '' },
      { number: '447', title: 'Punishment for Fraud', description: 'Any person who is found to be guilty of fraud involving an amount of at least Rs 10 lakhs shall be punishable with imprisonment not less than 6 months and up to 10 years.', keywords: ['corporate fraud', 'fraud punishment', 'company fraud', 'director fraud', 'misrepresentation'], penalty: 'Imprisonment 6 months to 10 years + fine equal to fraud amount' }
    ]
  },

  // ─── TAX ──────────────────────────────────────────────────────────────────
  {
    title: 'Income Tax Act',
    shortTitle: 'ITA',
    category: 'Tax',
    year: 1961,
    description: 'The Income Tax Act governs the levy, collection, administration, and recovery of income tax in India. It covers assessments, deductions, TDS, advance tax, and penalties.',
    keywords: ['income tax', 'taxation', 'assessment', 'return', 'deduction', 'tds', 'itr', 'tax evasion', 'advance tax', 'refund'],
    sections: [
      { number: '80C', title: 'Deductions for Certain Investments', description: 'Deduction up to Rs 1.5 lakhs for investments in LIC, PPF, ELSS, NSC, EPF, home loan principal, and children tuition fees.', keywords: ['80c deduction', 'tax saving investment', 'ppf', 'elss', 'lic', 'tax saving'], penalty: '' },
      { number: '139', title: 'Return of Income', description: 'Every person whose total income exceeds the basic exemption limit must file a return of income (ITR) before the due date. Companies must file regardless of income.', keywords: ['income tax return', 'itr filing', 'tax return', 'return filing deadline'], penalty: '' },
      { number: '143(1)', title: 'Intimation After Processing of Return', description: 'After processing the return, the income tax department sends an intimation — may be a refund or a demand.', keywords: ['itr intimation', 'tax demand', 'itr processed', 'refund status'], penalty: '' },
      { number: '194', title: 'TDS on Payment of Dividend', description: 'TDS is deducted at source on various payments — salary, interest, rent, professional fees, etc.', keywords: ['tds', 'tax deducted at source', 'tds deduction', 'tds certificate', 'form 16'], penalty: '' },
      { number: '234B', title: 'Interest for Default in Payment of Advance Tax', description: 'If advance tax paid is less than 90% of assessed tax, interest at 1% per month is charged.', keywords: ['advance tax', 'advance tax default', 'interest on tax', '234b'], penalty: '1% per month simple interest' },
      { number: '271', title: 'Penalty for Concealment of Income', description: 'Penalty for concealment of income or furnishing inaccurate particulars of income — 100% to 300% of tax sought to be evaded.', keywords: ['tax evasion penalty', 'concealment', 'inaccurate return', 'under-reporting income'], penalty: '100% to 300% of tax evaded' }
    ]
  },

  // ─── CONSTITUTIONAL ───────────────────────────────────────────────────────
  {
    title: 'Constitution of India',
    shortTitle: 'Constitution',
    category: 'Constitutional',
    year: 1950,
    description: 'The supreme law of India, establishing the framework for political principles, procedures, and powers of government institutions and setting out fundamental rights and directive principles.',
    keywords: ['constitution', 'fundamental rights', 'democracy', 'justice', 'liberty', 'equality', 'articles', 'writ', 'pil', 'high court', 'supreme court'],
    sections: [
      { number: 'Article 14', title: 'Equality before Law', description: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.', keywords: ['equality', 'discrimination', 'equal protection', 'arbitrary state action'], penalty: '' },
      { number: 'Article 19', title: 'Protection of Certain Rights Regarding Freedom of Speech', description: 'All citizens shall have the right to freedom of speech and expression, to assemble peaceably and without arms, to form associations or unions, to move freely throughout India.', keywords: ['freedom of speech', 'expression', 'assembly', 'movement', 'censorship', 'free speech'], penalty: '' },
      { number: 'Article 21', title: 'Protection of Life and Personal Liberty', description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law — interpreted broadly to include right to health, education, privacy (Puttaswamy case 2017).', keywords: ['right to life', 'personal liberty', 'privacy', 'fundamental right', 'right to health', 'right to education', 'right to privacy'], penalty: '' },
      { number: 'Article 21A', title: 'Right to Education', description: 'The State shall provide free and compulsory education to all children of the age of 6 to 14 years.', keywords: ['right to education', 'rte', 'free education', 'child education'], penalty: '' },
      { number: 'Article 32', title: 'Right to Constitutional Remedies', description: 'The right to move the Supreme Court by appropriate proceedings for the enforcement of fundamental rights is guaranteed — includes power to issue Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari.', keywords: ['supreme court', 'writ petition', 'fundamental rights enforcement', 'habeas corpus', 'mandamus'], penalty: '' },
      { number: 'Article 226', title: 'Power of High Courts to Issue Writs', description: 'Every High Court shall have power to issue to any person or authority directions, orders or writs for the enforcement of fundamental rights or for any other purpose.', keywords: ['high court', 'writ', 'enforcement', 'habeas corpus', 'mandamus', 'certiorari', 'quo-warranto'], penalty: '' }
    ]
  },
  {
    title: 'Right to Information Act',
    shortTitle: 'RTI',
    category: 'Constitutional',
    year: 2005,
    description: 'Sets out the practical regime of right to information for citizens to secure access to information under the control of public authorities — transparency and accountability in governance.',
    keywords: ['rti', 'right to information', 'transparency', 'government information', 'public authority', 'disclosure', 'pio'],
    sections: [
      { number: '3', title: 'Right to Information', description: 'All citizens shall have the right to information, subject to provisions of this Act.', keywords: ['right to information', 'citizen right', 'access information'], penalty: '' },
      { number: '6', title: 'Application for Seeking Information', description: 'A person who desires to obtain information shall make a request in writing or through electronic means in English, Hindi or official language of the area to the Public Information Officer.', keywords: ['rti application', 'how to file rti', 'information request', 'pio'], penalty: '' },
      { number: '7', title: 'Disposal of Request', description: 'PIO shall provide information/reject within 30 days; 48 hours if it concerns the life or liberty of a person.', keywords: ['rti response time', '30 days', 'information officer', 'rti deadline'], penalty: '' },
      { number: '20', title: 'Penalties', description: 'If PIO fails to give information within time, CIC/SIC can impose penalty of Rs 250 per day up to Rs 25,000 on the officer.', keywords: ['rti penalty', 'pio penalty', 'information commissioner', 'cic penalty'], penalty: 'Rs 250 per day of delay, max Rs 25,000' }
    ]
  },

  // ─── IP ───────────────────────────────────────────────────────────────────
  {
    title: 'Information Technology Act',
    shortTitle: 'IT Act',
    category: 'IP',
    year: 2000,
    description: 'The IT Act provides legal recognition for transactions carried out by electronic data interchange and other means of electronic communication, and gives legal framework for cybercrime.',
    keywords: ['cyber', 'digital', 'electronic', 'internet', 'data', 'privacy', 'hacking', 'cybercrime', 'online', 'it act'],
    sections: [
      { number: '43', title: 'Penalty and Compensation for Damage to Computer System', description: 'If any person without permission of the owner accesses or secures access to, downloads data from, introduces any computer contaminant or virus, the person shall be liable to pay damages to the owner.', keywords: ['hacking', 'unauthorized access', 'computer damage', 'data breach', 'virus attack'], penalty: 'Compensation up to Rs 1 crore' },
      { number: '66', title: 'Computer Related Offenses', description: 'Any person who dishonestly or fraudulently does any act referred to in section 43 shall be punishable with imprisonment up to 3 years or fine up to Rs 5 lakhs.', keywords: ['cybercrime', 'hacking offense', 'computer fraud', 'online crime'], penalty: 'Imprisonment up to 3 years or fine up to Rs 5 lakhs' },
      { number: '66C', title: 'Identity Theft', description: 'Whoever, fraudulently or dishonestly, makes use of the electronic signature, password or any other unique identification feature of any other person.', keywords: ['identity theft', 'password theft', 'impersonation', 'account hacking'], penalty: 'Imprisonment up to 3 years + fine up to Rs 1 lakh' },
      { number: '66D', title: 'Cheating by Personation by Using Computer Resource', description: 'Whoever, by means of any communication device or computer resource cheats by personating.', keywords: ['online fraud', 'impersonation fraud', 'fake identity online', 'social media impersonation'], penalty: 'Imprisonment up to 3 years + fine up to Rs 1 lakh' },
      { number: '67', title: 'Publishing Obscene Material in Electronic Form', description: 'Whoever publishes or transmits or causes to be published in the electronic form any material which is lascivious or appeals to the prurient interest.', keywords: ['obscene material', 'pornography', 'electronic obscenity', 'objectionable content'], penalty: 'First conviction: imprisonment up to 3 years + fine Rs 5 lakhs; repeat: 5 years + Rs 10 lakhs' },
      { number: '72A', title: 'Punishment for Disclosure of Information in Breach of Lawful Contract', description: 'Anyone who discloses personal information of another person obtained under a lawful contract without their consent.', keywords: ['data privacy', 'personal data breach', 'confidential information', 'data leak'], penalty: 'Imprisonment up to 3 years or fine up to Rs 5 lakhs or both' }
    ]
  },

  // ─── LABOUR ───────────────────────────────────────────────────────────────
  {
    title: 'Industrial Disputes Act',
    shortTitle: 'IDA',
    category: 'Labour',
    year: 1947,
    description: 'The Industrial Disputes Act governs the resolution of industrial disputes — retrenchment, layoff, lockout, strikes, unfair labour practices. It protects workers from arbitrary dismissal.',
    keywords: ['labour law', 'industrial dispute', 'retrenchment', 'layoff', 'termination', 'wrongful dismissal', 'worker rights', 'employee fired', 'redundancy'],
    sections: [
      { number: '25F', title: 'Conditions Precedent to Retrenchment', description: 'No workman who has been in continuous service for 1 year or more in an establishment shall be retrenched unless given 1 month notice or pay in lieu, retrenchment compensation at 15 days average pay per year of work, and written notice to appropriate government.', keywords: ['retrenchment', 'layoff notice', 'termination notice', 'severance pay', 'redundancy compensation'], penalty: 'Retrenchment without compliance is illegal' },
      { number: '25G', title: 'Procedure for Retrenchment', description: 'The workman who was last employed in the service shall be retrenched first (LIFO — last in, first out principle).', keywords: ['retrenchment order', 'last in first out', 'lifo', 'who gets retrenched'], penalty: '' },
      { number: '25H', title: 'Re-employment of Retrenched Workmen', description: 'Where any workman is retrenched and the employer proposes to take into his employ any persons, he shall give an opportunity to the retrenched workmen to offer themselves for re-employment.', keywords: ['rehire', 're-employment', 'retrenched worker preference', 'right of first refusal job'], penalty: '' },
      { number: '25N', title: 'Conditions Precedent to Retrenchment in Large Establishments', description: 'Establishments with 100+ workers must obtain prior government permission before retrenching any worker.', keywords: ['large establishment retrenchment', '100 workers', 'government permission layoff', 'section 25n'], penalty: '' }
    ]
  },

  // ─── TRAFFIC ──────────────────────────────────────────────────────────────
  {
    title: 'Motor Vehicles Act',
    shortTitle: 'MVA',
    category: 'Traffic',
    year: 1988,
    description: 'The Motor Vehicles Act regulates all aspects of road transport vehicles in India — registration, licensing, insurance, traffic regulations, and penalties.',
    keywords: ['traffic', 'vehicle', 'driving', 'license', 'accident', 'road accident', 'insurance', 'motor vehicle', 'challan', 'traffic police'],
    sections: [
      { number: '3', title: 'Necessity for Driving Licence', description: 'No person shall drive a motor vehicle in any public place unless he holds an effective driving licence issued to him authorizing him to drive the vehicle.', keywords: ['driving licence', 'dl', 'driving without licence', 'unlicensed driving'], penalty: 'Imprisonment up to 3 months or fine up to Rs 5,000 or both' },
      { number: '185', title: 'Driving under the Influence of Alcohol or Drugs', description: 'Driving with blood alcohol exceeding 30 mg per 100 ml of blood is a criminal offense.', keywords: ['drunk driving', 'dui', 'drink and drive', 'alcohol', 'intoxicated driving', 'breathalyzer'], penalty: 'First offense: Imprisonment up to 6 months or fine up to Rs 10,000 or both; Second: imprisonment up to 2 years + fine' }
    ]
  },

  // ─── BANKING ──────────────────────────────────────────────────────────────
  {
    title: 'Negotiable Instruments Act',
    shortTitle: 'NI Act',
    category: 'Banking',
    year: 1881,
    description: 'The Negotiable Instruments Act regulates promissory notes, bills of exchange, and cheques. It includes the widely used Section 138 for cheque bounce offenses.',
    keywords: ['cheque bounce', 'dishonour', 'ni act', 'promissory note', 'bank cheque', 'debt recovery', 'section 138', 'cheque return'],
    sections: [
      { number: '138', title: 'Dishonour of cheque for insufficiency of funds', description: 'When a cheque is drawn to discharge a debt and is returned unpaid due to insufficient funds, it is a criminal offense. Notice must be sent within 30 days of return.', keywords: ['cheque bounce', 'cheque return', 'insufficient funds', 'legal notice cheque', 'payment default'], penalty: 'Imprisonment up to 2 years or fine up to twice the cheque amount' }
    ]
  }
];

export default legalSeedData;
