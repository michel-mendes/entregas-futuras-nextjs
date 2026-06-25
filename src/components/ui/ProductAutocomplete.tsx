'use client';

import { useState, useEffect, useRef } from 'react';
import { IProduto } from '@/modules/produto/produto.types';
import { produtosApi } from '@/modules/produto/produto.api';

interface ProductAutocompleteProps {
    onSelect: (produto: IProduto) => void;
    error?: string;
}

export function ProductAutocomplete({ onSelect, error }: ProductAutocompleteProps) {
    const [termo, setTermo] = useState('');
    const [resultados, setResultados] = useState<IProduto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Busca com Debounce (500ms)
    useEffect(() => {
        if (termo.length < 3) {
            setResultados([]);
            setIsOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                // Utilizando a API que você forneceu
                const response = await produtosApi.listar({
                    page: 1,
                    limit: 10,
                    apenasAtivos: true,
                    termoBusca: termo
                });
                setResultados(response.data);
                setIsOpen(true);
            } catch (err) {
                console.error("Erro ao buscar produtos", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [termo]);

    const handleSelect = (produto: IProduto) => {
        onSelect(produto);
        setTermo('');
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                    placeholder="Busque por código SKU ou descrição (min. 3 letras)..."
                    className={`w-full bg-surface border rounded-xl px-3.5 py-2 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-400 focus:ring-red-200' : 'border-border focus:ring-brand/20'
                        }`}
                />
                {loading && (
                    <div className="absolute right-3 top-2.5">
                        <svg className="w-4 h-4 animate-spin text-tertiary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                )}
            </div>

            {error && <span className="text-xs text-red-600 font-medium mt-1 block">{error}</span>}

            {isOpen && resultados.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-thin">
                    {resultados.map((prod) => (
                        <li
                            key={prod.id}
                            onClick={() => handleSelect(prod)}
                            className="px-4 py-2 hover:bg-subtle cursor-pointer border-b border-border-subtle last:border-0 flex justify-between items-center"
                        >
                            <div>
                                <p className="text-sm font-medium text-primary">{prod.descricao}</p>
                                <p className="text-xs text-tertiary">SKU: {prod.codigoSKU}</p>
                            </div>
                            <button className="text-xs font-semibold text-brand bg-brand-muted px-2 py-1 rounded-md">
                                Adicionar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {isOpen && termo.length >= 3 && !loading && resultados.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg p-4 text-center text-sm text-tertiary">
                    Nenhum produto encontrado.
                </div>
            )}
        </div>
    );
}