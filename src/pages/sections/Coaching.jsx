// Coaching.jsx
import { useRef, useState } from "react";
import SectionCta from "../../components/ui/SectionCta";
import SectionText from "../../components/ui/SectionText";
import BoxesGrid from "../../components/ui/BoxesGrid";
import StepsList from "../../components/ui/StepsList";
import TierCards from "../../components/coaching/TierCards";
import PhoneIcon from "../../assets/icons/Phone Branco.svg";
import Button from "../../components/ui/Button";

import SocialMediaIcon from '../../assets/icons/Phone Branco.svg';
import BusinessIcon from '../../assets/icons/Business Branco.svg';
import OnlyFansIcon from '../../assets/icons/OnlyFans Branco.svg';
import DatingIcon from '../../assets/icons/Dating Branco.svg';
import HabitsIcon from '../../assets/icons/Habits Branco.svg';
import StocksIcon from '../../assets/icons/Stocks Branco.svg';
import PersonalTrainerIcon from '../../assets/icons/PersonalTrainer Branco.svg';
import StockResearcherIcon from '../../assets/icons/MoneyBag Branco.svg';

import AnytimeCommsIcon from '../../assets/icons/AnytimeComms Preto.svg';
import ResponseIcon from '../../assets/icons/Response Preto.svg';
import ClassesIcon from '../../assets/icons/Classes Preto.svg';

const STEPS = [
  { icon: AnytimeCommsIcon, title: "Anytime Communication", description: "Text or send audio messages anytime with questions, updates, or challenges. Get support when you need it most without waiting for scheduled appointments." },
  { icon: ResponseIcon, title: "Flexible Response Formats", description: "Receive guidance through text, audio, or video responses based on your preference and the complexity of the topic. Visual demonstrations when needed, quick text answers when appropriate." },
  { icon: ClassesIcon, title: "Personalized Classes", description: "Receive custom-tailored training sessions designed specifically for your skill level, learning style, and goals. Each class builds on your progress for maximum growth and development." },
];

// Define your pricing tiers here
const TIERS = [
  { id: "single", price: 40, planName: "Basic", planDesc: "Answers to all questions weekly" },
  { id: "pack5", price: 90, planName: "Standard", planDesc: "Answers to all questions in 48h" },
  { id: "pack20", price: 230, planName: "Premium", planDesc: "Answer to all questions ASAP" },
];

export default function Consultations({ onBookCoaching }) {
  const sectionRef = useRef(null);
  const [selectedPlanId, setSelectedPlanId] = useState(TIERS[0].id);
  // derive selected tier + dynamic button label
  const selectedTier = TIERS.find(t => t.id === selectedPlanId);
  const buttonText = selectedTier
    ? `Get My Number - ${selectedTier.price}€/m`
    : 'Get My Number';

  return (
    <section ref={sectionRef} className="w-full max-w-5xl flex flex-col justify-center items-center mx-auto py-4 space-y-4 md:px-6">
      <SectionText title="Direct Coaching">
        Personalized coaching to help you excel in specific areas of your life. Get direct access to expert guidance tailored to your unique situation and goals.
      </SectionText>

      <BoxesGrid items={[
        { name: "Learn How to Invest", image: StocksIcon, subtitle: "Master the markets with confidence. We break down core investment principles, asset allocation, and risk-management tactics so you can build a diversified portfolio that matches your goals and risk appetite." },
        { name: "Personal Trainer", image: PersonalTrainerIcon, subtitle: "Get a tailor-made fitness roadmap. From periodised workout plans to nutrition tweaks and habit tracking, you'll receive step-by-step guidance to hit strength, endurance, and aesthetic targets—safely and sustainably." },
        { name: "Dating Coach", image: DatingIcon, subtitle: "Upgrade your dating life. Hone social-skill fundamentals, craft a magnetic online profile, and learn real-world approach frameworks that boost confidence and attract high-quality partners." },
        { name: "OnlyFans Coaching", image: OnlyFansIcon, subtitle: "Turn OnlyFans into a thriving business. We cover niche positioning, content calendars, pricing psychology, fan-funnel design, and cross-platform promotion to scale subscribers and monthly earnings." },
        { name: "Business Advisor", image: BusinessIcon, subtitle: "Accelerate your venture's growth. From lean business-plan audits to marketing funnels, ops systems, and KPI dashboards, you'll get actionable strategies to increase revenue and profitability." },
        { name: "Habits & Personal Growth", image: HabitsIcon, subtitle: "Design habits that stick. Implement science-backed routines for productivity, health, and mindset, while removing self-sabotaging behaviours through accountability loops and progress reviews." },
        { name: "Social Media Manager", image: SocialMediaIcon, subtitle: "Grow an engaged audience. Receive content-pillar mapping, algorithm-proof posting schedules, analytic deep-dives, and monetisation tactics to turn followers into loyal customers." },
        { name: "Stock Researcher", image: StockResearcherIcon, subtitle: "Make data-driven trades. Learn fundamental and technical research workflows, valuation models, and watch-list curation so you can spot high-conviction stock opportunities before the crowd." },
      ]} />

      {STEPS.map((step) => (
        <StepsList key={step.title} icon={step.icon} title={step.title} description={step.description} />
      ))}

      {/* ✅ Wire up tiers + selection */}
      <TierCards tiers={TIERS} selectedPlanId={selectedPlanId} onTierSelect={setSelectedPlanId} />

      <SectionCta sectionRef={sectionRef}>
        <Button onClick={() => onBookCoaching?.(selectedPlanId)}>
          {buttonText}
        </Button>
      </SectionCta>
    </section>
  );
}