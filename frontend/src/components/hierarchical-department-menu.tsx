import { useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

interface Department {
    id: string;
    name: string;
    code: string;
}

interface Trade {
    id: string;
    name: string;
    code: string;
    is_predefined: boolean;
    departments: Department[];
}

interface Program {
    id: string;
    name: string;
    code: string;
    is_predefined: boolean;
    trades: Trade[];
    direct_branches: Department[];
}

interface HierarchicalDepartmentMenuProps {
    hierarchy: Program[];
}

export function HierarchicalDepartmentMenu({ hierarchy }: HierarchicalDepartmentMenuProps) {
    const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
    const [hoveredTrade, setHoveredTrade] = useState<string | null>(null);
    const programTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tradeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleProgramMouseEnter = (programId: string) => {
        if (programTimeoutRef.current) {
            clearTimeout(programTimeoutRef.current);
        }
        setHoveredProgram(programId);
    };

    const handleProgramMouseLeave = () => {
        programTimeoutRef.current = setTimeout(() => {
            setHoveredProgram(null);
            setHoveredTrade(null);
        }, 200); // 200ms delay
    };

    const handleTradeMouseEnter = (tradeId: string) => {
        if (tradeTimeoutRef.current) {
            clearTimeout(tradeTimeoutRef.current);
        }
        setHoveredTrade(tradeId);
    };

    const handleTradeMouseLeave = () => {
        tradeTimeoutRef.current = setTimeout(() => {
            setHoveredTrade(null);
        }, 200); // 200ms delay
    };

    return (
        <div className="relative">
            {/* Programs - First level menu positioned to the left */}
            <div className="w-56 p-3 bg-popover border border-border shadow-lg rounded-xl">
                <div className="space-y-1">
                    {hierarchy.map((program) => (
                        <div
                            key={program.id}
                            className="relative"
                            onMouseEnter={() => handleProgramMouseEnter(program.id)}
                            onMouseLeave={handleProgramMouseLeave}
                        >
                            {/* Program Level */}
                            <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer">
                                <span className="font-medium">{program.name}</span>
                                {(program.trades.length > 0 || program.direct_branches.length > 0) && (
                                    <ChevronRight className="h-4 w-4 transform rotate-180" />
                                )}
                            </div>

                            {/* Trade/Branch Level - Opens to the left */}
                            {
                                hoveredProgram === program.id && (program.trades.length > 0 || program.direct_branches.length > 0) && (
                                    <div className="absolute right-full top-0 mr-1 w-64 p-3 bg-popover border border-border shadow-lg rounded-xl z-50">
                                        <div className="space-y-1">
                                            {/* Trades with departments */}
                                            {program.trades.map((trade) => (
                                                <div
                                                    key={trade.id}
                                                    className="relative"
                                                    onMouseEnter={() => handleTradeMouseEnter(trade.id)}
                                                    onMouseLeave={handleTradeMouseLeave}
                                                >
                                                    <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-accent/50 rounded-md transition-colors cursor-pointer">
                                                        <span>{trade.name}</span>
                                                        {trade.departments.length > 0 && (
                                                            <ChevronRight className="h-3 w-3 transform rotate-180" />
                                                        )}
                                                    </div>

                                                    {/* Department Level - Opens to the left */}
                                                    {hoveredTrade === trade.id && trade.departments.length > 0 && (
                                                        <div className="absolute right-full top-0 mr-1 w-72 p-3 bg-popover border border-border shadow-lg rounded-xl z-50 max-h-96 overflow-y-auto scrollbar-thin">
                                                            <div className="space-y-1">
                                                                {trade.departments.map((dept) => (
                                                                    <NavigationMenuLink
                                                                        key={dept.id}
                                                                        href={`/departments/${dept.code.toLowerCase()}`}
                                                                        className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                                                                    >
                                                                        {dept.name}
                                                                    </NavigationMenuLink>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Direct branches (no trade) */}
                                            {program.direct_branches.length > 0 && (
                                                <>
                                                    {program.trades.length > 0 && (
                                                        <div className="border-t border-border my-2"></div>
                                                    )}
                                                    <div className="space-y-1">
                                                        {program.direct_branches.map((dept) => (
                                                            <NavigationMenuLink
                                                                key={dept.id}
                                                                href={`/departments/${dept.code.toLowerCase()}`}
                                                                className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                                                            >
                                                                {dept.name}
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        </div >
                    ))
                    }
                </div >
            </div >
        </div >
    );
}
