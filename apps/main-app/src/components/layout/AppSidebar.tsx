'use client'

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    FilePlus,
    Settings,
    User,
    ChevronDown,
    Filter,
    Clock,
    CheckCircle,
    Shield,
    BarChart,
    FolderOpen,
    Search,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/AuthProvider"

// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)"

/* ----------------------------- Brand / Logos ----------------------------- */

function InterfacesLogoSquare() {
    return (
        <div className="aspect-square grow min-h-px min-w-px overflow-hidden relative shrink-0 flex items-center justify-center">
            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center font-black text-black text-xs">
                OM
            </div>
        </div>
    )
}

function BrandBadge() {
    return (
        <div className="relative shrink-0 w-full mb-4">
            <div className="flex items-center p-1 w-full gap-2">
                <div className="h-10 w-8 flex items-center justify-center">
                    <InterfacesLogoSquare />
                </div>
                <div className="flex flex-col">
                    <div className="font-[sans-serif] text-[14px] font-bold text-neutral-50 tracking-tight">
                        NERO27
                    </div>
                    <div className="font-[sans-serif] text-[10px] text-neutral-400 uppercase tracking-widest">
                        Centro de Comando
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarDisplay() {
    const { user } = useAuth()
    return (
        <div className="w-full h-full flex items-center justify-center bg-primary text-black font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
    )
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
    const [searchValue, setSearchValue] = useState("")

    return (
        <div
            className={`relative shrink-0 transition-all duration-500 mb-4 ${isCollapsed ? "w-full flex justify-center" : "w-full"
                }`}
            style={{ transitionTimingFunction: softSpringEasing }}
        >
            <div
                className={`bg-white/5 h-10 relative rounded-lg flex items-center transition-all duration-500 border border-white/10 ${isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
                    }`}
                style={{ transitionTimingFunction: softSpringEasing }}
            >
                <div
                    className={`flex items-center justify-center shrink-0 transition-all duration-500 ${isCollapsed ? "p-1" : "px-1"
                        }`}
                    style={{ transitionTimingFunction: softSpringEasing }}
                >
                    <div className="size-8 flex items-center justify-center">
                        <Search size={16} className="text-neutral-400" />
                    </div>
                </div>

                <div
                    className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                        }`}
                    style={{ transitionTimingFunction: softSpringEasing }}
                >
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[14px] text-neutral-50 placeholder:text-neutral-500 px-2 h-full focus:ring-0"
                        tabIndex={isCollapsed ? -1 : 0}
                    />
                </div>
            </div>
        </div>
    )
}

/* --------------------------- Types / Content Map -------------------------- */

interface MenuItemT {
    icon?: React.ReactNode
    label: string
    hasDropdown?: boolean
    isActive?: boolean
    children?: MenuItemT[]
    path?: string
}
interface MenuSectionT {
    title: string
    items: MenuItemT[]
}
interface SidebarContent {
    title: string
    sections: MenuSectionT[]
}

function getSidebarContent(activeSection: string): SidebarContent {
    const contentMap: Record<string, SidebarContent> = {
        dashboard: {
            title: "Painel Geral",
            sections: [
                {
                    title: "Visão Geral",
                    items: [
                        { icon: <LayoutDashboard size={16} className="text-neutral-50" />, label: "Dashboard Principal", path: "/dashboard" },
                        { icon: <BarChart3 size={16} className="text-neutral-50" />, label: "Status do Sistema", path: "/status" },
                    ],
                },
                {
                    title: "Métricas",
                    items: [
                        { icon: <BarChart size={16} className="text-neutral-50" />, label: "Desempenho", path: "/reports" },
                    ]
                }
            ],
        },

        approvals: {
            title: "Aprovações",
            sections: [
                {
                    title: "Ações Rápidas",
                    items: [
                        { icon: <Filter size={16} className="text-neutral-50" />, label: "Filtrar Pendentes", path: "/approvals?filter=pending" },
                    ],
                },
                {
                    title: "Minhas Listas",
                    items: [
                        {
                            icon: <Clock size={16} className="text-neutral-50" />,
                            label: "Em Andamento",
                            hasDropdown: true,
                            children: [
                                { icon: <CheckSquare size={14} className="text-neutral-300" />, label: "Mídia OOH", path: "/approvals/ooh" },
                                { icon: <CheckSquare size={14} className="text-neutral-300" />, label: "Digital", path: "/approvals/digital" },
                            ],
                        },
                        {
                            icon: <CheckCircle size={16} className="text-neutral-50" />,
                            label: "Finalizados",
                            path: "/approvals/history"
                        },
                    ],
                },
            ],
        },

        reports: {
            title: "Relatórios",
            sections: [
                {
                    title: "Financeiro",
                    items: [
                        { icon: <FilePlus size={16} className="text-neutral-50" />, label: "Faturamento", path: "/reports/billing" },
                    ]
                },
                {
                    title: "Performance",
                    items: [
                        { icon: <BarChart3 size={16} className="text-neutral-50" />, label: "Mídia Performada", path: "/reports/perf" },
                    ]
                }
            ]
        },

        settings: {
            title: "Configurações",
            sections: [
                {
                    title: "Conta",
                    items: [
                        { icon: <User size={16} className="text-neutral-50" />, label: "Meu Perfil", path: "/settings/profile" },
                        { icon: <Shield size={16} className="text-neutral-50" />, label: "Segurança", path: "/settings/security" },
                    ],
                },
                {
                    title: "Workspace",
                    items: [
                        {
                            icon: <Settings size={16} className="text-neutral-50" />,
                            label: "Preferências",
                            path: "/settings"
                        },
                    ],
                },
            ],
        },
    }

    const defaultContent: SidebarContent = {
        title: "Menu",
        sections: []
    }

    return contentMap[activeSection] || defaultContent
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */

function IconNavButton({
    children,
    isActive = false,
    onClick,
    tooltip
}: {
    children: React.ReactNode
    isActive?: boolean
    onClick?: () => void
    tooltip?: string
}) {
    return (
        <button
            type="button"
            className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-colors duration-500 relative group
        ${isActive ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "hover:bg-white/5 text-neutral-400 hover:text-white"}`}
            style={{ transitionTimingFunction: softSpringEasing }}
            onClick={onClick}
            title={tooltip}
        >
            {children}
            {isActive && (
                <div className="absolute inset-0 rounded-lg ring-1 ring-white/20 pointer-events-none" />
            )}
        </button>
    )
}

