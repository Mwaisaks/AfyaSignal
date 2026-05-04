# AfyaSignal — Devpost Submission

## Inspiration

I grew up in Voi, Taita Taveta — a place where malaria is not just a statistic, it's part of everyday life. It wasn't unusual to hear about a child falling sick overnight, or a neighbor rushing to the hospital because of a sudden fever that got worse too quickly.

In many of these cases, the problem wasn't the absence of treatment — it was **time**.

Symptoms would start small: a fever, fatigue, a cough. But without early guidance or quick intervention, those symptoms could escalate into severe malaria or pneumonia. By the time families sought help, it was sometimes too late.

At the same time, Community Health Volunteers (CHVs), who are often the first point of contact in these communities, do incredible work — but they lack simple tools to quickly assess risk, standardize reporting, and escalate urgent cases.

This project was inspired by a simple question:

**What if we could help communities act earlier, before a condition becomes critical?**

---

## What It Does

AfyaSignal is an AI-assisted triage and early warning system designed to support Community Health Volunteers.

It allows CHVs to:
- Record symptoms quickly using a guided, mobile-friendly interface
- Receive a risk classification (Low, Moderate, or Critical)
- Get clear recommendations on whether to monitor or refer immediately
- Flag urgent cases in real-time for health facilities

The AI explanation layer is powered by Google Gemini, which translates the rule-based triage result into plain-language guidance the CHV can act on immediately.

On the backend, the system aggregates data to:
- Identify clusters of symptoms across locations
- Highlight potential outbreak patterns
- Provide NGOs and health officials with actionable insights

AfyaSignal does not replace diagnosis — it **supports faster decision-making and earlier intervention**.

---

## How I Built It

AfyaSignal is a full-stack application built with the following stack:

- **Frontend:** ReactJS with Tailwind CSS — a simple, mobile-friendly interface optimized for CHVs in the field
- **Backend:** Spring Boot for handling APIs, business logic, and data processing
- **Database:** H2 for the demo prototype; PostgreSQL for production deployment
- **AI Layer:** Google Gemini API for generating plain-language explanations of triage results, built on top of a rule-based engine inspired by WHO IMCI (Integrated Management of Childhood Illness) guidelines

The system is designed with scalability in mind, making it adaptable for different regions and NGO deployments.

---

## Challenges I Ran Into

One of the biggest challenges was **balancing innovation with responsibility**.

It's easy to say "AI can diagnose diseases," but in reality, that approach is unsafe and unrealistic — especially in low-resource settings. I had to rethink the role of AI entirely, shifting from diagnosis to **decision support and risk guidance**.

Another challenge was **scope control**. The problem space is enormous — from diagnostics to malnutrition detection to outbreak prediction. I had to deliberately narrow the focus to a core, impactful use case: **early triage and referral support**.

On the technical side, integrating a Gemini-powered explanation layer that felt natural and non-alarming for a community health context required careful prompt engineering — the language had to be clear, calm, and actionable rather than clinical.

I also had to think carefully about usability. CHVs may work in areas with limited connectivity and varying levels of digital literacy, so simplicity and clarity were critical in every design decision.

---

## What I Learned

This project taught me that impactful solutions are not always the most complex — they are the most **relevant and usable**.

I learned how to:
- Translate real-world health challenges into practical system design
- Build AI systems that assist rather than overpromise
- Design with constraints in mind — low bandwidth, offline scenarios, simplicity
- Focus on scalability and real-world adoption, not just technical novelty

Most importantly, I learned that in healthcare:

> **Acting early can be the difference between recovery and loss.**

---

## What's Next for AfyaSignal

I envision AfyaSignal evolving into a platform that can be deployed by NGOs and health programs across multiple regions.

Future improvements include:
- **Offline-first capabilities** for rural environments with limited connectivity
- **SMS/USSD integration** for wider accessibility beyond smartphone users
- **Integration with national health systems** for seamless data sharing
- **More advanced outbreak prediction models** using historical case data

