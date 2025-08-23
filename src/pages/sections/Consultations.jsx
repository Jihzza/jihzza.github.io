import { useRef } from "react";
import SectionCta from "../../components/ui/SectionCta";
import SectionText from "../../components/ui/SectionText";
import BoxesGrid from "../../components/ui/BoxesGrid";
import StepsList from "../../components/ui/StepsList";
import PhoneIcon from "../../assets/icons/Phone Branco.svg"
import Button from "../../components/ui/Button"

import MindsetIcon from '../../assets/icons/Brain Branco.svg';
import SocialMediaIcon from '../../assets/icons/Phone Branco.svg';
import FinanceIcon from '../../assets/icons/MoneyBag Branco.svg';
import MarketingIcon from '../../assets/icons/Target Branco.svg';
import BusinessIcon from '../../assets/icons/Bag Branco.svg';
import RelationshipsIcon from '../../assets/icons/Heart Branco.svg';
import HealthIcon from '../../assets/icons/Fitness Branco.svg';
import OnlyFansIcon from '../../assets/icons/OnlyFans Branco.svg';
import AITechIcon from '../../assets/icons/Robot Branco.svg';
import LifeAdviceIcon from '../../assets/icons/More Branco.svg';
import Face2FaceIcon from '../../assets/icons/Face2Face Preto.svg';
import DurationIcon from '../../assets/icons/Clock Preto.svg';
import RecordingIcon from '../../assets/icons/Microphone Preto.svg';
import FollowUpEmailIcon from '../../assets/icons/Email Preto.svg';
import FollowUpConsultationIcon from '../../assets/icons/FollowUp Preto.svg';

const STEPS = [
  {
    icon: Face2FaceIcon ,
    title: "Face-to-Face Video Call",
    description: "Our consultations take place via video call, allowing us to connect personally. You'll be able to see me throughout the session, creating a more engaging and personal experience.",
  },
  {
    icon: DurationIcon ,
    title: "Minimum 45-Minute Sessions",
    description: "Each consultation lasts a minimum of 45 minutes, ensuring we have adequate time to explore your concerns in depth and develop meaningful insights and action plans.",
  },
  {
    icon: RecordingIcon,
    title: "Session Recordings",
    description: "Join a one-on-one video call to discuss your challenges and opportunities.",
  },
  {
    icon: FollowUpEmailIcon ,
    title: "Follow-up Email",
    description: "After your session, you'll receive a personalized follow-up email summarizing key points and next steps, ensuring you stay on track.",
  },
  {
    icon: FollowUpConsultationIcon ,
    title: "Follow-up Consultation",
    description: "Book a follow-up consultation to review your progress, address new challenges, and receive continued support on your journey.",
  },
];

export default function Consultations() {

  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="w-full max-w-5xl flex flex-col justify-center items-center mx-auto py-4 space-y-4">
      <SectionText title="How I Can Help You">
      Whether you need guidance on mindset, social media growth, finance, marketing, business building, or relationships – I cover it all.
      </SectionText>

      <BoxesGrid
        items={[
          {
            name: "Mindset & Psychology",
            image: MindsetIcon ,
            subtitle:
              "Unlock the power of your mind. Our Mindset & Psychology service provides you with tools and strategies to overcome limiting beliefs, enhance mental resilience, and cultivate a growth mindset. Achieve clarity, focus, and emotional balance to excel in all areas of your life.",
          },
          {
            name: "Social Media Growth",
            image: SocialMediaIcon ,
            subtitle:
              "Amplify your online presence. We'll help you craft a winning social media strategy, create engaging content, and grow your audience effectively. This description is a bit longer to test how the animation handles varying text lengths and ensure smoothness.",
          },
          {
            name: "Finance & Wealth",
            image: FinanceIcon,
            subtitle:
              "Take control of your financial future. Learn sound investment principles, budgeting techniques, and wealth-building strategies tailored to your goals.",
          },
          {
            name: "Marketing & Sales",
            image: MarketingIcon ,
            subtitle:
              "Boost your brand and sales. We offer expert marketing strategies, from digital campaigns to traditional outreach, to help you reach your target audience.",
          },
          {
            name: "Business Building",
            image: BusinessIcon ,
            subtitle:
              "Turn your vision into reality. Get guidance on business planning, operational efficiency, and scaling your venture for sustainable success. Another longer description to check the animation smoothness when content varies significantly. This should push the items below down further, and the animation should remain fluid throughout the entire expansion and contraction process without any jerks or hard breaks, especially near the end of the animation sequence.",
          },
          {
            name: "Relationships",
            image: RelationshipsIcon ,
            subtitle:
              "Foster deeper connections. Improve communication, build stronger bonds, and navigate relationship challenges with expert advice.",
          },
          {
            name: "Health & Fitness",
            image: HealthIcon ,
            subtitle:
              "Achieve your peak physical condition. Personalized fitness plans, nutritional guidance, and motivational support to help you reach your health goals.",
          },
          {
            name: "OnlyFans",
            image: OnlyFansIcon ,
            subtitle:
              "Maximize your OnlyFans success. Strategies for content creation, promotion, and subscriber engagement to boost your earnings.",
          },
          {
            name: "AI & Tech",
            image: AITechIcon ,
            subtitle:
              "Leverage cutting-edge technology. Explore how AI and other tech solutions can optimize your business and personal productivity.",
          },
          {
            name: "Life Advice",
            image: LifeAdviceIcon ,
            subtitle:
              "Have other needs? Let's discuss! We offer a wide range of consulting services and can tailor solutions to your unique challenges. This is a final test case with a medium length description.",
          },
        ]}
      />

      {STEPS.map((step) => (
        <StepsList
          key={step.title}
          icon={step.icon}
          title={step.title}
          description={step.description}
        />
      ))}

      <SectionCta sectionRef={sectionRef}>
        <Button>Book a Consultation - 90€/h</Button>
      </SectionCta>
    </section>
  );
}
