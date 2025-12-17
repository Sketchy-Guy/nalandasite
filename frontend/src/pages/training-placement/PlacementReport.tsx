import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import AnimatedCounter from "@/components/charts/AnimatedCounter";
import AnimatedBarChart from "@/components/charts/AnimatedBarChart";
import AnimatedLineChart from "@/components/charts/AnimatedLineChart";
import AnimatedDonutChart from "@/components/charts/AnimatedDonutChart";
import {
    TrendingUp,
    Users,
    Building2,
    Award,
    Briefcase,
    GraduationCap,
    Target,
    Rocket
} from "lucide-react";

export default function PlacementReport() {
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const aboutRef = useRef(null);
    const recruitersRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
    const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
    const isRecruitersInView = useInView(recruitersRef, { once: true, margin: "-100px" });

    const quickStats = [
        { icon: Users, label: 'Students Placed', value: '1,713+', color: 'text-blue-500' },
        { icon: Building2, label: 'Recruiting Companies', value: '77+', color: 'text-green-500' },
        { icon: TrendingUp, label: 'Total Offers', value: '2,137+', color: 'text-purple-500' },
        { icon: Award, label: 'Avg Offers/Student', value: '1.25', color: 'text-orange-500' },
    ];

    // Placement Stats Data
    const salaryData = [
        { label: '2020-21', value: 42 },
        { label: '2021-22', value: 45 },
        { label: '2022-23', value: 48 },
        { label: '2023-24', value: 51 },
        { label: '2024-25', value: 54 },
    ];

    const sectorData = [
        { label: 'Software/IT', value: 45, color: 'hsl(var(--chart-1))' },
        { label: 'Finance', value: 20, color: 'hsl(var(--chart-2))' },
        { label: 'Core', value: 15, color: 'hsl(var(--chart-3))' },
        { label: 'Consulting', value: 12, color: 'hsl(var(--chart-4))' },
        { label: 'Others', value: 8, color: 'hsl(var(--chart-5))' },
    ];

    const branchData = [
        { label: 'CSE', value: 98, color: 'hsl(var(--chart-1))' },
        { label: 'EE', value: 94, color: 'hsl(var(--chart-2))' },
        { label: 'ME', value: 88, color: 'hsl(var(--chart-3))' },
        { label: 'CE', value: 85, color: 'hsl(var(--chart-4))' },
        { label: 'DS', value: 96, color: 'hsl(var(--chart-5))' },
    ];

    const packageBreakdown = [
        { label: '> 40 LPA', value: 15, color: 'hsl(var(--chart-1))' },
        { label: '20-40 LPA', value: 35, color: 'hsl(var(--chart-2))' },
        { label: '10-20 LPA', value: 30, color: 'hsl(var(--chart-3))' },
        { label: '< 10 LPA', value: 20, color: 'hsl(var(--chart-4))' },
    ];

    const recruiters = [
        { name: 'TCS', category: 'IT Services', domain: 'tcs.com' },
        { name: 'Infosys', category: 'IT Services', domain: 'infosys.com' },
        { name: 'Wipro', category: 'IT Services', domain: 'wipro.com' },
        { name: 'Capgemini', category: 'Consulting', domain: 'capgemini.com' },
        { name: 'HCL', category: 'IT Services', domain: 'hcltech.com' },
        { name: 'Deloitte', category: 'Consulting', domain: 'deloitte.com' },
        { name: 'BP', category: 'Energy', domain: 'bp.com' },
        { name: 'IBM', category: 'Tech', domain: 'ibm.com' },
        { name: 'Chetu', category: 'Software', domain: 'chetu.com' },
        { name: 'Tata', category: '', domain: 'tata.com' },
        { name: 'Axiom Consulting', category: 'Consulting', domain: 'axiomconsulting.in' },
        { name: 'NILE', category: 'Engineering', domain: 'niletechnologies.com' },
        { name: 'JSW', category: 'Steel', domain: 'jsw.in' },
        { name: 'AIS', category: 'Glass', domain: 'aisglass.com' },
        { name: 'Yokohama', category: 'Automotive', domain: 'yokohama.com' },
        { name: 'NIFCO', category: 'Tech', domain: 'www.nifco.com' },
        { name: 'JK Lakshmi', category: 'Cement', domain: 'jklakshmicement.com' },
        { name: 'ACME', category: '', domain: 'www.acme.in' },
        { name: 'Hexaware', category: 'IT Services', domain: 'hexaware.com' },
        { name: 'APL Apollo', category: 'Steel', domain: 'aplapollo.com' },
        { name: 'Everest', category: 'Industries', domain: 'everestind.com' },
        { name: 'IndiGo', category: 'Aviation', domain: 'goindigo.in' },
        { name: 'Thermax', category: 'Engineering', domain: 'thermaxglobal.com' },
        // { name: 'ACME', category: 'Solar', domain: 'acme.in' },
        { name: 'Cozentus', category: 'Tech', domain: 'cozentus.com' },
        { name: 'Argusoft', category: 'Software', domain: 'www.argusoft.com' },
        // { name: 'Tata Business', category: 'Consulting', domain: 'tatabusiness.com' },
        { name: 'Kreativan', category: 'Tech', domain: 'kreativantech.com' },
        { name: 'Genpact', category: 'BPO', domain: 'genpact.com' },
        { name: 'P&R Group', category: 'Consulting', domain: 'pnrgroup.in' },
        // { name: 'Ecospace', category: 'Infrastructure', domain: 'ecospaceinfra.com' },
    ];

    // Logo API configuration
    const LOGO_API_KEY = import.meta.env.VITE_LOGO_API_KEY || 'pk_N8Z66jEbRjO5UG6JOgb71g';

    const features = [
        {
            icon: "🏛️",
            title: "Modern Campus",
            description: "State-of-the-art facilities in the vibrant city of Bhubaneswar."
        },
        {
            icon: "🔬",
            title: "Research Excellence",
            description: "Cutting-edge research facilities with collaborations with global institutions."
        },
        {
            icon: "💡",
            title: "Innovation Hub",
            description: "Catalyst - Nalanda Bhubaneswar's Technology Business Incubator fostering entrepreneurship."
        },
        {
            icon: "🎓",
            title: "World-Class Faculty",
            description: "Distinguished faculty from premier institutions worldwide."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero Section */}
                <section
                    ref={heroRef}
                    className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
                >
                    {/* Animated background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

                        {/* Floating orbs */}
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                                filter: 'blur(60px)'
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
                                filter: 'blur(60px)'
                            }}
                            animate={{
                                scale: [1, 1.3, 1],
                                x: [0, -40, 0],
                                y: [0, 40, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Grid pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `
                  linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
                `,
                                backgroundSize: '60px 60px'
                            }}
                        />
                    </div>

                    <div className="container relative z-10 px-4 py-20">
                        <motion.div
                            className="text-center max-w-5xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Placement Season 2025-26
                                </span>
                            </motion.div>

                            {/* Main heading */}
                            <motion.h1
                                className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="text-foreground">Nalanda Institute of Technology</span>
                                <br />
                                <span className="gradient-text">Placement Report</span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4 }}
                            >
                                Shaping Future Innovators of a Dynamic World
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-wrap items-center justify-center gap-4 mb-16"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.5 }}
                            >
                                <a
                                    href="#placements"
                                    className="px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm md:text-base"
                                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)' }}
                                >
                                    View Placements
                                </a>
                                <a
                                    href="#contact"
                                    className="px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold glass-card text-foreground hover:bg-secondary/50 transition-all duration-300 text-sm md:text-base border border-border"
                                >
                                    Contact Us
                                </a>
                            </motion.div>

                            {/* Quick Stats Grid */}
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.6 }}
                            >
                                {quickStats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 glow-primary"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} mb-2 mx-auto`} />
                                        <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-muted-foreground font-medium">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
                            initial={{ opacity: 0 }}
                            animate={isHeroInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1 }}
                        >
                            <motion.div
                                className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Placement Statistics Section */}
                <section ref={statsRef} id="placements" className="py-16 md:py-24 bg-card/50 relative">
                    {/* Section background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--chart-2) / 0.3) 0%, transparent 60%)'
                            }}
                        />
                    </div>

                    <div className="container px-4 relative z-10">
                        {/* Header */}
                        <motion.div
                            className="text-center max-w-3xl mx-auto mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                                Placement Statistics
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                                Empowering Careers with
                                <span className="gradient-text block">Outstanding Placements</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Our students are sought after by leading global companies,
                                achieving remarkable placement outcomes year after year.
                            </p>
                        </motion.div>

                        {/* Quick stats */}
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {[
                                { label: 'Highest CTC', value: 54, suffix: ' LPA', prefix: '₹' },
                                { label: 'Average CTC', value: 18.5, suffix: ' LPA', prefix: '₹', decimals: 1 },
                                { label: 'Median CTC', value: 15, suffix: ' LPA', prefix: '₹' },
                                { label: 'Total Offers', value: 350, suffix: '+' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="glass-card rounded-2xl p-6 text-center"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                                        <AnimatedCounter
                                            end={stat.value}
                                            suffix={stat.suffix}
                                            prefix={stat.prefix}
                                            decimals={stat.decimals || 0}
                                        />
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Charts Grid - Masonry Layout */}
                        <div className="columns-1 lg:columns-2 gap-8 space-y-8 lg:space-y-0">
                            {/* Highest Package Trend */}
                            <motion.div
                                className="glass-card rounded-2xl p-6 flex flex-col break-inside-avoid mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h3 className="text-xl font-semibold mb-2">Highest Package Trend</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Year-over-year growth in top packages (in LPA)
                                </p>
                                <div className="flex-shrink-0">
                                    <AnimatedLineChart data={salaryData} height={120} />
                                </div>
                            </motion.div>

                            {/* Sector-wise Distribution */}
                            <motion.div
                                className="glass-card rounded-2xl p-6 flex flex-col break-inside-avoid mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <h3 className="text-xl font-semibold mb-2">Sector-wise Distribution</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Placement distribution across industries
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0">
                                    <AnimatedDonutChart
                                        data={sectorData}
                                        size={160}
                                        centerValue="100%"
                                        centerLabel="Placed"
                                    />
                                    <div className="flex-1 space-y-2">
                                        {sectorData.map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                className="flex items-center gap-3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={isStatsInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="flex-1 text-sm">{item.label}</span>
                                                <span className="text-sm font-semibold">{item.value}%</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Package Distribution */}
                            <motion.div
                                className="glass-card rounded-2xl p-6 flex flex-col break-inside-avoid mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <h3 className="text-xl font-semibold mb-2">Package Distribution</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Breakdown of offers by package range
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0">
                                    <AnimatedDonutChart
                                        data={packageBreakdown}
                                        size={160}
                                        centerValue="350+"
                                        centerLabel="Offers"
                                    />
                                    <div className="flex-1 space-y-2">
                                        {packageBreakdown.map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                className="flex items-center gap-3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={isStatsInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="flex-1 text-sm">{item.label}</span>
                                                <span className="text-sm font-semibold">{item.value}%</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Branch-wise Placement */}
                            <motion.div
                                className="glass-card rounded-2xl p-6 flex flex-col break-inside-avoid mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <h3 className="text-xl font-semibold mb-2">Branch-wise Placement %</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Placement rates across different branches
                                </p>
                                <div className="flex-shrink-0">
                                    <AnimatedBarChart data={branchData} height={140} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section ref={aboutRef} className="py-16 md:py-24 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-50">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(ellipse at top right, hsl(var(--primary) / 0.1) 0%, transparent 60%)'
                            }}
                        />
                    </div>

                    <div className="container px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left content */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                                    About Nalanda Bhubaneswar
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                                    Where Innovation Meets
                                    <span className="gradient-text block">Excellence</span>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                    Nalanda Bhubaneswar is committed to providing world-class education
                                    and conducting cutting-edge research. Located in the vibrant city of Bhubaneswar,
                                    we offer a unique learning environment that combines academic excellence
                                    with modern infrastructure.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <div className="glass-card rounded-xl px-6 py-4">
                                        <div className="text-2xl font-bold text-primary">15+</div>
                                        <div className="text-sm text-muted-foreground">Academic Programs</div>
                                    </div>
                                    <div className="glass-card rounded-xl px-6 py-4">
                                        <div className="text-2xl font-bold text-primary">200+</div>
                                        <div className="text-sm text-muted-foreground">Faculty Members</div>
                                    </div>
                                    <div className="glass-card rounded-xl px-6 py-4">
                                        <div className="text-2xl font-bold text-primary">3000+</div>
                                        <div className="text-sm text-muted-foreground">Students</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right - Feature cards */}
                            <motion.div
                                className="grid sm:grid-cols-2 gap-4"
                                initial={{ opacity: 0, x: 50 }}
                                animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        className="glass-card rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <div className="text-4xl mb-4">{feature.icon}</div>
                                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Recruiters Section */}
                <section ref={recruitersRef} id="recruiters" className="py-16 md:py-24 bg-card/50 relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0">
                        <motion.div
                            className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full opacity-10"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 60%)'
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.15, 0.1],
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                    </div>

                    <div className="container px-4 relative z-10">
                        {/* Header */}
                        <motion.div
                            className="text-center max-w-3xl mx-auto mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isRecruitersInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                                Our Recruiters
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                                Trusted by
                                <span className="gradient-text block">Global Leaders</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                We partner with 150+ leading companies across industries who
                                recognize the caliber of our graduates.
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-8 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isRecruitersInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                        >
                            {[
                                { value: '150+', label: 'Recruiting Companies' },
                                { value: '50+', label: 'Fortune 500 Companies' },
                                { value: '30+', label: 'New Recruiters This Year' },
                            ].map((stat, index) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Recruiter logos grid */}
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                            initial={{ opacity: 0 }}
                            animate={isRecruitersInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.3 }}
                        >
                            {recruiters.map((recruiter, index) => (
                                <motion.div
                                    key={recruiter.name}
                                    className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-300 group"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={isRecruitersInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.1 + index * 0.03 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    {/* Company Logo */}
                                    <div className="w-16 h-16 mb-3 flex items-center justify-center relative">
                                        <img
                                            src={`https://img.logo.dev/${recruiter.domain}?token=${LOGO_API_KEY}&retina=true`}
                                            alt={`${recruiter.name} logo`}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                // Log error for debugging
                                                console.log(`Failed to load logo for ${recruiter.name} (${recruiter.domain})`);
                                                // Fallback to text if logo fails to load
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.style.display = 'none';
                                                const fallback = target.nextElementSibling as HTMLElement;
                                                if (fallback) {
                                                    fallback.style.display = 'flex';
                                                }
                                            }}
                                            onLoad={() => {
                                                console.log(`Successfully loaded logo for ${recruiter.name}`);
                                            }}
                                        />
                                        {/* Fallback text */}
                                        <div
                                            className="w-16 h-16 rounded-lg bg-primary/10 items-center justify-center absolute inset-0"
                                            style={{ display: 'none' }}
                                        >
                                            <span className="text-primary font-bold text-lg">
                                                {recruiter.name.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Company Name */}
                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {recruiter.name}
                                    </div>

                                    {/* Category */}
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {recruiter.category}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Demographics Section */}
                <section id="demographics" className="py-16 md:py-24 relative">
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-20"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, transparent 60%)'
                            }}
                        />
                    </div>

                    <div className="container px-4 relative z-10">
                        {/* Header */}
                        <motion.div
                            className="text-center max-w-3xl mx-auto mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                                Student Demographics
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                                A Diverse & Talented
                                <span className="gradient-text block">Student Community</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Our vibrant student body represents diverse backgrounds,
                                skills, and aspirations united by a passion for excellence.
                            </p>
                        </motion.div>

                        {/* Stats cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {[
                                { value: '965+', label: 'Total Graduating Students', icon: '🎓' },
                                { value: '28%', label: 'Female Students', icon: '👩‍💻' },
                                { value: '25+', label: 'States Represented', icon: '🗺️' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="glass-card rounded-2xl p-6 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="text-4xl mb-3">{stat.icon}</div>
                                    <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Gender Distribution */}
                            <motion.div
                                className="glass-card rounded-2xl p-6 md:p-8"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h3 className="text-xl font-semibold mb-2">Gender Distribution</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Promoting diversity in tech education
                                </p>
                                <div className="flex flex-col items-center gap-6">
                                    <AnimatedDonutChart
                                        data={[
                                            { label: 'Male', value: 72, color: 'hsl(var(--chart-2))' },
                                            { label: 'Female', value: 28, color: 'hsl(var(--chart-3))' },
                                        ]}
                                        size={160}
                                        strokeWidth={20}
                                        centerValue="965"
                                        centerLabel="Students"
                                    />
                                    <div className="flex gap-6">
                                        {[
                                            { label: 'Male', value: 72, color: 'hsl(var(--chart-2))' },
                                            { label: 'Female', value: 28, color: 'hsl(var(--chart-3))' },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm">{item.label}</span>
                                                <span className="text-sm font-semibold">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Program-wise Distribution */}
                            <motion.div
                                className="glass-card rounded-2xl p-6 md:p-8 lg:col-span-2"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <h3 className="text-xl font-semibold mb-2">Program-wise Distribution</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Student strength across academic programs
                                </p>
                                <AnimatedBarChart data={[
                                    { label: 'B.Tech', value: 520, color: 'hsl(var(--chart-1))' },
                                    { label: 'M.Tech', value: 180, color: 'hsl(var(--chart-2))' },
                                    { label: 'M.S.', value: 85, color: 'hsl(var(--chart-3))' },
                                    { label: 'Ph.D.', value: 120, color: 'hsl(var(--chart-4))' },
                                    { label: 'MBA', value: 60, color: 'hsl(var(--chart-5))' },
                                ]} height={220} />
                            </motion.div>
                        </div>

                        {/* Branch strength */}
                        <motion.div
                            className="glass-card rounded-2xl p-6 md:p-8 mt-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <h3 className="text-xl font-semibold mb-2">B.Tech Branch-wise Strength</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Number of students in each B.Tech discipline
                            </p>
                            <AnimatedBarChart data={[
                                { label: 'CSE', value: 180, color: 'hsl(var(--chart-1))' },
                                { label: 'EE', value: 150, color: 'hsl(var(--chart-2))' },
                                { label: 'ME', value: 130, color: 'hsl(var(--chart-3))' },
                                { label: 'CE', value: 100, color: 'hsl(var(--chart-4))' },
                                { label: 'DS', value: 80, color: 'hsl(var(--chart-5))' },
                            ]} height={200} />
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16 md:py-24 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute inset-0">
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30"
                            style={{
                                background: 'radial-gradient(ellipse at bottom, hsl(var(--primary) / 0.2) 0%, transparent 70%)'
                            }}
                        />
                    </div>

                    <div className="container px-4 relative z-10">
                        {/* Header */}
                        <motion.div
                            className="text-center max-w-3xl mx-auto mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                                Get In Touch
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                                Partner With Us for
                                <span className="gradient-text block">Your Hiring Needs</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Connect with our placement cell to explore recruiting opportunities
                                and access exceptional talent from Nalanda Bhubaneswar.
                            </p>
                        </motion.div>

                        {/* Contact cards */}
                        <motion.div
                            className="grid md:grid-cols-3 gap-6 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.2 }}
                        >
                            {[
                                {
                                    role: 'Faculty Advisor',
                                    name: 'Prof. Varun Dutt',
                                    email: 'placement.advisor@nalandabhubaneswar.ac.in',
                                    phone: '+91-1905-267XXX'
                                },
                                {
                                    role: 'Placement Cell Coordinator',
                                    name: 'Placement Office',
                                    email: 'placements@nalandabhubaneswar.ac.in',
                                    phone: '+91-1905-267XXX'
                                },
                                {
                                    role: 'Student Placement Head',
                                    name: 'Student Representatives',
                                    email: 'spc@students.nalandabhubaneswar.ac.in',
                                    phone: '+91-XXXXX-XXXXX'
                                }
                            ].map((contact, index) => (
                                <motion.div
                                    key={contact.role}
                                    className="glass-card rounded-2xl p-6 text-center hover:border-primary/50 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl gradient-primary">
                                        👤
                                    </div>
                                    <div className="text-sm text-primary font-medium mb-1">{contact.role}</div>
                                    <div className="text-lg font-semibold mb-3">{contact.name}</div>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div>📧 {contact.email}</div>
                                        <div>📞 {contact.phone}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Address and social */}
                        <motion.div
                            className="glass-card rounded-2xl p-8 md:p-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Address */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Campus Address</h3>
                                    <div className="text-muted-foreground leading-relaxed mb-6">
                                        <p className="font-medium text-foreground">Nalanda Bhubaneswar</p>
                                        <p>Bhubaneswar Campus</p>
                                        <p>Bhubaneswar</p>
                                        <p>Odisha</p>
                                        <p>India</p>
                                    </div>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                    >
                                        📍 View on Google Maps
                                    </a>
                                </div>

                                {/* Quick links & social */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Follow us on social media to stay updated with the latest
                                        placement news, events, and opportunities.
                                    </p>
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {[
                                            { name: 'LinkedIn', url: '#', icon: '🔗' },
                                            { name: 'Twitter', url: '#', icon: '🐦' },
                                            { name: 'Instagram', url: '#', icon: '📸' },
                                            { name: 'Facebook', url: '#', icon: '📘' }
                                        ].map((link) => (
                                            <motion.a
                                                key={link.name}
                                                href={link.url}
                                                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-xl hover:border-primary/50 transition-all"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {link.icon}
                                            </motion.a>
                                        ))}
                                    </div>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 gradient-primary"
                                    >
                                        Download Full Brochure 📄
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
