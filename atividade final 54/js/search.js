// search.js - Sistema de busca avançada para a Bíblia (VERSÃO CORRIGIDA)
class BibleSearch {
    constructor() {
        this.verses = this.loadBibleData();
        this.books = this.loadBooksData();
        this.characters = this.loadCharactersData();
        this.themes = this.loadThemesData();
        this.init();
    }

    init() {
        // Verificar se já existe uma busca para não duplicar
        if (document.getElementById('bible-search-advanced')) {
            return;
        }
        this.setupSearchInterface();
        this.setupSearchHandlers();
    }

    // ... (mantenha os métodos loadBibleData, loadBooksData, etc. iguais)

    setupSearchInterface() {
        // Substituir a busca existente pela avançada
        const existingSearch = document.getElementById('site-search');
        if (existingSearch) {
            existingSearch.innerHTML = this.getSearchHTML();
            this.injectSearchCSS();
        }
    }

    getSearchHTML() {
        return `
            <div class="search-wrapper position-relative">
                <div class="input-group input-group-sm">
                    <input type="text" id="bible-search" class="form-control" 
                           placeholder="Buscar versículos, livros, temas..." 
                           aria-label="Busca bíblica">
                    <button class="btn btn-outline-light" type="button" id="search-options-btn">
                        <i class="fas fa-sliders-h"></i>
                    </button>
                </div>
                
                <div id="search-options" class="search-options-card card position-absolute mt-1 d-none">
                    <div class="card-body p-3">
                        <div class="option-group mb-3">
                            <label class="form-label small fw-bold">Buscar em:</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="opt-verses" checked>
                                <label class="form-check-label small" for="opt-verses">Versículos</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="opt-books" checked>
                                <label class="form-check-label small" for="opt-books">Livros</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="opt-characters" checked>
                                <label class="form-check-label small" for="opt-characters">Personagens</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="opt-themes" checked>
                                <label class="form-check-label small" for="opt-themes">Temas</label>
                            </div>
                        </div>
                        <div class="option-group">
                            <label class="form-label small fw-bold">Testamento:</label>
                            <select id="testament-filter" class="form-select form-select-sm">
                                <option value="all">Todos</option>
                                <option value="AT">Antigo Testamento</option>
                                <option value="NT">Novo Testamento</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="search-results" class="search-results-container position-absolute mt-1 w-100 d-none"></div>
            </div>
        `;
    }

