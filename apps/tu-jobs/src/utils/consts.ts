export const forceFetchJobs = true,
    useDummy = true;

export const jobSectors = [
    "Academic",
    "Accounting",
    "Admin",
    "Advertising",
    "Agriculture",
    "Automotive",
    "Aviation",
    "Banking",
    "Business Management",
    "Call Centre",
    "Chemical",
    "Clothing",
    "Construction",
    "Consulting",
    "Cruise Ship",
    "Defence",
    "Design Services",
    "E-Commerce",
    "Education",
    "Engineering",
    "Entertainment",
    "Environmental",
    "Fashion",
    "Finance",
    "FMCG",
    "Freight",
    "General",
    "Government & Parastatals",
    "Graduate",
    "Health & Safety",
    "Health Fitness & Beauty",
    "Hospitality",
    "Human Resources",
    "Import & Export",
    "Insurance",
    "Internet",
    "Investment",
    "IT",
    "Legal",
    "Lifestyle",
    "Logistics",
    "Management",
    "Manufacturing",
    "Market Research",
    "Marketing",
    "Media",
    "Medical",
    "Mining",
    "Motoring",
    "NGO & Non-profit",
    "Petrochemical",
    "Pharmaceutical",
    "PR & Communication",
    "Procurement",
    "Property",
    "Purchasing",
    "Real Estate",
    "Recruitment",
    "Research",
    "Retail",
    "Sales",
    "Security",
    "Social Services",
    "Soft Skills",
    "Sports",
    "Stockbroking",
    "Technical",
    "Technology",
    "Telecommunications",
    "Trades & Services",
    "Travel & Tourism",
    "Warehousing",
];
export const SITE = "Tujobs";
export const minPrices = [1, 2, 3, 4].map((el) => el * 12000),
    JOB_ID_FACTOR = 0;
export const contractTypes = [
    "Permenent",
    "Part-Time",
    "Contract",
    "Temporary",
    "Internship",
];
export class CONFIG {
    static host: string = "";
    get host() {
        return this.host;
    }
    set host(v) {
        this.host = v;
    }
}
export const jobSources = ["careers24", "careerjunction", "simplify"] as const;

export const baseUrls = {
    careers24: "https://www.careers24.com",
    careerjunction: "https://www.careerjunction.co.za",
    simplify: "https://{ep}.simplify.hr"
};
