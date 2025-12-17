import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Target,
    Briefcase,
    TrendingUp,
    Award,
    Building2
} from "lucide-react";

export default function PlacementDepartment() {
    const heroRef = useRef(null);
    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

    const services = [
        {
            icon: Target,
            title: "Career Counseling",
            description: "Personalized guidance to help students identify their career goals and chart their professional path."
        },
        {
            icon: Briefcase,
            title: "Industry Connections",
            description: "Strong partnerships with leading companies across various sectors for placement opportunities."
        },
        {
            icon: Users,
            title: "Skill Development",
            description: "Comprehensive training programs to enhance technical and soft skills for industry readiness."
        },
        {
            icon: TrendingUp,
            title: "Interview Preparation",
            description: "Mock interviews, resume building, and aptitude training to ensure placement success."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-primary/20 to-primary/10 py-16 md:py-20">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Training & Placement Cell
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Empowering students with industry-ready skills and connecting them with top recruiters
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* About Section */}
                <section ref={heroRef} className="py-16 md:py-24">
                    <div className="container px-4">
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="text-center mb-12">
                                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                                    About Us
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                                    Bridging Academia and
                                    <span className="gradient-text block">Industry Excellence</span>
                                </h2>
                            </div>

                            <Card className="mb-12">
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                        The Training & Placement Cell at Nalanda Institute of Technology serves as a vital link between
                                        students and the corporate world. Our dedicated team works tirelessly to ensure that every student
                                        is equipped with the necessary skills, knowledge, and opportunities to launch a successful career.
                                    </p>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        We collaborate with leading companies across various sectors to provide our students with diverse
                                        placement opportunities, internships, and industry exposure. Our comprehensive training programs
                                        focus on both technical excellence and soft skills development.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Services Grid */}
                            <div className="grid md:grid-cols-2 gap-6 mb-12">
                                {services.map((service, index) => (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <service.icon className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <CardTitle className="text-lg">{service.title}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground">{service.description}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Users, label: 'Students Trained', value: '2000+' },
                                    { icon: Building2, label: 'Partner Companies', value: '150+' },
                                    { icon: Award, label: 'Placement Rate', value: '95%' },
                                    { icon: Briefcase, label: 'Internships', value: '500+' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="glass-card rounded-xl p-4 text-center"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                    >
                                        <stat.icon className="h-8 w-8 text-primary mb-2 mx-auto" />
                                        <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-16 bg-card/50">
                    <div className="container px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">Partner With Us</h2>
                            <p className="text-muted-foreground mb-8">
                                Interested in recruiting our talented students? Get in touch with our placement team.
                            </p>
                            <a
                                href="/contact"
                                className="inline-block px-8 py-4 rounded-full font-semibold text-primary-foreground gradient-primary hover:scale-105 transition-transform"
                            >
                                Contact Placement Cell
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
