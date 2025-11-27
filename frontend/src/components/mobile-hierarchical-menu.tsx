import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Department {
    id: string;
    name: string;
    code: string;
}

interface Trade {
    id: string;
    name: string;
    departments: Department[];
}

interface Program {
    id: string;
    name: string;
    trades: Trade[];
    direct_branches: Department[];
}

interface MobileHierarchicalMenuProps {
    hierarchy: Program[];
}

export function MobileHierarchicalMenu({ hierarchy }: MobileHierarchicalMenuProps) {
    const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
    const [expandedTrade, setExpandedTrade] = useState<string | null>(null);

    const toggleProgram = (programId: string) => {
        setExpandedProgram(expandedProgram === programId ? null : programId);
        setExpandedTrade(null);
    };

    const toggleTrade = (tradeId: string) => {
        setExpandedTrade(expandedTrade === tradeId ? null : tradeId);
    };

    return (
        <div className="space-y-1">
            {hierarchy.map((program) => (
                <div key={program.id}>
                    {/* Program Level */}
                    <button
                        onClick={() => toggleProgram(program.id)}
                        className="w-full flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <span className="font-medium">{program.name}</span>
                        <ChevronRight className={`h-3 w-3 transition-transform ${expandedProgram === program.id ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Trades and Direct Branches */}
                    {expandedProgram === program.id && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 space-y-1"
                        >
                            {/* Trades with Departments */}
                            {program.trades.map((trade) => (
                                <div key={trade.id}>
                                    <button
                                        onClick={() => toggleTrade(trade.id)}
                                        className="w-full flex items-center justify-between py-1 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        <span>{trade.name}</span>
                                        <ChevronRight className={`h-3 w-3 transition-transform ${expandedTrade === trade.id ? 'rotate-90' : ''}`} />
                                    </button>

                                    {/* Departments under Trade */}
                                    {expandedTrade === trade.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="ml-4 space-y-1"
                                        >
                                            {trade.departments.map((dept) => (
                                                <a
                                                    key={dept.id}
                                                    href={`/departments/${dept.code.toLowerCase()}`}
                                                    className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    {dept.name}
                                                </a>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ))}

                            {/* Direct Branches (departments without trade) */}
                            {program.direct_branches.length > 0 && (
                                <div className="space-y-1 mt-1">
                                    {program.direct_branches.map((dept) => (
                                        <a
                                            key={dept.id}
                                            href={`/departments/${dept.code.toLowerCase()}`}
                                            className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            {dept.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            ))}
        </div>
    );
}
