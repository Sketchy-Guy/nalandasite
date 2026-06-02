import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import VideoHighlights from "@/components/video-highlights";
import NoticeBoard from "@/components/notice-board";
import CampusStats from "@/components/campus-stats";
import NewsHighlights from "@/components/news-highlights";
import ToppersBoard from "@/components/toppers-board";
import CreativePanel from "@/components/creative-panel";
import MagazinesNewsletters from "@/components/magazines-newsletters";
import ClubsActivities from "@/components/clubs-activities";
import Footer from "@/components/footer";
import AdmissionEnquiryPopup from "@/components/admission-enquiry-popup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <VideoHighlights />
        <CampusStats />
        <NoticeBoard />
        <NewsHighlights />
        <MagazinesNewsletters />
        <ToppersBoard />
        <CreativePanel />
        <ClubsActivities />
      </main>
      <Footer />
      <AdmissionEnquiryPopup />
    </div>
  );
};

export default Index;
