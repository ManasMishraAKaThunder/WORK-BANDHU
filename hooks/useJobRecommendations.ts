import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_JOBS } from '@/constants/Languages';

// Skill ID → Job category mapping
const SKILL_TO_CATEGORY: Record<string, string> = {
  labour: 'labour',
  mason: 'mason',
  it_technician: 'technician',
  carpenter: 'carpenter',
  electrician: 'electrician',
  painter: 'painter',
  plumber: 'plumber',
  welder: 'welder',
  foreman: 'foreman',
  supervisor: 'supervisor',
  engineer: 'engineer',
};

// Keywords commonly associated with experience levels
const EXPERIENCE_KEYWORDS: Record<string, string[]> = {
  // Job type keywords
  fullTime: ['full time', 'permanent', 'regular', 'office', 'monthly', 'salary', 'company'],
  partTime: ['part time', 'freelance', 'flexible', 'tuition', 'evening', 'weekend'],
  dailyWage: ['daily', 'contract', 'labour', 'helper', 'casual', 'temporary', 'site'],
  // Seniority keywords
  senior: ['supervisor', 'foreman', 'manager', 'lead', 'head', 'incharge', 'senior', '10 year', '8 year', '7 year', '5 year'],
  mid: ['experienced', '3 year', '4 year', '2 year', 'worked', 'know', 'trained'],
  entry: ['fresher', 'new', 'learning', 'beginner', 'student', 'iti', 'diploma', 'pass'],
  // Domain-specific keywords
  construction: ['construction', 'building', 'site', 'cement', 'concrete', 'brick', 'foundation', 'floor'],
  electrical: ['wiring', 'electrical', 'motor', 'ac', 'repair', 'circuit', 'panel', 'switch'],
  woodwork: ['wood', 'furniture', 'cabinet', 'door', 'window', 'modular', 'kitchen', 'polish'],
  metalwork: ['welding', 'fabrication', 'mig', 'tig', 'steel', 'iron', 'gate', 'grill', 'pipe'],
  teaching: ['teaching', 'teacher', 'tuition', 'school', 'student', 'class', 'subject', 'math', 'science', 'english', 'hindi', 'computer'],
  plumbing: ['plumbing', 'pipe', 'water', 'tank', 'sanitary', 'fitting', 'bathroom'],
  painting: ['paint', 'painting', 'interior', 'exterior', 'wall', 'texture', 'pop', 'polish', 'color'],
  driving: ['driving', 'driver', 'truck', 'auto', 'vehicle', 'license', 'delivery'],
  tech: ['cctv', 'mobile', 'repair', 'cnc', 'machine', 'fitter', 'motor'],
};

// Category → domain mapping for cross-referencing
const CATEGORY_DOMAINS: Record<string, string[]> = {
  labour: ['construction', 'dailyWage'],
  mason: ['construction'],
  electrician: ['electrical'],
  carpenter: ['woodwork'],
  welder: ['metalwork'],
  painter: ['painting'],
  plumber: ['plumbing'],
  technician: ['tech', 'electrical'],
  teacher: ['teaching'],
  driver: ['driving'],
  foreman: ['construction', 'senior'],
  supervisor: ['construction', 'senior'],
  engineer: ['construction', 'electrical'],
  security: ['construction'],
  helper: ['construction', 'dailyWage'],
};

export interface ScoredJob {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  distance: string;
  type: string;
  urgent: boolean;
  posted: string;
  category: string;
  matchScore: number; // 0-100
  matchReasons: string[];
}

