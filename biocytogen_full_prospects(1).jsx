import { useState } from "react";

// ─── EXISTING CUSTOMERS (excluded from table, shown as reference) ───────────
const EXISTING_CUSTOMERS = [
  "Arcellx","AstraZeneca","Biohippo","BriSight Biosciences","Caring Cross",
  "CellPhire","Children's National Hospital","College of William & Mary",
  "Corellia AI","Hansoh Bio","Howard Hughes Medical Institute","Ibex Biosciences",
  "IntegerBio","Johns Hopkins University","Kaigene","MacroGenics","McGlothlin",
  "Miltenyi Biotec","miRecule","NextCure","National Cancer Institute","NIAID",
  "NIH","Pinion Immunotherapeutics","Regenxbio","Rivus Pharmaceuticals",
  "Salubris Biotherapeutics","SciNeuro Pharmaceuticals","University of Maryland Baltimore",
  "University of Virginia","Virginia Commonwealth University","Virginia Tech","Vita Therapeutics"
];

const ALL = [
  // ═══════════════════════════════════════════════════════════════════════
  // TIER 1 — STRONGEST FIT
  // ═══════════════════════════════════════════════════════════════════════
  { tier:1, isNew:false, company:"OncoC4, Inc.", type:"Drug Developer", focus:"Immuno-oncology (CTLA-4, CD24, Siglecs); mAbs, bispecific Ab, ADC, CAR-T", employees:"~87", funding:"$50M Series B (Oct 2025); ~$100M total raised", status:"Private", stage:"Clinical", preclinical:false, fit:"Direct — active immuno-oncology biologics; humanized tumor models essential" },
  { tier:1, isNew:false, company:"Georgiamune Inc.", type:"Drug Developer", focus:"Immunotherapy mAbs & small molecules for cancer & autoimmune (3 assets in Phase 1)", employees:"~27", funding:"$75M Series A (Aug 2023); General Catalyst & PICI", status:"Private", stage:"Clinical", preclinical:false, fit:"Direct — 3 Phase 1 mAb assets; relies on humanized pharmacology models" },
  { tier:1, isNew:false, company:"NexImmune, Inc.", type:"Drug Developer", focus:"T cell-based immunotherapy (AIM technology, TCR-based)", employees:"~72", funding:"Public (NEXI); ~$139M market cap; IPO 2021", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — T cell therapies ideal for humanized TCR/HLA mouse models" },
  { tier:1, isNew:false, company:"Deka Biosciences, Inc.", type:"Drug Developer", focus:"Targeted cytokine therapies (Diakines) for cancer & inflammatory disease", employees:"~20", funding:"~$91M total; Series B2 $20M (Sep 2023); Leaps by Bayer, MPM Capital", status:"Private", stage:"Clinical", preclinical:false, fit:"Direct — cytokine biologics needing humanized PK/PD & efficacy studies" },
  { tier:1, isNew:false, company:"Tonix Pharmaceuticals", type:"Drug Developer", focus:"CNS, immunology, immuno-oncology, mpox vaccine; anti-CD40L mAb", employees:"~250", funding:"Public (TNXP); $190M cash (Sep 2025); $34M DoD contract", status:"Public", stage:"Clinical", preclinical:false, fit:"Strong — broad biologics pipeline; routinely outsources preclinical CRO work" },
  { tier:1, isNew:false, company:"GlycoMimetics / Crescent Biopharma", type:"Drug Developer", focus:"PD-1×VEGF bispecific Ab (CR-001), ADCs for solid tumors", employees:"~50", funding:"$200M private placement (Jun 2025); Nasdaq CBIO; funded through 2027", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — bispecific Ab oncology pipeline; IND submissions in progress" },
  { tier:1, isNew:false, company:"VLP Therapeutics", type:"Drug Developer", focus:"Virus-like particle vaccines (dengue, cancer immunotherapy VLPONC-01)", employees:"~30", funding:"~$43M total ($37M Series A 2021 + $6M GHIT grant 2024)", status:"Private", stage:"Clinical", preclinical:false, fit:"Direct — vaccine/biologic platform with active Phase 1 trials" },
  { tier:1, isNew:false, company:"Integrated Biotherapeutics", type:"Drug Developer", focus:"Biologic countermeasures & toxin-neutralizing antibodies (DoD/NIH-funded)", employees:"~60", funding:"Primarily government-funded (DoD, NIH)", status:"Private", stage:"Clinical", preclinical:false, fit:"Strong — biologics developer with ongoing preclinical & clinical pipeline" },
  { tier:1, isNew:false, company:"AbelZeta Inc.", type:"Drug Developer", focus:"CAR-T & T cell therapies for cancer & autoimmune disease", employees:"~217", funding:"$120M total raised; GIC Private-backed", status:"Private", stage:"Clinical", preclinical:false, fit:"Direct — CAR-T immunotherapy requires humanized & immunodeficient mouse models" },
  { tier:1, isNew:false, company:"NovaBridge Biosciences", type:"Drug Developer", focus:"Immuno-oncology bispecific Abs (Givastomig, Ragistomig, Uliledlimab)", employees:"~50", funding:"Public (Nasdaq: NBP); ~$391M market cap; CBC Group-backed", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — bispecific Ab & CD73 Ab pipeline in oncology" },
  { tier:1, isNew:false, company:"RNAimmune", type:"Drug Developer", focus:"mRNA vaccines & therapeutics (cancer, infectious disease, rare disease)", employees:"~25", funding:"$37M total ($10M Seed + $27M Series A)", status:"Private", stage:"Clinical", preclinical:false, fit:"Good — mRNA biologics require in vivo delivery/immunogenicity studies" },
  { tier:1, isNew:false, company:"Seraxis, Inc.", type:"Drug Developer", focus:"iPSC-derived islet cell therapy (SR-01/SR-02) for insulin-dependent diabetes", employees:"~13", funding:"$50M+ total; Series C (Sep 2023); Eli Lilly, Frazier, T1D Fund", status:"Private", stage:"Preclinical", preclinical:true, fit:"Direct — fully outsources all animal model work; diabetes/immunology fit" },
  // ── NEW Tier 1 additions ─────────────────────────────────────────────
  { tier:1, isNew:true, company:"Sensei Biotherapeutics", type:"Drug Developer", focus:"Anti-VISTA checkpoint mAb (Solnerstotug/SNS-101) for PD-1 resistant solid tumors; TMAb platform", employees:"~49", funding:"Public (Nasdaq: SNSE); $12.1M market cap; focused on Phase 1/2 clinical data", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — immuno-oncology mAb; Rockville-based; humanized tumor models highly relevant for VISTA biology" },
  { tier:1, isNew:true, company:"Cartesian Therapeutics", type:"Drug Developer", focus:"mRNA cell therapies for autoimmune disease (Descartes-08 for myasthenia gravis, SLE)", employees:"~80", funding:"Public (Nasdaq: RNAC); $130M private placement (Jul 2024); $1.85M trailing revenue", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — Frederick MD-based; mRNA cell therapy for autoimmune; humanized mouse models for MOA studies" },
  { tier:1, isNew:true, company:"Theriva Biologics", type:"Drug Developer", focus:"Oncolytic adenovirus (VCN-01) for pancreatic cancer & retinoblastoma; FDA Fast Track", employees:"~22", funding:"Public (NYSE: TOVX); $9.4M market cap; €2.28M EU grant (Jan 2025); Phase 2b data 2025", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — Rockville-based; oncolytic virus in solid tumors; in vivo tumor pharmacology models needed" },
  { tier:1, isNew:true, company:"Sirnaomics", type:"Drug Developer", focus:"RNAi therapeutics (PNP & GalNAc platforms) for oncology, fibrosis, cardiometabolic disease", employees:"~60", funding:"Public (HKEX); $267M total raised; $17.7M post-IPO round (Sep 2025)", status:"Public", stage:"Clinical", preclinical:false, fit:"Direct — Gaithersburg-based; RNA therapeutic delivery requires in vivo PK/PD models" },
  { tier:1, isNew:true, company:"American Gene Technologies (AGT)", type:"Drug Developer", focus:"Gene & cell therapy for HIV (AGT103-T, Phase 1), liver cancer, PKU; lentiviral vector platform", employees:"~60", funding:"Private; $100M+ raised; Rockville-based 27,000 sq ft facility", status:"Private", stage:"Clinical", preclinical:false, fit:"Direct — gene/cell therapy pipeline; humanized & immunodeficient models essential for efficacy studies" },
  { tier:1, isNew:true, company:"Sanaria Inc.", type:"Drug Developer", focus:"Whole-parasite malaria vaccines (PfSPZ) & malaria mAbs; multiple Phase 2/3 trials globally", employees:"~100", funding:"$43M+ (Gates Foundation, DoD, NIH SBIR); private", status:"Private", stage:"Clinical", preclinical:false, fit:"Good — Rockville-based; infectious disease vaccine platform; animal models for immunogenicity & protection studies" },
  { tier:1, isNew:true, company:"Aurinia Pharmaceuticals", type:"Drug Developer", focus:"Autoimmune disease (Lupkynis for lupus nephritis); AUR200 (BAFF/APRIL inhibitor biologic)", employees:"~316", funding:"Public (Nasdaq: AUPH); $1.73B market cap; $266M revenue (2024)", status:"Public", stage:"Commercial", preclinical:false, fit:"Good — Rockville US hub; AUR200 biologic pipeline needs humanized autoimmune mouse models" },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 2 — GOOD FIT
  // ═══════════════════════════════════════════════════════════════════════
  { tier:2, isNew:false, company:"Novavax", type:"Drug Developer", focus:"Recombinant protein-based vaccines (COVID-19, influenza, mpox)", employees:"~1,000", funding:"Public (NVAX); $682M revenue (2024); Sanofi partnership", status:"Public", stage:"Commercial", preclinical:false, fit:"Moderate — large internal capacity but outsources specific preclinical studies" },
  { tier:2, isNew:false, company:"Lentigen Biotec", type:"Drug Developer", focus:"Lentiviral vector-based cell & gene therapies", employees:"~75", funding:"Subsidiary of Miltenyi Biotec; parent-backed", status:"Private (subsidiary)", stage:"Clinical", preclinical:false, fit:"Good — gene-modified cell therapies benefit from immunodeficient/humanized models" },
  { tier:2, isNew:false, company:"Aptabridge Therapeutics", type:"Drug Developer", focus:"DNA nanoparticle-based immune modulators for oncology & autoimmune disease", employees:"~5", funding:"Grant-funded (Nucleate, Johns Hopkins President's Venture Fellowship)", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — early-stage immunotherapy; fully outsources preclinical work" },
  { tier:2, isNew:false, company:"Rapafusyn", type:"Drug Developer", focus:"Rapamycin-based targeted therapeutics", employees:"<20", funding:"Early-stage; limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — very small company; likely outsources all preclinical CRO work" },
  { tier:2, isNew:false, company:"Rise Therapeutics", type:"Drug Developer", focus:"Oral biologics for autoimmunity, cancer, infections (TPX platform; IND clearance for R-2487)", employees:"<20", funding:"Early-stage; limited public info", status:"Private", stage:"Clinical", preclinical:false, fit:"Good — biologics pipeline; outsources preclinical work" },
  { tier:2, isNew:false, company:"BaseCure Therapeutics", type:"Drug Developer", focus:"Next-generation RNAi medicines", employees:"<15", funding:"Early-stage; limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — RNAi therapeutics require in vivo delivery & target validation models" },
  { tier:2, isNew:false, company:"ZielBio, Inc.", type:"Drug Developer", focus:"Cancer-specific plectin-targeting mAbs (ZB131/Ibentatug) for solid tumors", employees:"~25", funding:"Early-stage VC; Phase 1 completed", status:"Private", stage:"Clinical", preclinical:false, fit:"Good — oncology mAb moving to Phase 2; needs in vivo efficacy data" },
  { tier:2, isNew:false, company:"Excyte Biopharma Ltd.", type:"Drug Developer", focus:"Biotherapeutics (early-stage)", employees:"<20", funding:"Limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — if biologics-focused, preclinical models relevant" },
  { tier:2, isNew:false, company:"Fzata, Inc.", type:"Drug Developer", focus:"Oral BioPYM biologic platform for rare/orphan disease (Biotech Showcase 2024 presenter)", employees:"<20", funding:"Grant-funded", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — rare disease biologics may require custom KO/transgenic models" },
  { tier:2, isNew:false, company:"Iyuda Therapeutics", type:"Drug Developer", focus:"Inflammation / immune-mediated disease therapeutics", employees:"<20", funding:"Early-stage; limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — inflammatory disease biologics need humanized mouse models" },
  { tier:2, isNew:false, company:"Pinco Biotherapeutics", type:"Drug Developer", focus:"Biotherapeutics (early-stage)", employees:"<20", funding:"Early-stage; limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — biotherapeutics focus; outsources all preclinical work" },
  { tier:2, isNew:false, company:"Accumulate Therapeutics", type:"Drug Developer", focus:"Early-stage therapeutics", employees:"<20", funding:"Limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — likely outsources all preclinical CRO needs" },
  { tier:2, isNew:false, company:"Alcamena", type:"Drug Developer", focus:"Early-stage drug discovery / therapeutics", employees:"<20", funding:"Limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — preclinical stage; potential need for in vivo efficacy studies" },
  { tier:2, isNew:false, company:"Artesian Therapeutics", type:"Drug Developer", focus:"Cardiovascular / heart failure therapeutics (PDE9 inhibitors)", employees:"~20", funding:"NIH/TEDCO grants; limited VC info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — cardiovascular disease; transgenic heart failure mice relevant" },
  { tier:2, isNew:false, company:"Manat Bio, Inc.", type:"Drug Developer", focus:"Early-stage biotech (Maryland-based)", employees:"<20", funding:"Limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Moderate — if biologics-focused, preclinical models relevant" },
  { tier:2, isNew:false, company:"EXOM Biopharma", type:"Drug Developer", focus:"Exosome-based therapeutics / biotherapeutics", employees:"<20", funding:"Early-stage; limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — exosome biologics require in vivo delivery & biodistribution studies" },
  { tier:2, isNew:false, company:"Clasp Therapeutics", type:"Drug Developer", focus:"Bispecific antibodies / targeted cancer therapy (Maryland)", employees:"<20", funding:"Early-stage; limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — bispecific Ab focus; preclinical efficacy models directly relevant" },
  { tier:2, isNew:false, company:"OnconeX", type:"Drug Developer", focus:"Oncology therapeutics (Maryland)", employees:"<20", funding:"Limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — oncology focus; preclinical in vivo models needed" },
  { tier:2, isNew:false, company:"A&G Pharmaceutical, Inc.", type:"Drug Developer", focus:"Theranostics; anti-GP88 mAb for breast cancer; custom antibody services", employees:"~13", funding:"$2.1–3.5M total equity (early-stage)", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — mAb therapeutics in oncology; outsources preclinical pharmacology" },
  // ── NEW Tier 2 additions ─────────────────────────────────────────────
  { tier:2, isNew:true, company:"AsclepiX Therapeutics", type:"Drug Developer", focus:"Peptide biologics for retinal diseases & cancer (AXT107); Johns Hopkins spinout", employees:"~20", funding:"$50M total raised; $10M Series A-3 (Jul 2023); Perceptive Advisors-led", status:"Private", stage:"Clinical", preclinical:false, fit:"Good — Baltimore-based; peptide biologics with Phase 1/2 trials; in vivo model needs for combination studies" },
  { tier:2, isNew:true, company:"Leadiant Biosciences", type:"Drug Developer", focus:"Rare & ultra-rare disease therapies; Gaithersburg-based specialty pharma", employees:"~100", funding:"Private; Italian parent company (Sigma-Tau group heritage)", status:"Private", stage:"Commercial", preclinical:false, fit:"Moderate — rare disease drug dev; new pipeline assets may require KO/disease models" },
  { tier:2, isNew:true, company:"Top Alliance Biosciences", type:"Drug Developer", focus:"Oncology / bispecific antibodies (Maryland)", employees:"<30", funding:"Limited public info", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — bispecific Ab focus; preclinical models relevant" },
  { tier:2, isNew:true, company:"OnCusp Therapeutics", type:"Drug Developer", focus:"ADC for Cadherin-6 (CUSP06) in platinum-resistant ovarian cancer; in-licensing model", employees:"~20", funding:"Private; early-stage VC", status:"Private", stage:"Preclinical", preclinical:true, fit:"Good — ADC oncology; all preclinical in vivo work outsourced" },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 3 — MODERATE FIT
  // ═══════════════════════════════════════════════════════════════════════
  { tier:3, isNew:false, company:"BIOQUAL", type:"CRO/Research Org", focus:"Preclinical CRO for vaccines, biologics, infectious disease animal models", employees:"~125", funding:"Private; revenue-funded", status:"Private", stage:"N/A (CRO)", preclinical:false, fit:"Partner/Competitor — CRO itself; may co-source specific humanized models from Biocytogen" },
  { tier:3, isNew:false, company:"Frederick National Laboratory", type:"Research Institute", focus:"NCI-sponsored cancer & infectious disease research (Leidos-operated)", employees:"~2,000", funding:"Federal (NCI)", status:"Government", stage:"Research", preclinical:false, fit:"Moderate — uses humanized mouse models for cancer; large procurement process" },
  { tier:3, isNew:false, company:"Walter Reed Army Institute of Research", type:"Research Institute", focus:"Infectious disease, vaccine development for military", employees:"~500", funding:"Federal (DoD)", status:"Government", stage:"Research", preclinical:false, fit:"Moderate — animal models for vaccine studies; procurement via government channels" },
  { tier:3, isNew:false, company:"U.S. Army Medical Research Institute of Infectious Diseases", type:"Research Institute", focus:"Biodefense / infectious disease research & countermeasures", employees:"~900", funding:"Federal (DoD/BARDA)", status:"Government", stage:"Research", preclinical:false, fit:"Moderate — BSL-3/4 animal models; specific humanized model needs possible" },
  { tier:3, isNew:false, company:"Kennedy Krieger Institute", type:"Research Institute", focus:"Neurological & rare disease research (pediatric focus)", employees:"~3,000", funding:"Non-profit; NIH grants + donations", status:"Non-profit", stage:"Research", preclinical:false, fit:"Moderate — KO/transgenic models for rare neurological diseases" },
  { tier:3, isNew:false, company:"Leidos Biomedical Research Inc.", type:"Research Services", focus:"Contract research support for NCI, NIH (Frederick NL operator)", employees:"~2,000", funding:"Gov. contract (NCI); Leidos subsidiary", status:"Private (subsidiary)", stage:"N/A", preclinical:false, fit:"Low-Moderate — may procure specific humanized models" },
  { tier:3, isNew:false, company:"Morgan State University", type:"Academic", focus:"Life sciences research (oncology, infectious disease, neuroscience)", employees:"~1,500", funding:"Federal grants (NIH, NSF) + state", status:"Public university", stage:"Research", preclinical:false, fit:"Moderate — research institution; occasional KO or transgenic model needs" },
  { tier:3, isNew:false, company:"Eastern Virginia Medical School", type:"Academic", focus:"Medical research (metabolic disease, cancer, infectious disease)", employees:"~900", funding:"Federal grants + clinical revenue", status:"Non-profit academic", stage:"Research", preclinical:false, fit:"Moderate — academic researchers may use humanized models" },
  { tier:3, isNew:false, company:"Lieber Institute for Brain Development", type:"Research Institute", focus:"Neuropsychiatric disease research (schizophrenia, autism, Alzheimer's)", employees:"~200", funding:"Private endowment; NIH grants", status:"Non-profit", stage:"Research", preclinical:false, fit:"Low-Moderate — CNS disease; some mouse model use but primarily human tissue-based" },
  { tier:3, isNew:false, company:"Virginia Commonwealth University Health", type:"Academic", focus:"Clinical & translational research across oncology, immunology, rare disease", employees:"~14,000", funding:"NIH grants + clinical revenue", status:"Public academic medical center", stage:"Research", preclinical:false, fit:"Moderate — translational research groups may use humanized models" },
  { tier:3, isNew:false, company:"University of Maryland, College Park", type:"Academic", focus:"Broad life sciences research (bioengineering, infectious disease, cancer)", employees:"~10,000", funding:"Federal & state grants", status:"Public university", stage:"Research", preclinical:false, fit:"Moderate — individual researchers may access BioMice for specific projects" },
  { tier:3, isNew:false, company:"J. Craig Venter Institute", type:"Research Institute", focus:"Genomics, synthetic biology, infectious disease", employees:"~300", funding:"Federal grants (NIH, DoE, DARPA)", status:"Non-profit", stage:"Research", preclinical:false, fit:"Low — primarily genomics/informatics; limited in vivo animal model work" },
  { tier:3, isNew:false, company:"CVPath Institute", type:"Research Institute", focus:"Cardiovascular pathology research; device & drug safety testing", employees:"~75", funding:"Industry contracts + grants", status:"Non-profit", stage:"Research", preclinical:false, fit:"Moderate — cardiovascular in vivo studies; some animal model procurement" },
  { tier:3, isNew:false, company:"United States Dept. of Veterans Affairs", type:"Government", focus:"Veterans health research across multiple disease areas", employees:"N/A", funding:"Federal", status:"Government", stage:"Research", preclinical:false, fit:"Low-Moderate — individual VA researchers may use transgenic/KO models" },
  { tier:3, isNew:false, company:"Champions Oncology, Inc.", type:"Research Services", focus:"Tumor growth inhibition (TGI) studies using patient-derived tumor models", employees:"~30", funding:"Private; revenue-funded", status:"Private", stage:"Research Services", preclinical:false, fit:"Moderate — could partner to combine PDX with humanized mouse models" },
  { tier:3, isNew:false, company:"Precision For Medicine", type:"CRO", focus:"Biomarker-driven clinical research & precision medicine CRO", employees:"~500", funding:"Private equity-backed (Altamont Capital)", status:"Private (PE-backed)", stage:"N/A (CRO)", preclinical:false, fit:"Low-Moderate — CRO; may outsource specific preclinical model needs" },
  { tier:3, isNew:false, company:"Pharmaron", type:"CRO", focus:"Integrated drug discovery & development CRO services (global)", employees:"~10,000", funding:"Public (HKEX); large CRO", status:"Public", stage:"N/A (CRO)", preclinical:false, fit:"Low-Moderate — large CRO; may sub-contract specific humanized models" },
  { tier:3, isNew:false, company:"Innovent Biologics", type:"Drug Developer", focus:"Biologic drugs (sintilimab PD-1, HER2, ADCs); global clinical trials", employees:"~3,000", funding:"Public (HKEX 1801); well-capitalized", status:"Public", stage:"Commercial", preclinical:false, fit:"Moderate — MD presence; humanized models for US clinical studies" },
  // ── NEW Tier 3 additions ─────────────────────────────────────────────
  { tier:3, isNew:true, company:"Aurinia Pharmaceuticals (AUR200 pipeline)", type:"Drug Developer", focus:"AUR200 biologic (BAFF/APRIL dual inhibitor) for autoimmune diseases in development", employees:"~316", funding:"Public (Nasdaq: AUPH); $1.73B market cap; $266M revenue (2024)", status:"Public", stage:"Clinical", preclinical:false, fit:"Moderate — Rockville commercial hub; AUR200 biologic may need humanized autoimmune models" },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 4 — LOW FIT / SERVICES / INFRASTRUCTURE
  // ═══════════════════════════════════════════════════════════════════════
  { tier:4, isNew:false, company:"Advanced BioScience Laboratories, Inc.", type:"CRO/CDMO", focus:"Preclinical CRO for biologics, vaccines, cell/gene therapies (BSL-2/3)", employees:"~150", funding:"Private; government contracts (NIH, BARDA)", status:"Private", stage:"N/A (CRO)", preclinical:false, fit:"Partner/Competitor — CRO; may co-source humanized models; can refer clients" },
  { tier:4, isNew:false, company:"American Type Culture Collection (ATCC)", type:"Research Supplier", focus:"Biological materials repository: cell lines, microorganisms, tissues", employees:"~700", funding:"Non-profit; revenue-funded", status:"Non-profit", stage:"N/A", preclinical:false, fit:"Low — materials supplier; different customer profile" },
  { tier:4, isNew:false, company:"BioFactura, Inc.", type:"CDMO", focus:"Biosimilar & biologic manufacturing (CDMO)", employees:"~65", funding:"Private; government contracts", status:"Private", stage:"N/A (CDMO)", preclinical:false, fit:"Low-Moderate — CDMO clients may need animal models; indirect opportunity" },
  { tier:4, isNew:false, company:"Biofargo Inc.", type:"Research Services", focus:"Biotech services / early-stage research", employees:"<20", funding:"Limited public info", status:"Private", stage:"N/A", preclinical:false, fit:"Low — unclear drug development pipeline" },
  { tier:4, isNew:false, company:"Biollogic", type:"Research Services", focus:"Biologic research services", employees:"<20", funding:"Limited public info", status:"Private", stage:"N/A", preclinical:false, fit:"Low — services focus; not a primary BioMice customer" },
  { tier:4, isNew:false, company:"Bionavigen, LLC", type:"Consulting", focus:"Drug discovery consulting, regulatory affairs, IND applications", employees:"<15", funding:"Limited public info", status:"Private", stage:"N/A (Consulting)", preclinical:false, fit:"Indirect — consulting firm whose clients may need BioMice services" },
  { tier:4, isNew:false, company:"Blackbird Laboratories", type:"Incubator", focus:"Nonprofit life sciences incubator; translating academic research into companies (Baltimore)", employees:"~20", funding:"Non-profit; philanthropic + grants", status:"Non-profit", stage:"N/A (Incubator)", preclinical:false, fit:"Indirect — portfolio companies may be BioMice customers; channel opportunity" },
  { tier:4, isNew:false, company:"Creative Biopeptides", type:"Research Supplier", focus:"Custom peptide & antibody synthesis services", employees:"<20", funding:"Limited public info", status:"Private", stage:"N/A (Services)", preclinical:false, fit:"Low — reagent/materials supplier" },
  { tier:4, isNew:false, company:"Khan Sciences", type:"Research/Services", focus:"Life sciences research services", employees:"<20", funding:"Limited public info", status:"Private", stage:"N/A", preclinical:false, fit:"Low — limited public pipeline info" },
  { tier:4, isNew:false, company:"LEGIT Tech", type:"Technology", focus:"Biotech / life sciences technology company", employees:"<20", funding:"Limited public info", status:"Private", stage:"N/A", preclinical:false, fit:"Low — technology focus, not drug developer" },
  { tier:4, isNew:false, company:"Mindgram", type:"Digital Health", focus:"Mental health / digital therapeutics platform", employees:"<50", funding:"Limited public info", status:"Private", stage:"N/A", preclinical:false, fit:"None — digital health; no animal model needs" },
  { tier:4, isNew:false, company:"Technology Catalysts International", type:"Consulting", focus:"Technology licensing & commercialization consulting (life sciences)", employees:"<30", funding:"Consulting firm; revenue-funded", status:"Private", stage:"N/A", preclinical:false, fit:"None — consulting/licensing; not a drug developer" },
  { tier:4, isNew:false, company:"Aclairo Pharmaceutical Development Group", type:"Consulting/CRO", focus:"Regulatory/scientific consulting: toxicology, ADME, cell & gene therapy", employees:"~22", funding:"Private; subsidiary of Experimental Pathology Laboratories", status:"Private (subsidiary)", stage:"N/A (Consulting)", preclinical:false, fit:"Indirect — advises pharma clients who may be BioMice customers" },
  { tier:4, isNew:false, company:"Xcellon Biologics", type:"CDMO", focus:"Biologic CDMO for antibodies, proteins, ADCs; MoU with IntoCell (Nov 2025)", employees:"~40", funding:"Private; limited public info", status:"Private", stage:"N/A (CDMO)", preclinical:false, fit:"Low-Moderate — CDMO; clients developing biologics may need Biocytogen models" },
  { tier:4, isNew:false, company:"Lotus Biotech", type:"Research/Services", focus:"Biotech services / research (Maryland)", employees:"<30", funding:"Limited public info", status:"Private", stage:"N/A", preclinical:false, fit:"Low — services company; unlikely direct BioMice customer" },
];

const TIERS = [
  { tier:1, label:"Tier 1 — Strongest Fit", icon:"◆", color:"#22c55e", bg:"#081808", border:"#22c55e" },
  { tier:2, label:"Tier 2 — Good Fit", icon:"◈", color:"#84cc16", bg:"#0e1608", border:"#84cc16" },
  { tier:3, label:"Tier 3 — Moderate Fit", icon:"◇", color:"#f97316", bg:"#160e06", border:"#f97316" },
  { tier:4, label:"Tier 4 — Low Fit / Services", icon:"○", color:"#64748b", bg:"#0c0e12", border:"#64748b" },
];

export default function App() {
  const [activeTier, setActiveTier] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [showPreclinicalOnly, setShowPreclinicalOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ALL.filter(d => {
    if (activeTier !== "all" && d.tier !== parseInt(activeTier)) return false;
    if (showPreclinicalOnly && !d.preclinical) return false;
    if (showNewOnly && !d.isNew) return false;
    if (search && !d.company.toLowerCase().includes(search.toLowerCase()) && !d.focus.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const td = (t) => TIERS.find(x => x.tier === t);
  const newCount = ALL.filter(d => d.isNew).length;
  const preCount = ALL.filter(d => d.preclinical).length;

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#060b06", minHeight:"100vh", color:"#cce8c8", padding:"28px 18px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .row{transition:background 0.12s;cursor:pointer;}
        .row:hover{background:rgba(34,197,94,0.07)!important;}
        .exp{animation:fi 0.15s ease;}
        @keyframes fi{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}
        input{outline:none;}input::placeholder{color:#2d4a2d;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#1a2e1a;border-radius:3px;}
        ::-webkit-scrollbar-track{background:#060b06;}
      `}</style>

      {/* Header */}
      <div style={{ maxWidth:1180, margin:"0 auto 22px" }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, letterSpacing:"0.3em", color:"#4ade80", textTransform:"uppercase", marginBottom:6 }}>
          Sales Intelligence · Biocytogen BioMice & Pharmacology Services
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,4vw,40px)", fontWeight:900, color:"#e0f2dc", letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:5 }}>
          Prospect Intelligence Table
        </h1>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:"#4a7048", marginTop:6 }}>
          <span>{ALL.length} total companies</span>
          <span style={{color:"#22c55e"}}>✦ {newCount} newly added prospects</span>
          <span style={{color:"#a78bfa"}}>● {preCount} preclinical-stage</span>
          <span style={{color:"#64748b"}}>✗ 33 existing customers excluded</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ maxWidth:1180, margin:"0 auto 14px", display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        {[{id:"all",label:`All (${ALL.length})`},...TIERS.map(t=>({id:String(t.tier),label:`${t.icon} T${t.tier} (${ALL.filter(d=>d.tier===t.tier).length})`}))].map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTier(tab.id)} style={{
            background:activeTier===tab.id?"#22c55e":"transparent",
            color:activeTier===tab.id?"#060b06":"#537050",
            border:`1px solid ${activeTier===tab.id?"#22c55e":"#162616"}`,
            padding:"4px 12px", borderRadius:2, fontFamily:"'IBM Plex Mono',monospace", fontSize:11,
            cursor:"pointer", fontWeight:activeTier===tab.id?700:400, letterSpacing:"0.04em", transition:"all 0.12s"
          }}>{tab.label}</button>
        ))}
        <button onClick={()=>setShowPreclinicalOnly(!showPreclinicalOnly)} style={{
          background:showPreclinicalOnly?"#4c1d95":"transparent", color:showPreclinicalOnly?"#e9d5ff":"#537050",
          border:`1px solid ${showPreclinicalOnly?"#7c3aed":"#162616"}`, padding:"4px 12px", borderRadius:2,
          fontFamily:"'IBM Plex Mono',monospace", fontSize:11, cursor:"pointer", transition:"all 0.12s"
        }}>● Preclinical</button>
        <button onClick={()=>setShowNewOnly(!showNewOnly)} style={{
          background:showNewOnly?"#1e3a5f":"transparent", color:showNewOnly?"#93c5fd":"#537050",
          border:`1px solid ${showNewOnly?"#3b82f6":"#162616"}`, padding:"4px 12px", borderRadius:2,
          fontFamily:"'IBM Plex Mono',monospace", fontSize:11, cursor:"pointer", transition:"all 0.12s"
        }}>✦ New Only</button>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{
          background:"#0b120b", border:"1px solid #162616", color:"#cce8c8",
          padding:"4px 10px", borderRadius:2, fontFamily:"'IBM Plex Mono',monospace", fontSize:11,
          marginLeft:"auto", width:180
        }}/>
      </div>

      {/* Stats bar */}
      <div style={{ maxWidth:1180, margin:"0 auto 12px", display:"flex", gap:16, flexWrap:"wrap" }}>
        {TIERS.map(t=>{
          const rows = filtered.filter(d=>d.tier===t.tier);
          if(!rows.length) return null;
          const pre = rows.filter(r=>r.preclinical).length;
          const nw = rows.filter(r=>r.isNew).length;
          return (
            <span key={t.tier} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:t.color}}>
              {t.icon} {rows.length}
              {pre>0&&<span style={{color:"#a78bfa"}}> · {pre}pc</span>}
              {nw>0&&<span style={{color:"#60a5fa"}}> · {nw} new</span>}
            </span>
          );
        })}
        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#3d6040",marginLeft:"auto"}}>
          {filtered.length} shown
        </span>
      </div>

      {/* Table */}
      <div style={{ maxWidth:1180, margin:"0 auto" }}>
        {/* Column headers */}
        <div style={{ display:"grid", gridTemplateColumns:"20px 16px 210px 75px 90px 100px 1fr", gap:0, padding:"7px 10px", borderBottom:"1px solid #162616", marginBottom:1 }}>
          {["","","Company","Employees","Funding","Status","Biocytogen Fit"].map((h,i)=>(
            <div key={i} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,letterSpacing:"0.2em",color:"#253e25",textTransform:"uppercase",paddingLeft:i<2?0:6}}>{h}</div>
          ))}
        </div>

        {TIERS.map(tg=>{
          const rows = filtered.filter(d=>d.tier===tg.tier);
          if(!rows.length) return null;
          return (
            <div key={tg.tier} style={{ marginBottom:14 }}>
              {/* Tier banner */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:`${tg.bg}dd`,borderLeft:`3px solid ${tg.color}`,marginBottom:1}}>
                <span style={{color:tg.color,fontFamily:"'IBM Plex Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase"}}>
                  {tg.icon} {tg.label} · {rows.length} companies
                  {rows.filter(r=>r.preclinical).length>0 && <span style={{color:"#a78bfa",marginLeft:8}}>· {rows.filter(r=>r.preclinical).length} preclinical</span>}
                  {rows.filter(r=>r.isNew).length>0 && <span style={{color:"#60a5fa",marginLeft:8}}>· {rows.filter(r=>r.isNew).length} new</span>}
                </span>
              </div>

              {rows.map((row, i) => {
                const isExp = expanded === row.company;
                return (
                  <div key={row.company}>
                    <div className="row" onClick={()=>setExpanded(isExp?null:row.company)} style={{
                      display:"grid", gridTemplateColumns:"20px 16px 210px 75px 90px 100px 1fr", gap:0,
                      padding:"10px 10px", borderBottom:"1px solid #0c140c", alignItems:"start",
                      background:i%2===0?"transparent":"#090e09"
                    }}>
                      {/* Arrow */}
                      <div style={{color:"#253e25",fontSize:10,paddingTop:2,fontFamily:"monospace"}}>{isExp?"▾":"▸"}</div>
                      {/* New badge */}
                      <div style={{paddingTop:3}}>
                        {row.isNew && <div style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6",title:"New prospect"}}/>}
                      </div>
                      {/* Company */}
                      <div style={{paddingLeft:6,paddingRight:8}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:"#c8e6c0",lineHeight:1.2,marginBottom:3}}>{row.company}</div>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {row.preclinical&&<span style={{background:"#1e0d40",border:"1px solid #7c3aed",color:"#c4b5fd",fontSize:7,padding:"1px 4px",borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>PRECLINICAL</span>}
                          {row.type&&<span style={{background:tg.bg,border:`1px solid ${tg.border}55`,color:tg.color,fontSize:7,padding:"1px 4px",borderRadius:2,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.05em"}}>{row.type}</span>}
                        </div>
                        <div style={{fontSize:10,color:"#3d6040",lineHeight:1.4,marginTop:3,fontFamily:"'IBM Plex Mono',monospace"}}>{row.focus.length>70?row.focus.slice(0,68)+"…":row.focus}</div>
                      </div>
                      {/* Employees */}
                      <div style={{paddingLeft:6,fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:tg.color,paddingTop:2}}>{row.employees}</div>
                      {/* Funding */}
                      <div style={{paddingLeft:6,paddingRight:6,fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#5a845a",lineHeight:1.5,paddingTop:2}}>
                        {row.funding.length>55?row.funding.slice(0,52)+"…":row.funding}
                      </div>
                      {/* Status + Stage */}
                      <div style={{paddingLeft:6}}>
                        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:tg.color}}>{row.status}</div>
                        {row.stage&&!row.stage.startsWith("N/A")&&<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#3d6040",marginTop:2}}>{row.stage}</div>}
                      </div>
                      {/* Fit */}
                      <div style={{paddingLeft:6,fontSize:11,color:"#9fcc9b",lineHeight:1.5}}>{row.fit}</div>
                    </div>

                    {isExp&&(
                      <div className="exp" style={{padding:"12px 10px 12px 46px",background:`${tg.bg}aa`,borderBottom:`1px solid ${tg.border}44`,borderLeft:`3px solid ${tg.border}`}}>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
                          {[
                            {label:"Focus Area",val:row.focus},
                            {label:"Headcount",val:row.employees},
                            {label:"Funding Detail",val:row.funding},
                            {label:"Corporate Status",val:`${row.status}${row.stage&&!row.stage.startsWith("N/A")?" · "+row.stage:""}`},
                            {label:"BioMice / Pharmacology Fit",val:row.fit},
                          ].map(item=>(
                            <div key={item.label}>
                              <div style={{fontSize:7,letterSpacing:"0.22em",color:tg.color,textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace",marginBottom:3}}>{item.label}</div>
                              <div style={{fontSize:11,color:"#b4d8b0",lineHeight:1.5,fontFamily:"'IBM Plex Mono',monospace"}}>{item.val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"50px",color:"#253e25",fontFamily:"'IBM Plex Mono',monospace",fontSize:13}}>No companies match your filters.</div>
        )}
      </div>

      {/* Legend + Footer */}
      <div style={{maxWidth:1180,margin:"20px auto 0",paddingTop:12,borderTop:"1px solid #162616",display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#60a5fa",display:"flex",alignItems:"center",gap:4}}><span style={{width:7,height:7,borderRadius:"50%",background:"#3b82f6",display:"inline-block"}}/>New prospect</span>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#a78bfa"}}>● Preclinical stage</span>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#3d6040"}}>Click row to expand · Data: PitchBook, Crunchbase, press releases · March 2026</span>
        </div>
      </div>
    </div>
  );
}
