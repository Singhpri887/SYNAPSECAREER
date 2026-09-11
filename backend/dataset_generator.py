"""
Synthetic Dataset Generator for AI-Powered Job Optimization & Recruitment
Generates realistic student profiles, skill distributions, and labeled career suitability scores.
"""

import os
import json
import random
import numpy as np

SKILL_KEYS = [
    "python", "pytorch", "sql", "data_analysis", "math_stats",
    "deep_learning", "nlp_llm", "javascript", "react", "api_design",
    "docker_k8s", "cloud_infra", "distributed_sys", "problem_solving",
    "system_design", "ui_ux", "product_strategy", "cybersecurity",
    "git_collaboration", "communication"
]

JOB_ARCHETYPES = [
    {
        "id": "data_scientist",
        "title": "AI Data Scientist",
        "category": "AI & Data",
        "weights": {
            "python": 1.3, "math_stats": 1.4, "data_analysis": 1.2,
            "pytorch": 1.0, "sql": 0.9, "communication": 0.8
        },
        "target_skills": {
            "python": 85, "math_stats": 80, "data_analysis": 85,
            "pytorch": 70, "sql": 75, "communication": 70
        }
    },
    {
        "id": "ml_engineer",
        "title": "Machine Learning Infrastructure Engineer",
        "category": "AI & Engineering",
        "weights": {
            "python": 1.2, "pytorch": 1.4, "deep_learning": 1.3,
            "distributed_sys": 1.1, "docker_k8s": 1.0, "problem_solving": 1.0
        },
        "target_skills": {
            "python": 90, "pytorch": 88, "deep_learning": 85,
            "distributed_sys": 75, "docker_k8s": 75, "problem_solving": 85
        }
    },
    {
        "id": "genai_architect",
        "title": "Generative AI Solutions Architect",
        "category": "AI & Engineering",
        "weights": {
            "nlp_llm": 1.5, "python": 1.1, "system_design": 1.2,
            "api_design": 1.0, "cloud_infra": 1.0, "problem_solving": 0.9
        },
        "target_skills": {
            "nlp_llm": 90, "python": 85, "system_design": 80,
            "api_design": 80, "cloud_infra": 75, "problem_solving": 80
        }
    },
    {
        "id": "fullstack_engineer",
        "title": "Full-Stack Systems Engineer",
        "category": "Software Systems",
        "weights": {
            "javascript": 1.4, "react": 1.3, "api_design": 1.2,
            "sql": 1.0, "git_collaboration": 0.9, "problem_solving": 0.8
        },
        "target_skills": {
            "javascript": 90, "react": 85, "api_design": 80,
            "sql": 75, "git_collaboration": 80, "problem_solving": 75
        }
    },
    {
        "id": "cloud_devops",
        "title": "Cloud Platform & MLOps Architect",
        "category": "Cloud & Infrastructure",
        "weights": {
            "docker_k8s": 1.4, "cloud_infra": 1.4, "system_design": 1.1,
            "cybersecurity": 1.0, "python": 0.8, "git_collaboration": 0.9
        },
        "target_skills": {
            "docker_k8s": 90, "cloud_infra": 90, "system_design": 80,
            "cybersecurity": 75, "python": 70, "git_collaboration": 85
        }
    },
    {
        "id": "ai_product_manager",
        "title": "Technical AI Product Manager",
        "category": "Product & Strategy",
        "weights": {
            "product_strategy": 1.5, "ui_ux": 1.2, "communication": 1.3,
            "data_analysis": 1.0, "problem_solving": 0.9, "python": 0.6
        },
        "target_skills": {
            "product_strategy": 90, "ui_ux": 80, "communication": 90,
            "data_analysis": 75, "problem_solving": 80, "python": 60
        }
    }
]

STUDENT_FIRST_NAMES = ["Maya", "Leo", "Priya", "Alex", "Jordan", "Kai", "Elena", "Marcus", "Aria", "Devon"]
STUDENT_LAST_NAMES = ["Chen", "Rodriguez", "Sharma", "Vance", "Zhang", "Patel", "Kim", "Taylor", "Brooks", "Davis"]

def generate_candidate_skills(focus_archetype_idx):
    """Generates a realistic student skill vector oriented loosely around an interest."""
    target_job = JOB_ARCHETYPES[focus_archetype_idx]
    skills = {}
    
    for key in SKILL_KEYS:
        # Base skill randomly distributed 20-60
        base_val = np.random.normal(loc=40, scale=15)
        # If it's a key skill for their interest, boost it 60-95
        if key in target_job["target_skills"]:
            target_val = target_job["target_skills"][key]
            val = np.random.normal(loc=target_val - 10, scale=10)
        else:
            val = base_val
        
        skills[key] = int(np.clip(val, 5, 99))
        
    return skills

def calculate_suitability(skills, job):
    """Calculates weighted ground-truth suitability percentage between student skills and a job."""
    weighted_sum = 0.0
    total_weight = 0.0
    
    for skill_id, weight in job["weights"].items():
        req_val = job["target_skills"].get(skill_id, 70)
        actual_val = skills.get(skill_id, 0)
        ratio = min(1.25, actual_val / req_val)
        weighted_sum += (ratio * 100.0) * weight
        total_weight += weight
        
    raw_score = weighted_sum / total_weight if total_weight > 0 else 50.0
    # Add slight non-linear synergy bonus
    synergy = min(10.0, sum(skills.get(k, 0) for k in job["target_skills"].keys()) / 150.0)
    score = np.clip(raw_score + synergy - 5, 10.0, 99.0)
    return round(float(score), 2)

def generate_dataset(num_samples=1200):
    """Generates student candidate records with optimal job classification and suitability scores."""
    np.random.seed(42)
    random.seed(42)
    
    dataset = []
    
    for i in range(num_samples):
        # Choose a primary interest archetype for this student
        interest_idx = np.random.randint(0, len(JOB_ARCHETYPES))
        skills = generate_candidate_skills(interest_idx)
        
        # Calculate suitability across all jobs
        suitabilities = [calculate_suitability(skills, job) for job in JOB_ARCHETYPES]
        best_job_idx = int(np.argmax(suitabilities))
        
        first_name = random.choice(STUDENT_FIRST_NAMES)
        last_name = random.choice(STUDENT_LAST_NAMES)
        
        record = {
            "id": f"std_{i+1:04d}",
            "name": f"{first_name} {last_name}",
            "skills": skills,
            "suitabilities": suitabilities,
            "best_job_id": JOB_ARCHETYPES[best_job_idx]["id"],
            "best_job_title": JOB_ARCHETYPES[best_job_idx]["title"],
            "best_job_idx": best_job_idx,
            "top_score": suitabilities[best_job_idx]
        }
        dataset.append(record)
        
    return dataset

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    print("Generating synthetic student & recruitment dataset (1,200 profiles)...")
    data = generate_dataset(1200)
    
    output_path = os.path.join(data_dir, "student_dataset.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"Dataset successfully created: {output_path}")
    print(f"Sample record:\nName: {data[0]['name']}")
    print(f"Best Match: {data[0]['best_job_title']} ({data[0]['top_score']}%)")
