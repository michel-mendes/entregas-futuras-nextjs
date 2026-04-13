import { Bell, Search, ChevronDown, Store } from 'lucide-react';

export function TopBar() {
    return (
        <header className="h-12 bg-surface border-b border-border-subtle shadow-sm flex items-center justify-between px-6 gap-4 shrink-0 z-40 relative">
            <div className="flex-1 min-w-0" id="topbar-breadcrumb" />

            {/* Campo pesquisa de múltiplos módulos **EM DESENVOLVIMENTO** */}
            {/* <div className="flex items-center gap-2 bg-canvas border border-border rounded-sm py-1 px-3 w-[280px] shrink-0 transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-muted">
                <Search size={14} className="text-tertiary shrink-0" />
                <input
                    type="search"
                    placeholder="SKU, Lote, Romaneio…"
                    className="border-none bg-transparent outline-none text-sm text-primary w-full font-sans placeholder:text-disabled"
                />
            </div> */}

            <div className="flex items-center gap-2 shrink-0">
                
                {/* Campo seletor de unidade (matriz / filiais) **EM DESENVOLVIMENTO** */}
                {/* <button className="flex items-center gap-1 bg-canvas border border-border rounded-sm py-1 px-2 text-xs font-medium text-secondary hover:bg-subtle transition-colors">
                    <Store size={14} className="text-brand shrink-0" />
                    <span className="max-w-[100px] truncate">Matriz</span>
                    <ChevronDown size={12} className="text-tertiary" />
                </button> */}

                <div className="w-px h-5 bg-border-subtle" />
                <button className="flex items-center justify-center w-8 h-8 rounded-sm text-secondary hover:bg-subtle hover:text-primary transition-colors">
                    <Bell size={16} />
                </button>
                <div className="w-px h-5 bg-border-subtle" />
                <button className="flex items-center gap-2 py-1 px-2 rounded-sm hover:bg-subtle transition-colors">
                    <div className="w-7 h-7 rounded-sm bg-brand-muted border border-brand-border flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand leading-none">UT</span>
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-semibold text-primary leading-tight truncate">Usuário Teste</p>
                        <p className="text-[10px] text-tertiary leading-tight truncate">Administrador</p>
                    </div>
                    <ChevronDown size={12} className="text-tertiary shrink-0" />
                </button>
            </div>
        </header>
    );
}