    injectSearchCSS() {
        if (document.getElementById('search-css')) return;

        const css = `
            <style id="search-css">
            .search-wrapper {
                position: relative;
                min-width: 250px;
            }
            
            .search-options-card {
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 0.375rem;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 280px;
            }
            
            .search-results-container {
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 0.375rem;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                max-height: 400px;
                overflow-y: auto;
                z-index: 1000;
            }
            
            .search-result-item {
                padding: 0.75rem;
                border-bottom: 1px solid #f8f9fa;
                cursor: pointer;
                transition: background-color 0.15s ease;
            }
            
            .search-result-item:hover {
                background-color: #f8f9fa;
            }
            
            .search-result-item:last-child {
                border-bottom: none;
            }
            
            .verse-reference {
                display: flex;
                justify-content: between;
                align-items: center;
                margin-bottom: 0.25rem;
            }
            
            .version-badge {
                background: #6c757d;
                color: white;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                margin-left: auto;
            }
            
            .testament-badge {
                background: #198754;
                color: white;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                margin-left: auto;
            }
            
            .role-badge {
                background: #0d6efd;
                color: white;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                margin-left: auto;
            }
            
            .verse-text {
                font-size: 0.875rem;
                color: #495057;
                line-height: 1.4;
            }
            
            .book-info, .character-books, .theme-verses {
                font-size: 0.75rem;
                color: #6c757d;
            }
            
            .search-highlight {
                background-color: #fff3cd;
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
            }
            
            .results-section {
                border-bottom: 1px solid #dee2e6;
                padding: 0.75rem;
            }
            
            .results-section:last-child {
                border-bottom: none;
            }
            
            .results-section h6 {
                color: #495057;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
                font-weight: 600;
            }
            
            .search-results-header {
                padding: 0.75rem;
                border-bottom: 1px solid #dee2e6;
                background: #f8f9fa;
            }
            
            .search-no-results {
                padding: 1.5rem;
                text-align: center;
                color: #6c757d;
            }
            
            .quick-filters {
                padding: 0.75rem;
                border-bottom: 1px solid #dee2e6;
                background: #f8f9fa;
            }
            
            .quick-filters-title {
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #495057;
            }
            
            .quick-filters-buttons {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .quick-filter-btn {
                font-size: 0.75rem;
                padding: 0.25rem 0.5rem;
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', css);
    }

    setupSearchHandlers() {
        const searchInput = document.getElementById('bible-search');
        const optionsBtn = document.getElementById('search-options-btn');
        const optionsPanel = document.getElementById('search-options');
        const resultsContainer = document.getElementById('search-results');

        if (!searchInput) return;

        // Busca com debounce
        const searchHandler = this.debounce((query) => {
            this.performSearch(query);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.trim()) {
                resultsContainer.classList.remove('d-none');
                searchHandler(query);
            } else {
                resultsContainer.classList.add('d-none');
                this.clearResults();
            }
        });

        // Toggle options panel
        optionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            optionsPanel.classList.toggle('d-none');
        });

        // Fechar panels ao clicar fora
        document.addEventListener('click', () => {
            optionsPanel.classList.add('d-none');
            resultsContainer.classList.add('d-none');
        });

        // Prevenir fechamento ao clicar dentro
        optionsPanel.addEventListener('click', (e) => e.stopPropagation());
        resultsContainer.addEventListener('click', (e) => e.stopPropagation());

        // Foco no input quando results estão visíveis
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim()) {
                resultsContainer.classList.remove('d-none');
            }
        });
    }

    // ... (mantenha os outros métodos performSearch, searchVerses, etc.)

    displayResults(results, query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

        if (totalResults === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <p class="mb-1">Nenhum resultado encontrado para "<strong>${query}</strong>"</p>
                    <small class="text-muted">Tente outros termos ou verifique a ortografia</small>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = `
            <div class="search-results-header">
                <h6 class="mb-1">Resultados para "${query}"</h6>
                <small class="text-muted">${totalResults} resultado(s) encontrado(s)</small>
            </div>
            
            ${results.verses.length > 0 ? `
                <div class="results-section">
                    <h6>📖 Versículos (${results.verses.length})</h6>
                    ${results.verses.map(verse => `
                        <div class="search-result-item" data-type="verse" data-book="${verse.book}" data-chapter="${verse.chapter}" data-verse="${verse.verse}">
                            <div class="verse-reference">
                                <strong>${verse.book} ${verse.chapter}:${verse.verse}</strong>
                                <span class="version-badge">${verse.version}</span>
                            </div>
                            <div class="verse-text">${this.highlightText(verse.text, query)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${results.books.length > 0 ? `
                <div class="results-section">
                    <h6>📚 Livros (${results.books.length})</h6>
                    ${results.books.map(book => `
                        <div class="search-result-item" data-type="book" data-book="${book.name}">
                            <div class="book-name">
                                <strong>${this.highlightText(book.name, query)}</strong>
                                <span class="testament-badge">${book.testament}</span>
                            </div>
                            <div class="book-info">
                                ${book.chapters} capítulos • ${book.theme}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${results.characters.length > 0 ? `
                <div class="results-section">
                    <h6>👤 Personagens (${results.characters.length})</h6>
                    ${results.characters.map(character => `
                        <div class="search-result-item" data-type="character" data-character="${character.name}">
                            <div class="character-name">
                                <strong>${this.highlightText(character.name, query)}</strong>
                                <span class="role-badge">${character.role}</span>
                            </div>
                            <div class="character-books">
                                Livros: ${character.books.join(', ')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${results.themes.length > 0 ? `
                <div class="results-section">
                    <h6>🎯 Temas (${results.themes.length})</h6>
                    ${results.themes.map(theme => `
                        <div class="search-result-item" data-type="theme" data-theme="${theme.theme}">
                            <div class="theme-name">
                                <strong>${this.highlightText(theme.theme, query)}</strong>
                            </div>
                            <div class="theme-verses">
                                Versículos: ${theme.verses.join(', ')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        // Adicionar event listeners aos resultados
        this.setupResultInteractions();
    }

    setupResultInteractions() {
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                this.handleResultClick(item, type);
            });
        });
    }

    handleResultClick(item, type) {
        // Fechar resultados
        document.getElementById('search-results').classList.add('d-none');
        
        // Limpar busca
        document.getElementById('bible-search').value = '';
        
        // Mostrar feedback
        let message = '';
        switch(type) {
            case 'verse':
                const reference = item.querySelector('.verse-reference strong').textContent;
                message = `Versículo: ${reference}`;
                break;
            case 'book':
                const bookName = item.querySelector('.book-name strong').textContent;
                message = `Livro: ${bookName}`;
                break;
            case 'character':
                const charName = item.querySelector('.character-name strong').textContent;
                message = `Personagem: ${charName}`;
                break;
            case 'theme':
                const themeName = item.querySelector('.theme-name strong').textContent;
                message = `Tema: ${themeName}`;
                break;
        }
        
        // Usar o sistema de toast existente se disponível
        if (window.bibleApp && window.bibleApp.showToast) {
            window.bibleApp.showToast(message, 'info');
        } else {
            alert(message); // Fallback simples
        }
    }

    // ... (mantenha os outros métodos debounce, highlightText, etc.)
}

// Inicialização corrigida
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que o DOM esteja completamente pronto
    setTimeout(() => {
        if (document.getElementById('site-search')) {
            window.bibleSearch = new BibleSearch();
            console.log('Sistema de busca bíblica inicializado!');
        }
    }, 100);
});