function IconNavigation({
    activeSection,
    onSectionChange,
}: {
    activeSection: string
    onSectionChange: (section: string) => void
}) {
    const { logout } = useAuth()
    const navItems = [
        { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Painel" },
        { id: "approvals", icon: <CheckSquare size={20} />, label: "Aprovações" },
        { id: "reports", icon: <BarChart size={20} />, label: "Relatórios" },
        { id: "files", icon: <FolderOpen size={20} />, label: "Arquivos" },
    ]

    return (
        <aside className="bg-black/40 backdrop-blur-xl flex flex-col gap-3 items-center p-3 w-16 h-full border-r border-white/10 z-20">
            {/* Logo */}
            <div className="mb-4 mt-2 size-10 flex items-center justify-center">
                <Link href="/">
                    <InterfacesLogoSquare />
                </Link>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col gap-3 w-full items-center">
                {navItems.map((item) => (
                    <IconNavButton
                        key={item.id}
                        isActive={activeSection === item.id}
                        onClick={() => onSectionChange(item.id)}
                        tooltip={item.label}
                    >
                        {item.icon}
                    </IconNavButton>
                ))}
            </div>

            <div className="flex-1" />

            {/* Bottom section */}
            <div className="flex flex-col gap-3 w-full items-center mb-2">
                <IconNavButton isActive={activeSection === "settings"} onClick={() => onSectionChange("settings")} tooltip="Configurações">
                    <Settings size={20} />
                </IconNavButton>
                <IconNavButton onClick={logout} tooltip="Sair">
                    <LogOut size={20} className="text-red-400" />
                </IconNavButton>
                <div className="size-8 cursor-pointer hover:ring-2 ring-white/20 rounded-full transition-all flex items-center justify-center overflow-hidden bg-black border border-white/10">
                    <AvatarDisplay />
                </div>
            </div>
        </aside>
    )
}

/* ------------------------------ Right Sidebar ----------------------------- */

function SectionTitle({
    title,
    onToggleCollapse,
    isCollapsed,
}: {
    title: string
    onToggleCollapse: () => void
    isCollapsed: boolean
}) {
    if (isCollapsed) {
        return (
            <div className="w-full flex justify-center transition-all duration-500 mb-4" style={{ transitionTimingFunction: softSpringEasing }}>
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="flex items-center justify-center rounded-lg size-10 min-w-10 transition-all duration-500 hover:bg-white/10 text-neutral-400 hover:text-neutral-300"
                    style={{ transitionTimingFunction: softSpringEasing }}
                    aria-label="Expand sidebar"
                >
                    <span className="inline-block rotate-180">
                        <ChevronDown size={16} />
                    </span>
                </button>
            </div>
        )
    }

    return (
        <div className="w-full overflow-hidden transition-all duration-500 mb-4" style={{ transitionTimingFunction: softSpringEasing }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center h-10">
                    <div className="px-1 py-1">
                        <div className="text-[18px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-[27px] tracking-tight">
                            {title}
                        </div>
                    </div>
                </div>
                <div className="pr-1">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="flex items-center justify-center rounded-lg size-8 min-w-8 transition-all duration-500 hover:bg-white/10 text-neutral-400 hover:text-white"
                        style={{ transitionTimingFunction: softSpringEasing }}
                        aria-label="Collapse sidebar"
                    >
                        <ChevronDown size={16} className="-rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function DetailSidebar({ activeSection }: { activeSection: string }) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const [isCollapsed, setIsCollapsed] = useState(false)
    const content = getSidebarContent(activeSection)
    const router = useRouter()

    useEffect(() => {
        const saved = localStorage.getItem("sidebar_collapsed")
        setIsCollapsed(saved === "true")
    }, [])

    const toggleExpanded = (itemKey: string) => {
        setExpandedItems((prev) => {
            const next = new Set(prev)
            if (next.has(itemKey)) next.delete(itemKey)
            else next.add(itemKey)
            return next
        })
    }

    const toggleCollapse = () => {
        setIsCollapsed((s) => {
            const newState = !s
            localStorage.setItem("sidebar_collapsed", String(newState))
            return newState
        })
    }

    return (
        <aside
            className={`bg-black/30 backdrop-blur-md flex flex-col gap-0 items-start p-4 border-r border-white/5 transition-all duration-500 h-full ${isCollapsed ? "w-16 min-w-16 !px-0 justify-start items-center" : "w-64"
                }`}
            style={{ transitionTimingFunction: softSpringEasing }}
        >
            {!isCollapsed && <BrandBadge />}

            <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
            <SearchContainer isCollapsed={isCollapsed} />

            <div
                className={`flex flex-col w-full overflow-y-auto transition-all duration-500 custom-scrollbar ${isCollapsed ? "gap-2 items-center" : "gap-4 items-start"
                    }`}
                style={{ transitionTimingFunction: softSpringEasing }}
            >
                {content.sections.map((section, index) => (
                    <MenuSection
                        key={`${activeSection}-${index}`}
                        section={section}
                        expandedItems={expandedItems}
                        onToggleExpanded={toggleExpanded}
                        isCollapsed={isCollapsed}
                        onItemClick={(item) => {
                            if (item.path) router.push(item.path)
                        }}
                    />
                ))}
            </div>

        </aside>
    )
}

/* ------------------------------ Menu Elements ---------------------------- */

function MenuItem({
    item,
    isExpanded,
    onToggle,
    onItemClick,
    isCollapsed,
}: {
    item: MenuItemT
    isExpanded?: boolean
    onToggle?: () => void
    onItemClick?: () => void
    isCollapsed?: boolean
}) {
    const pathname = usePathname()
    const isPathActive = item.path ? pathname === item.path : false

    const handleClick = () => {
        if (item.hasDropdown && onToggle) onToggle()
        else onItemClick?.()
    }

    return (
        <div
            className={`relative shrink-0 transition-all duration-500 ${isCollapsed ? "w-full flex justify-center" : "w-full"
                }`}
            style={{ transitionTimingFunction: softSpringEasing }}
        >
            <div
                className={`rounded-lg cursor-pointer transition-all duration-300 flex items-center relative group ${isPathActive ? "bg-primary/20 text-white shadow-[0_0_10px_rgba(0,255,100,0.1)]" : "hover:bg-white/5 text-neutral-400 hover:text-white"
                    } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-0" : "w-full h-9 px-3 py-2"}`}
                style={{ transitionTimingFunction: softSpringEasing }}
                onClick={handleClick}
                title={isCollapsed ? item.label : undefined}
            >
                <div className={`flex items-center justify-center shrink-0 ${isPathActive ? "text-primary" : ""}`}>{item.icon}</div>

                <div
                    className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
                        }`}
                    style={{ transitionTimingFunction: softSpringEasing }}
                >
                    <div className={cn("text-[13px] leading-[20px] truncate", isPathActive ? "font-semibold" : "font-normal")}>
                        {item.label}
                    </div>
                </div>

                {item.hasDropdown && !isCollapsed && (
                    <div
                        className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ml-2`}
                        style={{ transitionTimingFunction: softSpringEasing }}
                    >
                        <ChevronDown
                            size={14}
                            className="text-neutral-500 transition-transform duration-500 group-hover:text-white"
                            style={{
                                transitionTimingFunction: softSpringEasing,
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        />
                    </div>
                )}

                {isCollapsed && isPathActive && (
                    <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
            </div>
        </div>
    )
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: (item: MenuItemT) => void }) {
    const pathname = usePathname()
    const isPathActive = item.path ? pathname === item.path : false

    return (
        <div className="w-full pl-9 pr-1 py-[1px]">
            <div
                className={cn(
                    "h-8 w-full rounded-md cursor-pointer transition-colors flex items-center px-3 py-1",
                    isPathActive ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-400 hover:text-white"
                )}
                onClick={() => onItemClick?.(item)}
            >
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] leading-[18px] truncate">
                        {item.label}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MenuSection({
    section,
    expandedItems,
    onToggleExpanded,
    isCollapsed,
    onItemClick
}: {
    section: MenuSectionT
    expandedItems: Set<string>
    onToggleExpanded: (itemKey: string) => void
    isCollapsed?: boolean
    onItemClick: (item: MenuItemT) => void
}) {
    return (
        <div className="flex flex-col w-full">
            <div
                className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${isCollapsed ? "h-0 opacity-0" : "h-8 opacity-100"
                    }`}
                style={{ transitionTimingFunction: softSpringEasing }}
            >
                <div className="flex items-center h-8 px-3">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                        {section.title}
                    </div>
                </div>
            </div>

            {section.items.map((item, index) => {
                const itemKey = `${section.title}-${index}`
                const isExpanded = expandedItems.has(itemKey)
                return (
                    <div key={itemKey} className="w-full flex flex-col mb-0.5">
                        <MenuItem
                            item={item}
                            isExpanded={isExpanded}
                            onToggle={() => onToggleExpanded(itemKey)}
                            onItemClick={() => onItemClick(item)}
                            isCollapsed={isCollapsed}
                        />
                        {isExpanded && item.children && !isCollapsed && (
                            <div className="flex flex-col gap-0.5 mb-1 relative before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                                {item.children.map((child, childIndex) => (
                                    <SubMenuItem
                                        key={`${itemKey}-${childIndex}`}
                                        item={child}
                                        onItemClick={onItemClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/* --------------------------------- Layout -------------------------------- */

export function AppSidebar({ className }: { className?: string }) {
    const [activeSection, setActiveSection] = useState("dashboard")

    return (
        <div className={cn("flex flex-row h-full font-sans", className)}>
            <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
            <DetailSidebar activeSection={activeSection} />
        </div>
    )
}
