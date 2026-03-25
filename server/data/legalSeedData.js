const legalSeedData = [
  {
    title: 'Indian Penal Code',
    shortTitle: 'IPC',
    category: 'Criminal',
    year: 1860,
    description: 'The Indian Penal Code is the official criminal code of India covering all substantive aspects of criminal law.',
    keywords: ['crime', 'punishment', 'offense', 'criminal', 'penal'],
    sections: [
      { number: '302', title: 'Punishment for Murder', description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.', keywords: ['murder', 'killing', 'death', 'homicide'], penalty: 'Death or life imprisonment + fine' },
      { number: '304A', title: 'Death by Negligence', description: 'Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide.', keywords: ['negligence', 'death', 'accident', 'rash'], penalty: 'Imprisonment up to 2 years or fine or both' },
      { number: '354', title: 'Assault on Woman', description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty.', keywords: ['assault', 'woman', 'modesty', 'harassment'], penalty: 'Imprisonment 1 to 5 years + fine' },
      { number: '376', title: 'Punishment for Rape', description: 'Whoever commits rape shall be punished with rigorous imprisonment for a term not less than ten years.', keywords: ['rape', 'sexual assault', 'sexual offense'], penalty: 'Rigorous imprisonment not less than 10 years, may extend to life + fine' },
      { number: '379', title: 'Punishment for Theft', description: 'Whoever commits theft shall be punished with imprisonment which may extend to three years, or with fine, or with both.', keywords: ['theft', 'stealing', 'stolen'], penalty: 'Imprisonment up to 3 years or fine or both' },
      { number: '392', title: 'Punishment for Robbery', description: 'Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years.', keywords: ['robbery', 'loot', 'dacoity'], penalty: 'Rigorous imprisonment up to 10 years + fine' },
      { number: '420', title: 'Cheating and Dishonestly', description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property.', keywords: ['cheating', 'fraud', 'dishonest', 'scam', 'deception'], penalty: 'Imprisonment up to 7 years + fine' },
      { number: '498A', title: 'Cruelty by Husband/Relatives', description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty.', keywords: ['cruelty', 'husband', 'dowry', 'domestic violence', 'matrimonial'], penalty: 'Imprisonment up to 3 years + fine' },
      { number: '506', title: 'Criminal Intimidation', description: 'Whoever commits the offense of criminal intimidation shall be punished with imprisonment up to two years, or fine, or both.', keywords: ['threat', 'intimidation', 'threatening'], penalty: 'Imprisonment up to 2 years or fine or both' }
    ]
  },
  {
    title: 'Code of Criminal Procedure',
    shortTitle: 'CrPC',
    category: 'Criminal',
    year: 1973,
    description: 'The Code of Criminal Procedure provides the machinery for investigation, arrest, trial, and punishment of criminal offenses.',
    keywords: ['procedure', 'criminal', 'trial', 'arrest', 'bail', 'investigation'],
    sections: [
      { number: '41', title: 'When Police May Arrest Without Warrant', description: 'Any police officer may arrest without warrant any person who has been concerned in any cognizable offense.', keywords: ['arrest', 'police', 'warrant', 'cognizable'], penalty: '' },
      { number: '154', title: 'First Information Report (FIR)', description: 'Every information relating to the commission of a cognizable offense given orally or in writing to the police shall be recorded.', keywords: ['fir', 'complaint', 'police report', 'cognizable'], penalty: '' },
      { number: '167', title: 'Procedure When Investigation Not Complete', description: 'Provisions regarding remand and judicial custody during investigation.', keywords: ['remand', 'custody', 'investigation', 'detention'], penalty: '' },
      { number: '437', title: 'Bail in Non-Bailable Offenses', description: 'When any person accused of a non-bailable offense is arrested or detained without warrant.', keywords: ['bail', 'non-bailable', 'release', 'surety'], penalty: '' },
      { number: '438', title: 'Anticipatory Bail', description: 'Direction for grant of bail to person apprehending arrest.', keywords: ['anticipatory bail', 'pre-arrest bail', 'apprehension'], penalty: '' }
    ]
  },
  {
    title: 'Code of Civil Procedure',
    shortTitle: 'CPC',
    category: 'Civil',
    year: 1908,
    description: 'The Code of Civil Procedure governs the adjudication of civil disputes in India through civil courts.',
    keywords: ['civil', 'suit', 'decree', 'appeal', 'procedure'],
    sections: [
      { number: 'Order 7', title: 'Plaint', description: 'Rules regarding the filing of plaint (statement of claim) in civil suits.', keywords: ['plaint', 'claim', 'filing', 'suit'], penalty: '' },
      { number: 'Order 39', title: 'Temporary Injunctions', description: 'Court may grant temporary injunction to restrain acts of the defendant.', keywords: ['injunction', 'stay', 'restraint', 'temporary'], penalty: '' },
      { number: 'Section 9', title: 'Courts to Try All Civil Suits', description: 'The Courts shall have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred.', keywords: ['jurisdiction', 'civil suit', 'court'], penalty: '' },
      { number: 'Section 96', title: 'Appeal from Original Decree', description: 'Save where otherwise expressly provided, an appeal shall lie from every decree.', keywords: ['appeal', 'decree', 'high court'], penalty: '' }
    ]
  },
  {
    title: 'Indian Contract Act',
    shortTitle: 'ICA',
    category: 'Civil',
    year: 1872,
    description: 'The Indian Contract Act provides the framework for all contractual agreements in India.',
    keywords: ['contract', 'agreement', 'breach', 'consideration', 'offer', 'acceptance'],
    sections: [
      { number: '2(h)', title: 'Definition of Contract', description: 'An agreement enforceable by law is a contract.', keywords: ['contract', 'agreement', 'enforceable'], penalty: '' },
      { number: '10', title: 'What Agreements Are Contracts', description: 'All agreements are contracts if they are made by free consent of parties competent to contract.', keywords: ['valid contract', 'consent', 'competence'], penalty: '' },
      { number: '73', title: 'Compensation for Breach', description: 'When a contract has been broken, the party who suffers is entitled to receive compensation.', keywords: ['breach', 'compensation', 'damages', 'loss'], penalty: 'Compensation for loss or damage' },
      { number: '124', title: 'Contract of Indemnity', description: 'A contract by which one party promises to save the other from loss.', keywords: ['indemnity', 'guarantee', 'surety', 'loss'], penalty: '' }
    ]
  },
  {
    title: 'Companies Act',
    shortTitle: 'CA',
    category: 'Corporate',
    year: 2013,
    description: 'The Companies Act regulates incorporation, responsibilities of companies, directors and dissolution of a company.',
    keywords: ['company', 'corporate', 'director', 'shareholder', 'incorporation', 'compliance'],
    sections: [
      { number: '7', title: 'Incorporation of Company', description: 'Application for incorporation with memorandum and articles of association.', keywords: ['incorporation', 'registration', 'company formation', 'startup'], penalty: '' },
      { number: '149', title: 'Company to Have Directors', description: 'Every company shall have a Board of Directors consisting of individuals as directors.', keywords: ['director', 'board', 'appointment'], penalty: '' },
      { number: '166', title: 'Duties of Directors', description: 'A director of a company shall act in accordance with the articles of the company.', keywords: ['director duties', 'fiduciary', 'responsibility'], penalty: '' },
      { number: '447', title: 'Punishment for Fraud', description: 'Any person who is found guilty of fraud shall be punishable with imprisonment up to 10 years.', keywords: ['fraud', 'corporate fraud', 'misrepresentation'], penalty: 'Imprisonment up to 10 years + fine' }
    ]
  },
  {
    title: 'Information Technology Act',
    shortTitle: 'IT Act',
    category: 'IP',
    year: 2000,
    description: 'The IT Act provides legal recognition for electronic commerce and facilitates electronic governance.',
    keywords: ['cyber', 'digital', 'electronic', 'internet', 'data', 'privacy', 'hacking'],
    sections: [
      { number: '43', title: 'Penalty for Damage to Computer System', description: 'If any person without permission accesses or damages any computer system.', keywords: ['hacking', 'unauthorized access', 'computer damage'], penalty: 'Compensation up to 1 crore' },
      { number: '66', title: 'Computer Related Offenses', description: 'Any person who dishonestly or fraudulently does any act referred to in section 43.', keywords: ['cybercrime', 'computer offense', 'hacking'], penalty: 'Imprisonment up to 3 years or fine up to 5 lakhs' },
      { number: '66A', title: 'Offensive Messages Through Communication Service', description: 'Sending offensive messages through electronic means (struck down by Supreme Court).', keywords: ['offensive message', 'social media', 'online harassment'], penalty: 'Section struck down' },
      { number: '67', title: 'Publishing Obscene Material', description: 'Whoever publishes or transmits obscene material in electronic form.', keywords: ['obscene', 'pornography', 'electronic obscenity'], penalty: 'First conviction: 3 years + 5 lakhs fine' }
    ]
  },
  {
    title: 'Hindu Marriage Act',
    shortTitle: 'HMA',
    category: 'Family',
    year: 1955,
    description: 'The Hindu Marriage Act codifies the law relating to marriage among Hindus.',
    keywords: ['marriage', 'divorce', 'hindu', 'matrimonial', 'custody', 'maintenance'],
    sections: [
      { number: '5', title: 'Conditions for a Hindu Marriage', description: 'A marriage may be solemnized between two Hindus if the conditions specified are fulfilled.', keywords: ['marriage conditions', 'valid marriage', 'hindu marriage'], penalty: '' },
      { number: '13', title: 'Divorce', description: 'Any marriage may be dissolved by a decree of divorce on any of the specified grounds.', keywords: ['divorce', 'dissolution', 'separation', 'grounds for divorce'], penalty: '' },
      { number: '24', title: 'Maintenance Pendente Lite', description: 'Provision for maintenance and expenses of proceedings during divorce.', keywords: ['maintenance', 'alimony', 'interim maintenance'], penalty: '' },
      { number: '26', title: 'Custody of Children', description: 'Court may pass interim orders for custody, maintenance, and education of minor children.', keywords: ['custody', 'child custody', 'minor', 'guardianship'], penalty: '' }
    ]
  },
  {
    title: 'Consumer Protection Act',
    shortTitle: 'CPA',
    category: 'Consumer',
    year: 2019,
    description: 'The Consumer Protection Act provides for protection of the interests of consumers and establishment of consumer courts.',
    keywords: ['consumer', 'complaint', 'deficiency', 'product liability', 'unfair trade'],
    sections: [
      { number: '2(7)', title: 'Definition of Consumer', description: 'Any person who buys goods or hires services for consideration.', keywords: ['consumer definition', 'buyer', 'purchaser'], penalty: '' },
      { number: '35', title: 'Filing Consumer Complaint', description: 'Procedure for filing complaints before the District Consumer Commission.', keywords: ['complaint', 'consumer forum', 'filing'], penalty: '' },
      { number: '38', title: 'Relief to Consumer', description: 'District Commission may direct removal of defect, replacement, or refund.', keywords: ['refund', 'replacement', 'compensation', 'relief'], penalty: '' },
      { number: '84', title: 'Product Liability', description: 'Every product manufacturer shall be liable in a product liability action.', keywords: ['product liability', 'defective product', 'manufacturer'], penalty: 'Varies' }
    ]
  },
  {
    title: 'Income Tax Act',
    shortTitle: 'ITA',
    category: 'Tax',
    year: 1961,
    description: 'The Income Tax Act governs the levy, collection and administration of income tax in India.',
    keywords: ['income tax', 'taxation', 'assessment', 'return', 'deduction', 'tds'],
    sections: [
      { number: '80C', title: 'Deduction for Investments', description: 'Deduction in respect of life insurance, PPF, ELSS and other investments up to Rs. 1.5 lakhs.', keywords: ['deduction', 'investment', 'tax saving', '80c'], penalty: '' },
      { number: '139', title: 'Filing of Returns', description: 'Every person whose total income exceeds the taxable limit must file a return of income.', keywords: ['income tax return', 'filing', 'itr', 'tax return'], penalty: '' },
      { number: '234A', title: 'Interest for Late Filing', description: 'If return is furnished after due date, simple interest at 1% per month shall be payable.', keywords: ['late filing', 'penalty', 'interest', 'delayed return'], penalty: '1% per month interest' },
      { number: '271', title: 'Penalty for Concealment', description: 'Penalty for concealment of income or furnishing inaccurate particulars.', keywords: ['penalty', 'concealment', 'tax evasion', 'inaccurate'], penalty: '100% to 300% of tax sought to be evaded' }
    ]
  },
  {
    title: 'Protection of Women from Domestic Violence Act',
    shortTitle: 'DV Act',
    category: 'Family',
    year: 2005,
    description: 'Provides protection to women from domestic violence including physical, sexual, emotional, and economic abuse.',
    keywords: ['domestic violence', 'protection order', 'women safety', 'abuse'],
    sections: [
      { number: '3', title: 'Definition of Domestic Violence', description: 'Any act, omission or commission or conduct that harms or injures or endangers the health, safety of the aggrieved person.', keywords: ['domestic violence', 'abuse', 'physical violence', 'emotional abuse'], penalty: '' },
      { number: '12', title: 'Application to Magistrate', description: 'An aggrieved person or Protection Officer may present an application to the Magistrate.', keywords: ['complaint', 'application', 'magistrate', 'protection officer'], penalty: '' },
      { number: '18', title: 'Protection Orders', description: 'The Magistrate may pass protection orders prohibiting acts of domestic violence.', keywords: ['protection order', 'restraining order', 'safety'], penalty: '' },
      { number: '20', title: 'Monetary Relief', description: 'Monetary relief for loss of earnings, medical expenses, and maintenance.', keywords: ['monetary relief', 'compensation', 'maintenance', 'medical expenses'], penalty: '' }
    ]
  },
  {
    title: 'Right to Information Act',
    shortTitle: 'RTI',
    category: 'Constitutional',
    year: 2005,
    description: 'Provides for setting out the practical regime of right to information for citizens to secure access to information under the control of public authorities.',
    keywords: ['information', 'transparency', 'government', 'public authority', 'disclosure'],
    sections: [
      { number: '3', title: 'Right to Information', description: 'All citizens shall have the right to information subject to the provisions of this Act.', keywords: ['right to information', 'citizen right', 'access'], penalty: '' },
      { number: '6', title: 'Application for Information', description: 'A person who desires to obtain information shall make a request in writing or through electronic means.', keywords: ['rti application', 'information request', 'filing rti'], penalty: '' },
      { number: '7', title: 'Disposal of Request', description: 'Subject to proviso of section 6, the Central or State Public Information Officer shall provide information within 30 days.', keywords: ['response time', '30 days', 'information officer'], penalty: '' }
    ]
  },
  {
    title: 'Constitution of India',
    shortTitle: 'Constitution',
    category: 'Constitutional',
    year: 1950,
    description: 'The supreme law of India, establishing the framework for political principles, procedures, and powers of government institutions and setting out fundamental rights.',
    keywords: ['constitution', 'fundamental rights', 'democracy', 'justice', 'liberty', 'equality'],
    sections: [
      { number: 'Article 14', title: 'Equality before Law', description: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.', keywords: ['equality', 'discrimination', 'justice', 'equal protection'], penalty: '' },
      { number: 'Article 19', title: 'Protection of Certain Rights Regarding Freedom of Speech', description: 'All citizens shall have the right to freedom of speech and expression, to assemble peaceably, to form associations, to move freely, and to reside in any part of India.', keywords: ['freedom of speech', 'expression', 'assembly', 'movement'], penalty: '' },
      { number: 'Article 21', title: 'Protection of Life and Personal Liberty', description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.', keywords: ['life', 'liberty', 'privacy', 'personal freedom', 'right to life'], penalty: '' },
      { number: 'Article 226', title: 'Power of High Courts to Issue Certain Writs', description: 'Every High Court shall have power to issue to any person or authority directions, orders or writs for the enforcement of any of the rights conferred by Part III and for any other purpose.', keywords: ['writ', 'high court', 'enforcement', 'habeas corpus', 'mandamus'], penalty: '' },
      { number: 'Article 32', title: 'Remedies for Enforcement of Rights', description: 'The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by Part III is guaranteed.', keywords: ['supreme court', 'writ', 'fundamental rights', 'remedy'], penalty: '' }
    ]
  },
  {
    title: 'Transfer of Property Act',
    shortTitle: 'TPA',
    category: 'Property',
    year: 1882,
    description: 'The Transfer of Property Act governs the transfer of property by act of parties in India.',
    keywords: ['property', 'transfer', 'sale', 'mortgage', 'lease', 'gift'],
    sections: [
      { number: '54', title: 'Sale Defined', description: 'Sale is a transfer of ownership in exchange for a price paid or promised.', keywords: ['sale', 'property sale', 'ownership transfer', 'purchase'], penalty: '' },
      { number: '58', title: 'Mortgage Defined', description: 'A mortgage is the transfer of an interest in specific immoveable property for securing a loan.', keywords: ['mortgage', 'loan', 'property security', 'home loan'], penalty: '' },
      { number: '105', title: 'Lease Defined', description: 'A lease of immoveable property is a transfer of a right to enjoy such property for a certain time.', keywords: ['lease', 'rent', 'tenant', 'landlord', 'tenancy'], penalty: '' },
      { number: '122', title: 'Gift Defined', description: 'Gift is the transfer of certain existing moveable or immoveable property made voluntarily without consideration.', keywords: ['gift', 'donation', 'voluntary transfer'], penalty: '' }
    ]
  }
];

module.exports = legalSeedData;