export function useJobRecommendations() {
  const {
    selectedSkills,
    experience,
    address,
    savedJobs,
    recentlyViewedJobs,
  } = useApp();

  const userCategories = useMemo(() => {
    return selectedSkills.map(s => SKILL_TO_CATEGORY[s] || s);
  }, [selectedSkills]);

  const scoredJobs = useMemo((): ScoredJob[] => {
    const expLower = (experience || '').toLowerCase();
    const addrLower = (address || '').toLowerCase();
    const savedIds = new Set(savedJobs.map(j => j.id));
    const recentIds = new Set(recentlyViewedJobs.map(j => j.id));

    // Extract experience keywords the user mentioned
    const userExpKeywords: string[] = [];
    Object.entries(EXPERIENCE_KEYWORDS).forEach(([domain, keywords]) => {
      keywords.forEach(kw => {
        if (expLower.includes(kw)) {
          userExpKeywords.push(domain);
        }
      });
    });
    const userDomains = new Set(userExpKeywords);

    return MOCK_JOBS.map(job => {
      let score = 0;
      const reasons: string[] = [];

      // 1. SKILL MATCH (0-35 points) — Primary signal
      if (userCategories.includes(job.category)) {
        score += 35;
        reasons.push('Matches your skills');
      }

      // 2. EXPERIENCE MATCH (0-30 points) — AI keyword matching
      if (expLower.length > 0) {
        const jobDomains = CATEGORY_DOMAINS[job.category] || [];
        let expMatch = 0;

        // Check if user's experience mentions domains relevant to this job
        jobDomains.forEach(domain => {
          if (userDomains.has(domain)) {
            expMatch += 10;
          }
        });

        // Direct keyword matching in experience vs job title
        const titleWords = job.title.toLowerCase().split(/[\s\-\/&]+/);
        titleWords.forEach(word => {
          if (word.length > 2 && expLower.includes(word)) {
            expMatch += 5;
          }
        });

        // Company name in experience
        if (expLower.includes(job.company.toLowerCase().split(' ')[0].toLowerCase())) {
          expMatch += 3;
        }

        score += Math.min(expMatch, 30);
        if (expMatch >= 10) reasons.push('Matches your experience');

        // Seniority matching
        if (userDomains.has('senior') && ['foreman', 'supervisor', 'engineer'].includes(job.category)) {
          score += 5;
          reasons.push('Fits your seniority');
        }
        if (userDomains.has('entry') && ['labour', 'helper'].includes(job.category)) {
          score += 5;
          reasons.push('Good for your level');
        }
      }

      // 3. LOCATION PROXIMITY (0-15 points)
      const dist = parseFloat(job.distance.replace(' km', ''));
      if (dist <= 3) {
        score += 15;
        reasons.push('Very close to you');
      } else if (dist <= 5) {
        score += 10;
        reasons.push('Nearby');
      } else if (dist <= 8) {
        score += 5;
      }

      // Address locality match
      if (addrLower.length > 0) {
        const jobLocLower = job.location.toLowerCase();
        const addrParts = addrLower.split(/[,\s]+/).filter(p => p.length > 3);
        addrParts.forEach(part => {
          if (jobLocLower.includes(part)) {
            score += 5;
            if (!reasons.includes('Near your address')) reasons.push('Near your address');
          }
        });
      }

      // 4. JOB TYPE PREFERENCE (0-10 points) — learned from saved/viewed
      const savedCategories = new Set(savedJobs.map(j => (j as any).category).filter(Boolean));
      const savedTypes = new Set(savedJobs.map(j => j.type));

      if (savedCategories.has(job.category)) {
        score += 7;
        reasons.push('Similar to saved jobs');
      }
      if (savedTypes.has(job.type)) {
        score += 3;
      }

      // 5. URGENCY & RECENCY BOOST (0-10 points)
      if (job.urgent) {
        score += 5;
        reasons.push('Hiring urgently');
      }

      const postedVal = job.posted;
      if (postedVal.includes('m ago') || postedVal.includes('1h') || postedVal.includes('2h')) {
        score += 5;
        reasons.push('Just posted');
      } else if (postedVal.includes('h ago')) {
        score += 3;
      }

      // Cap at 100
      const finalScore = Math.min(score, 100);

      return {
        ...job,
        matchScore: finalScore,
        matchReasons: reasons,
      };
    })
    // Sort by score (highest first), then by distance
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      const distA = parseFloat(a.distance.replace(' km', ''));
      const distB = parseFloat(b.distance.replace(' km', ''));
      return distA - distB;
    });
  }, [userCategories, experience, address, savedJobs, recentlyViewedJobs]);

  return { scoredJobs, userCategories };
}
