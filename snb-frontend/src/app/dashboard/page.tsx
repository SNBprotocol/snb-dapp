import Hero from "@/components/home/Hero";
import TokenInfo from "@/components/home/TokenInfo";
import Tokenomics from "@/components/home/Tokenomics";
import HowItWorks from "@/components/home/HowItWorks";
import GetStarted from "@/components/home/GetStarted";
import Security from "@/components/home/Security";
import TrustStrip from "@/components/home/TrustStrip";
import SNBFooter from "@/components/home/SNBFooter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TokenInfo />
      <Tokenomics />
      <HowItWorks />
      <GetStarted />
      <Security />
      <TrustStrip />
      <SNBFooter />
    </>
  );
}
